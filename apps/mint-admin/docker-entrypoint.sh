#!/bin/sh

# Injecte les variables d'environnement dans env.js au runtime
envsubst < /usr/share/nginx/html/env.template.js > /usr/share/nginx/html/env.js

exec "$@"
