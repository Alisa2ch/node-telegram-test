#!/bin/bash
VER_MIGRATE=0\.0\.1\.$(shuf -i 0-100000 -n 1)
mkdir -p migrations/$VER_MIGRATE
npx prisma migrate diff \
--from-empty \
--to-schema-datamodel schema.prisma \
--script > migrations/$VER_MIGRATE/migration.sql
npx prisma migrate resolve --applied $VER_MIGRATE
npx prisma migrate deploy