# MiniVerse - Backend

Plataforma de reseñas de series de televisión por episodio. El backend está construido con una arquitectura orientada a servicios (SOA) donde cada funcionalidad vive en su propio servicio independiente.

---

## Servicios

| Servicio | Puerto | Descripción |
|----------|--------|-------------|
| api-gateway | 3100 | Punto de entrada, proxy y rate limiting |
| auth-service | 3001 | Registro, login y validación de tokens |
| user-service | 3002 | Perfil y datos del usuario |
| series-service | 3003 | Catálogo de series e integración con TMDB |
| season-service | 3004 | Temporadas por serie |
| episode-service | 3005 | Episodios por temporada |
| review-service | 3006 | Reseñas por episodio |
| comment-service | 3007 | Comentarios por reseña |
| realtime-service | 3008 | Comentarios en tiempo real con Socket.io |

---

## Tecnologías

- Node.js con TypeScript
- Express como framework HTTP
- Prisma ORM con PostgreSQL
- JWT con algoritmo RS256
- Bcrypt para contraseñas
- Socket.io para tiempo real
- TMDB API para datos de series

---

## Requisitos

- Node.js 18 o superior
- PostgreSQL corriendo localmente o cuenta en Supabase
- OpenSSL para generar las claves JWT

---

## Instalación

Cada servicio es independiente. Los pasos son los mismos para todos:

```bash
cd src/services/nombre-servicio
npm install
```

Crear el archivo `.env` en la carpeta del servicio:

```env
DATABASE_URL="postgresql://usuario:password@localhost:5432/miniverse_db"
```

Para el auth-service también se necesita generar las claves RS256 (solo una vez):

```bash
mkdir -p shared/keys
openssl genrsa -out shared/keys/private.key 2048
openssl rsa -in shared/keys/private.key -pubout -out shared/keys/public.key
```

Para los demás servicios, copiar la clave pública del auth-service:

```bash
mkdir -p shared/keys
cp ../auth-service/shared/keys/public.key shared/keys/public.key
```

Sincronizar el schema con la base de datos:

```bash
npx prisma db push --schema=prisma/schema.prisma
```

Iniciar el servicio:

```bash
npm run dev
```

---

## Variables de entorno

| Variable | Descripción | Servicios |
|----------|-------------|-----------|
| DATABASE_URL | Cadena de conexión a PostgreSQL | Todos excepto realtime |
| JWT_PRIVATE_KEY | Clave privada RS256 | auth-service |
| JWT_PUBLIC_KEY | Clave pública RS256 | Todos |
| TMDB_API_KEY | API key de The Movie Database | series, season, episode |
| REALTIME_SERVICE_URL | URL del realtime-service | comment-service |
| FRONTEND_URL | URL del frontend para CORS | api-gateway, realtime |
| GATEWAY_PORT | Puerto del api-gateway | api-gateway |

---

## Endpoints principales

Todas las rutas pasan por el api-gateway en `http://localhost:3100/api`.

**Auth**
- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/login` - Iniciar sesión
- `GET /api/auth/verify` - Verificar token

**Series**
- `GET /api/series` - Listar series del catálogo
- `GET /api/series/search?q=nombre` - Buscar en TMDB en tiempo real
- `POST /api/series/import` - Importar serie desde TMDB (requiere token)

**Temporadas y episodios**
- `GET /api/seasons/serie/:idSerie` - Temporadas de una serie
- `POST /api/seasons/import/:idSerie` - Importar temporadas desde TMDB
- `GET /api/episodes/season/:idTemporada` - Episodios de una temporada
- `POST /api/episodes/import/:idTemporada` - Importar episodios desde TMDB

**Reseñas y comentarios**
- `GET /api/reviews/episode/:idCapitulo` - Reseñas de un episodio
- `POST /api/reviews` - Crear reseña (requiere token)
- `GET /api/comments/review/:idResena` - Comentarios de una reseña
- `POST /api/comments` - Crear comentario (requiere token)

---

## Despliegue

- Base de datos: Supabase
- Servicios: Render
- Cada servicio se despliega por separado apuntando al subdirectorio correspondiente

---

## Seguridad

- Los tokens JWT se firman con RS256 usando claves asimétricas
- Las contraseñas se guardan hasheadas con bcrypt
- Las rutas de escritura requieren token válido
- El api-gateway aplica rate limiting en todas las rutas
- Las claves privadas nunca se suben al repositorio