"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Play,
  Volume2,
  Heart,
  MapPin,
  Shuffle,
  Link,
  DollarSign,
  RotateCcw,
  Expand,
} from "lucide-react";

interface RadioPlayerCardProps {
  primary: string;
  secondary: string;
  thirdary: string;
  time?: string;
}

export function MessageBox({
  primary,
  secondary,
  thirdary,
}: RadioPlayerCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);

  return (
    <Card className="fixed bottom-5 left-1/2 transform -translate-x-1/2 max-w-sm p-6  shadow-lg border-gray-200 border-8">
      {/* Header with time and action icons */}
      <div className="flex items-center justify-between mb-6">
        <span className="text-sm text-gray-600 font-medium">time</span>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Link className="h-4 w-4 text-gray-500" />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <DollarSign className="h-4 w-4 text-green-600" />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <RotateCcw className="h-4 w-4 text-gray-500" />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Expand className="h-4 w-4 text-gray-500" />
          </Button>
        </div>
      </div>

      {/* Station info */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-2 leading-tight">
          {primary}
        </h2>
        <p className="text-gray-600 text-sm">{secondary}</p>
        <p className="text-gray-600 text-sm">{thirdary}</p>
      </div>

      {/* Control buttons */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          className="h-10 w-10 p-0"
          onClick={() => setIsPlaying(!isPlaying)}
        >
          <Play className="h-5 w-5 text-gray-700" />
        </Button>

        <Button variant="ghost" size="sm" className="h-10 w-10 p-0">
          <Volume2 className="h-5 w-5 text-gray-700" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="h-10 w-10 p-0"
          onClick={() => setIsFavorited(!isFavorited)}
        >
          <Heart
            className={`h-5 w-5 ${
              isFavorited ? "text-red-500 fill-red-500" : "text-gray-700"
            }`}
          />
        </Button>

        <Button variant="ghost" size="sm" className="h-10 w-10 p-0">
          <MapPin className="h-5 w-5 text-gray-700" />
        </Button>

        <Button variant="ghost" size="sm" className="h-10 w-10 p-0">
          <Shuffle className="h-5 w-5 text-gray-700" />
        </Button>
      </div>
    </Card>
  );
}
