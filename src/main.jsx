import React, {
  createElement,
  lazy,
  Suspense,
  useEffect,
  useRef,
  useState,
} from "react";
import { createRoot } from "react-dom/client";
import data from "./content.json";
import legal from "./legal.json";
import {
  Arrow,
  ContactForm,
  ContactMap,
  Cookies,
  Lightbox,
  useRoute,
  navItems,
  legalPath,
} from "./shared.jsx";
import { ImageSwitcher } from "./image-switcher.jsx";
import { team as people } from "./team-data.js";
const DesignLab = lazy(() => import("./design-lab.jsx"));
import "./fonts.css";
import "./modern.css";

const address = "Weihburggasse 22 / Top 5, 1010 Wien";
function Brand({ large = false }) {
  return (
    <a
      className={"brand " + (large ? "brand-large" : "")}
      href="/"
      aria-label="SA-Immobilien · Home"
    >
      <img
        src="/assets/SA-Immobilien-Gruppe-Logo-2022.png"
        alt="SA-I Immobilien Gruppe"
        width="1500"
        height="672"
      />
    </a>
  );
}
function Header({ path }) {
  const [open, setOpen] = useState(false);
  const toggle = useRef(null);
  const navigation = useRef(null);
  useEffect(() => {
    if (!open) return;
    const media = matchMedia("(max-width: 720px)");
    if (!media.matches) {
      setOpen(false);
      return;
    }
    const before = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const behind = [...document.querySelectorAll("main, .site-footer")].filter(
      (node) => !node.contains(navigation.current),
    );
    const inertBefore = behind.map((node) => node.inert);
    behind.forEach((node) => {
      node.inert = true;
    });
    const frame = requestAnimationFrame(() =>
      navigation.current?.querySelector("a")?.focus(),
    );
    const key = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setOpen(false);
        toggle.current?.focus();
      }
      if (e.key === "Tab") {
        const controls = [
          ...navigation.current.querySelectorAll("a"),
          toggle.current,
        ];
        const first = controls[0],
          last = controls.at(-1);
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    const resize = () => {
      if (!media.matches) setOpen(false);
    };
    addEventListener("keydown", key);
    media.addEventListener("change", resize);
    return () => {
      cancelAnimationFrame(frame);
      document.body.style.overflow = before;
      behind.forEach((node, i) => {
        node.inert = inertBefore[i];
      });
      removeEventListener("keydown", key);
      media.removeEventListener("change", resize);
    };
  }, [open]);
  return (
    <header className={"site-header" + (open ? " menu-is-open" : "")}>
      {open && (
        <button
          className="menu-backdrop"
          type="button"
          tabIndex={-1}
          aria-hidden="true"
          aria-label="Menü schließen"
          onClick={() => {
            setOpen(false);
            toggle.current?.focus();
          }}
        />
      )}
      <div className="shell header-inner">
        <Brand />
        <nav
          ref={navigation}
          aria-label="Hauptnavigation"
          className={"desktop-nav " + (open ? "nav-open" : "")}
          id="main-navigation"
        >
          {navItems.map(([title, href]) => (
            <a
              key={href}
              href={href}
              aria-current={
                path === href ||
                (href === "/projekte/" && path.startsWith("/portfolio/"))
                  ? "page"
                  : undefined
              }
              className={href === "/kontakt/" ? "nav-contact" : ""}
            >
              {title}
              {href === "/kontakt/" && <Arrow />}
            </a>
          ))}
        </nav>
        <button
          className="menu-toggle"
          ref={toggle}
          aria-expanded={open}
          aria-controls="main-navigation"
          aria-label={open ? "Menü schließen" : "Menü öffnen"}
          onClick={() => setOpen(!open)}
        >
          <span>{open ? "Schließen" : "Menü"}</span>
          <span
            className={open ? "menu-lines is-open" : "menu-lines"}
            aria-hidden="true"
          >
            <i />
            <i />
          </span>
        </button>
      </div>
    </header>
  );
}
function LinkButton({ href, children, quiet = false }) {
  return (
    <a href={href} className={quiet ? "text-link" : "primary-button"}>
      {children}
      <Arrow />
    </a>
  );
}
function Label({ children }) {
  return <p className="eyebrow">{children}</p>;
}
const motifs = [
  {
    image: "slider-2-ohne.jpg",
    title: (
      <>
        Wohnraum zum
        <br />
        <em>Wohlfühlen.</em>
      </>
    ),
    description:
      "Wir erschaffen keine Quadratmeter – wir bieten Wohnraum zum Wohlfühlen.",
    caption: "Wohnraum zum Wohlfühlen",
  },
  {
    image: "Slider-1.jpg",
    title: (
      <>
        Planen mit
        <br />
        <em>Vision.</em>
      </>
    ),
    description:
      "Planen mit der Vision eines Architekten – bis ins letzte Detail durchdacht.",
    caption: "Planen mit der Vision eines Architekten",
  },
  {
    image: "Slider-3-neu.jpg",
    title: (
      <>
        Raum
        <br />
        <em>erleben.</em>
      </>
    ),
    description:
      "Für ein besseres Raumerlebnis, richten wir auf Wunsch Musterwohnungen ein.",
    caption: "Raum erleben",
  },
];
function HomeHero() {
  const [slide, setSlide] = useState(0);
  const m = motifs[slide];
  return (
    <section className="home-hero shell">
      <div className="hero-copy">
        <Label>SA-Immobilien Gruppe · Wien</Label>
        <h1>{m.title}</h1>
        <p className="hero-description">{m.description}</p>
        <LinkButton href="/projekte/">Projekte entdecken</LinkButton>
        <p className="hero-signature">Planung. Architektur. Immobilien.</p>
      </div>
      <figure className="hero-image">
        <ImageSwitcher src={"/assets/" + m.image} alt={m.caption} priority />
        <figcaption>
          <span>{m.caption}</span>
          <div className="motif-controls" aria-label="Bildmotiv wählen">
            {motifs.map((x, i) => (
              <button
                key={x.image}
                aria-label={`Motiv ${i + 1}: ${x.caption}`}
                aria-pressed={i === slide}
                onClick={() => setSlide(i)}
              >
                {String(i + 1).padStart(2, "0")}
              </button>
            ))}
            <button
              aria-label="Nächstes Motiv"
              onClick={() => setSlide((value) => (value + 1) % motifs.length)}
            >
              <Arrow />
            </button>
          </div>
        </figcaption>
      </figure>
    </section>
  );
}
function splitTitle(p) {
  const [location, ...rest] = p.title.split(",");
  return { location, street: rest.join(",").trim() };
}
function ProjectCard({ project: p, number }) {
  const { location, street } = splitTitle(p);
  return (
    <a className="project-card" href={p.path}>
      <div className="project-card-image">
        <img
          src={p.image}
          alt={p.title}
          loading="lazy"
          width="1000"
          height="750"
        />
        <span className="project-open" aria-hidden="true">
          <Arrow />
        </span>
      </div>
      <div className="project-card-info">
        <div>
          <p className="project-location">
            {location}
            <span> / </span>
            {p.facts.find((x) => x[0] === "Auftrag")?.[1]}
          </p>
          <h3>{street}</h3>
        </div>
        <span className="project-index" aria-hidden="true">
          {String(number + 1).padStart(2, "0")}
        </span>
      </div>
    </a>
  );
}
function SectionHeading({ label, title, children }) {
  return (
    <div className="section-heading">
      <div>
        <Label>{label}</Label>
        <h2>{title}</h2>
      </div>
      {children}
    </div>
  );
}
function CurrentProjects() {
  return (
    <section className="section shell">
      <SectionHeading label="Unsere Immobilien" title="Aktuelle Projekte.">
        <LinkButton href="/projekte/" quiet>
          Alle Projekte ansehen
        </LinkButton>
      </SectionHeading>
      <div className="project-grid">
        {data.projects.slice(0, 2).map((p, i) => (
          <ProjectCard key={p.path} project={p} number={i} />
        ))}
      </div>
    </section>
  );
}
function ServiceList({ page = false }) {
  return (
    <div className="service-list">
      {data.services.map((s, i) => (
        <article className="service-item" key={s.title}>
          <span className="service-number">{s.number}</span>
          <img src={s.icon} alt="" width="60" height="50" />
          <div>
            <h3>{s.title}</h3>
            <p>
              {page && i === 0
                ? s.text.replace("Unsere Planer", "Unsere Architekten")
                : s.text}
            </p>
          </div>
        </article>
      ))}
    </div>
  );
}
function HomeServices() {
  return (
    <section className="service-section section shell">
      <div className="service-intro">
        <Label>Unsere Leistungen</Label>
        <h2>
          Alles aus
          <br />
          <em>einer Hand.</em>
        </h2>
        <p>Von der Planung über Bau und Innenausstattung bis zum Verkauf.</p>
        <LinkButton href="/leistungen/" quiet>
          Leistungen im Detail
        </LinkButton>
      </div>
      <ServiceList />
    </section>
  );
}
function CompanyIntro() {
  return (
    <section className="company-section section shell">
      <figure>
        <img
          src="/assets/Startseite-Team-2.jpg"
          alt="Das SA-I Team bei der gemeinsamen Planung im Wiener Büro"
          width="650"
          height="442"
          loading="lazy"
        />
        <figcaption>SA-I Office · Wien</figcaption>
      </figure>
      <div>
        <Label>Space Architects</Label>
        <h2>
          Jedes Detail
          <br />
          hat eine Aufgabe.
        </h2>
        {data.homeText.slice(0, 3).map((p) => (
          <p key={p}>{p}</p>
        ))}
        <LinkButton href="/ueber-uns/" quiet>
          Unser Team kennenlernen
        </LinkButton>
      </div>
    </section>
  );
}
function Partners() {
  return (
    <section id="kooperation" className="partners-section section shell">
      <SectionHeading label="Ein starkes Netzwerk" title="SA-Kooperation." />
      <div className="partner-grid partners-count-7">
        {data.partners.map((p) => (
          <a
            key={p.name}
            className={p.credit ? "partner-jpi" : undefined}
            href={p.url}
            target="_blank"
            rel="noreferrer"
            aria-label={`${p.name} – Website öffnen`}
          >
            <img
              src={p.image}
              alt={p.name}
              loading="lazy"
              width="500"
              height="300"
            />
            {p.credit && (
              <small className="partner-credit">
                {p.role} · {p.credit}
              </small>
            )}
          </a>
        ))}
      </div>
    </section>
  );
}
function ContactCTA() {
  return (
    <section className="contact-cta shell">
      <div>
        <Label>Im Gespräch beginnt Ihr Projekt</Label>
        <h2>Sie haben Fragen?</h2>
        <p>{data.homeText[3]}</p>
      </div>
      <LinkButton href="/kontakt/">Kontakt aufnehmen</LinkButton>
    </section>
  );
}
function Footer() {
  return (
    <footer className="site-footer">
      <div className="shell footer-main">
        <div className="footer-brand">
          <Brand large />
          <span>Wohnraum zum Wohlfühlen.</span>
        </div>
        <div>
          <Label>Kontakt</Label>
          <a className="footer-email" href="mailto:info@sa-i.at">
            info@sa-i.at
          </a>
          <a href="tel:+4319579646">+43 (0)1 957 96 46</a>
        </div>
        <div>
          <Label>Besuchen Sie uns</Label>
          <p>
            Weihburggasse 22 / Top 5<br />
            1010 Wien
          </p>
          <a className="text-link" href="/kontakt/#standort">
            Standort ansehen
            <Arrow />
          </a>
        </div>
        <nav aria-label="Navigation im Footer">
          {navItems
            .filter((x) => x[1] !== "/")
            .map(([t, h]) => (
              <a key={h} href={h}>
                {t}
              </a>
            ))}
        </nav>
      </div>
      <div className="shell footer-bottom">
        <span>© 2022 SA-Immobilien Gruppe</span>
        <a href={legalPath}>Impressum und Datenschutzerklärung</a>
        <a href="/design-lab/">Design-Library</a>
        <button
          onClick={() =>
            window.scrollTo({
              top: 0,
              behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
                ? "instant"
                : "smooth",
            })
          }
          aria-label="Nach oben"
        >
          Nach oben ↑
        </button>
      </div>
    </footer>
  );
}
function Home() {
  return (
    <>
      <HomeHero />
      <CurrentProjects />
      <HomeServices />
      <CompanyIntro />
      <Partners />
      <ContactCTA />
    </>
  );
}
function Projects() {
  const [filter, setFilter] = useState("Alle");
  const [query, setQuery] = useState("");
  const results = data.projects.filter(
    (p) =>
      (filter === "Alle" || p.category === filter) &&
      `${p.title} ${p.description.join(" ")} ${p.facts.flat().join(" ")}`
        .toLocaleLowerCase("de")
        .includes(query.toLocaleLowerCase("de").trim()),
  );
  return (
    <div className="shell projects-page">
      <div className="page-heading">
        <Label>SA-Immobilien · Portfolio</Label>
        <h1>Unsere Projekte.</h1>
        <p>Aktuelle Projekte und ausgewählte Referenzen in Wien.</p>
      </div>
      <div className="project-toolbar">
        <div
          className="project-filters"
          role="group"
          aria-label="Projekte filtern"
        >
          {["Alle", "Aktuelle Projekte", "Referenzen"].map((f) => (
            <button
              key={f}
              aria-pressed={filter === f}
              onClick={() => setFilter(f)}
            >
              {f}
              <span>
                {f === "Alle" ? 15 : f === "Aktuelle Projekte" ? 2 : 13}
              </span>
            </button>
          ))}
        </div>
        <label className="project-search">
          <svg
            aria-hidden="true"
            width="19"
            height="19"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <circle cx="10.5" cy="10.5" r="6.5" />
            <path d="m16 16 5 5" />
          </svg>
          <input
            type="search"
            placeholder="Bezirk oder Straße suchen"
            aria-label="Projekte nach Bezirk oder Straße suchen"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
      </div>
      <p className="result-count" role="status">
        {results.length} {results.length === 1 ? "Projekt" : "Projekte"}
        {query && <> für „{query}“</>}
      </p>
      {results.length ? (
        <div className="project-grid portfolio-grid">
          {results.map((p) => (
            <ProjectCard
              key={p.path}
              project={p}
              number={data.projects.indexOf(p)}
            />
          ))}
        </div>
      ) : (
        <div className="no-results">
          <h2>Kein Projekt gefunden.</h2>
          <p>Versuchen Sie einen anderen Bezirk oder eine andere Straße.</p>
          <button
            className="primary-button"
            onClick={() => {
              setQuery("");
              setFilter("Alle");
            }}
          >
            Suche zurücksetzen
            <Arrow />
          </button>
        </div>
      )}
      <ContactCTA />
    </div>
  );
}
function ProjectDetail({ project: p, onGallery }) {
  const idx = data.projects.indexOf(p);
  const { location, street } = splitTitle(p);
  return (
    <article className="project-detail shell">
      <div className="breadcrumbs">
        <a href="/projekte/">
          <Arrow direction="left" />
          Alle Projekte
        </a>
        <span>{p.category}</span>
      </div>
      <div className="project-detail-heading">
        <div>
          <Label>{location}</Label>
          <h1>{street}.</h1>
        </div>
        <a href="#bilder" className="text-link">
          {p.photos.length} Bilder ansehen <span>↓</span>
        </a>
      </div>
      <button
        className="project-cover"
        aria-label={`Bildergalerie ${p.title} öffnen`}
        onClick={() => onGallery(p.photos, 0)}
      >
        <img
          src={p.banner}
          alt={p.title}
          width="1600"
          height="900"
          fetchPriority="high"
        />
        <span>
          Galerie öffnen <Arrow />
        </span>
      </button>
      <div className="project-overview">
        <div className="project-description">
          <Label>Das Projekt</Label>
          {p.description.map((t) => (
            <p key={t}>{t}</p>
          ))}
        </div>
        <dl className="project-facts">
          {p.facts.map(([label, value]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
        {p.marketing && (
          <aside className="project-marketing">
            <Label>Maklerkontakt</Label>
            <a href="https://jpi.at/" target="_blank" rel="noreferrer">
              <img
                src="/assets/jp-immobilien-official.svg"
                alt="JP Immobilien"
                width="454"
                height="93"
              />
              <span className="marketing-credit">© JP Immobilien</span>
            </a>
            <a href="tel:+4315966020">+43 1 596 60 20</a>
            <a href="mailto:makler@jpi.at">makler@jpi.at</a>
            <a href="https://jpi.at/" target="_blank" rel="noreferrer">
              www.jpi.at ↗
            </a>
          </aside>
        )}
      </div>
      <section id="bilder" className="gallery-section">
        <SectionHeading label="Einblicke" title="Raum für Details.">
          <span>{p.photos.length} Originalaufnahmen</span>
        </SectionHeading>
        <div className="photo-grid">
          {p.photos.map((im, i) => (
            <button
              key={`${im.src}:${i}`}
              onClick={() => onGallery(p.photos, i)}
              aria-label={`Bild ${i + 1} von ${p.photos.length} vergrößern`}
            >
              <img
                src={im.src}
                alt={im.alt || `${p.title}, Ansicht ${i + 1}`}
                width="1000"
                height="750"
                loading="lazy"
              />
              <span aria-hidden="true">↗</span>
            </button>
          ))}
        </div>
        {p.path.includes("zollergasse") && (
          <a
            className="text-link project-video"
            href="https://vimeo.com/51589652"
            target="_blank"
            rel="noreferrer"
          >
            Video ansehen
            <Arrow />
          </a>
        )}
      </section>
      <nav className="project-pagination" aria-label="Weitere Projekte">
        {idx > 0 ? (
          <a href={data.projects[idx - 1].path}>
            <Arrow direction="left" />
            <span>
              <small>Voriges Projekt</small>
              {splitTitle(data.projects[idx - 1]).street}
            </span>
          </a>
        ) : (
          <a href="/projekte/">Übersicht Projekte</a>
        )}
        <a
          href="/projekte/"
          className="project-grid-link"
          aria-label="Projektübersicht"
        >
          ⊞
        </a>
        {idx < data.projects.length - 1 ? (
          <a href={data.projects[idx + 1].path}>
            <span>
              <small>Nächstes Projekt</small>
              {splitTitle(data.projects[idx + 1]).street}
            </span>
            <Arrow />
          </a>
        ) : (
          <a href="/projekte/">
            Alle Projekte
            <Arrow />
          </a>
        )}
      </nav>
      <ContactCTA />
    </article>
  );
}
function TeamSection() {
  return (
    <section className="shell section team-section">
      <SectionHeading
        label="Planung trifft Persönlichkeit"
        title="Unser Team."
      />
      <div className="team-grid">
        {people.map(([name, role, email, photo]) => (
          <article className="person" key={name}>
            <img
              src={"/assets/" + photo}
              alt={name}
              width="600"
              height="600"
              loading="lazy"
            />
            <div>
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
function About() {
  return (
    <>
      <section className="shell page-heading about-heading">
        <div>
          <Label>Space Architects · Über uns</Label>
          <h1>Das SA-I Team.</h1>
        </div>
        <p>{data.aboutText[0]}</p>
      </section>
      <figure className="shell about-cover">
        <img
          src="/assets/Ueber-uns-top-1.jpg"
          alt="Gemeinsame Architekturplanung bei Space Architects"
          width="1920"
          height="980"
          fetchPriority="high"
        />
      </figure>
      <section className="shell section about-story">
        <div>
          <Label>Unsere Haltung</Label>
          <h2>
            Wir schaffen
            <br />
            <em>Wohnraum.</em>
          </h2>
          <LinkButton href="/projekte/" quiet>
            Unsere Projekte
          </LinkButton>
        </div>
        <div>
          {data.aboutText.slice(1, 3).map((t) => (
            <p key={t}>{t}</p>
          ))}
        </div>
      </section>
      <TeamSection />
      <section className="shell section competence-section">
        <div>
          <Label>Unsere Kompetenzen</Label>
          <h2>
            Bis ins letzte
            <br />
            Detail durchdacht.
          </h2>
        </div>
        <ul>
          {[
            "Individuelle Planung",
            "Gewissenhafte Umsetzung",
            "Funktionale Nutzung",
            "Moderne Energiekonzepte",
            "Ästhetisches Gesamtbild",
          ].map((t, i) => (
            <li key={t}>
              <span>{String(i + 1).padStart(2, "0")}</span>
              {t}
              <Arrow />
            </li>
          ))}
        </ul>
      </section>
      <figure className="shell team-photo">
        <img
          src="/assets/Ueber-Uns-neu-111.jpg"
          alt="Das Team von Space Architects im Büro"
          width="650"
          height="442"
          loading="lazy"
        />
        <figcaption>Space Architects · Wien</figcaption>
      </figure>
      <ContactCTA />
    </>
  );
}
function Services() {
  return (
    <>
      <section className="shell page-heading">
        <Label>Von der Planung bis zum Verkauf</Label>
        <h1>Unsere Leistungen.</h1>
      </section>
      <figure className="shell services-cover">
        <img
          src="/assets/Leistungen-top-neu.jpg"
          alt="Architektur und Innenraumgestaltung von SA-Immobilien"
          width="1920"
          height="980"
          fetchPriority="high"
        />
      </figure>
      <section className="shell section services-page">
        <div className="service-intro">
          <Label>01 — 06</Label>
          <h2>
            Ein Projekt.
            <br />
            <em>Ein Partner.</em>
          </h2>
        </div>
        <ServiceList page />
      </section>
      <section className="shell section service-passion">
        <div>
          <Label>Space Architects</Label>
          <h2>
            Architekten
            <br />
            aus Leidenschaft.
          </h2>
        </div>
        <p>{data.serviceText[0]}</p>
      </section>
      <ContactCTA />
    </>
  );
}
function CompanyContact({ architect = false }) {
  const email = architect ? "info@space-architects.at" : "info@sa-i.at";
  return (
    <article className="company-contact">
      <img
        src={
          architect
            ? "/assets/Space-Architects-Logo.png"
            : "/assets/sa-i-logo-1.png"
        }
        alt={architect ? "Space Architects" : "SA-Immobilien"}
        width="1000"
        height="448"
      />
      <h3>{architect ? "Space Architects" : "SA-Immobilien"}</h3>
      <p>{address}</p>
      <dl>
        <div>
          <dt>Telefon</dt>
          <dd>
            <a href="tel:+4319579646">+43 (0)1 957 96 46</a>
          </dd>
        </div>
        <div>
          <dt>Fax</dt>
          <dd>+43 (0)1 957 96 46</dd>
        </div>
        <div>
          <dt>E-Mail</dt>
          <dd>
            <a href={"mailto:" + email}>{email}</a>
          </dd>
        </div>
      </dl>
    </article>
  );
}
function Contact() {
  return (
    <>
      <section className="shell page-heading contact-heading">
        <Label>SA-Immobilien · Kontakt</Label>
        <h1>
          Reden wir
          <br />
          <em>über Ihr Projekt.</em>
        </h1>
        <div className="contact-direct">
          <a href="mailto:info@sa-i.at">
            info@sa-i.at
            <Arrow />
          </a>
          <a href="tel:+4319579646">
            +43 (0)1 957 96 46
            <Arrow />
          </a>
        </div>
      </section>
      <section className="shell contact-layout">
        <div className="contact-info">
          <CompanyContact />
          <CompanyContact architect />
          <div className="opening-hours">
            <Label>Öffnungszeiten</Label>
            <dl>
              <div>
                <dt>Montag–Freitag</dt>
                <dd>9:00 bis 18:00 Uhr</dd>
              </div>
              <div>
                <dt>Samstag</dt>
                <dd>geschlossen</dd>
              </div>
              <div>
                <dt>Sonntag</dt>
                <dd>geschlossen</dd>
              </div>
            </dl>
          </div>
        </div>
        <div className="contact-form-panel">
          <Label>Direkt an unser Team</Label>
          <h2>Kontaktformular.</h2>
          <ContactForm modern />
        </div>
      </section>
      <section className="shell section" id="standort">
        <SectionHeading
          label="Wir freuen uns auf Ihren Besuch"
          title="Im Herzen von Wien."
        >
          <span>{address}</span>
        </SectionHeading>
        <ContactMap modern />
      </section>
      <figure className="shell contact-photo">
        <img
          src="/assets/Kontakt-tiop.jpg"
          alt="Das Büro von SA-Immobilien"
          width="1920"
          height="980"
          loading="lazy"
        />
      </figure>
    </>
  );
}
function LegalNode({ node }) {
  if (node == null) return null;
  if (typeof node === "string") return node;
  const { tag, attrs = {}, children = [] } = node;
  if (["script", "style", "iframe"].includes(tag)) return null;
  const p = {};
  if (tag === "a") {
    p.href = attrs.href;
    p.target = attrs.target;
    if (p.target === "_blank") p.rel = "noreferrer";
  }
  if (tag === "img") {
    p.src = attrs.src;
    p.alt = attrs.alt || "Webmedien";
    p.loading = "lazy";
    return <img {...p} />;
  }
  if (["br", "hr", "wbr"].includes(tag)) return createElement(tag);
  const mapped = ["h4", "h5", "h6"].includes(tag)
    ? "h2"
    : tag === "section"
      ? "div"
      : tag;
  return createElement(
    mapped,
    p,
    children.map((x, i) => <LegalNode key={i} node={x} />),
  );
}
function Legal() {
  return (
    <section className="shell legal-page">
      <div className="page-heading">
        <Label>SA-Immobilien · Rechtliches</Label>
        <h1>
          Impressum &amp;
          <br />
          Datenschutz.
        </h1>
      </div>
      <div className="legal-copy">
        <LegalNode node={legal} />
      </div>
    </section>
  );
}
function App() {
  const path = useRoute();
  const [gallery, setGallery] = useState(null);
  const p = data.projects.find((p) => p.path === path);
  let content, title;
  if (p) {
    content = (
      <ProjectDetail
        project={p}
        onGallery={(photos, index) => setGallery({ photos, index })}
      />
    );
    title = p.title;
  } else if (path === "/design-lab/") {
    content = null;
    title = "Design-Library";
  } else if (path.startsWith("/design-preview/")) {
    content = null;
    title = "Komponentenvorschau";
  } else if (path === "/") {
    content = <Home />;
    title = "Wohnraum zum Wohlfühlen";
  } else if (path === "/projekte/") {
    content = <Projects />;
    title = "Projekte";
  } else if (path === "/ueber-uns/") {
    content = <About />;
    title = "Über uns";
  } else if (path === "/leistungen/") {
    content = <Services />;
    title = "Leistungen";
  } else if (path === "/kontakt/") {
    content = <Contact />;
    title = "Kontakt";
  } else if (path === legalPath) {
    content = <Legal />;
    title = "Impressum und Datenschutz";
  } else {
    content = (
      <div className="shell page-heading">
        <h1>Seite nicht gefunden.</h1>
        <LinkButton href="/">Zur Startseite</LinkButton>
      </div>
    );
    title = "Seite nicht gefunden";
  }
  useEffect(() => {
    document.title = title + " · SA-Immobilien";
    document.body.className =
      "modern-theme" +
      (path.startsWith("/design-preview/") ? " preview-mode" : "");
    if (location.hash) {
      const frame = requestAnimationFrame(() => {
        document
          .getElementById(decodeURIComponent(location.hash.slice(1)))
          ?.scrollIntoView({ block: "start" });
      });
      return () => cancelAnimationFrame(frame);
    }
  }, [title, path]);
  if (path === "/design-lab/")
    return (
      <Suspense
        fallback={
          <main className="shell page-heading">
            <p>Design-Library wird geladen …</p>
          </main>
        }
      >
        <DesignLab />
      </Suspense>
    );
  if (path.startsWith("/design-preview/")) {
    const previews = {
      team: <TeamSection />,
      projects: <CurrentProjects />,
      hero: <HomeHero />,
      services: <HomeServices />,
      partners: <Partners />,
      contact: <ContactCTA />,
      navigation: <Header path="/ueber-uns/" />,
      motion: <HomeHero />,
    };
    return (
      <main className="current-design-preview">
        {previews[path.split("/")[2]] || <p>Vorschau nicht gefunden.</p>}
      </main>
    );
  }
  return (
    <>
      <a href="#main" className="skip-link">
        Zum Inhalt
      </a>
      <Header path={path} />
      <main id="main">{content}</main>
      <Footer />
      <Cookies modern />
      {gallery && (
        <Lightbox
          {...gallery}
          onChange={(index) => setGallery({ ...gallery, index })}
          onClose={() => setGallery(null)}
        />
      )}
    </>
  );
}
createRoot(document.getElementById("root")).render(<App />);
