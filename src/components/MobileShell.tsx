import { ReactNode } from "react";
import { BottomTabBar } from "./BottomTabBar";

export function MobileShell({ children, hideTabs }: { children: ReactNode; hideTabs?: boolean }) {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-md min-h-screen pb-28">{children}</div>
      {!hideTabs && <BottomTabBar />}
    </div>
  );
}
