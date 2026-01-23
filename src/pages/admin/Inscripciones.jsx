import React, { useEffect, useState } from 'react';
import { supabase } from "../../supabaseClient";
import InscripcionModal from "./InscripcionModal";

export default function Inscripciones() {
    const [inscripciones, setInscripciones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Modal state
    const [selectedInscripcion, setSelectedInscripcion] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchInscripciones = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('inscripcion')
                .select(`
                    id,
                    estado,
                    fecha_registro,
                    modalidad (nombre),
                    detalle_inscripcion (*)
                `)
                .order('fecha_registro', { ascending: false });

            if (error) throw error;
            setInscripciones(data || []);
        } catch (err) {
            console.error("Error fetching inscripciones:", err);
            setError("Error al cargar los datos.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInscripciones();
    }, []);

    const updateEstado = async (id, nuevoEstado) => {
        try {
            // 1. Actualizar estado de negocio en la cabecera
            const { error } = await supabase
                .from('inscripcion')
                .update({ estado: nuevoEstado })
                .eq('id', id);

            if (error) throw error;

            // 2. Solo si inactivamos (I), marcamos los detalles como técnicos 'I'
            if (nuevoEstado === 'I') {
                await supabase
                    .from('detalle_inscripcion')
                    .update({ estado: 'I' })
                    .eq('inscripcion_id', id);
            }

            fetchInscripciones();
        } catch (err) {
            alert("Error al actualizar el estado: " + err.message);
        }
    };

    const handleViewDetail = (ins) => {
        setSelectedInscripcion(ins);
        setIsModalOpen(true);
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="flex flex-col items-center gap-4">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-600"></div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Sincronizando Base de Datos...</span>
            </div>
        </div>
    );

    return (
        <div className="max-w-[1400px] mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">

            {/* Header de la Sección */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-gray-100 pb-8">
                <div className="text-left">
                    <span className="text-xs font-bold text-orange-600 uppercase tracking-[0.2em] mb-2 block font-body">SISTEMA DE GESTIÓN</span>
                    <h2 className="font-heading text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight leading-none">
                        Registro de Inscripciones
                    </h2>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        onClick={fetchInscripciones}
                        className="px-6 py-2.5 bg-gray-900 text-white text-[11px] font-bold uppercase tracking-widest hover:bg-orange-600 transition-all rounded-sm font-body shadow-sm"
                    >
                        Actualizar Lista
                    </button>
                    <div className="h-4 w-px bg-gray-200 hidden md:block"></div>
                    <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest font-body">
                        {inscripciones.length} Unidades registradas
                    </span>
                </div>
            </div>

            {/* Tabla Principal */}
            <div className="bg-white border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.03)] rounded-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50/50 border-b border-gray-100 font-body">
                            <tr>
                                <th className="px-8 py-5 text-[11px] font-bold text-gray-400 uppercase tracking-widest">ID / Registro</th>
                                <th className="px-8 py-5 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Participantes</th>
                                <th className="px-8 py-5 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Modalidad</th>
                                <th className="px-8 py-5 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Estatus</th>
                                <th className="px-8 py-5 text-[11px] font-bold text-gray-400 uppercase tracking-widest text-center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {inscripciones.map((ins) => (
                                <tr key={ins.id} className="group hover:bg-orange-50/20 transition-all duration-300">
                                    <td className="px-8 py-6">
                                        <div className="flex flex-col font-body">
                                            <span className="text-sm font-bold text-gray-900 leading-none mb-1.5">#{ins.id}</span>
                                            <span className="text-[11px] text-gray-400 font-semibold uppercase tracking-tight">
                                                {new Date(ins.fecha_registro).toLocaleDateString('es-PE')}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex flex-col gap-1.5 font-body">
                                            {ins.detalle_inscripcion.map((det, idx) => (
                                                <span key={idx} className="text-[13px] font-bold text-gray-800 tracking-tight">
                                                    {det.nombres} {det.apellidos}
                                                </span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="text-[11px] font-bold text-gray-600 uppercase tracking-wider bg-gray-100 px-3 py-1.5 rounded-sm font-body border border-gray-200/50">
                                            {ins.modalidad?.nombre || 'General'}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-left">
                                        <div className="flex items-center gap-3 font-body">
                                            <span className={`px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest border rounded-sm
                                                ${ins.estado === 'A' ? 'bg-green-50 text-green-700 border-green-200' :
                                                    ins.estado === 'P' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                                                        'bg-red-50 text-red-700 border-red-200'}`}>
                                                {ins.estado === 'A' ? 'Aprobado' :
                                                    ins.estado === 'P' ? 'Pendiente' :
                                                        'Inactivo'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center justify-center gap-2">
                                            {/* OJO: Ver Detalle */}
                                            <button
                                                onClick={() => handleViewDetail(ins)}
                                                className="p-2 hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-all rounded-sm group/btn"
                                                title="Ver Detalle Completo"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                            </button>

                                            <div className="h-4 w-px bg-gray-100 mx-1"></div>

                                            <button
                                                onClick={() => updateEstado(ins.id, 'A')}
                                                disabled={ins.estado === 'A'}
                                                className="p-2 hover:bg-green-50 text-gray-400 hover:text-green-600 transition-all rounded-sm disabled:opacity-20 disabled:cursor-not-allowed group/btn"
                                                title="Aprobar"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={() => updateEstado(ins.id, 'P')}
                                                disabled={ins.estado === 'P'}
                                                className="p-2 hover:bg-yellow-50 text-gray-400 hover:text-yellow-600 transition-all rounded-sm disabled:opacity-20 disabled:cursor-not-allowed"
                                                title="Pendiente"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={() => updateEstado(ins.id, 'I')}
                                                disabled={ins.estado === 'I'}
                                                className="p-2 hover:bg-red-50 text-gray-400 hover:text-red-600 transition-all rounded-sm disabled:opacity-20 disabled:cursor-not-allowed"
                                                title="Desactivar"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636" />
                                                </svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {inscripciones.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="px-8 py-20 text-center">
                                        <span className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em]">No hay inscripciones registradas</span>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal de Detalle */}
            <InscripcionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                inscripcion={selectedInscripcion}
            />

            {/* Footer Técnico */}
            <div className="flex justify-between items-center text-[10px] text-gray-300 font-bold uppercase tracking-widest italic pt-10">
                <span>Golpe Tierra v1.0.4 - Sistema Operativo</span>
            </div>
        </div>
    );
}
