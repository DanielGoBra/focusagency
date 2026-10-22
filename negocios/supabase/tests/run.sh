#!/usr/bin/env bash
# Prueba las migraciones y los permisos.
#
#   DATABASE_URL=postgres://...  bash supabase/tests/run.sh
#
# Contra un Postgres vacío (local o de CI) agrega --stub para simular Supabase.
# Contra `supabase start` no hace falta: las migraciones ya están aplicadas,
# así que usa --solo-pruebas.
set -euo pipefail

cd "$(dirname "$0")/.."
: "${DATABASE_URL:?Define DATABASE_URL con la base de datos de prueba}"

psql_run() { psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -q -o /dev/null "$@"; }

stub=false
only_tests=false
for arg in "$@"; do
  case "$arg" in
    --stub) stub=true ;;
    --solo-pruebas) only_tests=true ;;
  esac
done

if [ "$only_tests" = false ]; then
  if [ "$stub" = true ]; then psql_run -f tests/00_supabase_stub.sql; fi
  for migration in migrations/*.sql; do
    echo "Migración: $migration"
    psql_run -f "$migration"
  done
fi

for test in tests/*.test.sql; do
  echo "Prueba: $test"
  psql_run -f "$test"
done
