#!/bin/bash

KEYS_DIR="src/shared/security/keys"
mkdir -p $KEYS_DIR

openssl genrsa -out $KEYS_DIR/private.key 2048

openssl rsa -in $KEYS_DIR/private.key -pubout -out $KEYS_DIR/public.key

echo "✅ Claves RS256 generadas en $KEYS_DIR"
echo "⚠️  NUNCA subas private.key a Git. Asegúrate de tenerlo en .gitignore"
