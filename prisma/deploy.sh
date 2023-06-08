#!/bin/bash
VER_MIGRATE0="0.0.1.$(shuf -i 0-100000 -n 1)"
VER_MIGRATE="0.0.1.$(shuf -i 0-100000 -n 1)"

echo $VER_MIGRATE0
echo $VER_MIGRATE

# mkdir -p migrations/$VER_MIGRATE

# touch migrations/migration_lock.toml
# echo 'provider = "postgresql"' >> migrations/migration_lock.toml

# echo "prisma migrate diff 1"
# npx prisma migrate diff \
# --from-migrations migrations \
# --shadow-database-url $SHADOW_DATABASE_URL \
# --to-schema-datamodel schema.prisma \
# --script > migrations/$VER_MIGRATE/migration.sql
# cat migrations/$VER_MIGRATE/migration.sql

# echo "prisma migrate resolve"
# npx prisma migrate resolve --applied $VER_MIGRATE

# # mkdir -p migrations/$VER_MIGRATE0

# # echo "prisma db pull"
# # npx prisma db pull

# # echo "prisma migrate diff 2"
# # npx prisma migrate diff \
# # --from-schema-datamodel schema.prisma \
# # --script > migrations/$VER_MIGRATE0/migration.sql

# echo "prisma migrate deploy"
# npx prisma migrate deploy

# mkdir -p migrations/$VER_MIGRATE0
# mpx prisma migrate diff --from-empty --to-url "$DATABASE_URL?schema=local" \
# --script > migrations/$VER_MIGRATE0/migration.sql

# touch migrations/migration_lock.toml
# echo 'provider = "postgresql"' >> migrations/migration_lock.toml

# DATABASE_URL="$DATABASE_URL?schema=prod" npx prisma migrate resolve \
# --applied $VER_MIGRATE0

# mkdir -p migrations/$VER_MIGRATE

# npx prisma migrate diff --from-migrations ./migrations \
# --to-schema-datamodel "./schema.prisma" \
# --shadow-database-url "$SHADOW_DATABASE_URL" \
# --script > migrations/$VER_MIGRATE/migration.sql

# DATABASE_URL="$DATABASE_URL?schema=local" npx prisma migrate resolve \
# --applied $VER_MIGRATE

# echo "diff $VER_MIGRATE0"
# cat migrations/$VER_MIGRATE0/migration.sql
# echo "diff $VER_MIGRATE"
# cat migrations/$VER_MIGRATE/migration.sql


# DATABASE_URL="$DATABASE_URL?schema=local" npx prisma migrate deploy
# DATABASE_URL="$DATABASE_URL?schema=prod" npx prisma migrate deploy

mkdir -p migrations/$VER_MIGRATE

touch migrations/migration_lock.toml
echo 'provider = "postgresql"' >> migrations/migration_lock.toml

# npx prisma db push --preview-feature
# --from-migrations ./migrations\
# --shadow-database-url "$SHADOW_DATABASE_URL" \

npx prisma migrate diff \
--to-schema-datamodel "./schema.prisma" \
--from-url "$DATABASE_URL" \
--script > migrations/$VER_MIGRATE/migration.sql

mkdir -p migrations/$VER_MIGRATE0

npx prisma migrate diff \
--to-migrations "./migrations" \
--from-url "$DATABASE_URL" \
--shadow-database-url "$SHADOW_DATABASE_URL" \
--script > migrations/$VER_MIGRATE0/migration.sql

echo $VER_MIGRATE
cat migrations/$VER_MIGRATE/migration.sql
echo $VER_MIGRATE0
cat migrations/$VER_MIGRATE0/migration.sql

npx prisma migrate resolve --applied $VER_MIGRATE0

npx prisma migrate deploy