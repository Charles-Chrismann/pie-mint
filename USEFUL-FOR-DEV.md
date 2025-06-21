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