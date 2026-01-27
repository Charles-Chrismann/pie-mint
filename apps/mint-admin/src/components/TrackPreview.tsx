import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useRef } from "react";
import type { LineString } from "@/declarations";
import { MAP_STYLES } from "@/constants";

export default function TrackPreview({
  track,
  mapStyle = "light"
}: {
  track: LineString,
  mapStyle?: keyof typeof MAP_STYLES
}) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapRefInstance = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapRefInstance.current) return;

    // Initialiser la carte
    const map = L.map(mapRef.current); // Lyon
    mapRefInstance.current = map;

    MAP_STYLES[mapStyle]().addTo(map);

    // const polyline = L.polyline(track.map((p) => [p.lat, p.lng]), { color: 'blue' }).addTo(map!);
    const geoJSON = L.geoJSON(track, {
      style: {
        color: 'blue',
        weight: 4
      }
    }).addTo(map);
    map.fitBounds(geoJSON.getBounds());

    // Nettoyage si le composant est démonté
    return () => {
      map.remove();
      mapRefInstance.current = null;
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
  return <div ref={mapRef} style={{ width: "100%", height: "100%" }} />;
  // return <div ref={mapRef} style={{width: "100%", height: "100vh"}} />;
}