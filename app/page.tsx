"use client";

import { useState } from "react";

export default function Home() {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleShorten(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/shorten", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Failed to shorten URL");
        return;
      }

      setShortUrl(data.shortUrl);
    } catch {
      setError("Failed to reach the server");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto flex min-h-screen w-full max-w-2xl items-center px-6 py-16">
        <section className="w-full rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">
            ShortURL
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950">
            Turn a long link into a short one.
          </h1>
          <p className="mt-3 max-w-lg text-base text-slate-600">
            Paste a URL, click shorten, and the app will save it in the database
            and return a short link.
          </p>

          <form className="mt-8 flex flex-col gap-4 sm:flex-row" onSubmit={handleShorten}>
            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com/very/long/link"
              className="h-12 flex-1 rounded-2xl border border-slate-300 bg-white px-4 text-slate-900 outline-none transition focus:border-slate-900"
            />
            <button
              type="submit"
              disabled={loading}
              className="h-12 rounded-2xl bg-slate-900 px-6 font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Shortening..." : "Shorten"}
            </button>
          </form>

          {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}

          {shortUrl ? (
            <div className="mt-6 rounded-2xl bg-slate-100 p-4">
              <p className="text-sm text-slate-500">Your short URL</p>
              <a className="mt-1 block break-all font-medium text-slate-950 underline" href={shortUrl}>
                {shortUrl}
              </a>
            </div>
          ) : null}
        </section>
      </div>
    </main>
  );
}