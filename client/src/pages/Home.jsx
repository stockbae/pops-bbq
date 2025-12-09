import Header from "../components/Header";
import HomeSection from "../components/HomeSection";
import AboutSection from "../components/AboutSection";
import PortfolioSection from "../components/PortfolioSection";
import ContactSection from "../components/ContactSection";
import Footer from "../components/Footer";
import "../App.css";
import BuildOrder from "../components/BuildOrder";

export default function Home({ order, setOrder }) {
  return (
    <>
      <Header />

      <main>
        <HomeSection />
        <AboutSection />
        <BuildOrder order={order} setOrder={setOrder} />
        <PortfolioSection />
        <ContactSection />
      </main>

      <Footer />
    </>
  );
}
