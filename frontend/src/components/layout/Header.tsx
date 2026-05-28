import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { isAdmin } from "../../utils/authUtils";

export default function Header() {

    const navigate = useNavigate();
    const isLoggedIn = !!localStorage.getItem("token");
    const [showDropdown, setShowDropdown] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        setMobileMenuOpen(false);
        setShowDropdown(false);
        navigate("/login");
    };

    return (
        <header className="bg-white shadow-sm sticky top-0 z-40">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">

                {/* Logo */}
                <Link to="/" className="flex items-center gap-2">
                    <span className="text-2xl">🐾</span>
                    <span className="text-lg sm:text-xl font-bold text-orange-500 tracking-tight">PetAdopt</span>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-5 lg:gap-6 text-sm font-medium text-gray-600">
                    <Link to="/" className="hover:text-orange-500 transition-colors">Home</Link>
                    <Link to="/pets" className="hover:text-orange-500 transition-colors">Browse Pets</Link>
                    <Link to="/pets/nearby" className="hover:text-orange-500 transition-colors">📍 Nearby</Link>

                    {isLoggedIn ? (
                        <div className="flex items-center gap-3">
                            <Link to="/pets/create" className="hover:text-orange-500 transition-colors">🐾 List Pet</Link>
                            {isAdmin() && (
                                <Link to="/admin" className="text-purple-600 hover:text-purple-700 transition-colors font-semibold">🛡️ Admin</Link>
                            )}

                            {/* Profile — CLICK based */}
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={() => setShowDropdown(!showDropdown)}
                                    className="w-9 h-9 bg-orange-100 hover:bg-orange-200 text-orange-600 rounded-full flex items-center justify-center transition-colors"
                                >
                                    <span className="text-lg">👤</span>
                                </button>

                                {showDropdown && (
                                    <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 animate-slideUp">
                                        <Link to="/my-pets" onClick={() => setShowDropdown(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-500 transition-colors"><span>🐶</span> My Pets</Link>
                                        <Link to="/profile" onClick={() => setShowDropdown(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-500 transition-colors"><span>✏️</span> Edit Profile</Link>
                                        <Link to="/profile/delete" onClick={() => setShowDropdown(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-red-50 hover:text-red-500 transition-colors"><span>🗑️</span> Delete Account</Link>
                                        {isAdmin() && (
                                            <>
                                                <div className="border-t border-gray-100 my-1" />
                                                <Link to="/admin" onClick={() => setShowDropdown(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-purple-600 hover:bg-purple-50 transition-colors font-semibold"><span>🛡️</span> Admin Panel</Link>
                                            </>
                                        )}
                                        <div className="border-t border-gray-100 my-1" />
                                        <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-red-50 hover:text-red-500 transition-colors w-full text-left"><span>🚪</span> Logout</button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center gap-3">
                            <Link to="/login" className="hover:text-orange-500 transition-colors">Login</Link>
                            <Link to="/register" className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-full transition-colors text-sm">Register</Link>
                        </div>
                    )}
                </nav>

                {/* Mobile Hamburger */}
                <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors">
                    <span className="text-xl">{mobileMenuOpen ? "✕" : "☰"}</span>
                </button>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden border-t border-gray-100 bg-white px-4 pb-4 animate-slideUp">
                    <div className="flex flex-col gap-1 pt-3">
                        <Link to="/" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-orange-50 hover:text-orange-500 transition-colors">🏠 Home</Link>
                        <Link to="/pets" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-orange-50 hover:text-orange-500 transition-colors">🐾 Browse Pets</Link>
                        <Link to="/pets/nearby" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-orange-50 hover:text-orange-500 transition-colors">📍 Nearby</Link>
                        {isLoggedIn ? (
                            <>
                                <Link to="/pets/create" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-orange-50 hover:text-orange-500 transition-colors">➕ List Pet</Link>
                                <Link to="/my-pets" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-orange-50 hover:text-orange-500 transition-colors">🐶 My Pets</Link>
                                <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-orange-50 hover:text-orange-500 transition-colors">✏️ Profile</Link>
                                {isAdmin() && (
                                    <Link to="/admin" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 rounded-xl text-sm font-semibold text-purple-600 hover:bg-purple-50 transition-colors">🛡️ Admin Panel</Link>
                                )}
                                <div className="border-t border-gray-100 my-2" />
                                <button onClick={handleLogout} className="px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-colors text-left w-full">🚪 Logout</button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-orange-50 hover:text-orange-500 transition-colors">🔑 Login</Link>
                                <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="mx-4 py-3 rounded-xl text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 transition-colors text-center">Register</Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
}