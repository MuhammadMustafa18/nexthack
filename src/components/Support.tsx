"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Code2, Share2, CalendarPlus, Check, Heart } from "lucide-react";
import { FlippingText } from "./Flipping";

const contributionTiers = [
  {
    id: "code",
    title: "Contribute Code",
    icon: Code2,
    description: "Help improve the platform by contributing on GitHub.",
    popular: true,
  },
  {
    id: "share",
    title: "Spread the Word",
    icon: Share2,
    description: "Share NextHack with friends, communities, and socials.",
  },
  {
    id: "events",
    title: "Add Events",
    icon: CalendarPlus,
    description: "Know about a hackathon or meetup? Add it to our list!",
  },
];
interface props{
  setPrimaryText?: (pm: string) => void
}

export function SupportDialog({setPrimaryText}: props) {
  const [selectedTier, setSelectedTier] = useState("code");
  const [open, setOpen] = useState(false);

  const handleSupport = () => {
    const tier = contributionTiers.find((t) => t.id === selectedTier);
    console.log(`Selected contribution: ${tier?.title}`);
    setOpen(false)
    // redirect to GitHub repo or open form depending on tier
    if(tier?.title == "Contribute Code"){
      // redirect github
      window.open("https://github.com/your-repo", "_blank");

    }
    if (tier?.title == "Add Events") {
      // redirect github
      setPrimaryText?.("Add Event")
      
    }
    if (tier?.title == "Spread the Word") {
      // share the project link
      // Use Web Share API (works on mobile)
      if (navigator.share) {
        navigator
          .share({
            title: "NextHack",
            text: "Check out this awesome project 🚀",
            url: "https://nexthack.vercel.app",
          })
          .catch(console.error);
      } else {
        // Fallback: copy link
        navigator.clipboard.writeText("https://nexthack.vercel.app");
        alert("Link copied to clipboard!");
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* Trigger */}
      <DialogTrigger asChild>
        <div className="gap-4 sm:pt-2 sm:pb-3 sm:px-3 shadow-md sm:dark:bg-black rounded-xl flex flex-row items-center border dark:border-zinc-600 sm:bg-white dark:text-white dark:hover:bg-zinc-900/50 hover:text-orange-300 cursor-pointer">
          {/* Heart always visible */}
          <Heart className="h-8 w-8 rounded-md p-2 fill-current text-orange-400 bg-orange-300/50 dark:text-orange-200 dark:bg-orange-500/50" />

          {/* This text block hidden on small screens */}
          <div className="flex-col hidden sm:flex">
            <div className="font-semibold">Contribute to NextHack</div>
            <FlippingText
              staticText="By"
              words={["Coding", "Sharing", "Adding Events", "Collaborating"]}
              textClassName="text-xs font-semibold text-zinc-400"
            />
          </div>
        </div>
      </DialogTrigger>

      {/* Dialog */}
      <DialogContent className="max-w-md border border-zinc-200 bg-white text-black dark:border-zinc-800 dark:bg-black dark:text-white p-0">
        <div className="flex flex-col items-center gap-6 p-6">
          {/* Icon */}
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-100 dark:bg-orange-950/50">
            <Heart className="h-8 w-8 text-orange-500" />
          </div>

          {/* Header */}
          <div className="text-center">
            <h2 className="text-2xl font-semibold">Contribute to NextHack</h2>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              NextHack is community-driven. Help it grow by contributing code,
              sharing the platform, or adding events you know about.
            </p>
          </div>

          {/* Options */}
          <div className="w-full space-y-3">
            {contributionTiers.map((tier) => {
              const Icon = tier.icon;
              const isSelected = selectedTier === tier.id;
              const isPopular = tier.popular;

              return (
                <button
                  key={tier.id}
                  onClick={() => setSelectedTier(tier.id)}
                  className={`relative w-full rounded-xl border p-4 text-left transition-all 
                    ${
                      isPopular
                        ? "border-orange-400/40 bg-orange-50 dark:bg-orange-950/30"
                        : "border-zinc-200 bg-zinc-50 hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900/50"
                    }
                    ${isSelected ? "ring-2 ring-orange-500/50" : ""}
                  `}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg 
                        ${
                          isPopular
                            ? "bg-orange-100 dark:bg-orange-900/50"
                            : "bg-zinc-200 dark:bg-zinc-800"
                        }
                      `}
                    >
                      <Icon
                        className={`h-5 w-5 ${
                          isPopular
                            ? "text-orange-500"
                            : "text-zinc-500 dark:text-zinc-400"
                        }`}
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-semibold">
                          {tier.title}
                        </span>
                        {isPopular && (
                          <span className="rounded-md bg-orange-500/20 px-2 py-0.5 text-xs font-medium text-orange-500">
                            Popular
                          </span>
                        )}
                      </div>
                      <p className="mt-0.5 text-sm text-zinc-600 dark:text-zinc-300">
                        {tier.description}
                      </p>
                    </div>
                    {isSelected && (
                      <Check className="h-5 w-5 shrink-0 text-orange-500" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* CTA */}
          <Button
            onClick={handleSupport}
            className="w-full gap-2 rounded-xl bg-orange-600 py-6 text-base font-medium text-white hover:bg-orange-500"
          >
            Continue with{" "}
            {contributionTiers.find((t) => t.id === selectedTier)?.title}
          </Button>

          {/* Footer */}
          <p className="text-center text-xs text-zinc-500 dark:text-zinc-400">
            Open-source • Community powered
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
