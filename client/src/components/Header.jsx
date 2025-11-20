import '../App.css';
import { useState, useEffect, useRef } from "react";
import logo from "../assets/popsbbq-logo.png";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [isShrunk, setIsShrunk] = useState(false);
  const headerRef = useRef(null);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const handleSmoothScroll = (e, id) => {
    e.preventDefault();
    const targetEl = document.getElementById(id);
    if (!targetEl || !headerRef.current) return;

    const offset = headerRef.current.offsetHeight + 8;
    const top =
      targetEl.getBoundingClientRect().top + window.pageYOffset - offset;

    window.scrollTo({ top, behavior: "smooth" });
    setMenuOpen(false);
  };

  useEffect(() => {
    const sections = document.querySelectorAll("main section[id]");
    const header = headerRef.current;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        root: null,
        rootMargin: `-${Math.round(
          (header?.offsetHeight || 0) * 0.6
        )}px 0px -40% 0px`,
        threshold: 0.25,
      }
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsShrunk(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      ref={headerRef}
      className={`site-header ${isShrunk ? "shrink" : ""}`}
      id="site-header"
    >
      <div className="container header-inner">
        <div className="logo-container">
          <img className="brand" src={logo} height={40} alt="pops-bbq-logo" />
          <div className="brand">Pop's BBQ</div>
        </div>

        <button
          className="nav-toggle"
          onClick={toggleMenu}
          aria-expanded={menuOpen}
        >
          <span className="hamburger"></span>
        </button>

        <nav className={`nav ${menuOpen ? "open" : ""}`}>
          <ul className="nav-list">
            {["home", "about", "services", "portfolio", "contact"].map((id) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  className={`nav-link ${activeSection === id ? "active" : ""}`}
                  onClick={(e) => handleSmoothScroll(e, id)}
                >
                  {id.charAt(0).toUpperCase() + id.slice(1)}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
