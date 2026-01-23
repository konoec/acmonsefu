import React from 'react';

const categories = [
    "TONDERO",
    "MARINERA TRADICIONAL",
    "MARINERA NORTEÑA",
    "BAILE TIERRA",
    "MARINERA DE MOCHE",
    "GOLPE TIERRA 2026",
];

export default function RunningStamp() {
    const repeatedCategories = [...categories, ...categories, ...categories];

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 select-none opacity-[0.05]">
            {/* Diagonally oriented marquee strips */}
            <div className="absolute top-0 left-0 w-[400%] md:w-[200%] h-[400%] flex flex-col justify-around -rotate-12 -translate-x-1/4 -translate-y-1/4">

                {/* Strip 1: Moving Right */}
                <div className="flex whitespace-nowrap animate-marquee">
                    {repeatedCategories.map((cat, i) => (
                        <span key={`s1-${i}`} className="text-[60px] md:text-[120px] font-black mr-12 md:mr-24 tracking-tighter uppercase">
                            {cat}
                        </span>
                    ))}
                </div>

                {/* Strip 2: Moving Left */}
                <div className="flex whitespace-nowrap animate-marquee-reverse translate-x-[-20%]">
                    {repeatedCategories.map((cat, i) => (
                        <span key={`s2-${i}`} className="text-[60px] md:text-[120px] font-black mr-12 md:mr-24 tracking-tighter uppercase">
                            {cat}
                        </span>
                    ))}
                </div>

                {/* Strip 3: Moving Right */}
                <div className="flex whitespace-nowrap animate-marquee translate-x-[-10%]">
                    {repeatedCategories.map((cat, i) => (
                        <span key={`s3-${i}`} className="text-[60px] md:text-[120px] font-black mr-12 md:mr-24 tracking-tighter uppercase">
                            {cat}
                        </span>
                    ))}
                </div>

                {/* Strip 4: Moving Left */}
                <div className="flex whitespace-nowrap animate-marquee-reverse translate-x-[-30%]">
                    {repeatedCategories.map((cat, i) => (
                        <span key={`s4-${i}`} className="text-[60px] md:text-[120px] font-black mr-12 md:mr-24 tracking-tighter uppercase">
                            {cat}
                        </span>
                    ))}
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.33%); }
        }
        @keyframes marquee-reverse {
          0% { transform: translateX(-33.33%); }
          100% { transform: translateX(0); }
        }
        .animate-marquee {
          animation: marquee 60s linear infinite;
        }
        .animate-marquee-reverse {
          animation: marquee-reverse 60s linear infinite;
        }
      `}} />
        </div>
    );
}
