import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

// Animated counter hook
function useCountUp(target: number, duration = 4000) {
    const [count, setCount] = useState(0);
    const [started, setStarted] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting && !started) setStarted(true); },
            { threshold: 0.5 }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, [started]);

    useEffect(() => {
        if (!started) return;
        let start = 0;
        const step = target / (duration / 16);
        const timer = setInterval(() => {
            start += step;
            if (start >= target) { setCount(target); clearInterval(timer); }
            else setCount(Math.floor(start));
        }, 16);
        return () => clearInterval(timer);
    }, [started, target, duration]);

    return { count, ref };
}

function StatCard({ target, label, suffix = "" }: { target: number; label: string; suffix?: string }) {
    const { count, ref } = useCountUp(target);
    return (
        <div ref={ref} className="text-center">
            <p className="text-3xl sm:text-4xl font-extrabold text-white">{count.toLocaleString()}{suffix}</p>
            <p className="text-xs sm:text-sm mt-1 text-orange-100">{label}</p>
        </div>
    );
}

const features = [
    { icon: "📍", title: "Location-Based Search", description: "Find adoptable pets near you using GPS. Set your radius and discover companions in your neighborhood." },
    { icon: "🛡️", title: "Verified Listings", description: "All pet listings are reviewed. Every pet has health records, vaccination status, and verified owners." },
    { icon: "❤️", title: "One-Click Adoption", description: "Found your match? Adopt with a single click. No paperwork, no hassle — just love." },
    { icon: "📷", title: "Photo Galleries", description: "See multiple photos of each pet with auto-scrolling galleries. Know exactly who you're welcoming home." },
    { icon: "🔔", title: "Real-Time Updates", description: "Pet status updates in real-time. Know instantly when a pet gets adopted or becomes available." },
    { icon: "🌍", title: "Community Driven", description: "Join thousands of animal lovers helping pets find forever homes across the country." },
];

const howItWorks = [
    { step: "1", icon: "🔍", title: "Browse & Search", description: "Explore pets by location, species, age, or vaccination status." },
    { step: "2", icon: "💕", title: "Find Your Match", description: "View detailed profiles with photos, descriptions, and health info." },
    { step: "3", icon: "🏠", title: "Adopt & Love", description: "Click adopt and welcome your new family member home!" },
];

const testimonials = [
    { name: "Priya S.", city: "Mumbai", text: "Found my beautiful Labrador within 5km of my home. The process was so smooth!", avatar: "🧑‍🦱" },
    { name: "Rahul M.", city: "Delhi", text: "Listed my cat and she found a loving family within 2 days. Amazing platform!", avatar: "👨" },
    { name: "Sneha K.", city: "Bangalore", text: "The nearby search feature is brilliant. Adopted a rescued kitten easily!", avatar: "👩" },
];

export default function HomePage() {
    return (
        <div>

            {/* ── Hero Section ── */}
            <section className="bg-gradient-to-br from-orange-50 via-white to-orange-100 py-16 sm:py-28 px-4 sm:px-6 text-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-5">
                    <div className="absolute top-10 left-10 text-8xl">🐾</div>
                    <div className="absolute bottom-10 right-10 text-8xl">🐶</div>
                    <div className="absolute top-1/2 left-1/4 text-6xl">🐱</div>
                </div>
                <div className="max-w-3xl mx-auto relative z-10">
                    <span className="inline-block bg-orange-100 text-orange-600 text-xs sm:text-sm font-semibold px-4 py-1.5 rounded-full mb-4 sm:mb-6 animate-bounce">🐾 #1 Pet Adoption Platform in India</span>
                    <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-4 sm:mb-6">
                        Every Pet Deserves a <span className="text-orange-500">Loving Home</span>
                    </h1>
                    <p className="text-base sm:text-lg text-gray-500 mb-8 sm:mb-10 leading-relaxed max-w-2xl mx-auto">
                        Connect with pets waiting for adoption near you. Browse photos, filter by species, and adopt with one click. Zero fees, pure love.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
                        <Link to="/pets" className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-3.5 rounded-full shadow-lg transition-all hover:scale-105 hover:shadow-xl">🐾 Browse Pets →</Link>
                        <Link to="/pets/nearby" className="border-2 border-orange-400 text-orange-500 hover:bg-orange-50 font-semibold px-8 py-3.5 rounded-full transition-all">📍 Find Nearby</Link>
                    </div>
                </div>
            </section>

            {/* ── Animated Stats Bar ── */}
            <section className="bg-gradient-to-r from-orange-500 to-orange-600 py-10 sm:py-14 px-4 sm:px-6">
                <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
                    <StatCard target={1200} label="Pets Adopted" suffix="+" />
                    <StatCard target={850} label="Happy Families" suffix="+" />
                    <StatCard target={50} label="Cities Covered" suffix="+" />
                    <StatCard target={100} label="Free Forever" suffix="%" />
                </div>
            </section>

            {/* ── How It Works ── */}
            <section className="py-14 sm:py-20 px-4 sm:px-6 bg-gray-50">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-10 sm:mb-14">
                        <span className="text-xs font-semibold text-orange-500 uppercase tracking-wider">Simple Process</span>
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-2 mb-3">How It Works</h2>
                        <p className="text-gray-500 text-sm sm:text-base">Three simple steps to bring home your new best friend.</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
                        {howItWorks.map((item) => (
                            <div key={item.step} className="text-center bg-white rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
                                <div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4">{item.icon}</div>
                                <span className="text-xs font-bold text-orange-500 uppercase">Step {item.step}</span>
                                <h3 className="text-lg font-bold text-gray-800 mt-2 mb-2">{item.title}</h3>
                                <p className="text-sm text-gray-500 leading-relaxed">{item.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Features Grid ── */}
            <section className="py-14 sm:py-20 px-4 sm:px-6 bg-white">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-10 sm:mb-14">
                        <span className="text-xs font-semibold text-orange-500 uppercase tracking-wider">Why PetAdopt</span>
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-2 mb-3">Everything You Need</h2>
                        <p className="text-gray-500 text-sm sm:text-base">Powerful features to make pet adoption effortless and joyful.</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        {features.map((feature) => (
                            <div key={feature.title} className="bg-gradient-to-br from-orange-50 to-white rounded-2xl p-5 sm:p-6 hover:shadow-md transition-all border border-orange-100/50">
                                <div className="text-3xl mb-3">{feature.icon}</div>
                                <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-2">{feature.title}</h3>
                                <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Testimonials ── */}
            <section className="py-14 sm:py-20 px-4 sm:px-6 bg-gray-50">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-10 sm:mb-14">
                        <span className="text-xs font-semibold text-orange-500 uppercase tracking-wider">Testimonials</span>
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-2 mb-3">Loved by Pet Parents</h2>
                        <p className="text-gray-500 text-sm sm:text-base">Real stories from our happy adopters.</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                        {testimonials.map((t) => (
                            <div key={t.name} className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-gray-100">
                                <p className="text-sm text-gray-600 leading-relaxed mb-4 italic">"{t.text}"</p>
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl">{t.avatar}</span>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-800">{t.name}</p>
                                        <p className="text-xs text-gray-400">{t.city}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── CTA Banner ── */}
            <section className="bg-gradient-to-r from-orange-500 via-orange-500 to-orange-600 py-14 sm:py-20 px-4 sm:px-6 text-center text-white relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-5 right-20 text-7xl">🐕</div>
                    <div className="absolute bottom-5 left-20 text-7xl">🐈</div>
                </div>
                <div className="relative z-10 max-w-2xl mx-auto">
                    <h2 className="text-2xl sm:text-4xl font-bold mb-3 sm:mb-4">Ready to Change a Life?</h2>
                    <p className="mb-6 sm:mb-8 text-orange-100 text-sm sm:text-base">Every adoption saves two lives — the pet you bring home and the next one that takes its place in the shelter.</p>
                    <div className="flex flex-col sm:flex-row justify-center gap-3">
                        <Link to="/pets" className="bg-white text-orange-500 font-bold px-8 py-3.5 rounded-full hover:scale-105 transition-all shadow-lg">🐾 Adopt Now</Link>
                        <Link to="/pets/create" className="border-2 border-white text-white font-bold px-8 py-3.5 rounded-full hover:bg-white/10 transition-all">📋 List a Pet</Link>
                    </div>
                </div>
            </section>
        </div>
    );
}