import Fuse from "fuse.js";
import { useState, useEffect } from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandDialog,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"
import { Button } from "./ui/button";
import { Search } from "lucide-react";
import { Calendar, Trophy, GraduationCap, Users } from "lucide-react";
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
  source: string;

};

// Simple helper to map type → icon
const getIcon = (type: string | null) => {
  switch (type?.toLowerCase()) {
    case "hackathon":
      return <Trophy className="h-6 w-6 dark:text-gray-300" />;
    case "workshop":
      return <GraduationCap className="h-6 w-6  dark:text-gray-300" />;
    case "conference":
      return <Users className="h-6 w-6  dark:text-gray-300" />;
    default:
      return <Calendar className="h-6 w-6  dark:text-gray-300" />;
  }
};

interface props{
    events: Event[];
    setSelected?: (event: Event | null) => void
}

const EventSearch = ({ events, setSelected }: props) => {
  const [query, setQuery] = useState("");
  const [filtered, setFiltered] = useState(events);
  const [open, setOpen] = useState(false);

  // Step 2a: Create the Fuse instance
  const fuse = new Fuse(events, {
    keys: [
      { name: "name", weight: 0.4 },
      { name: "organizer", weight: 0.1 },
      { name: "type", weight: 0.1 },
      { name: "description", weight: 0.2 },
      { name: "category", weight: 0.2 },
    ],
    threshold: 0.3, // controls fuzziness (lower = stricter)
  });

  // Step 3: Perform search whenever query changes
  useEffect(() => {
    if (!query) return setFiltered(events); // no query = show all

    const results = fuse.search(query).map((r) => r.item); // get original items
    setFiltered(results);
  }, [query, events]);

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        variant="secondary"
        className="flex items-center gap-2 py-5 px-8 text-base shadow-md rounded-full 
                   bg-white text-black dark:bg-black dark:text-white
                   hover:bg-gray-100 dark:hover:bg-gray-800"
      >
        <Search className="w-4 h-4" />
        Search Hackathons
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <Command className="rounded-lg p-2 shadow-md md:min-w-[500px]">
          <CommandInput
            placeholder="Search hackathons..."
            value={query}
            onValueChange={(val) => setQuery(val)}
            className=""
          />
          <CommandList className="my-3">
            {filtered.map((event) => (
              <CommandItem
                key={event.id}
                onSelect={() => {
                  setSelected?.(event);
                  setOpen(false); // 👈 closes the dialog
                }}
                className="flex items-center gap-4 p-2 rounded-md hover:bg-accent cursor-pointer"
              >
                <div
                  className="
    flex-shrink-0 
    p-3 
    rounded-lg 
    border 
    bg-gray-100 border-gray-300 
    dark:bg-zinc-800 dark:border-gray-600
    mt-1
  "
                >
                  {getIcon(event.type)}
                </div>{" "}
                <div className="flex flex-col w-full">
                  {/* Event Name */}
                  <span className="font-semibold text-base text-gray-900 dark:text-gray-100">
                    {event.name}
                  </span>

                  {/* Tags row */}
                  <div className="flex flex-wrap gap-2 mt-1">
                    {event.type && (
                      <span className="px-2 py-0.5 text-xs uppercase rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                        {event.type}
                      </span>
                    )}

                    {event.category && (
                      <span className="px-2 py-0.5 text-xs rounded-full uppercase bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300">
                        {event.category}
                      </span>
                    )}
                  </div>
                </div>
              </CommandItem>
            ))}
          </CommandList>
          {/* <ul>
        {filtered.map((e) => (
          <li key={e.id}>
            <strong>{e.name}</strong> - {e.category} ({e.type})
          </li>
        ))}
      </ul> */}
        </Command>
      </CommandDialog>
    </>
  );
};

export default EventSearch;
