import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getMyPets, getAdoptedPets, deletePet } from "../api/petsApi";
import type { Pet } from "../types/petTypes";
import Loader from "../components/ui/Loader";
import ImageCarousel from "../components/ui/ImageCarousel";

type Tab = "listed" | "adopted";

export default function MyPetsPage() {

    const navigate = useNavigate();
    const [tab, setTab] = useState<Tab>("listed");
    const [pets, setPets] = useState<Pet[]>([]);
    const [loading, setLoading] = useState(true);
    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize] = useState(6);
    const [totalCount, setTotalCount] = useState(0);
    const [deleting, setDeleting] = useState<string | null>(null);

    const totalPages = Math.ceil(totalCount / pageSize);

    const fetchPets = async (page = pageNumber, activeTab = tab) => {
        setLoading(true);
        try {
            const data = activeTab === "listed" ? await getMyPets(page, pageSize) : await getAdoptedPets(page, pageSize);
            setPets(data.items);
            setTotalCount(data.totalCount);
        } catch {
            alert("Failed to load pets");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchPets(pageNumber, tab); }, [pageNumber, tab]);

    const handleTabChange = (newTab: Tab) => { setTab(newTab); setPageNumber(1); };

    const handleDelete = async (id: string, name: string) => {
        const confirmed = confirm(`Remove "${name}" from your listings?`);
        if (!confirmed) return;
        setDeleting(id);
        try {
            await deletePet(id);
            setPets(prev => prev.filter(p => p.id !== id));
            setTotalCount(prev => prev - 1);
        } catch {
            alert("Failed to delete pet.");
        } finally {
            setDeleting(null);
        }
    };

    if (loading) return <Loader />;

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 animate-slideUp">

            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-3">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">🐶 My Pets</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage your listings and adopted pets.</p>
                </div>
                <Link to="/pets/create" className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-5 py-2.5 rounded-xl transition-all hover:scale-[1.02] shadow-md text-sm">+ List New Pet</Link>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 mb-8 border-b border-gray-200 overflow-x-auto">
                <button onClick={() => handleTabChange("listed")} className={`pb-3 px-1 text-sm font-semibold transition-colors border-b-2 whitespace-nowrap ${tab === "listed" ? "border-orange-500 text-orange-500" : "border-transparent text-gray-500 hover:text-gray-700"}`}>📋 My Listings</button>
                <button onClick={() => handleTabChange("adopted")} className={`pb-3 px-1 text-sm font-semibold transition-colors border-b-2 whitespace-nowrap ${tab === "adopted" ? "border-orange-500 text-orange-500" : "border-transparent text-gray-500 hover:text-gray-700"}`}>❤️ Adopted by Me</button>
            </div>

            {/* Empty State */}
            {pets.length === 0 && (
                <div className="text-center py-16 sm:py-20 bg-white rounded-2xl border border-gray-100">
                    <span className="text-5xl sm:text-6xl">{tab === "listed" ? "📭" : "💔"}</span>
                    <p className="text-gray-500 mt-4 text-base sm:text-lg">{tab === "listed" ? "You haven't listed any pets yet." : "You haven't adopted any pets yet."}</p>
                    <Link to={tab === "listed" ? "/pets/create" : "/pets"} className="inline-block mt-6 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-full transition-all">{tab === "listed" ? "🐾 List Your First Pet" : "🔍 Browse Available Pets"}</Link>
                </div>
            )}

            {/* Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {pets.map((pet) => (
                    <div key={pet.id} className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all">
                        <Link to={`/pets/${pet.id}`}>
                            <ImageCarousel images={pet.photoUrls} altText={pet.name} height="h-44" rounded="rounded-t-2xl" />
                            <div className="p-4 sm:p-5">
                                <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">{pet.name}</h2>
                                <div className="text-sm text-gray-500 space-y-1">
                                    <p>🐾 Species: <span className="text-gray-700">{pet.species}</span></p>
                                    <p>🎂 Age: <span className="text-gray-700">{pet.ageInMonths} months</span></p>
                                    <p>📍 Location: <span className="text-gray-700">{pet.city}, {pet.state}</span></p>
                                    <p>🏷️ Status: <span className={`font-medium ${pet.status === "Available" ? "text-green-600" : pet.status === "Adopted" ? "text-orange-500" : "text-red-500"}`}>{pet.status}</span></p>
                                </div>
                            </div>
                        </Link>

                        {tab === "listed" && (
                            <div className="px-4 sm:px-5 pb-4 pt-2 border-t border-gray-100 flex items-center justify-between">
                                {pet.status === "Available" ? (
                                    <button onClick={() => navigate(`/pets/${pet.id}/edit`)} className="text-xs text-blue-500 hover:text-blue-700 font-semibold transition-colors">✏️ Edit</button>
                                ) : (
                                    <span className="text-xs text-gray-400">Cannot edit</span>
                                )}
                                <button onClick={() => handleDelete(pet.id, pet.name)} disabled={deleting === pet.id} className="text-xs text-red-400 hover:text-red-600 font-semibold disabled:opacity-50 transition-colors">{deleting === pet.id ? "Removing..." : "🗑️ Remove"}</button>
                            </div>
                        )}
                    </div>
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