export default function Pagination({
    currentPage,
    totalItems,
    itemsPerPage,
    onPageChange,
    onItemsPerPageChange
}) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    return (
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 bg-white p-6 border-t border-gray-100 font-body">
            {/* Rows per page selector */}
            <div className="flex items-center gap-3 order-2 lg:order-1">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Filas por página:</span>
                <select
                    value={itemsPerPage}
                    onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
                    className="bg-gray-50 border border-gray-100 rounded-sm px-3 py-1.5 text-[11px] font-bold text-gray-700 focus:border-orange-500 outline-none transition-all cursor-pointer"
                >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                </select>
            </div>

            {/* Pagination Stats */}
            <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest order-1 lg:order-2">
                Mostrando <span className="text-gray-900">{startItem}</span> - <span className="text-gray-900">{endItem}</span> de <span className="text-gray-900">{totalItems}</span> registros
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center gap-2 order-3">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 border border-gray-100 rounded-sm hover:bg-orange-50 hover:text-orange-600 disabled:opacity-20 disabled:hover:bg-transparent disabled:hover:text-gray-400 transition-all text-gray-500"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>

                <div className="flex items-center gap-1">
                    {totalPages <= 1 ? (
                        <button
                            disabled
                            className="min-w-[32px] h-8 text-[11px] font-bold uppercase tracking-widest rounded-sm transition-all border bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed"
                        >
                            1
                        </button>
                    ) : (
                        [...Array(totalPages)].map((_, i) => {
                            const pageNum = i + 1;
                            if (totalPages > 5 && Math.abs(pageNum - currentPage) > 1 && pageNum !== 1 && pageNum !== totalPages) {
                                if (Math.abs(pageNum - currentPage) === 2) return <span key={pageNum} className="px-1 text-gray-300">...</span>;
                                return null;
                            }

                            return (
                                <button
                                    key={pageNum}
                                    onClick={() => onPageChange(pageNum)}
                                    className={`min-w-[32px] h-8 text-[11px] font-bold uppercase tracking-widest rounded-sm transition-all border
                                        ${currentPage === pageNum
                                            ? 'bg-gray-900 text-white border-gray-900 shadow-sm'
                                            : 'bg-white text-gray-400 border-gray-100 hover:border-orange-200 hover:text-orange-600'}`}
                                >
                                    {pageNum}
                                </button>
                            );
                        })
                    )}
                </div>

                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages || totalPages <= 1}
                    className="p-2 border border-gray-100 rounded-sm hover:bg-orange-50 hover:text-orange-600 disabled:opacity-20 disabled:hover:bg-transparent disabled:hover:text-gray-400 transition-all text-gray-500"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>
        </div>
    );
}
