export const reviewKey = "sai-design-review-v1";
export const catalog = [
  {
    id: "team",
    title: "Unser Team",
    question: "Wie schlicht dürfen die Porträts werden?",
    description:
      "Dieselben zwei Personen und unveränderte quadratische Fotos. Unterschiedlich sind nur Aufbau, Weißraum und Typografie.",
    variants: [
      [
        "open",
        "Offene Porträts",
        "Bild, Name, Rolle und Kontakt ohne Kartenrahmen.",
      ],
      [
        "business",
        "Visitenkarten",
        "Kleineres Porträt neben den persönlichen Angaben.",
      ],
      [
        "directory",
        "Personenliste",
        "Kompakte Zeilen mit großzügigen Namen und kleinen Porträts.",
      ],
      [
        "diptych",
        "Diptychon",
        "Zwei zusammenhängende Porträts mit einer gemeinsamen Informationsleiste.",
      ],
    ],
  },
  {
    id: "projects",
    title: "Projektkarten",
    question: "Wie viel Bühne bekommt das einzelne Projekt?",
    description:
      "Zollergasse und Grundsteingasse mit echten Bildern, Fakten und klickbaren Projektlinks.",
    variants: [
      [
        "caption",
        "Bild & Zeile",
        "Ruhige Bildpaare, reduzierte Beschriftung direkt darunter.",
      ],
      [
        "cover",
        "Große Titel",
        "Projekttitel im Bild mit verlässlichem dunklem Verlauf.",
      ],
      [
        "rows",
        "Projektverzeichnis",
        "Horizontale Zeilen mit Bild, Adresse und klarer Pfeilaktion.",
      ],
      [
        "contact-sheet",
        "Kontaktbogen",
        "Dichteres Bildraster mit kleinen Nummern und feiner Typografie.",
      ],
    ],
  },
  {
    id: "hero",
    title: "Startseiten-Einstieg",
    question: "Welcher Einstieg fühlt sich nach SA-I an?",
    description:
      "Vier Kompositionen derselben Inhalte. Mit den Motivtasten lassen sich alle drei echten Startseitenbilder wechseln.",
    variants: [
      [
        "split",
        "Text & Bild",
        "Klassische Teilung, klarer Einstieg links, Architektur rechts.",
      ],
      [
        "panorama",
        "Panorama",
        "Breites Bild zuerst, Überschrift und Aktion darunter.",
      ],
      [
        "center",
        "Zentrierter Auftakt",
        "Kurzer typografischer Auftakt über der Bildfläche.",
      ],
      [
        "editorial",
        "Editorial",
        "Bild links, schlanke Textspalte rechts und kleine Motivzeile.",
      ],
    ],
  },
  {
    id: "services",
    title: "Leistungen",
    question: "Welche Dichte macht das Angebot am klarsten?",
    description:
      "Alle sechs Leistungen bleiben vollständig erreichbar. Akkordeons lassen sich unabhängig öffnen und schließen.",
    variants: [
      [
        "rows",
        "Sechs Zeilen",
        "Nummer, Titel und Erklärung auf einer ruhigen Linie.",
      ],
      [
        "grid",
        "Offenes Raster",
        "Zwei Spalten mit feinen Trennlinien und Originalsymbolen.",
      ],
      [
        "accordion",
        "Aufklappbar",
        "Nur die Titel auf den ersten Blick, Erläuterungen auf Klick.",
      ],
      [
        "columns",
        "Drei Spalten",
        "Kompakte redaktionelle Spalten, ohne einzelne Kartenflächen.",
      ],
    ],
  },
  {
    id: "partners",
    title: "Kooperationen",
    question: "Wie präsent soll das Partnernetzwerk sein?",
    description:
      "Alle sieben Partner bleiben erhalten, einschließlich des offiziellen JP-Logos und seiner Quellenangabe.",
    variants: [
      [
        "open",
        "Offene Logowand",
        "Logos auf der Grundfläche mit viel optischer Ruhe.",
      ],
      [
        "ruled",
        "Feines Raster",
        "Helle Flächen und feine Regeln für eine klare Ordnung.",
      ],
      [
        "directory",
        "Partnerverzeichnis",
        "Logo und Firmenname in kompakten, anklickbaren Zeilen.",
      ],
      [
        "strip",
        "Zwei Bänder",
        "Ein durchlaufendes weißes Band, das sich auf Mobile sinnvoll umbricht.",
      ],
    ],
  },
  {
    id: "contact",
    title: "Kontakt-Abschluss",
    question: "Welcher Abschluss macht den nächsten Schritt klar?",
    description:
      "Echte Kontaktwege, wenig Text. Telefon- und E-Mail-Links behalten ihre normale Funktion.",
    variants: [
      [
        "line",
        "Eine klare Zeile",
        "Große Frage links, Kontaktaktion rechts, nur eine Trennlinie.",
      ],
      [
        "white",
        "Weiße Fläche",
        "Ein zurückhaltendes weißes Feld mit zwei direkten Kontaktwegen.",
      ],
      [
        "type",
        "Typografisch",
        "Die E-Mail-Adresse ist die zentrale, sofort nutzbare Aktion.",
      ],
      [
        "split",
        "Zwei Wege",
        "Projektanfrage und persönliches Gespräch als gleichwertige Wege.",
      ],
    ],
  },
  {
    id: "navigation",
    title: "Navigation",
    question: "Wie zurückhaltend soll die Orientierung aussehen?",
    description:
      "Alle Hauptziele bleiben direkt erreichbar. Das mobile Menü lässt sich wirklich öffnen und per Escape schließen.",
    variants: [
      [
        "line",
        "Unterstrichen",
        "Klassische Zeile mit feinem Strich am aktuellen Ziel.",
      ],
      [
        "inset",
        "Helle Auswahl",
        "Ein fast weißes Feld kennzeichnet das aktuelle Ziel.",
      ],
      [
        "editorial",
        "Redaktionell",
        "Kleine Seitenzahlen und schlanke, klare Trennlinien.",
      ],
      [
        "minimal",
        "Minimale Zeile",
        "Nur Schrift, großzügige Abstände und ein dezenter Punkt.",
      ],
    ],
  },
  {
    id: "motion",
    title: "Bildübergänge",
    question: "Wie viel Bewegung fühlt sich richtig an?",
    description:
      "Manuell ausgelöste Übergänge mit denselben echten Bildern. Betriebssystem-Einstellung für reduzierte Bewegung wird immer respektiert.",
    variants: [
      [
        "cut",
        "Direkt",
        "Sofortiger Wechsel, nachdem das nächste Bild geladen ist.",
      ],
      ["fade", "Sanfte Blende", "Kurze Überblendung ohne räumliche Bewegung."],
      [
        "slide",
        "Kurzes Gleiten",
        "Eine kleine horizontale Bewegung führt zum nächsten Motiv.",
      ],
      [
        "soft",
        "Ruhige Annäherung",
        "Sehr dezentes Einblenden mit einer leichten Annäherung.",
      ],
    ],
  },
];

export function emptyReview() {
  return Object.fromEntries(
    catalog.map((c) => [c.id, { variant: null, note: "" }]),
  );
}
export function validateReview(value) {
  if (
    !value ||
    value.schemaVersion !== 1 ||
    value.project !== "sa-i-modernized" ||
    !Array.isArray(value.decisions)
  )
    throw new Error("Diese Datei ist kein SA-I Design-Export der Version 1.");
  const next = emptyReview();
  const seen = new Set();
  for (const item of value.decisions) {
    const component = catalog.find((c) => c.id === item.componentId);
    if (!component || seen.has(item.componentId))
      throw new Error("Unbekannte oder doppelte Komponente im Export.");
    seen.add(item.componentId);
    if (
      item.variantId !== null &&
      item.variantId !== "current" &&
      !component.variants.some((v) => v[0] === item.variantId)
    )
      throw new Error("Unbekannte Variante für " + component.title + ".");
    if (typeof item.note !== "string" || item.note.length > 5000)
      throw new Error("Ungültiger oder zu langer Kommentar.");
    next[component.id] = { variant: item.variantId, note: item.note };
  }
  return next;
}
export function makeExport(
  review,
  overallNote = "",
  exportedAt = new Date().toISOString(),
) {
  return {
    schemaVersion: 1,
    project: "sa-i-modernized",
    catalogVersion: "2026-10-15.1",
    exportedAt,
    source: "/design-lab/",
    overallNote,
    decisions: catalog.map((c) => ({
      componentId: c.id,
      componentTitle: c.title,
      variantId: review[c.id]?.variant ?? null,
      variantTitle:
        review[c.id]?.variant === "current"
          ? "Aktuellen Stand behalten"
          : (c.variants.find((v) => v[0] === review[c.id]?.variant)?.[1] ??
            null),
      note: review[c.id]?.note ?? "",
    })),
    unresolved: catalog.filter((c) => !review[c.id]?.variant).map((c) => c.id),
  };
}
