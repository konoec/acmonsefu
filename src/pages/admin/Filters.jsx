import React from 'react';

export default function Filters({
    search,
    setSearch,
    status,
    setStatus,
    modality,
    setModality,
    modalities,
    onClear
}) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white p-6 rounded-sm border border-gray-100 shadow-sm mb-8 animate-in fade-in slide-in-from-top-2 duration-500">
            {/* Search Input */}
            <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-body">Buscar por Nombre/DNI/Tel</label>
                <div className="relative group">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Ej. Juan Perez o 7248..."
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-sm text-sm font-body focus:bg-white focus:border-orange-500 outline-none transition-all"
                    />
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-orange-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
            </div>

            {/* Status Filter */}
            <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-body">Estatus</label>
                <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-sm text-sm font-body focus:bg-white focus:border-orange-500 outline-none appearance-none cursor-pointer transition-all"
                >
                    <option value="ALL">Todos los estados</option>
                    <option value="P">Pendiente</option>
                    <option value="A">Aprobado</option>
                    <option value="I">Inactivo</option>
                </select>
            </div>

            {/* Modality Filter */}
            <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-body">Modalidad</label>
                <select
                    value={modality}
                    onChange={(e) => setModality(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-sm text-sm font-body focus:bg-white focus:border-orange-500 outline-none appearance-none cursor-pointer transition-all"
                >
                    <option value="ALL">Todas las modalidades</option>
                    {modalities.map((m) => (
                        <option key={m.id} value={m.id}>{m.nombre}</option>
                    ))}
                </select>
            </div>

            {/* Actions */}
            <div className="flex items-end gap-2">
                <button
                    onClick={onClear}
                    className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-600 text-[10px] font-bold uppercase tracking-widest hover:bg-gray-200 transition-all rounded-sm font-body"
                >
                    Limpiar Filtros
                </button>
            </div>
        </div>
    );
}
