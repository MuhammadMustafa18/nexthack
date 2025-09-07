"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import Image from "next/image";
import StreetView from "./VirtualViewtest";



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
};

type PropertySidebarProps = {
  property: Property |null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function SidebarView({ open, onOpenChange, property }: PropertySidebarProps) {
  
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-[400px]">
        {property ? (
          <>
            <SheetHeader>
              <SheetTitle>{property.type || "Property"}</SheetTitle>
              <SheetDescription>ID: {property.id}</SheetDescription>
            </SheetHeader>

            <div className="mt-4 space-y-2 text-sm">
              <p>
                <b>Address:</b> {property.full_address}
              </p>
              <p>
                <b>Rooms:</b> {property.rooms}
              </p>
              <p>
                <b>Demand:</b> {property.demand}
              </p>
              <p>
                <b>Contact:</b> {property.contact}
              </p>
              <p>
                <b>Lat:</b> {property.latitude}
              </p>
              <p>
                <b>Lng:</b> {property.longitude}
              </p>
              <p>
                <b>Created:</b> {new Date(property.created_at).toLocaleString()}
              </p>
              <p>{property.images[0]}</p>
              <StreetView url="https://res.cloudinary.com/dmcc5sp94/image/upload/v1757224264/dxtj9vq0erruu6anomoo.jpg" />
            </div>
            {/* Images Section */}

            {property.images
              .filter((url) => url && url.trim() !== "")
              .map((url, idx) => (
                <div key={idx} className="relative w-full h-32">
                  <Image
                    src={url}
                    alt={`Property image ${idx + 1}`}
                    fill
                    className="rounded-md object-cover"
                  />
                </div>
              ))}
          </>
        ) : (
          <div className="text-muted-foreground text-sm p-4">
            No property selected
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
