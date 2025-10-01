"use client";
import LoginButton from "@/components/LoginLogoutButton";
// import Map from "@/components/Map";
import { MessageBox } from "@/components/MessageBox";
import RentSaleParent from "@/components/RentSaleParent";
import UserGreetText from "@/components/UserGreetText";
import { useEffect, useState } from "react";
import { SideBarAdd } from "./SideBarAdd";
import dynamic from "next/dynamic";
import { SidebarView } from "./SideBarView";
import FilterTabs from "./FilteredTabs";
import EventSearch from "./Search";
import { Search } from "lucide-react";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { SupportDialog } from "./Support";
import { FlippingText } from "./Flipping";
import { ProfileCard } from "./Profile";

type Event = {
  id: number;
  user_id: string; // uuid from profiles
  name: string;
  type: string | null;
  category: string | null;
  mode: string | null;
  host: string | null;
  latitude: number;
  longitude: number;
  start_date: string; // DATE → use string (ISO or yyyy-mm-dd)
  end_date: string; // DATE
  prize_pool: string | null;
  registration_link: string | null;
  description: string | null;
  image_url: string | null; // single image (or switch to string[] if you altered schema)
  created_at: string;
  updated_at: string;
  source: string;
  confirmed: boolean;
};

const Map = dynamic(() => import("@/components/Map"), { ssr: false });
export default function HomePage() {
  const [primaryText, setPrimaryText] = useState("NextHack");

  const [secondaryText, setSecondaryText] = useState("Find and Add Events");
  const [linkText, setLinkText] = useState("NextHack");

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mapCordinates, setMapCordinates] = useState<[number, number] | null>(
    null
  );

  const [sidebarViewOpen, setSidebarViewOpen] = useState(false);
  const [selectProperty, setSelectedProperty] = useState<Event | null>(null);

  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [mode, setMode] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(true);

  const [earliestEvent, setEarliestEvent] = useState<Event | null>(null);
  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [countdown, setCountdown] = useState<string>("");
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    if (!earliestEvent) {
      setCountdown("");
      return;
    }

    const interval = setInterval(() => {
      const now = new Date();
      const eventDate = new Date(earliestEvent.start_date);

      const diff = eventDate.getTime() - now.getTime();

      if (diff <= 0) {
        setCountdown("Event started!");
        clearInterval(interval);
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setCountdown(`${days}d ${hours}h ${minutes}m ${seconds}s`);
    }, 1000);

    return () => clearInterval(interval);
  }, [earliestEvent]);

  const availableTypes = ["hackathon", "conference", "workshop", "cp"];
  useEffect(() => {
    if (primaryText === "Add Event" && !sidebarOpen) {
      setSidebarOpen(true);
    }
    if (primaryText === "Viewing Property" && !sidebarViewOpen) {
      setSidebarViewOpen(true);
    }
  }, [primaryText]); // sidebaropen ko modify karega sidebar component
  return (
    <div className="relative">
      <div className="absolute z-1 right-0"> {/* <UserGreetText /> */}</div>
      <div className="absolute z-1 right-0"> {/* <LoginButton /> */}</div>
      <div className="absolute z-0">
        {" "}
        <Map
          mapCoordinates={mapCordinates}
          setMapCoordinates={setMapCordinates}
          setSideBarViewOpen={setSidebarViewOpen}
          setSelectedProperty={setSelectedProperty}
          setPrimaryText={setPrimaryText}
          setSecondaryText={setSecondaryText}
          setLinkText={setLinkText}
          typeFilter={selectedType}
          categoryFilter={mode}
          earliestEvent={earliestEvent}
          setEarliestEvent={setEarliestEvent}
          setAllEvents={setAllEvents}
        />
      </div>
      {/* <div className="absolute z-1">
        <RentSaleParent
          setPrimaryText={setPrimaryText}
          setSecondaryText={setSecondaryText}
        />
      </div> */}
      {/* <div className="absolute top-0 left-0 text-4xl text-white">{mode}</div> */}
      {/* {earliestEvent && (
        <div className="absolute top-0 left-0 text-4xl font-mono">
          Next: {earliestEvent.name} <br />
          Starts in: {countdown}
        </div>
      )} */}
      <div className="absolute top-5 left-3 z-10">
        <ProfileCard
          name="Muhammad Mustafa"
          title="Student in FAST University, Karachi"
          imageUrl=""
          socialLinks={{
            email: "mustafatariq365@protonmail.com",
            github: "https://github.com/MuhammadMustafa18",
            linkedin: "https://www.linkedin.com/in/muhammad-mustafa-7b4863266/",
          }}
        />
      </div>

      <div className="absolute z-10">
        <FilterTabs
          selectedType={selectedType}
          onTypeChange={setSelectedType}
          availableTypes={availableTypes}
          Mode={mode}
          setMode={setMode}
          visible={expanded}
        />
      </div>
      <div className="absolute top-5 right-3 z-10">
        <SupportDialog setPrimaryText={setPrimaryText}/>
      </div>
      <div className="absolute top-5 left-1/2 transform -translate-x-1/2 z-10">
        <EventSearch events={allEvents} />
      </div>

      <div className="absolute z-1">
        <MessageBox
          primary={primaryText}
          secondary={secondaryText}
          setPrimaryText={setPrimaryText}
          setSecondaryText={setSecondaryText}
          thirdary=""
          earliest={earliestEvent}
          countdown={countdown}
          isExpanded={expanded}
          setIsExpanded={setExpanded}
        />
      </div>
      {primaryText === "Add Event" && (
        <SideBarAdd
          open={sidebarOpen}
          setIsOpen={setSidebarOpen}
          mapCordinates={mapCordinates}
          setMapCoordinates={setMapCordinates}
        />
      )}
      {primaryText === "Viewing Event" && (
        <SidebarView
          open={sidebarViewOpen}
          onOpenChange={setSidebarViewOpen}
          event={selectProperty}
        />
      )}
    </div>
  );
}
