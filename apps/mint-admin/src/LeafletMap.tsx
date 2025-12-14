import { useEffect, useRef, useState, type Dispatch, type SetStateAction } from 'react';
import * as L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { LastUpdatedRunner, LineString, Registration, Runner } from './declarations';
import { CanvasCustomMarker } from './CanvasCustomMarker';

function animateMarker(
  marker: L.CircleMarker,
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

function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

export default function LeafletMap({
  track,
  lastUpdatedRunners,
  mapStyle,
  raceRunners,
  runners,
  setRunners,
}: {
  track?: LineString,
  lastUpdatedRunners?: LastUpdatedRunner[],
  mapStyle: L.TileLayer,
  raceRunners: Registration[],
  runners: Runner[],
  setRunners: Dispatch<SetStateAction<Runner[]>>,
}) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<L.Map>()
  const [_markers, _setMarkers] = useState<L.CircleMarker[]>([])
  const [currentLayer, setCurrentLayer] = useState(mapStyle)

  const canvasRef = useRef(L.canvas({ pane: "canvas" }))
  const geoJSONRef = useRef<L.GeoJSON>(null)

  useEffect(() => {
    if (mapRef.current) {
      // Initialiser la carte
      const map = L.map(mapRef.current).setView([47.218371, -1.553621], 15);
      const canvasPane = map.createPane("canvas");
      canvasPane.style.zIndex = "1000";  // au-dessus des autres overlays
      // canvasLayer.addTo(map);


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

    if(geoJSONRef.current) {
      geoJSONRef.current.remove()
    }

    geoJSONRef.current = L.geoJSON(track, {
      style: {
        color: 'blue',
        weight: 4
      }
    }).addTo(map!);
    map!.fitBounds(geoJSONRef.current.getBounds());
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
      const existingIndex = updatedRunners.findIndex(r => r.userId === lastUpdatedRunner.userId);

      let marker: CanvasCustomMarker;
      if (existingIndex !== -1) {
        marker = updatedRunners[existingIndex].marker;
      } else {
        console.log(raceRunners, lastUpdatedRunner, lastUpdatedRunner.userId)
        // const rr = raceRunners.find(rr => rr.user_profile.id === lastUpdatedRunner.userId)!

        const color = getRandomColor()
        marker = new CanvasCustomMarker([lastUpdatedRunner.lat, lastUpdatedRunner.lon], {
          renderer: canvasRef.current,
          color,
          // imageSrc: `https://`
        })

        marker.on('click', () => {
          // setSelectedRunner(rr)
        }).addTo(map);

        updatedRunners.push({ ...lastUpdatedRunner, marker, color });
      }

      animateMarker(marker, [lastUpdatedRunner.lat, lastUpdatedRunner.lon], 1000);
    });

    setRunners(updatedRunners);
  }, [lastUpdatedRunners]);


  return (
    <div className='h-full w-full z-[-1]'>
      <div ref={mapRef} style={{ height: '100%', width: '100%' }} />
    </div>
  );
}
