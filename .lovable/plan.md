## Reconstrucció: el jaciment d'Olímpia en estil Monument Valley

Substituïm la pantalla `/temple` (rectangles plans apilats) per una **escena isomètrica SVG** d'inspiració Monument Valley: paleta pastel mat, geometria neta, ombres planes, sense textura ni soroll. Punt de partida: **jaciment arqueològic** amb estilòbat trencat i tambors caiguts. Cada pilar (Soma, Nous, Theoria, Kosmos, Sophrosyne) controla **una de les cinc columnes** del temple.

### Estètica

- Projecció isomètrica pura (angles 30°). Tot dibuixat com a SVG vectorial — sense WebGL, sense imatges externes.
- Paleta Monument Valley: cel lavanda fosc desaturat, pedra blanc trencat càlid, ombra malva, accent àmbar (Hestia), terra sorra apagada. Mat absolut, sense brillantors.
- Animacions lentes i silencioses: aparició de cada peça amb fundit + petit desplaçament vertical (1.2s, easing suau). Mai bounce, mai partícules.

### Escena i mapeig de progrés

Cinc columnes dòriques alineades sobre l'estilòbat. Cada columna del temple = un pilar. Estats per columna en funció de `totals[pilar]`:

```
0 completions   → tambor base mig enterrat a la sorra (runa)
1               → 1 tambor col·locat
2               → 2 tambors
3               → 3 tambors (columna a mitja alçada)
4               → 4 tambors
5               → columna sencera + capitell dòric
```

Quan **les 5 columnes arriben a 5+**, apareix l'**arquitrau** (biga horitzontal) amb fundit. Amb 7+ a totes, apareix el **frontó triangular**. Amb 10+ a totes, **acroteris** als extrems. Hestia (toggle) encén una flama àmbar mat al centre del frontó quan és `TRUE`.

L'**estat 0 absolut** mostra: plataforma de pedra parcialment enrunada, tambors escampats al voltant de la base, una columna caiguda en horitzontal a primer terme. A mesura que progresses, la runa del terra es retira progressivament (els tambors escampats van desapareixent un a un a mesura que es "col·loquen" a les columnes).

### Layout de la pantalla

```
┌─────────────────────────┐
│ ANASTYLOSIS             │  header petit existent
│ El Temple               │
├─────────────────────────┤
│                         │
│      [escena            │  ~60% alçada, fons gradient lavanda
│       isomètrica        │  fosc → negre
│       SVG]              │
│                         │
├─────────────────────────┤
│ SOMA NOUS THE KOS SOP   │  llegenda 5 columnes amb count
│ 003  001  000 005 002   │
├─────────────────────────┤
│ ▬▬▬▬▬ Hestia      TRUE  │  barra àmbar existent
└─────────────────────────┘
```

### Detalls tècnics

- **Nou component**: `src/components/TempleScene.tsx` — rep `counts: Record<Pillar, number>` i `hestia: boolean`. Renderitza un únic `<svg viewBox="0 0 400 320">` amb capes z-ordenades de fons cap al davant: cel → muntanyes llunyanes (siluetes planes) → terra/sorra → estilòbat → tambors caiguts (condicional) → 5 columnes (cadascuna composta per `<DoricColumn drums={n} />`) → arquitrau → frontó → acroteris → flama Hestia.
- **Geometria isomètrica**: helpers `iso(x, y, z)` que projecten coordenades 3D a 2D amb la matriu isomètrica estàndard. Cada tambor és un cilindre baix dibuixat com 2 el·lipses + rectangle lateral amb tres tons de la paleta (top/light/shadow).
- **Animació**: cada peça nova entra amb classe CSS `temple-piece-in` (1.2s fade + translateY(-6px) → 0). Delay escalonat petit (40ms) entre tambors d'una mateixa columna quan se'n col·loquen múltiples a la vegada.
- **Paleta** (afegir tokens a `src/styles.css` dins `:root`):
  - `--temple-sky-1: oklch(0.18 0.04 290)` (lavanda fosc)
  - `--temple-sky-2: oklch(0.08 0.02 280)` (negre violaci)
  - `--temple-stone-light: oklch(0.92 0.02 80)`
  - `--temple-stone-mid: oklch(0.78 0.025 70)`
  - `--temple-stone-shadow: oklch(0.55 0.03 300)` (malva)
  - `--temple-sand: oklch(0.45 0.04 60)`
  - `--temple-amber: oklch(0.78 0.15 70)` (Hestia)
- **`src/routes/temple.tsx`**: substitueix el bloc actual de `<ColumnView>` × 5 i les `<style>` inline pel nou `<TempleScene counts={totals} hestia={profile.hestia} />`. Conserva header, llegenda inferior amb counts, i el toggle Hestia. Elimina la funció `ColumnView`.
- **Fons** del `MobileShell`: gradient vertical `--temple-sky-1` → `--temple-sky-2` substituint el `#050410` pla.

### Restriccions estrictes (mantenim el to del manifest)

- Prohibit: confeti, "level up", barres de progrés gamificades, números grans flotants, glows neon, partícules.
- Tipografia: cap canvi.
- Cap sound, cap haptic.
- L'escena és **estàtica** un cop renderitzada — només transicions d'aparició quan canvia el comptatge.

### Arxius afectats

- crear `src/components/TempleScene.tsx`
- editar `src/routes/temple.tsx`
- editar `src/styles.css` (afegir tokens `--temple-*` i keyframe `temple-piece-in`)

Cap canvi a la lògica de pràctiques, dades, ni a la resta de pantalles.