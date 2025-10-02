"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import {
  Heart,
  Share2,
  ChevronDown,
  ChevronUp,
  Info,
  Expand,
  X,
  Plus,
  Minimize2,
  Maximize2
} from "lucide-react";
import RentSaleParent from "@/components/RentSaleParent";
import { SupportDialog } from "./RentSaleNew";
import { ThemeToggle } from "./ThemeToggle";
import { FlippingText } from "./Flipping";



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
};

interface MessageBoxProps {
  primary: string;
  secondary: string;
  thirdary: string;
  setPrimaryText: React.Dispatch<React.SetStateAction<string>>;
  setSecondaryText: React.Dispatch<React.SetStateAction<string>>;
  time?: string;
  earliest?: Event | null;
  countdown:string;
  isExpanded: boolean;
  setIsExpanded: (isExpanded: boolean) => void

}

export function MessageBox({
  primary,
  secondary,
  thirdary,
  setPrimaryText,
  setSecondaryText,
  earliest,
  countdown,
  isExpanded,
  setIsExpanded
}: MessageBoxProps) {
  const [isFavorited, setIsFavorited] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [supportOpen, setSupportOpen] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      // On desktop, expanded by default; on mobile, collapsed by default
      setIsExpanded(!mobile);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: primary,
          text: `${secondary} - ${thirdary}`,
          url: window.location.href,
        });
      } catch (error) {
        console.log("Share cancelled");
      }
    } else {
      navigator.clipboard.writeText(
        `${primary} - ${secondary}\n${window.location.href}`
      );
    }
  };

  if (isMinimized) {
    return (
      <div
        className={`fixed ${
          isMobile ? "bottom-6 right-6" : "bottom-5 right-5"
        } z-50`}
      >
        <Button
          onClick={() => setIsMinimized(false)}
          className="h-12 w-12 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg"
        >
          <Expand className="h-6 w-6 text-white" />
        </Button>
      </div>
    );
  }

  return (
    <Card
      className={`fixed z-50 px-4 
    bg-white/95 dark:bg-black 
    border-8 border-gray-200 dark:border-neutral-900 
    backdrop-blur-sm shadow-2xl transition-all duration-300 ease-out
    ${
      isMobile
        ? "bottom-6 left-6 right-6 rounded-2xl"
        : "bottom-5 left-1/2 transform -translate-x-1/2 max-w-sm rounded-2xl"
    }`}
    >
      {/* content */}
      <div className="text-left py-0 overflow-hidden">
        {isExpanded ? (
          // Expanded version - vertical layout
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex flex-row  items-baseline justify-between">
              <div className="animate-in mx-1 my-1 mb-3 fade-in slide-in-from-bottom-1 duration-500 delay-100">
                <p className="text-sm  bg-orange-700 dark:bg-orange-400 py-1 px-3 rounded-sm font-semibold text-white dark:text-black animate-pulse">
                  {countdown}
                </p>
              </div>
              <h2
                className="text-sm font-semibold text-black dark:text-white mb-2 
             truncate max-w-[120px]"
              >
                {earliest?.name}
              </h2>
            </div>
            <h2 className="font-bold text-gray-900 dark:text-gray-100 leading-tight mb-1 text-lg md:text-3xl md:mx-1">
              {primary}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-sm my-0.5 mb-3 md:mx-1">
              {secondary}
            </p>

            {/* Buttons below content */}
            <div className="flex items-center justify-center animate-in fade-in slide-in-from-bottom-1 duration-400 delay-200">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  className="p-3 hover:bg-orange-100 dark:hover:bg-orange-900 rounded-full w-fit h-fit transition-all duration-200 hover:scale-105"
                  onClick={() => setIsExpanded(!isExpanded)}
                >
                  <Minimize2 className="h-10 w-10 text-orange-600 dark:text-orange-400 transition-transform duration-200" />
                </Button>
                <Button
                  variant="ghost"
                  className="p-3 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-full w-fit h-fit transition-all duration-200 hover:scale-105"
                  onClick={handleShare}
                >
                  <Share2 className="h-10 w-10 text-blue-600 dark:text-blue-400" />
                </Button>
                <Button
                  variant="ghost"
                  className="p-3 hover:bg-purple-100 dark:hover:bg-purple-900 rounded-full w-fit h-fit transition-all duration-200 hover:scale-105"
                  onClick={() => {
                    if (primary === "Add Event") {
                      setPrimaryText("View Event");
                      setSecondaryText("Hover or click any event");
                    } else if (primary === "View Event") {
                      setPrimaryText("Add Event");
                      setSecondaryText("Click on the map and add details");
                    } else {
                      setPrimaryText("Add Event");
                    }
                  }}
                >
                  <Plus className="h-10 w-10 text-purple-600 dark:text-purple-400" />
                </Button>
                <Button
                  variant="ghost"
                  className="p-3 hover:bg-red-100 dark:hover:bg-red-900 rounded-full w-fit h-fit transition-all duration-200 hover:scale-105"
                  onClick={() => setIsFavorited(!isFavorited)}
                >
                  <Heart
                    className={`h-10 w-10 transition-all duration-200 ${
                      isFavorited
                        ? "text-red-500 fill-red-500 scale-110"
                        : "text-red-800 dark:text-red-400"
                    }`}
                  />
                </Button>
                <ThemeToggle />
              </div>
            </div>
          </div>
        ) : (
          // Collapsed version - horizontal layout
          <div className="flex items-center justify-between animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex-1 w-max">
              <h2 className="font-semibold text-gray-900 dark:text-gray-100 leading-tight text-base">
                {primary}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-xs my-0.5">
                {secondary}
              </p>
            </div>

            {/* Buttons on the right side */}
            <div className="flex items-center gap-0 ml-4">
              <Button
                variant="ghost"
                className="p-3 hover:bg-orange-100 dark:hover:bg-orange-900 rounded-full w-fit h-fit transition-all duration-200 hover:scale-105"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                <Maximize2 className="h-8 w-8 text-orange-600 dark:text-orange-400 transition-transform duration-200" />
              </Button>
              <Button
                variant="ghost"
                className="p-3 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-full w-fit h-fit transition-all duration-200 hover:scale-105"
                onClick={handleShare}
              >
                <Share2 className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </Button>
              <Button
                variant="ghost"
                className="p-3 mr-1 hover:bg-purple-100 dark:hover:bg-purple-900 rounded-full w-fit h-fit transition-all duration-200 hover:scale-105"
                onClick={() => {
                  if (primary === "Add Event") {
                    setPrimaryText("View Event");
                    setSecondaryText("Hover or click any event");
                  } else if (primary === "View Event") {
                    setPrimaryText("Add Event");
                    setSecondaryText("Click on the map and add details");
                  } else {
                    setPrimaryText("Add Event");
                  }
                }}
              >
                <Plus className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </Button>

              <ThemeToggle />
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
