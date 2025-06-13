# Setup

Le backend est séparée en deux serveurs, `mint-server` et `mint-ws-runners`, avec des responsabilités différentes:

> [!NOTE]
> Les projets peuvent être amenés à être renommé.

`mint-server` est l'api REST de l'application, qui permet de consulter des courses, l'authentification

`mint-ws-runners` est le serveur websocket auquel les coureurs et les spectateurs se connecteront pour recevoir les mises à jours en direct de la course

`ws-tests` est un utilitaire qui permet d'émuler une course et des coureurs.

`mint-administration` est un client destiné au débug de l'app `ws-tests`.

## Setup des différents projets

Requirements: 

- Node
- Docker

### `mint-server`

1. Install dependancies

```
cd mint-server
npm i 
```

2. Clone the .env.example and rename it .env

3. The following commande drops the database, init it and seed it
```
npm run db:dis
```

4. Start dev server
```
npm run start:dev
```

### `mint-ws-runners`

1. Install dependancies

```
cd mint-server
npm i 
```

2. Start dev server
```
npm run start:dev
```

For now the wbesocket server only listen for `position` event and emits `position` events to connected clients

### `ws-tests`

1. Install dependancies

```
cd ws-tests
npm i 
```

2. (optional) create runs.json