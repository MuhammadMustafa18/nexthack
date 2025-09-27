"use client";

import LeafletClientSetup from "@/app/LeafletClientSetup";
import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from "react-leaflet";
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
  images: string[]; // <-- array of Cloudinary URLs
  streetview_url: string
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
          <CircleMarker
            key={p.id}
            center={[p.latitude, p.longitude]}
            radius={5}
            pathOptions={{
              color: "white",
              weight: 2,
              fillColor: "black",
              fillOpacity: 0.9,
            }}
            eventHandlers={{
              click: () => {
                // console.log("Marker clicked:", p.id);
                setSideBarViewOpen(true);
                // alert(
                //   `Property ID: ${p.id} SidebarView: ${setSideBarViewOpen}`
                // );
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
              <div className="font-sans text-sm leading-relaxed text-gray-800 min-w-[200px]">
                <div className="text-base font-semibold text-blue-600 mb-2 capitalize">
                  {p.type}
                </div>

                <div className="mb-1.5 text-gray-500 text-xs">
                  📍 {p.full_address}
                </div>

                <div className="flex gap-3 mb-1.5 text-xs">
                  <span className="text-emerald-600">
                    🏠 <span className="font-medium">{p.rooms}</span> rooms
                  </span>
                  <span className="text-red-600">
                    📊 <span className="font-medium">{p.demand}</span>
                  </span>
                </div>

                <div className="mt-2 px-2 py-1.5 bg-gray-100 rounded text-xs text-gray-700">
                  📞 {p.contact}
                </div>
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}
