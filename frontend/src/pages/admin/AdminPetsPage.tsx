import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAdminPets, adminDisablePet, adminEnablePet, adminDeletePet } from "../../api/adminApi";
import type { AdminPet } from "../../types/petTypes";
import Loader from "../../components/ui/Loader";

export default function AdminPetsPage() {
    const [pets, setPets] = useState<AdminPet[]>([]);
    const [loading, setLoading] = useState(true);
    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize] = useState(10);
    const [totalCount, setTotalCount] = useState(0);
    const [acting, setActing] = useState<string | null>(null);
    const [search, setSearch] = useState("");
    const [searchInput, setSearchInput] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const totalPages = Math.ceil(totalCount / pageSize);

    const fetchPets = async (page = pageNumber, q = search, s = statusFilter) => {
        setLoading(true);
        try { const data = await getAdminPets(page, pageSize, q || undefined, s || undefined); setPets(data.items); setTotalCount(data.totalCount); }
        catch { alert("Failed to load pets."); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchPets(pageNumber, search, statusFilter); }, [pageNumber, search, statusFilter]);

    const handleSearch = () => { setSearch(searchInput.trim()); setPageNumber(1); };
    const handleClear = () => { setSearchInput(""); setSearch(""); setPageNumber(1); };

    const handleToggle = async (id: string, isActive: boolean) => { setActing(id); try { if (isActive) await adminDisablePet(id); else await adminEnablePet(id); setPets(prev => prev.map(p => p.id === id ? { ...p, isActive: !isActive, status: isActive ? "Disabled" : "Available" } : p)); } catch { alert("Failed."); } finally { setActing(null); } };
    const handleDelete = async (id: string, name: string) => { if (!confirm(`Disable "${name}"?`)) return; setActing(id); try { await adminDeletePet(id); setPets(prev => prev.map(p => p.id === id ? { ...p, isActive: false, status: "Disabled" } : p)); } catch { alert("Failed."); } finally { setActing(null); } };

    if (loading) return <Loader />;

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 animate-slideUp">
            <div className="mb-6"><h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">🐶 Manage Pets</h1></div>

            {/* Search + Filter */}
            <div className="flex flex-col sm:flex-row gap-2 mb-6">
                <input type="text" className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" placeholder="Search by name, city, owner..." value={searchInput} onChange={e => setSearchInput(e.target.value)} onKeyDown={e => e.key === "Enter" && handleSearch()} />
                <select className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white focus:ring-2 focus:ring-orange-400" value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPageNumber(1); }}>
                    <option value="">All Status</option>
                    <option value="Available">Available</option>
                    <option value="Adopted">Adopted</option>
                    <option value="Disabled">Disabled</option>
                </select>
                <button onClick={handleSearch} className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-5 py-2.5 rounded-xl text-sm">Search</button>
                {search && <button onClick={handleClear} className="border border-gray-200 text-gray-600 px-4 py-2.5 rounded-xl text-sm hover:bg-gray-50">✕</button>}
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-x-auto">
                <table className="w-full text-sm min-w-[800px]">
                    <thead className="bg-gray-50 text-gray-600 text-left">
                        <tr>
                            <th className="px-4 sm:px-6 py-3 font-semibold">Name</th>
                            <th className="px-4 sm:px-6 py-3 font-semibold">Species</th>
                            <th className="px-4 sm:px-6 py-3 font-semibold">City</th>
                            <th className="px-4 sm:px-6 py-3 font-semibold">Status</th>
                            <th className="px-4 sm:px-6 py-3 font-semibold">Listed By</th>
                            <th className="px-4 sm:px-6 py-3 font-semibold text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {pets.map(pet => (
                            <tr key={pet.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-4 sm:px-6 py-3"><Link to={`/pets/${pet.id}`} className="font-medium text-orange-500 hover:underline whitespace-nowrap">{pet.name}</Link></td>
                                <td className="px-4 sm:px-6 py-3 text-gray-600">{pet.species}</td>
                                <td className="px-4 sm:px-6 py-3 text-gray-600 whitespace-nowrap">{pet.city}</td>
                                <td className="px-4 sm:px-6 py-3"><span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${pet.status === "Available" ? "bg-green-100 text-green-700" : pet.status === "Adopted" ? "bg-orange-100 text-orange-700" : "bg-red-100 text-red-600"}`}>{pet.status}</span></td>
                                <td className="px-4 sm:px-6 py-3 text-gray-500 text-xs whitespace-nowrap">{pet.createdBy}</td>
                                <td className="px-4 sm:px-6 py-3 text-right whitespace-nowrap space-x-2">
                                    {pet.status !== "Adopted" && (<button onClick={() => handleToggle(pet.id, pet.isActive)} disabled={acting === pet.id} className={`text-xs font-semibold px-3 py-1.5 rounded-lg ${pet.isActive ? "bg-red-50 text-red-500 hover:bg-red-100" : "bg-green-50 text-green-600 hover:bg-green-100"} disabled:opacity-50`}>{pet.isActive ? "Disable" : "Enable"}</button>)}
                                    <button onClick={() => handleDelete(pet.id, pet.name)} disabled={acting === pet.id} className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 disabled:opacity-50">🗑️</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <p className="text-xs text-gray-400 mt-2 text-center sm:hidden">← Swipe to see more →</p>

            {totalPages > 1 && (
                <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
                    <button onClick={() => setPageNumber(p => p - 1)} disabled={pageNumber === 1} className="px-3 py-2 text-sm rounded-lg border border-gray-200 hover:bg-orange-50 disabled:opacity-40">←</button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (<button key={p} onClick={() => setPageNumber(p)} className={`w-9 h-9 text-sm font-semibold rounded-lg ${p === pageNumber ? "bg-orange-500 text-white" : "border border-gray-200 hover:bg-orange-50"}`}>{p}</button>))}
                    <button onClick={() => setPageNumber(p => p + 1)} disabled={pageNumber === totalPages} className="px-3 py-2 text-sm rounded-lg border border-gray-200 hover:bg-orange-50 disabled:opacity-40">→</button>
                </div>
            )}
        </div>
    );
}