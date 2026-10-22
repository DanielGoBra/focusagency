# Negocios

App web y móvil para que microempresas lleven ventas, gastos, inventario y fiados. Nombre definitivo por definir.

Esta carpeta es un monorepo independiente del sitio de la agencia: no comparte dependencias ni se publica con él (`.vercelignore`). Cuando tenga repositorio propio se separa con su historial:

```bash
git subtree split --prefix negocios -b negocios-solo
```

## Estructura

```mermaid
flowchart LR
  core["packages/core<br/>tipos, cálculos, reglas"]
  data["packages/data<br/>Supabase y demo"]
  web["apps/web<br/>React + Vite + Tailwind"]
  mobile["apps/mobile<br/>Expo + Expo Router"]
  db["supabase/<br/>esquema y permisos"]
  core --> data
  core --> web
  core --> mobile
  data --> web
  data --> mobile
  data -. API .-> db
```

| Carpeta | Qué hay |
| --- | --- |
| `packages/core` | Dinero, cantidades por peso, totales de venta, resumen del periodo, permisos por rol, CSV y cobros por WhatsApp. Sin dependencias. |
| `packages/data` | La interfaz `Repo` y dos implementaciones: Supabase (producción) y demo (en memoria, con datos de ejemplo). |
| `apps/web` | Tablero, ventas, gastos, inventario y fiados. Modo claro y oscuro, escritorio y celular. |
| `apps/mobile` | Inicio, vender, gastos y fiados para Android e iOS. |
| `supabase/migrations` | Tablas, seguridad por fila, triggers de stock y saldos, y la función `create_sale`. |
| `supabase/tests` | Pruebas de permisos que corren contra cualquier Postgres. |

## Empezar

Requiere Node 22.

```bash
cd negocios
npm install
npm run dev:web      # http://localhost:5174
npm run dev:mobile   # abre Expo; escanea el QR con Expo Go
```

Sin variables de entorno, las dos apps arrancan en **modo demostración** con una tienda de ejemplo: se puede vender, fiar, abonar y registrar gastos sin servidor.

### Con Supabase

1. `npx supabase start` en esta carpeta (necesita Docker). Aplica `supabase/migrations`.
2. Copia `apps/web/.env.example` a `apps/web/.env.local` y `apps/mobile/.env.example` a `apps/mobile/.env.local` con la URL y la llave anónima que imprime la consola.
3. Crea una cuenta desde la app: el primer negocio queda a tu nombre como dueño.

## Comprobar antes de subir cambios

```bash
npm run typecheck
npm test
DATABASE_URL=postgres://postgres:postgres@localhost:5432/postgres npm run test:db -- --stub
```

`test:db` aplica las migraciones en una base vacía y prueba los permisos: lo que puede y no puede hacer el dueño, el vendedor y alguien ajeno al negocio. Todo corre en una transacción que se deshace. Contra `supabase start` usa `-- --solo-pruebas`. El CI (`.github/workflows/negocios.yml`) corre lo mismo.

## Reglas de la base de datos

- Cada fila tiene `business_id`. La seguridad por fila solo deja ver o tocar los negocios donde el usuario es miembro, y las llaves foráneas incluyen `business_id` para que nada apunte a otro negocio.
- El stock es la suma de `stock_movements` y el saldo de un fiado baja con cada `debt_payments`. Los dos los mantienen triggers; nadie los escribe directamente.
- Ventas, movimientos y abonos no se editan ni se borran.
- `create_sale` registra la venta, sus líneas, la salida de inventario y, si es fiada, la deuda, todo en una transacción y con los permisos de quien llama.
- Roles: `owner` y `admin` manejan productos, equipo y ven ganancias y todos los gastos. `seller` vende, fía, recibe abonos y ve solo sus gastos.

## Ganancia

`Ganancia = ventas − costo de lo vendido − gastos sin compras de mercancía`. El costo se copia en cada línea al vender, así que cambiar el costo de un producto no reescribe la historia. Las compras de mercancía ya están en ese costo; restarlas otra vez contaría doble.

## Pendiente para cerrar la fase 1

- [ ] Invitar empleados por correo (el esquema y los permisos ya existen).
- [ ] Ocultar el costo de los productos al vendedor (hoy lo oculta la interfaz; falta hacerlo en la base de datos).
- [ ] Anular ventas con movimientos de reversa.
- [ ] Fotos de soportes de gastos (Supabase Storage).
- [ ] Reportes en Excel (.xlsx) y PDF; hoy se descarga CSV, que Excel abre.
- [ ] Asistente de IA (ver el documento de producto): función del servidor con Claude y herramientas que usan la sesión del usuario.
- [ ] Selector de negocio y alta de productos en la app móvil.
- [ ] Rangos de fechas en la zona horaria del negocio (hoy usan la del dispositivo).
