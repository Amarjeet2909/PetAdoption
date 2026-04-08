export default function Footer() {
    return (
        <footer className="bg-gray-900 text-gray-400 mt-auto">
            <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">

                {/* Brand */}
                <div>
                    <div className="flex items-center gap-2 mb-3">
                        <span className="text-2xl">🐾</span>
                        <span className="text-white font-bold text-lg">PetAdopt</span>
                    </div>
                    <p className="text-sm leading-relaxed">
                        Connecting loving homes with pets in need. Every pet deserves a family.
                    </p>
                </div>

                {/* Quick Links */}
                <div>
                    <h4 className="text-white font-semibold mb-3">Quick Links</h4>
                    <ul className="space-y-2 text-sm">
                        <li><a href="/" className="hover:text-orange-400 transition-colors">Home</a></li>
                        <li><a href="/pets" className="hover:text-orange-400 transition-colors">Browse Pets</a></li>
                        <li><a href="/login" className="hover:text-orange-400 transition-colors">Login</a></li>
                        <li><a href="/register" className="hover:text-orange-400 transition-colors">Register</a></li>
                    </ul>
                </div>

                {/* Contact */}
                <div>
                    <h4 className="text-white font-semibold mb-3">Contact</h4>
                    <ul className="space-y-2 text-sm">
                        <li>📧 support@petadopt.com</li>
                        <li>📍 India</li>
                        <li>🕐 Mon–Fri, 9am–6pm</li>
                    </ul>
                </div>

            </div>

            <div className="border-t border-gray-800 text-center text-xs py-4 text-gray-600">
                © {new Date().getFullYear()} PetAdopt. All rights reserved.
            </div>
        </footer>
    );
}