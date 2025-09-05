"use client"
import LoginButton from "@/components/LoginLogoutButton";
import Map from "@/components/Map";
import { MessageBox } from "@/components/MessageBox";
import RentSaleParent from "@/components/RentSaleParent";
import UserGreetText from "@/components/UserGreetText";
import { useEffect, useState } from "react";
import { SideBarAdd } from "./SideBarAdd";

export default function HomePage() {
    const [primaryText, setPrimaryText] = useState("Property Cast")
    const [secondaryText, setSecondaryText] = useState("Search and Add Properties");
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [mapCordinates, setMapCordinates] = useState<[number, number] | null>(null)
  useEffect(() => {
    if (primaryText === "Add Property" && !sidebarOpen) {
      setSidebarOpen(true);
    }
  }, [primaryText, sidebarOpen]); // sidebaropen ko modify karega sidebar component
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
        <Map setMapCoordinates={setMapCordinates}/>
      </div>
      <div className="absolute z-1">
        <RentSaleParent
          setPrimaryText={setPrimaryText}
          setSecondaryText={setSecondaryText}
        />
      </div>
      <div className="absolute z-1">
        <MessageBox
          primary={primaryText}
          secondary={secondaryText}
          thirdary=""
        />
      </div>
      {primaryText === "Add Property" && (
        <SideBarAdd open={sidebarOpen} setIsOpen={setSidebarOpen} mapCordinates={mapCordinates}/>
      )}
    </div>
  );
}
