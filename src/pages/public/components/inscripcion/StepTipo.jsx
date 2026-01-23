import React from "react";

export default function StepTipo({
    tipos,
    selectedTipoId,
    onChange,
    loading
}) {
    if (tipos.length === 0) {
        return (
            <div className="p-4 bg-orange-50 text-orange-700 text-sm rounded-lg animate-fade-in-up">
                No hay tipos de participación disponibles para esta modalidad.
            </div>
        );
    }

    // If there's only one type, we might still render it or hide it based on parent logic, 
    // but if this component is rendered, it assumes we want to show it.
    // Ideally parent controls visibility.

    return (
        <div className="space-y-3 animate-fade-in-up">
            <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider">
                2. Tipo de Participación
            </label>
            {loading ? (
                <div className="h-12 bg-gray-100 rounded animate-pulse"></div>
            ) : (
                <div className="relative">
                    <select
                        value={selectedTipoId || ""}
                        onChange={onChange}
                        className="w-full px-4 py-4 bg-white border border-gray-200 rounded-lg outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 appearance-none text-gray-800 cursor-pointer transition-all"
                    >
                        <option value="">-- Seleccionar --</option>
                        {tipos.map((t) => (
                            <option key={t.id} value={t.id}>
                                {t.nombre}
                            </option>
                        ))}
                    </select>
                    <svg
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 9l-7 7-7-7"
                        />
                    </svg>
                </div>
            )}
        </div>
    );
}
