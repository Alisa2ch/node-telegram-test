#!/bin/bash
VER_MIGRATE0="0.0.1.$(shuf -i 0-100000 -n 1)"
VER_MIGRATE="0.0.1.$(shuf -i 0-100000 -n 1)"
echo $VER_MIGRATE
mkdir -p migrations/$VER_MIGRATE
npx prisma migrate diff \
--from-empty \
--script > migrations/VER_MIGRATE0/migration.sql
npx prisma db pull
npx prisma migrate resolve --applied $VER_MIGRATE0
npx prisma migrate diff \
--from-migrations migrations
--shadow-database-url $SHADOW_DATABASE_URL
--to-schema-datamodel schema.prisma \
--script > migrations/$VER_MIGRATE/migration.sql
npx prisma migrate deploy