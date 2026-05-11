import { Link, useLocation } from "@tanstack/react-router";
import { Columns3, ScrollText, User } from "lucide-react";

const tabs = [
  { to: "/", icon: Columns3, label: "Temple" },
  { to: "/habits", icon: ScrollText, label: "Pràctica" },
  { to: "/profile", icon: User, label: "Perfil" },
] as const;

export function BottomTabBar() {
  const { pathname } = useLocation();
  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 safe-bottom">
      <div className="mx-auto max-w-md px-4 pb-2">
        <div className="rounded-2xl bg-white/[0.04] backdrop-blur-2xl border border-white/[0.06] flex items-center justify-around px-3 py-1.5">
          {tabs.map(({ to, icon: Icon, label }) => {
            const active = to === "/" ? pathname === "/" : pathname.startsWith(to);
            return (
              <Link key={to} to={to} className="flex-1 flex flex-col items-center gap-0.5 py-2 rounded-xl transition-colors">
                <div className={`flex items-center justify-center h-8 w-8 rounded-xl transition-all ${active ? "text-white" : "text-white/25"}`}>
                  <Icon className="h-[18px] w-[18px]" strokeWidth={active ? 2.4 : 1.8} />
                </div>
                <span className={`text-[9px] font-medium tracking-[0.05em] ${active ? "text-white/80" : "text-white/25"}`}>{label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
