import { useState } from "react";
import { Marker, useMapEvents, Popup } from "react-leaflet";

export default function LocationMarker(){
    const [position, setPosition] = useState<[number, number] | null>(null) // types and initial value

    useMapEvents({
        click(e){
            const {lat,lng} = e.latlng;
            setPosition([lat,lng])
            console.log("clicked at: ", lat,lng)
        }
    })

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