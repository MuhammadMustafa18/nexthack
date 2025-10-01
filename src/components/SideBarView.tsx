"use client";

import React, { useState, useRef, useEffect } from "react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import Image from "next/image";
import {
  Monitor,
  MapPin,
  Phone,
  Tag,
  Calendar,
  Home,
  DollarSign,
  X,
  ChevronUp,
  ChevronDown,
} from "lucide-react";

type Event = {
  id: number;
  user_id: string;
  name: string;
  type: string | null;
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

type EventSidebarProps = {
  event: Event | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function SidebarView({ open, onOpenChange, event }: EventSidebarProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [currentY, setCurrentY] = useState(0);
  const sheetRef = useRef<HTMLDivElement>(null);

  const validImage = event?.image_url || null;
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  useEffect(() => {
    if (!open) setIsExpanded(false);
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
    if (Math.abs(touchY - startY) > 10) e.preventDefault();
  };

  const handleTouchEnd = () => {
    if (!isDragging || !isMobile) return;
    setIsDragging(false);
    const deltaY = currentY - startY;
    if (deltaY < -50 && !isExpanded) setIsExpanded(true);
    else if (deltaY > 50) {
      if (isExpanded) setIsExpanded(false);
      else onOpenChange(false);
    }
  };

  if (!isMobile) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent
          side="left"
          className="w-[400px] p-0 bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800"
          style={{ boxShadow: "2px 0 8px rgba(0,0,0,0.1)" }}
        >
          {event ? (
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between p-4 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 sticky top-0 z-10">
                <div>
                  <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
                    {event.name}
                  </h2>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    {event.type || "Event"} • ID: {event.id}
                  </p>
                </div>
                <button
                  onClick={() => onOpenChange(false)}
                  className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
                >
                  <X size={20} className="text-zinc-500 dark:text-zinc-400" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto">
                <EventContent event={event} validImage={validImage} />
              </div>
            </div>
          ) : (
            <EmptyState />
          )}
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/50 dark:bg-black/70 z-40"
          onClick={() => onOpenChange(false)}
        />
      )}
      <div
        ref={sheetRef}
        className={`fixed left-0 right-0 bg-white dark:bg-zinc-900 rounded-t-2xl shadow-2xl z-50 transition-all duration-300 ease-out ${
          open
            ? isExpanded
              ? "bottom-0 top-0"
              : "bottom-0 top-1/2"
            : "bottom-0 translate-y-full"
        }`}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {event ? (
          <div className="flex flex-col h-full">
            <div className="flex flex-col bg-white dark:bg-zinc-900 rounded-t-2xl">
              <div className="flex justify-center py-2">
                <div className="w-10 h-1 bg-zinc-300 dark:bg-zinc-700 rounded-full" />
              </div>
              <div className="flex items-center justify-between px-4 pb-3">
                <div className="flex-1">
                  <h2 className="text-lg font-medium text-zinc-900 dark:text-white">
                    {event.name}
                  </h2>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    {event.type}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
                  >
                    {isExpanded ? (
                      <ChevronDown
                        size={20}
                        className="text-zinc-500 dark:text-zinc-400"
                      />
                    ) : (
                      <ChevronUp
                        size={20}
                        className="text-zinc-500 dark:text-zinc-400"
                      />
                    )}
                  </button>
                  <button
                    onClick={() => onOpenChange(false)}
                    className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
                  >
                    <X size={20} className="text-zinc-500 dark:text-zinc-400" />
                  </button>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto border-t border-zinc-100 dark:border-zinc-800">
              <EventContent event={event} validImage={validImage} />
            </div>
          </div>
        ) : (
          <EmptyState />
        )}
      </div>
    </>
  );
}

function EventContent({
  event,
  validImage,
}: {
  event: Event;
  validImage: string | null;
}) {
  return (
    <>
      {validImage && (
        <div className="relative w-full h-48">
          <Image
            src={validImage}
            alt="Event banner"
            fill
            className="object-cover"
          />
        </div>
      )}

      <div className="p-4 space-y-4">
        <div className="flex items-start gap-3">
          <MapPin
            size={18}
            className="text-red-500 dark:text-red-400 mt-0.5 flex-shrink-0"
          />
          <div>
            <p className="text-sm font-medium text-zinc-900 dark:text-white">
              Location
            </p>
            <p className="flex items-center gap-1 text-sm text-zinc-600 dark:text-zinc-300">
              {event.mode === "Online" && (
                <Monitor className="w-4 h-4 text-blue-500 dark:text-blue-400" />
              )}
              {event.mode === "Offline" && (
                <MapPin className="w-4 h-4 text-red-500 dark:text-red-400" />
              )}
              {event.mode || "Not specified"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {event.prize_pool && (
            <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800">
              <div className="flex items-center gap-2">
                <DollarSign
                  size={16}
                  className="text-zinc-600 dark:text-zinc-400"
                />
                <span className="text-xs text-zinc-500 dark:text-zinc-400">
                  Prize Pool
                </span>
              </div>
              <p className="text-lg font-medium text-zinc-900 dark:text-white mt-1">
                {event.prize_pool}
              </p>
            </div>
          )}
          {event.host && (
            <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800">
              <div className="flex items-center gap-2">
                <Home size={16} className="text-zinc-600 dark:text-zinc-400" />
                <span className="text-xs text-zinc-500 dark:text-zinc-400">
                  Host
                </span>
              </div>
              <p className="text-lg font-medium text-zinc-900 dark:text-white mt-1">
                {event.host}
              </p>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <Calendar size={18} className="text-zinc-400 dark:text-zinc-500" />
          <div>
            <p className="text-sm font-medium text-zinc-900 dark:text-white">
              Dates - {event.confirmed ? "✅ Confirmed" : " Not Confirmed"}
            </p>
            <p className="text-sm text-zinc-600 dark:text-zinc-300">
              {new Date(event.start_date).toLocaleDateString()} →{" "}
              {new Date(event.end_date).toLocaleDateString()}
            </p>
          </div>
        </div>

        {event.registration_link && (
          <a
            href={event.registration_link}
            target="_blank"
            className="block px-4 py-2 text-white bg-black dark:bg-white dark:text-black w-max hover:underline transition-colors"
          >
            Register here
          </a>
        )}

        {event.source && (
          <div className="block px-4 text-black dark:text-white border-2 rounded-full border-black dark:border-white w-max">
            Source: {event.source}
          </div>
        )}

        <div className="flex flex-row items-center space-x-2">
          <Tag className="w-5 h-5 text-black dark:text-white" />
          {event.category && (
            <div className="block px-4 py-1 text-orange-700 dark:text-orange-300 border-2 bg-orange-200 dark:bg-orange-900 w-max">
              {event.category}
            </div>
          )}
        </div>

        {event.description && (
          <div className="border-t border-zinc-200 dark:border-zinc-800 pt-4 mt-4">
            <h3 className="text-sm font-medium text-zinc-900 dark:text-white mb-2">
              About this event
            </h3>
            <p className="text-sm text-zinc-700 dark:text-zinc-300">
              {event.description}
            </p>
          </div>
        )}

        <div className="border-t border-zinc-200 dark:border-zinc-800 pt-4 mt-4">
          <details className="text-xs text-zinc-500 dark:text-zinc-400">
            <summary className="cursor-pointer hover:text-zinc-700 dark:hover:text-zinc-300">
              Technical Details
            </summary>
            <div className="mt-2 space-y-1">
              <p>Latitude: {event.latitude}</p>
              <p>Longitude: {event.longitude}</p>
              <p>Created: {event.created_at}</p>
              <p>Updated: {event.updated_at}</p>
            </div>
          </details>
        </div>
      </div>
    </>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-8">
      <MapPin size={48} className="text-zinc-300 dark:text-zinc-700 mb-4" />
      <p className="text-zinc-500 dark:text-zinc-400 text-lg font-medium">
        No event selected
      </p>
      <p className="text-zinc-400 dark:text-zinc-500 text-sm mt-2">
        Click on a marker to view event details
      </p>
    </div>
  );
}
