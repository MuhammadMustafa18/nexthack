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
} from "lucide-react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";

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
    full_address: "",
    rooms: "",
    type: "rent",
    demand: "",
    contact: "",
    images: [] as File[],
    streetview_file: null as File | null,
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

      let streetview_url: string = "";
      if (form.streetview_file) {
        const formData = new FormData();
        formData.append("file", form.streetview_file);
        formData.append(
          "upload_preset",
          process.env.NEXT_PUBLIC_CLOUDINARY_PRESET!
        );
        const res = await fetch(
          `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`,
          { method: "POST", body: formData }
        );
        const data = await res.json();
        streetview_url = data.secure_url;
      }

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
          images: imageUrls,
          streetview_url: streetview_url,
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
          images: [] as File[],
          streetview_file: null as File | null,
        });
        setMapCoordinates(null);
        alert("Added this property.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while saving the property.");
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
    full_address: string;
    rooms: string;
    type: string;
    demand: string;
    contact: string;
    images: File[];
    streetview_file: File | null;
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
        <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <MapPin size={16} className="text-red-500" />
          Location
        </div>

        <div>
          <Label htmlFor="coordinates" className="sr-only">
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
            className="cursor-not-allowed bg-gray-50 text-gray-600 border-gray-200"
            placeholder="Click on map to set location"
          />
        </div>

        <SearchInSideBar setMapCoordinates={setMapCoordinates} />
        <div className="text-xs text-amber-600 bg-amber-50 p-2 rounded-md border border-amber-200 mb-3">
          <strong>Note:</strong> Search for area only. For exact spots,
          <span className="font-semibold"> click directly on the map</span>.
        </div>
      </div>

      {/* Property details section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <Home size={16} className="text-blue-600" />
          Property Details
        </div>

        <div>
          <Label htmlFor="full_address">Full Address (optional)</Label>
          <Input
            id="full_address"
            name="full_address"
            value={form.full_address}
            onChange={handleChangeEvent}
            placeholder="e.g. 123 Street, City"
            className="mt-1"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="rooms">Rooms</Label>
            <div className="relative mt-1">
              <Users
                size={16}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              <Input
                id="rooms"
                name="rooms"
                type="number"
                value={form.rooms}
                onChange={handleChangeEvent}
                placeholder="3"
                className="pl-10"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="type">Type</Label>
            <select
              id="type"
              name="type"
              value={form.type}
              onChange={handleChangeEvent}
              className="w-full mt-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="rent">For Rent</option>
              <option value="sale">For Sale</option>
            </select>
          </div>
        </div>

        <div>
          <Label htmlFor="demand">Price/Demand</Label>
          <div className="relative mt-1">
            <DollarSign
              size={16}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <Input
              id="demand"
              name="demand"
              type="number"
              value={form.demand}
              onChange={handleChangeEvent}
              placeholder="25000"
              className="pl-10"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="contact">Contact Information</Label>
          <div className="relative mt-1">
            <Phone
              size={16}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <Input
              id="contact"
              name="contact"
              value={form.contact}
              onChange={handleChangeEvent}
              placeholder="+92XXXXXXXXXX"
              className="pl-10"
            />
          </div>
        </div>
      </div>

      {/* Media section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <Camera size={16} className="text-purple-600" />
          Media
        </div>

        <div>
          <Label htmlFor="images">Property Images</Label>
          <div className="mt-1">
            <Input
              id="images"
              name="images"
              type="file"
              multiple
              accept="image/*"
              onChange={(e) =>
                setForm({
                  ...form,
                  images: e.target.files ? Array.from(e.target.files) : [],
                })
              }
              className="file:mr-4  file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>
          {form.images.length > 0 && (
            <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
              <ImageIcon size={14} />
              {form.images.length} image{form.images.length > 1 ? "s" : ""}{" "}
              selected
            </div>
          )}
        </div>

        <div>
          <Label htmlFor="vr_view">VR/Street View Image</Label>
          <div className="mt-1">
            <Input
              id="vr_view"
              name="vr_view"
              type="file"
              accept="image/*"
              onChange={(e) =>
                setForm({
                  ...form,
                  streetview_file: e.target.files ? e.target.files[0] : null,
                })
              }
              className="file:mr-4 file:py-0 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
            />
          </div>
          {form.streetview_file && (
            <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
              <Camera size={14} />
              VR image selected: {form.streetview_file.name}
            </div>
          )}
        </div>
      </div>

      {/* Submit button */}
      <div className={`${isMobile ? "pb-6" : "pb-5"}`}>
        <Button
          type="submit"
          disabled={isSubmitting || !mapCordinates}
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Saving Property...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Plus size={18} />
              Save Property
            </div>
          )}
        </Button>
      </div>
    </>
  );
}
