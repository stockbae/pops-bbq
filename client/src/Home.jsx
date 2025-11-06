import { useState, useEffect, useRef } from "react";
import "./app.css";
import logo from "./assets/popsbbq-logo.png"

const Home = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [isShrunk, setIsShrunk] = useState(false);

  const headerRef = useRef(null);

  // Toggle mobile nav
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  // Smooth scrolling
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

  // Observe sections for active link highlight
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

  // Shrink header when scrolling
  useEffect(() => {
    const handleScroll = () => {
      setIsShrunk(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle contact form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Thank you for your message! We will get back to you soon.");
    e.target.reset();
  };

  return (
    <>
      <header
        ref={headerRef}
        className={`site-header ${isShrunk ? "shrink" : ""}`}
        id="site-header"
      >
        <div className="container header-inner">
          <div className="logo-container">
          <img className="brand" src={logo} alt="pops-bbq-logo" height={40} />
          <div className="brand">Pops BBQ</div>
          </div>
          <button
            className="nav-toggle"
            onClick={toggleMenu}
            aria-label="Toggle navigation"
            aria-expanded={menuOpen}
          >
            <span className="hamburger"></span>
          </button>
          <nav className={`nav ${menuOpen ? "open" : ""}`} id="nav">
            <ul className="nav-list">
              {["home", "about", "services", "portfolio", "contact"].map(
                (id) => (
                  <li key={id}>
                    <a
                      href={`#${id}`}
                      className={`nav-link ${
                        activeSection === id ? "active" : ""
                      }`}
                      onClick={(e) => handleSmoothScroll(e, id)}
                    >
                      {id.charAt(0).toUpperCase() + id.slice(1)}
                    </a>
                  </li>
                )
              )}
            </ul>
          </nav>
        </div>
      </header>

      <main>
        <section id="home" className="panel">
          <div className="container">
            <h1>Home</h1>
            <p>
              Welcome to the homepage. I don't know what to put here guyyssss
            </p>
          </div>
        </section>

        <section id="about" className="panel alt">
          <div className="container">
            <h2>About</h2>
            <p>About content goes here.</p>
          </div>
        </section>

        <section id="services" className="panel">
          <div className="container">
            <h2>Services</h2>
            <p>MENU</p>
          </div>
        </section>

        <section id="portfolio" className="panel alt">
          <div className="container">
            <h2>Portfolio</h2>
            <p>Gallery.</p>
          </div>
        </section>

        <section id="contact" className="panel">
          <div className="container">
            <h2>Contact Us</h2>
            <div className="contact-form-container">
              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    placeholder=" "
                  />
                  <label htmlFor="name">Your Name</label>
                </div>
                <div className="form-group">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    placeholder=" "
                  />
                  <label htmlFor="email">Your Email</label>
                </div>
                <div className="form-group">
                  <input type="tel" id="phone" name="phone" placeholder=" " />
                  <label htmlFor="phone">Phone Number</label>
                </div>
                <div className="form-group">
                  <textarea
                    id="message"
                    name="message"
                    required
                    placeholder=" "
                  ></textarea>
                  <label htmlFor="message">Your Message</label>
                </div>
                <button type="submit" className="submit-btn">
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container">
          <small>&copy; 2025 ITDEV</small>
        </div>
      </footer>
    </>
  );
};

export default Home;
