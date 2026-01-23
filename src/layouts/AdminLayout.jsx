import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function AdminLayout() {
    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <main className="pt-24 lg:pt-32">
                <Outlet />
            </main>
        </div>
    );
}
