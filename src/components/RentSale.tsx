"use client"
import React from "react";
import { useState } from "react";
import {
  Play,
  Shuffle,
  MapPin,
  Share2,
  VolumeX,
  Volume2,
  Search,
} from "lucide-react";

const commands = [
  {
    id: "play",
    icon: Play,
    title: "Play",
    description: "Resume playback",
    shortcut: "Space",
    action: () => console.log("Play action"),
  },
  {
    id: "random",
    icon: Shuffle,
    title: "Random Station",
    description: "Discover something new",
    shortcut: "R",
    action: () => console.log("Random station action"),
  },
]
export default function RentSale(){
    const [isDivOpen, setIsDivOpen] = useState(false)
    function handleDivClick(){
        setIsDivOpen(true)
    }
    function handleElseWhereClick(){
        setIsDivOpen(false);
    }
    return (
      <div className="h-screen">
        {!isDivOpen && (
          <div
            onClick={handleDivClick}
            className="fixed bg-white text-black rounded-full py-2 px-4 top-5 left-1/2 transform -translate-x-1/2 shadow-xl cursor-pointer"
          >
            Handle Rent Sale
          </div>
        )}
        {isDivOpen && (
          <div>
            <div
              onClick={handleElseWhereClick}
              className="fixed inset-0 h-screen w-full bg-black/10 backdrop-blur-sm"
            ></div>
            <div
              onClick={(e) => e.stopPropagation()} // prevent closing when central div is clicked
              className="fixed bottom-5 left-1/2 transform -translate-x-1/2 bg-black text-white p-4 text-4xl"
            >
              Central Div
            </div>
          </div>
        )}
      </div>
    );
}