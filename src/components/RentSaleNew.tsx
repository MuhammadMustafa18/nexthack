"use client";

import type React from "react";

import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Play,
  Shuffle,
  MapPin,
  Share2,
  VolumeX,
  Volume2,
  Search,
} from "lucide-react";

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  setPrimaryText: React.Dispatch<React.SetStateAction<string>>;
  setSecondaryText: React.Dispatch<React.SetStateAction<string>>;
}

const commands = [
  {
    id: "find",
    icon: Play,
    title: "Find Properties",
    description: "Hover or click any property",
    shortcut: "Space",
    action: () => {console.log("Find action");}, // onclick is on action, yaani code mein nahi ghusna parega
  },
  {
    id: "add",
    icon: Shuffle,
    title: "Add Property",
    description: "Click on the map and add details",
    shortcut: "R",
    action: () => console.log("Add action"),
  },
  {
    id: "search",
    icon: MapPin,
    title: "Find by search",
    description: "In production",
    shortcut: "L",
    action: () => console.log("Locate action"),
  },
  {
    id: "estimate",
    icon: Share2,
    title: "Estimate Price by ML",
    description: "In production",
    shortcut: "C",
    action: () => console.log("Share action"),
  },
];

export function RentSaleNew({ open, onOpenChange, setPrimaryText, setSecondaryText }: CommandPaletteProps) {
  const [search, setSearch] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  const filteredCommands = commands.filter(
    (command) =>
      command.title.toLowerCase().includes(search.toLowerCase()) ||
      command.description.toLowerCase().includes(search.toLowerCase())
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev < filteredCommands.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev > 0 ? prev - 1 : filteredCommands.length - 1
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filteredCommands[selectedIndex]) {
        filteredCommands[selectedIndex].action();
        onOpenChange(false);
      }
    } else if (e.key === "Escape") {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 max-w-2xl bg-card border-border">
        <div className="flex items-center border-b border-border px-3">
          <Search className="mr-2 h-4 w-4 shrink-0 text-muted-foreground" />
          <Input
            placeholder="Type a command or search properties..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            className="flex h-12 w-full rounded-none border-0 bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-0"
            autoFocus
          />
         
        </div>

        <div className="max-h-[300px] overflow-y-auto">
          <div className="px-2 py-2">
            <p className="px-2 py-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">
              CONTROLS
            </p>
            <div className="space-y-1">
              {filteredCommands.map((command, index) => {
                const Icon = command.icon;
                return (
                  <button
                    key={command.id}
                    onClick={() => {
                      command.action();
                      setPrimaryText(command.title)
                      setSecondaryText(command.description);
                      onOpenChange(false);
                    }}
                    className={`w-full flex items-center gap-3 px-2 py-2 text-left rounded-md transition-colors ${
                      index === selectedIndex
                        ? "bg-accent text-accent-foreground"
                        : "hover:bg-accent/50"
                    }`}
                    onMouseEnter={() => setSelectedIndex(index)}
                  >
                    <Icon className="h-4 w-4 text-muted-foreground" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-foreground">
                        {command.title}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {command.description}
                      </div>
                    </div>
                    <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                      {command.shortcut}
                    </kbd>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
