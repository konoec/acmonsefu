import html2pdf from "html2pdf.js";
import logoAsociacion from "../assets/images/logos/logo_asociacion.png";

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
 * Genera y descarga el PDF de la ficha de inscripción.
 * Basado en el diseño institucional de festivales tradicionales (estilo Club Libertad).
 */
export const generateInscripcionPDF = async (inscripcion) => {
    console.log("Iniciando generación de PDF con datos:", inscripcion);

    if (!inscripcion || !inscripcion.id) {
        alert("Error: Datos de inscripción no válidos.");
        return;
    }

    try {
        const logoBase64 = await imageToBase64(logoAsociacion);
        const modalidadNombre = inscripcion.modalidad || "General";
        const participantes = inscripcion.participantes || [];
        const fechaRegistro = inscripcion.fecha_registro ? new Date(inscripcion.fecha_registro).toLocaleDateString('es-PE') : "N/A";
        const fechaEvento = "22 de Febrero, 2026";

        const htmlContent = `
            <div style="font-family: 'Times New Roman', Times, serif; color: #333; background: #fff; width: 720px; margin: 0 auto; padding: 40px; box-sizing: border-box; line-height: 1.2;">
                
                <!-- ID BOX SUPERIOR IZQUIERDA -->
                <div style="position: absolute; top: 40px; left: 40px; border: 3px solid #4a7eba; padding: 12px 25px; font-weight: bold; font-size: 20px; color: #333; background: #fff; z-index: 10;">
                    ${inscripcion.id.toString().padStart(5, '0')}
                </div>

                <!-- LOGO BAJO EL ID -->
                <div style="position: absolute; top: 110px; left: 40px; z-index: 10;">
                    <img src="${logoBase64}" style="width: 110px; height: auto;" />
                </div>

                <!-- CABECERA CENTRAL -->
                <div style="text-align: center; margin-bottom: 50px;">
                    <h1 style="margin: 0; color: #4a7eba; font-size: 28px; font-weight: normal; letter-spacing: 0.5px; text-transform: uppercase; font-family: 'Times New Roman', Times, serif;">
                        FESTIVAL GOLPE TIERRA 2026
                    </h1>
                    <p style="margin: 8px 0; color: #4a7eba; font-size: 22px; font-style: normal; font-weight: normal;">
                        organiza: &nbsp; AC Monsefú
                    </p>

                    <!-- CAJA DE ETAPA (ELIMINATORIAS ESTILO) -->
                    <div style="display: inline-block; border: 2.5px solid #000; padding: 6px 70px; margin: 15px 0; font-weight: bold; font-size: 16px; text-transform: uppercase; letter-spacing: 1px;">
                        2026 - REGISTRO OFICIAL
                    </div>

                    <p style="margin: 5px 0; font-size: 14px; font-weight: bold; color: #333; text-transform: uppercase;">
                        FECHA DEL EVENTO: ${fechaEvento}
                    </p>

                    <!-- CATEGORIA / MODALIDAD -->
                    <h2 style="margin: 35px 0 10px 0; color: #4a7eba; font-size: 24px; font-weight: normal; text-transform: uppercase; letter-spacing: 3px;">
                        MODALIDAD : ${modalidadNombre}
                    </h2>
                </div>

                <!-- SECCIÓN DE PARTICIPANTES -->
                <div style="margin-left: 100px; margin-top: 20px;">
                    ${participantes.map((p) => `
                        <div style="margin-bottom: 45px;">
                            <p style="text-decoration: underline; font-weight: bold; font-size: 16px; margin-bottom: 22px; text-transform: uppercase; color: #333; letter-spacing: 1px;">
                                DATOS ${p.sexo === 'F' ? 'MUJER' : 'HOMBRE'}
                            </p>
                            
                            <table style="width: 100%; border-collapse: collapse; font-size: 14.5px; color: #333;">
                                <tr>
                                    <td style="width: 200px; padding: 6px 0;">- NOMBRES :</td>
                                    <td style="font-weight: normal; text-transform: uppercase;">${p.nombres}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 6px 0;">- APELLIDOS :</td>
                                    <td style="font-weight: normal; text-transform: uppercase;">${p.apellidos}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 6px 0;">- DOCUMENTO IDENTIDAD :</td>
                                    <td style="font-weight: normal;">${p.dni}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 6px 0;">- TELEFONO :</td>
                                    <td style="font-weight: normal;">${p.telefono}</td>
                                </tr>
                            </table>
                        </div>
                    `).join('')}
                </div>

                <!-- FOOTER - FECHA Y OBSERVACIONES -->
                <div style="margin-top: 80px; padding-top: 15px; border-top: 1.5px solid #666; font-size: 15px; color: #444; font-weight: normal;">
                    <p style="margin: 8px 0; letter-spacing: 0.5px;">++++++ FECHA DE INSCRIPCION: ${fechaRegistro}</p>
                    <p style="margin: 8px 0; letter-spacing: 0.5px;">++++++ OBSERVACIONES:</p>
                </div>

                <!-- ZONA DE FIRMA -->
                <div style="margin-top: 60px; text-align: center;">
                    <div style="display: inline-block; width: 350px; border-top: 1.5px solid #000; padding-top: 10px;">
                        <p style="margin: 0; font-size: 13px; font-weight: bold; text-transform: uppercase; letter-spacing: 1.5px;">FIRMA DEL PARTICIPANTE</p>
                    </div>
                </div>
            </div>
        `;

        const opt = {
            margin: [0, 0, 0, 0], // Manejamos el padding internamente para control total
            filename: `ficha_inscripcion_${inscripcion.id}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: {
                scale: 2.5, // Aumento de escala para mayor nitidez tipográfica
                useCORS: true,
                letterRendering: true
            },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        await html2pdf().set(opt).from(htmlContent).save();
        console.log("PDF generado con éxito (Diseño Institucional Refinado).");

    } catch (err) {
        console.error("Error crítico:", err);
        alert("Falla en la generación del PDF.");
    }
};
