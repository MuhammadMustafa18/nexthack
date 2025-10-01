"use client";

import React, { useState, useRef, useEffect } from "react";
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

import {
  X,
  ChevronUp,
  ChevronDown,
  MapPin,
  Home,
  Users,
  DollarSign,
  Phone,
  Camera,
  Image as ImageIcon,
  Plus,
  Calendar,
} from "lucide-react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { Switch } from "./ui/switch";

const SearchInSideBar = dynamic(() => import("@/components/SearchInSidebar"), {
  ssr: false,
});

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
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [currentY, setCurrentY] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const sheetRef = useRef<HTMLDivElement>(null);

 const [form, setForm] = useState({
   name: "",
   type: "hackathon", // hackathon, cp, conference, workshop
   category: "",
   mode: "online", // online, offline, hybrid
   host: "",
   start_date: "",
   end_date: "",
   prize_pool: "",
   registration_link: "",
   description: "",
   images: [] as File[],
   source: "",
    confirmed: false, // 👈 new field (boolean)

 });
  const supabase = createClient();
  const router = useRouter();

  // Check if device is mobile
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  useEffect(() => {
    // Reset expansion state when sheet opens/closes
    if (!open) {
      setIsExpanded(false);
    }
  }, [open]);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!isMobile) return;
    setIsDragging(true);
    setStartY(e.touches[0].clientY);
    setCurrentY(e.touches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !isMobile) return;
    const touchY = e.touches[0].clientY;
    setCurrentY(touchY);

    if (Math.abs(touchY - startY) > 10) {
      e.preventDefault();
    }
  };

  const handleTouchEnd = () => {
    if (!isDragging || !isMobile) return;
    setIsDragging(false);

    const deltaY = currentY - startY;

    if (deltaY < -50 && !isExpanded) {
      setIsExpanded(true);
    } else if (deltaY > 50) {
      if (isExpanded) {
        setIsExpanded(false);
      } else {
        setIsOpen(false);
      }
    }
  };

  const handleMouseStart = (e: React.MouseEvent) => {
    if (isMobile) return;
    setIsDragging(true);
    setStartY(e.clientY);
    setCurrentY(e.clientY);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || isMobile) return;
    setCurrentY(e.clientY);
  };

  const handleMouseEnd = () => {
    if (!isDragging || isMobile) return;
    setIsDragging(false);

    const deltaY = currentY - startY;

    if (deltaY < -50 && !isExpanded) {
      setIsExpanded(true);
    } else if (deltaY > 50) {
      if (isExpanded) {
        setIsExpanded(false);
      } else {
        setIsOpen(false);
      }
    }
  };

  useEffect(() => {
    if (isDragging && !isMobile) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseEnd);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseEnd);
      };
    }
  }, [isDragging, isMobile]);

  function handleChangeEvent(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);

    if (!mapCordinates) {
      alert("Please select a location on the map.");
      setIsSubmitting(false);
      return;
    }

    const user = (await supabase.auth.getUser()).data.user;

    if (!user) {
      alert("You must be logged in to add a property.");
      router.push("/login");
      setIsSubmitting(false);
      return;
    }

    try {
      let imageUrls: string[] = [];
      if (form.images) {
        for (const file of Array.from(form.images)) {
          const formdata = new FormData();
          formdata.append("file", file);
          formdata.append(
            "upload_preset",
            process.env.NEXT_PUBLIC_CLOUDINARY_PRESET!
          );
          const res = await fetch(
            `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`,
            { method: "POST", body: formdata }
          );
          const data = await res.json();
          imageUrls.push(data.secure_url);
        }
      }

      // let streetview_url: string = "";
      // if (form.streetview_file) {
      //   const formData = new FormData();
      //   formData.append("file", form.streetview_file);
      //   formData.append(
      //     "upload_preset",
      //     process.env.NEXT_PUBLIC_CLOUDINARY_PRESET!
      //   );
      //   const res = await fetch(
      //     `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`,
      //     { method: "POST", body: formData }
      //   );
      //   const data = await res.json();
      //   streetview_url = data.secure_url;
      // }

      const { data, error } = await supabase.from("events").insert([
        {
          user_id: user.id,
          name: form.name,
          type: form.type,
          category: form.category,
          mode: form.mode,
          host: form.host,
          latitude: mapCordinates[0],
          longitude: mapCordinates[1],
          start_date: form.start_date,
          end_date: form.end_date,
          prize_pool: form.prize_pool,
          registration_link: form.registration_link,
          description: form.description,
          image_urls: imageUrls,
          source: form.source,
          confirmed: form.confirmed
        },
      ]);

      if (error) {
        console.error("Error inserting property:", error);
        alert("Failed to save property.");
      } else {
        console.log("Property inserted:", data);
        setIsOpen(false);
        setForm({
          name: "",
          type: "hackathon",
          category: "",
          mode: "online",
          host: "",
          start_date: "",
          end_date: "",
          prize_pool: "",
          registration_link: "",
          description: "",
          images: [] as File[],
          source: "",
          confirmed: false,
        });
        setMapCoordinates(null);
        alert("Added this event.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while saving the event.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!isMobile) {
    // Desktop version - keep original left sidebar behavior
    return (
      <Sheet open={open} onOpenChange={setIsOpen} modal={false}>
        <SheetContent
          side="left"
          className="w-[400px] sm:w-[500px] h-full overflow-y-auto px-4"
          onInteractOutside={(e) => e.preventDefault()}
        >
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <Plus size={20} />
              Add Property
            </SheetTitle>
            <SheetDescription>
              Fill in the details below and select the location on the map.
            </SheetDescription>
          </SheetHeader>

          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <PropertyForm
              form={form}
              setForm={setForm}
              handleChangeEvent={handleChangeEvent}
              mapCordinates={mapCordinates}
              setMapCoordinates={setMapCoordinates}
              isSubmitting={isSubmitting}
            />
          </form>
        </SheetContent>
      </Sheet>
    );
  }

  // Mobile version - bottom sheet
  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div
        ref={sheetRef}
        className={`fixed left-0 right-0 bg-white rounded-t-2xl shadow-2xl z-50 transition-all duration-300 ease-out ${
          open
            ? isExpanded
              ? "bottom-0 top-0"
              : "bottom-0 top-1/3"
            : "bottom-0 translate-y-full"
        }`}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseStart}
      >
        <div className="flex flex-col h-full">
          {/* Drag handle and header */}
          <div className="flex flex-col bg-white rounded-t-2xl">
            {/* Drag handle */}
            <div className="flex justify-center py-2">
              <div className="w-10 h-1 bg-gray-300 rounded-full" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-4 pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Plus size={20} className="text-blue-600" />
                <div>
                  <h2 className="text-lg font-medium text-gray-900">
                    Add Property
                  </h2>
                  <p className="text-sm text-gray-500">
                    Fill details & select location
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                  {isExpanded ? (
                    <ChevronDown size={20} className="text-gray-500" />
                  ) : (
                    <ChevronUp size={20} className="text-gray-500" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X size={20} className="text-gray-500" />
                </button>
              </div>
            </div>
          </div>

          {/* Scrollable form content */}
          <div className="flex-1 overflow-y-auto">
            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <PropertyForm
                form={form}
                setForm={setForm}
                handleChangeEvent={handleChangeEvent}
                mapCordinates={mapCordinates}
                setMapCoordinates={setMapCoordinates}
                isSubmitting={isSubmitting}
                isMobile={true}
              />
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

// Extracted form component to avoid duplication
interface PropertyFormProps {
  form: {
    name: string; // Event name
    type: string; // hackathon | cp | conference | workshop
    category: string; // AI, Web, Blockchain, etc.
    mode: string; // online | offline | hybrid
    host: string; // Organizer / University / Company
    start_date: string; // yyyy-mm-dd
    end_date: string; // yyyy-mm-dd
    prize_pool: string; // "$5000", "Swags", etc.
    registration_link: string; // Signup link
    description: string; // Event details
    images: File[]; // Event banner/images
    source:string;
    confirmed: boolean;
  };
  setForm: React.Dispatch<React.SetStateAction<any>>;
  handleChangeEvent: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  mapCordinates: [number, number] | null;
  setMapCoordinates: (coords: [number, number] | null) => void;
  isSubmitting: boolean;
  isMobile?: boolean;
}

function PropertyForm({
  form,
  setForm,
  handleChangeEvent,
  mapCordinates,
  setMapCoordinates,
  isSubmitting,
  isMobile = false,
}: PropertyFormProps) {
  return (
    <>
      {/* Location section */}
      <div className="space-y-3 overflow-y-auto pb-4">
        <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          <MapPin size={16} className="text-red-500" />
          Location
        </div>

        <div>
          <Label
            htmlFor="coordinates"
            className="sr-only text-gray-700 dark:text-gray-300"
          >
            Map Location
          </Label>
          <Input
            id="coordinates"
            value={
              mapCordinates
                ? `${mapCordinates[0].toFixed(5)}, ${mapCordinates[1].toFixed(
                    5
                  )}`
                : "Select location on map"
            }
            readOnly
            className="cursor-not-allowed bg-gray-50 text-gray-600 dark:text-gray-100 border-gray-200"
            placeholder="Click on map to set location"
          />
        </div>

        {/* <SearchInSideBar setMapCoordinates={setMapCoordinates} /> */}
        <div className="text-xs text-amber-600 bg-amber-50 p-2 rounded-md border border-amber-200 mb-3">
          <strong>Note:</strong> Zoom in or out for exact spots on the map,
        </div>
      </div>

      {/* Property details section */}
      {/* Event Details section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          <Calendar size={16} className="text-blue-600" />
          Event Details
        </div>

        <div>
          <Label className="mb-2" htmlFor="name">
            Event Name
          </Label>
          <Input
            id="name"
            name="name"
            value={form.name}
            onChange={handleChangeEvent}
            placeholder="e.g. NextHack Global"
            className="mt-1"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="mb-1" htmlFor="type">
              Type
            </Label>
            <select
              id="type"
              name="type"
              value={form.type}
              onChange={handleChangeEvent}
              className="w-full mt-1 rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 text-gray-700 dark:text-gray-300 dark:bg-black"
            >
              <option value="hackathon">Hackathon</option>
              <option value="cp">Competitive Programming</option>
              <option value="conference">Conference</option>
              <option value="workshop">Workshop</option>
            </select>
          </div>

          <div>
            <Label className="mb-1" htmlFor="mode">
              Mode
            </Label>
            <select
              id="mode"
              name="mode"
              value={form.mode}
              onChange={handleChangeEvent}
              className="w-full mt-1 rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 text-gray-700 dark:text-gray-300 dark:bg-black"
            >
              <option value="online">Online</option>
              <option value="offline">Offline</option>
              <option value="hybrid">Hybrid</option>
            </select>
          </div>
        </div>
        <div>
          <Label className="mb-2" htmlFor="Category">
            Category
          </Label>
          <Input
            id="category"
            name="category"
            value={form.category}
            onChange={handleChangeEvent}
            placeholder="AI, Web, Blockchain, etc."
            className="mt-1"
          />
        </div>
        <div>
          <Label className="mb-2" htmlFor="source">
            Source - Optional
          </Label>
          <Input
            id="source"
            name="source"
            value={form.source}
            onChange={handleChangeEvent}
            placeholder="Devpost, Unstop, HackerEarth"
            className="mt-1"
          />
        </div>
        <div>
          <Label className="mb-2" htmlFor="host">
            Host
          </Label>
          <Input
            id="host"
            name="host"
            value={form.host}
            onChange={handleChangeEvent}
            placeholder="Organizer / University / Company"
            className="mt-1"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="mb-2" htmlFor="start_date">
              Start Date
            </Label>
            <Input
              id="start_date"
              name="start_date"
              type="date"
              value={form.start_date}
              onChange={handleChangeEvent}
              className="mt-1"
            />
          </div>
          <div>
            <Label className="mb-2" htmlFor="end_date">
              End Date
            </Label>
            <Input
              id="end_date"
              name="end_date"
              type="date"
              value={form.end_date}
              onChange={handleChangeEvent}
              className="mt-1"
            />
          </div>
        </div>
        <div>
          <Label className="mb-2" htmlFor="confirmed">
            Confirmed Event?
          </Label>
          <Switch
            id="confirmed"
            name="confirmed"
            checked={form.confirmed}
            onCheckedChange={(checked) => {
              setForm({ ...form, confirmed: checked });
              console.log(form); // old
            }}
          />
        </div>
        <div>
          <Label className="mb-2" htmlFor="prize_pool">
            Prize Pool
          </Label>
          <Input
            id="prize_pool"
            name="prize_pool"
            value={form.prize_pool}
            onChange={handleChangeEvent}
            placeholder="$5000 or Swags"
            className="mt-1"
          />
        </div>

        <div>
          <Label className="mb-2" htmlFor="registration_link">
            Registration Link
          </Label>
          <Input
            id="registration_link"
            name="registration_link"
            value={form.registration_link}
            onChange={handleChangeEvent}
            placeholder="https://example.com"
            className="mt-1"
          />
        </div>

        <div>
          <Label className="mb-2" htmlFor="description">
            Description
          </Label>
          <Input
            id="description"
            name="description"
            value={form.description}
            onChange={handleChangeEvent}
            placeholder="Brief details about the event..."
            className="w-full mt-1 rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Submit button */}
      <div className={`${isMobile ? "pb-6" : "pb-5"}`}>
        <Button
          type="submit"
          disabled={isSubmitting || !mapCordinates}
          className="w-full py-3 bg-orange-400 hover:bg-orange-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Adding Event...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Plus size={18} />
              Add Event
            </div>
          )}
        </Button>
      </div>
    </>
  );
}
