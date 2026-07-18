"use client";

import { useState } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { ArrowRight, Link2, Copy, Check } from "lucide-react";

export function CuturlHome() {
  const [url, setUrl] = useState("");
  const [short, setShort] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleShorten = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!url.trim()) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/shorten", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Failed to shorten URL");
        setShort(null);
        return;
      }

      setShort(data.shortUrl);
    } catch {
      setError("Failed to reach the server");
      setShort(null);
    } finally {
      setLoading(false);
    }

    setCopied(false);
  };

  const handleCopy = async () => {
    if (!short) return;
    await navigator.clipboard.writeText(short);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div className="flex min-h-screen w-full flex-col md:flex-row">
      <AppSidebar />

      <main className="relative flex-1 overflow-hidden">
        <div className="pointer-events-none absolute inset-0 dot-field dot-field-fade animate-fade-in-slow" />
        <div className="pointer-events-none absolute inset-0 dot-field dot-field-fade animate-twinkle" style={{ backgroundPosition: "11px 11px" }} />

        <div className="relative z-10 flex min-h-screen flex-col">
          <header className="flex items-center justify-between px-6 py-6 md:px-12">
            {/* <a href="#shorten" className="font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground transition hover:text-foreground">
              docs →
            </a> */}
          </header>

          <section className="flex flex-1 flex-col justify-center px-6 py-16 md:px-12 md:py-24">
            <div className="mx-auto w-full max-w-5xl">
              <h1
                className="animate-fade-up text-balance text-4xl font-light leading-[1.05] tracking-tight text-foreground/60 sm:text-5xl md:text-6xl lg:text-7xl"
                style={{ animationDelay: "0.05s" }}
              >
                Every link you ship is a promise —{" "}
                <span className="text-foreground">
                  cuturl.space keeps it short, fast, and unforgettable.
                </span>
              </h1>

              <p
                className="mt-8 max-w-2xl animate-fade-up text-base text-muted-foreground md:text-lg"
                style={{ animationDelay: "0.2s" }}
              >
                A URL shortener built for creators, teams and campaigns. Custom slugs,
                QR codes, and real-time click analytics — all under one clean roof.
              </p>

              <form
                id="shorten"
                onSubmit={handleShorten}
                className="mt-12 animate-fade-up"
                style={{ animationDelay: "0.35s" }}
              >
                <div className="flex flex-col gap-3 rounded-xl border border-border bg-card/50 p-2 backdrop-blur sm:flex-row sm:items-center">
                  <div className="flex flex-1 items-center gap-3 px-3">
                    <Link2 className="h-4 w-4 shrink-0 text-muted-foreground" strokeWidth={1.5} />
                    <input
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      placeholder="Paste a long URL to shorten..."
                      className="w-full min-w-0 bg-transparent py-3 font-mono text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="group inline-flex items-center justify-center gap-2 rounded-lg bg-foreground px-5 py-3 font-mono text-sm font-medium text-background transition hover:opacity-90"
                  >
                    {loading ? "Shortening..." : "Shorten"}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" strokeWidth={2} />
                  </button>
                </div>

                {error ? (
                  <p className="mt-3 text-sm text-red-400">{error}</p>
                ) : null}

                {short && (
                  <div className="mt-4 flex items-center justify-between gap-3 rounded-lg nav-glow px-4 py-3 animate-fade-up">
                    <span className="truncate font-mono text-sm">{short}</span>
                    <button
                      type="button"
                      onClick={handleCopy}
                      className="inline-flex shrink-0 items-center gap-1.5 font-mono text-xs uppercase tracking-widest text-muted-foreground transition hover:text-foreground"
                    >
                      {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                      {copied ? "Copied" : "Copy"}
                    </button>
                  </div>
                )}
              </form>

              <div
                className="mt-16 grid animate-fade-up grid-cols-2 gap-6 border-t border-border pt-8 sm:grid-cols-4"
                style={{ animationDelay: "0.5s" }}
              >
                {[
                  ["12ms", "avg redirect"],
                  ["99.99%", "uptime"],
                  ["∞", "links/month"],
                  ["190+", "edge regions"],
                ].map(([k, v]) => (
                  <div key={v}>
                    <div className="font-mono text-2xl font-light tracking-tight text-foreground md:text-3xl">
                      {k}
                    </div>
                    <div className="mt-1 text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                      {v}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}