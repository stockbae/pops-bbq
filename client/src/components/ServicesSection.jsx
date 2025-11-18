import '../App.css';
import { useState, useEffect } from "react";
import { getMenu } from "../Menu";

export default function ServicesSection() {
  const [menu, setMenu] = useState([]);
  
  useEffect(() => {
    getMenu()
    .then((items) => setMenu(items)).
    catch((err) => console.error(err));
  }, []);
  
  return (
    <section id="services" className="panel">
      <div className="container">
        <h2>Services</h2>
        {menu.map((item) => (
          <div key={item.id}>
            <h3>{item.name}</h3>
            <p>Price: ${item.price}</p>
            <p>{item.description}</p>
          </div>
        ))}
        <p>MENU</p>
        
      </div>
    </section>
  );
}
