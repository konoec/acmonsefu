import React, { useState, useEffect } from 'react';
import { supabase } from "../../supabaseClient";
import Toast from "../../components/Toast";

export default function EditInscripcionModal({ isOpen, onClose, inscripcion, onUpdate }) {
    const [formData, setFormData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState(null);

    const showToast = (message, type = 'error') => {
        setToast({ message, type });
    };

    useEffect(() => {
        if (inscripcion) {
            setFormData({
                academia: inscripcion.academia || "",
                // Solo necesitamos el detalle para editar datos personales
                detalle: (inscripcion.detalle_inscripcion || []).map(d => ({ ...d }))
            });
        }
    }, [inscripcion]);

    if (!isOpen || !formData) return null;

    const handleDetailChange = (index, field, value) => {
        const newDetalle = [...formData.detalle];
        newDetalle[index][field] = value;
        setFormData({ ...formData, detalle: newDetalle });
    };

    const handleAcademiaChange = (value) => {
        setFormData({ ...formData, academia: value });
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            // Validaciones básicas
            for (const p of formData.detalle) {
                if (!p.nombres || !p.apellidos || !p.dni || !p.telefono) {
                    throw new Error(`Todos los campos son obligatorios para el participante: ${p.nombres || '?'}`);
                }
                if (p.dni.length !== 8) throw new Error(`El DNI de ${p.nombres} debe tener 8 dígitos.`);
            }

            // Guardar cambios en detalle_inscripcion
            for (const det of formData.detalle) {
                const { error: errorDet } = await supabase
                    .from('detalle_inscripcion')
                    .update({
                        nombres: det.nombres,
                        apellidos: det.apellidos,
                        dni: det.dni,
                        telefono: det.telefono
                    })
                    .eq('id', det.id);

                if (errorDet) throw errorDet;
            }

            // Guardar cambios en inscripcion (academia)
            const { error: errorIns } = await supabase
                .from('inscripcion')
                .update({ academia: formData.academia })
                .eq('id', inscripcion.id);

            if (errorIns) throw errorIns;

            onUpdate();
            // onClose(); // No cerramos aún para que vea el toast
            showToast("Datos actualizados correctamente.", "success");
            setTimeout(onClose, 2000);

        } catch (err) {
            console.error("Error al editar:", err);
            showToast("Error al guardar: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose}></div>

            {/* Modal Content */}
            <div className="relative bg-white w-full max-w-2xl rounded-sm shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <div className="space-y-1">
                        <span className="text-[10px] font-black uppercase text-orange-600 tracking-[0.2em]">Edición Rápida</span>
                        <h3 className="text-xl font-bold text-gray-900 tracking-tight">Inscripción #{inscripcion.id}</h3>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Body (Scrollable) */}
                <div className="p-8 overflow-y-auto space-y-8 font-body">

                    {/* Sección Academia */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-1 h-4 bg-gray-900"></div>
                            <h4 className="text-[11px] font-black uppercase text-gray-400 tracking-widest">Institución / Academia</h4>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest ml-1">Nombre de la Academia</label>
                            <input
                                type="text"
                                value={formData.academia}
                                onChange={(e) => handleAcademiaChange(e.target.value)}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-sm text-sm font-medium focus:border-orange-500 focus:bg-white outline-none transition-all uppercase"
                                placeholder="Escribe el nombre de la academia"
                            />
                        </div>
                    </div>

                    {/* Sección Participantes */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="w-1 h-4 bg-orange-500"></div>
                            <h4 className="text-[11px] font-black uppercase text-gray-400 tracking-widest">Datos Personales</h4>
                        </div>

                        {formData.detalle.map((det, idx) => (
                            <div key={det.id} className="p-5 border border-gray-100 bg-gray-50/30 rounded-sm space-y-5 relative">
                                <span className="absolute -top-2 left-4 bg-white px-3 py-0.5 border border-gray-100 rounded-full text-[9px] font-bold text-orange-600 uppercase tracking-widest shadow-sm">
                                    Participante {idx + 1} {det.sexo === 'M' ? '(Varón)' : det.sexo === 'F' ? '(Dama)' : ''}
                                </span>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest ml-1">Nombres</label>
                                        <input
                                            type="text"
                                            value={det.nombres}
                                            onChange={(e) => handleDetailChange(idx, 'nombres', e.target.value)}
                                            className="w-full px-4 py-2.5 bg-white border border-gray-100 rounded-sm text-sm focus:border-orange-500 outline-none transition-all uppercase"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest ml-1">Apellidos</label>
                                        <input
                                            type="text"
                                            value={det.apellidos}
                                            onChange={(e) => handleDetailChange(idx, 'apellidos', e.target.value)}
                                            className="w-full px-4 py-2.5 bg-white border border-gray-100 rounded-sm text-sm focus:border-orange-500 outline-none transition-all uppercase"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest ml-1">DNI</label>
                                        <input
                                            type="text"
                                            maxLength={8}
                                            value={det.dni}
                                            onChange={(e) => handleDetailChange(idx, 'dni', e.target.value.replace(/\D/g, ''))}
                                            className="w-full px-4 py-2.5 bg-white border border-gray-100 rounded-sm text-sm focus:border-orange-500 outline-none transition-all"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest ml-1">Teléfono</label>
                                        <input
                                            type="text"
                                            value={det.telefono}
                                            onChange={(e) => handleDetailChange(idx, 'telefono', e.target.value)}
                                            className="w-full px-4 py-2.5 bg-white border border-gray-100 rounded-sm text-sm focus:border-orange-500 outline-none transition-all"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="bg-yellow-50 border border-yellow-100 rounded-sm p-4 text-[10px] text-yellow-800 font-medium">
                        <strong className="block mb-1 uppercase tracking-widest text-yellow-900">Nota Importante:</strong>
                        Solo se permite la edición de datos personales (Nombres, DNI, Teléfono). Si se requiere cambiar de Modalidad o Sexo, se debe desactivar este registro y crear uno nuevo.
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-4">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:text-gray-700 transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={loading}
                        className="px-8 py-2.5 bg-gray-900 text-white text-[10px] font-black uppercase tracking-widest rounded-sm hover:bg-orange-600 transition-all shadow-lg shadow-gray-200 disabled:opacity-50 flex items-center gap-2"
                    >
                        {loading ? (
                            <>
                                <div className="w-3 h-3 border-2 border-white/30 border-t-white animate-spin rounded-full"></div>
                                Guardando...
                            </>
                        ) : (
                            'Actualizar Datos'
                        )}
                    </button>
                </div>
            </div>

            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
        </div>
    );
}
