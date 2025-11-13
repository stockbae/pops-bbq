export default function ContactSection() {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Thank you for your message! We'll respond soon.");
    e.target.reset();
  };

  return (
    <section id="contact" className="panel">
      <div className="container">
        <h2>Contact Us</h2>
        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <input type="text" placeholder=" " required />
            <label>Your Name</label>
          </div>

          <div className="form-group">
            <input type="email" placeholder=" " required />
            <label>Your Email</label>
          </div>

          <div className="form-group">
            <input type="tel" placeholder=" " />
            <label>Phone Number</label>
          </div>

          <div className="form-group">
            <textarea placeholder=" " required></textarea>
            <label>Your Message</label>
          </div>

          <button type="submit" className="submit-btn">
            Send Message
          </button>
        </form>
      </div>
    </section>
  );
}
