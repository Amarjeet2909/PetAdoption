import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getPets } from "../api/petsApi";
import type { Pet } from "../types/petTypes";
import Loader from "../components/ui/Loader";
import ImageCarousel from "../components/ui/ImageCarousel";

export default function PetsPage() {

    const [pets, setPets] = useState<Pet[]>([]);
    const [loading, setLoading] = useState(true);
    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize] = useState(6);
    const [totalCount, setTotalCount] = useState(0);
    const [search, setSearch] = useState("");
    const [searchInput, setSearchInput] = useState("");

    const totalPages = Math.ceil(totalCount / pageSize);

    useEffect(() => {
        const fetchPets = async () => {
            setLoading(true);
            try {
                const data = await getPets(pageNumber, pageSize, search || undefined);
                setPets(data.items);
                setTotalCount(data.totalCount);
            } catch { alert("Failed to load pets"); }
            finally { setLoading(false); }
        };
        fetchPets();
    }, [pageNumber, pageSize, search]);

    const handleSearch = () => { setSearch(searchInput.trim()); setPageNumber(1); };
    const handleClear = () => { setSearchInput(""); setSearch(""); setPageNumber(1); };
    const handleKeyDown = (e: React.KeyboardEvent) => { if (e.key === "Enter") handleSearch(); };

    if (loading) return <Loader />;

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-2">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Pets Available</h1>
                <span className="text-sm text-gray-500">Showing {pets.length} of {totalCount} pets</span>
            </div>

            {/* Search Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-8">
                <div className="flex-1 relative">
                    <input type="text" className="w-full border border-gray-200 rounded-xl px-4 py-3 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 transition" placeholder="Search by name, city or state..." value={searchInput} onChange={e => setSearchInput(e.target.value)} onKeyDown={handleKeyDown} />
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
                </div>
                <div className="flex gap-2">
                    <button onClick={handleSearch} className="flex-1 sm:flex-none bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-xl transition-all hover:scale-[1.02] text-sm">Search</button>
                    {search && (<button onClick={handleClear} className="border border-gray-200 hover:bg-gray-50 text-gray-600 font-medium px-4 py-3 rounded-xl transition-colors text-sm">✕</button>)}
                </div>
            </div>

            {search && (<div className="mb-6 text-sm text-gray-500">Results for "<span className="font-semibold text-orange-500">{search}</span>"</div>)}

            {pets.length === 0 && (
                <div className="text-center py-16 sm:py-20">
                    <span className="text-5xl sm:text-6xl">🐾</span>
                    <p className="text-gray-500 mt-4 text-base sm:text-lg">{search ? `No pets found matching "${search}".` : "No pets found."}</p>
                    {search && (<button onClick={handleClear} className="mt-4 text-orange-500 font-semibold hover:underline text-sm">Clear search and show all pets</button>)}
                </div>
            )}

            {/* Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {pets.map((pet) => (
                    <Link key={pet.id} to={`/pets/${pet.id}`} className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:scale-[1.01] transition-all block">
                        <ImageCarousel images={pet.photoUrls} altText={pet.name} height="h-48" rounded="rounded-t-2xl" />
                        <div className="p-4 sm:p-5">
                            <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3">{pet.name}</h2>
                            <div className="text-sm text-gray-500 space-y-1">
                                <p>🐾 Species: <span className="text-gray-700">{pet.species}</span></p>
                                <p>🎂 Age: <span className="text-gray-700">{pet.ageInMonths} months</span></p>
                                <p>📍 Location: <span className="text-gray-700">{pet.city}, {pet.state}</span></p>
                                <p>🏷️ Status: <span className="text-orange-500 font-medium">{pet.status}</span></p>
                            </div>
                            <div className="mt-4 text-xs text-orange-400 font-semibold">View Details →</div>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex flex-wrap items-center justify-center gap-2 mt-10 sm:mt-12">
                    <button onClick={() => setPageNumber(p => p - 1)} disabled={pageNumber === 1} className="px-3 sm:px-4 py-2 text-sm font-medium rounded-lg border border-gray-200 hover:bg-orange-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">← Prev</button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                        <button key={page} onClick={() => setPageNumber(page)} className={`w-9 h-9 sm:w-10 sm:h-10 text-sm font-semibold rounded-lg transition-all ${page === pageNumber ? "bg-orange-500 text-white shadow-md scale-105" : "border border-gray-200 text-gray-600 hover:bg-orange-50"}`}>{page}</button>
                    ))}
                    <button onClick={() => setPageNumber(p => p + 1)} disabled={pageNumber === totalPages} className="px-3 sm:px-4 py-2 text-sm font-medium rounded-lg border border-gray-200 hover:bg-orange-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">Next →</button>
                </div>
            )}
        </div>
    );
}