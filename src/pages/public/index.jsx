import Home from "./Home";
import Bases from "./Bases";
import Modalidades from "./Modalidades";
import Inscripcion from "./Inscripcion/Inscripcion";
import CategoryCarousel from "../../components/CategoryCarousel";

export default function ClientLanding() {
  return (
    <>
      <Home />
      <CategoryCarousel />
      <Bases />
      <CategoryCarousel />
      <Modalidades />
      <CategoryCarousel />
      <Inscripcion />
    </>
  );
}
