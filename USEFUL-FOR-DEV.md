# Useful for dev

This page is a non exhaustive list of informations that you might want to know while developing on the project.

### Mint administraton
The `mint-administration` project is, for now, used for debuging purpose.

The seeding sets up a user with some [organizations](./GLOSSARY.md#organization) already created, when the env variable `MODE` is sets to `development` in `./mint-administration/.env`, a button allows you to login on `/auth/login`.

The credentials are:

```
email: user@example.com
password: password
```

docker build --target mint-api-runtime -t charleschrismann/mint-api:latest .
docker run --env-file ./apps/mint-api/.env --name mint-api charleschrismann/mint-api:latest

docker build --target mint-admin-runtime -t charleschrismann/mint-admin:latest .
docker run -p 81:80 charleschrismann/mint-admin:latest

docker build --target mint-ws-runtime -t charleschrismann/mint-ws:latest .
docker run --env-file ./apps/mint-ws/.env --name mint-ws charleschrismann/mint-ws:latest
