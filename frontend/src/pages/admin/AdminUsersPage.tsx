import { useEffect, useState } from "react";
import { getAdminUsers, toggleUserStatus, changeUserRole } from "../../api/adminApi";
import type { AdminUser } from "../../types/petTypes";
import Loader from "../../components/ui/Loader";

export default function AdminUsersPage() {
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize] = useState(10);
    const [totalCount, setTotalCount] = useState(0);
    const [acting, setActing] = useState<string | null>(null);
    const [search, setSearch] = useState("");
    const [searchInput, setSearchInput] = useState("");
    const totalPages = Math.ceil(totalCount / pageSize);

    const fetchUsers = async (page = pageNumber, q = search) => {
        setLoading(true);
        try { const data = await getAdminUsers(page, pageSize, q || undefined); setUsers(data.items); setTotalCount(data.totalCount); }
        catch { alert("Failed to load users."); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchUsers(pageNumber, search); }, [pageNumber, search]);

    const handleSearch = () => { setSearch(searchInput.trim()); setPageNumber(1); };
    const handleClear = () => { setSearchInput(""); setSearch(""); setPageNumber(1); };

    const handleToggleStatus = async (id: string) => { setActing(id); try { await toggleUserStatus(id); setUsers(prev => prev.map(u => u.id === id ? { ...u, isActive: !u.isActive } : u)); } catch { alert("Failed."); } finally { setActing(null); } };
    const handleChangeRole = async (id: string, currentRole: string) => { const newRole = currentRole === "Admin" ? "User" : "Admin"; if (!confirm(`Change role to ${newRole}?`)) return; setActing(id); try { await changeUserRole(id, newRole); setUsers(prev => prev.map(u => u.id === id ? { ...u, role: newRole } : u)); } catch { alert("Failed."); } finally { setActing(null); } };

    if (loading) return <Loader />;

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 animate-slideUp">
            <div className="mb-6"><h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">👥 Manage Users</h1></div>

            {/* Search */}
            <div className="flex flex-col sm:flex-row gap-2 mb-6">
                <input type="text" className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" placeholder="Search by name or email..." value={searchInput} onChange={e => setSearchInput(e.target.value)} onKeyDown={e => e.key === "Enter" && handleSearch()} />
                <div className="flex gap-2">
                    <button onClick={handleSearch} className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors">Search</button>
                    {search && <button onClick={handleClear} className="border border-gray-200 text-gray-600 px-4 py-2.5 rounded-xl text-sm hover:bg-gray-50">✕</button>}
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-x-auto">
                <table className="w-full text-sm min-w-[700px]">
                    <thead className="bg-gray-50 text-gray-600 text-left">
                        <tr>
                            <th className="px-4 sm:px-6 py-3 font-semibold">Name</th>
                            <th className="px-4 sm:px-6 py-3 font-semibold">Email</th>
                            <th className="px-4 sm:px-6 py-3 font-semibold">Role</th>
                            <th className="px-4 sm:px-6 py-3 font-semibold">Status</th>
                            <th className="px-4 sm:px-6 py-3 font-semibold">Joined</th>
                            <th className="px-4 sm:px-6 py-3 font-semibold text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {users.map(user => (
                            <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-4 sm:px-6 py-3 font-medium text-gray-800 whitespace-nowrap">{user.name || "—"}</td>
                                <td className="px-4 sm:px-6 py-3 text-gray-600 whitespace-nowrap">{user.email}</td>
                                <td className="px-4 sm:px-6 py-3"><span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${user.role === "Admin" ? "bg-purple-100 text-purple-700" : "bg-gray-100 text-gray-600"}`}>{user.role}</span></td>
                                <td className="px-4 sm:px-6 py-3"><span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${user.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>{user.isActive ? "Active" : "Inactive"}</span></td>
                                <td className="px-4 sm:px-6 py-3 text-gray-500 whitespace-nowrap">{new Date(user.createdAt).toLocaleDateString()}</td>
                                <td className="px-4 sm:px-6 py-3 text-right whitespace-nowrap space-x-2">
                                    <button onClick={() => handleToggleStatus(user.id)} disabled={acting === user.id} className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${user.isActive ? "bg-red-50 text-red-500 hover:bg-red-100" : "bg-green-50 text-green-600 hover:bg-green-100"} disabled:opacity-50`}>{user.isActive ? "Deactivate" : "Activate"}</button>
                                    <button onClick={() => handleChangeRole(user.id, user.role)} disabled={acting === user.id} className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-purple-50 text-purple-600 hover:bg-purple-100 transition-colors disabled:opacity-50">{user.role === "Admin" ? "→ User" : "→ Admin"}</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <p className="text-xs text-gray-400 mt-2 text-center sm:hidden">← Swipe to see more →</p>

            {totalPages > 1 && (
                <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
                    <button onClick={() => setPageNumber(p => p - 1)} disabled={pageNumber === 1} className="px-3 py-2 text-sm rounded-lg border border-gray-200 hover:bg-orange-50 disabled:opacity-40 transition-colors">←</button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (<button key={p} onClick={() => setPageNumber(p)} className={`w-9 h-9 text-sm font-semibold rounded-lg ${p === pageNumber ? "bg-orange-500 text-white" : "border border-gray-200 hover:bg-orange-50"}`}>{p}</button>))}
                    <button onClick={() => setPageNumber(p => p + 1)} disabled={pageNumber === totalPages} className="px-3 py-2 text-sm rounded-lg border border-gray-200 hover:bg-orange-50 disabled:opacity-40 transition-colors">→</button>
                </div>
            )}
        </div>
    );
}