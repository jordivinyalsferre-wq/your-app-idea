export type Pillar = "soma" | "nous" | "theoria" | "kosmos" | "sophrosyne";

export const PILLAR_META: Record<Pillar, { label: string; meaning: string; greek: string }> = {
  soma: { label: "Soma", meaning: "Cos", greek: "ΣΩΜΑ" },
  nous: { label: "Nous", meaning: "Ment", greek: "ΝΟΥΣ" },
  theoria: { label: "Theoria", meaning: "Contemplació", greek: "ΘΕΩΡΙΑ" },
  kosmos: { label: "Kosmos", meaning: "Ordre", greek: "ΚΟΣΜΟΣ" },
  sophrosyne: { label: "Sophrosyne", meaning: "Mesura", greek: "ΣΩΦΡΟΣΥΝΗ" },
};

export const PILLAR_ORDER: Pillar[] = ["soma", "nous", "theoria", "kosmos", "sophrosyne"];

export type Practice = {
  id: string;
  name: string;
  pillar: Pillar;
  description: string;
  patron: string;
};

export const PRACTICES: Practice[] = [
  // SOMA — Cos
  { id: "soma-dromos", name: "Dromos", pillar: "soma", patron: "Hermes", description: "La cursa: moure el cos amb cadència." },
  { id: "soma-gymnasion", name: "Gymnasion", pillar: "soma", patron: "Hèracles", description: "Esforç físic deliberat sobre el cos nu." },
  { id: "soma-hydor", name: "Hydor", pillar: "soma", patron: "Posidó", description: "Hidratació conscient com a llibació." },
  { id: "soma-trophe", name: "Trophē", pillar: "soma", patron: "Demèter", description: "Aliment mesurat: només el que sosté." },
  { id: "soma-hypnos", name: "Hypnos", pillar: "soma", patron: "Hipnos", description: "Recolliment al son a l'hora deguda." },

  // NOUS — Ment
  { id: "nous-anagnosis", name: "Anagnosis", pillar: "nous", patron: "Atena", description: "Lectura atenta d'una obra digna." },
  { id: "nous-graphe", name: "Graphē", pillar: "nous", patron: "Cal·líope", description: "Escriure de pròpia mà el que es pensa." },
  { id: "nous-mneme", name: "Mnēmē", pillar: "nous", patron: "Mnemòsine", description: "Memoritzar un fragment, sostenir-lo." },
  { id: "nous-logismos", name: "Logismos", pillar: "nous", patron: "Apol·lo", description: "Càlcul i raonament sense ajut extern." },
  { id: "nous-dialogos", name: "Dialogos", pillar: "nous", patron: "Sòcrates", description: "Conversa amb un altre per esmolar el judici." },

  // THEORIA — Contemplació
  { id: "theoria-hesychia", name: "Hēsychia", pillar: "theoria", patron: "Hèstia", description: "Quietud silenciosa, sense estímul." },
  { id: "theoria-theoria", name: "Theōria", pillar: "theoria", patron: "Urània", description: "Mirar el cel; recordar l'escala." },
  { id: "theoria-euche", name: "Euchē", pillar: "theoria", patron: "Zeus", description: "Pregària o invocació matinal." },
  { id: "theoria-skepsis", name: "Skepsis", pillar: "theoria", patron: "Heràclit", description: "Examen del dia: què s'ha mogut." },
  { id: "theoria-anamnesis", name: "Anamnēsis", pillar: "theoria", patron: "Plató", description: "Recordar el que ja se sabia." },

  // KOSMOS — Ordre
  { id: "kosmos-taxis", name: "Taxis", pillar: "kosmos", patron: "Apol·lo", description: "Posar cada cosa al seu lloc." },
  { id: "kosmos-oikos", name: "Oikos", pillar: "kosmos", patron: "Hera", description: "Cura de la casa com a temple." },
  { id: "kosmos-chronos", name: "Chronos", pillar: "kosmos", patron: "Cronos", description: "Honorar les hores; complir el ritme." },
  { id: "kosmos-ergon", name: "Ergon", pillar: "kosmos", patron: "Hefest", description: "Treball noble executat amb mans." },
  { id: "kosmos-koinonia", name: "Koinōnia", pillar: "kosmos", patron: "Hèstia", description: "Vincle amb els propers, foc compartit." },

  // SOPHROSYNE — Mesura
  { id: "soph-nesteia", name: "Nēsteia", pillar: "sophrosyne", patron: "Demèter", description: "Dejuni o privació voluntària." },
  { id: "soph-sige", name: "Sigē", pillar: "sophrosyne", patron: "Harpòcrates", description: "Silenci sostingut: no parlar en va." },
  { id: "soph-enkrateia", name: "Enkrateia", pillar: "sophrosyne", patron: "Sòfocles", description: "Domini sobre un impuls concret." },
  { id: "soph-metron", name: "Metron", pillar: "sophrosyne", patron: "Delfos", description: "Res en excés. Mesurar el suficient." },
  { id: "soph-apoche", name: "Apochē", pillar: "sophrosyne", patron: "Pitàgores", description: "Abstinència d'allò superflu." },
];
