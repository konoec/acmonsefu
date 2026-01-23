import React from "react";

export default function StepModalidad({
    modalidades,
    selectedModalidad,
    onChange,
    loading
}) {
    return (
        <div className="space-y-3">
            <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider">
                1. Selecciona la Modalidad
            </label>
            {loading ? (
                <div className="h-12 bg-gray-100 rounded animate-pulse"></div>
            ) : (
                <div className="relative">
                    <select
                        value={selectedModalidad}
                        onChange={onChange}
                        className="w-full px-4 py-4 bg-white border border-gray-200 rounded-lg outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 appearance-none text-gray-800 cursor-pointer transition-all"
                    >
                        <option value="">-- Seleccionar --</option>
                        {modalidades.map((m) => (
                            <option key={m.id} value={m.id}>
                                {m.nombre}
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
