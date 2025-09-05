"use client";

import { useState, useEffect } from "react";
import { RentSaleNew } from "./RentSaleNew";
interface RentSaleParentProps {
  setPrimaryText: React.Dispatch<React.SetStateAction<string>>;
  setSecondaryText: React.Dispatch<React.SetStateAction<string>>;
}
export default function RentSaleParent({
  setPrimaryText,
  setSecondaryText,
}: RentSaleParentProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <div className="pt-3">
      <div className="text-center space-y-4">
        <button
          onClick={() => setIsOpen(true)}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors"
        >
          Open Menu
        </button>
      </div>

      <RentSaleNew
        open={isOpen}
        onOpenChange={setIsOpen}
        setPrimaryText={setPrimaryText}
        setSecondaryText={setSecondaryText}
      />
    </div>
  );
}
