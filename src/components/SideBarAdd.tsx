"use client";

import React, { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";


import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

// import SearchBox from "./SearchBox";
import dynamic from "next/dynamic";
const SearchInSideBar = dynamic(() => import("@/components/SearchInSidebar"), {
  ssr: false,
});
import { useRouter } from "next/navigation";

const SearchBox = dynamic(() => import("@/components/SearchBox"))


interface SideBarProps {
  open: boolean;
  setIsOpen: (open: boolean) => void;
  mapCordinates: [number, number] | null;
  setMapCoordinates: (coords: [number, number] | null) => void;
}

export function SideBarAdd({
  open,
  setIsOpen,
  mapCordinates,
  setMapCoordinates,
}: SideBarProps) {
  const [form, setForm] = useState({
    full_address: "",
    rooms: "",
    type: "rent",
    demand: "",
    contact: "",
  });
  const supabase = createClient(); // <-- call the function
  const router = useRouter();
  function handleChangeEvent(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); // what does this do?
    if (!mapCordinates) {
      alert("Please select a location on the map.");
      return;
    }
    const user = (await supabase.auth.getUser()).data.user;
    
    console.log(user)
    if (!user) {
      alert("You must be logged in to add a property.");
      router.push("/login");
      return;
    }
    // this is the function not the client
    // const user = (await createClient.auth.getUser()).data.user;

    const { data, error } = await supabase.from("properties").insert([
      {
        user_id: user.id,
        full_address: form.full_address,
        rooms: form.rooms ? parseInt(form.rooms) : null,
        type: form.type,
        demand: form.demand ? parseFloat(form.demand) : null,
        contact: form.contact,
        latitude: mapCordinates[0],
        longitude: mapCordinates[1],
      },
    ]);

    if (error) {
      console.error("Error inserting property:", error);
      alert("Failed to save property.");
    } else {
      console.log("Property inserted:", data);
      setIsOpen(false);
      setForm({
        full_address: "",
        rooms: "",
        type: "rent",
        demand: "",
        contact: "",
      });
      setMapCoordinates(null);
    }
  }

  return (
    <Sheet open={open} onOpenChange={setIsOpen} modal={false}>
      <SheetContent
        side="left"
        className="w-[400px] sm:w-[500px] px-4"
        onInteractOutside={(e) => e.preventDefault()} // 🚫 stops outside click closing
      >
        <SheetHeader>
          <SheetTitle>Add Property</SheetTitle>
          <SheetDescription>
            Fill in the details below. You’ll also be able to select the
            property location on the map later.
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <Label htmlFor="coordinates">Map Location</Label>
            <Input
              id="coordinates"
              value={
                mapCordinates
                  ? `${mapCordinates[0].toFixed(5)}, ${mapCordinates[1].toFixed(
                      5
                    )}`
                  : "Select on map"
              }
              readOnly
              className="cursor-not-allowed bg-gray-100 text-gray-600"
            />
          </div>
          {/* <SearchBox/> */}
          <SearchInSideBar setMapCoordinates={setMapCoordinates} />
          <div>
            <Label htmlFor="full_address">Full Address (optional)</Label>
            <Input
              id="full_address"
              name="full_address"
              value={form.full_address}
              onChange={handleChangeEvent}
              placeholder="e.g. 123 Street, City"
            />
          </div>
          <div>
            <Label htmlFor="rooms">Rooms</Label>
            <Input
              id="rooms"
              name="rooms"
              type="number"
              value={form.rooms}
              onChange={handleChangeEvent}
              placeholder="e.g. 3"
            />
          </div>
          <div>
            <Label htmlFor="type">Rent or Sale</Label>
            <select
              id="type"
              name="type"
              value={form.type}
              onChange={handleChangeEvent}
              className="w-full rounded-md border px-3 py-2"
            >
              <option value="rent">Rent</option>
              <option value="sale">Sale</option>
            </select>
          </div>
          <div>
            <Label htmlFor="demand">Demand</Label>
            <Input
              id="demand"
              name="demand"
              type="number"
              value={form.demand}
              onChange={handleChangeEvent}
              placeholder="e.g. 25000"
            />
          </div>
          <div>
            <Label htmlFor="contact">Contact</Label>
            <Input
              id="contact"
              name="contact"
              value={form.contact}
              onChange={handleChangeEvent}
              placeholder="e.g. +92XXXXXXXXXX"
            />
          </div>
          <Button type="submit" className="w-full">
            Save Property
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}
