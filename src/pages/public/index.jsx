import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Home from "./Home";
import Bases from "./Bases";
import Modalidades from "./Modalidades";
import Inscripcion from "./Inscripcion/Inscripcion";
import ConsultaInscripcion from "./ConsultaInscripcion";
import CategoryCarousel from "../../components/CategoryCarousel";

export default function ClientLanding() {
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const element = document.getElementById(hash.replace("#", ""));
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    }
  }, [hash]);

  return (
    <>
      <Home />
      <CategoryCarousel />
      <Bases />
      <CategoryCarousel />
      <Modalidades />
      <CategoryCarousel />
      <Inscripcion />
      <CategoryCarousel />
      <ConsultaInscripcion />
    </>
  );
}
