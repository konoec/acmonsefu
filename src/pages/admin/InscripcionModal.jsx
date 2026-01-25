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
                <div className="flex-grow overflow-y-auto p-5 lg:p-6 space-y-6 font-body">

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 border-b border-gray-100 pb-4 text-left">
                        <div>
                            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Modalidad</span>
                            <p className="text-sm font-bold text-gray-900 leading-tight">
                                {inscripcion.modalidad?.nombre || 'General'}
                            </p>
                        </div>
                        <div>
                            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Categoría</span>
                            <p className="text-sm font-bold text-orange-600 leading-tight uppercase">
                                {inscripcion.categoria?.nombre || 'N/A'}
                            </p>
                        </div>
                        <div>
                            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Academia</span>
                            <p className="text-sm font-bold text-gray-900 leading-tight">
                                {inscripcion.academia || '---'}
                            </p>
                        </div>
                        <div>
                            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Estado</span>
                            <span className={`inline-block px-2 py-1 text-[9px] font-bold uppercase tracking-widest border rounded-sm
                                ${inscripcion.estado === 'A' ? 'bg-green-50 text-green-700 border-green-200' :
                                    inscripcion.estado === 'P' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                                        'bg-red-50 text-red-700 border-red-200'}`}>
                                {inscripcion.estado === 'A' ? 'Aprobado' :
                                    inscripcion.estado === 'P' ? 'Pendiente' :
                                        'Inactivo'}
                            </span>
                        </div>
                    </div>

                    <div className="text-left border-b border-gray-100 pb-4">
                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Fecha de Registro</span>
                        <p className="text-sm font-bold text-gray-900">
                            {new Date(inscripcion.fecha_registro).toLocaleDateString('es-PE', {
                                year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                            })}
                        </p>
                    </div>

                    {/* Sección: Participantes */}
                    <div className="text-left">
                        <span className="text-[10px] font-bold text-orange-600 uppercase tracking-[0.2em] block mb-3">
                            PARTICIPANTES
                        </span>

                        {loadingExtra ? (
                            <div className="flex items-center gap-2 py-2">
                                <div className="animate-spin h-3 w-3 border-b-2 border-orange-600 rounded-full"></div>
                                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Sincronizando...</span>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {participantes.length > 0 ? participantes.map((p, idx) => (
                                    <div key={idx} className="bg-gray-50 p-4 rounded-sm border-l-4 border-gray-900">
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-6 items-start">
                                            <div className="space-y-0.5">
                                                <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest block">Nombres y Apellidos</span>
                                                <p className="text-[11px] font-bold text-gray-900 tracking-tight uppercase">{p.nombres} {p.apellidos}</p>
                                            </div>
                                            <div className="space-y-0.5">
                                                <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest block">DNI</span>
                                                <p className="text-[11px] font-semibold text-gray-700 tracking-tight">{p.dni}</p>
                                            </div>
                                            <div className="space-y-0.5">
                                                <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest block">F. Nacimiento</span>
                                                <p className="text-[11px] font-semibold text-gray-700 tracking-tight">
                                                    {p.fecha_nacimiento ? new Date(p.fecha_nacimiento).toLocaleDateString('es-PE') : '---'}
                                                </p>
                                            </div>
                                            <div className="space-y-0.5">
                                                <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest block">Teléfono</span>
                                                <p className="text-[11px] font-semibold text-gray-700 tracking-tight">{p.telefono || '---'}</p>
                                            </div>
                                            <div className="space-y-0.5">
                                                <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest block">Sexo</span>
                                                <p className="text-[11px] font-semibold text-gray-700 uppercase tracking-tight">{p.sexo === 'M' ? 'VARÓN' : 'DAMA'}</p>
                                            </div>
                                        </div>
                                    </div>
                                )) : (
                                    <p className="text-[9px] font-bold text-gray-400 uppercase italic">No se encontraron datos.</p>
                                )}
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
}

