import React, { useState, useRef } from 'react';

export default function ContactSection() {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Thank you for your message! We'll respond soon.");
    e.target.reset();
  };
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    verify: '',
    phone: '',
    reservation_date: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const formRef = useRef(null);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e) {
    // Validate fields client-side (keep user on the page if validation fails)
    setError(null);
    setSuccess(null);

    if (form.email !== form.verify) {
      // Prevent submission if emails don't match
      e.preventDefault();
      setError('Email and verify email do not match');
      return;
    }

    // Allow native form submission to the action URL (Formsubmit.co)
    setLoading(true);
    // Note: we don't call e.preventDefault() here so the browser will POST the form
  }

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
        <div className="contact-form-container">
          <form
            className="contact-form"
            id="contactForm"
            onSubmit={handleSubmit}
            ref={formRef}
            method="POST"
            action="https://formsubmit.co/bolajoka@matc.edu"
          >
            {/* Formsubmit.co recommended hidden inputs */}
            <input type="hidden" name="_subject" value="New POPS contact" />
            <input type="hidden" name="_captcha" value="false" />
            <input type="hidden" name="_next" value={window.location.origin + '/thank-you.html'} />
            <div className="form-group">
              <input
                type="text"
                id="first_name"
                name="first_name"
                value={form.first_name}
                onChange={handleChange}
                required
              />
              <label htmlFor="first_name">First Name</label>

              <input
                type="text"
                id="last_name"
                name="last_name"
                value={form.last_name}
                onChange={handleChange}
                required
              />
              <label htmlFor="last_name">Last Name</label>
            </div>

            <div className="form-group">
              <input
                type="email"
                id="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
              />
              <label htmlFor="email">Your Email</label>
            </div>

            <div className="form-group">
              <input
                type="email"
                id="verify"
                name="verify"
                value={form.verify}
                onChange={handleChange}
                required
              />
              <label htmlFor="verify">Verify Email</label>
            </div>

            <div className="form-group">
              <input
                type="tel"
                id="phone"
                name="phone"
                value={form.phone}
                onChange={handleChange}
              />
              <label htmlFor="phone">Phone Number</label>
            </div>

            <div className="form-group">
              <input
                type="date"
                id="reservation_date"
                name="reservation_date"
                value={form.reservation_date}
                onChange={handleChange}
              />
              <label htmlFor="reservation_date">Reservation Date</label>
            </div>

            <div className="form-group">
              <input
                type="text"
                id="subject"
                name="subject"
                value={form.subject}
                onChange={handleChange}
                required
              />
              <label htmlFor="subject">Subject</label>
            </div>

            <div className="form-group">
              <textarea
                id="message"
                name="message"
                value={form.message}
                onChange={handleChange}
                required
              ></textarea>
              <label htmlFor="message">Your Message</label>
            </div>

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Sending...' : 'Send Message'}
            </button>

            {error && <div className="error">{error}</div>}
            {success && <div className="success">{success}</div>}
          </form>
        </div>
      </div>
    </section>
  );
}