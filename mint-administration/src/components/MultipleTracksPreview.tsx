import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useRef, useState } from "react";
import type { ApiResponseGetOrganizationTracks, Track, TrackPoint } from "@/declarations";
import { Button } from "./ui/button";
import { MapPinned } from "lucide-react";

export default function MultipleTracksPreview({ tracks }: { tracks: ApiResponseGetOrganizationTracks }) {
  const mapRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<L.Map>()
  const [isFullScreen, setIsFullScreen] = useState(false)
  const [clickedPos, setClickedPos] = useState<{ lat: number, lng: number }>()

  const lastClickedMarkerRef = useRef<L.Marker | null>(L.marker([0, 0]));

  const layerMap = new Map<string, L.TileLayer>()
  layerMap.set("a",
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    })
  )
  layerMap.set("b",
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
    })
  )

  useEffect(() => {
    if (!mapRef.current) return
    if (!tracks.length) return

    // Initialiser la carte
    const map = L.map(mapRef.current).setView([45.761401, 4.825875], 15); // Lyon

    map.on('click', (e: L.LeafletMouseEvent) => {
      const lat = e.latlng.lat;
      const lng = e.latlng.lng;
      // console.log(`Clique à la position : ${lat}, ${lng}`);
      setClickedPos({ lat, lng })
    });


    layerMap.get("b")!.addTo(map);

    const trackDefaultStyle = {
      color: 'blue'
    }


    const polylines = tracks.map(t => {

      let isSelected = false

      const polyline = L.polyline(t.track_points.map((p) => [p.lat, p.lng]), trackDefaultStyle).addTo(map!);

      polyline.on('mouseover', (e) => {
        const layer = e.target as L.Polyline

        if (!isSelected) {
          layer.setStyle({
            color: 'red',
            opacity: 1,
            weight: 5,
          });
        }



        layer.bringToFront();
      })

      polyline.on('mouseout', (e) => {
        const layer = e.target
        if (!isSelected) {
          layer.setStyle(trackDefaultStyle);
        }
      })

      polyline.on('click', (e) => {
        console.log(t)
        const layer = e.target as L.Polyline

        isSelected = !isSelected

        if (isSelected) {
          layer.setStyle({
            color: 'red',
            opacity: 1,
            weight: 5,
          });
        }
      })


      return polyline
    })


    map.fitBounds(polylines[polylines.length - 1].getBounds());

    setMap(map)

    // Nettoyage si le composant est démonté
    return () => {
      map.remove();
    };
  }, [tracks]);

  useEffect(() => {
    console.log(lastClickedMarkerRef.current)
    if (!clickedPos || !lastClickedMarkerRef.current) return;
    lastClickedMarkerRef.current.setLatLng([clickedPos.lat, clickedPos.lng]);
    if(!lastClickedMarkerRef.current['_map']) lastClickedMarkerRef.current.addTo(map!)
  }, [clickedPos])

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

  function toggleFullScreen() {
    if (!isFullScreen) containerRef.current!.requestFullscreen()
    else document.exitFullscreen()

    setIsFullScreen(!isFullScreen)
  }

  function handleOpenMaps() {
    const { lat, lng } = clickedPos!
    const url = `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${lat},${lng}`;
    window.open(url, '_blank');
  }

  return (
    <div
      className="relative w-full h-full"
      onDoubleClick={toggleFullScreen}
      ref={containerRef}
    >
      <div className="absolute right-20 bottom-20 z-9999">
        {
          clickedPos && <Button onClick={handleOpenMaps}>
            <MapPinned />
          </Button>
        }
      </div>
      <div
        ref={mapRef}
        style={{ width: "100%", height: "100%" }}>
      </div>
    </div>
  );
  // return <div ref={mapRef} style={{width: "100%", height: "100vh"}} />;
}