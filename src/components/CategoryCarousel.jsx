import React from 'react';

// Iconos SVG minimalistas para reemplazar los emojis
const Icons = {
    Trophy: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" /><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" /><path d="M4 22h16" /><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" /><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" /><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" /></svg>
    ),
    Dancer: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z" /><path d="M12 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" /><path d="M8 11s1.5 2 4 2 4-2 4-2" /><path d="M10 16.5a2.5 2.5 0 0 0 4 0" /></svg>
    ),
    Fire: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.292 1-3a2.5 2.5 0 0 0 2.5 2.5z" /></svg>
    ),
    Mask: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" /><path d="M15 11a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" /><path d="m19 12-1.5 3c-.5 1.1-1.3 2-2.3 2.6C14.1 18.2 13.1 18.5 12 18.5s-2.1-.3-3.2-.9c-1-.6-1.8-1.5-2.3-2.6L5 12" /><path d="M12 21a9 9 0 1 1 0-18 9 9 0 0 1 0 18z" /></svg>
    ),
    Star: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
    ),
    Sparkles: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3 1.912 4.912L18.824 9.824 13.912 11.736 12 16.648l-1.912-4.912-4.912-1.912 4.912-1.912L12 3Z" /><path d="m5 3 1 2.5L8.5 7 6 8.125 5 10.625 4 8.125 1.5 7 4 5.875 5 3Z" /><path d="m19 13.25 1 2.5 2.5 1.125L20 18l-1 2.5-1-2.5-2.5-1.125 2.5-1.125 1-2.5Z" /></svg>
    ),
    Handshake: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m11 17 2 2 6-6" /><path d="m18 10 1-1a2 2 0 0 0-2.83-2.83l-2.5 2.5a2 2 0 0 1-2.83 0l-1.17-1.17a2 2 0 0 0-2.83 0L3.34 11.33a2 2 0 0 0 0 2.83l6.17 6.17a2 2 0 0 0 2.83 0L20.5 12.17a2 2 0 0 1 2.83 0L24 13.5" /></svg>
    ),
    Crown: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7Z" /><path d="M12 17v5" /><path d="M9 22h6" /></svg>
    )
};

const categories = [
    { name: "Tondero Nacional", Icon: Icons.Trophy },
    { name: "Marinera Norteña", Icon: Icons.Dancer },
    { name: "Baile Tierra", Icon: Icons.Fire },
    { name: "Marinera Tradicional", Icon: Icons.Mask },
    { name: "Novel Nacional", Icon: Icons.Star },
    { name: "Individual Dama", Icon: Icons.Sparkles },
];

export default function CategoryCarousel() {
    // Triplicamos la lista para asegurar un scroll infinito fluido
    const items = [...categories, ...categories, ...categories];

    return (
        <div className="w-full bg-[#fdfdfd] border-y border-gray-100 py-3 overflow-hidden relative">
            {/* Gradientes laterales para efecto de desvanecimiento ultra suave */}
            <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#fdfdfd] to-transparent z-10 pointer-events-none"></div>
            <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#fdfdfd] to-transparent z-10 pointer-events-none"></div>

            {/* Contenedor de Movimiento - Más rápido y sin pausa en hover */}
            <div className="flex whitespace-nowrap animate-infinite-scroll">
                {items.map((cat, i) => (
                    <div
                        key={i}
                        className="flex items-center gap-2.5 mx-8 md:mx-10 opacity-30 cursor-default"
                    >
                        <span className="text-gray-400 shrink-0">
                            <cat.Icon />
                        </span>
                        <span className="text-[10px] md:text-[11px] font-heading font-bold uppercase tracking-[0.25em] text-gray-500 leading-none">
                            {cat.name}
                        </span>
                        <div className="w-1 h-1 bg-gray-300 rounded-full ml-4 opacity-50"></div>
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
                    animation: infinite-scroll 30s linear infinite;
                }
                `
            }} />
        </div>
    );
}
