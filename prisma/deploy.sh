#!/bin/bash
VER_MIGRATE0="$(date +"%Y%m%d%H%M%S")_0.0.1"
VER_MIGRATE="$(date +"%Y%m%d%H%M%S")_0.0.2"

echo $VER_MIGRATE0
echo $VER_MIGRATE

touch current.prisma
echo 'datasource db {
    provider = "postgresql"
    url      = env("DATABASE_URL")
}' >> ./current.prisma

mkdir -p ./migrations/$VER_MIGRATE0

touch migrations/migration_lock.toml
echo 'provider = "postgresql"' >> migrations/migration_lock.toml

npx prisma db pull --schema current.prisma

npx prisma migrate diff \
--from-empty \
--to-schema-datamodel ./current.prisma \
--script > ./migrations/$VER_MIGRATE0/migration.sql
`
npx prisma migrate resolve --applied $VER_MIGRATE0

mkdir -p ./migrations/$VER_MIGRATE

npx prisma migrate diff --from-migrations ./migrations \
--to-schema-datamodel "./schema.prisma" \
--shadow-database-url "$SHADOW_DATABASE_URL" \
--script > ./migrations/$VER_MIGRATE/migration.sql

echo $VER_MIGRATE0
cat migrations/$VER_MIGRATE0/migration.sql
echo $VER_MIGRATE
cat migrations/$VER_MIGRATE/migration.sql

npx prisma migrate deploy
