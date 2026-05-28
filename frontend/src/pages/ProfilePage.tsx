import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProfile, updateName, changePassword } from "../api/userApi";
import Loader from "../components/ui/Loader";

export default function ProfilePage() {

    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");

    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");

    const [nameError, setNameError] = useState("");
    const [nameSuccess, setNameSuccess] = useState("");
    const [nameSaving, setNameSaving] = useState(false);

    const [pwError, setPwError] = useState("");
    const [pwSuccess, setPwSuccess] = useState("");
    const [pwSaving, setPwSaving] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await getProfile();
                setName(data.name);
                setEmail(data.email);
            } catch { setNameError("Failed to load profile."); }
            finally { setLoading(false); }
        };
        fetchProfile();
    }, []);

    const handleNameSave = async () => {
        setNameError(""); setNameSuccess("");
        if (!name.trim()) { setNameError("Name cannot be empty."); return; }
        setNameSaving(true);
        try {
            await updateName(name.trim());
            setNameSuccess("Name updated successfully!");
        } catch { setNameError("Failed to update name."); }
        finally { setNameSaving(false); }
    };

    const handlePasswordChange = async () => {
        setPwError(""); setPwSuccess("");
        if (!oldPassword || !newPassword || !confirmNewPassword) { setPwError("All password fields are required."); return; }
        if (newPassword.length < 6) { setPwError("New password must be at least 6 characters."); return; }
        if (newPassword !== confirmNewPassword) { setPwError("New passwords do not match."); return; }
        setPwSaving(true);
        try {
            await changePassword(oldPassword, newPassword);
            setPwSuccess("Password changed successfully!");
            setOldPassword(""); setNewPassword(""); setConfirmNewPassword("");
        } catch (err: any) {
            setPwError(err?.response?.data?.message || "Current password is incorrect.");
        } finally { setPwSaving(false); }
    };

    if (loading) return <Loader />;

    return (
        <div className="max-w-lg mx-auto px-4 sm:px-6 py-8 sm:py-12 animate-slideUp">

            <div className="text-center mb-8">
                <span className="text-4xl sm:text-5xl">✏️</span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-3">Edit Profile</h1>
                <p className="text-gray-500 mt-1 text-sm">Update your name or change your password.</p>
            </div>

            {/* Section 1: Name */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 mb-6">
                <h2 className="text-lg font-bold text-gray-800 mb-4">👤 Personal Info</h2>

                {nameError && <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3 mb-4">⚠️ {nameError}</div>}
                {nameSuccess && <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg px-4 py-3 mb-4">✅ {nameSuccess}</div>}

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                        <input type="text" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" value={name} onChange={e => setName(e.target.value)} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email <span className="text-gray-400">(read-only)</span></label>
                        <input type="email" className="w-full border border-gray-100 rounded-xl px-4 py-3 text-sm bg-gray-50 text-gray-500 cursor-not-allowed" value={email} disabled />
                    </div>
                    <button onClick={handleNameSave} disabled={nameSaving} className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-all hover:scale-[1.02] shadow-md">
                        {nameSaving ? "Saving..." : "💾 Save Name"}
                    </button>
                </div>
            </div>

            {/* Section 2: Password */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 mb-6">
                <h2 className="text-lg font-bold text-gray-800 mb-4">🔒 Change Password</h2>

                {pwError && <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3 mb-4">⚠️ {pwError}</div>}
                {pwSuccess && <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg px-4 py-3 mb-4">✅ {pwSuccess}</div>}

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                        <input type="password" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" placeholder="Enter current password" value={oldPassword} onChange={e => setOldPassword(e.target.value)} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                        <input type="password" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" placeholder="Min. 6 characters" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                        <input type="password" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" placeholder="••••••••" value={confirmNewPassword} onChange={e => setConfirmNewPassword(e.target.value)} />
                    </div>
                    <button onClick={handlePasswordChange} disabled={pwSaving} className="w-full bg-gray-800 hover:bg-gray-900 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-all hover:scale-[1.02] shadow-md">
                        {pwSaving ? "Changing..." : "🔑 Change Password"}
                    </button>
                </div>
            </div>

            <button onClick={() => navigate("/profile/delete")} className="w-full text-sm text-red-400 hover:text-red-600 font-semibold transition-colors text-center">🗑️ Delete my account</button>
        </div>
    );
}