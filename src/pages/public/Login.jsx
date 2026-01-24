import { useState } from "react";
import { supabase } from "../../supabaseClient";
import { useNavigate } from "react-router-dom";
import logoFestival from "../../assets/images/logos/logo_asociacion.png";
import RunningStamp from "../../components/RunningStamp";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;

            console.log("Login successful:", data);
            navigate("/admin");
        } catch (err) {
            setError(err.message || "Error al iniciar sesión. Verifique sus credenciales.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="min-h-screen flex items-center justify-center bg-[#FDFBF7] relative overflow-hidden font-body py-20 px-6">

            {/* Carrusel Dinámico de Marcas de Agua */}
            <RunningStamp />

            {/* Elementos decorativos de fondo */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-100/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-red-100/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2"></div>

            <div className="w-full max-w-md relative z-10">

                {/* Header Estilo Editorial */}
                <div className="text-center mb-10">
                    <div className="flex items-center justify-center gap-4 mb-6">
                        <img src={logoFestival} alt="Festival Golpe Tierra" className="h-16 w-auto object-contain" />
                        <div className="h-10 w-px bg-gray-200"></div>
                        <span className="text-[11px] font-bold tracking-[0.3em] text-orange-600 uppercase opacity-80">
                            OPERACIONES
                        </span>
                    </div>
                    <h1 className="font-heading text-4xl font-extrabold text-gray-900 mb-2 tracking-tight">
                        Acceso Interno
                    </h1>
                </div>

                {/* Card Técnica */}
                <div className="bg-white p-8 md:p-10 rounded-sm shadow-[0_25px_50px_-12px_rgba(0,0,0,0.08)] border border-gray-100 relative">
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-2" htmlFor="email">
                                Identificador (Email)
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 bg-gray-50/50 border border-gray-100 rounded-sm focus:outline-none focus:border-orange-500 focus:bg-white transition-all duration-300 text-gray-900 text-sm font-medium"
                                placeholder="usuario@golpetierra.com"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-2" htmlFor="password">
                                Clave de Acceso
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 bg-gray-50/50 border border-gray-100 rounded-sm focus:outline-none focus:border-orange-500 focus:bg-white transition-all duration-300 text-gray-900 text-sm font-medium"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        {error && (
                            <div className="p-4 bg-red-50 text-red-600 rounded-sm text-[11px] font-bold uppercase tracking-wider flex items-center gap-3 border border-red-100">
                                <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-gray-900 hover:bg-orange-600 text-white text-[11px] font-bold tracking-[0.2em] uppercase rounded-sm transition-all duration-300 shadow-sm flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group"
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Verificando...
                                </span>
                            ) : (
                                <>
                                    Ingresar al Sistema
                                    <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" strokeWidth={3}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-gray-50 flex justify-between items-center text-[9px] text-gray-400 font-bold uppercase tracking-[0.1em]">
                        <span>© 2026 Golpe Tierra</span>
                        <span>v1.0.4 - Producción</span>
                    </div>

                </div>
            </div>
        </section>
    );
}
