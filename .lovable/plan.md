# Fer visible el temple

## Diagnòstic

A `/temple` actualment l'escena isomètrica es renderitza, però:

1. El SVG ocupa només una franja central petita amb molt de buit a sobre i a sota.
2. Amb 0 progrés, només es veuen tambors escampats i una columna caiguda — la silueta del temple no és reconeixible. L'usuari obre la pantalla i no entén què està construint.
3. L'escena queda visualment desplaçada a la dreta perquè l'origen isomètric (`ORIGIN_X=200`) i la geometria de les 5 columnes (slots 0..4 × 1.6) no estan centrades respecte al `viewBox`.

## Canvis

### 1. `TempleScene.tsx` — temple fantasma + recentrat

- Calcular el centre real de la geometria (estilòbat) i recol·locar `ORIGIN_X`/`ORIGIN_Y` perquè el conjunt quedi centrat al `viewBox 0 0 400 320`. Ampliar el `viewBox` si cal (p. ex. `0 0 420 340`) per no retallar pediment ni acroteris.
- **Estat fantasma**: dibuixar SEMPRE la silueta completa del temple (5 columnes senceres + arquitrau + frontó) amb opacitat baixa (~0.08–0.12) i sense ombres laterals — només contorn pla en `--temple-stone-shadow`. Per sobre, dibuixar les peces "reals" sòlides segons `counts`. Així l'usuari veu d'entrada el monument que està reconstruint.
- Reduir la quantitat de tambors escampats inicials (de 5 a 3) i treure la columna caiguda horitzontal: distreuen i tapen la silueta.
- Mantenir l'animació `temple-piece-in` només per a peces reals, mai per al fantasma.

### 2. `routes/temple.tsx` — donar alçada a l'escena

- Treure el `flex-1` ambigu i fixar un contenidor amb `aspect-ratio: 420/340` i `width: 100%`, centrat horitzontalment amb un padding lateral mínim. Així el SVG omple l'amplada del mòbil i té alçada proporcional, sense buits.
- Reduir el padding superior del header (`pt-12` → `pt-8`) i el gap entre header i escena perquè el temple aparegui més amunt.
- La graella de pilars i el toggle Hestia es queden tal com estan, sota l'escena.

### 3. Sense canvis a

- Lògica de pràctiques, dades, hooks.
- Paleta `--temple-*` (ja funciona bé al render actual).
- Mapeig de progrés per pilar.

## Restriccions (es mantenen)

Sense confeti, sense glow neon, sense partícules, sense text "level up". El fantasma és un contorn estàtic, mat, gairebé imperceptible — només per orientar la mirada.

## Arxius afectats

- editar `src/components/TempleScene.tsx`
- editar `src/routes/temple.tsx`
