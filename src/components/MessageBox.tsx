"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heart, Share2, DollarSign, Info, Expand, X } from "lucide-react";
import RentSaleParent from "@/components/RentSaleParent";
import { SupportDialog } from "./RentSaleNew";

interface MessageBoxProps {
  primary: string;
  secondary: string;
  thirdary: string;
  setPrimaryText: React.Dispatch<React.SetStateAction<string>>;
  setSecondaryText: React.Dispatch<React.SetStateAction<string>>;
  time?: string;
}

export function MessageBox({
  primary,
  secondary,
  thirdary,
  setPrimaryText,
  setSecondaryText,
}: MessageBoxProps) {
  const [isFavorited, setIsFavorited] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [supportOpen, setSupportOpen] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
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
      className={`fixed z-50 bg-white/95 border-8 border-gray-200 backdrop-blur-sm  shadow-2xl transition-all duration-300 ease-out ${
        isMobile
          ? isExpanded
            ? "inset-6 rounded-2xl"
            : "bottom-6 left-6 right-6 rounded-2xl"
          : isExpanded
          ? "bottom-5 left-1/2 transform -translate-x-1/2 w-96 rounded-2xl"
          : "bottom-5 left-1/2 transform -translate-x-1/2 max-w-sm rounded-2xl"
      }`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl pointer-events-none" />
      {supportOpen && (
        <SupportDialog open={supportOpen} onOpenChange={setSupportOpen} />
      )}

      <div
        className={`relative px-4 ${
          isMobile && isExpanded ? "h-full flex flex-col" : ""
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-center mb-2">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              className="p-0 hover:bg-blue-100 rounded-full"
              onClick={handleShare}
            >
              <Share2 className="h-20 w-20 text-blue-600" />
            </Button>

            <Button
              variant="ghost"
              className="p-0 hover:bg-green-100 rounded-full"
              onClick={() => setSupportOpen(true)}
            >
              <DollarSign className="h-20 w-20 text-green-600" />
            </Button>

            <Button
              variant="ghost"
              className="p-0 hover:bg-purple-100 rounded-full"
            >
              <Info className="h-20 w-20 text-purple-600" />
            </Button>

            <Button
              variant="ghost"
              className="p-0 hover:bg-red-100 rounded-full"
              onClick={() => setIsFavorited(!isFavorited)}
            >
              <Heart
                className={`h-20 w-20 transition-all duration-200 ${
                  isFavorited ? "text-red-500 fill-red-500" : "text-red-800"
                }`}
              />
            </Button>
            <Button
              variant="ghost"
              className="p-0 hover:bg-red-100 rounded-full"
              onClick={() => setIsMinimized(true)}
            >
              <X className="h-12 w-12 text-red-500" />
            </Button>
          </div>
        </div>

        {/* Main content */}
        <div
          className={`${
            isMobile && isExpanded ? "flex-1 flex flex-col justify-center" : ""
          }`}
        >
          <div className={`text-center ${isExpanded ? "mb-2" : "my-6"}`}>
            <h2
              className={`font-bold text-gray-900 leading-tight mb-1 ${
                isExpanded ? "text-2xl md:text-3xl" : "text-lg md:text-xl"
              }`}
            >
              {primary}
            </h2>
            <p
              className={`text-gray-600 ${
                isExpanded ? "text-base mb-1" : "text-sm mb-0.5"
              }`}
            >
              {secondary}
            </p>
            <p
              className={`text-gray-500 ${isExpanded ? "text-sm" : "text-xs"}`}
            >
              {thirdary}
            </p>
            <div className="flex items-center justify-center gap-2 my-2">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-green-600 font-medium">Live</span>
              </div>
            </div>
          </div>

          {/* Status */}

          {/* RentSaleParent */}
          <div className={`${isExpanded ? "mb-4" : "mb-6"}`}>
            <RentSaleParent
              setPrimaryText={setPrimaryText}
              setSecondaryText={setSecondaryText}
            />
          </div>
        </div>
      </div>
    </Card>
  );
}
