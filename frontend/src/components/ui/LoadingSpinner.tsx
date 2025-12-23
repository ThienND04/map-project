export default function LoadingSpinner() {
    return (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm">
            <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-emerald-400 font-medium animate-pulse">Đang tải dữ liệu phân bổ...</p>
        </div>
    );
}