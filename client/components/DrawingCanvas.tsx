"use client";

import { useEffect, useRef, useState } from "react";

export default function DrawingCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [drawColor, setDrawColor] = useState("black");
  const [drawWidth, setDrawWidth] = useState(2);

  const isDrawingRef = useRef(false);

  const pathRef = useRef<ImageData[]>([]);
  const indexRef = useRef(-1);

  const canvasStartColor = "white";

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    canvas.width = window.innerWidth - 60;
    canvas.height = 400;

    const context = canvas.getContext("2d");

    if (!context) return;

    context.fillStyle = canvasStartColor;

    context.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  function getPosition(event: React.PointerEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current;

    if (!canvas) {
      return { x: 0, y: 0 };
    }

    const rect = canvas.getBoundingClientRect();

    const x = (event.clientX - rect.left) * (canvas.width / rect.width);

    const y = (event.clientY - rect.top) * (canvas.height / rect.height);

    return { x, y };
  }

  function start(event: React.PointerEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const context = canvas.getContext("2d");

    if (!context) return;

    isDrawingRef.current = true;

    const { x, y } = getPosition(event);

    context.beginPath();

    context.strokeStyle = drawColor;
    context.lineWidth = drawWidth;
    context.lineCap = "round";
    context.lineJoin = "round";

    context.moveTo(x, y);
  }

  function draw(event: React.PointerEvent<HTMLCanvasElement>) {
    if (!isDrawingRef.current) return;

    const canvas = canvasRef.current;

    if (!canvas) return;

    const context = canvas.getContext("2d");

    if (!context) return;

    const { x, y } = getPosition(event);

    context.lineTo(x, y);

    context.stroke();
  }

  function stop() {
    if (!isDrawingRef.current) return;

    const canvas = canvasRef.current;

    if (!canvas) return;

    const context = canvas.getContext("2d");

    if (!context) return;

    context.stroke();
    context.closePath();

    isDrawingRef.current = false;

    const image = context.getImageData(0, 0, canvas.width, canvas.height);

    pathRef.current.push(image);

    indexRef.current += 1;
  }

  function clearCanvas() {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const context = canvas.getContext("2d");

    if (!context) return;

    context.clearRect(0, 0, canvas.width, canvas.height);

    context.fillStyle = canvasStartColor;

    context.fillRect(0, 0, canvas.width, canvas.height);

    pathRef.current = [];
    indexRef.current = -1;
  }

  function undoPath() {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const context = canvas.getContext("2d");

    if (!context) return;

    if (indexRef.current <= 0) {
      clearCanvas();
      return;
    }

    pathRef.current.pop();

    indexRef.current -= 1;

    context.putImageData(pathRef.current[indexRef.current], 0, 0);
  }

  return (
    <div className="min-h-screen bg-[#111] p-[30px]">
      <div className="flex flex-col items-center gap-5">
        <canvas
          ref={canvasRef}
          onPointerDown={start}
          onPointerMove={draw}
          onPointerUp={stop}
          onPointerLeave={stop}
          className="
            cursor-pointer
            rounded-lg
            border-2
            border-[#444]
            bg-white
            max-w-full
          "
        />

        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={clearCanvas}
            className="
              rounded-md
              border-2
              border-white
              bg-[#222]
              px-5
              py-2
              text-white
              hover:bg-[#333]
            "
          >
            Clear
          </button>

          <button
            onClick={undoPath}
            className="
              rounded-md
              border-2
              border-white
              bg-[#222]
              px-5
              py-2
              text-white
              hover:bg-[#333]
            "
          >
            Undo
          </button>

          <button
            onClick={() => setDrawColor("black")}
            className="h-10 w-10 rounded-md border-2 border-white bg-black"
          />

          <button
            onClick={() => setDrawColor("green")}
            className="h-10 w-10 rounded-md border-2 border-white bg-green-500"
          />

          <button
            onClick={() => setDrawColor("red")}
            className="h-10 w-10 rounded-md border-2 border-white bg-red-500"
          />

          <button
            onClick={() => setDrawColor("blue")}
            className="h-10 w-10 rounded-md border-2 border-white bg-blue-500"
          />

          <button
            onClick={() => setDrawColor("yellow")}
            className="h-10 w-10 rounded-md border-2 border-white bg-yellow-400"
          />

          <input
            type="color"
            value={drawColor}
            onChange={(event) => setDrawColor(event.target.value)}
            className="h-10 w-12 cursor-pointer"
          />

          <input
            type="range"
            min="1"
            max="50"
            value={drawWidth}
            onChange={(event) => setDrawWidth(Number(event.target.value))}
            className="w-[150px]"
          />

          <span className="text-white">{drawWidth}px</span>
        </div>
      </div>
    </div>
  );
}
