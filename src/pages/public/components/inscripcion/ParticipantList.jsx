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
        <div className="animate-fade-in-up space-y-8">
            <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                <div className="block text-sm font-bold text-gray-700 uppercase tracking-wider">
                    {showTitle ? (
                        <span>3. Datos de los Participantes</span>
                    ) : (
                        <span>2. Datos de los Participantes</span>
                    )}

                    {/* Show the auto-selected type name if provided */}
                    {autoCategoryName && (
                        <span className="block text-xs font-normal text-orange-600 mt-1">
                            Categoría: <span className="font-bold">{autoCategoryName}</span>
                        </span>
                    )}
                </div>

                {/* Add Button */}
                {canAdd && (
                    <button
                        type="button"
                        onClick={onAdd}
                        className="text-xs font-bold text-orange-700 hover:text-orange-900 flex items-center gap-1"
                    >
                        <svg
                            className="w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M12 4v16m8-8H4"
                            />
                        </svg>
                        AGREGAR
                    </button>
                )}
            </div>

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
    );
}
