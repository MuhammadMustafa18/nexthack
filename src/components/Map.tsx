"use client";

import LeafletClientSetup from "@/app/LeafletClientSetup";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  CircleMarker,
} from "react-leaflet";
import LocationMarker from "./LocationMarker";
import SearchBox from "./SearchBox";
import { useEffect, useState, useMemo } from "react";
import { createClient } from "@/utils/supabase/client";
import { useTheme } from "next-themes";

type Event = {
  id: number;
  user_id: string;
  name: string;
  type: string | null; // hackathon, conference
  category: string | null;
  mode: string | null;
  host: string | null;
  latitude: number;
  longitude: number;
  start_date: string;
  end_date: string;
  prize_pool: string | null;
  registration_link: string | null;
  description: string | null;
  image_url: string | null;
  created_at: string;
  updated_at: string;
  source: string;
  confirmed: boolean;
};

interface propTypes {
  mapCoordinates: [number, number] | null;
  setSideBarViewOpen: (open: boolean) => void;
  setMapCoordinates: (coords: [number, number] | null) => void;
  setSelectedProperty: React.Dispatch<React.SetStateAction<Event | null>>;
  setPrimaryText: (primaryText: string) => void;
  setSecondaryText: (SecondaryText: string) => void;
  setLinkText: (LinkText: string) => void;
  // Add filter props
  typeFilter?: string | null; // Pass from parent component
  categoryFilter?: string | null;
  earliestEvent?: Event | null;
  setEarliestEvent: (earliestEvent: Event | null) => void;
  setAllEvents: (events: Event[]) => void
}

export default function Map({
  mapCoordinates,
  setMapCoordinates,
  setSideBarViewOpen,
  setSelectedProperty,
  setPrimaryText,
  setSecondaryText,
  setLinkText,
  typeFilter,
  categoryFilter,
  earliestEvent,
  setEarliestEvent,
  setAllEvents
}: propTypes) {
  const { resolvedTheme } = useTheme();

  const [locations, setLocations] = useState<Event[]>([]);

  const [localTypeFilter, setLocalTypeFilter] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    async function fetchData() {
      const { data, error } = await supabase.from("events").select("*");
      if (error) {
        console.error(error);
      } else {
        const cleaned = data.map((p) => ({
          ...p,
          latitude: parseFloat(p.latitude as unknown as string),
          longitude: parseFloat(p.longitude as unknown as string),
        }));
        setLocations(cleaned as Event[]);
        setAllEvents(cleaned as Event[]);
      }
    }
    fetchData();
  }, [supabase]);

  // Memoized filtered locations - use either prop filter or local filter
  const filteredLocations = useMemo(() => {
    return locations.filter((event) => {
      // Use prop filter if provided, otherwise use local filter
      const activeTypeFilter =
        typeFilter !== undefined ? typeFilter : localTypeFilter;

      // Apply type filter
      if (activeTypeFilter && event.type !== activeTypeFilter) {
        return false; // false means reject
      }

      // Apply category filter if provided
      if (
        categoryFilter &&
        event.mode?.toLowerCase() !== categoryFilter.toLowerCase()
      ) {
        return false;
      }

      return true; // true means keep this event
    });
  }, [locations, typeFilter, localTypeFilter, categoryFilter]);


  useEffect(() => {
    if (filteredLocations.length > 0) {
      const earliest = filteredLocations.reduce((earliest, current) => {
        return new Date(current.start_date) < new Date(earliest.start_date)
          ? current
          : earliest;
      });
      setEarliestEvent(earliest);
    } else {
      setEarliestEvent(null);
    }
  }, [filteredLocations]);

  // Get unique types for filter dropdown
  const uniqueTypes = useMemo(() => {
    const types = locations
      .map((event) => event.type)
      .filter(Boolean) as string[];
    return Array.from(new Set(types));
  }, [locations]);

  return (
    <div className="h-screen w-screen bg-[#D4DADC]">
      <LeafletClientSetup />

      <MapContainer
        key="main-map"
        center={[24.8607, 67.0011]}
        zoom={2}
        className="h-full w-full"
      >
        <TileLayer
          url={
            resolvedTheme === "dark"
              ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          }
          attribution='&copy; <a href="https://carto.com/">CARTO</a>, &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
        />

        {/* <SearchBox setMapCoordinates={setMapCoordinates} /> */}
        <LocationMarker
          mapCoordinates={mapCoordinates}
          setMapCordinates={setMapCoordinates}
        />

        {/* Render filtered locations instead of all locations */}
        {filteredLocations.map((p) => (
          <CircleMarker
            key={p.id}
            center={[p.latitude, p.longitude]}
            radius={earliestEvent && p.id === earliestEvent.id ? 6 : 4} // bigger for earliest
            pathOptions={{
              color:
                earliestEvent && p.id === earliestEvent.id
                  ? "orange" // outline
                  : resolvedTheme === "dark"
                  ? "black"
                  : "white",
              weight: 2,
              fillColor:
                earliestEvent && p.id === earliestEvent.id
                  ? "orange" // fill for earliest
                  : resolvedTheme === "dark"
                  ? "white"
                  : "black",
              fillOpacity: 0.9,
            }}
            eventHandlers={{
              click: () => {
                setSideBarViewOpen(true);
                // alert(
                //   `Property ID: ${p.id} SidebarView: ${setSideBarViewOpen}`
                // );
                setSelectedProperty(p);
                setPrimaryText("Viewing Event");
                setSecondaryText(`${p.name}`);
                setLinkText(`${p.registration_link}`);
              },
              mouseover: (e) => {
                e.target.openPopup();
              },
              mouseout: (e) => {
                e.target.closePopup();
              },
            }}
          >
            <Popup className="custom-popup">
              <div className="font-sans text-sm leading-relaxed text-gray-800 dark:text-gray-200 min-w-[200px]">
                <div className="text-base font-semibold text-blue-600 dark:text-blue-400 mb-2 capitalize">
                  {p.name}
                </div>
                <div className="flex flex-col gap-3 mb-1.5 text-xs text-gray-600 dark:text-gray-400">
                  {p.start_date}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Type: {p.mode || "Not specified"}
                </div>
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}
