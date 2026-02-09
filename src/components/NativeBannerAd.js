"use client";
import { useEffect, useRef } from "react";

export default function NativeBannerAd() {
    const adContainerRef = useRef(null);
    const scriptAddedRef = useRef(false);

    useEffect(() => {
        // Prevent adding script multiple times
        if (scriptAddedRef.current) return;
        scriptAddedRef.current = true;

        // Create and inject the ad script
        const script = document.createElement("script");
        script.src =
            "https://pl28683791.effectivegatecpm.com/dd10dbe7ef48e5e912f6ed97a503d861/invoke.js";
        script.async = true;
        script.setAttribute("data-cfasync", "false");

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
        <div ref={adContainerRef} className="flex justify-center items-center my-4">
            <div id="container-dd10dbe7ef48e5e912f6ed97a503d861"></div>
        </div>
    );
}
