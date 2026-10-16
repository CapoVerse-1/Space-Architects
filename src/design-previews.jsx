import React, { useRef, useState } from "react";
import data from "./content.json";
import { Arrow, navItems } from "./shared.jsx";
import { ImageSwitcher } from "./image-switcher.jsx";

import { team } from "./team-data.js";
export const previewMotifs = [
  {
    src: "/assets/slider-2-ohne.jpg",
    alt: "Wohnraum zum Wohlfühlen",
    title: "Wohnraum zum Wohlfühlen.",
    text: "Wir erschaffen keine Quadratmeter – wir bieten Wohnraum zum Wohlfühlen.",
  },
  {
    src: "/assets/Slider-1.jpg",
    alt: "Planen mit der Vision eines Architekten",
    title: "Planen mit Vision.",
    text: "Planen mit der Vision eines Architekten – bis ins letzte Detail durchdacht.",
  },
  {
    src: "/assets/Slider-3-neu.jpg",
    alt: "Raum erleben",
    title: "Raum erleben.",
    text: "Für ein besseres Raumerlebnis, richten wir auf Wunsch Musterwohnungen ein.",
  },
];
const partnerNames = [
  "FSM Rechtsanwälte",
  "JP Immobilien",
  "AP Hausverwaltung",
  "Wiethoma",
  "Kosari Architekten",
  "Jägersberger",
  "Ing. Jenewein",
];
function Label({ children }) {
  return <p className="pv-label">{children}</p>;
}
function Action({
  children = "Kontakt aufnehmen",
  href = "/kontakt/",
  primary = false,
}) {
  return (
    <a
      className={primary ? "pv-action pv-primary" : "pv-action"}
      href={href}
      target="_blank"
      rel="noreferrer"
    >
      {children}
      <Arrow />
    </a>
  );
}
function TeamPreview({ variant }) {
  return (
    <section className={"pv-team pv-team-" + variant}>
      <Label>Planung trifft Persönlichkeit</Label>
      <h2>Unser Team.</h2>
      <div className="pv-people">
        {team.map(([name, role, email, image], i) => (
          <article key={email}>
            {variant === "directory" && (
              <span className="pv-person-index">0{i + 1}</span>
            )}
            <img src={"/assets/" + image} alt={name} width="600" height="600" />
            <div className="pv-person-info">
              <h3>{name}</h3>
              <p>{role}</p>
              <a href={"mailto:" + email}>
                {email}
                <Arrow />
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
function ProjectsPreview({ variant }) {
  const projects =
    variant === "contact-sheet"
      ? data.projects.slice(0, 3)
      : data.projects.slice(0, 2);
  return (
    <section className={"pv-projects pv-projects-" + variant}>
      <Label>Unsere Immobilien</Label>
      <h2>Aktuelle Projekte.</h2>
      <div className="pv-project-list">
        {projects.map((p, i) => {
          const [location, ...street] = p.title.split(",");
          return (
            <a
              href={p.path}
              target="_blank"
              rel="noreferrer"
              key={p.path}
              className="pv-project"
            >
              <div className="pv-project-photo">
                <img src={p.image} alt={p.title} width="1000" height="750" />
                <span className="pv-project-arrow">
                  <Arrow />
                </span>
              </div>
              <div className="pv-project-copy">
                <p>
                  {location}{" "}
                  <span>· {p.facts.find((f) => f[0] === "Auftrag")?.[1]}</span>
                </p>
                <h3>{street.join(",").trim()}</h3>
                <small>0{i + 1}</small>
              </div>
            </a>
          );
        })}
      </div>
    </section>
  );
}
function MotifControls({ index, setIndex }) {
  return (
    <div
      className="pv-motif-controls"
      role="group"
      aria-label="Vorschaumotiv wählen"
    >
      {previewMotifs.map((m, i) => (
        <button
          key={m.src}
          aria-label={"Vorschaumotiv " + (i + 1)}
          aria-pressed={index === i}
          onClick={() => setIndex(i)}
        >
          0{i + 1}
        </button>
      ))}
      <button
        aria-label="Nächstes Vorschaumotiv"
        onClick={() => setIndex((v) => (v + 1) % 3)}
      >
        <Arrow />
      </button>
    </div>
  );
}
function HeroPreview({ variant }) {
  const [index, setIndex] = useState(0);
  const m = previewMotifs[index];
  return (
    <section className={"pv-hero pv-hero-" + variant}>
      <div className="pv-hero-copy">
        <Label>SA-Immobilien Gruppe · Wien</Label>
        <h2 key={m.title}>{m.title}</h2>
        <p>{m.text}</p>
        <Action href="/projekte/" primary>
          Projekte entdecken
        </Action>
      </div>
      <figure>
        <ImageSwitcher src={m.src} alt={m.alt} />
        <figcaption>
          <span>{m.alt}</span>
          <MotifControls index={index} setIndex={setIndex} />
        </figcaption>
      </figure>
    </section>
  );
}
function ServicesPreview({ variant }) {
  return (
    <section className={"pv-services pv-services-" + variant}>
      <Label>Unsere Leistungen</Label>
      <h2>Alles aus einer Hand.</h2>
      <div className="pv-service-list">
        {data.services.map((s) =>
          variant === "accordion" ? (
            <details key={s.number}>
              <summary>
                <span>{s.number}</span>
                <h3>{s.title}</h3>
                <span className="pv-plus" aria-hidden="true">
                  +
                </span>
              </summary>
              <p>{s.text}</p>
            </details>
          ) : (
            <article key={s.number}>
              <span className="pv-service-index">{s.number}</span>
              <img src={s.icon} alt="" width="60" height="50" />
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </article>
          ),
        )}
      </div>
    </section>
  );
}
function PartnersPreview({ variant }) {
  return (
    <section className={"pv-partners pv-partners-" + variant}>
      <Label>Ein starkes Netzwerk</Label>
      <h2>SA-Kooperation.</h2>
      <div className="pv-partner-list">
        {data.partners.map((p, i) => (
          <a
            key={p.name}
            href={p.url}
            target="_blank"
            rel="noreferrer"
            aria-label={partnerNames[i] + " – Website öffnen"}
          >
            <img src={p.image} alt={partnerNames[i]} width="500" height="300" />
            {(variant === "directory" || p.credit) && (
              <span>{p.credit ? "Makler · " + p.credit : partnerNames[i]}</span>
            )}
            <Arrow />
          </a>
        ))}
      </div>
    </section>
  );
}
function ContactPreview({ variant }) {
  return (
    <section className={"pv-contact pv-contact-" + variant}>
      <div>
        <Label>Im Gespräch beginnt Ihr Projekt</Label>
        <h2>
          {variant === "type" ? "Sprechen wir darüber." : "Sie haben Fragen?"}
        </h2>
        {variant !== "line" && (
          <p>Wir beraten Sie gerne zu Ihrem nächsten Projekt.</p>
        )}
      </div>
      {variant === "type" ? (
        <a className="pv-contact-email" href="mailto:info@sa-i.at">
          info@sa-i.at
          <Arrow />
        </a>
      ) : (
        <div className="pv-contact-actions">
          <Action primary />
          {variant !== "line" && (
            <a href="tel:+4319579646">
              +43 (0)1 957 96 46 <span>↗</span>
            </a>
          )}
        </div>
      )}
      {variant === "split" && (
        <p className="pv-contact-address">
          Weihburggasse 22 / Top 5<br />
          1010 Wien
        </p>
      )}
    </section>
  );
}
function NavigationPreview({ variant }) {
  const [active, setActive] = useState("Über uns");
  const [open, setOpen] = useState(false);
  const toggle = useRef(null);
  return (
    <section
      className={"pv-navigation pv-navigation-" + variant}
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          setOpen(false);
          toggle.current?.focus();
        }
      }}
    >
      <div className="pv-navigation-bar">
        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          aria-label="SA-Immobilien Home"
        >
          <img
            src="/assets/SA-Immobilien-Gruppe-Logo-2022.png"
            width="1500"
            height="672"
            alt="SA-I Immobilien Gruppe"
          />
        </a>
        <button
          className="pv-menu"
          ref={toggle}
          aria-expanded={open}
          aria-label={open ? "Vorschaumenü schließen" : "Vorschaumenü öffnen"}
          onClick={() => setOpen(!open)}
        >
          {open ? "Schließen ×" : "Menü ≡"}
        </button>
        <nav
          className={open ? "pv-nav-open" : ""}
          aria-label="Navigationsvorschau"
        >
          {navItems.map(([t], i) => (
            <button
              key={t}
              onClick={() => {
                setActive(t);
                setOpen(false);
                toggle.current?.focus();
              }}
              aria-current={active === t ? "page" : undefined}
            >
              {variant === "editorial" && <small>0{i + 1}</small>}
              {t}
              {t === "Kontakt" && <Arrow />}
            </button>
          ))}
        </nav>
      </div>
      <div className="pv-navigation-page">
        <Label>SA-Immobilien</Label>
        <h2>
          {active === "Über uns"
            ? "Das SA-I Team."
            : active === "Home"
              ? "Wohnraum zum Wohlfühlen."
              : active + "."}
        </h2>
        <p>Aktueller Bereich: {active}</p>
      </div>
    </section>
  );
}
function MotionPreview({ variant }) {
  const [index, setIndex] = useState(0);
  const m = previewMotifs[index];
  return (
    <section className="pv-motion">
      <ImageSwitcher src={m.src} alt={m.alt} transition={variant} />
      <div className="pv-motion-bar">
        <div>
          <Label>Bildwechsel</Label>
          <p>{m.alt}</p>
        </div>
        <MotifControls index={index} setIndex={setIndex} />
      </div>
      <button
        className="pv-replay"
        onClick={() => setIndex((v) => (v + 1) % 3)}
      >
        Übergang abspielen
        <Arrow />
      </button>
    </section>
  );
}
export function DesignPreview({ component, variant }) {
  if (variant === "current")
    return (
      <iframe
        className="pv-current-frame"
        src={"/design-preview/" + component + "/"}
        title={"Aktueller Stand: " + component}
      />
    );
  const previews = {
    team: TeamPreview,
    projects: ProjectsPreview,
    hero: HeroPreview,
    services: ServicesPreview,
    partners: PartnersPreview,
    contact: ContactPreview,
    navigation: NavigationPreview,
    motion: MotionPreview,
  };
  const Preview = previews[component];
  return Preview ? <Preview variant={variant} /> : null;
}
