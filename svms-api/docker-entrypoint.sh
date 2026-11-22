#!/bin/sh
set -e

# Apply pending Prisma migrations before the server starts.
# "migrate deploy" never creates a shadow database and never resets data.
if [ "${RUN_MIGRATIONS:-true}" = "true" ]; then
  echo "[entrypoint] Applying database migrations..."
  npx prisma migrate deploy
fi

# exec so Node becomes PID 1 and receives SIGTERM directly (graceful shutdown)
exec "$@"
