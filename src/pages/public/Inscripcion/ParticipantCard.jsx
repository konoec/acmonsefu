import React, { memo } from "react";

const ParticipantCard = memo(({
    participant,
    index,
    onRemove,
    onChange,
    canRemove,
}) => {
    const { dni, telefono, nombres, apellidos, sexo, lockedSex, label } = participant;

    return (
        <div className="p-4 md:p-6 relative group">
            {/* Delete Button */}
            {canRemove && (
                <button
                    type="button"
                    onClick={() => onRemove(index)}
                    className="absolute top-8 right-8 text-gray-300 hover:text-red-500"
                    title="Eliminar participante"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            )}

            <div className="flex items-center gap-3 mb-2">
                <span className="w-10 h-10 rounded-sm bg-gray-900 text-white flex items-center justify-center text-xs font-bold font-heading">
                    {String(index + 1).padStart(2, '0')}
                </span>
                <h4 className="text-xs font-bold text-gray-900 uppercase tracking-[0.2em] font-heading">
                    {label || `Participante #${index + 1}`}
                </h4>
            </div>

            <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 ${lockedSex ? 'lg:grid-cols-5' : 'lg:grid-cols-6'} gap-x-12 gap-y-3 items-start`}>
                {/* Nombres */}
                <div className="space-y-1">
                    <label className="block text-[10px] uppercase text-gray-500 font-bold tracking-widest font-heading">
                        Nombres <span className="text-orange-500">*</span>
                    </label>
                    <input
                        type="text"
                        value={nombres}
                        onChange={(e) => onChange(index, "nombres", e.target.value)}
                        className="w-full px-0 py-2 bg-transparent border-b border-gray-200 focus:border-orange-500 outline-none font-body text-sm text-gray-800 placeholder:text-gray-300"
                        placeholder="Ej. Juan Carlos"
                    />
                </div>

                {/* Apellidos */}
                <div className="space-y-1">
                    <label className="block text-[10px] uppercase text-gray-500 font-bold tracking-widest font-heading">
                        Apellidos <span className="text-orange-500">*</span>
                    </label>
                    <input
                        type="text"
                        value={apellidos}
                        onChange={(e) => onChange(index, "apellidos", e.target.value)}
                        className="w-full px-0 py-2 bg-transparent border-b border-gray-200 focus:border-orange-500 outline-none font-body text-sm text-gray-800 placeholder:text-gray-300"
                        placeholder="Ej. Perez Silva"
                    />
                </div>

                {/* DNI */}
                <div className="space-y-1">
                    <label className="block text-[10px] uppercase text-gray-500 font-bold tracking-widest font-heading">
                        DNI <span className="text-orange-500">*</span>
                    </label>
                    <input
                        type="text"
                        value={dni}
                        onChange={(e) => onChange(index, "dni", e.target.value)}
                        className="w-full px-0 py-2 bg-transparent border-b border-gray-200 focus:border-orange-500 outline-none font-body text-sm text-gray-800 placeholder:text-gray-300"
                        placeholder="8 dígitos"
                        maxLength={8}
                    />
                </div>

                {/* Telefono */}
                <div className="space-y-1">
                    <label className="block text-[10px] uppercase text-gray-500 font-bold tracking-widest font-heading">
                        Teléfono <span className="text-orange-500">*</span>
                    </label>
                    <input
                        type="text"
                        value={telefono}
                        onChange={(e) => onChange(index, "telefono", e.target.value)}
                        className="w-full px-0 py-2 bg-transparent border-b border-gray-200 focus:border-orange-500 outline-none font-body text-sm text-gray-800 placeholder:text-gray-300"
                        placeholder="9 dígitos"
                        maxLength={9}
                    />
                </div>

                {/* Fecha de Nacimiento */}
                <div className="space-y-1">
                    <label className="block text-[10px] uppercase text-gray-500 font-bold tracking-widest font-heading">
                        Fecha de Nacimiento <span className="text-orange-500">*</span>
                    </label>
                    <input
                        type="date"
                        value={participant.fecha_nacimiento || ""}
                        onChange={(e) => onChange(index, "fecha_nacimiento", e.target.value)}
                        className="w-full px-0 py-2 bg-transparent border-b border-gray-200 focus:border-orange-500 outline-none font-body text-sm text-gray-800"
                    />
                </div>

                {/* SEXO SELECTION */}
                {!lockedSex && (
                    <div className="space-y-1">
                        <label className="block text-[10px] uppercase text-gray-500 font-bold tracking-widest font-heading">
                            Sexo <span className="text-orange-500">*</span>
                        </label>
                        <div className="flex gap-4 h-[37px] items-center">
                            <label className="group flex items-center gap-2 cursor-pointer">
                                <div className="relative flex items-center justify-center">
                                    <input
                                        type="radio"
                                        name={`sexo-${index}`}
                                        value="F"
                                        checked={sexo === "F"}
                                        onChange={(e) => onChange(index, "sexo", e.target.value)}
                                        className="peer appearance-none w-4 h-4 border border-gray-300 rounded-sm checked:border-orange-600"
                                    />
                                    <div className="absolute w-2 h-2 bg-orange-600 rounded-sm opacity-0 peer-checked:opacity-100"></div>
                                </div>
                                <span className={`text-[10px] font-bold uppercase tracking-wider ${sexo === "F" ? "text-orange-900" : "text-gray-400 group-hover:text-gray-600"}`}>Dama</span>
                            </label>

                            <label className="group flex items-center gap-2 cursor-pointer">
                                <div className="relative flex items-center justify-center">
                                    <input
                                        type="radio"
                                        name={`sexo-${index}`}
                                        value="M"
                                        checked={sexo === "M"}
                                        onChange={(e) => onChange(index, "sexo", e.target.value)}
                                        className="peer appearance-none w-4 h-4 border border-gray-300 rounded-sm checked:border-orange-600"
                                    />
                                    <div className="absolute w-2 h-2 bg-orange-600 rounded-sm opacity-0 peer-checked:opacity-100"></div>
                                </div>
                                <span className={`text-[10px] font-bold uppercase tracking-wider ${sexo === "M" ? "text-orange-900" : "text-gray-400 group-hover:text-gray-600"}`}>Varón</span>
                            </label>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
});

export default ParticipantCard;
