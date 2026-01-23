import React from 'react';

const categories = [
    { name: "Tondero Nacional", icon: "🏆" },
    { name: "Marinera Norteña", icon: "💃" },
    { name: "Baile Tierra", icon: "🔥" },
    { name: "Marinera Tradicional", icon: "🎭" },
    { name: "Novel Nacional", icon: "⭐" },
    { name: "Individual Dama", icon: "✨" },
    { name: "Parejas Mixtas", icon: "🤝" },
    { name: "Campeón de Campeones", icon: "👑" },
];

export default function CategoryCarousel() {
    // Triplicamos la lista para asegurar un scroll infinito fluido
    const items = [...categories, ...categories, ...categories];

    return (
        <div className="w-full bg-white border-y border-gray-100 py-10 overflow-hidden relative group">
            {/* Gradientes laterales para efecto de desvanecimiento (Estilo WordPress Premium) */}
            <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
            <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>

            {/* Contenedor de Movimiento */}
            <div className="flex whitespace-nowrap animate-infinite-scroll group-hover:pause-animation">
                {items.map((cat, i) => (
                    <div
                        key={i}
                        className="flex items-center gap-4 mx-12 md:mx-16 transition-opacity duration-300 hover:opacity-100 opacity-60 cursor-default"
                    >
                        <span className="text-xl grayscale group-hover:grayscale-0 transition-all duration-500">{cat.icon}</span>
                        <span className="text-sm md:text-base font-heading font-bold uppercase tracking-[0.2em] text-gray-900 leading-none">
                            {cat.name}
                        </span>
                        <div className="w-1.5 h-1.5 bg-orange-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>
                ))}
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes infinite-scroll {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-33.33%); }
                }
                .animate-infinite-scroll {
                    display: flex;
                    width: max-content;
                    animation: infinite-scroll 40s linear infinite;
                }
                .group-hover\\:pause-animation:hover {
                    animation-play-state: paused;
                }
                `
            }} />
        </div>
    );
}
