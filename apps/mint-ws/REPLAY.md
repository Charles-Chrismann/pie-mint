This document explains how to get the available replays of the races, the ranking and positions representes the state of the race each second from de startDate

The replays interface is as follow:

```ts
interface Replay {
  id: string
  name: string
  startDate: string // ex: "2026-07-22T07:28:23.190Z"
  ranking: string[][] // The evolution of the ranking each second, starting form `startDate`, the string is the userId
  positions: {
    userId: string
    positions: [number, number][] // the [longitude, latitude] of the user each second
  }[]
  gpx: string
}
```

get all replays:

```
GET http://mint-dev-ws.charles-chrismann.fr/replays
  => Replay[]
```

get replay by id:

```
GET http://mint-dev-ws.charles-chrismann.fr/replays/id
  => Replay
```

> NOTE: the api is in http, not https.