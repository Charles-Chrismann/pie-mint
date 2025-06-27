#!/bin/sh

sleep 4
npm run db:init

if [ $? -eq 0 ]; then
  npm run db:seed
else
  echo "Database initialization failed, aborting."
  exit 1
fi