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
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700&family=Plus+Jakarta+Sans:wght@700;800&display=swap');
            </style>
            <div style="font-family: 'Inter', sans-serif; color: #333; background: #fff; width: 720px; margin: 0 auto; padding: 40px; box-sizing: border-box; line-height: 1.4; position: relative;">
                
                <!-- ID BOX SUPERIOR IZQUIERDA -->
                <div style="position: absolute; top: 40px; left: 40px; border: 3px solid #4a7eba; padding: 12px 25px; font-weight: 800; font-size: 20px; color: #333; background: #fff; z-index: 10; font-family: 'Plus Jakarta Sans', sans-serif;">
                    ${inscripcion.id.toString().padStart(5, '0')}
                </div>

                <!-- LOGO BAJO EL ID -->
                <div style="position: absolute; top: 110px; left: 40px; z-index: 10;">
                    <img src="${logoBase64}" style="width: 110px; height: auto;" />
                </div>

                <!-- CABECERA CENTRAL -->
                <div style="text-align: center; margin-bottom: 50px;">
                    <h1 style="margin: 0; color: #4a7eba; font-size: 28px; font-weight: 800; letter-spacing: -0.02em; text-transform: uppercase; font-family: 'Plus Jakarta Sans', sans-serif;">
                        FESTIVAL GOLPE TIERRA 2026
                    </h1>
                    <p style="margin: 8px 0; color: #4a7eba; font-size: 20px; font-style: normal; font-weight: 700; font-family: 'Plus Jakarta Sans', sans-serif;">
                        organiza: &nbsp; AC Monsefú
                    </p>

                    <!-- CAJA DE ETAPA (ELIMINATORIAS ESTILO) -->
                    <div style="display: inline-block; border: 2.5px solid #000; padding: 6px 70px; margin: 15px 0; font-weight: 800; font-size: 16px; text-transform: uppercase; letter-spacing: 1px; font-family: 'Plus Jakarta Sans', sans-serif;">
                        2026 - REGISTRO OFICIAL
                    </div>

                    <p style="margin: 5px 0; font-size: 14px; font-weight: 700; color: #333; text-transform: uppercase; font-family: 'Plus Jakarta Sans', sans-serif;">
                        FECHA DEL EVENTO: ${fechaEvento}
                    </p>

                    <!-- CATEGORIA / MODALIDAD -->
                    <h2 style="margin: 35px 0 10px 0; color: #4a7eba; font-size: 24px; font-weight: 800; text-transform: uppercase; letter-spacing: 2px; font-family: 'Plus Jakarta Sans', sans-serif;">
                        MODALIDAD : ${modalidadNombre}
                    </h2>
                </div>

                <!-- SECCIÓN DE PARTICIPANTES -->
                <div style="margin-left: 100px; margin-top: 20px;">
                    ${participantes.map((p) => `
                        <div style="margin-bottom: 45px;">
                            <p style="text-decoration: underline; font-weight: 800; font-size: 16px; margin-bottom: 22px; text-transform: uppercase; color: #333; letter-spacing: 1px; font-family: 'Plus Jakarta Sans', sans-serif;">
                                DATOS ${p.sexo === 'F' ? 'MUJER' : 'HOMBRE'}
                            </p>
                            
                            <table style="width: 100%; border-collapse: collapse; font-size: 14.5px; color: #333; font-family: 'Inter', sans-serif;">
                                <tr>
                                    <td style="width: 200px; padding: 6px 0; font-weight: 700;">- NOMBRES :</td>
                                    <td style="font-weight: 400; text-transform: uppercase;">${p.nombres}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 6px 0; font-weight: 700;">- APELLIDOS :</td>
                                    <td style="font-weight: 400; text-transform: uppercase;">${p.apellidos}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 6px 0; font-weight: 700;">- DOCUMENTO IDENTIDAD :</td>
                                    <td style="font-weight: 400;">${p.dni}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 6px 0; font-weight: 700;">- TELEFONO :</td>
                                    <td style="font-weight: 400;">${p.telefono}</td>
                                </tr>
                            </table>
                        </div>
                    `).join('')}
                </div>

                <!-- FOOTER - FECHA Y OBSERVACIONES -->
                <div style="margin-top: 80px; padding-top: 15px; border-top: 1.5px solid #666; font-size: 14px; color: #444; font-weight: 400; font-family: 'Inter', sans-serif;">
                    <p style="margin: 8px 0;">++++++ FECHA DE INSCRIPCION: ${fechaRegistro}</p>
                    <p style="margin: 8px 0;">++++++ OBSERVACIONES: ________________________________________________</p>
                </div>

                <!-- ZONA DE FIRMA -->
                <div style="margin-top: 60px; text-align: center;">
                    <div style="display: inline-block; width: 350px; border-top: 1.5px solid #000; padding-top: 10px;">
                        <p style="margin: 0; font-size: 13px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px; font-family: 'Plus Jakarta Sans', sans-serif;">FIRMA DEL PARTICIPANTE</p>
                    </div>
                </div>
            </div>
        `;

        const opt = {
            margin: [0, 0, 0, 0],
            filename: `ficha_inscripcion_${inscripcion.id}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: {
                scale: 2.5,
                useCORS: true,
                letterRendering: true
            },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        await html2pdf().set(opt).from(htmlContent).save();
        console.log("PDF generado con éxito (Tipografía actualizada, Estructura original).");

    } catch (err) {
        console.error("Error crítico:", err);
        alert("Falla en la generación del PDF.");
    }
};
