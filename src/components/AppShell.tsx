import type { ReactNode } from "react";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-full w-full flex justify-center bg-[#06080c]">
      <div
        className="relative w-full max-w-[430px] min-h-full shadow-[0_0_80px_rgba(0,0,0,0.65)] border-x border-white/[0.06] overflow-hidden"
        style={{ minHeight: "100dvh" }}
      >
        {children}
      </div>
    </div>
  );
}
