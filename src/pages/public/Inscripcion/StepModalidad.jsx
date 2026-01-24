import React from "react";

export default function StepModalidad({
    modalidades,
    selectedModalidad,
    onChange,
    loading
}) {
    return (
        <div className="space-y-4">
            <label className="block text-xs font-bold text-gray-900 uppercase tracking-[0.2em] font-heading">
                1. Selecciona la Modalidad
            </label>
            {loading ? (
                <div className="h-14 bg-gray-50 rounded animate-pulse border border-gray-100"></div>
            ) : (
                <div className="relative group">
                    <select
                        value={selectedModalidad}
                        onChange={onChange}
                        className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-sm outline-none focus:border-orange-500 focus:bg-white appearance-none text-gray-800 cursor-pointer font-body text-sm"
                    >
                        <option value="">-- Seleccionar --</option>
                        {modalidades.map((m) => (
                            <option key={m.id} value={m.id}>
                                {m.nombre}
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
