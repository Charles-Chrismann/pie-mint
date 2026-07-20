# Fonctionnement du websocket:



Pour se connecter en au websocket:

```ts
export const socket = io(`http://mint-dev-ws.charles-chrismann.fr`, {
  autoConnect: true
});
```

Pour recevoir les événements de la course:

```ts
socket.emit('join-race', id) // L'id viens de https://back-mint-node.vercel.app/race/ (_id)
```

Pour ne plus recevoir les évènement de la course:

```ts
socket.emit('leave-race', id)
```

> NOTE: veiller à quitter une course avant d'en rejoindre une autre, sinon le client reçoit les évènements des 2 courses.

Ecouter les évènements:

```ts
socket.on('positions', (data: PositionData) {
	// mettre à jour la position et le ranking
})

interface PositionData {
	positions: [
		string, // L'id du coureur
		number,	// longitude
		number,	// latitude
		number	// altitude
	][]
	ranking: [
		string, // L'id du coureur
		number	// La distance parcourue en mètres par le coureur
	][]
}
```

> NOTE: Les évènement n'arrivent qu'au moment ou la course débute.
