import { Link, useNavigate } from "react-router-dom";

export default function Header() {

    const navigate = useNavigate();
    const isLoggedIn = !!localStorage.getItem("token");

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <header className="bg-white shadow-sm sticky top-0 z-40">
            <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">

                {/* Logo */}
                <Link to="/" className="flex items-center gap-2">
                    <span className="text-2xl">🐾</span>
                    <span className="text-xl font-bold text-orange-500 tracking-tight">
                        PetAdopt
                    </span>
                </Link>

                {/* Navigation Links */}
                <nav className="flex items-center gap-6 text-sm font-medium text-gray-600">

                    <Link to="/" className="hover:text-orange-500 transition-colors">
                        Home
                    </Link>

                    <Link to="/pets" className="hover:text-orange-500 transition-colors">
                        Browse Pets
                    </Link>

                    {isLoggedIn ? (
                        <button
                            onClick={handleLogout}
                            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-full transition-colors"
                        >
                            Logout
                        </button>
                    ) : (
                        <div className="flex items-center gap-3">
                            <Link
                                to="/login"
                                className="hover:text-orange-500 transition-colors"
                            >
                                Login
                            </Link>
                            <Link
                                to="/register"
                                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-full transition-colors"
                            >
                                Register
                            </Link>
                        </div>
                    )}

                </nav>

            </div>
        </header>
    );
}