
Adminer credentials 

|key|value|
|----|----|
|System|PostgreSQL|
|Server|db|
|Username|postgres|
|Password|example|
|Database|postgres|

## Setup

1. Dupe .env.example and rename it to .env (update the environment variables)

2. Install npm dependancies

```
npm i
```

3. Start docker services

```
docker compose up -d
```

3. Push database schema

```
npx drizzle-kit push
```

4. Init database 

```
npm run db:init
```

## Usefull commands

Reset & restart database

```
docker compose down -v && docker compose up -d
```