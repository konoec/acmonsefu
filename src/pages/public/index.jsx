import { useEffect, lazy, Suspense } from "react";
import { useLocation } from "react-router-dom";
import Home from "./Home";
import CategoryCarousel from "../../components/CategoryCarousel";

const Bases = lazy(() => import("./Bases"));
const Modalidades = lazy(() => import("./Modalidades"));
const Inscripcion = lazy(() => import("./Inscripcion/Inscripcion"));
const ConsultaInscripcion = lazy(() => import("./ConsultaInscripcion"));


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
      <Suspense fallback={<div className="min-h-screen bg-[#FDFBF7]" />}>
        <Bases />
        <CategoryCarousel />
        <Modalidades />
        <CategoryCarousel />
        <Inscripcion />
        <CategoryCarousel />
        <ConsultaInscripcion />
      </Suspense>
    </>
  );
}
