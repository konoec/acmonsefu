import React from "react";
import ParticipantCard from "./ParticipantCard";

export default function ParticipantList({
    participants,
    selectedTipo,
    onAdd,
    onRemove,
    onChange,
    showTitle = true,
    autoCategoryName = null
}) {
    if (!selectedTipo || participants.length === 0) return null;

    const min = selectedTipo.cantidad_minima || 1;
    const max = selectedTipo.cantidad_maxima || 2;
    const canAdd = participants.length < max;

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                <div className="space-y-1">
                    <h3 className="text-xs font-bold text-gray-900 uppercase tracking-[0.2em] font-heading">
                        {showTitle ? "3. Datos de los Participantes" : "2. Datos de los Participantes"}
                    </h3>
                    {autoCategoryName && (
                        <p className="text-[10px] font-medium text-orange-600 uppercase tracking-widest font-heading">
                            Tipo de Participación: {autoCategoryName}
                        </p>
                    )}
                </div>

                {/* Add Button */}
                {canAdd && (
                    <button
                        type="button"
                        onClick={onAdd}
                        className="group flex items-center gap-2 text-[10px] font-bold text-gray-400 hover:text-orange-600 tracking-widest font-heading"
                    >
                        <div className="w-6 h-6 rounded-sm border border-gray-200 flex items-center justify-center group-hover:border-orange-200 group-hover:bg-orange-50">
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" />
                            </svg>
                        </div>
                        AGREGAR
                    </button>
                )}
            </div>

            <div className="bg-[#FAF9F6] border border-gray-100 rounded-sm divide-y divide-gray-100">
                {participants.map((p, idx) => (
                    <ParticipantCard
                        key={idx}
                        index={idx}
                        participant={p}
                        onRemove={onRemove}
                        onChange={onChange}
                        canRemove={participants.length > min}
                    />
                ))}
            </div>
        </div>
    );
}
