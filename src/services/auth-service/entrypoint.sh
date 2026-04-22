#!/bin/sh
set -e

echo "⏳ Corriendo migraciones de Prisma..."
npx prisma migrate deploy

echo "✅ Migraciones aplicadas. Levantando servicio..."
exec node dist/main.js