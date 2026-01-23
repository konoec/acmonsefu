import { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";
import StepModalidad from "./components/inscripcion/StepModalidad";
import StepTipo from "./components/inscripcion/StepTipo";
import ParticipantList from "./components/inscripcion/ParticipantList";
import logoFestival from "../../assets/images/logos/logo_festival.png";
import RunningStamp from "../../components/RunningStamp";

export default function Inscripcion() {
  // --- States ---
  const [modalidades, setModalidades] = useState([]);
  const [tiposParticipacion, setTiposParticipacion] = useState([]);

  const [selectedModalidad, setSelectedModalidad] = useState("");
  const [selectedTipo, setSelectedTipo] = useState(null);

  // Participants array
  const [participants, setParticipants] = useState([]);

  const [loadingModalidades, setLoadingModalidades] = useState(true);
  const [loadingTipos, setLoadingTipos] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  // --- 1. Fetch Modalidades on Mount ---
  useEffect(() => {
    const fetchModalidades = async () => {
      try {
        const { data, error } = await supabase
          .from("modalidad")
          .select("id, nombre, estado")
          .order("id", { ascending: true });

        if (error) throw error;

        const activeDeps = (data || []).filter(m => m.estado && m.estado.trim() === 'A');
        setModalidades(activeDeps);
      } catch (err) {
        console.error("Error fetching modalidades:", err);
        setErrorMessage("No se pudieron cargar las modalidades.");
      } finally {
        setLoadingModalidades(false);
      }
    };
    fetchModalidades();
  }, []);

  // --- Helper: Initialize Participants Logic ---
  const initializeParticipants = (tipo) => {
    setSelectedTipo(tipo);

    if (!tipo) {
      setParticipants([]);
      return;
    }

    const minQty = Math.max(1, tipo.cantidad_minima || 1);
    // User standard: A (Ambos), X (Pareja Mixta), F (Female), M (Male)
    // We treat anything unknown as A (Ambos) or just process strictly.
    const rule = tipo.regla_sexo ? tipo.regla_sexo.trim().toUpperCase() : 'A';

    let initialParticipants = [];

    if (rule === 'X') {
      // Pareja Mixta: Exactly 2 forms, Male & Female
      initialParticipants = [
        { nombres: "", apellidos: "", dni: "", telefono: "", sexo: "M", lockedSex: true, label: "Participante 1 (Varón)" },
        { nombres: "", apellidos: "", dni: "", telefono: "", sexo: "F", lockedSex: true, label: "Participante 2 (Dama)" }
      ];
    } else if (rule === 'M') {
      // Solo Varones
      for (let i = 0; i < minQty; i++) {
        initialParticipants.push({
          nombres: "", apellidos: "", dni: "", telefono: "", sexo: "M", lockedSex: true,
          label: minQty > 1 ? `Participante ${i + 1} (Varón)` : "Participante (Varón)"
        });
      }
    } else if (rule === 'F') {
      // Solo Damas
      for (let i = 0; i < minQty; i++) {
        initialParticipants.push({
          nombres: "", apellidos: "", dni: "", telefono: "", sexo: "F", lockedSex: true,
          label: minQty > 1 ? `Participante ${i + 1} (Dama)` : "Participante (Dama)"
        });
      }
    } else {
      // Case 'A' (Ambos) or default: Show selector
      for (let i = 0; i < minQty; i++) {
        initialParticipants.push({
          nombres: "", apellidos: "", dni: "", telefono: "", sexo: "", lockedSex: false,
          label: minQty > 1 ? `Participante ${i + 1}` : "Participante"
        });
      }
    }

    setParticipants(initialParticipants);
  };

  // --- 2. Handle Modalidad Selection ---
  const handleModalidadChange = async (e) => {
    const modId = e.target.value;
    setSelectedModalidad(modId);

    // Reset downstream
    setSelectedTipo(null);
    setParticipants([]);
    setTiposParticipacion([]);
    setErrorMessage(null);

    if (!modId) return;

    setLoadingTipos(true);
    try {
      const { data: typesData, error: typesError } = await supabase
        .from("modalidad_tipo")
        .select(`
          tipo_participacion (
            id,
            nombre,
            cantidad_minima,
            cantidad_maxima
          )
        `)
        .eq("modalidad_id", modId);

      if (typesError) throw typesError;

      const { data: rulesData, error: rulesError } = await supabase
        .from("modalidad_regla_sexo")
        .select("tipo_participacion_id, regla_sexo")
        .eq("modalidad_id", modId);

      if (rulesError) throw rulesError;

      const mergedTypes = typesData.map((item) => {
        const t = item.tipo_participacion;
        // Find specific rule row. Assuming 1-to-1 or just picking first valid.
        // The DB is expected to return single chars: A, X, F, M.
        const ruleObj = rulesData.find(r => r.tipo_participacion_id === t.id);

        let finalRule = ruleObj ? ruleObj.regla_sexo.trim().toUpperCase() : 'A';

        // Compatibility fallback if DB still has old 'FM' or 'LIBRE' values (just in case)
        if (finalRule === 'FM') finalRule = 'X'; // Assume FM meant Mix Couple
        if (finalRule === 'LIBRE') finalRule = 'A';

        return {
          ...t,
          regla_sexo: finalRule
        };
      }).filter(Boolean);

      setTiposParticipacion(mergedTypes);

      // Auto-select if only one type exists
      if (mergedTypes.length === 1) {
        initializeParticipants(mergedTypes[0]);
      }

    } catch (err) {
      console.error("Error fetching types/rules:", err);
      setErrorMessage("Error al cargar configuración de inscripción.");
    } finally {
      setLoadingTipos(false);
    }
  };

  // --- 3. Handle Tipo Selection ---
  const handleTipoChange = (e) => {
    const tipoId = parseInt(e.target.value);
    const tipo = tiposParticipacion.find((t) => t.id === tipoId);
    initializeParticipants(tipo || null);
  };

  // --- Helper: Add/Remove/Change Participant ---
  const addParticipant = () => {
    if (!selectedTipo) return;
    if (participants.length >= (selectedTipo.cantidad_maxima || 2)) return;

    const rule = selectedTipo.regla_sexo; // A, X, M, F
    const nextIndex = participants.length + 1;
    const newP = { nombres: "", apellidos: "", dni: "", telefono: "", sexo: "", lockedSex: false, label: `Participante #${nextIndex}` };

    if (rule === 'M') {
      newP.sexo = 'M';
      newP.lockedSex = true;
      newP.label = `Participante #${nextIndex} (Varón)`;
    } else if (rule === 'F') {
      newP.sexo = 'F';
      newP.lockedSex = true;
      newP.label = `Participante #${nextIndex} (Dama)`;
    } else if (rule === 'X') {
      // Adding to a mixed couple? Typically X is fixed to 2, so this might not be reached often unless max > 2.
      // If adding more, we might need logic. For now, assume Alternating or Open? 
      // User Logic: "X (Pareja Mixta) ... Mostrar dos formularios".
      // Usually X implies exactly 2 people (M & F). 
      // If somehow max > 2, what sex? 
      // I'll default to M for odd, F for even to maintain balance, or leave open?
      // Given user strictness, let's assume X strictly implies 2 people and Add shouldn't really be used beyond that.
      // But if it IS used, leaving it open or checking index.
      // Let's err on side of open if > 2, or cycle.
      // Actually, let's keep it safe:
      // If rule is X and we are adding 3rd, it's ambiguous. But usually min=max=2 for X.
      newP.lockedSex = false;
    }
    // Case A: lockedSex = false, default.

    setParticipants([...participants, newP]);
  };

  const removeParticipant = (index) => {
    if (!selectedTipo) return;
    if (participants.length > (selectedTipo.cantidad_minima || 1)) {
      const newP = [...participants];
      newP.splice(index, 1);
      setParticipants(newP);
    }
  };

  const handleParticipantChange = (index, field, value) => {
    if ((field === "dni" || field === "telefono") && !/^\d*$/.test(value)) return;
    if (field === "dni" && value.length > 8) return;
    if (field === "telefono" && value.length > 9) return;

    const updated = [...participants];
    updated[index] = { ...updated[index], [field]: value };
    setParticipants(updated);
  };

  // --- Validation & Submit ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validate
    for (let i = 0; i < participants.length; i++) {
      const p = participants[i];
      if (!p.nombres || !p.apellidos || !p.dni || !p.telefono || !p.sexo) {
        setErrorMessage(`Por favor completa todos los campos (incluyendo sexo) del ${p.label || 'participante'}.`);
        return;
      }
      if (p.dni.length !== 8) {
        setErrorMessage(`El DNI del ${p.label || 'participante'} debe tener 8 dígitos.`);
        return;
      }
    }

    setSubmitting(true);

    try {
      const p_personas = participants.map(p => ({
        tipo_participacion_id: selectedTipo.id,
        nombres: p.nombres,
        apellidos: p.apellidos,
        dni: p.dni,
        telefono: p.telefono,
        sexo: p.sexo
      }));

      const payload = {
        p_modalidad_id: parseInt(selectedModalidad),
        p_personas: p_personas
      };

      const { error } = await supabase.rpc("registrar_inscripcion", payload);

      if (error) throw error;

      setSuccess(true);
      window.scrollTo({ top: document.getElementById('inscripcion').offsetTop, behavior: 'smooth' });

    } catch (err) {
      console.error("Error submitting:", err);
      setErrorMessage(err.message || "Hubo un error al procesar tu inscripción.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setSuccess(false);
    setSelectedModalidad("");
    setSelectedTipo(null);
    setParticipants([]);
    setErrorMessage(null);
  };

  return (
    <section id="inscripcion" className="py-24 lg:py-32 bg-gray-50/50 font-body relative overflow-hidden">

      {/* Carrusel Dinámico de Marcas de Agua */}
      <RunningStamp />

      <div className="max-w-3xl mx-auto px-6 lg:px-8 relative z-10">

        {/* Header Hero Layout */}
        <div className="text-center mb-16 space-y-8">
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-10">
            <img src={logoFestival} alt="Logo Festival" className="h-20 sm:h-24 w-auto object-contain" />
            <div className="hidden md:block h-20 w-px bg-gray-200"></div>
            <div className="text-center md:text-left">
              <span className="text-[11px] font-bold tracking-[0.3em] text-orange-600 uppercase mb-3 block opacity-80">
                REGISTRO OFICIAL 2026
              </span>
              <h2 className="font-heading text-4xl sm:text-5xl lg:text-7xl font-extrabold text-gray-900 leading-none tracking-tight">
                Ficha de Inscripción
              </h2>
            </div>
          </div>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg font-light leading-relaxed border-t border-gray-100 pt-8">
            Completa los pasos a continuación para formalizar tu registro en el festival.
            Asegúrate de tener a mano los documentos requeridos.
          </p>
        </div>

        {/* Contenedor Paper Editorial Técnico */}
        <div className="bg-white p-8 md:p-12 rounded-sm shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] border border-gray-100 relative min-h-[500px]">

          {/* --- SUCCESS STATE --- */}
          {success ? (
            <div className="text-center py-20 flex flex-col items-center justify-center h-full">
              <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6 text-green-500 shadow-sm border border-green-100">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h3 className="text-3xl font-heading font-extrabold text-gray-900 mb-3 tracking-tight">¡Todo listo!</h3>
              <p className="text-gray-500 mb-10 max-w-md mx-auto leading-relaxed">
                Tu inscripción ha sido recibida correctamente. Nos vemos en la pista de baile.
              </p>
              <button
                onClick={handleReset}
                className="px-8 py-3 bg-gray-900 text-white font-medium text-sm rounded-sm hover:bg-orange-600 shadow-lg hover:shadow-orange-500/20"
              >
                Inscribir a otro participante
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-10">

              {/* --- STEP 1: Modalidad --- */}
              <div className="relative z-20">
                <StepModalidad
                  modalidades={modalidades}
                  selectedModalidad={selectedModalidad}
                  onChange={handleModalidadChange}
                  loading={loadingModalidades}
                />
              </div>

              {/* --- EMPTY STATE / PLACEHOLDER --- */}
              {!selectedModalidad && (
                <div className="py-20 text-center border-2 border-dashed border-gray-100 rounded-sm bg-gray-50/30">
                  <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-400">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-medium text-gray-900 mb-2">Comienza tu registro</h4>
                  <p className="text-gray-500 max-w-sm mx-auto text-sm">
                    Selecciona una modalidad arriba para desplegar el formulario completo.
                  </p>
                </div>
              )}

              {/* --- CONTENT (Only visible when modalida selected) --- */}
              {selectedModalidad && (
                <div className="space-y-10">

                  {/* --- STEP 2: Tipo Participación --- */}
                  {tiposParticipacion.length > 1 && (
                    <StepTipo
                      tipos={tiposParticipacion}
                      selectedTipoId={selectedTipo?.id}
                      onChange={handleTipoChange}
                      loading={loadingTipos}
                    />
                  )}

                  {/* --- STEP 3: Participants --- */}
                  <div className="pt-4 border-t border-gray-100">
                    <ParticipantList
                      participants={participants}
                      selectedTipo={selectedTipo}
                      onAdd={addParticipant}
                      onRemove={removeParticipant}
                      onChange={handleParticipantChange}
                      showTitle={tiposParticipacion.length > 1}
                      autoCategoryName={tiposParticipacion.length === 1 && selectedTipo ? selectedTipo.nombre : null}
                    />
                  </div>

                  {/* --- Error Message --- */}
                  {errorMessage && (
                    <div className="p-4 bg-red-50 text-red-600 rounded-sm text-[11px] font-bold uppercase tracking-wider flex items-center gap-3 border border-red-100">
                      <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {errorMessage}
                    </div>
                  )}

                  {/* --- Submit Button --- */}
                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={submitting || !selectedTipo || participants.length === 0}
                      className="w-full relative flex items-center justify-center px-8 py-5 text-base font-bold tracking-wider text-white bg-gray-900 rounded-sm overflow-hidden hover:bg-orange-600 hover:shadow-lg hover:shadow-orange-500/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                    >
                      {submitting ? (
                        <span className="flex items-center gap-3">
                          <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span className="text-xs uppercase tracking-[0.2em] font-bold">Procesando...</span>
                        </span>
                      ) : (
                        <span className="relative z-10 flex items-center gap-3 text-xs uppercase tracking-[0.2em] font-bold">
                          Confirmar Inscripción
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                        </span>
                      )}
                    </button>
                  </div>
                </div>
              )}

            </form>
          )}
        </div>
      </div>
    </section>
  );
}
