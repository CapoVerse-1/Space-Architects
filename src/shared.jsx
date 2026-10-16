import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { ImageSwitcher } from "./image-switcher.jsx";

export const legalPath = "/neu/impressum-und-datenschutzerklaerung/";
export const navItems = [
  ["Home", "/"],
  ["Über uns", "/ueber-uns/"],
  ["Leistungen", "/leistungen/"],
  ["Projekte", "/projekte/"],
  ["Kontakt", "/kontakt/"],
];
export function Arrow({ direction = "right", ...props }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
      aria-hidden="true"
      style={direction === "left" ? { transform: "rotate(180deg)" } : undefined}
      {...props}
    >
      <path d="M4 12h15M13 5l7 7-7 7" />
    </svg>
  );
}
export function useRoute() {
  const [path, setPath] = useState(() =>
    location.pathname.endsWith("/")
      ? location.pathname
      : location.pathname + "/",
  );
  useEffect(() => {
    const update = () =>
      setPath(
        location.pathname.endsWith("/")
          ? location.pathname
          : location.pathname + "/",
      );
    addEventListener("popstate", update);
    return () => removeEventListener("popstate", update);
  }, []);
  return path;
}
export function Lightbox({ photos, index, onChange, onClose }) {
  const dialog = useRef(null);
  const previous = useRef(null);
  const touch = useRef(null);
  useEffect(() => {
    previous.current = document.activeElement;
    dialog.current.showModal();
    const before = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = before;
      previous.current?.focus({ preventScroll: true });
    };
  }, []);
  function keys(e) {
    if (!["ArrowRight", "ArrowLeft", "Home", "End"].includes(e.key)) return;
    e.preventDefault();
    if (e.key === "ArrowRight") onChange((index + 1) % photos.length);
    if (e.key === "ArrowLeft")
      onChange((index - 1 + photos.length) % photos.length);
    if (e.key === "Home") onChange(0);
    if (e.key === "End") onChange(photos.length - 1);
  }
  return (
    <dialog
      className="lightbox"
      ref={dialog}
      aria-label="Projekt-Bildergalerie"
      onKeyDown={keys}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        if (e.target === dialog.current) onClose();
      }}
    >
      <div className="lightbox-top">
        <span role="status" aria-live="polite" aria-atomic="true">
          {index + 1} / {photos.length}
        </span>
        <button
          autoFocus
          type="button"
          aria-label="Galerie schließen"
          onClick={onClose}
        >
          Schließen <span aria-hidden="true">×</span>
        </button>
      </div>
      <div
        className="lightbox-stage"
        onPointerDown={(e) => {
          if (e.button !== 0 || e.target.closest("button")) return;
          touch.current = { x: e.clientX, y: e.clientY };
          e.currentTarget.setPointerCapture(e.pointerId);
        }}
        onPointerCancel={() => {
          touch.current = null;
        }}
        onPointerUp={(e) => {
          const end = { clientX: e.clientX, clientY: e.clientY },
            start = touch.current;
          touch.current = null;
          if (!start || !end) return;
          const dx = end.clientX - start.x,
            dy = end.clientY - start.y;
          if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5)
            onChange(
              (index + (dx < 0 ? 1 : photos.length - 1)) % photos.length,
            );
        }}
      >
        <button
          type="button"
          aria-label="Voriges Bild"
          onClick={() => onChange((index - 1 + photos.length) % photos.length)}
        >
          <Arrow direction="left" />
        </button>
        <ImageSwitcher
          className="lightbox-photo"
          src={photos[index].src}
          alt={photos[index].alt || `Projektansicht ${index + 1}`}
          fit="contain"
        />
        <button
          type="button"
          aria-label="Nächstes Bild"
          onClick={() => onChange((index + 1) % photos.length)}
        >
          <Arrow />
        </button>
      </div>
    </dialog>
  );
}
export function ContactForm({ modern = false }) {
  const [status, setStatus] = useState("");
  const [ready, setReady] = useState(false);
  const [values, setValues] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });
  const [accepted, setAccepted] = useState(false);
  const field = (name) => ({
    value: values[name],
    onChange: (event) => {
      const value = event.target.value;
      setValues((previous) => ({ ...previous, [name]: value }));
      setReady(false);
      setStatus("");
    },
  });
  function submit(e) {
    e.preventDefault();
    setReady(true);
    setStatus(
      "E-Mail-Entwurf vorbereitet. Zum Versenden bitte in Ihrem E-Mail-Programm bestätigen.",
    );
  }
  function mail(e) {
    const f = e.currentTarget.closest("form");
    const v = new FormData(f);
    location.href =
      "mailto:info@sa-i.at?subject=" +
      encodeURIComponent("Kontaktanfrage · " + v.get("name")) +
      "&body=" +
      encodeURIComponent(
        `${v.get("message")}\n\n${v.get("name")}\n${v.get("email")}\n${v.get("phone")}`,
      );
  }
  return (
    <form
      className={"contact-form " + (modern ? "contact-form-modern" : "")}
      onSubmit={submit}
    >
      <div className="form-two">
        <label>
          Vor- und Nachname
          <input
            required
            name="name"
            autoComplete="name"
            maxLength={150}
            {...field("name")}
          />
        </label>
        <label>
          Ihre Telefonnummer
          <input
            name="phone"
            type="tel"
            autoComplete="tel"
            maxLength={80}
            {...field("phone")}
          />
        </label>
      </div>
      <label>
        Ihre E-Mail
        <input
          required
          name="email"
          type="email"
          autoComplete="email"
          maxLength={254}
          {...field("email")}
        />
      </label>
      <label>
        Ihre Nachricht
        <textarea
          required
          name="message"
          rows={4}
          maxLength={10000}
          {...field("message")}
        />
      </label>
      <label className="consent">
        <input
          required
          type="checkbox"
          name="consent"
          checked={accepted}
          onChange={(event) => {
            setAccepted(event.target.checked);
            setReady(false);
            setStatus("");
          }}
        />
        <span>
          Ich habe die <a href={legalPath}>Datenschutzerklärung</a> zur Kenntnis
          genommen. Ich stimme zu, dass meine Angaben zur Kontaktaufnahme und
          für Rückfragen dauerhaft gespeichert werden.
        </span>
      </label>
      <p className="form-hint">
        Versand über Ihr E-Mail-Programm.
      </p>
      <button
        className={modern ? "primary-button" : "source-submit"}
        type="submit"
      >
        {modern ? "Nachricht vorbereiten" : "Senden"}
        <Arrow />
      </button>
      {ready && (
        <button className="mail-draft" type="button" onClick={mail}>
          E-Mail-Entwurf öffnen <Arrow />
        </button>
      )}
      <p className="form-status" role="status">
        {status}
      </p>
    </form>
  );
}
export function ContactMap({ modern = false }) {
  const node = useRef(null);
  useEffect(() => {
    let map;
    const initialize = () => {
      if (map || !node.current) return;
      map = L.map(node.current, { scrollWheelZoom: false }).setView(
        [48.20575, 16.374901],
        16,
      );
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);
      L.marker([48.20575, 16.374901], {
        icon: L.divIcon({
          className: "map-marker",
          html: "<span>SA-I</span>",
          iconSize: [48, 48],
          iconAnchor: [24, 48],
        }),
      })
        .addTo(map)
        .bindPopup("Weihburggasse 22 / Top 5, 1010 Wien")
        .openPopup();
    };
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        initialize();
        observer.disconnect();
      }
    });
    observer.observe(node.current);
    return () => {
      observer.disconnect();
      map?.remove();
    };
  }, [modern]);
  return (
    <div
      className="contact-map"
      ref={node}
      role="region"
      aria-label="Karte: Weihburggasse 22, 1010 Wien"
    />
  );
}
export function Cookies({ modern = false }) {
  const [value, setValue] = useState(() =>
    localStorage.getItem("sai-cookie-choice"),
  );
  const [options, setOptions] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  function choose(v) {
    localStorage.setItem("sai-cookie-choice", v);
    setValue(v);
    setOptions(false);
  }
  return (
    <>
      {!value ? (
        <aside
          className={"cookie-banner " + (modern ? "cookie-modern" : "")}
          aria-label="Cookie-Einstellungen"
        >
          <strong>Wir schätzen Ihre Privatsphäre</strong>
          <p>
            Wir verwenden Cookies, um Ihr Surferlebnis zu verbessern,
            personalisierte Anzeigen oder Inhalte einzusetzen und unseren
            Datenverkehr zu analysieren. Wenn Sie auf „Alle akzeptieren“
            klicken, stimmen Sie der Anwendung von Cookies zu.
          </p>
          {options && (
            <div className="cookie-options">
              <p>
                Es werden keine Analyse- oder Werbedienste
                geladen.
              </p>
              <label>
                <input type="checkbox" checked disabled /> Notwendig
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={analytics}
                  onChange={(e) => setAnalytics(e.target.checked)}
                />{" "}
                Optionale Cookies
              </label>
            </div>
          )}
          <div className="cookie-actions">
            <button
              onClick={() =>
                options
                  ? choose(analytics ? "custom-optional" : "necessary")
                  : setOptions(true)
              }
            >
              {options ? "Auswahl speichern" : "Anpassen"}
            </button>
            <button onClick={() => choose("necessary")}>Alles ablehnen</button>
            <button onClick={() => choose("all")}>Alle akzeptieren</button>
          </div>
        </aside>
      ) : (
        <button
          className="cookie-reopen"
          onClick={() => setValue(null)}
          aria-label="Cookie-Einstellungen öffnen"
        >
          {modern ? "Cookies" : "C"}
        </button>
      )}
    </>
  );
}
