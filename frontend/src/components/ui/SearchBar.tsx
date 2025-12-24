import { useState } from 'react';
import { Search, MapPin, Loader2, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { BearSighting } from '@/types/bear'; 
import { searchBearData } from '@/services/bearService';
import { SearchBarProps } from '@/types/search';
import { useLanguage } from '@/context/LanguageContext';

const ITEMS_PER_PAGE = 10;

export default function SearchBar({ year, onSelectLocation, onSearchComplete }: SearchBarProps) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<BearSighting[]>([]);
    const [loading, setLoading] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const { lang, t } = useLanguage();

    const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

    const fetchResults = async (searchQuery: string, page: number) => {
        setLoading(true);
        try {
            const data = await searchBearData(searchQuery, year, lang, page, ITEMS_PER_PAGE);
            setResults(data || []);
            // Lấy total_count từ item đầu tiên (API trả về trong mỗi item)
            if (data && data.length > 0 && data[0].total_count) {
                setTotalCount(parseInt(data[0].total_count, 10));
            } else {
                setTotalCount(0);
            }
            if (onSearchComplete) {
                onSearchComplete(data || []);
            }
        } catch (error) {
            console.error("Lỗi tìm kiếm:", error);
            setResults([]);
            setTotalCount(0);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async (e: React.FormEvent) => {
        console.log('Searching for:', query, 'Year:', year, 'Lang:', lang);
        e.preventDefault();
        if (!query.trim()) return;

        setCurrentPage(1);
        await fetchResults(query, 1);
    };

    const handlePageChange = async (newPage: number) => {
        if (newPage < 1 || newPage > totalPages || loading) return;
        setCurrentPage(newPage);
        await fetchResults(query, newPage);
    };

    const handleClear = () => {
        setQuery('');
        setResults([]);
        setCurrentPage(1);
        setTotalCount(0);
    };

    return (
        <div className={`absolute top-0 left-0 h-full z-10 bg-white shadow-xl transition-all duration-300 flex flex-col font-sans
            ${isExpanded ? 'w-80' : 'w-0'}`}
        >
            <button 
                onClick={() => setIsExpanded(!isExpanded)}
                className="absolute -right-8 top-4 bg-white p-1.5 rounded-r-md shadow-md hover:bg-gray-100 border border-l-0 border-gray-200 z-50 flex items-center justify-center"
                title={isExpanded ? t.searchBar.collapse : t.searchBar.expand}
            >
                {isExpanded ? <ChevronLeft className="w-5 h-5 text-gray-600"/> : <ChevronRight className="w-5 h-5 text-gray-600"/>}
            </button>

            <div className={`flex flex-col h-full ${!isExpanded && 'hidden'}`}>
                <div className="p-4 shadow-sm z-20 bg-white border-b border-gray-100">
                    <form onSubmit={handleSearch} className="relative flex items-center">
                        <input
                            type="text"
                            className="w-full pl-10 pr-4 py-2 text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-all"
                            placeholder={t.searchBar.searchPlaceholder}
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                        <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
                        
                        {query && (
                            <button 
                                type="button" 
                                onClick={handleClear}
                                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </form>
                </div>

                <div className="flex-1 overflow-y-auto bg-gray-50 scrollbar-thin scrollbar-thumb-gray-200">
                    {loading ? (
                        <div className="flex justify-center items-center py-10">
                            <Loader2 className="animate-spin text-blue-500 w-6 h-6" />
                        </div>
                    ) : (
                        <div className="p-2 space-y-2">
                            {results.length > 0 ? (
                                results.map((item, index) => (
                                    <div 
                                        key={index}
                                        onClick={() => onSelectLocation(item)}
                                        className="bg-white p-3 rounded-lg shadow-sm hover:shadow-md cursor-pointer transition-all border border-gray-100 group hover:border-blue-200"
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className="mt-1 p-2 bg-blue-50 rounded-full group-hover:bg-blue-100 transition-colors">
                                                <MapPin className="w-4 h-4 text-blue-600" />
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-gray-800 text-sm line-clamp-1">{item.name || t.searchBar.unnamedLocation}</h4>
                                                <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                                                    {item.description || `${t.searchBar.bearDataYear} ${year}`}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                query && !loading && (
                                    <div className="text-center text-gray-500 mt-10 text-sm">
                                        {t.searchBar.noResults}
                                    </div>
                                )
                            )}
                        </div>
                    )}
                </div>

                {/* Pagination Controls */}
                {results.length > 0 && totalPages > 1 && (
                    <div className="p-3 bg-white border-t border-gray-200 flex items-center justify-between">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1 || loading}
                            className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-md border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronLeft className="w-4 h-4" />
                            {t.searchBar.prev}
                        </button>
                        
                        <span className="text-sm text-gray-600">
                            {t.searchBar.page} {currentPage} / {totalPages}
                        </span>
                        
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages || loading}
                            className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-md border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {t.searchBar.next}
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}