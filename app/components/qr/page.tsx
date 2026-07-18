"use client";

import { useMemo, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { ArrowBigLeft, Download, Link2, Palette, Settings2 } from "lucide-react";

const ERROR_LEVELS = [
  { id: "L", label: "Low (7%)" },
  { id: "M", label: "Medium (15%)" },
  { id: "Q", label: "Quartile (25%)" },
  { id: "H", label: "High (30%)" },
] as const;

type ErrorLevel = (typeof ERROR_LEVELS)[number]["id"];

export default function QrGeneratorPage() {
  const [value, setValue] = useState("https://cuturl.space");
  const [size, setSize] = useState(240);
  const [fgColor, setFgColor] = useState("#0f0f0f");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [errorLevel, setErrorLevel] = useState<ErrorLevel>("M");
  const [includeMargin, setIncludeMargin] = useState(true);

  const isEmpty = useMemo(() => value.trim().length === 0, [value]);

  function handleDownload() {
    const svg = document.getElementById("qr-preview-svg");
    if (!svg) return;

    const serializer = new XMLSerializer();
    const source = serializer.serializeToString(svg);
    const svgBlob = new Blob([source], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(svgBlob);

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, size, size);
      ctx.drawImage(img, 0, 0, size, size);
      URL.revokeObjectURL(url);

      const pngUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = pngUrl;
      link.download = "qr-code.png";
      link.click();
    };
    img.src = url;
  }

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 p-6 md:p-10">
      <div className="flex flex-col gap-1.5">
        <button
          type="button"
          onClick={() => window.location.assign("/")}
          className="inline-flex w-fit items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
        >
            <ArrowBigLeft className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
        </div>
        <h1 className="font-mono text-2xl font-semibold tracking-tight">QR Code Generator</h1>
        <p className="text-sm text-muted-foreground">
          Turn any link or text into a scannable code, styled and ready to export.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-[1.1fr_0.9fr]">
        <div className="flex flex-col gap-5 rounded-lg border border-border bg-card p-5">
          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              <Link2 className="h-3.5 w-3.5" strokeWidth={1.5} />
              Content
            </label>
            <input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="https://your-link.com"
              className="w-full rounded-md border border-border bg-background px-3 py-2 font-mono text-sm outline-none transition-colors focus:border-foreground/40"
            />
          </div>

          <div className="h-px w-full bg-border/60" />

          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            <Settings2 className="h-3.5 w-3.5" strokeWidth={1.5} />
            Options
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <span className="text-xs text-muted-foreground">Size ({size}px)</span>
              <input
                type="range"
                min={120}
                max={480}
                step={8}
                value={size}
                onChange={(e) => setSize(Number(e.target.value))}
                className="accent-foreground"
              />
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-xs text-muted-foreground">Error correction</span>
              <select
                value={errorLevel}
                onChange={(e) => setErrorLevel(e.target.value as ErrorLevel)}
                className="rounded-md border border-border bg-background px-2 py-1.5 text-sm outline-none focus:border-foreground/40"
              >
                {ERROR_LEVELS.map((lvl) => (
                  <option key={lvl.id} value={lvl.id}>
                    {lvl.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <span className="flex items-center gap-2 text-xs text-muted-foreground">
              <Palette className="h-3.5 w-3.5" strokeWidth={1.5} />
              Colors
            </span>
            <div className="grid grid-cols-2 gap-4">
              <label className="flex items-center gap-2 rounded-md border border-border bg-background px-3 py-2">
                <input
                  type="color"
                  value={fgColor}
                  onChange={(e) => setFgColor(e.target.value)}
                  className="h-5 w-5 cursor-pointer rounded border-none bg-transparent"
                />
                <span className="font-mono text-xs text-muted-foreground">Foreground</span>
              </label>
              <label className="flex items-center gap-2 rounded-md border border-border bg-background px-3 py-2">
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="h-5 w-5 cursor-pointer rounded border-none bg-transparent"
                />
                <span className="font-mono text-xs text-muted-foreground">Background</span>
              </label>
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            <input
              type="checkbox"
              checked={includeMargin}
              onChange={(e) => setIncludeMargin(e.target.checked)}
              className="h-3.5 w-3.5 accent-foreground"
            />
            Include quiet margin
          </label>
        </div>

        {/* Preview */}
        <div className="flex flex-col items-center justify-center gap-5 rounded-lg border border-border bg-card p-5">
          <div
            className="grid place-items-center rounded-md border border-border/70 p-4"
            style={{ backgroundColor: bgColor }}
          >
            {isEmpty ? (
              <div className="grid h-60 w-60 place-items-center text-xs text-muted-foreground">
                Enter content to preview
              </div>
            ) : (
              <QRCodeSVG
                id="qr-preview-svg"
                value={value}
                size={size}
                fgColor={fgColor}
                bgColor={bgColor}
                level={errorLevel}
                includeMargin={includeMargin}
              />
            )}
          </div>

          <button
            onClick={handleDownload}
            disabled={isEmpty}
            className="nav-glow flex w-full items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium disabled:pointer-events-none disabled:opacity-40"
          >
            <Download className="h-4 w-4" strokeWidth={1.5} />
            Download PNG
          </button>
        </div>
      </div>
    </div>
  );
}