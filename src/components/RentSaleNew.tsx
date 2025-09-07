"use client";

import type React from "react";

import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
  Play,
  Shuffle,
  MapPin,
  Share2,
  Info,
  Github,
  Heart,
  Search,
  Star,
  ExternalLink,
  Coffee,
  X,
} from "lucide-react";

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  setPrimaryText: React.Dispatch<React.SetStateAction<string>>;
  setSecondaryText: React.Dispatch<React.SetStateAction<string>>;
}

interface SupportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Support Dialog Component
export function SupportDialog({ open, onOpenChange }: SupportDialogProps) {
  const handleStarRepo = () => {
    window.open("https://github.com/MuhammadMustafa18/property-cast", "_blank");
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Property Map Application",
          text: "Check out this amazing property mapping tool!",
          url: window.location.origin,
        });
      } catch (error) {
        console.log("Share cancelled");
      }
    } else {
      navigator.clipboard.writeText(window.location.origin);
      alert("Link copied to clipboard!");
    }
  };

  const handleDonate = () => {
    // Replace with your donation link
    window.open("https://buymeacoffee.com/yourusername", "_blank");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-w-[90%] p-0 bg-white border-0 shadow-2xl rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-zinc-600 to-zinc-900 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Heart className="h-6 w-6 fill-white" />
              <h2 className="text-xl font-bold">Support Us</h2>
            </div>
            <button
              onClick={() => onOpenChange(false)}
              className="p-1 hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <p className="text-purple-100 mt-2">
            Help us grow and improve this project!
          </p>
        </div>

        {/* Support Options */}
        <div className="p-6 space-y-4">
          {/* GitHub Star */}
          <button
            onClick={handleStarRepo}
            className="w-full flex items-center gap-4 p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all duration-200 group"
          >
            <div className="p-2 bg-gray-100 rounded-lg group-hover:scale-110 transition-transform">
              <Star className="h-5 w-5 text-zinc-400 fill-zinc-400" />
            </div>
            <div className="flex-1 text-left">
              <h3 className="font-semibold text-gray-900">Star on GitHub</h3>
              <p className="text-sm text-gray-600">
                Give us a star to show your support
              </p>
            </div>
            <ExternalLink className="h-4 w-4 text-gray-400" />
          </button>

          {/* Share */}
          <button
            onClick={handleShare}
            className="w-full flex items-center gap-4 p-4 bg-muted/30 hover:bg-muted/50 rounded-lg transition-colors"
          >
            <div className="p-2 bg-muted rounded-lg">
              <Share2 className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="flex-1 text-left">
              <h3 className="font-medium text-foreground">
                Share with Friends
              </h3>
              <p className="text-sm text-muted-foreground">
                Spread the word about our project
              </p>
            </div>
          </button>

          {/* Donate */}
          <button
            onClick={handleDonate}
            className="w-full flex items-center gap-4 p-4 bg-muted/30 hover:bg-muted/50 rounded-lg transition-colors"
          >
            <div className="p-2 bg-muted rounded-lg">
              <Coffee className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="flex-1 text-left">
              <h3 className="font-medium text-foreground">Buy Us a Coffee</h3>
              <p className="text-sm text-muted-foreground">
                Support development with a small donation
              </p>
            </div>
            <ExternalLink className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t">
          <p className="text-xs text-gray-500 text-center">
            Your support helps us maintain and improve this project. Thank you!
            ❤️
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function RentSaleNew({
  open,
  onOpenChange,
  setPrimaryText,
  setSecondaryText,
}: CommandPaletteProps) {
  const [search, setSearch] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [supportDialogOpen, setSupportDialogOpen] = useState(false);
  const router = useRouter();

  const commands = [
    // Original commands
    {
      id: "view",
      icon: Play,
      title: "View Property",
      description: "Hover or click any property",
      shortcut: "Space",
      category: "CONTROLS",
      action: () => {
        console.log("View action");
      },
    },
    {
      id: "add",
      icon: Shuffle,
      title: "Add Property",
      description: "Click on the map and add details",
      shortcut: "R",
      category: "CONTROLS",
      action: () => console.log("Add action"),
    },
    {
      id: "search",
      icon: MapPin,
      title: "Find by Search",
      description: "In production",
      shortcut: "L",
      category: "CONTROLS",
      action: () => console.log("Locate action"),
    },
    {
      id: "estimate",
      icon: Share2,
      title: "Estimate Price by ML",
      description: "In production",
      shortcut: "C",
      category: "CONTROLS",
      action: () => console.log("Share action"),
    },
    // New navigation commands
    {
      id: "about",
      icon: Info,
      title: "About the Project",
      description: "Learn about our purpose and goals",
      shortcut: "A",
      category: "NAVIGATION",
      action: () => {
        router.push("/about");
      },
    },
    {
      id: "contribute",
      icon: Github,
      title: "Contribute",
      description: "Help with code, design, content, docs",
      shortcut: "G",
      category: "NAVIGATION",
      action: () => {
        window.open("https://github.com/yourusername/your-repo", "_blank");
      },
    },
    {
      id: "support",
      icon: Heart,
      title: "Support Us",
      description: "Ways to support (star, share, donate)",
      shortcut: "S",
      category: "NAVIGATION",
      action: () => {
        setSupportDialogOpen(true);
      },
    },
  ];

  const filteredCommands = commands.filter(
    (command) =>
      command.title.toLowerCase().includes(search.toLowerCase()) ||
      command.description.toLowerCase().includes(search.toLowerCase())
  );

  // Group commands by category
  const groupedCommands = filteredCommands.reduce((acc, command) => {
    if (!acc[command.category]) {
      acc[command.category] = [];
    }
    acc[command.category].push(command);
    return acc;
  }, {} as Record<string, typeof commands>);

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
        setPrimaryText(filteredCommands[selectedIndex].title);
        setSecondaryText(filteredCommands[selectedIndex].description);
        onOpenChange(false);
      }
    } else if (e.key === "Escape") {
      onOpenChange(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="p-0 sm:max-w-2xl  bg-card border-border shadow-2xl rounded-2xl overflow-hidden">
          {/* Search Header */}
          <div className="flex items-center border-b border-border px-4 bg-gradient-to-r from-blue-50 to-purple-50">
            <Search className="mr-3 h-5 w-5 shrink-0 text-zinc-600" />
            <Input
              placeholder="Type a command or search features..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setSelectedIndex(0);
              }}
              onKeyDown={handleKeyDown}
              className="flex h-14 w-full rounded-none border-0 bg-transparent py-4 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-0"
              autoFocus
            />
          </div>

          {/* Commands */}
          <div className="max-h-[400px] overflow-y-auto">
            {Object.entries(groupedCommands).map(
              ([category, categoryCommands]) => (
                <div key={category} className="px-3 py-3">
                  <p className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    {category}
                  </p>
                  <div className="space-y-1">
                    {categoryCommands.map((command, index) => {
                      const globalIndex = filteredCommands.indexOf(command);
                      const Icon = command.icon;
                      const isSelected = globalIndex === selectedIndex;

                      return (
                        <button
                          key={command.id}
                          onClick={() => {
                            command.action();
                            setPrimaryText(command.title);
                            setSecondaryText(command.description);
                            onOpenChange(false);
                          }}
                          className={`w-full flex items-center gap-3 px-3 py-3 text-left rounded-xl transition-all duration-200 ${
                            isSelected
                              ? "bg-gradient-to-r from-zinc-500 to-zinc-500 text-white shadow-lg transform scale-[1.02]"
                              : "hover:bg-gray-50 hover:shadow-sm"
                          }`}
                          onMouseEnter={() => setSelectedIndex(globalIndex)}
                        >
                          <div
                            className={`p-2 rounded-lg transition-colors ${
                              isSelected
                                ? "bg-white/20"
                                : command.category === "CONTROLS"
                                ? "bg-blue-100"
                                : "bg-purple-100"
                            }`}
                          >
                            <Icon
                              className={`h-4 w-4 ${
                                isSelected
                                  ? "text-white"
                                  : command.category === "CONTROLS"
                                  ? "text-zinc-600"
                                  : "text-zinc-600"
                              }`}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div
                              className={`text-sm font-semibold ${
                                isSelected ? "text-white" : "text-gray-900"
                              }`}
                            >
                              {command.title}
                            </div>
                            <div
                              className={`text-xs ${
                                isSelected ? "text-white/80" : "text-gray-600"
                              }`}
                            >
                              {command.description}
                            </div>
                          </div>
                          <kbd
                            className={`pointer-events-none inline-flex h-6 select-none items-center gap-1 rounded border px-2 font-mono text-[10px] font-medium transition-colors ${
                              isSelected
                                ? "bg-white/20 text-white border-white/30"
                                : "bg-gray-100 text-gray-600 border-gray-200"
                            }`}
                          >
                            {command.shortcut}
                          </kbd>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )
            )}

            {filteredCommands.length === 0 && (
              <div className="px-6 py-8 text-center">
                <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-sm">
                  No commands found for "{search}"
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t bg-gray-50 px-4 py-3">
            <p className="text-xs text-gray-500 text-center">
              Use ↑↓ to navigate • Enter to select • Esc to close
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Support Dialog */}
      <SupportDialog
        open={supportDialogOpen}
        onOpenChange={setSupportDialogOpen}
      />
    </>
  );
}
