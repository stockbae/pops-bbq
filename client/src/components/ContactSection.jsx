import React, { useState, useRef } from 'react';

export default function ContactSection() {
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

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (form.email !== form.verify) {
      setError('Email and verify email do not match');
      return;
    }

    setLoading(true);
    try {
      // Send as FormData so PHP can read via $_POST
      const fd = new FormData();
      Object.keys(form).forEach((k) => fd.append(k, form[k]));

      const res = await fetch('./contact.php', {
        method: 'POST',
        body: fd,
      });

      const text = await res.text();
      if (!res.ok) {
        setError(text || `Server error: ${res.status}`);
      } else {
        // PHP page may echo confirmation; show a simple success message and the PHP response
        setSuccess('Message sent successfully.');
        // Optionally show returned HTML/text from PHP in console for debugging
        console.log('PHP response:', text);
        // Reset form
        setForm({ first_name: '', last_name: '', email: '', verify: '', phone: '', reservation_date: '', subject: '', message: '' });
        if (formRef.current) formRef.current.reset();
      }
    } catch (err) {
      setError(err.message || 'Network error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="contact" className="panel">
      <div className="container">
        <h2>Contact Us</h2>
        <div className="contact-form-container">
          <form
            className="contact-form"
            id="contactForm"
            onSubmit={handleSubmit}
            ref={formRef}
            method="POST"
            action="./contact.php"
          >
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
