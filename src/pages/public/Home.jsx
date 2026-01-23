import { useEffect, useState } from "react";

/* ===============================
   IMPORTACIÓN DE IMÁGENES
================================ */
import img1 from "../../assets/images/home/image.png";
import img2 from "../../assets/images/home/image2.png";
import img3 from "../../assets/images/home/image3.png";
import img4 from "../../assets/images/home/image4.png";
import img5 from "../../assets/images/home/image5.png";
import img6 from "../../assets/images/home/image6.png";
import img7 from "../../assets/images/home/image7.png";
import img8 from "../../assets/images/home/image8.png";
import logoFestival from "../../assets/images/logos/logo_festival.png";

const HOME_IMAGES = [img1, img2, img3, img4, img5, img6, img7, img8];

export default function Home() {
  const [current, setCurrent] = useState(0);

  /* ===============================
     ROTACIÓN DE IMÁGENES
  ================================ */
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % HOME_IMAGES.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section id="inicio" className="relative w-full min-h-screen flex items-center bg-gradient-to-br from-[#FDFBF7] via-[#FFF9F0] to-[#FFF5E8] overflow-hidden">
      {/* Elementos decorativos de fondo - más sutiles */}
      <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-gradient-to-br from-orange-200/15 to-red-200/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-orange-100/20 to-yellow-100/15 rounded-full blur-3xl"></div>

      <div className="relative max-w-[1400px] mx-auto px-6 lg:px-12 py-20 lg:py-24 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center z-10 w-full">

        {/* ===============================
            TEXTO (IZQUIERDA) - 5 columnas en desktop
        ================================ */}
        <div className="lg:col-span-5 flex flex-col items-start font-body space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-sm shadow-sm border border-orange-100/50">
            <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse"></div>
            <span className="text-[10px] font-bold tracking-[0.2em] text-orange-900/70 uppercase">
              Tercera Edición
            </span>
          </div>

          {/* Logo Principal en lugar de Texto */}
          <div className="relative group">
            <img
              src={logoFestival}
              alt="Festival Golpe Tierra 2026"
              className="h-44 sm:h-56 lg:h-72 xl:h-[28rem] w-auto object-contain transition-transform duration-500 group-hover:scale-[1.02]"
            />
          </div>

          {/* Descripción - mejor line-height estilo WordPress */}
          <p className="text-lg lg:text-xl text-gray-500 leading-relaxed max-w-xl font-normal opacity-90">
            Tradición, identidad y cultura viva. Un espacio donde nuestros bailes tradicionales celebran
            el talento, la herencia y el orgullo de nuestros pueblos.
          </p>

          {/* Información del evento - Grid mejorado */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 w-full pt-4">
            {/* LUGAR */}
            <div className="flex flex-col gap-3 group">
              <div className="w-12 h-12 bg-gradient-to-br from-[#BC5A45] to-[#A04935] rounded-sm flex items-center justify-center text-white shadow-lg group-hover:shadow-xl group-hover:scale-105 transition-all duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <p className="font-bold text-xs text-gray-900 mb-1 uppercase tracking-wider">Lugar</p>
                <p className="text-sm text-gray-500 font-medium leading-snug">Coliseo Karl Weiss<br />Chiclayo</p>
              </div>
            </div>

            {/* FECHA */}
            <div className="flex flex-col gap-3 group">
              <div className="w-12 h-12 bg-gradient-to-br from-[#BC5A45] to-[#A04935] rounded-sm flex items-center justify-center text-white shadow-lg group-hover:shadow-xl group-hover:scale-105 transition-all duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="font-bold text-xs text-gray-900 mb-1 uppercase tracking-wider">Fecha</p>
                <p className="text-sm text-gray-500 font-medium leading-snug">22 de Febrero<br />2026</p>
              </div>
            </div>

            {/* CTA BUTTON - Ahora en posición 3 */}
            <div className="flex flex-col gap-3 justify-end sm:row-span-1">
              <a
                href="#inscripcion"
                className="group relative inline-flex items-center justify-center px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-gray-900 to-gray-800 rounded-sm overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-105 hover:from-[#BC5A45] hover:to-[#A04935]"
              >
                <span className="relative z-10 tracking-[0.1em] text-xs uppercase font-bold">
                  Inscríbete Ahora
                </span>
                <svg className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </a>
            </div>

            {/* HORA - Ahora en posición 4 */}
            <div className="flex flex-col gap-3 group">
              <div className="w-12 h-12 bg-gradient-to-br from-[#BC5A45] to-[#A04935] rounded-sm flex items-center justify-center text-white shadow-lg group-hover:shadow-xl group-hover:scale-105 transition-all duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="font-bold text-xs text-gray-900 mb-1 uppercase tracking-wider">Hora</p>
                <p className="text-sm text-gray-500 font-medium leading-snug">09:30 a.m.<br />Inicio</p>
              </div>
            </div>
          </div>
        </div>

        {/* ===============================
            ÁLBUM DE FOTOS (DERECHA) - 7 columnas en desktop - MÁS GRANDE
        ================================ */}
        <div className="lg:col-span-7 relative h-[500px] sm:h-[600px] lg:h-[700px] xl:h-[800px] w-full flex items-center justify-center perspective-[1500px] animate-album">
          {Array.from({ length: 5 }).map((_, i) => {
            const index = (current + i) % HOME_IMAGES.length;
            const img = HOME_IMAGES[index];

            // Estilos mejorados para 5 fotos apiladas - TAMAÑOS MÁS GRANDES
            const stackStyles = [
              "rotate-[-12deg] -translate-x-16 -translate-y-12 sm:-translate-x-24 sm:-translate-y-16 lg:-translate-x-32 lg:-translate-y-20 z-10 grayscale-[0.5] scale-90",   // Farther back left
              "rotate-[10deg] translate-x-16 -translate-y-14 sm:translate-x-28 sm:-translate-y-20 lg:translate-x-36 lg:-translate-y-24 z-20 grayscale-[0.4] scale-90",      // Farther back right
              "rotate-[-6deg] -translate-x-8 translate-y-4 sm:-translate-x-12 sm:translate-y-6 lg:-translate-x-16 lg:translate-y-8 z-30 grayscale-[0.2] scale-95",          // Mid left
              "rotate-[5deg] translate-x-8 -translate-y-2 sm:translate-x-14 sm:-translate-y-4 lg:translate-x-18 lg:-translate-y-6 z-40 scale-95",                          // Mid right
              "rotate-[-1deg] translate-x-2 translate-y-8 sm:translate-x-3 sm:translate-y-12 lg:translate-x-4 lg:translate-y-16 z-50 shadow-2xl scale-105",                          // Front center
            ];

            return (
              <div
                key={`${index}-${i}`}
                className={`absolute w-72 h-52 sm:w-96 sm:h-72 lg:w-[480px] lg:h-[360px] xl:w-[560px] xl:h-[420px] bg-white p-2 lg:p-3 shadow-[0_20px_60px_rgba(0,0,0,0.15)] rounded-sm transition-all duration-700 ease-in-out transform hover:scale-110 hover:z-[60] hover:rotate-0 hover:shadow-[0_30px_80px_rgba(0,0,0,0.25)] cursor-pointer ${stackStyles[i] || ""}`}
              >
                <div className="w-full h-full overflow-hidden rounded-sm relative">
                  <img
                    src={img}
                    alt={`Golpe Tierra ${index}`}
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
