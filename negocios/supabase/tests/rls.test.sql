-- Pruebas de permisos y reglas del negocio. Todo corre en una transacción que
-- se deshace al final, así que se puede correr contra una base de desarrollo.
-- Cada bloque falla con "FALLÓ: ..." si una regla no se cumple.

\set ON_ERROR_STOP on
begin;

-- Personas de prueba: A es dueña, B será vendedor, C no pertenece al negocio.
insert into auth.users (id, email) values
  ('00000000-0000-4000-8000-00000000000a', 'duena@prueba.co'),
  ('00000000-0000-4000-8000-00000000000b', 'vendedor@prueba.co'),
  ('00000000-0000-4000-8000-00000000000c', 'otro@prueba.co');

-- A crea su negocio --------------------------------------------------------------
set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-00000000000a"}', true);

with nuevo as (
  insert into public.businesses (name) values ('Tienda de prueba') returning id
)
select set_config('prueba.negocio', id::text, true) from nuevo;

do $$
begin
  if public.role_in(current_setting('prueba.negocio')::uuid) is distinct from 'owner' then
    raise exception 'FALLÓ: quien crea el negocio no quedó como dueño';
  end if;
end;
$$;

-- Productos con inventario inicial
with p as (
  insert into public.products (business_id, name, unit, price, cost, min_stock)
  values (current_setting('prueba.negocio')::uuid, 'Gaseosa 400 ml', 'unit', 2500, 1600, 12)
  returning id
)
select set_config('prueba.gaseosa', id::text, true) from p;

with p as (
  insert into public.products (business_id, name, unit, price, cost)
  values (current_setting('prueba.negocio')::uuid, 'Queso campesino', 'kg', 22000, 16000)
  returning id
)
select set_config('prueba.queso', id::text, true) from p;

insert into public.stock_movements (business_id, product_id, quantity, reason)
values
  (current_setting('prueba.negocio')::uuid, current_setting('prueba.gaseosa')::uuid, 24, 'initial'),
  (current_setting('prueba.negocio')::uuid, current_setting('prueba.queso')::uuid, 2.5, 'initial');

do $$
begin
  if (select stock from public.products where id = current_setting('prueba.gaseosa')::uuid) <> 24 then
    raise exception 'FALLÓ: el movimiento inicial no sumó al stock';
  end if;
end;
$$;

-- Nadie escribe el stock a mano, ni siquiera la dueña
do $$
begin
  begin
    update public.products set stock = 999 where id = current_setting('prueba.gaseosa')::uuid;
    raise exception 'FALLÓ: se pudo escribir el stock directamente';
  exception when insufficient_privilege then null;
  end;
end;
$$;

-- Cliente para fiar y vendedor en el equipo
with c as (
  insert into public.contacts (business_id, kind, name, phone)
  values (current_setting('prueba.negocio')::uuid, 'customer', 'Pedro Pérez', '3001234567')
  returning id
)
select set_config('prueba.cliente', id::text, true) from c;

insert into public.memberships (business_id, user_id, role)
values (current_setting('prueba.negocio')::uuid, '00000000-0000-4000-8000-00000000000b', 'seller');

-- La dueña no puede crear otro dueño ni quitarse a sí misma
do $$
begin
  begin
    insert into public.memberships (business_id, user_id, role)
    values (current_setting('prueba.negocio')::uuid, '00000000-0000-4000-8000-00000000000c', 'owner');
    raise exception 'FALLÓ: se creó un segundo dueño desde la app';
  exception when insufficient_privilege then null;
  end;

  delete from public.memberships
  where business_id = current_setting('prueba.negocio')::uuid and role = 'owner';
  if public.role_in(current_setting('prueba.negocio')::uuid) is distinct from 'owner' then
    raise exception 'FALLÓ: se borró la membresía del dueño';
  end if;
end;
$$;

-- B, vendedor, registra ventas --------------------------------------------------
select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-00000000000b"}', true);

select set_config('prueba.venta', public.create_sale(
  current_setting('prueba.negocio')::uuid,
  jsonb_build_array(
    jsonb_build_object('product_id', current_setting('prueba.gaseosa'), 'quantity', 3),
    jsonb_build_object('product_id', current_setting('prueba.queso'), 'quantity', 0.375),
    jsonb_build_object('description', 'Bolsa de hielo', 'quantity', 1, 'unit_price', 1000)
  ),
  'cash', null, false, 500
)::text, true);

do $$
declare
  v_sale public.sales%rowtype;
begin
  select * into v_sale from public.sales where id = current_setting('prueba.venta')::uuid;
  -- 3 x 2.500 + 0,375 x 22.000 + 1.000 = 16.750; menos 500 de descuento
  if v_sale.subtotal <> 16750 or v_sale.total <> 16250 or v_sale.status <> 'paid' then
    raise exception 'FALLÓ: totales de la venta % / %', v_sale.subtotal, v_sale.total;
  end if;
  if (select stock from public.products where id = current_setting('prueba.gaseosa')::uuid) <> 21 then
    raise exception 'FALLÓ: la venta no descontó las gaseosas';
  end if;
  if (select stock from public.products where id = current_setting('prueba.queso')::uuid) <> 2.125 then
    raise exception 'FALLÓ: la venta no descontó el queso por peso';
  end if;
  if (select sum(unit_cost * quantity) from public.sale_items where sale_id = v_sale.id) <> 10800 then
    raise exception 'FALLÓ: el costo copiado en la venta no cuadra';
  end if;
end;
$$;

-- Venta fiada: crea la deuda; los abonos bajan el saldo y no pueden pasarse
select set_config('prueba.fiada', public.create_sale(
  current_setting('prueba.negocio')::uuid,
  jsonb_build_array(jsonb_build_object('product_id', current_setting('prueba.gaseosa'), 'quantity', 4)),
  null, current_setting('prueba.cliente')::uuid, true
)::text, true);

do $$
declare
  v_debt public.debts%rowtype;
begin
  select * into v_debt from public.debts where sale_id = current_setting('prueba.fiada')::uuid;
  if v_debt.balance <> 10000 or v_debt.kind <> 'receivable' then
    raise exception 'FALLÓ: la venta fiada no creó la deuda correcta';
  end if;
  if (select status from public.sales where id = current_setting('prueba.fiada')::uuid) <> 'credit' then
    raise exception 'FALLÓ: la venta fiada no quedó como crédito';
  end if;

  insert into public.debt_payments (business_id, debt_id, amount)
  values (current_setting('prueba.negocio')::uuid, v_debt.id, 4000);
  if (select balance from public.debts where id = v_debt.id) <> 6000 then
    raise exception 'FALLÓ: el abono no bajó el saldo';
  end if;

  begin
    insert into public.debt_payments (business_id, debt_id, amount)
    values (current_setting('prueba.negocio')::uuid, v_debt.id, 7000);
    raise exception 'FALLÓ: se aceptó un abono mayor al saldo';
  exception when check_violation then null;
  end;
end;
$$;

-- Lo que el vendedor NO puede hacer
do $$
begin
  begin
    perform public.create_sale(
      current_setting('prueba.negocio')::uuid,
      jsonb_build_array(jsonb_build_object('product_id', current_setting('prueba.gaseosa'), 'quantity', 1)),
      null, null, true
    );
    raise exception 'FALLÓ: se fió sin cliente';
  exception when invalid_parameter_value then null;
  end;

  begin
    perform public.create_sale(
      current_setting('prueba.negocio')::uuid,
      jsonb_build_array(jsonb_build_object('product_id', current_setting('prueba.gaseosa'), 'quantity', 1.5))
    );
    raise exception 'FALLÓ: se vendió media gaseosa';
  exception when invalid_parameter_value then null;
  end;

  begin
    insert into public.products (business_id, name) values (current_setting('prueba.negocio')::uuid, 'Pirata');
    raise exception 'FALLÓ: el vendedor creó un producto';
  exception when insufficient_privilege then null;
  end;

  begin
    insert into public.stock_movements (business_id, product_id, quantity, reason)
    values (current_setting('prueba.negocio')::uuid, current_setting('prueba.gaseosa')::uuid, 100, 'adjustment');
    raise exception 'FALLÓ: el vendedor ajustó inventario';
  exception when insufficient_privilege then null;
  end;

  begin
    update public.sales set total = 1 where id = current_setting('prueba.venta')::uuid;
    raise exception 'FALLÓ: se editó una venta';
  exception when insufficient_privilege then null;
  end;

  update public.memberships set role = 'admin'
  where business_id = current_setting('prueba.negocio')::uuid
    and user_id = '00000000-0000-4000-8000-00000000000b';
  if public.role_in(current_setting('prueba.negocio')::uuid) <> 'seller' then
    raise exception 'FALLÓ: el vendedor se subió de rol';
  end if;
end;
$$;

-- Gastos: el vendedor ve solo los suyos; la dueña ve todos
insert into public.expenses (business_id, amount, category)
values (current_setting('prueba.negocio')::uuid, 8000, 'Transporte');

select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-00000000000a"}', true);
insert into public.expenses (business_id, amount, category)
values (current_setting('prueba.negocio')::uuid, 500000, 'Arriendo');

do $$
begin
  if (select count(*) from public.expenses) <> 2 then
    raise exception 'FALLÓ: la dueña no ve todos los gastos';
  end if;
end;
$$;

select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-00000000000b"}', true);
do $$
begin
  if (select count(*) from public.expenses) <> 1 then
    raise exception 'FALLÓ: el vendedor ve gastos de otros';
  end if;
end;
$$;

-- C, ajeno al negocio, no ve ni toca nada ------------------------------------------
select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-00000000000c"}', true);

do $$
begin
  if exists (select from public.sales) or exists (select from public.products)
     or exists (select from public.businesses) or exists (select from public.debts) then
    raise exception 'FALLÓ: un ajeno ve datos del negocio';
  end if;

  begin
    perform public.create_sale(
      current_setting('prueba.negocio')::uuid,
      jsonb_build_array(jsonb_build_object('description', 'x', 'quantity', 1, 'unit_price', 1))
    );
    raise exception 'FALLÓ: un ajeno registró una venta';
  exception when insufficient_privilege then null;
  end;
end;
$$;

-- C crea su propio negocio y no puede vender productos del negocio de A
with nuevo as (
  insert into public.businesses (name) values ('Negocio de C') returning id
)
select set_config('prueba.negocio_c', id::text, true) from nuevo;

do $$
begin
  begin
    perform public.create_sale(
      current_setting('prueba.negocio_c')::uuid,
      jsonb_build_array(jsonb_build_object('product_id', current_setting('prueba.gaseosa'), 'quantity', 1))
    );
    raise exception 'FALLÓ: se vendió un producto de otro negocio';
  exception when foreign_key_violation then null;
  end;
end;
$$;

-- La dueña puede borrar su negocio y se va todo con él
select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-00000000000a"}', true);
delete from public.businesses where id = current_setting('prueba.negocio')::uuid;

reset role;
do $$
begin
  if exists (select from public.sales where business_id = current_setting('prueba.negocio')::uuid)
     or exists (select from public.stock_movements where business_id = current_setting('prueba.negocio')::uuid) then
    raise exception 'FALLÓ: borrar el negocio dejó datos sueltos';
  end if;
end;
$$;

\echo 'Todas las pruebas de permisos pasaron.'
rollback;
