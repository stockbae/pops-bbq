import '../App.css';

export default function HomeSection() {

  const scrollToServices = (e) => {
    e.preventDefault();
    document.querySelector('.nav-link[href="#services"]').click();
  };
  return (
    <section id="home" className="panel">
      <div className="container home-header-row">
        <h1>Home</h1>
        

        <button className="home-button" onClick={scrollToServices}>
          Click to Order
        </button>
      </div>

      <div className="container">
        <p>Welcome to Pop's BBQ!</p>
      </div>
    </section>
  );
}
