import { Mail, Github, Linkedin, Globe, Heart, Info } from "lucide-react";
import Image from "next/image";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "./ui/button";

interface ProfileCardProps {
  name: string;
  title: string;
  imageUrl: string;
  showHeart?: boolean;
  socialLinks?: {
    email?: string;
    twitter?: string;
    github?: string;
    linkedin?: string;
    website?: string;
  };
}

export function ProfileCard({
  name,
  title,
  imageUrl,
  showHeart = true,
  socialLinks = {},
}: ProfileCardProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="secondary"
          className="
            flex items-center gap-2 rounded-full 
            bg-white text-black  shadow-md
            hover:bg-gray-100
            dark:bg-black dark:text-white dark:hover:bg-zinc-800
          "
        >
          <Info className="h-4 w-4 text-zinc-500" />
          <div className="hidden sm:flex flex-col text-left">
            <span className="font-semibold">About</span>
          </div>
          <span className="sm:hidden font-medium">Contribute</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full max-w-sm rounded-2xl dark:bg-black p-6">
        <div className="flex items-start gap-4 mb-6">
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-semibold dark:text-white mb-1">
              Made by {name}
            </h2>
            <div className="flex items-center gap-2">
              <p className="text-sm text-gray-400">{title}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6">
          {socialLinks.email && (
            <a
              href={`mailto:${socialLinks.email}`}
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="Email"
            >
              <Mail className="h-5 w-5" />
            </a>
          )}
          {socialLinks.twitter && (
            <a
              href={socialLinks.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="Twitter/X"
            >
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
                <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
              </svg>
            </a>
          )}
          {socialLinks.github && (
            <a
              href={socialLinks.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="GitHub"
            >
              <Github className="h-5 w-5" />
            </a>
          )}
          {socialLinks.linkedin && (
            <a
              href={socialLinks.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="h-5 w-5" />
            </a>
          )}
          {socialLinks.website && (
            <a
              href={socialLinks.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="Website"
            >
              <Globe className="h-5 w-5" />
            </a>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
