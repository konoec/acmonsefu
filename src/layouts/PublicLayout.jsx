// src/layouts/PublicLayout.jsx
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function PublicLayout() {
  return (
    <div className="min-h-screen bg-white text-gray-800">
      <Navbar />

      <main>
        <Outlet />
      </main>
    </div>
  );
}
