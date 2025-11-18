import '../App.css';
import portfolio1 from "../assets/BBQ-Pics/brisket-and-ribs.jpg";
import portfolio2 from "../assets/BBQ-Pics/double-ribs.jpg";
import portfolio3 from "../assets/BBQ-Pics/plate.jpg";
import portfolio4 from "../assets/BBQ-Pics/potato-salad.jpg";
import portfolio5 from "../assets/BBQ-Pics/ribs-closeup.jpg";
import portfolio6 from "../assets/BBQ-Pics/ribs.jpg";
import portfolio7 from "../assets/BBQ-Pics/slaw.jpg";
import portfolio8 from "../assets/BBQ-Pics/trailer.jpg";

const images = [
  portfolio1,
  portfolio2,
  portfolio3,
  portfolio4,
  portfolio5,
  portfolio6,
  portfolio7,
  portfolio8,
];

export default function PortfolioSection() {
  return (
    <section id="portfolio" className="panel alt">
      <div className="container">
        <h2>Portfolio</h2>
        <div className="gallery">
          {images.map((img, i) => (
            <div className="gallery-item" key={i}>
              <img src={img} alt={`Portfolio ${i + 1}`} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
