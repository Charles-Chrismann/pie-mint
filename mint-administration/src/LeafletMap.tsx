// LeafletMap.tsx
import { useEffect, useRef, useState } from 'react';
import * as L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { LastUpdatedRunner, Runner, Track } from './declarations';

export default function LeafletMap({ track, lastUpdatedRunner }: { track?: Track; lastUpdatedRunner?: LastUpdatedRunner }) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<L.Map>()
  const [markers, setMarkers] = useState<L.Marker[]>([])

  const [runners, setRunners] = useState<Runner[]>([])

  useEffect(() => {
    if (mapRef.current) {
      // Initialiser la carte
      const map = L.map(mapRef.current).setView([45.761401, 4.825875], 15); // Lyon

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(map);

      setMap(map)

      // Nettoyage si le composant est démonté
      return () => {
        map.remove();
      };
    }
  }, []);

  useEffect(() => {
    if(!track) return

    // const pointsChecking: [boolean, typeof track.points[number]][] = track.points.map(p => [false, p])

    const points: typeof track.points[number][] = []
    const firstPoint = track.points.find(p => p.is_first_point)!
    // firstPoint[0] = true
    points.push(firstPoint)

    let nextPointId = track.segments.find(s => s.start_position_id === firstPoint!.id)!.id
    let nextPoint = track.points.find(p => p.id === nextPointId)

    console.log(nextPointId, nextPoint)
    let i = 0

    while(nextPoint) {
      points.push(nextPoint)

      const nextSegment = track.segments.find(s => s.start_position_id === nextPoint!.id)
      if(!nextSegment) break;
      let nextPointId = nextSegment.end_position_id
      nextPoint = track.points.find(p => p.id === nextPointId)
    }

    console.log(points)

    const polyline = L.polyline(points.map((p: any) => [p['lat'], p['lng']]), { color: 'blue' }).addTo(map!);
    console.log(polyline)
    // map!.fitBounds(polyline.getBounds());

    // for(let p of track.points) {
    //   // L.marker([p['lat'], p['lng']])
    //   // .addTo(map!)
    // }
  }, [track])

  // useEffect(() => {
  //   // markers.forEach(m => m.remove())
  //   // runners.forEach(r => r.marker.setLatLng([r.position.lat, r.position.lng]).addTo(map!))
  //   // setMarkers(runners.map(r => r.marker))
  // }, [runners])

  useEffect(() => {
    if(!map) return
    if(!lastUpdatedRunner) return
    // console.log('lastUpdatedRunner', lastUpdatedRunner, runners.length)

    const runnerInRunners = runners.find(r => r.name === lastUpdatedRunner.name)

    const marker = runnerInRunners ? runnerInRunners.marker : L.marker([lastUpdatedRunner.position.lat, lastUpdatedRunner.position.lng])

    if(!runnerInRunners) {
      setRunners([...runners, {...lastUpdatedRunner, marker}])
      marker.addTo(map)
    }

    marker.setLatLng([lastUpdatedRunner.position.lat, lastUpdatedRunner.position.lng])

    // if(!map!.hasLayer(lastUpdatedRunner!.marker)) {
    //   lastUpdatedRunner!.marker.addTo(map!)
    // }
    // lastUpdatedRunner!.marker.setLatLng([lastUpdatedRunner!.position.lat, lastUpdatedRunner!.position.lng])
    // console.log(map!.hasLayer(lastUpdatedRunner!.marker))
  }, [lastUpdatedRunner])

  return <div ref={mapRef} style={{ height: '100vh', width: '100%' }} />;
}
