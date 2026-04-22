#!/bin/bash
# Ejecuta este script UNA SOLA VEZ para generar las claves RS256
# Requiere openssl instalado

KEYS_DIR="src/shared/security/keys"
mkdir -p $KEYS_DIR

# Generar clave privada
openssl genrsa -out $KEYS_DIR/private.key 2048

# Generar clave pública a partir de la privada
openssl rsa -in $KEYS_DIR/private.key -pubout -out $KEYS_DIR/public.key

echo "✅ Claves RS256 generadas en $KEYS_DIR"
echo "⚠️  NUNCA subas private.key a Git. Asegúrate de tenerlo en .gitignore"
