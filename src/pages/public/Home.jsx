import { useEffect, useState } from "react";
import { IMAGES } from "../../constants/images";

const STACK_STYLES = [
  "rotate-[-12deg] -translate-x-12 -translate-y-8 sm:-translate-x-20 sm:-translate-y-12 lg:-translate-x-24 lg:-translate-y-16 z-10 grayscale-[0.5] scale-90",
  "rotate-[10deg] translate-x-12 -translate-y-10 sm:translate-x-24 sm:-translate-y-16 lg:translate-x-28 lg:-translate-y-20 z-20 grayscale-[0.4] scale-90",
  "rotate-[-6deg] -translate-x-6 translate-y-4 sm:-translate-x-10 sm:translate-y-6 lg:-translate-x-12 lg:translate-y-8 z-30 grayscale-[0.2] scale-95",
  "rotate-[5deg] translate-x-6 -translate-y-2 sm:translate-x-10 sm:-translate-y-4 lg:translate-x-14 lg:-translate-y-6 z-40 scale-95",
  "rotate-[-1deg] translate-x-2 translate-y-6 sm:translate-x-3 sm:translate-y-10 lg:translate-x-4 lg:translate-y-12 z-50 shadow-2xl scale-105",
];

export default function Home() {
  const [current, setCurrent] = useState(0);

  /* ===============================
     ROTACIÓN DE IMÁGENES
  ================================ */
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % IMAGES.HOME.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section id="inicio" className="relative w-full min-h-screen flex items-center bg-[#FDFBF7] overflow-hidden content-visibility-auto contain-strict">
      {/* Elementos decorativos de fondo - Optimizado: reduce blur y usa will-change */}
      <div className="absolute top-20 right-0 w-[400px] h-[400px] bg-orange-100/20 rounded-full blur-[80px] will-change-transform"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-yellow-100/20 rounded-full blur-[80px] will-change-transform"></div>

      <div className="relative max-w-[1400px] mx-auto px-6 lg:px-12 py-20 lg:py-24 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center z-10 w-full">

        {/* ===============================
            TEXTO (IZQUIERDA) - 5 columnas en desktop
        ================================ */}
        <div className="lg:col-span-5 flex flex-col items-start font-body space-y-6">
          <div className="flex flex-col items-start space-y-2">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/80 backdrop-blur-sm rounded-sm shadow-sm border border-orange-100/50">
              <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse"></div>
              <span className="text-[10px] font-bold tracking-[0.2em] text-orange-900/70 uppercase">
                Tercera Edición
              </span>
            </div>

            {/* Logo Principal en lugar de Texto */}
            <div className="relative group">
              <img
                src={IMAGES.LOGO}
                alt="Festival Golpe Tierra 2026"
                className="h-32 sm:h-44 lg:h-56 xl:h-[22rem] w-auto object-contain group-hover:scale-[1.02]"
              />
            </div>
          </div>

          {/* Descripción - mejor line-height estilo WordPress */}
          <p className="text-base lg:text-lg text-gray-500 leading-relaxed max-w-xl font-normal opacity-90">
            Tradición, identidad y cultura viva. Un espacio donde nuestros bailes tradicionales celebran
            el talento, la herencia y el orgullo de nuestros pueblos.
          </p>

          {/* Información del evento - Grid optimizado */}
          <div className="flex flex-col gap-8 w-full">
            {/* LUGAR, FECHA, HORA en una sola fila */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full">
              {/* LUGAR */}
              <div className="flex items-center gap-3 group">
                <div className="shrink-0 w-10 h-10 bg-gradient-to-br from-[#BC5A45] to-[#A04935] rounded-sm flex items-center justify-center text-white shadow-lg group-hover:shadow-xl group-hover:scale-105 transition-all duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <p className="font-bold text-[10px] text-gray-900 mb-0.5 uppercase tracking-wider">Lugar</p>
                  <p className="text-xs text-gray-500 font-medium leading-snug">Coliseo Karl Weiss, Chiclayo</p>
                </div>
              </div>

              {/* FECHA */}
              <div className="flex items-center gap-3 group">
                <div className="shrink-0 w-10 h-10 bg-gradient-to-br from-[#BC5A45] to-[#A04935] rounded-sm flex items-center justify-center text-white shadow-lg group-hover:shadow-xl group-hover:scale-105 transition-all duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="font-bold text-[10px] text-gray-900 mb-0.5 uppercase tracking-wider">Fecha</p>
                  <p className="text-xs text-gray-500 font-medium leading-snug">22 de Febrero, 2026</p>
                </div>
              </div>

              {/* HORA */}
              <div className="flex items-center gap-3 group">
                <div className="shrink-0 w-10 h-10 bg-gradient-to-br from-[#BC5A45] to-[#A04935] rounded-sm flex items-center justify-center text-white shadow-lg group-hover:shadow-xl group-hover:scale-105 transition-all duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="font-bold text-[10px] text-gray-900 mb-0.5 uppercase tracking-wider">Hora</p>
                  <p className="text-xs text-gray-500 font-medium leading-snug">09:30 a.m. Inicio</p>
                </div>
              </div>
            </div>

            {/* CTA BUTTON en la siguiente fila */}
            <div className="flex w-full">
              <a
                href="#inscripcion"
                className="group relative inline-flex items-center justify-center px-8 py-3 text-sm font-semibold text-white bg-gradient-to-r from-gray-900 to-gray-800 rounded-sm overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-105 hover:from-[#BC5A45] hover:to-[#A04935]"
              >
                <span className="relative z-10 tracking-[0.1em] text-xs uppercase font-bold">
                  Inscríbete Ahora
                </span>
                <svg className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* ===============================
            ÁLBUM DE FOTOS (DERECHA) - Optimizado para fit de pantalla
            FIX: Usar keys estables para evitar re-montaje del DOM
        ================================ */}
        <div className="lg:col-span-7 relative h-[400px] sm:h-[500px] lg:h-[550px] xl:h-[600px] w-full flex items-center justify-center perspective-[1500px]">
          {IMAGES.HOME.map((img, i) => {
            // Calcular qué estilo le toca a esta imagen (i) basándonos en el current
            // Si current es 0: img0 recibe style0, img1 recibe style1...
            // Si current es 1: img0 recibe style4 (último), img1 recibe style0...
            // La lógica previa era: (current + i) % length.
            // Para mantener la consistencia con las keys estables, necesitamos calcular el "índice de estilo"

            // Queremos que cuando 'current' sube, las imagenes roten.
            // Style index para la imagen 'i'
            const styleIndex = (i - current + IMAGES.HOME.length) % IMAGES.HOME.length;

            return (
              <div
                key={i} /* Key estable: el índice original de la imagen */
                className={`absolute w-60 h-44 sm:w-80 sm:h-60 lg:w-[380px] lg:h-[280px] xl:w-[450px] xl:h-[340px] bg-white p-2 lg:p-2.5 shadow-[0_20px_60px_rgba(0,0,0,0.15)] rounded-sm transition-all duration-700 ease-in-out transform hover:scale-110 hover:z-[60] hover:rotate-0 hover:shadow-[0_30px_80px_rgba(0,0,0,0.25)] cursor-pointer ${STACK_STYLES[styleIndex] || ""}`}
              >
                <div className="w-full h-full overflow-hidden rounded-sm relative">
                  <img
                    src={img}
                    alt={`Golpe Tierra ${i}`}
                    /* Solo carga eager las primeras para LCP */
                    loading={styleIndex === 4 ? "eager" : "lazy"}
                    className="w-full h-full object-cover select-none"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
