import '../App.css';
import logo from "../assets/popsbbq-logo.png";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <figure className='footer-logo-container'>
          <img src={logo} alt="Pop's BBQ Logo" className="footer-logo" />
        </figure>
        <p>N71W13161 Appleton Ave, Menomonee Falls, WI 53051</p>
        <small>
          <a href="https://www.facebook.com/popsbbqmilwaukee/">
            Like us on Facebook
          </a>
        </small>
        <p></p>
        <small>&copy; 2025 Pop's BBQ</small>
      </div>
    </footer>
  );
}
