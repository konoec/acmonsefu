import React, { useState, useEffect } from "react";
import { supabase } from "../../../supabaseClient";

export const useRegistration = () => {
    // --- States ---
    const [modalidades, setModalidades] = useState([]);
    const [tiposParticipacion, setTiposParticipacion] = useState([]);
    const [categorias, setCategorias] = useState([]);

    const [selectedModalidad, setSelectedModalidad] = useState("");
    const [selectedTipo, setSelectedTipo] = useState(null);
    const [selectedCategoriaId, setSelectedCategoriaId] = useState("");
    const [academia, setAcademia] = useState("");

    // Participants array
    const [participants, setParticipants] = useState([]);

    const [loadingModalidades, setLoadingModalidades] = useState(true);
    const [loadingTipos, setLoadingTipos] = useState(false);
    const [loadingCategorias, setLoadingCategorias] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const [lastInscripcionData, setLastInscripcionData] = useState(null);

    // Cache para detalles de modalidad (Tipos + Categorias + Reglas)
    // Estructura: { [modId]: { tipos: [], categorias: [] } }
    const detailsCache = React.useRef({});

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
        const rule = tipo.regla_sexo ? tipo.regla_sexo.trim().toUpperCase() : 'A';

        let initialParticipants = [];

        if (rule === 'X') {
            initialParticipants = [
                { nombres: "", apellidos: "", dni: "", telefono: "", fecha_nacimiento: "", sexo: "M", lockedSex: true, label: "Participante 1 (Varón)" },
                { nombres: "", apellidos: "", dni: "", telefono: "", fecha_nacimiento: "", sexo: "F", lockedSex: true, label: "Participante 2 (Dama)" }
            ];
        } else if (rule === 'M') {
            for (let i = 0; i < minQty; i++) {
                initialParticipants.push({
                    nombres: "", apellidos: "", dni: "", telefono: "", fecha_nacimiento: "", sexo: "M", lockedSex: true,
                    label: minQty > 1 ? `Participante ${i + 1} (Varón)` : "Participante (Varón)"
                });
            }
        } else if (rule === 'F') {
            for (let i = 0; i < minQty; i++) {
                initialParticipants.push({
                    nombres: "", apellidos: "", dni: "", telefono: "", fecha_nacimiento: "", sexo: "F", lockedSex: true,
                    label: minQty > 1 ? `Participante ${i + 1} (Dama)` : "Participante (Dama)"
                });
            }
        } else {
            for (let i = 0; i < minQty; i++) {
                initialParticipants.push({
                    nombres: "", apellidos: "", dni: "", telefono: "", fecha_nacimiento: "", sexo: "", lockedSex: false,
                    label: minQty > 1 ? `Participante ${i + 1}` : "Participante"
                });
            }
        }

        setParticipants(initialParticipants);
    };

    // --- 2. Handle Modalidad Selection (OPTIMIZED) ---
    const handleModalidadChange = async (e) => {
        const modId = e.target.value;
        setSelectedModalidad(modId);

        setSelectedTipo(null);
        setSelectedCategoriaId("");
        setParticipants([]);
        // No limpiamos tipos/categorias inmediatamente para evitar flash si usamos caché
        // Pero idealmente deberíamos si cambia ID. 
        // Si hay cache, el set será instantáneo.

        setErrorMessage(null);

        if (!modId) {
            setTiposParticipacion([]);
            setCategorias([]);
            return;
        }

        // CHECK CACHE
        if (detailsCache.current[modId]) {
            console.log("Loading from cache for modality:", modId);
            const cached = detailsCache.current[modId];
            setTiposParticipacion(cached.tipos);
            setCategorias(cached.categorias);

            if (cached.tipos.length === 1) {
                initializeParticipants(cached.tipos[0]);
            }
            return;
        }

        setLoadingTipos(true);
        setLoadingCategorias(true);
        // Limpiamos stado visualmente "sucio" mientras carga nuevo (si no es cache)
        setTiposParticipacion([]);
        setCategorias([]);

        try {
            // PARALLEL FETCHING
            const [typesData, rulesData, catsData] = await Promise.all([
                // 1. Tipos
                supabase.from("modalidad_tipo")
                    .select(`tipo_participacion (id, nombre, cantidad_minima, cantidad_maxima)`)
                    .eq("modalidad_id", modId),

                // 2. Reglas
                supabase.from("modalidad_regla_sexo")
                    .select("tipo_participacion_id, regla_sexo")
                    .eq("modalidad_id", modId),

                // 3. Categorías
                supabase.from("modalidad_categoria")
                    .select(`categoria (id, nombre)`)
                    .eq("modalidad_id", modId)
                    .eq("estado", "A")
            ]);

            if (typesData.error) throw typesData.error;
            if (rulesData.error) throw rulesData.error;
            if (catsData.error) throw catsData.error;

            // Process Types & Rules
            const mergedTypes = typesData.data.map((item) => {
                const t = item.tipo_participacion;
                const ruleObj = rulesData.data.find(r => r.tipo_participacion_id === t.id);
                let finalRule = ruleObj ? ruleObj.regla_sexo.trim().toUpperCase() : 'A';
                if (finalRule === 'FM') finalRule = 'X';
                if (finalRule === 'LIBRE') finalRule = 'A';

                return {
                    ...t,
                    regla_sexo: finalRule
                };
            }).filter(Boolean);

            // Process Categories
            const fetchedCats = catsData.data.map(c => c.categoria).filter(Boolean);

            // SAVE TO CACHE
            detailsCache.current[modId] = {
                tipos: mergedTypes,
                categorias: fetchedCats
            };

            setTiposParticipacion(mergedTypes);
            setCategorias(fetchedCats);

            if (mergedTypes.length === 1) {
                initializeParticipants(mergedTypes[0]);
            }

        } catch (err) {
            console.error("Error fetching types/categories/rules:", err);
            setErrorMessage("Error al cargar configuración de inscripción.");
        } finally {
            setLoadingTipos(false);
            setLoadingCategorias(false);
        }
    };

    // --- 3. Handle Tipo Selection ---
    const handleTipoChange = (e) => {
        const tipoId = parseInt(e.target.value);
        const tipo = tiposParticipacion.find((t) => t.id === tipoId);
        initializeParticipants(tipo || null);
    };

    const handleCategoriaChange = (e) => {
        setSelectedCategoriaId(e.target.value);
    };

    const addParticipant = () => {
        if (!selectedTipo) return;
        if (participants.length >= (selectedTipo.cantidad_maxima || 2)) return;

        const rule = selectedTipo.regla_sexo;
        const nextIndex = participants.length + 1;
        const newP = { nombres: "", apellidos: "", dni: "", telefono: "", fecha_nacimiento: "", sexo: "", lockedSex: false, label: `Participante #${nextIndex}` };

        if (rule === 'M') {
            newP.sexo = 'M';
            newP.lockedSex = true;
            newP.label = `Participante #${nextIndex} (Varón)`;
        } else if (rule === 'F') {
            newP.sexo = 'F';
            newP.lockedSex = true;
            newP.label = `Participante #${nextIndex} (Dama)`;
        } else if (rule === 'X') {
            newP.lockedSex = false;
        }

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

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        setErrorMessage(null);

        if (!selectedCategoriaId) {
            setErrorMessage("Por favor selecciona una categoría.");
            return;
        }

        if (!academia.trim()) {
            setErrorMessage("Por favor ingresa el nombre de tu academia.");
            return;
        }

        const missingFieldsLabels = [];
        const invalidDniLabels = [];

        for (let i = 0; i < participants.length; i++) {
            const p = participants[i];
            const isMissing = !p.nombres || !p.apellidos || !p.dni || !p.telefono || !p.sexo || !p.fecha_nacimiento;
            const isInvalidDni = p.dni && p.dni.length !== 8;

            if (isMissing) {
                missingFieldsLabels.push(p.label || `Participante ${i + 1}`);
            } else if (isInvalidDni) {
                invalidDniLabels.push(p.label || `Participante ${i + 1}`);
            }
        }

        if (missingFieldsLabels.length > 0) {
            setErrorMessage(`Por favor completa todos los campos (incluyendo fecha de nacimiento) de: ${missingFieldsLabels.join(", ")}.`);
            return;
        }

        if (invalidDniLabels.length > 0) {
            setErrorMessage(`El DNI debe tener 8 dígitos en: ${invalidDniLabels.join(", ")}.`);
            return;
        }

        setSubmitting(true);

        try {
            const p_personas = participants.map(p => ({
                tipo_participacion_id: selectedTipo.id,
                nombres: p.nombres,
                apellidos: p.apellidos,
                dni: p.dni,
                telefono: p.telefono,
                sexo: p.sexo,
                fecha_nacimiento: p.fecha_nacimiento
            }));

            const payload = {
                p_modalidad_id: parseInt(selectedModalidad),
                p_categoria_id: parseInt(selectedCategoriaId),
                p_academia: academia.trim(),
                p_personas: p_personas
            };

            const { data: inscripcionData, error } = await supabase.rpc("registrar_inscripcion", payload);

            if (error) throw error;

            // Enriquecer los datos para el PDF ya que el RPC no devuelve los nombres de categoría y tipo
            const categoryObj = categorias.find(c => c.id === parseInt(selectedCategoriaId));
            const enrichedData = {
                ...inscripcionData,
                categoria: categoryObj?.nombre || "N/A",
                tipo_participacion: selectedTipo?.nombre || (participants.length > 1 ? "Pareja" : "Individual")
            };

            setLastInscripcionData(enrichedData);
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
        setSelectedCategoriaId("");
        setAcademia("");
        setParticipants([]);
        setErrorMessage(null);
        setLastInscripcionData(null);
    };

    return {
        modalidades,
        tiposParticipacion,
        categorias,
        selectedModalidad,
        selectedTipo,
        selectedCategoriaId,
        academia,
        setAcademia,
        participants,
        loadingModalidades,
        loadingTipos,
        loadingCategorias,
        submitting,
        success,
        errorMessage,
        lastInscripcionData,
        handleModalidadChange,
        handleTipoChange,
        handleCategoriaChange,
        addParticipant,
        removeParticipant,
        handleParticipantChange,
        handleSubmit,
        handleReset,
    };

};
