-- Esquema inicial: negocios, equipo, inventario, ventas, gastos y fiados.
--
-- Reglas que sostienen todo lo demás:
-- 1. Cada fila pertenece a un negocio (business_id) y la seguridad por fila
--    solo deja ver o tocar los negocios donde el usuario es miembro.
-- 2. Las llaves foráneas incluyen business_id, así una venta nunca puede
--    apuntar a un producto o cliente de otro negocio.
-- 3. El stock y el saldo de las deudas los mantienen triggers a partir de
--    movimientos y abonos; nadie los escribe a mano.
-- 4. Ventas, movimientos y abonos no se editan ni se borran (historial íntegro).

-- Tipos ----------------------------------------------------------------------

create type public.member_role as enum ('owner', 'admin', 'seller');
create type public.unit as enum ('unit', 'kg', 'g', 'l', 'ml');
create type public.payment_method as enum ('cash', 'card', 'transfer', 'other');
create type public.contact_kind as enum ('customer', 'supplier');
create type public.sale_status as enum ('paid', 'credit');
create type public.debt_kind as enum ('receivable', 'payable');
create type public.stock_reason as enum ('initial', 'sale', 'purchase', 'adjustment', 'return');

-- Negocios y equipo ------------------------------------------------------------

create table public.businesses (
  id uuid primary key default gen_random_uuid(),
  name text not null check (length(trim(name)) between 1 and 120),
  currency char(3) not null default 'COP',
  country char(2) not null default 'CO',
  time_zone text not null default 'America/Bogota',
  created_by uuid not null default auth.uid() references auth.users (id),
  created_at timestamptz not null default now()
);

create table public.memberships (
  business_id uuid not null references public.businesses (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  role public.member_role not null,
  created_at timestamptz not null default now(),
  primary key (business_id, user_id)
);

create index memberships_user_idx on public.memberships (user_id);

-- Estas funciones leen memberships sin pasar por su propia política,
-- lo que evita la recursión y mantiene las políticas cortas.
create function public.role_in(p_business_id uuid)
returns public.member_role
language sql stable security definer set search_path = ''
as $$
  select m.role from public.memberships m
  where m.business_id = p_business_id and m.user_id = auth.uid()
$$;

create function public.is_member(p_business_id uuid)
returns boolean
language sql stable security definer set search_path = ''
as $$ select public.role_in(p_business_id) is not null $$;

create function public.is_manager(p_business_id uuid)
returns boolean
language sql stable security definer set search_path = ''
as $$ select coalesce(public.role_in(p_business_id) in ('owner', 'admin'), false) $$;

-- Quien crea un negocio queda como dueño.
create function public.add_owner_membership()
returns trigger
language plpgsql security definer set search_path = ''
as $$
begin
  insert into public.memberships (business_id, user_id, role)
  values (new.id, new.created_by, 'owner');
  return new;
end;
$$;

create trigger businesses_add_owner
after insert on public.businesses
for each row execute function public.add_owner_membership();

-- Contactos ----------------------------------------------------------------------

create table public.contacts (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses (id) on delete cascade,
  kind public.contact_kind not null,
  name text not null check (length(trim(name)) between 1 and 120),
  phone text,
  note text,
  created_at timestamptz not null default now(),
  unique (business_id, id)
);

create index contacts_business_idx on public.contacts (business_id, kind, name);

-- Inventario ---------------------------------------------------------------------

create table public.products (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses (id) on delete cascade,
  name text not null check (length(trim(name)) between 1 and 120),
  sku text,
  unit public.unit not null default 'unit',
  price numeric(14, 2) not null default 0 check (price >= 0),
  cost numeric(14, 2) not null default 0 check (cost >= 0),
  stock numeric(14, 3) not null default 0,
  min_stock numeric(14, 3) not null default 0 check (min_stock >= 0),
  archived boolean not null default false,
  created_at timestamptz not null default now(),
  unique (business_id, id),
  unique (business_id, sku)
);

create index products_business_idx on public.products (business_id, archived, name);

-- Ventas -------------------------------------------------------------------------

create table public.sales (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses (id) on delete cascade,
  sold_at timestamptz not null default now(),
  status public.sale_status not null default 'paid',
  payment_method public.payment_method,
  customer_id uuid,
  subtotal numeric(14, 2) not null check (subtotal >= 0),
  discount numeric(14, 2) not null default 0 check (discount >= 0),
  total numeric(14, 2) not null check (total >= 0),
  note text,
  created_by uuid not null default auth.uid() references auth.users (id),
  created_at timestamptz not null default now(),
  unique (business_id, id),
  foreign key (business_id, customer_id) references public.contacts (business_id, id),
  check (discount <= subtotal),
  check (total = subtotal - discount),
  check ((status = 'paid') = (payment_method is not null)),
  check (status = 'paid' or customer_id is not null)
);

create index sales_business_time_idx on public.sales (business_id, sold_at desc);

create table public.sale_items (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses (id) on delete cascade,
  sale_id uuid not null,
  product_id uuid,
  description text not null,
  quantity numeric(14, 3) not null check (quantity > 0),
  unit_price numeric(14, 2) not null check (unit_price >= 0),
  -- Costo copiado al vender: la ganancia histórica no cambia si cambia el costo.
  unit_cost numeric(14, 2) not null default 0 check (unit_cost >= 0),
  line_total numeric(14, 2) not null check (line_total >= 0),
  foreign key (business_id, sale_id) references public.sales (business_id, id) on delete cascade,
  foreign key (business_id, product_id) references public.products (business_id, id)
);

create index sale_items_sale_idx on public.sale_items (sale_id);

-- Gastos -------------------------------------------------------------------------

create table public.expenses (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses (id) on delete cascade,
  spent_at timestamptz not null default now(),
  amount numeric(14, 2) not null check (amount > 0),
  category text not null check (length(trim(category)) between 1 and 60),
  payment_method public.payment_method not null default 'cash',
  supplier_id uuid,
  note text,
  receipt_path text,
  created_by uuid not null default auth.uid() references auth.users (id),
  created_at timestamptz not null default now(),
  unique (business_id, id),
  foreign key (business_id, supplier_id) references public.contacts (business_id, id)
);

create index expenses_business_time_idx on public.expenses (business_id, spent_at desc);

-- Movimientos de inventario --------------------------------------------------------

create table public.stock_movements (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses (id) on delete cascade,
  product_id uuid not null,
  quantity numeric(14, 3) not null check (quantity <> 0),
  reason public.stock_reason not null,
  sale_id uuid,
  expense_id uuid,
  note text,
  created_by uuid not null default auth.uid() references auth.users (id),
  created_at timestamptz not null default now(),
  foreign key (business_id, product_id) references public.products (business_id, id),
  foreign key (business_id, sale_id) references public.sales (business_id, id),
  foreign key (business_id, expense_id) references public.expenses (business_id, id)
);

create index stock_movements_product_idx on public.stock_movements (product_id, created_at desc);

create function public.apply_stock_movement()
returns trigger
language plpgsql security definer set search_path = ''
as $$
begin
  update public.products
  set stock = stock + new.quantity
  where id = new.product_id and business_id = new.business_id;
  return new;
end;
$$;

create trigger stock_movements_apply
after insert on public.stock_movements
for each row execute function public.apply_stock_movement();

-- Fiados y deudas ------------------------------------------------------------------

create table public.debts (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses (id) on delete cascade,
  kind public.debt_kind not null,
  contact_id uuid not null,
  amount numeric(14, 2) not null check (amount > 0),
  balance numeric(14, 2) not null check (balance >= 0 and balance <= amount),
  due_date date,
  sale_id uuid,
  note text,
  created_by uuid not null default auth.uid() references auth.users (id),
  created_at timestamptz not null default now(),
  unique (business_id, id),
  foreign key (business_id, contact_id) references public.contacts (business_id, id),
  foreign key (business_id, sale_id) references public.sales (business_id, id)
);

create index debts_open_idx on public.debts (business_id, kind) where balance > 0;

-- Una deuda nueva siempre arranca con saldo = monto.
create function public.debts_start_balance()
returns trigger
language plpgsql set search_path = ''
as $$
begin
  new.balance := new.amount;
  return new;
end;
$$;

create trigger debts_start_balance
before insert on public.debts
for each row execute function public.debts_start_balance();

create table public.debt_payments (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses (id) on delete cascade,
  debt_id uuid not null,
  amount numeric(14, 2) not null check (amount > 0),
  payment_method public.payment_method not null default 'cash',
  paid_at timestamptz not null default now(),
  created_by uuid not null default auth.uid() references auth.users (id),
  created_at timestamptz not null default now(),
  foreign key (business_id, debt_id) references public.debts (business_id, id)
);

create index debt_payments_business_time_idx on public.debt_payments (business_id, paid_at desc);

create function public.apply_debt_payment()
returns trigger
language plpgsql security definer set search_path = ''
as $$
declare
  v_balance numeric(14, 2);
begin
  select balance into v_balance
  from public.debts
  where id = new.debt_id and business_id = new.business_id
  for update;

  if new.amount > v_balance then
    raise exception 'El abono (%) supera el saldo (%)', new.amount, v_balance
      using errcode = 'check_violation';
  end if;

  update public.debts set balance = balance - new.amount where id = new.debt_id;
  return new;
end;
$$;

create trigger debt_payments_apply
before insert on public.debt_payments
for each row execute function public.apply_debt_payment();

-- Registrar una venta completa en una sola transacción ---------------------------
--
-- p_items: [{ "product_id": uuid|null, "description": text, "quantity": n, "unit_price": n }]
-- Si viene product_id, el nombre y el costo salen del producto y el precio,
-- si no se envía, también. Corre con los permisos de quien llama (security invoker).

create function public.create_sale(
  p_business_id uuid,
  p_items jsonb,
  p_payment_method public.payment_method default 'cash',
  p_customer_id uuid default null,
  p_on_credit boolean default false,
  p_discount numeric default 0,
  p_due_date date default null,
  p_note text default null,
  p_sold_at timestamptz default now()
)
returns uuid
language plpgsql security invoker set search_path = ''
as $$
declare
  v_sale_id uuid := gen_random_uuid();
  v_item jsonb;
  v_product public.products%rowtype;
  v_quantity numeric(14, 3);
  v_price numeric(14, 2);
  v_cost numeric(14, 2);
  v_description text;
  v_subtotal numeric(14, 2) := 0;
  v_discount numeric(14, 2) := round(coalesce(p_discount, 0), 2);
  v_total numeric(14, 2);
  v_lines jsonb := '[]'::jsonb;
begin
  if not public.is_member(p_business_id) then
    raise exception 'No perteneces a este negocio' using errcode = 'insufficient_privilege';
  end if;

  if jsonb_typeof(p_items) is distinct from 'array' or jsonb_array_length(p_items) = 0 then
    raise exception 'La venta no tiene productos' using errcode = 'invalid_parameter_value';
  end if;

  for v_item in select * from jsonb_array_elements(p_items) loop
    v_quantity := round((v_item ->> 'quantity')::numeric, 3);
    if v_quantity is null or v_quantity <= 0 then
      raise exception 'Cantidad inválida' using errcode = 'invalid_parameter_value';
    end if;

    if v_item ->> 'product_id' is not null then
      select * into v_product
      from public.products
      where id = (v_item ->> 'product_id')::uuid and business_id = p_business_id;

      if not found then
        raise exception 'Producto no encontrado' using errcode = 'foreign_key_violation';
      end if;
      if v_product.unit = 'unit' and v_quantity <> trunc(v_quantity) then
        raise exception '% se vende por unidad', v_product.name using errcode = 'invalid_parameter_value';
      end if;

      v_description := v_product.name;
      v_price := round(coalesce((v_item ->> 'unit_price')::numeric, v_product.price), 2);
      v_cost := v_product.cost;
    else
      v_description := nullif(trim(v_item ->> 'description'), '');
      v_price := round((v_item ->> 'unit_price')::numeric, 2);
      v_cost := 0;
      if v_description is null or v_price is null then
        raise exception 'Una línea sin producto necesita descripción y precio'
          using errcode = 'invalid_parameter_value';
      end if;
    end if;

    if v_price < 0 then
      raise exception 'Precio inválido' using errcode = 'invalid_parameter_value';
    end if;

    v_lines := v_lines || jsonb_build_object(
      'product_id', v_item ->> 'product_id',
      'description', v_description,
      'quantity', v_quantity,
      'unit_price', v_price,
      'unit_cost', v_cost,
      'line_total', round(v_quantity * v_price, 2)
    );
    v_subtotal := v_subtotal + round(v_quantity * v_price, 2);
  end loop;

  if v_discount < 0 or v_discount > v_subtotal then
    raise exception 'El descuento no puede superar el subtotal' using errcode = 'invalid_parameter_value';
  end if;
  v_total := v_subtotal - v_discount;

  if p_on_credit and p_customer_id is null then
    raise exception 'Para fiar hay que elegir el cliente' using errcode = 'invalid_parameter_value';
  end if;

  insert into public.sales (
    id, business_id, sold_at, status, payment_method, customer_id, subtotal, discount, total, note
  ) values (
    v_sale_id, p_business_id, coalesce(p_sold_at, now()),
    case when p_on_credit then 'credit'::public.sale_status else 'paid'::public.sale_status end,
    case when p_on_credit then null else coalesce(p_payment_method, 'cash') end,
    p_customer_id, v_subtotal, v_discount, v_total, nullif(trim(p_note), '')
  );

  insert into public.sale_items (
    business_id, sale_id, product_id, description, quantity, unit_price, unit_cost, line_total
  )
  select p_business_id, v_sale_id, (l ->> 'product_id')::uuid, l ->> 'description',
         (l ->> 'quantity')::numeric, (l ->> 'unit_price')::numeric,
         (l ->> 'unit_cost')::numeric, (l ->> 'line_total')::numeric
  from jsonb_array_elements(v_lines) as l;

  insert into public.stock_movements (business_id, product_id, quantity, reason, sale_id)
  select p_business_id, (l ->> 'product_id')::uuid, -(l ->> 'quantity')::numeric, 'sale', v_sale_id
  from jsonb_array_elements(v_lines) as l
  where l ->> 'product_id' is not null;

  if p_on_credit and v_total > 0 then
    insert into public.debts (business_id, kind, contact_id, amount, balance, due_date, sale_id)
    values (p_business_id, 'receivable', p_customer_id, v_total, v_total, p_due_date, v_sale_id);
  end if;

  return v_sale_id;
end;
$$;

-- Permisos de columnas --------------------------------------------------------------
-- Supabase da permisos amplios por defecto; aquí se recortan. Lo que no aparece
-- (stock, balance, created_by…) solo lo escriben los triggers y las funciones.

revoke all on all tables in schema public from anon;
revoke insert, update, delete on all tables in schema public from authenticated;

grant insert (name, currency, country, time_zone) on public.businesses to authenticated;
grant update (name, currency, country, time_zone) on public.businesses to authenticated;
grant delete on public.businesses to authenticated;

grant insert (business_id, user_id, role), update (role), delete on public.memberships to authenticated;

grant insert (business_id, kind, name, phone, note), update (kind, name, phone, note), delete
  on public.contacts to authenticated;

grant insert (business_id, name, sku, unit, price, cost, min_stock, archived),
  update (name, sku, unit, price, cost, min_stock, archived)
  on public.products to authenticated;

grant insert (id, business_id, sold_at, status, payment_method, customer_id, subtotal, discount, total, note)
  on public.sales to authenticated;
grant insert (business_id, sale_id, product_id, description, quantity, unit_price, unit_cost, line_total)
  on public.sale_items to authenticated;

grant insert (business_id, spent_at, amount, category, payment_method, supplier_id, note, receipt_path),
  update (spent_at, amount, category, payment_method, supplier_id, note, receipt_path), delete
  on public.expenses to authenticated;

grant insert (business_id, product_id, quantity, reason, sale_id, expense_id, note)
  on public.stock_movements to authenticated;

grant insert (business_id, kind, contact_id, amount, balance, due_date, sale_id, note),
  update (due_date, note)
  on public.debts to authenticated;

grant insert (business_id, debt_id, amount, payment_method, paid_at) on public.debt_payments to authenticated;

-- Seguridad por fila ------------------------------------------------------------------

alter table public.businesses enable row level security;
alter table public.memberships enable row level security;
alter table public.contacts enable row level security;
alter table public.products enable row level security;
alter table public.sales enable row level security;
alter table public.sale_items enable row level security;
alter table public.expenses enable row level security;
alter table public.stock_movements enable row level security;
alter table public.debts enable row level security;
alter table public.debt_payments enable row level security;

-- businesses: created_by en la lectura permite el "insert ... returning" de quien
-- lo crea, antes de que el trigger agregue su membresía.
create policy businesses_select on public.businesses for select to authenticated
  using (created_by = auth.uid() or public.is_member(id));
create policy businesses_insert on public.businesses for insert to authenticated
  with check (created_by = auth.uid());
create policy businesses_update on public.businesses for update to authenticated
  using (public.is_manager(id)) with check (public.is_manager(id));
create policy businesses_delete on public.businesses for delete to authenticated
  using (public.role_in(id) = 'owner');

-- memberships: los administradores manejan el equipo, pero nadie crea,
-- cambia ni borra al dueño desde la app.
create policy memberships_select on public.memberships for select to authenticated
  using (public.is_member(business_id));
create policy memberships_insert on public.memberships for insert to authenticated
  with check (public.is_manager(business_id) and role <> 'owner');
create policy memberships_update on public.memberships for update to authenticated
  using (public.is_manager(business_id) and role <> 'owner')
  with check (public.is_manager(business_id) and role <> 'owner');
create policy memberships_delete on public.memberships for delete to authenticated
  using (public.is_manager(business_id) and role <> 'owner');

create policy contacts_select on public.contacts for select to authenticated
  using (public.is_member(business_id));
create policy contacts_insert on public.contacts for insert to authenticated
  with check (public.is_member(business_id));
create policy contacts_update on public.contacts for update to authenticated
  using (public.is_member(business_id)) with check (public.is_member(business_id));
create policy contacts_delete on public.contacts for delete to authenticated
  using (public.is_manager(business_id));

create policy products_select on public.products for select to authenticated
  using (public.is_member(business_id));
create policy products_insert on public.products for insert to authenticated
  with check (public.is_manager(business_id));
create policy products_update on public.products for update to authenticated
  using (public.is_manager(business_id)) with check (public.is_manager(business_id));

-- Ventas: cualquier miembro registra; nadie edita ni borra.
create policy sales_select on public.sales for select to authenticated
  using (public.is_member(business_id));
create policy sales_insert on public.sales for insert to authenticated
  with check (public.is_member(business_id) and created_by = auth.uid());

create policy sale_items_select on public.sale_items for select to authenticated
  using (public.is_member(business_id));
create policy sale_items_insert on public.sale_items for insert to authenticated
  with check (public.is_member(business_id));

-- Gastos: cualquier miembro registra; el vendedor solo ve los suyos.
create policy expenses_select on public.expenses for select to authenticated
  using (public.is_manager(business_id) or (public.is_member(business_id) and created_by = auth.uid()));
create policy expenses_insert on public.expenses for insert to authenticated
  with check (public.is_member(business_id) and created_by = auth.uid());
create policy expenses_update on public.expenses for update to authenticated
  using (public.is_manager(business_id)) with check (public.is_manager(business_id));
create policy expenses_delete on public.expenses for delete to authenticated
  using (public.is_manager(business_id));

-- Movimientos: el vendedor solo genera salidas por venta; ajustes y compras, los administradores.
create policy stock_movements_select on public.stock_movements for select to authenticated
  using (public.is_member(business_id));
create policy stock_movements_insert on public.stock_movements for insert to authenticated
  with check (
    created_by = auth.uid()
    and (public.is_manager(business_id) or (public.is_member(business_id) and reason = 'sale'))
  );

create policy debts_select on public.debts for select to authenticated
  using (public.is_member(business_id));
create policy debts_insert on public.debts for insert to authenticated
  with check (public.is_member(business_id) and created_by = auth.uid());
create policy debts_update on public.debts for update to authenticated
  using (public.is_manager(business_id)) with check (public.is_manager(business_id));

create policy debt_payments_select on public.debt_payments for select to authenticated
  using (public.is_member(business_id));
create policy debt_payments_insert on public.debt_payments for insert to authenticated
  with check (public.is_member(business_id) and created_by = auth.uid());

-- Las funciones auxiliares no se llaman desde fuera salvo create_sale.
revoke execute on function public.add_owner_membership() from public, anon, authenticated;
revoke execute on function public.apply_stock_movement() from public, anon, authenticated;
revoke execute on function public.apply_debt_payment() from public, anon, authenticated;
revoke execute on function public.debts_start_balance() from public, anon, authenticated;
revoke execute on function public.create_sale(uuid, jsonb, public.payment_method, uuid, boolean, numeric, date, text, timestamptz) from public, anon;
grant execute on function public.create_sale(uuid, jsonb, public.payment_method, uuid, boolean, numeric, date, text, timestamptz) to authenticated;
