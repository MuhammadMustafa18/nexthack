"use client";

import LeafletClientSetup from "@/app/LeafletClientSetup";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import LocationMarker from "./LocationMarker";
import SearchBox from "./SearchBox";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

type Property = {
  id: number;
  user_id: string;
  full_address: string | null;
  rooms: number | null;
  type: string | null;
  demand: number | null;
  contact: string | null;
  latitude: number;
  longitude: number;
  created_at: string;
};


interface propTypes {
  
  mapCoordinates: [number, number] | null; // ✅ receives from parent (sidebar or click)
  setSideBarViewOpen: (open: boolean) => void;
  setMapCoordinates: (coords: [number, number] | null) => void;
  setSelectedProperty: React.Dispatch<React.SetStateAction<Property | null>>
  setPrimaryText: (primaryText: string) => void;
}
export default function Map({
  mapCoordinates,
  setMapCoordinates,
  setSideBarViewOpen,
  setSelectedProperty,
  setPrimaryText,
}: propTypes) {
  const [locations, setLocations] = useState<Property[]>([]);
  const supabase = createClient();
  useEffect(() => {
    async function fetchData() {
      const { data, error } = await supabase.from("properties").select("*");
      if (error) {
        console.error(error);
      } else {
        // first convert the cordinate strings to numbers
        const cleaned = data.map((p) => ({
          ...p,
          latitude: parseFloat(p.latitude as unknown as string),
          longitude: parseFloat(p.longitude as unknown as string),
        }));
        setLocations(cleaned as Property[]);
      }
    }
    fetchData();
  }, [supabase]);
  return (
    <div className="h-screen w-screen bg-[#D4DADC]">
      <LeafletClientSetup />

      <MapContainer
        key="main-map"
        center={[24.8607, 67.0011]} // Karachi coords
        zoom={2}
        // scrollWheelZoom={true}
        className="h-full w-full"
      >
        {/* OpenStreetMap tiles */}
        {/* <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OSM</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        /> */}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://carto.com/">CARTO</a>, &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
        />
        {/* ✅ add search bar */}
        <SearchBox setMapCoordinates={setMapCoordinates} />
        {/* Example marker */}

        <LocationMarker
          mapCoordinates={mapCoordinates}
          setMapCordinates={setMapCoordinates}
        />
        {locations.map((p) => (
          <Marker
            key={p.id}
            position={[p.latitude, p.longitude]}
            eventHandlers={{
              click: () => {
                // console.log("Marker clicked:", p.id);
                setSideBarViewOpen(true);
                alert(
                  `Property ID: ${p.id} SidebarView: ${setSideBarViewOpen}`
                );
                setSelectedProperty(p);
                setPrimaryText("Viewing Property"); // is waja se
              },
              mouseover: (e) => {
                e.target.openPopup(); // show popup on hover
              },
              mouseout: (e) => {
                e.target.closePopup(); // hide popup when mouse leaves
              },
            }}
          >
            <Popup>
              <b>{p.type}</b>
              <br />
              {p.full_address}
              <br />
              Rooms: {p.rooms}
              <br />
              Demand: {p.demand}
              <br />
              Contact: {p.contact}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
