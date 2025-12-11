import '../App.css';
import React, { useState, useRef, useEffect } from 'react';

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

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('contact') === 'success') {
      setSuccess('Thank you for your message!');
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e) {
    setError(null);
    if (form.email !== form.verify) {
      e.preventDefault();
      setError('Email and verify email do not match');
      return;
    }
    // Allow native form submission to Formsubmit.co
  }

  return (
    <section id="contact" className="panel">
      <div className="container">
        <h2>Contact Us</h2>
        {success && <div className="success" style={{ fontSize: '28px', fontWeight: 'bold', padding: '20px', textAlign: 'center', marginBottom: '20px', color: '#155724', borderRadius: '4px' }}>THANK YOU!</div>}
        <form
          className="contact-form"
          id="contactForm"
          onSubmit={handleSubmit}
          ref={formRef}
          method="POST"
          action="https://formsubmit.co/bolajoka@matc.edu"
        >
          <input type="hidden" name="_subject" value="New POPS contact" />
          <input type="hidden" name="_captcha" value="false" />
          <input type="hidden" name="_next" value={window.location.origin + '/?contact=success'} />

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
          </div>

          <div className="form-group">
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
    </section>
  );
}