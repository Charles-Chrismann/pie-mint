echo "Initializing database..."
npm run db:init

if [ $? -eq 0 ]; then
  echo "Seeding database..."
  npm run db:seed
  echo "Starting dev server..."
  npm run dev
else
  echo "Database initialization failed, aborting."
  exit 1
fi