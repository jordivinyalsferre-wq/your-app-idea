## Revisió del codi

He repassat l'estat actual del repositori (rutes, components, hooks i estils). Aquí tens el que he trobat, ordenat per prioritat.

---

### 🔴 Bugs reals

**1. Hydration mismatch a `/` (visible a la consola)**
`src/routes/index.tsx` decideix què renderitzar a partir de:
- `useProfile()` → llegeix `localStorage` (buit al servidor → mostra `Onboarding`; ple al client → mostra `TempleHome`). L'arbre sencer canvia entre SSR i client.
- `new Date().getHours()` i `new Date().toLocaleDateString("ca-ES", …)` → el gradient del cel i la data poden diferir entre servidor i client.

Això provoca l'error que veus: `Hydration failed because the server rendered HTML didn't match the client`.

**2. `usePractices()` i `useProfile()` no comparteixen estat entre instàncies**
Cada component que crida el hook té el seu propi `useState`. A `habits.tsx`, `PracticeRow` invoca `usePractices()` per cada fila → 25 còpies independents de l'estat. Quan toggles una pràctica, les altres files (i el comptador a `/profile`) NO es re-renderitzen amb dades fresques fins a remount. Cal un store compartit (context + reducer, Zustand, o un esdeveniment pub/sub damunt de `localStorage`).

---

### 🟠 Codi mort i restes de refactors anteriors

- `src/routes/temple.tsx` → només és un `redirect("/")`. Es pot eliminar; el bottom-tab ja apunta a `/`.
- `src/components/ProgressRing.tsx` → no l'utilitza ningú (`rg` confirma 0 imports). Es pot eliminar.
- `useHabits.ts` re-exporta `Pillar` i defineix `PILLARS` que ningú consumeix. Netejar.
- Claus de localStorage (`olympia.profile.v1`, `olympia.practices.v1`) conserven el nom antic "olympia" tot i que la marca actual és **Naosium**. No cal renombrar (trencaria les dades existents) però val la pena documentar-ho o fer migració.

---

### 🟡 Inconsistències de disseny

- `src/routes/habits.tsx` usa colors **hardcodejats** (`BG = "#050410"`, `TEXT`, `MUTED`, `ACTIVE`, `DIVIDER`) en lloc de tokens semàntics. Trenca la regla del design system i fa que la pàgina no respongui a canvis globals.
- `src/routes/profile.tsx` té estètica de **card genèric shadcn** (avatar gradient, "Perfil", botons rounded-3xl) que no encaixa amb l'aesthetic Monument-Valley/temple grec de la home. Desentona molt.
- `Onboarding` (dins `index.tsx`) embolica `min-h-screen` dins de `MobileShell` que ja és `min-h-[100dvh]` → doble alçada / padding redundant.

---

### 🟢 Millores opcionals (no bloquegen)

- **`TempleScene.tsx`** té ~300 línies amb paleta, helpers iso, sub-components (`Box`, `Tree`, `Waterfall`, `Column`, `FallenColumn`) i escena tot junt. Funciona, però es podria partir en `temple/iso.ts`, `temple/palette.ts`, `temple/parts.tsx` per facilitar-ne l'edició.
- **SEO**: només `index.tsx` defineix `head()` complet. `habits.tsx` només té title; `profile.tsx` no en té cap. Afegir títols/descripcions únics a cadascuna.
- A `TempleScene` la condició `a10` (totes les pilars ≥10 per dibuixar acroteris) és molt rígida; potser val la pena fer-ho per columna individual com ja fas amb el capitell.

---

### Pla d'acció proposat (per ordre)

1. **Arreglar la hydration**: marcar `TempleHome` com a `client-only` (carrega diferida amb `dynamic`/`useEffect`-mounted guard) o renderitzar un esquelet estàtic al servidor i hidratar la part dependent de `Date`/`localStorage` només al client.
2. **Store compartit per a `practices` i `profile`**: introduir un `PracticesProvider` amb `useReducer` i exposar `usePractices()` que llegeix del context. Així `/habits` i `/profile` reflecteixen els canvis al moment.
3. **Eliminar codi mort**: `src/routes/temple.tsx`, `src/components/ProgressRing.tsx`, exports no utilitzats a `useHabits.ts`.
4. **Migrar `habits.tsx` a tokens** del design system (`bg-background`, `text-foreground`, `border-border`, accent via `--primary`).
5. **Reescriure `/profile`** amb estètica temple (paleta i tipografia coherent amb la home, no shadcn cards genèriques).
6. **SEO** a habits i profile.
7. **(Opcional)** Refactor de `TempleScene` en mòduls.

---

### Tècnic

```text
src/
├─ routes/
│  ├─ index.tsx       ← causa hydration mismatch (Date + localStorage)
│  ├─ habits.tsx      ← colors hardcoded; PracticeRow té estat duplicat
│  ├─ profile.tsx     ← estètica desentonada; sense head()
│  └─ temple.tsx      ← redirect inútil → eliminar
├─ components/
│  ├─ TempleScene.tsx ← gros però funcional (refactor opcional)
│  └─ ProgressRing.tsx ← no usat → eliminar
└─ hooks/
   └─ useHabits.ts    ← estat NO compartit entre instàncies (bug)
```

Vols que apliqui aquest pla sencer, o prefereixes començar per un punt concret (recomano #1 + #2, que són els bugs reals)?
