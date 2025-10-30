import React from 'react'
import "./App.css";

function Home() {
  return (
    <div>
  <header className="site-header" id="site-header">
    <div className="container header-inner">
      <div className="brand">POPS</div>
      <button class="nav-toggle" id="nav-toggle" aria-label="Toggle navigation">
        <span class="hamburger"></span>
      </button>
      <nav class="nav" id="nav">
        <ul class="nav-list">
          <li><a href="#home" class="nav-link" data-target="home">Home</a></li>
          <li><a href="#about" class="nav-link" data-target="about">About</a></li>
          <li><a href="#services" class="nav-link" data-target="services">Menu</a></li>
          <li><a href="#portfolio" class="nav-link" data-target="portfolio">Gallery</a></li>
          <li><a href="#contact" class="nav-link" data-target="contact">Contact</a></li>
        </ul>
      </nav>
    </div>
  </header>

  <main>
    <section id="home" class="panel">
      <div className="container">
        <h1>Home</h1>
        <p>Welcome to the homepage. I don't know what to put here guyyssss</p>
      </div>
    </section>

    <section id="about" class="panel alt">
      <div class="container">
        <h2>About</h2>
        <p>About content goes here.</p>
      </div>
    </section>

    <section id="services" class="panel">
      <div class="container">
        <h2>Services</h2>
        <p> MENU</p>
      </div>
    </section>

    <section id="portfolio" class="panel alt">
      <div class="container">
        <h2>Portfolio</h2>
        <p>Gallery.</p>
      </div>
    </section>

    <section id="contact" class="panel">
      <div class="container">
        <h2>Contact Us</h2>
        <div class="contact-form-container">
          <form class="contact-form" id="contactForm">
            <div class="form-group">
              <input type="text" id="name" name="name" required></input>
              <label for="name">Your Name</label>
            </div>
            <div class="form-group">
              <input type="email" id="email" name="email" required></input>
              <label for="email">Your Email</label>
            </div>
            <div class="form-group">
              <input type="tel" id="phone" name="phone"> </input>
              <label for="phone">Phone Number</label>
            </div>
            <div class="form-group">
              <textarea id="message" name="message" required></textarea>
              <label for="message">Your Message</label>
            </div>
            <button type="submit" class="submit-btn">Send Message</button>
          </form>
        </div>
      </div>
    </section>
  </main>

  <footer class="site-footer">
    <div class="container">
      <small>&copy; 2025 ITDEV</small>
    </div>
  </footer>
</div>
  )
}

export default Home