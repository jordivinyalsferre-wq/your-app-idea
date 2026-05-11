import { ReactNode } from "react";
import { BottomTabBar } from "./BottomTabBar";

export function MobileShell({ children, hideTabs, fullscreen }: { children: ReactNode; hideTabs?: boolean; fullscreen?: boolean }) {
  return (
    <div className={fullscreen ? "h-[100dvh] bg-background overflow-hidden" : "min-h-[100dvh] bg-background"}>
      <div className={`mx-auto max-w-md ${fullscreen ? "h-full" : "min-h-[100dvh] pb-28"}`}>{children}</div>
      {!hideTabs && <BottomTabBar />}
    </div>
  );
}
