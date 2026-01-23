import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import logoAsociacion from "../assets/images/logos/logo_asociacion.png";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [session, setSession] = useState(null);
  const location = useLocation();
  const isHome = location.pathname === "/";

  const navigate = useNavigate();


  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsOpen(false);
    // Redirigir a la raíz del sitio
    navigate("/");
  };

  // Helper to determine the correct target link
  const getLinkTarget = (path) => {
    if (path.startsWith("#")) {
      return isHome ? path : `/${path}`;
    }
    return path;
  };

  const navItems = [
    { name: "Inicio", path: "#inicio" },
    { name: "Bases", path: "#bases" },
    { name: "Modalidades", path: "#modalidades" },
    { name: "Inscripción", path: "#inscripcion" },
  ];

  // Si hay sesión, añadir el módulo de Gestión
  if (session) {
    navItems.push({ name: "Gestión", path: "/admin/inscripciones" });
  }

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100 font-body">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-3 lg:py-4">
        <div className="grid grid-cols-2 lg:grid-cols-3 items-center gap-4">

          {/* LOGOS - IZQUIERDA */}
          <div className="flex items-center gap-3 lg:gap-4 z-50 relative justify-start">
            <Link to="/" className="flex items-center gap-3 lg:gap-4 group" onClick={() => setIsOpen(false)}>
              <img
                src={logoAsociacion}
                alt="Asociación Cultural"
                className="h-10 lg:h-12 w-auto object-contain"
              />
            </Link>
          </div>

          {/* DESKTOP NAVIGATION - CENTRO */}
          <div className="hidden lg:flex justify-center">
            <ul className="flex items-center gap-8">
              {navItems.map((item, index) => {
                const target = getLinkTarget(item.path);
                const isHash = target.startsWith("#");

                return (
                  <li key={index}>
                    {isHash ? (
                      <a
                        href={target}
                        className="relative text-[13px] font-bold text-gray-700 uppercase tracking-widest hover:text-orange-600 transition-colors py-2 group"
                      >
                        {item.name}
                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-orange-600 transition-all duration-300 group-hover:w-full"></span>
                      </a>
                    ) : (
                      <Link
                        to={target}
                        className={`relative text-[13px] font-bold uppercase tracking-widest transition-colors py-2 group
                          ${location.pathname === target ? 'text-orange-600' : 'text-gray-700 hover:text-orange-600'}`}
                      >
                        {item.name}
                        <span className={`absolute bottom-0 left-0 h-0.5 bg-orange-600 transition-all duration-300 group-hover:w-full ${location.pathname === target ? 'w-full' : 'w-0'}`}></span>
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>

          {/* ACCIONES - DERECHA */}
          <div className="flex items-center justify-end gap-4">
            {/* LOGIN / LOGOUT ICON - DESKTOP */}
            {session ? (
              <button
                onClick={handleLogout}
                className="hidden lg:flex items-center gap-2 px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-red-500 hover:bg-red-50 rounded-sm transition-all duration-300 border border-transparent hover:border-red-100"
                title="Cerrar Sesión"
              >
                Cerrar Sesión
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            ) : (
              <Link
                to="/login"
                className="hidden lg:flex items-center gap-2 px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded-sm transition-all duration-300"
                title="Acceso Operador"
              >
                Acceso
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </Link>
            )}

            {/* MOBILE MENU TOGGLE */}
            <div className="flex lg:hidden z-50 relative">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-gray-900 p-2 hover:bg-gray-100 rounded-sm transition-colors focus:outline-none"
              >
                {isOpen ? (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* MOBILE MENU DROPDOWN */}
        <div className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
          <div className="flex flex-col gap-1 py-4 border-t border-gray-100">
            {navItems.map((item, index) => {
              const target = getLinkTarget(item.path);
              const isHash = target.startsWith("#");

              return (
                <div key={index}>
                  {isHash ? (
                    <a
                      href={target}
                      onClick={() => setIsOpen(false)}
                      className="block px-4 py-3 text-xs font-bold text-gray-700 uppercase tracking-widest hover:bg-orange-50 hover:text-orange-700 rounded-sm transition-colors"
                    >
                      {item.name}
                    </a>
                  ) : (
                    <Link
                      to={target}
                      onClick={() => setIsOpen(false)}
                      className={`block px-4 py-3 text-xs font-bold uppercase tracking-widest rounded-sm transition-colors
                        ${location.pathname === target ? 'bg-orange-50 text-orange-700' : 'text-gray-700 hover:bg-gray-50'}`}
                    >
                      {item.name}
                    </Link>
                  )}
                </div>
              );
            })}

            {/* Acceso / Logout Mobile */}
            {session ? (
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-4 mt-2 text-[10px] font-black text-red-600 uppercase tracking-[0.2em] bg-red-50/50 rounded-sm"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Cerrar Sesión
              </button>
            ) : (
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-4 mt-2 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] bg-gray-50 rounded-sm"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Acceso Operador
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

