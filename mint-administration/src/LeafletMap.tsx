import { useEffect, useRef, useState } from 'react';
import * as L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { LastUpdatedRunner, LineString, Runner } from './declarations';

function animateMarker(
  marker: L.Marker,
  toLatLng: L.LatLngExpression,
  duration: number = 1000
): void {
  const fromLatLng: L.LatLng = marker.getLatLng();
  const to = L.latLng(toLatLng);
  const start = performance.now();

  function animate(time: number) {
    const progress = Math.min((time - start) / duration, 1);

    const lat = fromLatLng.lat + (to.lat - fromLatLng.lat) * progress;
    const lng = fromLatLng.lng + (to.lng - fromLatLng.lng) * progress;

    marker.setLatLng([lat, lng]);

    if (progress < 1) {
      requestAnimationFrame(animate);
    }
  }

  requestAnimationFrame(animate);
}

export default function LeafletMap({ track, lastUpdatedRunners, mapStyle }: { track?: LineString[]; lastUpdatedRunners?: LastUpdatedRunner[], mapStyle: L.TileLayer }) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<L.Map>()
  const [_markers, _setMarkers] = useState<L.Marker[]>([])
  const [currentLayer, setCurrentLayer] = useState(mapStyle)

  const [runners, setRunners] = useState<Runner[]>([])

  useEffect(() => {
    if (mapRef.current) {
      // Initialiser la carte
      const map = L.map(mapRef.current).setView([47.218371, -1.553621], 15);


      mapStyle.addTo(map);

      setMap(map)

      // Nettoyage si le composant est démonté
      return () => {
        map.remove();
      };
    }
  }, []);

  useEffect(() => {
    if (!map) return
    map.removeLayer(currentLayer)
    mapStyle.addTo(map)
    setCurrentLayer(mapStyle)
  }, [mapStyle]);

  useEffect(() => {
    if (!track) return

    // const pointsChecking: [boolean, typeof track.points[number]][] = track.points.map(p => [false, p])

    // const points: typeof track.points[number][] = []
    // const firstPoint = track.points.find(p => p.is_first_point)!
    // // firstPoint[0] = true
    // points.push(firstPoint)

    // let nextPointId = track.segments.find(s => s.start_position_id === firstPoint!.id)!.id
    // let nextPoint = track.points.find(p => p.id === nextPointId)

    // console.log(nextPointId, nextPoint)
    // let i = 0

    // while(nextPoint) {
    //   points.push(nextPoint)

    //   const nextSegment = track.segments.find(s => s.start_position_id === nextPoint!.id)
    //   if(!nextSegment) break;
    //   let nextPointId = nextSegment.end_position_id
    //   nextPoint = track.points.find(p => p.id === nextPointId)
    // }

    // console.log(points)

    console.log(track)

    const geoJSON = L.geoJSON(track, {
      style: {
        color: 'blue',
        weight: 4
      }
    }).addTo(map!);
    console.log(geoJSON)
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
    if (!map || !lastUpdatedRunners?.length) return;

    const updatedRunners = [...runners];

    lastUpdatedRunners.forEach(lastUpdatedRunner => {
      const existingIndex = updatedRunners.findIndex(r => r.runner_id === lastUpdatedRunner.runner_id);

      const htmlIcon = L.divIcon({
        className: 'custom-marker',
        html: `<div class="rounded-full border bg-white w-6 aspect-square grid place-items-center border-black">
               ${lastUpdatedRunner.name.split(' ').map(i => i.charAt(0)).join('')}
             </div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });
      
      let marker;
      if (existingIndex !== -1) {
        marker = updatedRunners[existingIndex].marker;
      } else {
        marker = L.marker(
          [lastUpdatedRunner.position.lat, lastUpdatedRunner.position.lng],
          { icon: htmlIcon }
        ).addTo(map);

        updatedRunners.push({ ...lastUpdatedRunner, marker });
      }

      animateMarker(marker, [lastUpdatedRunner.position.lat, lastUpdatedRunner.position.lng], 1000);
    });

    setRunners(updatedRunners);
  }, [lastUpdatedRunners]);


  return (
    <div className='h-full w-full z-[-1]'>
      <div ref={mapRef} style={{ height: '100%', width: '100%' }} />
    </div>
  );
}
