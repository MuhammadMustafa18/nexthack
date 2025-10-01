import React, { useRef, useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  MapPin,
  Users,
  Trophy,
} from "lucide-react";
import { Globe, Building2 } from "lucide-react";

interface FilterTabsProps {
  selectedType: string | null;
  onTypeChange: (type: string | null) => void;
  availableTypes: string[];
  Mode: string | null;
  setMode: (Mode: string | null) => void;
  className?: string;
  visible: boolean;
}

const FilterTabs: React.FC<FilterTabsProps> = ({
  selectedType,
  onTypeChange,
  availableTypes,
  Mode,
  setMode,
  className = "",
  visible,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Icon mapping
  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "hackathon":
        return <Trophy className="w-4 h-4" />;
      case "conference":
        return <Users className="w-4 h-4" />;
      case "workshop":
        return <Calendar className="w-4 h-4" />;
      case "meetup":
        return <MapPin className="w-4 h-4" />;
      default:
        return <Trophy className="w-4 h-4" />;
    }
  };

  const allTypes = ["All", ...availableTypes];

  const updateScrollState = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  useEffect(() => {
    updateScrollState();
  }, [availableTypes]);

  const scrollLeft = () => {
    scrollContainerRef.current?.scrollBy({ left: -200, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollContainerRef.current?.scrollBy({ left: 200, behavior: "smooth" });
  };

  return (
    <div
      className={`
    fixed bottom-62 left-1/2 transform -translate-x-1/2 
    transition-all duration-500 ease-in-out
    ${
      visible
        ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
        : "opacity-0 scale-90 translate-y-40 pointer-events-none"
    }
    ${className}
  `}
    >
      <div className="bg-white dark:bg-black backdrop-blur-sm rounded-2xl px-2 py-3 w-78 shadow-md dark:shadow-none">
        {/* Mode toggle */}
        <div className="flex space-x-2 justify-center mb-3 w-full max-w-xs mx-auto">
          <button
            onClick={() => setMode(Mode === "Online" ? null : "Online")}
            className={`flex-1 px-3 py-2 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition
    ${
      Mode === "Online"
        ? "bg-zinc-200 dark:bg-zinc-700 shadow-sm"
        : "bg-gray-100 hover:bg-gray-200 dark:bg-black dark:hover:bg-zinc-600"
    }`}
          >
            <Globe className="w-4 h-4 text-black dark:text-white" />
            Online
          </button>

          <button
            onClick={() => setMode(Mode === "Offline" ? null : "Offline")}
            className={`flex-1 px-3 py-2 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition
    ${
      Mode === "Offline"
        ? "bg-zinc-200 dark:bg-zinc-700 shadow-sm"
        : "bg-gray-100 hover:bg-gray-200 dark:bg-black dark:hover:bg-zinc-600"
    }`}
          >
            <Building2 className="w-4 h-4 text-black dark:text-white" />
            Offline
          </button>
        </div>

        {/* Tabs with scroll */}
        <div className="relative">
          {/* Left scroll button */}
          <button
            onClick={scrollLeft}
            disabled={!canScrollLeft}
            className={`absolute left-0 top-1/2 -translate-y-1/2 p-2 rounded-full transition-all duration-200 z-10 
              ${
                canScrollLeft
                  ? "bg-gray-200 hover:bg-gray-300 text-black dark:bg-black dark:hover:bg-zinc-700/80 dark:text-white"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-zinc-950 dark:text-zinc-500"
              }`}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Scrollable list */}
          <div className="mx-10">
            <div
              ref={scrollContainerRef}
              onScroll={updateScrollState}
              className="flex items-center space-x-1 overflow-x-auto scrollbar-hide w-55 py-1"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {allTypes.map((type) => {
                const isSelected =
                  (type === "All" && selectedType === null) ||
                  selectedType === type;
                const actualType = type === "All" ? null : type;

                return (
                  <button
                    key={type}
                    onClick={() => onTypeChange(actualType)}
                    className={`flex items-center space-x-2 px-5 py-2 rounded-lg text-xs font-medium transition-all duration-200 ease-in-out whitespace-nowrap flex-shrink-0 
                      ${
                        isSelected
                          ? "bg-zinc-200 text-black dark:bg-white/20 dark:text-white shadow-sm backdrop-blur-sm border border-zinc-300 dark:border-white/20"
                          : "text-gray-600 hover:text-black hover:bg-gray-100 dark:text-zinc-300 dark:hover:text-white dark:hover:bg-white/10"
                      }`}
                  >
                    {type !== "All" && getTypeIcon(type)}
                    <span className="capitalize">{type}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right scroll button */}
          <button
            onClick={scrollRight}
            disabled={!canScrollRight}
            className={`absolute right-0 top-1/2 -translate-y-1/2 p-2 rounded-full transition-all duration-200 z-10 
              ${
                canScrollRight
                  ? "bg-gray-200 hover:bg-gray-300 text-black dark:bg-black dark:hover:bg-zinc-700/80 dark:text-white"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-zinc-950 dark:text-zinc-500"
              }`}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <style jsx>{`
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
        `}</style>
      </div>
    </div>
  );
};

export default FilterTabs;
