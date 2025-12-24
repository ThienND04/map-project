import { useState } from 'react';
import { Search, MapPin, Loader2, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { BearSighting } from '@/types/bear'; 
import { searchBearData } from '@/services/bearService';
import {  SearchBarProps } from '@/types/search';

export default function SearchBar({ year, onSelectLocation, onSearchComplete }: SearchBarProps) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<BearSighting[]>([]);
    const [loading, setLoading] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);

    const handleSearch = async (e: React.FormEvent) => {
        const lang = localStorage.getItem('lang') || 'vi';
        console.log('Searching for:', query, 'Year:', year, 'Lang:', lang);
        e.preventDefault();
        if (!query.trim()) return;

        setLoading(true);
        try {
            const results = await searchBearData(query, year, lang, 1, 10);
            setResults(results || []); 
            if (onSearchComplete) {
                onSearchComplete(results || []);
            }
        } catch (error) {
            console.error("Lỗi tìm kiếm:", error);
            setResults([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`absolute top-0 left-0 h-full z-10 bg-white shadow-xl transition-all duration-300 flex flex-col font-sans
            ${isExpanded ? 'w-80' : 'w-0'}`}
        >
            <button 
                onClick={() => setIsExpanded(!isExpanded)}
                className="absolute -right-8 top-4 bg-white p-1.5 rounded-r-md shadow-md hover:bg-gray-100 border border-l-0 border-gray-200 z-50 flex items-center justify-center"
                title={isExpanded ? "Thu gọn" : "Mở rộng"}
            >
                {isExpanded ? <ChevronLeft className="w-5 h-5 text-gray-600"/> : <ChevronRight className="w-5 h-5 text-gray-600"/>}
            </button>

            <div className={`flex flex-col h-full ${!isExpanded && 'hidden'}`}>
                <div className="p-4 shadow-sm z-20 bg-white border-b border-gray-100">
                    <form onSubmit={handleSearch} className="relative flex items-center">
                        <input
                            type="text"
                            className="w-full pl-10 pr-4 py-2 text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-all"
                            placeholder="Tìm kiếm ..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                        <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
                        
                        {query && (
                            <button 
                                type="button" 
                                onClick={() => { setQuery(''); setResults([]); }}
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
                                                <h4 className="font-semibold text-gray-800 text-sm line-clamp-1">{item.name || "Vị trí không tên"}</h4>
                                                <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                                                    {item.description || `Dữ liệu gấu năm ${year}`}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                query && !loading && (
                                    <div className="text-center text-gray-500 mt-10 text-sm">
                                        Không tìm thấy kết quả phù hợp.
                                    </div>
                                )
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}