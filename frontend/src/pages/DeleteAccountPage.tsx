import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { deleteAccount } from "../api/userApi";

export default function DeleteAccountPage() {

    const navigate = useNavigate();
    const [confirm, setConfirm] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleDelete = async () => {
        if (confirm !== "DELETE") {
            setError("Please type DELETE to confirm.");
            return;
        }

        setLoading(true);
        try {
            await deleteAccount();
            localStorage.removeItem("token");
            navigate("/login");
        } catch {
            setError("Failed to delete account. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto px-6 py-12 animate-slideUp">

            <div className="text-center mb-8">
                <span className="text-5xl">⚠️</span>
                <h1 className="text-3xl font-extrabold text-red-600 mt-3">Delete Account</h1>
                <p className="text-gray-500 mt-2 text-sm">
                    This action is permanent. All your data will be deactivated.
                </p>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3 mb-5">
                    ⚠️ {error}
                </div>
            )}

            <div className="bg-white rounded-2xl shadow-sm border border-red-100 p-8 space-y-5">

                <div className="bg-red-50 rounded-xl p-4 text-sm text-red-700">
                    <p className="font-semibold mb-1">This will:</p>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>Deactivate your account</li>
                        <li>Your listed pets will remain but you won't be able to manage them</li>
                        <li>You cannot undo this action</li>
                    </ul>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Type <strong>DELETE</strong> to confirm
                    </label>
                    <input
                        type="text"
                        className="w-full border border-red-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
                        placeholder="DELETE"
                        value={confirm}
                        onChange={e => setConfirm(e.target.value)}
                    />
                </div>

                <button
                    onClick={handleDelete}
                    disabled={loading || confirm !== "DELETE"}
                    className="w-full bg-red-500 hover:bg-red-600 disabled:opacity-40 text-white font-semibold py-3 rounded-xl transition-all shadow-md"
                >
                    {loading ? "Deleting..." : "🗑️ Permanently Delete Account"}
                </button>

                <button
                    onClick={() => navigate("/profile")}
                    className="w-full text-sm text-gray-500 hover:text-gray-700 font-medium transition-colors"
                >
                    ← Cancel, take me back
                </button>
            </div>
        </div>
    );
}