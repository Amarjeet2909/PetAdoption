import { useEffect, useState } from "react";
import {
    getIncomingRequests,
    getMyRequests,
    approveRequest,
    rejectRequest,
    cancelRequest,
} from "../api/adoptionApi";
import type { AdoptionRequest } from "../types/petTypes";
import Loader from "../components/ui/Loader";

const statusBadge: Record<string, string> = {
    Pending: "bg-yellow-100 text-yellow-700",
    Approved: "bg-green-100 text-green-700",
    Rejected: "bg-red-100 text-red-500",
    Cancelled: "bg-gray-100 text-gray-500",
};

const statusEmoji: Record<string, string> = {
    Pending: "⏳",
    Approved: "✅",
    Rejected: "❌",
    Cancelled: "🚫",
};

export default function AdoptionRequestsPage() {
    const [activeTab, setActiveTab] = useState<"incoming" | "mine">("incoming");
    const [requests, setRequests] = useState<AdoptionRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [totalCount, setTotalCount] = useState(0);
    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize] = useState(8);
    const [statusFilter, setStatusFilter] = useState("");
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [error, setError] = useState("");

    const totalPages = Math.ceil(totalCount / pageSize);

    const fetchRequests = async () => {
        setLoading(true);
        setError("");
        try {
            const data = activeTab === "incoming"
                ? await getIncomingRequests(pageNumber, pageSize, statusFilter || undefined)
                : await getMyRequests(pageNumber, pageSize, statusFilter || undefined);
            setRequests(data.items);
            setTotalCount(data.totalCount);
        } catch {
            setError("Failed to load requests.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, [activeTab, pageNumber, statusFilter]);

    const handleTabChange = (tab: "incoming" | "mine") => {
        setActiveTab(tab);
        setPageNumber(1);
        setStatusFilter("");
    };

    const handleApprove = async (id: string) => {
        setActionLoading(id);
        try {
            await approveRequest(id);
            await fetchRequests();
        } catch (err: any) {
            setError(err?.response?.data?.message || "Failed to approve request.");
        } finally {
            setActionLoading(null);
        }
    };

    const handleReject = async (id: string) => {
        setActionLoading(id);
        try {
            await rejectRequest(id);
            await fetchRequests();
        } catch (err: any) {
            setError(err?.response?.data?.message || "Failed to reject request.");
        } finally {
            setActionLoading(null);
        }
    };

    const handleCancel = async (id: string) => {
        setActionLoading(id);
        try {
            await cancelRequest(id);
            await fetchRequests();
        } catch (err: any) {
            setError(err?.response?.data?.message || "Failed to cancel request.");
        } finally {
            setActionLoading(null);
        }
    };

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 animate-slideUp">

            <div className="mb-6">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">🐾 Adoption Requests</h1>
                <p className="text-sm text-gray-500 mt-1">Manage incoming requests for your pets or track your own.</p>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-6 border-b border-gray-100 pb-3">
                {(["incoming", "mine"] as const).map(tab => (
                    <button
                        key={tab}
                        onClick={() => handleTabChange(tab)}
                        className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${activeTab === tab ? "bg-orange-500 text-white shadow" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                    >
                        {tab === "incoming" ? "📥 Incoming Requests" : "📤 My Requests"}
                    </button>
                ))}
            </div>

            {/* Status Filter */}
            <div className="flex gap-2 mb-6 flex-wrap">
                {["", "Pending", "Approved", "Rejected", "Cancelled"].map(s => (
                    <button
                        key={s}
                        onClick={() => { setStatusFilter(s); setPageNumber(1); }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${statusFilter === s ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                    >
                        {s === "" ? "All" : `${statusEmoji[s]} ${s}`}
                    </button>
                ))}
            </div>

            {error && <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3 mb-5">⚠️ {error}</div>}

            {loading ? <Loader /> : (
                <>
                    {requests.length === 0 ? (
                        <div className="text-center py-16">
                            <span className="text-5xl">🐾</span>
                            <p className="text-gray-500 mt-4">No requests found.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {requests.map(req => (
                                <div key={req.id} className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 flex flex-col sm:flex-row items-start gap-4">

                                    {/* Pet Photo */}
                                    {req.petPhotoUrls?.[0] ? (
                                        <img src={req.petPhotoUrls[0]} alt={req.petName} className="w-20 h-20 rounded-xl object-cover flex-shrink-0 border border-gray-100" />
                                    ) : (
                                        <div className="w-20 h-20 rounded-xl bg-orange-50 flex items-center justify-center text-3xl flex-shrink-0">🐾</div>
                                    )}

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex flex-wrap items-center gap-2 mb-1">
                                            <h3 className="text-base font-bold text-gray-800">{req.petName}</h3>
                                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${statusBadge[req.status]}`}>
                                                {statusEmoji[req.status]} {req.status}
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-400 mb-2">
                                            {activeTab === "incoming"
                                                ? `From: ${req.adopterName} (${req.adopterEmail})`
                                                : `Pet: ${req.petName}`}
                                            {" · "}
                                            {new Date(req.createdAt).toLocaleDateString()}
                                        </p>
                                        {req.message && (
                                            <p className="text-sm text-gray-600 bg-gray-50 rounded-lg px-3 py-2 italic">
                                                "{req.message}"
                                            </p>
                                        )}
                                        {req.respondedAt && (
                                            <p className="text-xs text-gray-400 mt-1">
                                                Responded on {new Date(req.respondedAt).toLocaleDateString()}
                                            </p>
                                        )}
                                    </div>

                                    {/* Actions */}
                                    <div className="flex flex-col gap-2 flex-shrink-0 w-full sm:w-auto">
                                        {activeTab === "incoming" && req.status === "Pending" && (
                                            <>
                                                <button
                                                    onClick={() => handleApprove(req.id)}
                                                    disabled={actionLoading === req.id}
                                                    className="bg-green-500 hover:bg-green-600 disabled:opacity-60 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors"
                                                >
                                                    {actionLoading === req.id ? "..." : "✅ Approve"}
                                                </button>
                                                <button
                                                    onClick={() => handleReject(req.id)}
                                                    disabled={actionLoading === req.id}
                                                    className="bg-red-100 hover:bg-red-200 disabled:opacity-60 text-red-600 text-xs font-semibold px-4 py-2 rounded-lg transition-colors"
                                                >
                                                    {actionLoading === req.id ? "..." : "❌ Reject"}
                                                </button>
                                            </>
                                        )}
                                        {activeTab === "mine" && req.status === "Pending" && (
                                            <button
                                                onClick={() => handleCancel(req.id)}
                                                disabled={actionLoading === req.id}
                                                className="bg-gray-100 hover:bg-gray-200 disabled:opacity-60 text-gray-600 text-xs font-semibold px-4 py-2 rounded-lg transition-colors"
                                            >
                                                {actionLoading === req.id ? "..." : "🚫 Cancel"}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex flex-wrap items-center justify-center gap-2 mt-10">
                            <button onClick={() => setPageNumber(p => p - 1)} disabled={pageNumber === 1} className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-200 hover:bg-orange-50 disabled:opacity-40 transition-colors">← Prev</button>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                <button key={page} onClick={() => setPageNumber(page)} className={`w-10 h-10 text-sm font-semibold rounded-lg transition-all ${page === pageNumber ? "bg-orange-500 text-white shadow-md scale-105" : "border border-gray-200 text-gray-600 hover:bg-orange-50"}`}>{page}</button>
                            ))}
                            <button onClick={() => setPageNumber(p => p + 1)} disabled={pageNumber === totalPages} className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-200 hover:bg-orange-50 disabled:opacity-40 transition-colors">Next →</button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}