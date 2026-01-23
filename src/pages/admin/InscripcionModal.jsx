import React, { useState, useEffect } from 'react';
import { supabase } from "../../supabaseClient";

export default function InscripcionModal({ isOpen, onClose, inscripcion }) {
    const [extraDetails, setExtraDetails] = useState([]);
    const [loadingExtra, setLoadingExtra] = useState(false);

    useEffect(() => {
        // Si el modal se abre y no tenemos los detalles, los buscamos manualmente
        if (isOpen && inscripcion && (!inscripcion.detalle_inscripcion || inscripcion.detalle_inscripcion.length === 0)) {
            fetchMissingDetails();
        } else if (inscripcion?.detalle_inscripcion) {
            setExtraDetails(inscripcion.detalle_inscripcion);
        }
    }, [isOpen, inscripcion]);

    const fetchMissingDetails = async () => {
        setLoadingExtra(true);
        try {
            const { data, error } = await supabase
                .from('detalle_inscripcion')
                .select('*')
                .eq('inscripcion_id', inscripcion.id);

            if (error) throw error;
            setExtraDetails(data || []);
        } catch (err) {
            console.error("Error al recuperar detalles faltantes:", err);
        } finally {
            setLoadingExtra(false);
        }
    };

    if (!isOpen || !inscripcion) return null;

    const participantes = extraDetails.length > 0 ? extraDetails : (inscripcion.detalle_inscripcion || []);

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 lg:p-10 animate-in fade-in duration-300">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div className="relative w-full max-w-2xl bg-white shadow-2xl rounded-sm overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">

                {/* Header */}
                <div className="bg-gray-900 text-white p-6 lg:p-8 flex justify-between items-center relative">
                    <div className="absolute top-0 left-0 w-1 h-full bg-orange-600"></div>
                    <div className="text-left">
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-orange-500 mb-1 block italic">Expediente Digital</span>
                        <h3 className="text-2xl font-heading font-black tracking-tight italic uppercase leading-none">
                            Inscripción #{inscripcion.id}
                        </h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 transition-colors rounded-sm"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Body */}
                <div className="flex-grow overflow-y-auto p-6 lg:p-10 space-y-10 font-body">

                    {/* Sección: Modalidad */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-b border-gray-100 pb-8 text-left">
                        <div>
                            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Categoría / Modalidad</span>
                            <p className="text-lg font-bold text-gray-900 leading-tight">
                                {inscripcion.modalidad?.nombre || 'General'}
                            </p>
                        </div>
                        <div>
                            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Fecha de Registro</span>
                            <p className="text-lg font-bold text-gray-900">
                                {new Date(inscripcion.fecha_registro).toLocaleDateString('es-PE', {
                                    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
                                })}
                            </p>
                        </div>
                    </div>

                    {/* Sección: Participantes */}
                    <div className="text-left">
                        <span className="text-xs font-bold text-orange-600 uppercase tracking-[0.2em] block mb-6">
                            CUERPO DE PARTICIPANTES
                        </span>

                        {loadingExtra ? (
                            <div className="flex items-center gap-3 py-4">
                                <div className="animate-spin h-4 w-4 border-b-2 border-orange-600 rounded-full"></div>
                                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Sincronizando detalles...</span>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {participantes.length > 0 ? participantes.map((p, idx) => (
                                    <div key={idx} className="bg-gray-50 p-6 rounded-sm border-l-4 border-gray-900 relative">
                                        <div className="absolute top-4 right-6">
                                            <span className="text-[32px] font-bold text-gray-200/50 leading-none select-none">0{idx + 1}</span>
                                        </div>
                                        <h4 className="text-xl font-bold text-gray-900 mb-6">
                                            {p.nombres} {p.apellidos}
                                        </h4>

                                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-8">
                                            <div>
                                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">DNI / Documento</span>
                                                <p className="text-sm font-semibold text-gray-800 tracking-tight">{p.dni}</p>
                                            </div>
                                            <div>
                                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Teléfono</span>
                                                <p className="text-sm font-semibold text-gray-800 tracking-tight">{p.telefono || '---'}</p>
                                            </div>
                                            <div>
                                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Sexo</span>
                                                <p className="text-sm font-semibold text-gray-800 uppercase tracking-tight">{p.sexo === 'M' ? 'Masculino' : 'Femenino'}</p>
                                            </div>
                                        </div>
                                    </div>
                                )) : (
                                    <p className="text-[11px] font-bold text-gray-400 uppercase italic">No se encontraron datos de participantes.</p>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Sección: Estado */}
                    <div className="pt-4 text-left">
                        <div className="flex items-center gap-6 p-5 border border-gray-200 rounded-sm bg-gray-50/30">
                            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">ESTADO ACTUAL:</span>
                            <span className={`px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest border rounded-sm
                                ${inscripcion.estado === 'A' ? 'bg-green-50 text-green-700 border-green-200' :
                                    inscripcion.estado === 'P' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                                        'bg-red-50 text-red-700 border-red-200'}`}>
                                {inscripcion.estado === 'A' ? 'Aprobado y Vigente' :
                                    inscripcion.estado === 'P' ? 'Trámite Pendiente' :
                                        'Inactivo'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

