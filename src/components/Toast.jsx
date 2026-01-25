import React, { useEffect, useState } from 'react';

export default function Toast({ message, type = 'error', onClose, duration = 4000 }) {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(onClose, 300); // Wait for fade-out animation
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    const bgClass = type === 'success' ? 'bg-green-600' : type === 'error' ? 'bg-red-600' : 'bg-gray-900';
    const icon = type === 'success' ? (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
        </svg>
    ) : (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    );

    return (
        <div className={`fixed bottom-8 right-8 z-[200] transition-all duration-300 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
            <div className={`${bgClass} text-white px-5 py-4 rounded-sm shadow-2xl flex items-start gap-4 min-w-[320px] max-w-lg border-l-4 border-white/20`}>
                <div className="flex-shrink-0 bg-white/20 p-2 rounded-full mt-0.5">
                    {icon}
                </div>
                <div className="flex-grow">
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] leading-tight opacity-70">
                        {type === 'success' ? 'Notificación' : 'Sistema de Alerta'}
                    </p>
                    <p className="text-[12px] md:text-[13px] font-bold tracking-tight mt-1 leading-normal">
                        {message}
                    </p>
                </div>
                <button
                    onClick={() => { setIsVisible(false); setTimeout(onClose, 300); }}
                    className="flex-shrink-0 hover:bg-white/10 p-1 rounded-sm transition-colors text-white/60 hover:text-white mt-0.5"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
        </div>
    );
}
