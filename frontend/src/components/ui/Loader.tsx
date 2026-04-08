export default function Loader() {
    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white">
            <div className="w-16 h-16 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin" />
            <p className="mt-4 text-orange-500 font-semibold text-lg tracking-wide animate-pulse">
                Loading...
            </p>
        </div>
    );
}