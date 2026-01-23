import React from "react";

export default function ParticipantCard({
    participant,
    index,
    onRemove,
    onChange,
    canRemove,
}) {
    const { dni, telefono, nombres, apellidos, sexo, lockedSex, label } = participant;

    return (
        <div className="bg-white p-6 md:p-8 rounded-xl border border-gray-200 shadow-sm relative group animate-fade-in-up">
            {/* Delete Button */}
            {canRemove && (
                <button
                    type="button"
                    onClick={() => onRemove(index)}
                    className="absolute top-4 right-4 text-gray-300 hover:text-red-500 transition-colors"
                    title="Eliminar participante"
                >
                    <svg
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </button>
            )}

            <div className="flex items-center gap-3 mb-6">
                <span className="w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center text-xs font-bold">
                    {index + 1}
                </span>
                <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
                    {label || `Participante #${index + 1}`}
                </h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* DNI */}
                <div>
                    <label className="block text-xs uppercase text-gray-500 font-bold mb-1.5">
                        DNI <span className="text-red-400">*</span>
                    </label>
                    <input
                        type="text"
                        value={dni}
                        onChange={(e) => onChange(index, "dni", e.target.value)}
                        className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200 focus:border-orange-500 focus:bg-white outline-none transition-colors font-medium text-gray-800"
                        placeholder="8 dígitos"
                        maxLength={8}
                    />
                </div>

                {/* Telefono */}
                <div>
                    <label className="block text-xs uppercase text-gray-500 font-bold mb-1.5">
                        Teléfono <span className="text-red-400">*</span>
                    </label>
                    <input
                        type="text"
                        value={telefono}
                        onChange={(e) => onChange(index, "telefono", e.target.value)}
                        className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200 focus:border-orange-500 focus:bg-white outline-none transition-colors font-medium text-gray-800"
                        placeholder="9 dígitos"
                        maxLength={9}
                    />
                </div>

                {/* Nombres */}
                <div>
                    <label className="block text-xs uppercase text-gray-500 font-bold mb-1.5">
                        Nombres <span className="text-red-400">*</span>
                    </label>
                    <input
                        type="text"
                        value={nombres}
                        onChange={(e) => onChange(index, "nombres", e.target.value)}
                        className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200 focus:border-orange-500 focus:bg-white outline-none transition-colors font-medium text-gray-800"
                        placeholder="Ej. Juan Carlos"
                    />
                </div>

                {/* Apellidos */}
                <div>
                    <label className="block text-xs uppercase text-gray-500 font-bold mb-1.5">
                        Apellidos <span className="text-red-400">*</span>
                    </label>
                    <input
                        type="text"
                        value={apellidos}
                        onChange={(e) => onChange(index, "apellidos", e.target.value)}
                        className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200 focus:border-orange-500 focus:bg-white outline-none transition-colors font-medium text-gray-800"
                        placeholder="Ej. Perez Silva"
                    />
                </div>

                {/* SEXO SELECTION - Hidden if locked */}
                {!lockedSex && (
                    <div className="md:col-span-2 mt-2">
                        <label className="block text-xs uppercase text-gray-500 font-bold mb-2">
                            Sexo <span className="text-red-400">*</span>
                        </label>
                        <div className="flex gap-4">
                            <label
                                className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-all ${sexo === "F"
                                    ? "bg-pink-50 border-pink-200 text-pink-800"
                                    : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                                    }`}
                            >
                                <input
                                    type="radio"
                                    name={`sexo-${index}`}
                                    value="F"
                                    checked={sexo === "F"}
                                    onChange={(e) => onChange(index, "sexo", e.target.value)}
                                    className="w-4 h-4 text-pink-600"
                                />
                                <span className="text-sm font-bold">Dama</span>
                            </label>

                            <label
                                className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-all ${sexo === "M"
                                    ? "bg-blue-50 border-blue-200 text-blue-800"
                                    : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                                    }`}
                            >
                                <input
                                    type="radio"
                                    name={`sexo-${index}`}
                                    value="M"
                                    checked={sexo === "M"}
                                    onChange={(e) => onChange(index, "sexo", e.target.value)}
                                    className="w-4 h-4 text-blue-600"
                                />
                                <span className="text-sm font-bold">Varón</span>
                            </label>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
