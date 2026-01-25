import React, { memo } from 'react';
import Pagination from "./Pagination";

const InscripcionesTable = memo(function InscripcionesTable({
    inscripciones,
    loading,
    totalItems,
    currentPage,
    itemsPerPage,
    onPageChange,
    onItemsPerPageChange,
    onViewDetail,
    onEdit,
    onUpdateEstado
}) {
    return (
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
                                            onClick={() => onViewDetail(ins)}
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
                                            onClick={() => onEdit(ins)}
                                            className="p-2 hover:bg-orange-50 text-gray-400 hover:text-orange-600 transition-all rounded-sm group/btn"
                                            title="Editar Datos Personales"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                            </svg>
                                        </button>

                                        <div className="hidden xs:block h-4 w-px bg-gray-100 mx-0.5"></div>

                                        <button
                                            onClick={() => onUpdateEstado(ins.id, 'A')}
                                            disabled={ins.estado === 'A'}
                                            className="p-2 hover:bg-green-50 text-gray-400 hover:text-green-600 transition-all rounded-sm disabled:opacity-20 disabled:cursor-not-allowed group/btn"
                                            title="Aprobar"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </button>
                                        <button
                                            onClick={() => onUpdateEstado(ins.id, 'P')}
                                            disabled={ins.estado === 'P'}
                                            className="p-2 hover:bg-yellow-50 text-gray-400 hover:text-yellow-600 transition-all rounded-sm disabled:opacity-20 disabled:cursor-not-allowed"
                                            title="Pendiente"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </button>
                                        <button
                                            onClick={() => onUpdateEstado(ins.id, 'I')}
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
                onPageChange={onPageChange}
                onItemsPerPageChange={onItemsPerPageChange}
            />
        </div>
    );
});

export default InscripcionesTable;
