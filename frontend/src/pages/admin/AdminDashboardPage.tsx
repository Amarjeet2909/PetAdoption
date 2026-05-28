import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAdminDashboard, getAdminAnalytics, getRecentActivity, createAnnouncement, getAnnouncements, deleteAnnouncement, exportUsersCSV, exportPetsCSV } from "../../api/adminApi";
import type { AdminDashboardStats, AdminAnalytics, RecentActivity, Announcement } from "../../types/petTypes";
import Loader from "../../components/ui/Loader";

function ProgressBar({ value, max, color }: { value: number; max: number; color: string }) {
    const pct = max > 0 ? Math.round((value / max) * 100) : 0;
    return (<div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden"><div className={`h-full rounded-full transition-all duration-1000 ${color}`} style={{ width: `${pct}%` }} /></div>);
}

function BarChart({ data, color }: { data: { name: string; count: number }[]; color: string }) {
    const max = Math.max(...data.map(d => d.count), 1);
    return (
        <div className="space-y-2">
            {data.map(item => (
                <div key={item.name} className="flex items-center gap-3">
                    <span className="text-xs text-gray-500 w-16 truncate">{item.name}</span>
                    <div className="flex-1 bg-gray-100 rounded-full h-5 overflow-hidden">
                        <div className={`h-full rounded-full ${color} flex items-center justify-end pr-2 text-xs text-white font-semibold transition-all duration-700`} style={{ width: `${(item.count / max) * 100}%` }}>
                            {item.count > 0 && item.count}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

function MiniLineChart({ data }: { data: { date: string; count: number }[] }) {
    if (data.length === 0) return <p className="text-sm text-gray-400 text-center py-8">No data yet</p>;
    const max = Math.max(...data.map(d => d.count), 1);
    const h = 120;
    const w = data.length > 1 ? 100 / (data.length - 1) : 100;
    const points = data.map((d, i) => `${i * w},${h - (d.count / max) * h}`).join(" ");
    return (
        <div className="w-full overflow-hidden">
            <svg viewBox={`0 0 100 ${h}`} preserveAspectRatio="none" className="w-full h-28">
                <polyline fill="none" stroke="#f97316" strokeWidth="2" points={points} />
                <polyline fill="url(#grad)" stroke="none" points={`0,${h} ${points} 100,${h}`} />
                <defs><linearGradient id="grad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#f97316" stopOpacity="0.3" /><stop offset="100%" stopColor="#f97316" stopOpacity="0" /></linearGradient></defs>
            </svg>
            <div className="flex justify-between text-[10px] text-gray-400 mt-1 px-1">
                {data.length > 0 && <span>{data[0].date}</span>}
                {data.length > 1 && <span>{data[data.length - 1].date}</span>}
            </div>
        </div>
    );
}

function DonutChart({ segments }: { segments: { value: number; color: string; label: string }[] }) {
    const total = segments.reduce((a, s) => a + s.value, 0);
    if (total === 0) return <p className="text-center text-gray-400 py-8">No data</p>;
    let cum = 0;
    const parts = segments.map(s => { const start = (cum / total) * 100; cum += s.value; return `${s.color} ${start}% ${(cum / total) * 100}%`; });
    return (
        <div className="flex flex-col items-center gap-4">
            <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-full" style={{ background: `conic-gradient(${parts.join(", ")})` }}>
                <div className="absolute inset-4 sm:inset-5 bg-white rounded-full flex items-center justify-center"><div className="text-center"><p className="text-xl sm:text-2xl font-extrabold text-gray-800">{total}</p><p className="text-[10px] text-gray-400">Total</p></div></div>
            </div>
            <div className="flex flex-wrap justify-center gap-2">{segments.map(s => (<div key={s.label} className="flex items-center gap-1 text-[11px]"><div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} /><span className="text-gray-600">{s.label} ({s.value})</span></div>))}</div>
        </div>
    );
}

export default function AdminDashboardPage() {

    const [stats, setStats] = useState<AdminDashboardStats | null>(null);
    const [analytics, setAnalytics] = useState<AdminAnalytics | null>(null);
    const [activity, setActivity] = useState<RecentActivity[]>([]);
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [loading, setLoading] = useState(true);
    const [range, setRange] = useState("month");
    const [newMsg, setNewMsg] = useState("");
    const [newType, setNewType] = useState("info");

    const fetchAll = async () => {
        try {
            const [s, a, act, ann] = await Promise.all([
                getAdminDashboard(), getAdminAnalytics(range), getRecentActivity(10), getAnnouncements()
            ]);
            setStats(s); setAnalytics(a); setActivity(act); setAnnouncements(ann);
        } catch { alert("Failed to load dashboard."); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchAll(); }, [range]);

    const handlePostAnnouncement = async () => {
        if (!newMsg.trim()) return;
        await createAnnouncement(newMsg.trim(), newType);
        setNewMsg("");
        const ann = await getAnnouncements();
        setAnnouncements(ann);
    };

    const handleDeleteAnnouncement = async (id: string) => {
        await deleteAnnouncement(id);
        setAnnouncements(prev => prev.filter(a => a.id !== id));
    };

    if (loading) return <Loader />;
    if (!stats || !analytics) return null;

    const disabledPets = Math.max(stats.totalPets - stats.adoptedPets - stats.availablePets, 0);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10 animate-slideUp">

            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 gap-3">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">🛡️ Admin Dashboard</h1>
                    <p className="text-sm text-gray-500 mt-1">Real-time platform analytics & management.</p>
                </div>
                <div className="flex gap-2">
                    {["today", "week", "month"].map(r => (
                        <button key={r} onClick={() => setRange(r)} className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${range === r ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>{r === "today" ? "Today" : r === "week" ? "7 Days" : "30 Days"}</button>
                    ))}
                </div>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-6 sm:mb-8">
                {[
                    { label: "Total Users", value: stats.totalUsers, emoji: "👥", bg: "from-blue-500 to-blue-600" },
                    { label: "Active Users", value: stats.activeUsers, emoji: "✅", bg: "from-green-500 to-green-600" },
                    { label: "Total Pets", value: stats.totalPets, emoji: "🐾", bg: "from-orange-500 to-orange-600" },
                    { label: "Adopted", value: stats.adoptedPets, emoji: "❤️", bg: "from-pink-500 to-pink-600" },
                    { label: "Available", value: stats.availablePets, emoji: "🏠", bg: "from-purple-500 to-purple-600" },
                ].map(c => (
                    <div key={c.label} className={`bg-gradient-to-br ${c.bg} rounded-2xl p-4 sm:p-5 text-center text-white shadow-lg`}>
                        <span className="text-xl sm:text-2xl">{c.emoji}</span>
                        <p className="text-xl sm:text-2xl font-extrabold mt-1">{c.value}</p>
                        <p className="text-[10px] sm:text-xs mt-0.5 opacity-80">{c.label}</p>
                    </div>
                ))}
            </div>

            {/* Charts Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6">
                {/* Adoption Trend */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6">
                    <h3 className="text-sm font-bold text-gray-800 mb-4">📈 Adoption Trend</h3>
                    <MiniLineChart data={analytics.adoptionTrend} />
                </div>
                {/* User Growth */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6">
                    <h3 className="text-sm font-bold text-gray-800 mb-4">👥 User Registrations</h3>
                    <MiniLineChart data={analytics.userGrowth} />
                </div>
                {/* Species Donut */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6">
                    <h3 className="text-sm font-bold text-gray-800 mb-4">🐾 Species Breakdown</h3>
                    <DonutChart segments={analytics.speciesBreakdown.map((s, i) => ({ value: s.count, label: s.name, color: ["#f97316", "#3b82f6", "#22c55e", "#a855f7", "#ef4444", "#eab308"][i % 6] }))} />
                </div>
            </div>

            {/* Charts Row 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6">
                {/* Top Cities */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6">
                    <h3 className="text-sm font-bold text-gray-800 mb-4">🏙️ Top Cities</h3>
                    <BarChart data={analytics.topCities} color="bg-blue-500" />
                </div>
                {/* Peak Hours */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6">
                    <h3 className="text-sm font-bold text-gray-800 mb-4">⏰ Peak Adoption Hours</h3>
                    <BarChart data={analytics.peakHours} color="bg-purple-500" />
                </div>
            </div>

            {/* Activity + Announcements */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6">
                {/* Recent Activity */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6">
                    <h3 className="text-sm font-bold text-gray-800 mb-4">🔔 Recent Activity</h3>
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                        {activity.length === 0 && <p className="text-sm text-gray-400">No activity yet.</p>}
                        {activity.map((a, i) => (
                            <div key={i} className="flex items-start gap-3 text-sm">
                                <span className={`mt-0.5 w-6 h-6 rounded-full flex items-center justify-center text-xs flex-shrink-0 ${a.action === "adoption" ? "bg-pink-100 text-pink-600" : "bg-green-100 text-green-600"}`}>{a.action === "adoption" ? "❤️" : "➕"}</span>
                                <div className="flex-1 min-w-0">
                                    <p className="text-gray-700 truncate">{a.description}</p>
                                    <p className="text-[10px] text-gray-400">{new Date(a.timestamp).toLocaleString()}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Announcements */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6">
                    <h3 className="text-sm font-bold text-gray-800 mb-4">📢 Announcements</h3>
                    <div className="flex gap-2 mb-4">
                        <input type="text" className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" placeholder="Write announcement..." value={newMsg} onChange={e => setNewMsg(e.target.value)} onKeyDown={e => e.key === "Enter" && handlePostAnnouncement()} />
                        <select className="border border-gray-200 rounded-lg px-2 py-2 text-xs bg-white" value={newType} onChange={e => setNewType(e.target.value)}>
                            <option value="info">ℹ️</option>
                            <option value="warning">⚠️</option>
                            <option value="success">✅</option>
                        </select>
                        <button onClick={handlePostAnnouncement} className="bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold px-3 py-2 rounded-lg transition-colors">Post</button>
                    </div>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                        {announcements.length === 0 && <p className="text-sm text-gray-400">No announcements.</p>}
                        {announcements.map(a => (
                            <div key={a.id} className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm ${a.type === "warning" ? "bg-yellow-50 text-yellow-700" : a.type === "success" ? "bg-green-50 text-green-700" : "bg-blue-50 text-blue-700"}`}>
                                <span className="truncate flex-1">{a.message}</span>
                                <button onClick={() => handleDeleteAnnouncement(a.id)} className="text-xs text-red-400 hover:text-red-600 ml-2 flex-shrink-0">✕</button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Quick Actions + Export */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Link to="/admin/users" className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex items-center gap-3 group">
                    <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-xl group-hover:scale-110 transition-transform">👥</div>
                    <div><h3 className="text-sm font-bold text-gray-800">Manage Users</h3><p className="text-xs text-gray-500">View & manage</p></div>
                </Link>
                <Link to="/admin/pets" className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex items-center gap-3 group">
                    <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center text-xl group-hover:scale-110 transition-transform">🐶</div>
                    <div><h3 className="text-sm font-bold text-gray-800">Manage Pets</h3><p className="text-xs text-gray-500">View & manage</p></div>
                </Link>
                <button onClick={exportUsersCSV} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex items-center gap-3 group text-left">
                    <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center text-xl group-hover:scale-110 transition-transform">📥</div>
                    <div><h3 className="text-sm font-bold text-gray-800">Export Users</h3><p className="text-xs text-gray-500">Download CSV</p></div>
                </button>
                <button onClick={exportPetsCSV} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex items-center gap-3 group text-left">
                    <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center text-xl group-hover:scale-110 transition-transform">📥</div>
                    <div><h3 className="text-sm font-bold text-gray-800">Export Pets</h3><p className="text-xs text-gray-500">Download CSV</p></div>
                </button>
            </div>
        </div>
    );
}