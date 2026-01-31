import logoAsociacion from "../assets/images/logos/logo_asociacion.webp";

/**
 * Convierte una URL de imagen a Base64 de forma asíncrona.
 */
const imageToBase64 = async (url) => {
    try {
        const res = await fetch(url);
        const blob = await res.blob();
        return await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    } catch (e) {
        console.error("Error al convertir imagen a Base64:", e);
        return url;
    }
};

/**
 * Helper para formatear fecha MANUALMENTE y evitar bug de zona horaria (-1 día).
 * Convierte "YYYY-MM-DD" o ISO string a "D/M/YYYY" (formato Perú visual).
 */
const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    // Tomar solo la parte de la fecha YYYY-MM-DD
    const s = String(dateString).split("T")[0];
    const [year, month, day] = s.split("-");
    // Retornar en formato D/M/YYYY (sin ceros a la izquierda si se prefiere visualmente limpio, o tal cual)
    // Usamos parseInt para limpiar ceros a la izquierda del día y mes (ej: 03 -> 3)
    return `${parseInt(day)}/${parseInt(month)}/${year}`;
};

/**
 * Genera el PDF de la ficha de inscripción
 * Diseño formal y profesional tipo documento Word
 */
export const generateInscripcionPDF = async (inscripcion) => {

    if (!inscripcion || !inscripcion.id) {
        throw new Error("Datos de inscripción inválidos");
    }

    try {
        const logoBase64 = await imageToBase64(logoAsociacion);

        const modalidadNombre = inscripcion.modalidad || "General";
        const categoriaNombre = inscripcion.categoria || "N/A";
        const academia = inscripcion.academia || "N/A";
        const participantes = inscripcion.participantes || [];
        const tipoParticipacion = inscripcion.tipo_participacion || (participantes.length > 1 ? "PAREJA" : "INDIVIDUAL");
        const fechaRegistro = inscripcion.fecha_registro
            ? formatDate(inscripcion.fecha_registro)
            : "N/A";

        const htmlContent = `
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Calibri:wght@400;700&family=Arial&display=swap');
            
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            
            table {
                border-collapse: collapse;
                width: 100%;
            }
            
            th, td {
                text-align: left;
                vertical-align: top;
            }
        </style>

        <div style="
            font-family: 'Calibri', Arial, sans-serif;
            color: #000;
            width: 210mm;
            min-height: 297mm;
            margin: 0 auto;
            padding: 25mm 20mm;
            background: white;
        ">

            <!-- CABECERA TIPO WORD -->
            <div style="
                border-bottom: 2px solid #000;
                padding-bottom: 10px;
                margin-bottom: 15px;
            ">
                <table style="width: 100%;">
                    <tr>
                        <td style="width: 100px; vertical-align: top;">
                            <img src="${logoBase64}" style="width: 85px; height: auto;" />
                        </td>
                        <td style="vertical-align: middle; text-align: center;">
                            <div style="
                                font-size: 18px;
                                font-weight: 700;
                                color: #000;
                                text-transform: uppercase;
                                letter-spacing: 0.5px;
                                margin-bottom: 3px;
                            ">
                                Asociación Cultural Monsefú
                            </div>
                            <div style="
                                font-size: 15px;
                                font-weight: 700;
                                color: #000;
                                margin-bottom: 2px;
                            ">
                                Festival Golpe Tierra 2026
                            </div>
                            <div style="
                                font-size: 11px;
                                color: #333;
                            ">
                                Ficha de Inscripción Oficial
                            </div>
                        </td>
                        <td style="width: 120px; vertical-align: top; text-align: right;">
                            <div style="
                                border: 2px solid #000;
                                padding: 8px 12px;
                                display: inline-block;
                            ">
                                <div style="font-size: 10px; color: #333;">N° INSCRIPCIÓN</div>
                                <div style="font-size: 18px; font-weight: 700; color: #000;">
                                    ${inscripcion.id.toString().padStart(5, "0")}
                                </div>
                            </div>
                        </td>
                    </tr>
                </table>
            </div>

            <!-- INFORMACIÓN GENERAL -->
            <div style="margin-bottom: 15px;">
                <div style="
                    background: #000;
                    color: white;
                    padding: 5px 10px;
                    font-size: 12px;
                    font-weight: 700;
                    text-transform: uppercase;
                    margin-bottom: 8px;
                ">
                    Datos de la Inscripción
                </div>
                
                <table style="width: 100%; border: 1px solid #000;">
                    <tr>
                        <td style="
                            width: 35%;
                            padding: 6px 10px;
                            background: #f3f4f6;
                            border-right: 1px solid #000;
                            border-bottom: 1px solid #000;
                            font-weight: 700;
                            font-size: 11px;
                        ">Modalidad:</td>
                        <td style="
                            padding: 6px 10px;
                            border-bottom: 1px solid #000;
                            font-size: 11px;
                        ">${modalidadNombre}</td>
                    </tr>
                    <tr>
                        <td style="
                            padding: 6px 10px;
                            background: #f3f4f6;
                            border-right: 1px solid #000;
                            border-bottom: 1px solid #000;
                            font-weight: 700;
                            font-size: 11px;
                        ">Categoría:</td>
                        <td style="
                            padding: 6px 10px;
                            border-bottom: 1px solid #000;
                            font-size: 11px;
                        ">${categoriaNombre}</td>
                    </tr>
                    <tr>
                        <td style="
                            padding: 6px 10px;
                            background: #f3f4f6;
                            border-right: 1px solid #000;
                            border-bottom: 1px solid #000;
                            font-weight: 700;
                            font-size: 11px;
                        ">Tipo de Participación:</td>
                        <td style="
                            padding: 6px 10px;
                            border-bottom: 1px solid #000;
                            font-size: 11px;
                        ">${tipoParticipacion}</td>
                    </tr>
                    <tr>
                        <td style="
                            padding: 6px 10px;
                            background: #f3f4f6;
                            border-right: 1px solid #000;
                            font-weight: 700;
                            font-size: 11px;
                        ">Academia:</td>
                        <td style="
                            padding: 6px 10px;
                            font-size: 11px;
                        ">${academia}</td>
                    </tr>
                </table>
            </div>

            <!-- TABLA DE PARTICIPANTES -->
            <div style="margin-bottom: 15px;">
                <div style="
                    background: #000;
                    color: white;
                    padding: 5px 10px;
                    font-size: 12px;
                    font-weight: 700;
                    text-transform: uppercase;
                    margin-bottom: 8px;
                ">
                    Datos de Participantes
                </div>
                
                <table style="width: 100%; border: 1px solid #000;">
                    <thead>
                        <tr style="background: #f3f4f6;">
                            <th style="
                                padding: 6px 5px;
                                border-right: 1px solid #000;
                                border-bottom: 1px solid #000;
                                font-size: 10px;
                                font-weight: 700;
                                text-align: center;
                            ">N°</th>
                            <th style="
                                padding: 6px 5px;
                                border-right: 1px solid #000;
                                border-bottom: 1px solid #000;
                                font-size: 10px;
                                font-weight: 700;
                            ">Apellidos y Nombres</th>
                            <th style="
                                padding: 6px 5px;
                                border-right: 1px solid #000;
                                border-bottom: 1px solid #000;
                                font-size: 10px;
                                font-weight: 700;
                                text-align: center;
                            ">DNI</th>
                            <th style="
                                padding: 6px 5px;
                                border-right: 1px solid #000;
                                border-bottom: 1px solid #000;
                                font-size: 10px;
                                font-weight: 700;
                                text-align: center;
                            ">Sexo</th>
                            <th style="
                                padding: 6px 5px;
                                border-right: 1px solid #000;
                                border-bottom: 1px solid #000;
                                font-size: 10px;
                                font-weight: 700;
                                text-align: center;
                            ">Fecha Nac.</th>
                            <th style="
                                padding: 6px 5px;
                                border-bottom: 1px solid #000;
                                font-size: 10px;
                                font-weight: 700;
                                text-align: center;
                            ">Teléfono</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${participantes.map((p, idx) => `
                        <tr style="${idx % 2 === 0 ? 'background: #ffffff;' : 'background: #f9fafb;'}">
                            <td style="
                                padding: 6px 5px;
                                border-right: 1px solid #000;
                                ${idx < participantes.length - 1 ? 'border-bottom: 1px solid #000;' : ''}
                                font-size: 10px;
                                text-align: center;
                                font-weight: 700;
                            ">${idx + 1}</td>
                            <td style="
                                padding: 6px 5px;
                                border-right: 1px solid #000;
                                ${idx < participantes.length - 1 ? 'border-bottom: 1px solid #000;' : ''}
                                font-size: 10px;
                            ">${p.apellidos} ${p.nombres}</td>
                            <td style="
                                padding: 6px 5px;
                                border-right: 1px solid #000;
                                ${idx < participantes.length - 1 ? 'border-bottom: 1px solid #000;' : ''}
                                font-size: 10px;
                                text-align: center;
                            ">${p.dni}</td>
                            <td style="
                                padding: 6px 5px;
                                border-right: 1px solid #000;
                                ${idx < participantes.length - 1 ? 'border-bottom: 1px solid #000;' : ''}
                                font-size: 10px;
                                text-align: center;
                            ">${p.sexo === "F" ? "F" : "M"}</td>
                            <td style="
                                padding: 6px 5px;
                                border-right: 1px solid #000;
                                ${idx < participantes.length - 1 ? 'border-bottom: 1px solid #000;' : ''}
                                font-size: 10px;
                                text-align: center;
                            ">${p.fecha_nacimiento ? formatDate(p.fecha_nacimiento) : "N/A"}</td>
                            <td style="
                                padding: 6px 5px;
                                ${idx < participantes.length - 1 ? 'border-bottom: 1px solid #000;' : ''}
                                font-size: 10px;
                                text-align: center;
                            ">${p.telefono}</td>
                        </tr>
                        `).join("")}
                    </tbody>
                </table>
            </div>

            <!-- PIE DE PÁGINA -->
            <div style="
                margin-top: 15px;
                padding: 10px;
                background: #f9fafb;
                border: 1px solid #000;
                font-size: 10px;
            ">
                <div style="margin-bottom: 6px;">
                    <strong>Fecha de Inscripción:</strong> ${fechaRegistro}
                </div>
                <div>
                    <strong>Observaciones:</strong> _______________________________________________
                </div>
            </div>

            <!-- FIRMA -->
            <div style="margin-top: 30px; text-align: center;">
                <div style="
                    border-top: 1.5px solid #000;
                    padding-top: 6px;
                    margin: 0 auto;
                    width: 280px;
                ">
                    <div style="font-size: 11px; font-weight: 700;">
                        FIRMA DEL PARTICIPANTE
                    </div>
                    <div style="font-size: 9px; color: #333; margin-top: 3px;">
                        DNI: _______________
                    </div>
                </div>
            </div>

        </div>
        `;

        const opt = {
            margin: 0,
            filename: `ficha_inscripcion_${inscripcion.id}.pdf`,
            image: { type: "jpeg", quality: 0.98 },
            html2canvas: { scale: 2.5, useCORS: true },
            jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }
        };

        const html2pdf = (await import("html2pdf.js")).default;
        await html2pdf().set(opt).from(htmlContent).save();

    } catch (err) {
        console.error(err);
        throw new Error("Error al generar PDF");
    }
};