# Setup

Le backend est séparée en deux serveurs, `mint-server` et `mint-ws-runners`, avec des responsabilités différentes:

> [!NOTE]
> Les projets peuvent être amenés à être renommé.

`mint-server` est l'api REST de l'application, qui permet de consulter des courses, l'authentification

`mint-ws-runners` est le serveur websocket auquel les coureurs et les spectateurs se connecteront pour recevoir les mises à jours en direct de la course

`ws-tests` est un utilitaire qui permet d'émuler une course et des coureurs.

`mint-administration` est un client destiné au débug de l'app `ws-tests`.

## Setup des différents projets

Avant tout il est nécessaire de copier tout les fichiers du dossier `.env.exmaples/` à la racine du projet, et de retirer la partie `.example` du nom du fichier.

Par défaut les applications écouterons sur les ports:

- `mint-server`: 3000
- `mint-ws-runners`: 3001
- `mint-administration`: 5173

Pour changer les ports, modifier le `.env` précédement dupliqué.

Requirements: 

- Node
- Docker

Les projets `mint-server`, `mint-ws-runners`, `mint-administration` ont été dockerisés, les commandes suivantes sont utiles:

Lancer tout les services:

```sh
docker compose up --build --force-recreate
```

Init la db:

```sh
# equivalent à (npm run db:init)
docker exec mint-api ./i.sh
```

Drop, init et seed la db:

```sh
# equivalent à (npm run db:d)
docker compose down -v
docker compose up --build --force-recreate

# Dans un autre terminal (npm run db:is)
docker exec mint-api ./scripts/is.sh
```

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