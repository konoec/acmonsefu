// src/router/AppRouter.jsx
import { Routes, Route, Navigate } from "react-router-dom";

import PublicLayout from "../layouts/PublicLayout.jsx";
import PublicLanding from "../pages/public/index.jsx";
import Login from "../pages/public/Login.jsx";
import ConsultaInscripcion from "../pages/public/ConsultaInscripcion.jsx";

import Panel from "../pages/admin/Inscripciones.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";

import AdminLayout from "../layouts/AdminLayout.jsx";

export default function AppRouter() {
  return (
    <Routes>

      {/* ===================== */}
      {/* RUTAS PÚBLICAS */}
      {/* ===================== */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<PublicLanding />} />
        <Route path="/login" element={<Login />} />
        <Route path="/consulta" element={<ConsultaInscripcion />} />
      </Route>

      {/* ===================== */}
      {/* ADMIN PROTEGIDO */}
      {/* ===================== */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Panel />} />
        {/* Aquí puedes agregar más rutas internas como /admin/inscripciones */}
        <Route path="inscripciones" element={<Panel />} />
      </Route>

      {/* ===================== */}
      {/* 404 */}
      {/* ===================== */}
      <Route path="*" element={<Navigate to="/" replace />} />

    </Routes>
  );
}
