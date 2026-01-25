import React, { useState } from 'react';
import { supabase } from "../../supabaseClient";
import { generateInscripcionPDF } from "../../utils/pdfGenerator";

/* ===============================
   IMPORTACIÓN DE IMÁGENES - GALERÍA BENTO
   Para agregar/quitar imágenes, solo modifica este array
================================ */
import galeria1 from "../../assets/images/galeria/ganadores1.webp";
import galeria2 from "../../assets/images/galeria/ganadores2.webp";
import galeria3 from "../../assets/images/galeria/ganadores3.webp";
import galeria4 from "../../assets/images/galeria/ganadores4.webp";
import galeria5 from "../../assets/images/galeria/ganadores5.webp";
import galeria6 from "../../assets/images/galeria/ganadores6.webp";
import galeria7 from "../../assets/images/galeria/ganadores7.webp";
import galeria8 from "../../assets/images/galeria/ganadores8.webp";
import galeria9 from "../../assets/images/galeria/ganadores9.webp";
import galeria10 from "../../assets/images/galeria/ganadores10.webp";
import galeria11 from "../../assets/images/galeria/ganadores11.webp";
import galeria12 from "../../assets/images/galeria/ganadores12.webp";
import galeria13 from "../../assets/images/galeria/ganadores13.webp";
import galeria14 from "../../assets/images/galeria/ganadores14.webp";
import galeria15 from "../../assets/images/galeria/ganadores15.webp";
import galeria16 from "../../assets/images/galeria/ganadores16.webp";
import galeria17 from "../../assets/images/galeria/ganadores17.webp";
import galeria18 from "../../assets/images/galeria/ganadores18.webp";
import galeria19 from "../../assets/images/galeria/ganadores19.webp";
import galeria20 from "../../assets/images/galeria/ganadores20.webp";
import galeria21 from "../../assets/images/galeria/ganadores21.webp";
import galeria22 from "../../assets/images/galeria/ganadores22.webp";
import galeria23 from "../../assets/images/galeria/ganadores23.webp";
import galeria24 from "../../assets/images/galeria/ganadores24.webp";

const GALERIA_IMAGES = [
    galeria1, galeria2, galeria3, galeria4, galeria5, galeria6,
    galeria7, galeria8, galeria9, galeria10, galeria11, galeria12, galeria13, galeria14, galeria15, galeria16, galeria17, galeria18, galeria19, galeria20,
    galeria21, galeria22, galeria23, galeria24
];

/* ===============================
   COMPONENTE DE GALERÍA BENTO ANIMADA
================================ */
const BentoGalleryBackground = () => {
    // Dividir imágenes en 3 filas para efecto bento
    const row1 = GALERIA_IMAGES.slice(0, 4);
    const row2 = GALERIA_IMAGES.slice(4, 8);
    const row3 = GALERIA_IMAGES.slice(8, 14);

    // Duplicar para crear efecto infinito
    const infiniteRow1 = [...row1, ...row1, ...row1];
    const infiniteRow2 = [...row2, ...row2, ...row2];
    const infiniteRow3 = [...row3, ...row3, ...row3];

    return (
        <div className="absolute inset-0 overflow-hidden opacity-[0.12] pointer-events-none">
            {/* Fila 1 - Movimiento a la derecha */}
            <div className="flex gap-3 mb-3 animate-scroll-right" style={{ width: 'max-content' }}>
                {infiniteRow1.map((img, i) => (
                    <div
                        key={`row1-${i}`}
                        className={`shrink-0 rounded-lg overflow-hidden ${i % 3 === 0 ? 'w-48 h-32' : i % 3 === 1 ? 'w-64 h-32' : 'w-40 h-32'}`}
                    >
                        <img src={img} alt="" className="w-full h-full object-cover grayscale" />
                    </div>
                ))}
            </div>

            {/* Fila 2 - Movimiento a la izquierda */}
            <div className="flex gap-3 mb-3 animate-scroll-left" style={{ width: 'max-content' }}>
                {infiniteRow2.map((img, i) => (
                    <div
                        key={`row2-${i}`}
                        className={`shrink-0 rounded-lg overflow-hidden ${i % 3 === 0 ? 'w-56 h-40' : i % 3 === 1 ? 'w-44 h-40' : 'w-72 h-40'}`}
                    >
                        <img src={img} alt="" className="w-full h-full object-cover grayscale" />
                    </div>
                ))}
            </div>

            {/* Fila 3 - Movimiento a la derecha */}
            <div className="flex gap-3 mb-3 animate-scroll-right-slow" style={{ width: 'max-content' }}>
                {infiniteRow3.map((img, i) => (
                    <div
                        key={`row3-${i}`}
                        className={`shrink-0 rounded-lg overflow-hidden ${i % 3 === 0 ? 'w-40 h-36' : i % 3 === 1 ? 'w-60 h-36' : 'w-52 h-36'}`}
                    >
                        <img src={img} alt="" className="w-full h-full object-cover grayscale" />
                    </div>
                ))}
            </div>

            {/* Overlay degradado para suavizar bordes */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#FDFBF7] via-transparent to-[#FDFBF7]"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-[#FDFBF7] via-transparent to-[#FDFBF7]"></div>
        </div>
    );
};

export default function ConsultaInscripcion() {
    const [dni, setDni] = useState("");
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(false);
    const [downloadingId, setDownloadingId] = useState(null);
    const [searched, setSearched] = useState(false);

    const handleSearch = async (e) => {
        if (e) e.preventDefault();
        if (dni.length !== 8) return;

        setLoading(true);
        setSearched(true);
        try {
            const { data, error } = await supabase
                .from('detalle_inscripcion')
                .select(`
                    id,
                    nombres,
                    apellidos,
                    dni,
                    estado,
                    inscripcion (
                        id,
                        estado,
                        fecha_registro,
                        modalidad (nombre)
                    )
                `)
                .eq('dni', dni)
                .neq('estado', 'I');

            if (error) throw error;
            setResults(data || []);
        } catch (err) {
            console.error("Error buscando inscripcion:", err);
            setResults([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadPDF = async (inscripcionId) => {
        setDownloadingId(inscripcionId);
        try {
            const { data, error } = await supabase
                .from('inscripcion')
                .select(`
                    id,
                    fecha_registro,
                    modalidad (nombre),
                    detalle_inscripcion (*)
                `)
                .eq('id', inscripcionId)
                .single();

            if (error) throw error;

            // Formatear datos para el generador
            const pdfData = {
                id: data.id,
                fecha_registro: data.fecha_registro,
                modalidad: data.modalidad?.nombre,
                participantes: data.detalle_inscripcion.map(d => ({
                    nombres: d.nombres,
                    apellidos: d.apellidos,
                    dni: d.dni,
                    telefono: d.telefono,
                    sexo: d.sexo
                }))
            };

            await generateInscripcionPDF(pdfData);
        } catch (err) {
            console.error("Error al descargar PDF:", err);
            alert("No se pudo generar el PDF por un error de conexión.");
        } finally {
            setDownloadingId(null);
        }
    };

    return (
        <div id="consulta" className="relative min-h-screen flex flex-col items-center justify-center pt-20 pb-20 p-4 md:p-8 animate-in fade-in duration-700 bg-[#FDFBF7] overflow-hidden">
            {/* Fondo de Galería Bento Animada */}
            <BentoGalleryBackground />

            <div className="relative z-10 w-full max-w-4xl space-y-12">

                {/* Header */}
                <div className="text-center space-y-4">
                    <h1 className="font-heading text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">
                        Consulta tu <span className="text-orange-600">Inscripción</span>
                    </h1>
                    <p className="text-gray-500 font-body text-sm md:text-base max-w-xl mx-auto">
                        Ingresa tu número de DNI para verificar el estado de tus participaciones en el Festival Golpe Tierra 2026.
                    </p>
                </div>

                {/* Search Box */}
                <div className="bg-white border border-gray-100 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.08)] rounded-sm p-8 md:p-12 relative overflow-hidden">
                    {/* Background Accent */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 rounded-bl-full opacity-50 -mr-16 -mt-16"></div>

                    <form onSubmit={handleSearch} className="relative z-10 flex flex-col md:flex-row gap-4 items-end">
                        <div className="grow space-y-2 w-full">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] font-heading ml-1">
                                Documento Nacional de Identidad
                            </label>
                            <input
                                type="text"
                                maxLength={8}
                                value={dni}
                                onChange={(e) => setDni(e.target.value.replace(/\D/g, ''))}
                                placeholder="Escribe tu DNI"
                                className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-sm text-lg font-body focus:bg-white focus:border-orange-500 outline-none transition-all placeholder:text-gray-300"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading || dni.length !== 8}
                            className="w-full md:w-auto px-10 py-4 bg-gray-900 text-white font-bold uppercase tracking-widest hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all rounded-sm font-heading shadow-lg shadow-gray-200"
                        >
                            {loading ? 'Buscando...' : 'Consultar'}
                        </button>
                    </form>
                </div>

                {/* Results Section */}
                <div className="space-y-6 min-h-[200px]">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-12 gap-4">
                            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-600"></div>
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Consultando registros...</span>
                        </div>
                    ) : searched ? (
                        results.length > 0 ? (
                            <div className="grid grid-cols-1 gap-4 animate-in slide-in-from-bottom-4 duration-500">
                                {results.map((res) => (
                                    <div key={res.id} className="bg-white border border-gray-100 p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 rounded-sm shadow-sm hover:shadow-md transition-shadow group">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-3">
                                                <span className="text-[10px] font-bold text-orange-600 uppercase tracking-widest">#{res.inscripcion?.id}</span>
                                                <div className="h-1 w-1 rounded-full bg-gray-200"></div>
                                                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{res.inscripcion?.modalidad?.nombre}</span>
                                            </div>
                                            <h3 className="text-xl font-bold text-gray-900 uppercase tracking-tight font-heading">
                                                {res.nombres} {res.apellidos}
                                            </h3>
                                            <p className="text-[11px] text-gray-400 font-medium italic">
                                                Registrado el {new Date(res.inscripcion?.fecha_registro).toLocaleDateString()}
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <div className="text-right hidden md:block">
                                                <span className="text-[9px] font-bold text-gray-300 uppercase tracking-widest block mb-1">Estatus actual</span>
                                                <span className={`px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest border rounded-sm
                                                    ${res.inscripcion?.estado?.trim() === 'A' ? 'bg-green-50 text-green-700 border-green-200' :
                                                        res.inscripcion?.estado?.trim() === 'P' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                                                            'bg-red-50 text-red-700 border-red-200'}`}>
                                                    {res.inscripcion?.estado?.trim() === 'A' ? 'Inscripción Aprobada' :
                                                        res.inscripcion?.estado?.trim() === 'P' ? 'Pendiente de Revisión' :
                                                            'Inscripción Inactiva'}
                                                </span>
                                            </div>

                                            {/* Botón Descargar PDF */}
                                            <button
                                                onClick={() => handleDownloadPDF(res.inscripcion?.id)}
                                                disabled={downloadingId === res.inscripcion?.id}
                                                className="p-3 bg-gray-50 hover:bg-orange-600 text-gray-400 hover:text-white border border-gray-100 hover:border-orange-600 transition-all rounded-sm flex items-center justify-center group/pdf shadow-sm"
                                                title="Descargar Ficha PDF"
                                            >
                                                {downloadingId === res.inscripcion?.id ? (
                                                    <div className="w-5 h-5 border-2 border-gray-300 border-t-orange-600 animate-spin rounded-full"></div>
                                                ) : (
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13l3 3m0 0l3-3m-3 3V8" />
                                                    </svg>
                                                )}
                                            </button>

                                            {/* Mobile Status Marker */}
                                            <div className={`w-1.5 h-12 rounded-full md:hidden ${res.inscripcion?.estado?.trim() === 'A' ? 'bg-green-500' :
                                                res.inscripcion?.estado?.trim() === 'P' ? 'bg-yellow-500' : 'bg-red-500'
                                                }`}></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-gray-50/50 border border-dashed border-gray-200 rounded-sm py-16 text-center animate-in fade-in duration-500">
                                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                                    <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 9.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h4 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-2">No se encontraron registros</h4>
                                <p className="text-xs text-gray-400 max-w-xs mx-auto">
                                    Verifica que el número de DNI sea el correcto o que hayas completado tu registro.
                                </p>
                            </div>
                        )
                    ) : (
                        <div className="flex items-center justify-center h-full opacity-30 select-none pointer-events-none">
                            <span className="text-[120px] font-black text-gray-100 uppercase tracking-tighter">GOLPE TIERRA</span>
                        </div>
                    )}
                </div>

                {/* Footer Info */}
                <div className="pt-10 border-t border-gray-100 text-center">
                    <p className="text-[10px] font-bold text-gray-300 uppercase tracking-[0.3em]">
                        FESTIVAL GOLPE TIERRA 2026
                    </p>
                </div>

            </div>
        </div>
    );
}
