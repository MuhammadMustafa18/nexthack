"use client";
import { useEffect } from "react";

export default function LeafletClientSetup() {
  useEffect(() => {
    Promise.all([
      import("leaflet/dist/leaflet.css"),
      import("leaflet-geosearch/dist/geosearch.css"),
      import("leaflet"),
    ]).then(([_, __, L]) => {
      delete (L.Icon.Default.prototype as any)._getIconUrl;

      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "/leaflet/marker-icon-2x.png",
        iconUrl: "/leaflet/marker-icon.png",
        shadowUrl: "/leaflet/marker-shadow.png",
      });
    });
  }, []);

  return null;
}
