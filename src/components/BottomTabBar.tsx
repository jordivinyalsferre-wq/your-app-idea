import { Link, useLocation } from "@tanstack/react-router";
import { Sun, ScrollText, Columns3, User } from "lucide-react";

const tabs = [
  { to: "/", icon: Sun, label: "Avui" },
  { to: "/habits", icon: ScrollText, label: "Pràctica" },
  { to: "/temple", icon: Columns3, label: "Temple" },
  { to: "/profile", icon: User, label: "Perfil" },
] as const;

export function BottomTabBar() {
  const { pathname } = useLocation();
  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 safe-bottom">
      <div className="mx-auto max-w-md px-4 pb-2">
        <div className="rounded-3xl bg-card/85 backdrop-blur-xl border border-border shadow-soft flex items-center justify-around px-2 py-2">
          {tabs.map(({ to, icon: Icon, label }) => {
            const active = to === "/" ? pathname === "/" : pathname.startsWith(to);
            return (
              <Link key={to} to={to} className="flex-1 flex flex-col items-center gap-0.5 py-1.5 rounded-2xl transition-colors">
                <div className={`flex items-center justify-center h-9 w-9 rounded-2xl transition-all ${active ? "bg-gradient-sunset text-white shadow-glow" : "text-muted-foreground"}`}>
                  <Icon className="h-[18px] w-[18px]" strokeWidth={2.2} />
                </div>
                <span className={`text-[10px] font-medium tracking-wide ${active ? "text-foreground" : "text-muted-foreground"}`}>{label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
