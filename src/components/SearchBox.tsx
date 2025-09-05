"use client"

import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch"
import { useEffect } from "react"
import { useMap } from "react-leaflet"

import "leaflet-geosearch/dist/geosearch.css";
interface componentProps{
 setMapCoordinates: (coords: [number,number] | null) => void;
}
export default function SearchBox({setMapCoordinates}: componentProps){
    const map = useMap();
    
    useEffect(()=>{
        const provider = new OpenStreetMapProvider();
        const searchControl = GeoSearchControl({
          provider,
          style: "bar",
          showMarker: true,
          autoClose: true,
          retainZoomLevel: false,
          animateZoom: true,
          keepResult: false, // keeps the point -> how to add a message or smth here? 
        });
        map.addControl(searchControl)
        // fired a listener 
        // result contains x,y 
        map.on("geosearch/showlocation", (result: any) => {
           const { y, x } = result.location; // lat = y, lon = x
           setMapCoordinates([y, x]);
         });
        // ye kya
        return () => {
          map.removeControl(searchControl);
          map.off("geosearch/showlocation"); // clean up listener
        }
     })
     return null; // what role basically no jsx, rather only the functionality of attaching the location to the map?
}