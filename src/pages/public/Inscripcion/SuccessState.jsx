import React, { useEffect, useRef } from "react";

export default function SuccessState({ lastInscripcionData, onReset }) {
    const hasAutoDownloaded = useRef(false);

    useEffect(() => {
        if (lastInscripcionData && !hasAutoDownloaded.current) {
            const autoDownload = async () => {
                const { generateInscripcionPDF } = await import("../../../utils/pdfGenerator");
                generateInscripcionPDF(lastInscripcionData);
                hasAutoDownloaded.current = true;
            };
            autoDownload();
        }
    }, [lastInscripcionData]);

    return (
        <div className="text-center py-20 flex flex-col items-center justify-center h-full space-y-8">
            <div className="w-24 h-24 bg-orange-50 rounded-sm flex items-center justify-center text-orange-600 shadow-sm border border-orange-100 rotate-3">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path>
                </svg>
            </div>
            <div className="space-y-3">
                <h3 className="text-4xl font-heading font-extrabold text-gray-900 tracking-tight italic">¡Todo listo!</h3>
                <p className="text-gray-500 max-w-md mx-auto leading-relaxed font-body">
                    Tu inscripción ha sido recibida correctamente. La descarga de tu ficha comenzará automáticamente.
                </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button
                    onClick={async () => {
                        const { generateInscripcionPDF } = await import("../../../utils/pdfGenerator");
                        generateInscripcionPDF(lastInscripcionData);
                    }}
                    className="px-10 py-4 bg-gray-900 text-white font-bold text-[10px] uppercase tracking-[0.2em] rounded-sm hover:bg-orange-600 shadow-xl font-heading flex items-center gap-3"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                    </svg>
                    Volver a descargar (PDF)
                </button>
                <button
                    onClick={onReset}
                    className="px-10 py-4 bg-white text-gray-900 font-bold text-[10px] uppercase tracking-[0.2em] rounded-sm hover:bg-gray-50 border border-gray-200 font-heading"
                >
                    Inscribir a otro
                </button>
            </div>
        </div>
    );
}
