## Temple en runes 3D com a indicador de progrés

Substituïm l'anell de progrés de la home per una escena 3D d'un temple grec en runes que es va reconstruint a mesura que es completen els hàbits del dia.

### Concepte visual

- Un petit temple dòric estilitzat (estil Olympia) amb 6 columnes i un frontó.
- A 0% completat: només bases de columnes i pedres escampades pel terra.
- Cada hàbit completat reconstrueix una "peça": tambors de columna pugen, capitells s'assenten, i finalment l'arquitrau i el frontó apareixen.
- Al 100%: temple complet, il·luminat amb la llum daurada del capvespre, lleugera partícula/glow.
- Càmera amb òrbita lenta automàtica (molt subtil) i lleuger paral·laxi al moviment del dit.
- Cel de fons amb el degradat sunset → mauve ja existent al sistema de disseny.

### Tecnologia

- `three` + `@react-three/fiber` + `@react-three/drei` (per `OrbitControls` deshabilitat, `Environment`, `Float`, `Html`).
- Geometria construïda per codi (cilindres per columnes, box per estilòbat i arquitrau, prisma triangular pel frontó). Sense models externs — manté el bundle lleuger i el carregat instantani.
- Animacions amb `framer-motion-3d` o interpolació manual amb `useFrame` (lerp de posició/opacitat) perquè la transició entre hàbits sigui suau (~600ms).
- Materials `MeshStandardMaterial` amb color pedra càlida + emissive subtil sunset al 100%.

### Component nou

`src/components/TempleProgress.tsx`
- Props: `value: number` (0–1), `done: number`, `total: number`.
- Mapeja `value` a un nombre de "peces" reconstruïdes (6 columnes + arquitrau + frontó = 8 etapes, repartides proporcionalment).
- Dimensions: ~280px d'alçada, ample 100% del card.

### Canvis a la home (`src/routes/index.tsx`)

- Substituïm el bloc `ProgressRing + textos` dins del card d'avui per `<TempleProgress />` ocupant tot el card.
- A sota del canvas, en una franja, es mantenen els números: `doneCount/total · {pct}%` i el missatge motivacional.
- El card creix una mica d'alçada per acomodar l'escena.

### Rendiment / mòbil

- `dpr={[1, 2]}`, `frameloop="demand"` quan no hi ha animació activa, `gl={{ antialias: true, alpha: true }}`.
- Una sola `directionalLight` (sol de capvespre) + `ambientLight` baix.
- Sense ombres dinàmiques (massa cost a mòbil); ombra falsa amb un disc fosc sota el temple.

### Fora d'abast

- Models GLB realistes, textures de pedra fotogràfiques.
- Interacció amb gestos per rotar manualment.
- Reconstrucció animada per cada toggle individual amb partícules de pols (es pot afegir a v2 si agrada el resultat base).

Quan aprovis, instal·lo `three` + react-three i munto el component.
