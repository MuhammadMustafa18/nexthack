"use client";

import { useEffect, useRef } from "react";
import "photo-sphere-viewer/dist/photo-sphere-viewer.css";
type PanoViewerProps = {
  url: string; // Cloudinary 360° image
};

export default function StreetView({ url }: PanoViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // only run in browser
    if (!containerRef.current || typeof window === "undefined") return;

    // dynamically import to avoid SSR issues
    import("photo-sphere-viewer").then(({ Viewer }) => {
      const viewer = new Viewer({
        container: containerRef.current!,
        panorama: url,
         
        navbar: ["zoom", "fullscreen", "autorotate"],
        defaultLat: 0.3,
      });

      return () => {
        viewer.destroy();
      };
    });
  }, []);

  return (
    <div
      ref={containerRef}
      style={{ width: "100%", height: "500px", background: "#000" }}
    />
  );
}
