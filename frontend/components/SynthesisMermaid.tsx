"use client";

import React, { useEffect, useRef } from "react";
import mermaid from "mermaid";

export function SynthesisMermaid({ chart }: { chart: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: "dark",
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
      mermaid.render(id, chart).then(({ svg }) => {
        if (containerRef.current) {
          containerRef.current.innerHTML = svg;
        }
      });
    }
  }, [chart]);

  return <div ref={containerRef} className="w-full flex justify-center py-4 overflow-x-auto" />;
}
