import React, { useEffect, useRef, useState } from "react";
import { Arrow } from "./shared.jsx";
import {
  catalog,
  emptyReview,
  makeExport,
  reviewKey,
  validateReview,
} from "./design-catalog.js";
import { DesignPreview } from "./design-previews.jsx";
import "./design-lab.css";

function restore() {
  try {
    const text = localStorage.getItem(reviewKey);
    if (!text) return { review: emptyReview(), overallNote: "", error: "" };
    const value = JSON.parse(text);
    return {
      review: validateReview(value),
      overallNote:
        typeof value.overallNote === "string"
          ? value.overallNote.slice(0, 5000)
          : "",
      error: "",
    };
  } catch {
    return {
      review: emptyReview(),
      overallNote: "",
      error:
        "Die gespeicherte Auswahl konnte nicht geladen werden. Du kannst eine exportierte JSON importieren.",
    };
  }
}
export default function DesignLab() {
  const [initial] = useState(restore);
  const [review, setReview] = useState(initial.review);
  const [overallNote, setOverallNote] = useState(initial.overallNote);
  const [active, setActive] = useState(catalog[0].id);
  const [viewed, setViewed] = useState(
    initial.review[catalog[0].id]?.variant || catalog[0].variants[0][0],
  );
  const [size, setSize] = useState("desktop");
  const [storageError, setStorageError] = useState(initial.error);
  const [status, setStatus] = useState("");
  const [exported, setExported] = useState("");
  const [summary, setSummary] = useState(false);
  const file = useRef(null);
  const tabs = useRef([]);
  const skipInitialSave = useRef(Boolean(initial.error));
  const component = catalog.find((c) => c.id === active);
  const variant = component.variants.find((v) => v[0] === viewed);
  const chosen = review[active]?.variant;
  const chosenTitle =
    chosen === "current"
      ? "Aktuellen Stand behalten"
      : component.variants.find((v) => v[0] === chosen)?.[1];
  const answered = catalog.filter((c) => review[c.id]?.variant).length;
  useEffect(() => {
    if (skipInitialSave.current) {
      skipInitialSave.current = false;
      return;
    }
    try {
      localStorage.setItem(
        reviewKey,
        JSON.stringify(makeExport(review, overallNote)),
      );
      setStorageError("");
    } catch {
      setStorageError(
        "Automatisches Speichern ist hier nicht verfügbar. Bitte exportiere deine Auswahl vor dem Schließen.",
      );
    }
  }, [review, overallNote]);
  function chooseComponent(id) {
    const next = catalog.find((c) => c.id === id);
    setActive(id);
    setViewed(review[id]?.variant || next.variants[0][0]);
    setSummary(false);
    setStatus("");
  }
  function select(id) {
    setReview((old) => ({ ...old, [active]: { ...old[active], variant: id } }));
    setStatus(
      id === null
        ? "Auswahl zurückgenommen."
        : "Ausgewählt: " +
            (id === "current"
              ? "Aktuellen Stand behalten"
              : component.variants.find((v) => v[0] === id)[1]),
    );
  }
  function tabKey(e, i) {
    const key = e.key;
    if (!["ArrowRight", "ArrowLeft", "Home", "End"].includes(key)) return;
    e.preventDefault();
    const index =
      key === "Home"
        ? 0
        : key === "End"
          ? 3
          : (i + (key === "ArrowRight" ? 1 : 3)) % 4;
    setViewed(component.variants[index][0]);
    tabs.current[index]?.focus();
  }
  function download() {
    const text = JSON.stringify(makeExport(review, overallNote), null, 2);
    setExported(text);
    const url = URL.createObjectURL(
      new Blob([text], { type: "application/json" }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download =
      "sa-i-design-auswahl-" + new Date().toISOString().slice(0, 10) + ".json";
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setStatus(
      "JSON-Download gestartet. " +
        answered +
        " von " +
        catalog.length +
        " Entscheidungen enthalten.",
    );
  }
  async function importFile(e) {
    const selected = e.target.files?.[0];
    if (!selected) return;
    try {
      if (selected.size > 200000)
        throw new Error(
          "Die Datei ist zu groß. Bitte einen SA-I JSON-Export wählen.",
        );
      const value = JSON.parse(await selected.text());
      const restored = validateReview(value);
      if (
        typeof value.overallNote !== "string" ||
        value.overallNote.length > 5000
      )
        throw new Error("Ungültiger allgemeiner Kommentar.");
      setReview(restored);
      setOverallNote(value.overallNote);
      setViewed(restored[active].variant || component.variants[0][0]);
      setExported("");
      setStatus("Auswahl und Kommentare importiert.");
    } catch (error) {
      setStatus("Import nicht möglich: " + error.message);
    }
    e.target.value = "";
  }
  return (
    <div className="design-lab">
      <header className="lab-header">
        <a href="/" className="lab-brand" aria-label="Zur SA-I Website">
          <img
            src="/assets/SA-Immobilien-Gruppe-Logo-2022.png"
            width="1500"
            height="672"
            alt="SA-I Immobilien Gruppe"
          />
        </a>
        <span className="lab-header-label">
          Design-Library <span>01</span>
        </span>
        <a href="/ueber-uns/" className="lab-return">
          Zur Website
          <Arrow />
        </a>
      </header>
      <div className="lab-intro">
        <div>
          <p className="eyebrow">Weniger, aber präziser.</p>
          <h1>Das Detail entscheidet.</h1>
          <p>
            Acht Bereiche. Je vier Entwürfe. Schau sie dir in Ruhe an, wähle
            deine Favoriten und ergänze, was dir wichtig ist.
          </p>
        </div>
        <div className="lab-progress">
          <strong>
            {answered}
            <span> / {catalog.length}</span>
          </strong>
          <span>Bereiche entschieden</span>
          <div
            role="progressbar"
            aria-label="Auswahlfortschritt"
            aria-valuenow={answered}
            aria-valuemin={0}
            aria-valuemax={catalog.length}
          >
            <i style={{ width: (answered / catalog.length) * 100 + "%" }} />
          </div>
        </div>
      </div>
      <div className="lab-workspace">
        <aside className="lab-sidebar">
          <nav aria-label="Komponentenbereiche">
            {catalog.map((c, i) => (
              <button
                key={c.id}
                onClick={() => chooseComponent(c.id)}
                aria-current={!summary && active === c.id ? "true" : undefined}
              >
                <span className="lab-nav-index">0{i + 1}</span>
                <span>{c.title}</span>
                <span
                  className={
                    review[c.id]?.variant ? "lab-mark is-decided" : "lab-mark"
                  }
                  aria-label={
                    review[c.id]?.variant ? "Ausgewählt" : "Noch offen"
                  }
                >
                  {review[c.id]?.variant ? "✓" : "·"}
                </span>
              </button>
            ))}
          </nav>
          <button
            className={
              summary ? "lab-summary-link is-active" : "lab-summary-link"
            }
            onClick={() => setSummary(true)}
          >
            Deine Auswahl
            <Arrow />
          </button>
          <p>
            Vorschauen ändern deine Website noch nicht. Deine Auswahl und
            Kommentare werden in diesem Browser gespeichert.
          </p>
        </aside>
        <main className="lab-main" id="main">
          {summary ? (
            <section className="lab-summary">
              <p className="eyebrow">Deine Richtung</p>
              <h2>Alles auf einen Blick.</h2>
              <p>
                {answered} von {catalog.length} Bereichen entschieden. Offene
                Punkte können auch im Export bleiben.
              </p>
              <div className="lab-review-list">
                {catalog.map((c, i) => (
                  <button key={c.id} onClick={() => chooseComponent(c.id)}>
                    <span>0{i + 1}</span>
                    <div>
                      <strong>{c.title}</strong>
                      <p>
                        {review[c.id].variant === "current"
                          ? "Aktuellen Stand behalten"
                          : c.variants.find(
                              (v) => v[0] === review[c.id].variant,
                            )?.[1] || "Noch offen"}
                      </p>
                      {review[c.id].note && <small>{review[c.id].note}</small>}
                    </div>
                    <Arrow />
                  </button>
                ))}
              </div>
              <label className="lab-comment">
                Was soll sich durch die ganze Website ziehen?
                <textarea
                  value={overallNote}
                  maxLength={5000}
                  rows={4}
                  placeholder="Zum Beispiel: Variante B beim Team, aber mit den Abständen von A …"
                  onChange={(e) => setOverallNote(e.target.value)}
                />
              </label>
            </section>
          ) : (
            <section className="lab-component">
              <div className="lab-component-heading">
                <p className="eyebrow">
                  0{catalog.indexOf(component) + 1} / 0{catalog.length} ·{" "}
                  {component.title}
                </p>
                <h2>{component.question}</h2>
                <p>{component.description}</p>
              </div>
              <div className="lab-preview-toolbar">
                <div
                  className="lab-variant-tabs"
                  role="tablist"
                  aria-label={"Varianten für " + component.title}
                >
                  {component.variants.map((v, i) => (
                    <button
                      ref={(node) => {
                        tabs.current[i] = node;
                      }}
                      key={v[0]}
                      role="tab"
                      aria-label={
                        "ABCD"[i] +
                        ": " +
                        v[1] +
                        (chosen === v[0] ? " – ausgewählt" : "")
                      }
                      id={"variant-" + active + "-" + v[0]}
                      aria-controls="variant-preview"
                      aria-selected={viewed === v[0]}
                      tabIndex={
                        viewed === v[0] || (viewed === "current" && i === 0)
                          ? 0
                          : -1
                      }
                      onKeyDown={(e) => tabKey(e, i)}
                      onClick={() => setViewed(v[0])}
                    >
                      <span>{"ABCD"[i]}</span>
                      <span>{v[1]}</span>
                      {chosen === v[0] && <i aria-label="Ausgewählt">✓</i>}
                    </button>
                  ))}
                </div>
                <div
                  className="lab-size-switch"
                  role="group"
                  aria-label="Vorschaubreite"
                >
                  {["desktop", "mobile"].map((s) => (
                    <button
                      key={s}
                      aria-pressed={size === s}
                      onClick={() => setSize(s)}
                    >
                      {s === "desktop" ? "Desktop" : "Mobile"}
                    </button>
                  ))}
                </div>
              </div>
              <div className="lab-preview-meta">
                <span>
                  <strong>
                    {viewed === "current"
                      ? "Aktueller Stand der Website"
                      : "ABCD"[
                          component.variants.findIndex((v) => v[0] === viewed)
                        ] +
                        " · " +
                        variant[1]}
                  </strong>
                  {viewed !== "current" && <span>{variant[2]}</span>}
                </span>
                <button
                  aria-pressed={viewed === "current"}
                  onClick={() =>
                    setViewed(
                      viewed === "current"
                        ? component.variants[0][0]
                        : "current",
                    )
                  }
                >
                  {viewed === "current"
                    ? "Zu den Entwürfen"
                    : "Aktuellen Stand vergleichen"}
                </button>
              </div>
              <div className={"lab-preview-surface lab-size-" + size}>
                <div className="lab-preview-width">
                  <div
                    className="lab-preview-frame"
                    id="variant-preview"
                    role={viewed === "current" ? "region" : "tabpanel"}
                    aria-label={
                      viewed === "current" ? "Aktueller Stand" : undefined
                    }
                    aria-labelledby={
                      viewed === "current"
                        ? undefined
                        : "variant-" + active + "-" + viewed
                    }
                    tabIndex={0}
                  >
                    <DesignPreview
                      key={active + ":" + viewed}
                      component={active}
                      variant={viewed}
                    />
                  </div>
                </div>
              </div>
              <div className="lab-choice-bar">
                <div>
                  <small>Deine Auswahl</small>
                  <strong>
                    {chosenTitle || "Noch keine – Vorschau ist keine Auswahl."}
                  </strong>
                  {chosen && (
                    <button className="lab-undo" onClick={() => select(null)}>
                      Auswahl zurücknehmen
                    </button>
                  )}
                </div>
                <div>
                  <button
                    className="lab-keep"
                    onClick={() => select("current")}
                    disabled={chosen === "current"}
                  >
                    Aktuellen Stand behalten
                  </button>
                  <button
                    className="lab-primary"
                    disabled={chosen === viewed}
                    onClick={() => select(viewed)}
                  >
                    {chosen === viewed
                      ? "Ausgewählt ✓"
                      : viewed === "current"
                        ? "Diesen Stand behalten"
                        : "Variante " +
                          "ABCD"[
                            component.variants.findIndex((v) => v[0] === viewed)
                          ] +
                          " auswählen"}
                    <Arrow />
                  </button>
                </div>
              </div>
              <label className="lab-comment">
                Dein Kommentar zu {component.title}
                <textarea
                  rows={3}
                  value={review[active]?.note || ""}
                  maxLength={5000}
                  onChange={(e) => {
                    const note = e.target.value;
                    setReview((old) => ({
                      ...old,
                      [active]: { ...old[active], note },
                    }));
                  }}
                  placeholder="Was gefällt dir? Was würdest du kombinieren oder ändern?"
                />
              </label>
              <div className="lab-step-nav">
                <button
                  disabled={catalog.indexOf(component) === 0}
                  onClick={() =>
                    chooseComponent(catalog[catalog.indexOf(component) - 1].id)
                  }
                >
                  <Arrow direction="left" />
                  Voriger Bereich
                </button>
                <button
                  onClick={() =>
                    catalog.indexOf(component) === catalog.length - 1
                      ? setSummary(true)
                      : chooseComponent(
                          catalog[catalog.indexOf(component) + 1].id,
                        )
                  }
                >
                  {catalog.indexOf(component) === catalog.length - 1
                    ? "Zur Übersicht"
                    : "Nächster Bereich"}
                  <Arrow />
                </button>
              </div>
            </section>
          )}
          <section className="lab-export">
            <div>
              <h2>Deine Entscheidungen mitnehmen.</h2>
              <p>
                JSON exportieren und hier im Chat zurückgeben. Alle Kommentare
                und offenen Punkte sind enthalten.
              </p>
            </div>
            <div className="lab-export-actions">
              <button onClick={() => file.current?.click()}>
                JSON importieren
              </button>
              <input
                ref={file}
                type="file"
                accept=".json,application/json"
                hidden
                onChange={importFile}
                aria-label="Design-Auswahl importieren"
              />
              <button className="lab-primary" onClick={download}>
                Auswahl als JSON exportieren
                <Arrow />
              </button>
            </div>
            {exported && (
              <details className="lab-json" open>
                <summary>Exportierte JSON ansehen</summary>
                <textarea
                  aria-label="Exportierte Design-Auswahl als JSON"
                  readOnly
                  value={exported}
                  rows={12}
                  spellCheck="false"
                />
              </details>
            )}
          </section>
          {storageError && (
            <p className="lab-warning" role="alert">
              {storageError}
            </p>
          )}
          <p className="lab-status" role="status">
            {status}
          </p>
        </main>
      </div>
      <footer className="lab-footer">
        <span>SA-I · Design Review</span>
        <span>Bestehende Fotos. Echte Inhalte. Deine Entscheidung.</span>
      </footer>
    </div>
  );
}
