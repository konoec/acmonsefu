import logoFestival from "../../assets/images/logos/logo_festival.webp";
import RunningStamp from "../../components/RunningStamp";

export default function Modalidades() {
    const categories = [
        {
            id: "01",
            title: "Tondero",
            subtitle: "Individual Dama",
            levels: [
                { name: "Infantil", age: "hasta los 12 años cumplidos" },
                { name: "Junior", age: "13 a 17 años cumplidos" },
                { name: "Juvenil", age: "18 a 22 años cumplidos" },
                { name: "Adultos", age: "23 años a más" },
            ],
        },
        {
            id: "02",
            title: "Marinera Tradicional",
            subtitle: "Parejas",
            levels: [
                { name: "Infantil", age: "hasta los 12 años cumplidos" },
                { name: "Junior", age: "13 a 17 años cumplidos" },
                { name: "Juvenil", age: "18 a 22 años cumplidos" },
                { name: "Adultos", age: "23 años a más" },
            ],
        },
        {
            id: "03",
            title: "Marinera Norteña",
            subtitle: "Seriado (Dama)",
            levels: [
                { name: "Pre Infantil", age: "hasta los 6 años" },
                { name: "Infantil", age: "7 a 9 años cumplidos" },
                { name: "Infantil", age: "10 a 13 años cumplidos" },
                { name: "Junior", age: "14 a 17 años cumplidos" },
            ],
        },
        {
            id: "04",
            title: "Marinera Norteña",
            subtitle: "Individual (Dama y Varón)",
            levels: [
                { name: "Pre Infantil", age: "hasta los 6 años" },
                { name: "Infantil", age: "7 a 9 años cumplidos" },
                { name: "Infantil", age: "10 a 13 años cumplidos" },
                { name: "Junior", age: "14 a 17 años cumplidos" },
                { name: "Juvenil", age: "18 a 22 años cumplidos" },
                { name: "Adultos", age: "23 años a más" },
            ],
        },
        {
            id: "05",
            title: "Marinera Norteña",
            subtitle: "Novel",
            levels: [
                { name: "Pre Infantil", age: "hasta los 6 años" },
                { name: "Infantil", age: "7 a 9 años cumplidos" },
                { name: "Infantil", age: "10 a 13 años cumplidos" },
                { name: "Junior", age: "14 a 17 años cumplidos" },
                { name: "Juvenil", age: "18 a 22 años cumplidos" },
                { name: "Adultos", age: "23 años a más" },
            ],
            note: "Restricción: Los participantes no deben haber ganado ningún campeonato Novel o Nacional.",
        },
        {
            id: "06",
            title: "Marinera Norteña",
            subtitle: "Nacional",
            levels: [
                { name: "Pre Infantil", age: "hasta los 6 años" },
                { name: "Infantil", age: "7 a 9 años cumplidos" },
                { name: "Infantil", age: "10 a 13 años cumplidos" },
                { name: "Junior", age: "14 a 17 años cumplidos" },
                { name: "Juvenil", age: "18 a 22 años cumplidos" },
                { name: "Adultos", age: "23 años a más" },
            ],
        },
        {
            id: "07",
            title: "Baile Tierra",
            subtitle: "Parejas",
            levels: [
                { name: "Infantil", age: "hasta los 12 años" },
                { name: "Junior – Juvenil", age: "13 a 19 años" },
                { name: "Adulto", age: "20 años a más" },
            ],
        },
        {
            id: "08",
            title: "Tondero – Nacional",
            subtitle: "Parejas",
            levels: [
                { name: "Infantil", age: "hasta los 12 años" },
                { name: "Junior", age: "13 a 17 años" },
                { name: "Juvenil", age: "18 a 22 años" },
                { name: "Adultos", age: "23 a 35 años" },
                { name: "Senior", age: "36 años a más" },
            ],
        },
    ];

    return (
        <section id="modalidades" className="py-20 lg:py-28 bg-[#FFF9F6] font-body relative overflow-hidden">

            {/* Carrusel Dinámico de Marcas de Agua */}
            <RunningStamp />

            <div className="max-w-[1400px] mx-auto px-6 lg:px-8 relative z-10">

                {/* Header Clean & Potente */}
                <header className="mb-20 flex flex-col md:flex-row md:items-center gap-8">
                    <div className="flex items-center gap-6">
                        <img src={logoFestival} alt="Logo Festival" className="h-20 sm:h-24 w-auto object-contain" />
                        <div className="h-16 w-px bg-orange-200"></div>
                    </div>
                    <div>
                        <span className="text-[11px] font-bold text-orange-600 tracking-[0.3em] uppercase mb-4 block opacity-80">
                            CATEGORÍAS 2026
                        </span>
                        <h2 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-none tracking-tight">
                            Modalidades
                        </h2>
                    </div>
                </header>

                {/* Categories Slider - WordPress Premium Style */}
                <div className="flex overflow-x-auto pb-8 gap-6 snap-x snap-mandatory scrollbar-hide lg:grid lg:grid-cols-3 xl:grid-cols-4 lg:overflow-visible lg:pb-0">
                    {categories.map((cat) => (
                        <div key={cat.id} className="min-w-[280px] sm:min-w-[320px] lg:min-w-0 snap-center group bg-white rounded-sm border border-gray-100/60 p-5 shadow-[0_2px_10px_rgb(0,0,0,0.02)] hover:border-orange-200 hover:shadow-[0_8_30px_rgb(0,0,0,0.04)] transition-all duration-500 ease-out flex flex-col h-full hover:-translate-y-1">

                            {/* Card Header Minimalista */}
                            <div className="mb-3">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-3xl font-heading font-extrabold text-gray-100 group-hover:text-orange-100 transition-colors duration-500">
                                        {cat.id}
                                    </span>
                                    {cat.subtitle && (
                                        <span className="inline-block px-2.5 py-1 text-[8px] font-bold uppercase tracking-[0.15em] text-orange-700 bg-orange-50 rounded-sm">
                                            {cat.subtitle}
                                        </span>
                                    )}
                                </div>
                                <h3 className="font-heading text-xl font-bold text-gray-900 leading-tight group-hover:text-orange-900 transition-colors duration-300">
                                    {cat.title}
                                </h3>
                            </div>

                            {/* Divider sutil */}
                            <div className="w-8 h-0.5 bg-gray-100 group-hover:bg-orange-500 transition-all duration-500 mb-3"></div>

                            {/* Lista de Niveles Compacta */}
                            <ul className="space-y-0.5 mb-4 flex-grow">
                                {cat.levels.map((level, idx) => (
                                    <li key={idx} className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline border-b border-gray-50 pb-1 last:border-0 last:pb-0 gap-0.5 group/item">
                                        <strong className="text-[12px] font-bold text-gray-800 group-hover/item:text-gray-900 transition-colors">
                                            {level.name}
                                        </strong>
                                        <span className="text-[10px] text-gray-400 font-medium group-hover/item:text-gray-500 transition-colors tracking-tight">
                                            {level.age}
                                        </span>
                                    </li>
                                ))}
                            </ul>

                            {/* Notas al pie */}
                            {cat.note && (
                                <div className="mt-auto pt-3 border-t border-gray-50">
                                    <p className="text-[10px] text-red-500 font-medium leading-tight italic">
                                        {cat.note}
                                    </p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}