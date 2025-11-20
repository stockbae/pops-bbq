import '../App.css';
import mapImage from "../assets/BBQ-Pics/map-image.jpg";


export default function AboutSection() {
  return (
    <section id="about" className="panel alt">
      <div className="container">
        <h2>About</h2>
        <p>The BEST Memphis Style BBQ in the city of Milwaukee.. don't believe us? Check out our reviews!!</p>
        <br></br>

        <h2>Location & Hours</h2>

        <div className="location-hours-container">
          {/*Map Image */}
          <div className="map-wrapper">
            <a
              href="https://www.google.com/maps/dir/Pop%27s+BBQ+Memphis+Style/Pop%27s+BBQ+Memphis+Style,+N71W13161+Appleton+Ave,+Menomonee+Falls,+WI+53051"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={mapImage}
                alt="Map showing the location of Pop's BBQ"
              ></img>
            </a>
          </div>

          {/*Hours Text */}
          <ul className="hours-list">
            <li><span className="day">Sun-Tue:</span> <span className="time"><strong>Closed</strong></span></li>
            <li><span className="day">Wed:</span> <span className="time">9am-5pm</span></li>
            <li><span className="day">Thu:</span> <span className="time">9am-5pm</span></li>
            <li><span className="day">Fri:</span> <span className="time">9am-5pm</span></li>
            <li><span className="day">Sat:</span> <span className="time">9am-5pm</span></li>
        </ul>

          </div>

      </div>
    </section>
  );
}
