import { createFileRoute } from "@tanstack/react-router";
import { Download, Trash2 } from "lucide-react";
import { MobileShell } from "@/components/MobileShell";
import { usePractices, useProfile } from "@/hooks/useHabits";

export const Route = createFileRoute("/profile")({
  component: ProfilePage,
});

function ProfilePage() {
  const { profile, setProfile } = useProfile();
  const { states } = usePractices();
  const activeCount = Object.values(states).filter((s) => s.isActive).length;

  function exportData() {
    const blob = new Blob([JSON.stringify({ profile, practices: states }, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "naosium-export.json"; a.click();
    URL.revokeObjectURL(url);
  }

  function reset() {
    if (!confirm("Esborrar tots els hàbits i el perfil?")) return;
    localStorage.removeItem("olympia.practices.v1");
    localStorage.removeItem("olympia.profile.v1");
    location.reload();
  }

  return (
    <MobileShell>
      <div className="px-6 pt-12 pb-6">
        <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">El teu</div>
        <h1 className="font-display text-3xl mt-1">Perfil</h1>
      </div>

      <div className="px-5">
        <div className="rounded-3xl bg-card border border-border p-5 shadow-soft flex items-center gap-4">
          <div className="h-14 w-14 rounded-2xl bg-gradient-sunset text-white flex items-center justify-center font-display text-2xl shadow-glow">
            {(profile.name || "A").charAt(0).toUpperCase()}
          </div>
          <div className="flex-1">
            <input
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              className="w-full bg-transparent font-display text-xl outline-none"
            />
            <div className="text-xs text-muted-foreground">{activeCount} pràctiques actives</div>
          </div>
        </div>

        <div className="mt-4 rounded-3xl bg-card border border-border shadow-soft overflow-hidden">
          <button onClick={exportData} className="w-full flex items-center gap-3 px-5 py-4 hover:bg-muted/50 transition-colors text-left">
            <Download className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Exportar dades</span>
          </button>
          <div className="border-t border-border" />
          <button onClick={reset} className="w-full flex items-center gap-3 px-5 py-4 hover:bg-muted/50 transition-colors text-left text-destructive">
            <Trash2 className="h-4 w-4" />
            <span className="text-sm font-medium">Esborrar totes les dades</span>
          </button>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-8 font-display italic">
          "Som allò que fem repetidament."
        </p>
      </div>
    </MobileShell>
  );
}
