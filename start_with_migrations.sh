#!/usr/bin/env bash

set -euxo pipefail

_term() {
  echo "Caught SIGTERM signal!"
  kill -TERM "$child" 2>/dev/null
}

trap _term SIGTERM

npx prisma migrate deploy;
NODE_ENV=production node ./build/index.js &

child=$!
wait "$child"
