import { useEffect, useState } from 'react'
import './App.css'
import type { LastUpdatedRunner, Runner, Track } from './declarations'
import { socket } from './socket'

function App() {
  const [_pos, _setPos] = useState("no pos")
  const [_error, _setError] = useState("no error")
  const [_start, _setStart] = useState(new Date)
  const [_end, _setEnd] = useState(new Date)
  const [_count, _setCount] = useState(0)
  const [_track, setTrack] = useState<Track>()
  const [_lastUpdatedRunner, setLastUpdatedRunner] = useState<LastUpdatedRunner>()
  
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

  const [_isConnected, setIsConnected] = useState(socket.connected);

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
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
        runner_id: data.runner_id,
        position: {
          lat: data.position.lat,
          lng: data.position.lng,
        }
      })
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('position', onPosition)

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('position', onPosition)
    };
  }, []);

  useEffect(() => {
    async function loadTrack() {
      const res = await fetch('http://localhost:3000/races/2/track')
      const data = await res.json()
      
      setTrack(data)
    }

    loadTrack()

  }, [])

  return (
    <div></div>
    // <LeafletMap track={track} lastUpdatedRunner={lastUpdatedRunner} />
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
