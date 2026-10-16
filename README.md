# Space Architects · SA-Immobilien

React-Website mit warmem Off-White, Originalfotografie, 15 Projektseiten, Unternehmen und Team, Leistungen, Kontakt und Rechtsinformationen. Responsive für Mobile und Desktop. Das Design-Lab bietet acht Komponenten mit jeweils vier Varianten, Kommentaren und JSON-Export/-Import.

## Auf Vercel hosten

1. In Vercel **Add New → Project** wählen und `CapoVerse-1/Space-Architects` importieren.
2. **Root Directory:** `./` und **Framework Preset:** `Vite` verwenden.
3. **Deploy** klicken. Es sind keine Umgebungsvariablen erforderlich.

`vercel.json` legt Installation, Build und das Ausgabeverzeichnis `dist` fest. Die Installation verwendet pnpm 11.25.0 mit unverändertem Lockfile; `package.json` legt Node.js 24 fest. Die SPA-Rewrite-Regel ermöglicht direkte Aufrufe und Reloads von Unterseiten wie `/ueber-uns/`, `/portfolio/1070-wien-zollergasse/` und `/design-lab/`.

Die Konfiguration folgt der [Vercel-Dokumentation für Vite](https://vercel.com/docs/frameworks/frontend/vite). Nach dem Verbinden baut Vercel neue Commits auf `main` automatisch.

## Lokal entwickeln

Voraussetzung: Node.js 24.x und pnpm 11.25.0.

```sh
pnpm install --frozen-lockfile
pnpm dev
```

Die Website läuft unter `http://127.0.0.1:5181/`, die Komponenten-Auswahl unter `http://127.0.0.1:5181/design-lab/`.

```sh
pnpm test
pnpm build
pnpm preview
```

Der Build prüft lokale Bild- und Schriftreferenzen samt Groß-/Kleinschreibung, bevor Vite das Verzeichnis `dist` erzeugt.

## Funktionen und Inhalte

- Projektübersicht mit Kategorien, Suche und allen 15 Projekten; Projektgalerien mit Tastatur- und Touch-Bedienung.
- Kontaktformular mit Validierung und E-Mail-Entwurf. Der Versand erfolgt im E-Mail-Programm; ein Mailserver oder Formular-Backend ist nicht eingerichtet.
- Interaktive OpenStreetMap-Karte mit online geladenen Kartenausschnitten.
- Cookie-Auswahl und Design-Lab-Antworten werden im jeweiligen Browser gespeichert. Es sind keine Analyse- oder Werbetracker eingebunden.
- Bilder und Schriften liegen im Repository. Quellen und Bearbeitungen sind in [ASSETS.md](ASSETS.md) dokumentiert.

Der aktuelle Stand trägt in `index.html` weiterhin `noindex, nofollow`, da er als Design- und Freigabestand dient. Für eine spätere Suchmaschinen-Freigabe kann diese Meta-Angabe entfernt werden.

`src/main.jsx` enthält die Seiten, `src/shared.jsx` gemeinsame Funktionen, `src/content.json` die Projektinhalte und `src/legal.json` die Rechtsinformationen. Lokale Arbeitsnotizen, Vergleichsdateien, Zugangsdaten, Abhängigkeiten und Build-Ergebnisse sind vom Repository ausgeschlossen.
