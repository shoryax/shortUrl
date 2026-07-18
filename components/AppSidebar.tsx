import { useState } from "react";
import { Home, Link2, QrCode, BarChart3, Settings, Sparkles } from "lucide-react";

const items = [
  { id: "home", label: "Home", icon: Home, link: "/" },
  { id: "shorten", label: "Shorten", icon: Link2, link: "/shorten" },
  { id: "qr", label: "QR Codes", icon: QrCode, link: "/qr" },
  { id: "analytics", label: "Analytics", icon: BarChart3, link: "/components/analytics" },
  { id: "ai", label: "AI Tools", icon: Sparkles, link: "/ai" },
  { id: "settings", label: "Settings", icon: Settings, link: "/settings" },
];

export function AppSidebar() {
  const [active, setActive] = useState("home");

  return (
    <aside className="flex w-full flex-col gap-6 border-b border-border/60 bg-background/60 p-4 backdrop-blur md:h-screen md:w-64 md:border-b-0 md:border-r md:p-6">
      <div className="flex items-center gap-2">
        <div className="grid h-8 w-8 shrink-0 place-items-center rounded-md border border-border bg-card">
          <span className="font-mono text-sm font-bold tracking-tighter">c/</span>
        </div>
        <div className="min-w-0">
          <div className="truncate font-mono text-sm font-semibold tracking-tight">cuturl.space</div>
          <div className="truncate text-[10px] uppercase tracking-[0.2em] text-muted-foreground">URL Engine</div>
        </div>
      </div>

      <nav className="flex flex-row flex-wrap gap-1.5 md:flex-col md:gap-1">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setActive(item.id);
                window.location.assign(item.link);
              }}
              className={`group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all duration-300 ${
                isActive
                  ? "nav-glow"
                  : "border border-transparent text-muted-foreground hover:border-border/70 hover:text-foreground"
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" strokeWidth={1.5} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}