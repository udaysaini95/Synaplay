"use client";

import { useEffect } from "react";
import { socket } from "@/lib/socket";

import DrawingCanvas from "@/components/DrawingCanvas";

export default function Home() {
  return (
    <main>
      <DrawingCanvas />
    </main>
  );
}
