"use client"
import LoginButton from "@/components/LoginLogoutButton";
// import Map from "@/components/Map";
import { MessageBox } from "@/components/MessageBox";
import RentSaleParent from "@/components/RentSaleParent";
import UserGreetText from "@/components/UserGreetText";
import { useEffect, useState } from "react";
import { SideBarAdd } from "./SideBarAdd";
import dynamic from "next/dynamic";
import { SidebarView } from "./SideBarView";

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


const Map = dynamic(() => import("@/components/Map"), { ssr: false });
export default function HomePage() {
    const [primaryText, setPrimaryText] = useState("Property Cast")
    const [secondaryText, setSecondaryText] = useState("Search and Add Properties");
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [mapCordinates, setMapCordinates] = useState<[number, number] | null>(null)

    const [sidebarViewOpen, setSidebarViewOpen] = useState(false)
    const [selectProperty, setSelectedProperty] = useState<Property | null>(null)
  useEffect(() => {
    if (primaryText === "Add Property" && !sidebarOpen) {
      setSidebarOpen(true);
    }
    if (primaryText === "Viewing Property" && !sidebarViewOpen) {
      setSidebarViewOpen(true);
    }
  }, [primaryText]); // sidebaropen ko modify karega sidebar component
  return (
    <div className="relative">
      <div className="absolute z-1 right-0">
        {" "}
        <UserGreetText />
      </div>
      <div className="absolute z-1 right-0">
        {" "}
        <LoginButton />
      </div>
      <div className="absolute z-0">
        {" "}
        <Map
          mapCoordinates={mapCordinates}
          setMapCoordinates={setMapCordinates}
          setSideBarViewOpen={setSidebarViewOpen}
          setSelectedProperty={setSelectedProperty}
          setPrimaryText={setPrimaryText}
        />
      </div>
      {/* <div className="absolute z-1">
        <RentSaleParent
          setPrimaryText={setPrimaryText}
          setSecondaryText={setSecondaryText}
        />
      </div> */}
      <div className="absolute z-1">
        <MessageBox
          primary={primaryText}
          secondary={secondaryText}
          setPrimaryText={setPrimaryText}
          setSecondaryText={setSecondaryText}
          thirdary=""
        />
      </div>
      {primaryText === "Add Property" && (
        <SideBarAdd
          open={sidebarOpen}
          setIsOpen={setSidebarOpen}
          mapCordinates={mapCordinates}
          setMapCoordinates={setMapCordinates}
        />
      )}
      {primaryText === "Viewing Property" && (
        <SidebarView
          open={sidebarViewOpen}
          onOpenChange={setSidebarViewOpen}
          property={selectProperty}
        />
      )}
    </div>
  );
}
