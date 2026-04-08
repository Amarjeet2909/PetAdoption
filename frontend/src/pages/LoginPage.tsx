import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../api/authApi";
import AuthSlider from "../components/ui/AuthSlider";

export default function LoginPage() {

    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        setError("");
        setLoading(true);

        try {
            const result = await loginUser({ email, password });
            localStorage.setItem("token", result.token);
            navigate("/pets");
        } catch {
            setError("Invalid email or password. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") handleLogin();
    };

    return (
        <div className="min-h-screen grid md:grid-cols-2">

            {/* Left — Animated Slider */}
            <AuthSlider />

            {/* Right — Login Form */}
            <div className="flex items-center justify-center bg-gray-50 px-6 py-12">

                <div className="w-full max-w-md animate-slideUp">

                    {/* Header */}
                    <div className="text-center mb-8">
                        <span className="text-5xl">🐾</span>
                        <h1 className="text-3xl font-extrabold text-gray-900 mt-3">
                            Welcome Back!
                        </h1>
                        <p className="text-gray-500 mt-1 text-sm">
                            Login to continue finding your perfect companion
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
                                onChange={e => setEmail(e.target.value)}
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
                                placeholder="••••••••"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                onKeyDown={handleKeyDown}
                            />
                        </div>

                        <button
                            onClick={handleLogin}
                            disabled={loading}
                            className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-all hover:scale-[1.02] shadow-md"
                        >
                            {loading ? "Logging in... 🐾" : "Login →"}
                        </button>

                    </div>

                    {/* Footer Link */}
                    <p className="text-center text-sm text-gray-500 mt-6">
                        Don't have an account?{" "}
                        <Link
                            to="/register"
                            className="text-orange-500 font-semibold hover:underline"
                        >
                            Register here 🐶
                        </Link>
                    </p>

                </div>

            </div>

        </div>
    );
}