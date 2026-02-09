"use client";
import { useEffect, useRef } from "react";

export default function BannerAd() {
  const adContainerRef = useRef(null);
  const scriptAddedRef = useRef(false);

  useEffect(() => {
    // Prevent adding script multiple times
    if (scriptAddedRef.current) return;
    scriptAddedRef.current = true;

    // Set the atOptions on window
    window.atOptions = {
      key: "55d08c55375b2b92f1093ea1ec02124d",
      format: "iframe",
      height: 90,
      width: 728,
      params: {},
    };

    // Create and inject the ad script
    const script = document.createElement("script");
    script.src =
      "https://www.highperformanceformat.com/55d08c55375b2b92f1093ea1ec02124d/invoke.js";
    script.async = true;

    if (adContainerRef.current) {
      adContainerRef.current.appendChild(script);
    }

    return () => {
      // Cleanup on unmount
      if (adContainerRef.current) {
        adContainerRef.current.innerHTML = "";
      }
      scriptAddedRef.current = false;
    };
  }, []);

  return (
    <div
      ref={adContainerRef}
      className="flex justify-center items-center my-4"
      style={{ minHeight: "90px", minWidth: "728px", maxWidth: "100%" }}
    />
  );
}
