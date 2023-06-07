#!/bin/bash
VER_MIGRATE0="0.0.1.$(shuf -i 0-100000 -n 1)"
VER_MIGRATE="0.0.1.$(shuf -i 0-100000 -n 1)"

echo $VER_MIGRATE

mkdir -p migrations/$VER_MIGRATE

touch migrations/migration_lock.toml
echo 'provider = "postgresql"' >> migrations/migration_lock.toml

echo "prisma migrate diff 1"
npx prisma migrate diff \
--from-migrations migrations \
--shadow-database-url $SHADOW_DATABASE_URL \
--to-schema-datamodel schema.prisma \
--script > migrations/$VER_MIGRATE/migration.sql

echo "prisma migrate resolve"
npx prisma migrate resolve --applied $VER_MIGRATE

mkdir -p migrations/$VER_MIGRATE0

echo "prisma db pull"
npx prisma db pull

# echo "prisma migrate diff 2"
# npx prisma migrate diff \
# --from-schema-datamodel schema.prisma \
# --script > migrations/$VER_MIGRATE0/migration.sql

echo "prisma migrate deploy"
npx prisma migrate deploy