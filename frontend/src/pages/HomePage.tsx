import { Link } from "react-router-dom";

const features = [
    {
        icon: "🐶",
        title: "Find Nearby Pets",
        description: "Search pets available for adoption within your preferred radius using live location.",
    },
    {
        icon: "✅",
        title: "Verified & Vaccinated",
        description: "Every listed pet has health and vaccination details so you can adopt with confidence.",
    },
    {
        icon: "❤️",
        title: "Simple Adoption",
        description: "A smooth, guided process from browsing to bringing your new companion home.",
    },
    {
        icon: "🔒",
        title: "Secure & Trusted",
        description: "Your data is protected. Only verified owners can list pets on our platform.",
    },
];

const stats = [
    { value: "1,200+", label: "Pets Adopted" },
    { value: "800+", label: "Happy Families" },
    { value: "50+", label: "Cities Covered" },
    { value: "100%", label: "Free to Use" },
];

export default function HomePage() {
    return (
        <div>

            {/* ── Hero Section ── */}
            <section className="bg-gradient-to-br from-orange-50 via-white to-orange-100 py-24 px-6 text-center">
                <div className="max-w-3xl mx-auto">

                    <span className="inline-block bg-orange-100 text-orange-600 text-sm font-semibold px-4 py-1 rounded-full mb-6">
                        🐾 Find Your Perfect Companion
                    </span>

                    <h1 className="text-5xl font-extrabold text-gray-900 leading-tight mb-6">
                        Give a Pet a{" "}
                        <span className="text-orange-500">Loving Home</span>
                    </h1>

                    <p className="text-lg text-gray-500 mb-10 leading-relaxed">
                        Browse hundreds of cats, dogs, and more — all waiting for a family like yours.
                        Adopt locally, change a life forever.
                    </p>

                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link
                            to="/pets"
                            className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-3 rounded-full shadow-lg transition-all hover:scale-105"
                        >
                            Browse Pets →
                        </Link>
                        <Link
                            to="/register"
                            className="border border-orange-400 text-orange-500 hover:bg-orange-50 font-semibold px-8 py-3 rounded-full transition-all"
                        >
                            List Your Pet
                        </Link>
                    </div>

                </div>
            </section>

            {/* ── Stats Bar ── */}
            <section className="bg-orange-500 py-10 px-6">
                <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-white">
                    {stats.map((stat) => (
                        <div key={stat.label}>
                            <p className="text-3xl font-extrabold">{stat.value}</p>
                            <p className="text-sm mt-1 opacity-90">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── Features Section ── */}
            <section className="py-20 px-6 bg-white">
                <div className="max-w-5xl mx-auto">

                    <div className="text-center mb-14">
                        <h2 className="text-3xl font-bold text-gray-900 mb-3">
                            Why Choose PetAdopt?
                        </h2>
                        <p className="text-gray-500">
                            Everything you need to find and adopt your next best friend.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature) => (
                            <div
                                key={feature.title}
                                className="bg-orange-50 rounded-2xl p-6 text-center hover:shadow-md transition-shadow"
                            >
                                <div className="text-4xl mb-4">{feature.icon}</div>
                                <h3 className="text-lg font-bold text-gray-800 mb-2">
                                    {feature.title}
                                </h3>
                                <p className="text-sm text-gray-500 leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>

                </div>
            </section>

            {/* ── CTA Banner ── */}
            <section className="bg-gradient-to-r from-orange-400 to-orange-600 py-16 px-6 text-center text-white">
                <h2 className="text-3xl font-bold mb-4">
                    Ready to Meet Your New Best Friend?
                </h2>
                <p className="mb-8 text-orange-100">
                    Join thousands of families who found their companion through PetAdopt.
                </p>
                <Link
                    to="/register"
                    className="bg-white text-orange-500 font-bold px-8 py-3 rounded-full hover:scale-105 transition-all shadow-lg"
                >
                    Get Started — It's Free
                </Link>
            </section>

        </div>
    );
}