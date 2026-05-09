
# Olympía — Habit tracker PWA

App mòbil instal·lable per fer seguiment d'hàbits diaris. Estètica moderna d'app actual (no "vintage"), amb una direcció visual inspirada en el jaciment d'Olímpia banyat per la llum de l'**alba i el capvespre**: pedra càlida, ombres llargues, cels degradats taronja-rosa-malva, ruïnes silueta.

## Direcció visual

- **Modern app feel**: cards arrodonides (radius generós), spacing ampli, microinteraccions suaus, tab bar inferior fixa, haptics visuals, sense ornament recarregat.
- **Paleta capvespre/alba** (tokens en `oklch` a `src/styles.css`):
  - Fons: pedra càlida `#f5ede2` (light) / blau nit `#16131f` (dark, opcional v2).
  - Accent primari: taronja capvespre `#e87a3e`.
  - Accent secundari: rosa alba `#f4a4a4` → malva `#9b6b9e`.
  - Text: pedra fosca `#2a2520`.
  - Or subtil `#c89b4a` per ratxes/destacats.
- **Gradient signatura**: degradat capvespre (taronja → rosa → malva) usat al header, anells de progrés i CTA principals.
- **Tipografia**: *Fraunces* (display, modern serif amb caràcter, evoca pedra esculpida) + *Inter* (UI/cos).
- **Hero d'onboarding**: imatge generada de les columnes d'Olímpia al capvespre amb overlay degradat.
- **Iconografia**: Lucide lineal, fina i moderna. Sense iconos "antics" literals.

## Funcionalitats v1

1. **Onboarding (1 pantalla)** — hero d'Olímpia al capvespre, claim curt, CTA "Comença".
2. **Avui** (home) — saluda segons l'hora ("Bon capvespre"), llista d'hàbits del dia amb toggle de check, anell de progrés diari amb gradient capvespre.
3. **Crear/editar hàbit** — bottom sheet: nom, emoji o icona, color d'accent, freqüència (diària o dies de la setmana), recordatori (hora indicativa, sense push v1).
4. **Detall d'hàbit** — calendari mensual heatmap, ratxa actual i màxima, % constància 30 dies.
5. **Estadístiques** — resum setmanal, hàbit més fort, total de check-ins.
6. **Tab bar inferior**: Avui · Hàbits · Estadístiques · Perfil.
7. **PWA instal·lable** — `manifest.json` amb `display: "standalone"`, icones 192/512, theme color, splash. **Sense service worker** (evita problemes de cache a la preview de Lovable; instal·lable igualment).
8. **Persistència local** — `localStorage` via hook `useHabits`. Sense login.

## Estructura tècnica

- Rutes TanStack:
  - `/` — Avui
  - `/habits` — llistat i gestió
  - `/habits/$id` — detall
  - `/stats` — estadístiques
  - `/profile` — preferències (nom, reset dades)
- Layout mòbil-first amb `max-w-md mx-auto` i tab bar fixa inferior.
- Components clau: `HabitCard`, `ProgressRing`, `HeatmapCalendar`, `BottomTabBar`, `CreateHabitSheet`, `SunsetGradient`.
- Animacions: `framer-motion` per transicions de check, sheets i canvi de pantalla.
- Imatge hero: generada amb el tool d'imatges (columnes d'Olímpia, llum daurada de capvespre).

## Fora d'abast (v2)

- Mode fosc complet (alba vs nit estrellada).
- Sincronització multi-dispositiu (requeriria Lovable Cloud).
- Notificacions push reals.
- Compartir progrés.

Quan aprovis, ho munto i et passo els passos per instal·lar-la al mòbil ("Afegeix a la pantalla d'inici").
