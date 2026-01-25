import React, { useEffect, useState, useCallback } from 'react';
import { supabase } from "../../supabaseClient";
import InscripcionModal from "./InscripcionModal";
import EditInscripcionModal from "./EditInscripcionModal";
import Filters from "./Filters";
import Pagination from "./Pagination";
import Toast from "../../components/Toast";

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
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingInscripcion, setEditingInscripcion] = useState(null);

    // Toast state
    const [toast, setToast] = useState(null);

    const showToast = (message, type = 'error') => {
        setToast({ message, type });
    };

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
                    academia,
                    id_modalidad,
                    categoria_id,
                    modalidad (nombre),
                    categoria (nombre),
                    detalle_inscripcion!inner (*, tipo_participacion (nombre))
                `, { count: 'exact' });

            // Filter by Status
            if (status !== "ALL") {
                query = query.eq('estado', status);
            }

            // Filter by Modality
            if (modality !== "ALL") {
                query = query.eq('id_modalidad', modality);
            }

            // Search in Details (Nombres, Apellidos, DNI, Telefono) or Academy
            if (search.trim()) {
                const s = `%${search.trim().toLowerCase()}%`;
                query = query.or(`academia.ilike.${s},detalle_inscripcion.nombres.ilike.${s},detalle_inscripcion.apellidos.ilike.${s},detalle_inscripcion.dni.ilike.${s},detalle_inscripcion.telefono.ilike.${s}`);
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
                    academia,
                    id_modalidad,
                    modalidad (nombre),
                    categoria (nombre),
                    detalle_inscripcion!inner (*, tipo_participacion (nombre))
                `);

            if (status !== "ALL") query = query.eq('estado', status);
            if (modality !== "ALL") query = query.eq('id_modalidad', modality);

            if (search.trim()) {
                const s = `%${search.trim().toLowerCase()}%`;
                query = query.or(`academia.ilike.${s},detalle_inscripcion.nombres.ilike.${s},detalle_inscripcion.apellidos.ilike.${s},detalle_inscripcion.dni.ilike.${s},detalle_inscripcion.telefono.ilike.${s}`);
            }

            const { data, error } = await query.order('fecha_registro', { ascending: false });

            if (error) throw error;

            // Cargar XLSX dinámicamente
            const XLSX = await import('xlsx');

            // Procesar datos para que sean filas planas de Excel
            const flatData = data.flatMap(ins =>
                ins.detalle_inscripcion.map(det => ({
                    "ID INSCRIPCIÓN": ins.id,
                    "FECHA REGISTRO": new Date(ins.fecha_registro).toLocaleString(),
                    "MODALIDAD": ins.modalidad?.nombre,
                    "CATEGORÍA": ins.categoria?.nombre,
                    "TIPO PARTICIPACIÓN": det.tipo_participacion?.nombre,
                    "ACADEMIA": ins.academia,
                    "NOMBRES": det.nombres,
                    "APELLIDOS": det.apellidos,
                    "DNI": det.dni,
                    "FECHA NACIMIENTO": det.fecha_nacimiento ? new Date(det.fecha_nacimiento).toLocaleDateString('es-PE') : 'N/A',
                    "TELÉFONO": det.telefono,
                    "SEXO": det.sexo === 'F' ? 'DAMA' : 'VARÓN',
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
            showToast("Error al exportar los datos.");
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
            // Si intentamos activar (Aprobado o Pendiente), validar duplicados en frontend
            if (nuevoEstado === 'A' || nuevoEstado === 'P') {
                const currentIns = inscripciones.find(i => i.id === id);
                if (currentIns) {
                    const dnis = currentIns.detalle_inscripcion.map(d => d.dni);
                    const modalityId = currentIns.id_modalidad || (modalities.find(m => m.nombre === currentIns.modalidad?.nombre)?.id);

                    // Buscar si alguno de estos DNIs ya tiene otra inscripción ACTIVA/PENDIENTE en la misma modalidad
                    const finalModalityId = currentIns.id_modalidad || (modalities.find(m => m.nombre === currentIns.modalidad?.nombre)?.id);

                    if (!finalModalityId) {
                        console.warn("No se pudo determinar el ID de la modalidad.");
                    }

                    const { data: duplicates, error: checkError } = await supabase
                        .from('detalle_inscripcion')
                        .select('inscripcion_id, dni, inscripcion!inner(id, id_modalidad, estado)')
                        .in('dni', dnis)
                        .eq('inscripcion.id_modalidad', finalModalityId)
                        .in('inscripcion.estado', ['A', 'P'])
                        .neq('inscripcion_id', id);

                    if (checkError) throw checkError;

                    if (duplicates && duplicates.length > 0) {
                        const duplicateDni = duplicates[0].dni;
                        showToast(`ERROR DE DUPLICIDAD: El participante con DNI ${duplicateDni} ya tiene otra inscripción ACTIVA o PENDIENTE en esta misma modalidad (#${duplicates[0].inscripcion_id}). Debes desactivar la otra primero.`);
                        return;
                    }
                }
            }

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
            } else {
                // Al activar la inscripción, también activamos sus detalles
                await supabase
                    .from('detalle_inscripcion')
                    .update({ estado: 'A' })
                    .eq('inscripcion_id', id);
            }

            fetchInscripciones();
            showToast("Estado actualizado correctamente", "success");
        } catch (err) {
            showToast("Error al actualizar el estado: " + err.message);
        }
    };

    const handleViewDetail = (ins) => {
        setSelectedInscripcion(ins);
        setIsModalOpen(true);
    };

    const handleEdit = (ins) => {
        setEditingInscripcion(ins);
        setIsEditModalOpen(true);
    };

    return (
        <div className="max-w-[1400px] mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">

            {/* Header de la Sección */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-gray-100 pb-8 px-2 md:px-0">
                <div className="text-left space-y-2">
                    <span className="text-[10px] font-bold text-orange-600 uppercase tracking-[0.3em] block font-body opacity-80">SISTEMA DE GESTIÓN</span>
                    <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight">
                        Registro de Inscripciones
                    </h2>
                </div>
                <div className="flex flex-wrap items-center gap-3 md:gap-4">
                    <button
                        onClick={handleExportExcel}
                        disabled={exportLoading || loading || totalItems === 0}
                        className="flex-1 md:flex-none px-5 md:px-6 py-3 bg-green-600 text-white text-[10px] md:text-[11px] font-black uppercase tracking-widest hover:bg-green-700 transition-all rounded-sm font-body shadow-sm flex items-center justify-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed disabled:bg-green-500"
                    >
                        {exportLoading ? (
                            <div className="w-3 h-3 border-2 border-white/30 border-t-white animate-spin rounded-full"></div>
                        ) : (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        )}
                        <span className="hidden xs:inline">Exportar Excel</span>
                        <span className="xs:hidden">Excel</span>
                    </button>
                    <button
                        onClick={fetchInscripciones}
                        className="flex-1 md:flex-none px-5 md:px-6 py-3 bg-gray-900 text-white text-[10px] md:text-[11px] font-black uppercase tracking-widest hover:bg-orange-600 transition-all rounded-sm font-body shadow-sm flex items-center justify-center gap-2"
                    >
                        <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        <span className="hidden xs:inline">Actualizar Lista</span>
                        <span className="xs:hidden">Actualizar</span>
                    </button>
                    <div className="hidden lg:block h-6 w-px bg-gray-200"></div>
                    <div className="w-full lg:w-auto mt-2 lg:mt-0">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] font-body bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
                            {totalItems} Registros totales
                        </span>
                    </div>
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
                                <th className="px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">ID</th>
                                <th className="px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Registro</th>
                                <th className="px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Participantes</th>
                                <th className="px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Modalidad</th>
                                <th className="px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Categoría</th>
                                <th className="px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Academia</th>
                                <th className="px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Estatus</th>
                                <th className="px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {inscripciones.map((ins) => (
                                <tr key={ins.id} className="group hover:bg-orange-50/20 transition-all duration-300 border-b border-gray-50 last:border-0">
                                    <td className="px-4 py-3">
                                        <span className="text-sm font-bold text-gray-900 font-body">#{ins.id}</span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className="text-[10px] text-gray-400 font-semibold font-body">
                                            {new Date(ins.fecha_registro).toLocaleDateString('es-PE')}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex flex-col gap-0.5 font-body">
                                            {ins.detalle_inscripcion?.map((det, idx) => (
                                                <span key={idx} className="text-[12px] font-bold text-gray-800 tracking-tight leading-tight">
                                                    {det.nombres} {det.apellidos}
                                                </span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className="inline-block text-[9px] font-bold text-gray-600 uppercase tracking-wider bg-gray-50 px-2 py-1 rounded-sm font-body border border-gray-200/50 whitespace-nowrap">
                                            {ins.modalidad?.nombre || 'General'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className="inline-block text-[9px] font-bold text-orange-600 uppercase tracking-wider bg-orange-50 px-2 py-1 rounded-sm font-body border border-orange-100 whitespace-nowrap">
                                            {ins.categoria?.nombre || 'N/A'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className="text-[11px] font-medium text-gray-700 font-body capitalize">
                                            {ins.academia || '---'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-left">
                                        <span className={`px-2 py-1 text-[9px] font-bold uppercase tracking-widest border rounded-sm whitespace-nowrap
                                            ${ins.estado === 'A' ? 'bg-green-50 text-green-700 border-green-200' :
                                                ins.estado === 'P' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                                                    'bg-red-50 text-red-700 border-red-200'}`}>
                                            {ins.estado === 'A' ? 'Aprobado' :
                                                ins.estado === 'P' ? 'Pendiente' :
                                                    'Inactivo'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center justify-center gap-1 md:gap-2">
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

                                            {/* EDITAR: Lápiz (Solo Datos) */}
                                            <button
                                                onClick={() => handleEdit(ins)}
                                                className="p-2 hover:bg-orange-50 text-gray-400 hover:text-orange-600 transition-all rounded-sm group/btn"
                                                title="Editar Datos Personales"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                                </svg>
                                            </button>

                                            <div className="hidden xs:block h-4 w-px bg-gray-100 mx-0.5"></div>

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
                                    <td colSpan="6" className="px-4 py-12 text-center">
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

            <EditInscripcionModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                inscripcion={editingInscripcion}
                onUpdate={fetchInscripciones}
            />

            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}

            {/* Footer Técnico */}
            <div className="flex justify-between items-center text-[10px] text-gray-300 font-bold uppercase tracking-widest italic pt-10">
                <span>Golpe Tierra v1.0.4 - Sistema Operativo</span>
            </div>
        </div>
    );
}
