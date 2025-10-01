"use client";

import { useState } from "react";
import { OpenStreetMapProvider } from "leaflet-geosearch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface SearchFormProps {
  setMapCoordinates: (coords: [number, number]) => void;
}

export default function SearchInSideBar({setMapCoordinates}: SearchFormProps){
    const [query, setQuery] = useState("")
    const [loading, setLoading] = useState(false)
    const [suggestions, setSuggestions] = useState<any[]>([])
    const provider = new OpenStreetMapProvider();
    async function handleChange(value: string){
        setQuery(value);
        if(value.length < 3){
            setSuggestions([])
            return ;
        }
        const results = await provider.search({query: value});
        setSuggestions(results)
    }
    function handleSelect(result: any){
      setMapCoordinates([result.y, result.x]); // y x lat lng on popup here long lat shayad
      setQuery(result.label); // fill input with chosen place
      setSuggestions([]); // clear suggestions
    }
    // async function handleSearch(e: React.FormEvent){
    //     e.preventDefault()
    //     setLoading(true)
    //     try {
    //       const provider = new OpenStreetMapProvider();
    //       const results = await provider.search({ query });
    //       if (results.length > 0) {
    //         const { y, x } = results[0];
    //         setMapCoordinates([x, y]);
    //       } else {
    //         alert("No results found");
    //       }
    //     } catch(err) {
    //       console.error("Search failed:", err);
    //     } finally {
    //       setLoading(false);
    //     }

    // } 
      return (
        <div>
          <label htmlFor="locationSearch">Search Location</label>

          <Input
            id="locationSearch"
            value={query}
            onChange={(e) => handleChange(e.target.value)}
            placeholder="e.g. Karachi, Pakistan"
          />
          {suggestions.length > 0 && (
            <ul className="absolute z-50 bg-white dark:bg-black dark:text-white border rounded-md mt-1 max-h-40 overflow-y-auto w-[90%]">
              {suggestions.map((s, i) => (
                <li
                  key={i}
                  className="px-2 py-1 cursor-pointer text-gray-700 dark:text-white dark:hover:bg-zinc-900 hover:bg-zinc-300"
                  onClick={() => handleSelect(s)}
                >
                  {s.label}
                </li>
              ))}
            </ul>
          )}
        </div>
      );
}
