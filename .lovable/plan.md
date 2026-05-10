## La Pràctica — Catàleg Tancat i Consagrat

Reescriptura completa de la pantalla `/habits` (renombrada conceptualment a "La Pràctica") com a **catàleg immutable de 25 pràctiques sembrades**, sense creació lliure. L'usuari només pot **Activar/Desactivar** i parametritzar (minuts/freqüència).

---

### 1. Model de dades (localStorage, sense backend)

Nou fitxer `src/data/practices.ts` — catàleg fix de 25 entrades, només lectura:

```ts
export type Pillar = "soma" | "nous" | "theoria" | "kosmos" | "sophrosyne";
export type Practice = {
  id: string;        // slug fix, p.ex. "soma-dromos"
  name: string;      // "Dromos"
  pillar: Pillar;
  description: string;
  patron: string;    // "Hermes"
};
```

Distribució (5 per pilar):
- **Soma** (Cos): Dromos/Hermes, Gymnasion/Hèracles, Hydor/Posidó, Trophé/Demèter, Hypnos/Hipnos
- **Nous** (Ment): Anagnosis/Atena, Graphē/Cal·líope, Mnēmē/Mnemòsine, Logismos/Apol·lo, Dialogos/Sòcrates
- **Theoria** (Contemplació): Hēsychia/Hèstia, Theōria/Urània, Euchē/Zeus, Skepsis/Heràclit, Anamnēsis/Plató
- **Kosmos** (Ordre): Taxis/Apol·lo, Oikos/Hera, Chronos/Cronos, Ergon/Hefest, Koinōnia/Hèstia
- **Sophrosyne** (Mesura): Nēsteia/Demèter, Sigē/Harpòcrates, Enkrateia/Sòfocles, Metron/Delfos, Apochē/Pitàgores

(Noms i patrons ja esbossats; el contingut definitiu es consolida al fitxer.)

### 2. Estat de l'usuari

Nova estructura paral·lela al catàleg, a `useHabits.ts`:

```ts
type PracticeState = {
  practiceId: string;
  isActive: boolean;
  targetMinutes: number;       // default 10
  frequency: "daily" | number[];
  completions: string[];       // YYYY-MM-DD
};
```

- `usePractices()`: retorna `{ catalog, states, toggleActive, setParams, complete }`.
- Persistència `olympia.practices.v1`.
- Migració: les `Habit` antigues queden ignorades (es preserva el localStorage però no es mostra). El home (`/`) i `/temple` passen a llegir `states` actius.

### 3. Pantalla `/habits` → "La Pràctica"

Reescriptura completa de `src/routes/habits.tsx`:

- Fons `#050410`, text `#F0EBE0`, font Inter (ja al projecte).
- Header sobri: petit kicker "ΚΑΤΑΛΟΓΟΣ", títol "La Pràctica", sense botó `+`.
- 5 seccions verticals, una per Pilar. Cada secció:
  - Títol pilar en versaletes amb la traducció minúscula al costat (p.ex. `SOMA · Cos`).
  - Línia divisòria 1px `#1a1830`.
  - Llista de 5 pràctiques. Cada fila:
    - Nom + patró petit a sota (`Hermes`).
    - Toggle switch minimalista a la dreta: actiu `#F0A05A`, inactiu `#6A5E4D`. Sense ombres, sense rebot.
  - En activar, s'expandeix sota la fila un panell **pla, sense vora**:
    - "Minuts": input numèric net (sense fletxes, alineat a la dreta).
    - "Freqüència": Diari / Dies (chips Dl–Dg minimalistes).
  - Sense botó "desa": canvis instantanis a `states`.

### 4. Lèxic i guardarails

- Substituir tot "Hàbit"/"Add task"/"Done" per **"Pràctica"**, **"Activa la pràctica"**, **"Consagra"**.
- Eliminar `CreateHabitSheet` de la navegació de `/habits` (es manté el fitxer per `/habits/$id` si convé, o es retira).
- Sense colors d'etiqueta, sense barres de progrés, sense swipe-to-delete, sense emojis a aquesta pantalla.

### 5. Ajustos col·laterals

- `BottomTabBar`: etiqueta "Hàbits" → "Pràctica".
- `/` (home): la llista de "avui" passa a iterar pràctiques actives `isDueToday`. Targetes simplificades (sense emoji ni color tag, només nom + toggle de completar).
- `/temple`: `totals[pillar]` ara compta completions de pràctiques actives per pilar; afegir cinquena columna `sophrosyne`.
- Eliminar selector de "Pilar" lliure de `CreateHabitSheet` (ja no s'usa per crear).

### 6. Detalls tècnics

- Tot client-side (localStorage). Sense Lovable Cloud.
- Tipografia: assegurar que `font-sans` resol a Inter a `styles.css` (ja és el cas).
- Els components UI shadcn no s'usen aquí — toggle i inputs custom per mantenir l'austeritat.

---

### Fitxers afectats

- **Nou**: `src/data/practices.ts`
- **Nou**: `src/components/PracticeRow.tsx` (fila + panell expandit)
- **Reescrit**: `src/routes/habits.tsx`
- **Editat**: `src/hooks/useHabits.ts` (afegir `usePractices`, mantenir l'antic per compatibilitat)
- **Editat**: `src/routes/index.tsx` (llegir pràctiques actives)
- **Editat**: `src/routes/temple.tsx` (5 columnes, comptar per pràctica)
- **Editat**: `src/components/BottomTabBar.tsx` (etiqueta)
- **Possiblement retirat**: `CreateHabitSheet` del flux de `/habits`

Vols que procedeixi així, o ajustes alguna cosa (noms del catàleg, distribució de patrons, mantenir compatibilitat amb hàbits antics al home)?