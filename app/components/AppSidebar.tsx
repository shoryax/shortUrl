import { useState } from "react";
import { Home, QrCode, BarChart3, Settings, Sparkles } from "lucide-react";

const items = [
  { id: "home", label: "Home", icon: Home, link: "/" },
  { id: "qr", label: "QR Codes", icon: QrCode, link: "/components/qr" },
  { id: "analytics", label: "Analytics", icon: BarChart3, link: "/components/analytics" },
  { id: "ai", label: "AI Tools", icon: Sparkles, link: "/components/ai" },
  { id: "settings", label: "Settings", icon: Settings, link: "/components/settings" },
];

export function AppSidebar() {
  const [active, setActive] = useState("home");

  return (
    <aside className="flex w-full flex-row items-center gap-6 border-b border-border/60 bg-background/60 p-4 backdrop-blur">
      <div className="flex items-center gap-2 shrink-0">
        <div className="grid h-8 w-8 shrink-0 place-items-center rounded-md border border-border bg-card">
          <span className="font-mono text-sm font-bold tracking-tighter">c/</span>
        </div>
        <div className="min-w-0">
          <div className="truncate font-mono text-sm font-semibold tracking-tight">cuturl.space</div>
          <div className="truncate text-[10px] tracking-[0.2em] text-muted-foreground">short the url</div>
        </div>
      </div>

      <nav className="flex flex-row flex-wrap items-center gap-1.5">
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