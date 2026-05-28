import { Link } from "react-router-dom";

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-gray-400 mt-auto">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14 grid grid-cols-2 md:grid-cols-4 gap-8">

                {/* Brand */}
                <div className="col-span-2 md:col-span-1">
                    <div className="flex items-center gap-2 mb-3">
                        <span className="text-2xl">🐾</span>
                        <span className="text-white font-bold text-lg">PetAdopt</span>
                    </div>
                    <p className="text-sm leading-relaxed mb-4">
                        India's most loved pet adoption platform. Connecting pets with loving families since 2024.
                    </p>
                    <div className="flex gap-3">
                        <a href="#" className="w-8 h-8 bg-gray-800 hover:bg-orange-500 rounded-full flex items-center justify-center transition-colors text-sm">𝕏</a>
                        <a href="#" className="w-8 h-8 bg-gray-800 hover:bg-orange-500 rounded-full flex items-center justify-center transition-colors text-sm">📘</a>
                        <a href="#" className="w-8 h-8 bg-gray-800 hover:bg-orange-500 rounded-full flex items-center justify-center transition-colors text-sm">📸</a>
                        <a href="#" className="w-8 h-8 bg-gray-800 hover:bg-orange-500 rounded-full flex items-center justify-center transition-colors text-sm">▶️</a>
                    </div>
                </div>

                {/* Explore */}
                <div>
                    <h4 className="text-white font-semibold mb-3 text-sm">Explore</h4>
                    <ul className="space-y-2 text-sm">
                        <li><Link to="/pets" className="hover:text-orange-400 transition-colors">Browse Pets</Link></li>
                        <li><Link to="/pets/nearby" className="hover:text-orange-400 transition-colors">Nearby Pets</Link></li>
                        <li><Link to="/pets/create" className="hover:text-orange-400 transition-colors">List a Pet</Link></li>
                        <li><Link to="/my-pets" className="hover:text-orange-400 transition-colors">My Pets</Link></li>
                    </ul>
                </div>

                {/* Account */}
                <div>
                    <h4 className="text-white font-semibold mb-3 text-sm">Account</h4>
                    <ul className="space-y-2 text-sm">
                        <li><Link to="/login" className="hover:text-orange-400 transition-colors">Login</Link></li>
                        <li><Link to="/register" className="hover:text-orange-400 transition-colors">Register</Link></li>
                        <li><Link to="/profile" className="hover:text-orange-400 transition-colors">Edit Profile</Link></li>
                        <li><Link to="/profile/delete" className="hover:text-orange-400 transition-colors">Delete Account</Link></li>
                    </ul>
                </div>

                {/* Contact */}
                <div>
                    <h4 className="text-white font-semibold mb-3 text-sm">Contact Us</h4>
                    <ul className="space-y-2 text-sm">
                        <li className="flex items-center gap-2">📧 support@petadopt.com</li>
                        <li className="flex items-center gap-2">📞 +91 98765 43210</li>
                        <li className="flex items-center gap-2">📍 Mumbai, India</li>
                        <li className="flex items-center gap-2">🕐 Mon–Sat, 9am–7pm</li>
                    </ul>
                </div>
            </div>

            {/* Bottom bar */}
            <div className="border-t border-gray-800">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-600">
                    <span>© {new Date().getFullYear()} PetAdopt. All rights reserved.</span>
                    <div className="flex gap-4">
                        <a href="#" className="hover:text-orange-400 transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-orange-400 transition-colors">Terms of Service</a>
                        <a href="#" className="hover:text-orange-400 transition-colors">Support</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}