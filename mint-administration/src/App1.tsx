import { useEffect, useRef, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import * as L from 'leaflet'
import LeafletMap from './LeafletMap'
import type { LastUpdatedRunner, Runner, Track } from './declarations'
import { socket } from './socket'

function App() {
  const [pos, setPos] = useState("no pos")
  const [error, setError] = useState("no error")
  const [start, setStart] = useState(new Date)
  const [end, setEnd] = useState(new Date)
  const [count, setCount] = useState(0)
  const [track, setTrack] = useState<Track>()
  const [lastUpdatedRunner, setLastUpdatedRunner] = useState<LastUpdatedRunner>()
  
  // const mapContainer = useRef<HTMLElement | null>(null);

  // const options = {
  //   enableHighAccuracy: false,
  //   timeout: 50000,
  //   maximumAge: 0,
  // };

  // function success(pos: any) {
  //   var crd = pos.coords;

  //   console.log("Votre position actuelle est :");
  //   console.log(`Latitude : ${crd.latitude}`);
  //   console.log(`Longitude : ${crd.longitude}`);
  //   console.log(`La précision est de ${crd.accuracy} mètres.`);

  //   setPos(JSON.stringify(pos))
  //   setEnd(new Date)
  //   setCount(Math.random())
  // }

  // function errorFunction(err: any) {
  //   setError(JSON.stringify(err))
  //   console.warn(`ERREUR (${err.code}): ${err.message}`);
  // }
  
  // function triggerPos() {
  //   setError("no error")
  //   setStart(new Date)
  //   navigator.geolocation.watchPosition(success, errorFunction, options);
  // }

  // useEffect(() => {
  //   triggerPos()
  // }, [])

  const [isConnected, setIsConnected] = useState(socket.connected);
  const [fooEvents, setFooEvents] = useState<any[]>([]);

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    function onFooEvent(value: any) {
      setFooEvents(previous => [...previous, value]);
    }

    function onPosition(data: Runner) {
      // console.log('update', data.name, data)

      // const runnersCopy = [...runners]

      // const runnerToUpdate = runnersCopy.find(r => r.name === data.name)
      // console.log(runnersCopy, data.name)
      // console.log(runnerToUpdate)
      // if(!runnerToUpdate) runnersCopy.push({
      //   name: data.name,
      //   position: {
      //     lat: data.position.lat,
      //     lng: data.position.lng,
      //   },
      //   marker: L.marker([data.position.lat, data.position.lng])
      // })
      // else runnerToUpdate.position = {
      //   lat: data.position.lat,
      //   lng: data.position.lng,
      // }

      // console.log(runnersCopy)

      // setRunners(runnersCopy)
      setLastUpdatedRunner({
        name: data.name,
        position: {
          lat: data.position.lat,
          lng: data.position.lng,
        }
      })
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('foo', onFooEvent);
    socket.on('position', onPosition)

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('foo', onFooEvent);
      socket.off('position', onPosition)
    };
  }, []);

  useEffect(() => {
    async function loadTrack() {
      const res = await fetch('http://localhost:3000/sub-events/2/track')
      const data = await res.json()
      
      setTrack(data)
    }

    loadTrack()

  }, [])

  return (
    <LeafletMap track={track} lastUpdatedRunner={lastUpdatedRunner} />
  );


  return (
    <>
      {/* <div id='map' style={{width: "100%", height: "70vh"}}></div> */}
    {/* <div style={{width: "100%"}}>
      <div>
        {count}
      </div>
      <div>
        {start.toISOString()}-----------{end.toISOString()}
      </div>
      <div style={{width: "100%", wordBreak: 'break-all'}}>
        {pos}
      </div>
      <div>
        {error}
    </div>
    <button onClick={triggerPos}>Trigger pos la</button>
    </div> */}
    </>
  )
}

export default App
