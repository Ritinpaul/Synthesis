"use client";

import React, { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";

export function SynthesisMermaid({ chart }: { chart: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    try {
      mermaid.initialize({
        startOnLoad: false,
        theme: "dark",
        securityLevel: "loose",
        themeVariables: {
          darkMode: true,
          background: "#060A0A",
          primaryColor: "#10B981",
          primaryBorderColor: "#142321",
          primaryTextColor: "#F1F5F9",
          lineColor: "#10B981",
          secondaryColor: "#0A1211",
          tertiaryColor: "#101B1A",
        },
      });

      if (containerRef.current) {
        const id = `mermaid-${Math.random().toString(36).substring(2, 9)}`;
        mermaid
          .render(id, chart)
          .then(({ svg }) => {
            if (containerRef.current) {
              containerRef.current.innerHTML = svg;
              setHasError(false);
            }
          })
          .catch((err) => {
            console.warn("Meridian SVG render notice:", err);
            setHasError(true);
          });
      }
    } catch (e) {
      console.warn("Mermaid initialize error:", e);
      setHasError(true);
    }
  }, [chart]);

  if (hasError) {
    return (
      <div className="w-full text-center py-6 text-xs text-slate-400 font-mono">
        Topology render active • Inspecting pipeline nodes...
      </div>
    );
  }

  return <div ref={containerRef} className="w-full flex justify-center py-4 overflow-x-auto" />;
}
