// src/router/AppRouter.jsx
import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Preloader from "../components/Preloader";

import PublicLayout from "../layouts/PublicLayout.jsx";
import PublicLanding from "../pages/public/index.jsx";
import Login from "../pages/public/Login.jsx";

import Panel from "../pages/admin/Inscripciones.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";

import AdminLayout from "../layouts/AdminLayout.jsx";

export default function AppRouter() {
  const [loading, setLoading] = useState(true);

  return (
    <>
      {loading && (
        <Preloader onFinish={() => setLoading(false)} />
      )}

      <Routes>

        {/* ===================== */}
        {/* RUTAS PÚBLICAS */}
        {/* ===================== */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<PublicLanding />} />
          <Route path="/login" element={<Login />} />
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
    </>
  );
}
