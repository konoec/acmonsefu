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
        <div className="space-y-4">
            <label className="block text-xs font-bold text-gray-900 uppercase tracking-[0.2em] font-heading">
                2. Tipo de Participación
            </label>
            {loading ? (
                <div className="h-14 bg-gray-50 rounded border border-gray-100"></div>
            ) : (
                <div className="relative group">
                    <select
                        value={selectedTipoId || ""}
                        onChange={onChange}
                        className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-sm outline-none focus:border-orange-500 focus:bg-white appearance-none text-gray-800 cursor-pointer font-body text-sm"
                    >
                        <option value="">-- Seleccionar --</option>
                        {tipos.map((t) => (
                            <option key={t.id} value={t.id}>
                                {t.nombre}
                            </option>
                        ))}
                    </select>
                    <svg
                        className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none group-focus-within:text-orange-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2.5"
                            d="M19 9l-7 7-7-7"
                        />
                    </svg>
                </div>
            )}
        </div>
    );
}
