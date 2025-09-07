"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import Image from "next/image";
import StreetView from "./VirtualViewtest";
import {
  MapPin,
  Phone,
  Calendar,
  Home,
  Users,
  DollarSign,
  X,
  ChevronUp,
  ChevronDown,
} from "lucide-react";

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
  images: string[];
  streetview_url: string;
};

type PropertySidebarProps = {
  property: Property | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function SidebarView({
  open,
  onOpenChange,
  property,
}: PropertySidebarProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [currentY, setCurrentY] = useState(0);
  const sheetRef = useRef<HTMLDivElement>(null);

  const validImages =
    property?.images?.filter((url) => url && url.trim() !== "") || [];

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

    // Prevent default scrolling when dragging
    if (Math.abs(touchY - startY) > 10) {
      e.preventDefault();
    }
  };

  const handleTouchEnd = () => {
    if (!isDragging || !isMobile) return;
    setIsDragging(false);

    const deltaY = currentY - startY;

    // If dragged up significantly, expand
    if (deltaY < -50 && !isExpanded) {
      setIsExpanded(true);
    }
    // If dragged down significantly, collapse or close
    else if (deltaY > 50) {
      if (isExpanded) {
        setIsExpanded(false);
      } else {
        onOpenChange(false);
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
        onOpenChange(false);
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

  if (!isMobile) {
    // Desktop version - keep original left sidebar behavior
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent
          side="left"
          className="w-[400px] p-0 bg-white border-r border-gray-200"
          style={{ boxShadow: "2px 0 8px rgba(0,0,0,0.1)" }}
        >
          {property ? (
            <div className="flex flex-col h-full">
              {/* Header with close button */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white sticky top-0 z-10">
                <div>
                  <h2 className="text-lg font-medium text-gray-900">
                    {property.type || "Property"}
                  </h2>
                  <p className="text-sm text-gray-500">
                    Property ID: {property.id}
                  </p>
                </div>
                <button
                  onClick={() => onOpenChange(false)}
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X size={20} className="text-gray-500" />
                </button>
              </div>

              {/* Scrollable content */}
              <div className="flex-1 overflow-y-auto">
                <PropertyContent
                  property={property}
                  validImages={validImages}
                />
              </div>
            </div>
          ) : (
            <EmptyState />
          )}
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
          onClick={() => onOpenChange(false)}
        />
      )}

      <div
        ref={sheetRef}
        className={`fixed left-0 right-0 bg-white rounded-t-2xl shadow-2xl z-50 transition-all duration-300 ease-out ${
          open
            ? isExpanded
              ? "bottom-0 top-0"
              : "bottom-0 top-1/2"
            : "bottom-0 translate-y-full"
        }`}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseStart}
      >
        {property ? (
          <div className="flex flex-col h-full">
            {/* Drag handle and header */}
            <div className="flex flex-col bg-white rounded-t-2xl">
              {/* Drag handle */}
              <div className="flex justify-center py-2">
                <div className="w-10 h-1 bg-gray-300 rounded-full" />
              </div>

              {/* Header */}
              <div className="flex items-center justify-between px-4 pb-3">
                <div className="flex-1">
                  <h2 className="text-lg font-medium text-gray-900">
                    {property.type || "Property"}
                  </h2>
                  <p className="text-sm text-gray-500">
                    Property ID: {property.id}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
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
                    onClick={() => onOpenChange(false)}
                    className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X size={20} className="text-gray-500" />
                  </button>
                </div>
              </div>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto border-t border-gray-100">
              <PropertyContent property={property} validImages={validImages} />
            </div>
          </div>
        ) : (
          <div className="flex flex-col h-full">
            {/* Drag handle */}
            <div className="flex justify-center py-2">
              <div className="w-10 h-1 bg-gray-300 rounded-full" />
            </div>
            <EmptyState />
          </div>
        )}
      </div>
    </>
  );
}

// Extracted property content component to avoid duplication
function PropertyContent({
  property,
  validImages,
}: {
  property: Property;
  validImages: string[];
}) {
  return (
    <>
      {/* Main image carousel */}
      {validImages.length > 0 && (
        <div className="relative">
          <div className="relative w-full h-48">
            <Image
              src={validImages[0]}
              alt="Property main image"
              fill
              className="object-cover"
            />
            {validImages.length > 1 && (
              <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                1 / {validImages.length}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Property details */}
      <div className="p-4 space-y-4">
        {/* Address */}
        <div className="flex items-start gap-3">
          <MapPin size={18} className="text-red-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-gray-900">Address</p>
            <p className="text-sm text-gray-600">
              {property.full_address || "Not available"}
            </p>
          </div>
        </div>

        {/* Key details in cards */}
        <div className="grid grid-cols-2 gap-3">
          {property.rooms && (
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="flex items-center gap-2">
                <Users size={16} className="text-blue-600" />
                <span className="text-xs text-gray-500">Rooms</span>
              </div>
              <p className="text-lg font-medium text-gray-900 mt-1">
                {property.rooms}
              </p>
            </div>
          )}

          {property.demand && (
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="flex items-center gap-2">
                <DollarSign size={16} className="text-green-600" />
                <span className="text-xs text-gray-500">Demand</span>
              </div>
              <p className="text-lg font-medium text-gray-900 mt-1">
                {property.demand}
              </p>
            </div>
          )}
        </div>

        {/* Contact info */}
        {property.contact && (
          <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
            <Phone size={18} className="text-blue-600" />
            <div>
              <p className="text-sm font-medium text-gray-900">Contact</p>
              <p className="text-sm text-blue-600">{property.contact}</p>
            </div>
          </div>
        )}

        {/* Created date */}
        <div className="flex items-center gap-3">
          <Calendar size={18} className="text-gray-400" />
          <div>
            <p className="text-sm font-medium text-gray-900">Listed</p>
            <p className="text-sm text-gray-600">
              {new Date(property.created_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </div>

        {/* Street View */}
        {property.streetview_url && (
          <div className="border-t pt-4 mt-4">
            <h3 className="text-sm font-medium text-gray-900 mb-3">
              Street View
            </h3>
            <div className="rounded-lg overflow-hidden border">
              <StreetView url={property.streetview_url} />
            </div>
          </div>
        )}

        {/* Additional images */}
        {validImages.length > 1 && (
          <div className="border-t pt-4 mt-4">
            <h3 className="text-sm font-medium text-gray-900 mb-3">
              More Photos ({validImages.length - 1})
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {validImages.slice(1).map((url, idx) => (
                <div key={idx} className="relative aspect-square">
                  <Image
                    src={url}
                    alt={`Property image ${idx + 2}`}
                    fill
                    className="rounded-lg object-cover hover:opacity-90 transition-opacity cursor-pointer"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Coordinates (for debugging - can be removed) */}
        <div className="border-t pt-4 mt-4">
          <details className="text-xs text-gray-500">
            <summary className="cursor-pointer hover:text-gray-700">
              Technical Details
            </summary>
            <div className="mt-2 space-y-1">
              <p>Latitude: {property.latitude}</p>
              <p>Longitude: {property.longitude}</p>
              <p>User ID: {property.user_id}</p>
            </div>
          </details>
        </div>
      </div>
    </>
  );
}

// Empty state component
function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-8">
      <MapPin size={48} className="text-gray-300 mb-4" />
      <p className="text-gray-500 text-lg font-medium">No property selected</p>
      <p className="text-gray-400 text-sm mt-2">
        Click on a marker to view property details
      </p>
    </div>
  );
}
