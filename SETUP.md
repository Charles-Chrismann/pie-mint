# Setup

## Création des env

Ajouter un .env dans packages/db a partir de .env.example

## Lancement des services

Drop, push, init et seed
```sh
npm run db:dpis 
```

Si erreur au niveau du p, lancer les commandes un par un en attendant un peu entre les commandes


(Erreur au niveau du seed a régler, relancer les commandes si ça ne marche pas)

### `ws-tests`

1. Install dependancies

```
cd ws-tests
npm i 
```

2. (optional) create runs.json

3. Start emulation

```
npm run start 
```