import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {MapContainer, Marker, Popup, TileLayer} from "react-leaflet";
import { useEffect, useRef, useState } from "react";
import type { Track, TrackPoint } from "@/declarations";

export default function TrackPreview({track}: {track: TrackPoint[]}) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<L.Map>()

  useEffect(() => {
    if (!mapRef.current) return
    // Initialiser la carte
    const map = L.map(mapRef.current).setView([45.761401, 4.825875], 15); // Lyon

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    const polyline = L.polyline(track.map((p) => [p.lat, p.lng]), { color: 'blue' }).addTo(map!);
    map.fitBounds(polyline.getBounds());

    setMap(map)

    // Nettoyage si le composant est démonté
    return () => {
      map.remove();
    };
  }, []);

  // return <MapContainer style={{width: "400px", height: "400px"}} center={[45.761401, 4.825875]} zoom={15} scrollWheelZoom={true}>
  //   <TileLayer
  //     attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  //     url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
  //   />
  //   <Marker position={[45.761401, 4.825875]}>
  //     <Popup>
  //       A pretty CSS3 popup. <br /> Easily customizable.
  //     </Popup>
  //   </Marker>
  // </MapContainer>;
  return <div ref={mapRef} style={{width: "100%", height: "100%"}} />;
  // return <div ref={mapRef} style={{width: "100%", height: "100vh"}} />;
}