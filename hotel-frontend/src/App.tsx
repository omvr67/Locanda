import { useState } from "react";
import { ArrowDownRight, ArrowRight, Menu, X, LayoutDashboard, Hotel } from "lucide-react";
import Chatbot from "./components/Chatbot";
import AnalyticsDashboard from "./components/AnalyticsDashboard";
import "./App.css";

const navItems = ["Stay", "Experience", "Dining", "The House"];

function App() {
  const [activeTab, setActiveTab] = useState<"guest" | "analytics">("guest");
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="site-shell">
      <header className="site-header">
        <a className="wordmark" href="#top" aria-label="Locanda home">LOCANDA</a>
        <nav className={`main-nav ${menuOpen ? "is-open" : ""}`} aria-label="Main navigation">
          {navItems.map((item) => (
            <a key={item} href={`#${item.toLowerCase().replace(" ", "-")}`} onClick={() => setMenuOpen(false)}>
              {item}
            </a>
          ))}
          <a className="nav-reserve" href="#reserve" onClick={() => setMenuOpen(false)}>Reserve</a>
        </nav>
        <div className="view-switcher" aria-label="View switcher">
          <button className={activeTab === "guest" ? "active" : ""} onClick={() => setActiveTab("guest")}><Hotel size={13} /> Guest</button>
          <button className={activeTab === "analytics" ? "active" : ""} onClick={() => setActiveTab("analytics")}><LayoutDashboard size={13} /> Analytics</button>
        </div>
        <button className="menu-toggle" aria-label={menuOpen ? "Close menu" : "Open menu"} onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>

      {activeTab === "guest" ? (
        <main id="top">
          <section className="hero-section">
            <div className="hero-image" />
            <div className="hero-copy">
              <p className="eyebrow">Locanda · Italia</p>
              <h1>A house<br />of timeless<br />beauty.</h1>
              <p className="hero-intro">An intimate expression of Italian hospitality, shaped by silence, stone and light.</p>
              <a className="text-link light-link" href="#the-house">Discover Locanda <ArrowDownRight size={16} /></a>
            </div>
            <span className="hero-location">42° 38′ N &nbsp;·&nbsp; 11° 06′ E</span>
          </section>

          <section className="editorial-section house-section" id="the-house">
            <div className="editorial-heading">
              <p className="eyebrow">The house</p>
              <h2>Where Italy<br /><em>becomes a feeling.</em></h2>
            </div>
            <div className="editorial-copy">
              <p>Set among the cypress and olive groves of the Tuscan coast, Locanda is a quiet study in what it means to arrive.</p>
              <p>Stone, linen and water compose an unhurried rhythm. There is nothing to perform here, only time to inhabit.</p>
              <a className="text-link" href="#experience">Read our story <ArrowRight size={15} /></a>
            </div>
            <div className="wide-image house-image" role="img" aria-label="Sunlit Italian stone courtyard" />
          </section>

          <section className="experience-section" id="experience">
            <div className="section-intro">
              <p className="eyebrow">The experience</p>
              <h2>Every detail<br /><em>has a reason.</em></h2>
            </div>
            <div className="chapter-grid">
              <article className="chapter chapter-tall">
                <div className="chapter-image chapter-room" />
                <div className="chapter-caption"><span>The rooms</span><ArrowRight size={15} /></div>
              </article>
              <article className="chapter chapter-offset">
                <div className="chapter-image chapter-table" />
                <div className="chapter-caption"><span>The table</span><ArrowRight size={15} /></div>
              </article>
              <article className="chapter">
                <div className="chapter-image chapter-garden" />
                <div className="chapter-caption"><span>The garden</span><ArrowRight size={15} /></div>
              </article>
            </div>
          </section>

          <section className="suites-section" id="stay">
            <div className="suite-image" role="img" aria-label="Quiet suite overlooking the Italian landscape" />
            <div className="suite-copy">
              <p className="eyebrow">The suites</p>
              <h2>Spaces designed<br /><em>for stillness.</em></h2>
              <p>Each room is a private composition of natural textures, morning light and a view that asks nothing of you.</p>
              <a className="text-link" href="#reserve">Explore the suites <ArrowRight size={15} /></a>
            </div>
          </section>

          <section className="dining-section" id="dining">
            <div className="dining-image" />
            <div className="dining-copy">
              <p className="eyebrow">Il tavolo</p>
              <h2>At the table,<br /><em>Italy speaks.</em></h2>
              <p>A daily menu shaped by the garden, the sea and the hands of the people who make it.</p>
              <a className="text-link light-link" href="#reserve">Discover dining <ArrowRight size={15} /></a>
            </div>
          </section>

          <section className="craft-section" id="reserve">
            <div className="craft-copy">
              <p className="eyebrow">The quiet craft</p>
              <h2>Made slowly.<br /><em>Held lightly.</em></h2>
              <p>Hand-thrown ceramics, cool Carrara marble, old oak and linen softened by the sun. Quality is felt in the things that remain unseen.</p>
            </div>
            <div className="craft-image craft-detail" />
            <div className="craft-image craft-architecture" />
          </section>

          <section className="final-cta">
            <p className="eyebrow">Locanda · Italia</p>
            <h2>Come away<br /><em>for a while.</em></h2>
            <a className="text-link" href="mailto:stay@locanda.it">Discover your stay <ArrowRight size={15} /></a>
          </section>
        </main>
      ) : (
        <main className="analytics-main"><AnalyticsDashboard /></main>
      )}

      {activeTab === "guest" && <Chatbot />}
      <footer className="site-footer">
        <a className="wordmark" href="#top">LOCANDA</a>
        <div className="footer-links">{navItems.slice(0, 3).map((item) => <a key={item} href={`#${item.toLowerCase()}`}>{item}</a>)}<a href="mailto:stay@locanda.it">Contact</a></div>
        <small>© {new Date().getFullYear()} Locanda Italia · Privacy · Terms</small>
      </footer>
    </div>
  );
}

export default App;
