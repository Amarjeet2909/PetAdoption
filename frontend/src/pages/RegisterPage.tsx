import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../api/authApi";
import AuthSlider from "../components/ui/AuthSlider";

export default function RegisterPage() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleRegister = async () => {
        setError("");

        if (!email || !password || !confirmPassword) {
            setError("Please fill in all fields.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters.");
            return;
        }

        setLoading(true);

        try {
            const result = await registerUser({ email, password });
            localStorage.setItem("token", result.token);
            navigate("/pets");
        } catch {
            setError("Registration failed. This email may already be in use.");
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") handleRegister();
    };

    return (
        <div className="min-h-screen grid md:grid-cols-2">
            {/* Left — Animated Slider */}
            <AuthSlider />

            {/* Right — Register Form */}
            <div className="flex items-center justify-center bg-gray-50 px-6 py-12">
                <div className="w-full max-w-md animate-slideUp">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <span className="text-5xl">🏡</span>
                        <h1 className="text-3xl font-extrabold text-gray-900 mt-3">
                            Create an Account
                        </h1>
                        <p className="text-gray-500 mt-1 text-sm">
                            Join thousands of families who found their companion
                        </p>
                    </div>

                    {/* Error Banner */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3 mb-5">
                            ⚠️ {error}
                        </div>
                    )}

                    {/* Form */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                📧 Email Address
                            </label>
                            <input
                                type="email"
                                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                onKeyDown={handleKeyDown}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                🔒 Password
                            </label>
                            <input
                                type="password"
                                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
                                placeholder="Min. 6 characters"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                onKeyDown={handleKeyDown}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                🔑 Confirm Password
                            </label>
                            <input
                                type="password"
                                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
                                placeholder="••••••••"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                onKeyDown={handleKeyDown}
                            />
                        </div>

                        <button
                            onClick={handleRegister}
                            disabled={loading}
                            className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-all hover:scale-[1.02] shadow-md"
                        >
                            {loading ? "Creating account... 🐾" : "Create Account →"}
                        </button>
                    </div>

                    {/* Footer Link */}
                    <p className="text-center text-sm text-gray-500 mt-6">
                        Already have an account?{" "}
                        <Link
                            to="/login"
                            className="text-orange-500 font-semibold hover:underline"
                        >
                            Login here 🐱
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}