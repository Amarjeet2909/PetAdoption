import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { verifyEmail, resendVerification } from "../api/authApi";

export default function VerifyEmailPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const email = (location.state as any)?.email || "";

    const [code, setCode] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);
    const [resending, setResending] = useState(false);

    const handleVerify = async () => {
        setError(""); setSuccess("");
        if (code.length !== 6) { setError("Please enter the 6-digit code."); return; }
        setLoading(true);
        try {
            const result = await verifyEmail({ email, code });
            localStorage.setItem("token", result.token);
            navigate("/pets");
        } catch (err: any) {
            setError(err?.response?.data?.message || "Invalid or expired code.");
        } finally { setLoading(false); }
    };

    const handleResend = async () => {
        setError(""); setSuccess("");
        setResending(true);
        try {
            await resendVerification(email);
            setSuccess("New code sent! Check your inbox.");
        } catch { setError("Failed to resend. Try again."); }
        finally { setResending(false); }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="w-full max-w-md animate-slideUp">
                <div className="text-center mb-8">
                    <span className="text-5xl">📧</span>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-3">Verify Your Email</h1>
                    <p className="text-gray-500 mt-2 text-sm">We sent a 6-digit code to <span className="font-semibold text-orange-500">{email}</span></p>
                </div>

                {error && <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3 mb-5">⚠️ {error}</div>}
                {success && <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg px-4 py-3 mb-5">✅ {success}</div>}

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">🔑 Verification Code</label>
                        <input
                            type="text"
                            maxLength={6}
                            className="w-full border border-gray-200 rounded-xl px-4 py-4 text-center text-2xl font-bold tracking-[0.5em] focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
                            placeholder="000000"
                            value={code}
                            onChange={e => setCode(e.target.value.replace(/\D/g, ""))}
                            onKeyDown={e => e.key === "Enter" && handleVerify()}
                        />
                    </div>

                    <button onClick={handleVerify} disabled={loading} className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-all hover:scale-[1.02] shadow-md">
                        {loading ? "Verifying..." : "✅ Verify Email"}
                    </button>

                    <div className="text-center">
                        <button onClick={handleResend} disabled={resending} className="text-sm text-orange-500 hover:underline font-semibold disabled:opacity-50">
                            {resending ? "Sending..." : "📩 Resend Code"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}