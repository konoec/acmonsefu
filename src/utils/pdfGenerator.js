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
 * Genera el PDF de la ficha de inscripción
 * Estilo institucional fino (Club Libertad).
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
            ? new Date(inscripcion.fecha_registro).toLocaleDateString("es-PE")
            : "N/A";

        const htmlContent = `
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Plus+Jakarta+Sans:wght@500;600&display=swap');
        </style>

        <div style="
            font-family: 'Inter', sans-serif;
            color: #333;
            width: 720px;
            margin: 0 auto;
            padding: 40px;
            position: relative;
            line-height: 1.5;
        ">

            <!-- NÚMERO DE INSCRIPCIÓN (CENTRADO REAL) -->
            <div style="
                position:absolute;
                top:40px;
                left:40px;
                width:120px;
                height:50px;
                border:2px solid #4a7eba;
                display:flex;
                align-items:center;
                justify-content:center;
                font-size:18px;
                font-weight:500;
                line-height:1;
                padding:0;
                font-family:'Plus Jakarta Sans', sans-serif;
            ">
                ${inscripcion.id.toString().padStart(5, "0")}
            </div>

            <!-- LOGO -->
            <div style="position:absolute; top:105px; left:40px;">
                <img src="${logoBase64}" style="width:95px;" />
            </div>

            <!-- CABECERA -->
            <div style="text-align:center; margin-bottom:25px;">
                <h1 style="
                    margin:0;
                    font-size:26px;
                    font-weight:600;
                    color:#4a7eba;
                    font-family:'Plus Jakarta Sans', sans-serif;
                ">
                    FESTIVAL GOLPE TIERRA 2026
                </h1>

                <p style="
                    margin:6px 0 12px;
                    font-size:16px;
                    font-weight:500;
                    color:#4a7eba;
                ">
                    organiza: AC Monsefú
                </p>

                <!-- RECTÁNGULO REGISTRO (CENTRADO REAL) -->
                <div style="
                    width:420px;
                    height:40px;
                    margin:0 auto;
                    border:2px solid #000;
                    display:flex;
                    align-items:center;
                    justify-content:center;
                    font-size:14px;
                    font-weight:500;
                    line-height:1;
                    padding:0;
                    text-transform:uppercase;
                    font-family:'Plus Jakarta Sans', sans-serif;
                ">
                    2026 - REGISTRO OFICIAL
                </div>
            </div>

            <!-- INFO GENERAL -->
            <div style="
                margin-left:110px;
                border:1px solid #4a7eba;
                padding:14px;
                margin-bottom:28px;
            ">
                <table style="width:100%; font-size:14px;">
                    <tr><td style="width:160px; color:#4a7eba;">MODALIDAD:</td><td>${modalidadNombre}</td></tr>
                    <tr><td style="color:#4a7eba;">CATEGORÍA:</td><td>${categoriaNombre}</td></tr>
                    <tr><td style="color:#4a7eba;">TIPO PARTICIPACIÓN:</td><td>${tipoParticipacion}</td></tr>
                </table>
            </div>

            <!-- PARTICIPANTES -->
            <div style="margin-left:110px;">
                ${participantes.map((p, idx) => `
                <div style="margin-bottom:26px;">
                    <div style="
                        font-size:14px;
                        font-weight:600;
                        margin-bottom:10px;
                        text-decoration:underline;
                    ">
                        PARTICIPANTE ${idx + 1} (${p.sexo === "F" ? "DAMA" : "VARÓN"})
                    </div>

                    <table style="width:100%; font-size:13.5px;">
                        <tr><td style="width:190px;">- NOMBRES :</td><td>${p.nombres}</td></tr>
                        <tr><td>- APELLIDOS :</td><td>${p.apellidos}</td></tr>
                        <tr><td>- FECHA DE NACIMIENTO :</td><td>${p.fecha_nacimiento ? new Date(p.fecha_nacimiento).toLocaleDateString("es-PE") : "N/A"}</td></tr>
                        <tr><td>- DNI :</td><td>${p.dni}</td></tr>
                        <tr><td>- TELÉFONO :</td><td>${p.telefono}</td></tr>
                        <tr><td>- ACADEMIA :</td><td>${academia}</td></tr>
                    </table>
                </div>
                `).join("")}
            </div>

            <!-- FOOTER -->
            <div style="
                margin-top:35px;
                padding-top:14px;
                border-top:1px solid #777;
                font-size:13px;
            ">
                <p>++++++ FECHA DE INSCRIPCIÓN: ${fechaRegistro}</p>
                <p>++++++ OBSERVACIONES: ________________________________________________</p>
            </div>

            <!-- FIRMA -->
            <div style="margin-top:45px; text-align:center;">
                <div style="width:340px; margin:auto; border-top:1px solid #000; padding-top:8px;">
                    <span style="font-size:13px; font-weight:600;">
                        FIRMA DEL PARTICIPANTE
                    </span>
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
