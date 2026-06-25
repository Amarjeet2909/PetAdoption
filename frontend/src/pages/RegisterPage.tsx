import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import { registerUser, googleLogin } from "../api/authApi";
import AuthSlider from "../components/ui/AuthSlider";

export default function RegisterPage() {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleRegister = async () => {
        setError("");
        if (!name.trim() || !email || !password || !confirmPassword) { setError("Please fill in all fields."); return; }
        if (password !== confirmPassword) { setError("Passwords do not match."); return; }
        if (password.length < 6) { setError("Password must be at least 6 characters."); return; }

        setLoading(true);
        try {
            const result = await registerUser({ name: name.trim(), email, password });
            if (result.requiresVerification) {
                navigate("/verify-email", { state: { email } });
            } else {
                localStorage.setItem("token", result.token);
                navigate("/pets");
            }
        } catch (err: any) {
            setError(err?.response?.data?.message || "Registration failed. This email may already be in use.");
        } finally { setLoading(false); }
    };

    const handleGoogleSuccess = async (tokenResponse: any) => {
        setError("");
        setLoading(true);
        try {
            const result = await googleLogin(tokenResponse.access_token);
            localStorage.setItem("token", result.token);
            navigate("/pets");
        } catch {
            setError("Google sign-in failed. Please try again.");
        } finally { setLoading(false); }
    };

    const googleLoginHook = useGoogleLogin({
        onSuccess: handleGoogleSuccess,
        onError: () => setError("Google sign-in failed."),
    });

    const handleKeyDown = (e: React.KeyboardEvent) => { if (e.key === "Enter") handleRegister(); };

    return (
        <div className="min-h-screen grid md:grid-cols-2">
            <AuthSlider />
            <div className="flex items-center justify-center bg-gray-50 px-4 sm:px-6 py-8 sm:py-12">
                <div className="w-full max-w-md animate-slideUp">
                    <div className="text-center mb-6 sm:mb-8">
                        <span className="text-4xl sm:text-5xl">🏡</span>
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-3">Create an Account</h1>
                        <p className="text-gray-500 mt-1 text-sm">Join thousands of families who found their companion</p>
                    </div>

                    {error && <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3 mb-5">⚠️ {error}</div>}

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 space-y-4">

                        {/* Google Button */}
                        <button onClick={() => googleLoginHook()} className="w-full flex items-center justify-center gap-3 border border-gray-200 rounded-xl py-3 hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700">
                            <svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                            Continue with Google
                        </button>

                        <div className="flex items-center gap-3"><div className="flex-1 h-px bg-gray-200" /><span className="text-xs text-gray-400">or</span><div className="flex-1 h-px bg-gray-200" /></div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">👤 Full Name</label>
                            <input type="text" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" placeholder="John Doe" value={name} onChange={e => setName(e.target.value)} onKeyDown={handleKeyDown} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">📧 Email</label>
                            <input type="email" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} onKeyDown={handleKeyDown} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">🔒 Password</label>
                            <input type="password" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" placeholder="Min. 6 characters" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={handleKeyDown} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">🔑 Confirm Password</label>
                            <input type="password" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" placeholder="••••••••" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} onKeyDown={handleKeyDown} />
                        </div>
                        <button onClick={handleRegister} disabled={loading} className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-all hover:scale-[1.02] shadow-md">{loading ? "Creating... 🐾" : "Create Account →"}</button>
                    </div>
                    <p className="text-center text-sm text-gray-500 mt-6">Already have an account? <Link to="/login" className="text-orange-500 font-semibold hover:underline">Login here 🐱</Link></p>
                </div>
            </div>
        </div>
    );
}