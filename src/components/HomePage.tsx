"use client"
import LoginButton from "@/components/LoginLogoutButton";
import Map from "@/components/Map";
import { MessageBox } from "@/components/MessageBox";
import RentSaleParent from "@/components/RentSaleParent";
import UserGreetText from "@/components/UserGreetText";
import { useState } from "react";

export default function HomePage() {
    const [primaryText, setPrimaryText] = useState("Property Cast")
    const [secondaryText, setSecondaryText] = useState("Search and Add Properties");

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
        <Map />
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
    </div>
  );
}
