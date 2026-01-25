import logoFestival from "../../assets/images/logos/logo_festival.webp";
import RunningStamp from "../../components/RunningStamp";

export default function Bases() {
  return (
    <section id="bases" className="py-16 lg:py-24 bg-white font-body relative overflow-hidden">

      {/* Carrusel Dinámico de Marcas de Agua */}
      <RunningStamp />

      <div className="max-w-6xl mx-auto px-6 lg:px-8 relative z-10">

        <header className="mb-16 lg:mb-20 flex flex-col md:flex-row md:items-center gap-8">
          <div className="flex items-center gap-6">
            <img src={logoFestival} alt="Logo Festival" className="h-20 sm:h-24 w-auto object-contain" />
            <div className="h-16 w-px bg-gray-200"></div>
          </div>
          <div className="flex-grow">
            <span className="text-[11px] font-bold text-orange-600 tracking-[0.3em] uppercase mb-3 block opacity-80">
              REGLAMENTO OFICIAL
            </span>
            <h2 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-none tracking-tight">
              Bases de Competencia
            </h2>
          </div>
          <p className="text-base lg:text-lg text-gray-500 leading-snug max-w-sm border-l-2 border-orange-500/20 pl-6">
            Arte, cultura e historia conoce los lineamientos y lo demas que estas escrito.
          </p>
        </header>

        {/* CONTENIDO - Grid Editorial Limpio */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-14 gap-y-14 lg:gap-y-16">
          {/* ... resto del contenido igual ... */}

          {/* INSCRIPCIONES */}
          <article>
            <span className="text-[10px] font-bold text-orange-600 uppercase tracking-[0.2em] mb-2 block">
              Inscripciones
            </span>
            <h3 className="font-heading text-lg font-bold text-gray-900 tracking-tight mb-3">
              Costos y Fechas
            </h3>
            <div className="space-y-2 text-gray-600 leading-snug mb-4">
              <p className="flex justify-between border-b border-gray-100 pb-2">
                <span>Individual / Seriado</span>
                <span className="font-semibold text-gray-900 italic">S/ 25.00</span>
              </p>
              <p className="flex justify-between border-b border-gray-100 pb-2">
                <span>Pareja</span>
                <span className="font-semibold text-gray-900 italic">S/ 35.00</span>
              </p>
            </div>
            <div className="text-[13px] text-gray-500 space-y-1">
              <p><span className="text-gray-900 font-medium tracking-tight">Fechas:</span> 09 al 20 de Febrero</p>
              <p><span className="text-gray-900 font-medium tracking-tight">Contacto:</span> 967 694 616</p>
              <p><span className="text-gray-900 font-medium tracking-tight">Horario:</span> 9:00 AM – 10:00 PM</p>
            </div>
          </article>

          {/* REQUISITOS */}
          <article>
            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-[0.2em] mb-2 block">
              Requisitos
            </span>
            <h3 className="font-heading text-lg font-bold text-gray-900 tracking-tight mb-3">
              Documentación Necesaria
            </h3>
            <ul className="space-y-1.5 text-gray-600 leading-snug text-[13px]">
              <li className="flex items-center gap-2"><div className="w-1 h-1 bg-blue-400 rounded-full"></div> Registro vía WhatsApp</li>
              <li className="flex items-center gap-2"><div className="w-1 h-1 bg-blue-400 rounded-full"></div> DNI original (bailarines)</li>
              <li className="flex items-center gap-2"><div className="w-1 h-1 bg-blue-400 rounded-full"></div> Voucher de pago (Yape)</li>
              <li className="flex items-center gap-2"><div className="w-1 h-1 bg-blue-400 rounded-full"></div> Nombre de la academia</li>
            </ul>
            <p className="mt-4 text-[12px] text-gray-400 leading-tight">
              Para el ingreso solo es necesario presentar el <span className="text-gray-700 font-semibold uppercase">DNI físico</span>.
            </p>
          </article>

          {/* JURADO */}
          <article>
            <span className="text-[10px] font-bold text-purple-600 uppercase tracking-[0.2em] mb-2 block">
              Jurado
            </span>
            <h3 className="font-heading text-lg font-bold text-gray-900 tracking-tight mb-3">
              Jurado Calificador
            </h3>
            <p className="text-gray-600 leading-snug mb-3 text-[13px]">
              Conformado por personalidades idóneas y conocedoras de nuestro baile nacional, garantizando una evaluación justa y técnica.
            </p>
            <div className="text-[12px] text-gray-500 space-y-1">
              <p><span className="text-gray-900 font-medium">Selección:</span> Sorteo previo</p>
              <p><span className="text-gray-900 font-medium">Fallo:</span> Inapelable</p>
            </div>
          </article>

          {/* CALIFICACIÓN */}
          <article>
            <span className="text-[10px] font-bold text-green-600 uppercase tracking-[0.2em] mb-2 block">
              Calificación
            </span>
            <h3 className="font-heading text-lg font-bold text-gray-900 tracking-tight mb-3">
              Sistema de Puntaje
            </h3>
            <p className="text-gray-600 leading-snug mb-3 text-[13px]">
              Puntaje mediante paleta en mano de <span className="text-gray-900 font-semibold italic">3 a 5 puntos</span>.
            </p>
            <div className="text-[12px] text-gray-500 space-y-0.5">
              <p><span className="text-gray-900 font-medium">Semifinal:</span> Máximo 6 parejas</p>
              <p><span className="text-gray-900 font-medium">Final:</span> 3 mejores parejas</p>
            </div>
          </article>

          {/* EMPATES */}
          <article>
            <span className="text-[10px] font-bold text-amber-600 uppercase tracking-[0.2em] mb-2 block">
              Empates
            </span>
            <h3 className="font-heading text-lg font-bold text-gray-900 tracking-tight mb-3">
              Criterios de Desempate
            </h3>
            <ol className="space-y-1.5 text-gray-600 leading-snug text-[13px] list-none">
              <li className="flex gap-2"><span>1.</span> Mesa de cómputo notifica</li>
              <li className="flex gap-2"><span>2.</span> Comisión decide criterios</li>
              <li className="flex gap-2"><span>3.</span> Puntaje anterior como desempate</li>
            </ol>
          </article>

          {/* IMPORTANTE */}
          <article>
            <span className="text-[10px] font-bold text-red-600 uppercase tracking-[0.2em] mb-2 block">
              Importante
            </span>
            <h3 className="font-heading text-lg font-bold text-gray-900 tracking-tight mb-3">
              Consideraciones
            </h3>
            <ul className="space-y-1.5 text-gray-500 leading-snug text-[12px] font-medium">
              <li className="flex items-baseline gap-2 text-red-900/40"><span>•</span> No habrá inscripciones el día del evento</li>
              <li className="flex items-baseline gap-2"><span>•</span> Adulteración de documentos causa eliminación</li>
              <li className="flex items-baseline gap-2"><span>•</span> Los nombres de inscripción no son modificables</li>
            </ul>
          </article>

        </div>

        {/* CTA */}
        <div className="mt-12 lg:mt-16 pt-12 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <p className="text-gray-500 italic max-w-xl">
              "Las parejas campeonas asumen el compromiso de asistir a su entrega de campeonato en el Festival Golpe Tierra 2027."
            </p>
            <a
              href="#inscripcion"
              className="inline-flex items-center justify-center px-10 py-3.5 text-[11px] font-bold tracking-[0.15em] uppercase text-white bg-gray-900 rounded-sm hover:bg-orange-600 transition-all duration-300 shadow-sm"
            >
              Inscríbete ahora
              <svg className="ml-2 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
          </div>
        </div>

      </div>
    </section >
  );
}
