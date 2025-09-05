import { useEffect, useState } from "react";
import { Marker, useMapEvents, Popup, useMap } from "react-leaflet";

interface propTypes {
  // setMapCordinates: [number, number] | null; // this is for variables
  mapCoordinates: [number, number] | null; // ✅ receives from parent (sidebar or click)

  setMapCordinates: (coords: [number, number] | null) => void;
}

export default function LocationMarker({ mapCoordinates, setMapCordinates }: propTypes) {
  const [position, setPosition] = useState<[number, number] | null>(null); // types and initial value
    const map = useMap();

useEffect(() => {
  if (mapCoordinates) {
    setPosition(mapCoordinates);
    map.flyTo(mapCoordinates, map.getZoom()); // smooth zoom to searched location
  }
}, [mapCoordinates, map]);
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setPosition([lat, lng]);
      console.log("clicked at: ", lat, lng);
      setMapCordinates([lat, lng]);
    },
  });

  return position === null ? null : (
    <Marker
      position={position}
      ref={(marker) => {
        if (marker) {
          // marker.openPopup();
          setTimeout(() => {
            marker.openPopup(); // lagana kis chez pe hai
          }, 0);
        }
      }}
    >
      <Popup>
        📍 Coordinates: <br />
        Lat: {position[0].toFixed(5)} <br />
        Lng: {position[1].toFixed(5)}
      </Popup>
    </Marker>
  );
}