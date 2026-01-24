import React, { useEffect, useState, useCallback } from 'react';
import { supabase } from "../../supabaseClient";
import InscripcionModal from "./InscripcionModal";
import Filters from "./Filters";
import Pagination from "./Pagination";
import * as XLSX from 'xlsx';

const DEFAULT_PER_PAGE = 10;

export default function Inscripciones() {
    const [inscripciones, setInscripciones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [exportLoading, setExportLoading] = useState(false);
    const [error, setError] = useState(null);
    const [modalities, setModalities] = useState([]);

    // Filter states
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("ALL");
    const [modality, setModality] = useState("ALL");

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(DEFAULT_PER_PAGE);
    const [totalItems, setTotalItems] = useState(0);

    // Modal state
    const [selectedInscripcion, setSelectedInscripcion] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchModalities = async () => {
        const { data } = await supabase.from('modalidad').select('id, nombre').eq('estado', 'A');
        setModalities(data || []);
    };

    const fetchInscripciones = useCallback(async () => {
        setLoading(true);
        try {
            const from = (currentPage - 1) * itemsPerPage;
            const to = from + itemsPerPage - 1;

            let query = supabase
                .from('inscripcion')
                .select(`
                    id,
                    estado,
                    fecha_registro,
                    modalidad (nombre),
                    detalle_inscripcion!inner (*)
                `, { count: 'exact' });

            // Filter by Status
            if (status !== "ALL") {
                query = query.eq('estado', status);
            }

            // Filter by Modality
            if (modality !== "ALL") {
                query = query.eq('id_modalidad', modality);
            }

            // Search in Details (Nombres, Apellidos, DNI, Telefono)
            if (search.trim()) {
                const s = `%${search.trim().toLowerCase()}%`;
                query = query.or(`nombres.ilike.${s},apellidos.ilike.${s},dni.ilike.${s},telefono.ilike.${s}`, { foreignTable: 'detalle_inscripcion' });
            }

            const { data, error, count } = await query
                .order('fecha_registro', { ascending: false })
                .range(from, to);

            if (error) throw error;
            setInscripciones(data || []);
            setTotalItems(count || 0);
        } catch (err) {
            console.error("Error fetching inscripciones:", err);
            setError("Error al cargar los datos.");
        } finally {
            setLoading(false);
        }
    }, [search, status, modality, currentPage, itemsPerPage]);

    useEffect(() => {
        fetchModalities();
    }, []);

    useEffect(() => {
        // Debounce search
        const timer = setTimeout(() => {
            fetchInscripciones();
        }, 300);
        return () => clearTimeout(timer);
    }, [fetchInscripciones]);

    // Reset page to 1 when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [search, status, modality]);

    const handleExportExcel = async () => {
        setExportLoading(true);
        try {
            let query = supabase
                .from('inscripcion')
                .select(`
                    id,
                    estado,
                    fecha_registro,
                    modalidad (nombre),
                    detalle_inscripcion!inner (*)
                `);

            if (status !== "ALL") query = query.eq('estado', status);
            if (modality !== "ALL") query = query.eq('id_modalidad', modality);
            if (search.trim()) {
                const s = `%${search.trim().toLowerCase()}%`;
                query = query.or(`nombres.ilike.${s},apellidos.ilike.${s},dni.ilike.${s},telefono.ilike.${s}`, { foreignTable: 'detalle_inscripcion' });
            }

            const { data, error } = await query.order('fecha_registro', { ascending: false });

            if (error) throw error;

            // Procesar datos para que sean filas planas de Excel
            const flatData = data.flatMap(ins =>
                ins.detalle_inscripcion.map(det => ({
                    "ID INSCRIPCIÓN": ins.id,
                    "FECHA REGISTRO": new Date(ins.fecha_registro).toLocaleString(),
                    "MODALIDAD": ins.modalidad?.nombre,
                    "NOMBRES": det.nombres,
                    "APELLIDOS": det.apellidos,
                    "DNI": det.dni,
                    "TELÉFONO": det.telefono,
                    "SEXO": det.sexo === 'F' ? 'MUJER' : 'HOMBRE',
                    "ESTADO": ins.estado?.trim() === 'A' ? 'APROBADO' :
                        ins.estado?.trim() === 'P' ? 'PENDIENTE' : 'INACTIVO'
                }))
            );

            const ws = XLSX.utils.json_to_sheet(flatData);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Inscripciones");
            XLSX.writeFile(wb, `Reporte_Inscripciones_${new Date().toISOString().split('T')[0]}.xlsx`);

        } catch (err) {
            console.error("Error exportando excel:", err);
            alert("Error al exportar los datos.");
        } finally {
            setExportLoading(false);
        }
    };

    const handleClearFilters = () => {
        setSearch("");
        setStatus("ALL");
        setModality("ALL");
        setCurrentPage(1);
    };

    const updateEstado = async (id, nuevoEstado) => {
        try {
            const { error } = await supabase
                .from('inscripcion')
                .update({ estado: nuevoEstado })
                .eq('id', id);

            if (error) throw error;

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
                        onClick={handleExportExcel}
                        disabled={exportLoading || loading || totalItems === 0}
                        className="px-6 py-2.5 bg-green-600 text-white text-[11px] font-bold uppercase tracking-widest hover:bg-green-700 transition-all rounded-sm font-body shadow-sm flex items-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed disabled:bg-green-500"
                    >
                        {exportLoading ? (
                            <div className="w-3 h-3 border-2 border-white/30 border-t-white animate-spin rounded-full"></div>
                        ) : (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        )}
                        Exportar Excel
                    </button>
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

            {/* Filtros */}
            <Filters
                search={search}
                setSearch={setSearch}
                status={status}
                setStatus={setStatus}
                modality={modality}
                setModality={setModality}
                modalities={modalities}
                onClear={handleClearFilters}
            />

            {/* Tabla Principal */}
            <div className="bg-white border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.03)] rounded-sm overflow-hidden relative min-h-[400px]">
                {/* Localized Loading Overlay */}
                {loading && (
                    <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] z-10 flex items-center justify-center animate-in fade-in duration-300">
                        <div className="flex flex-col items-center gap-4">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
                            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400">Actualizando...</span>
                        </div>
                    </div>
                )}

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
                                            {ins.detalle_inscripcion?.map((det, idx) => (
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
                            {!loading && inscripciones.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="px-8 py-20 text-center">
                                        <span className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em]">No se encontraron inscripciones con esos filtros</span>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Paginación */}
                <Pagination
                    currentPage={currentPage}
                    totalItems={totalItems}
                    itemsPerPage={itemsPerPage}
                    onPageChange={setCurrentPage}
                    onItemsPerPageChange={setItemsPerPage}
                />
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
