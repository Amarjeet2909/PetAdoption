import { useEffect, useState } from "react";

const slides = [
    {
        emoji: "🐶",
        title: "Find Your Best Friend",
        subtitle: "Thousands of dogs are waiting for a loving home like yours.",
        bg: "from-orange-400 to-orange-600",
    },
    {
        emoji: "🐱",
        title: "Adopt, Don't Shop",
        subtitle: "Give a rescued cat the warm home they've always deserved.",
        bg: "from-pink-400 to-rose-500",
    },
    {
        emoji: "🐰",
        title: "Every Pet Needs Love",
        subtitle: "From bunnies to birds — find the perfect companion nearby.",
        bg: "from-purple-400 to-purple-600",
    },
    {
        emoji: "🏡",
        title: "Change a Life Today",
        subtitle: "Adoption is the most loving thing you can do for a pet.",
        bg: "from-teal-400 to-cyan-600",
    },
];

export default function AuthSlider() {

    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent(prev => (prev + 1) % slides.length);
        }, 3000);

        return () => clearInterval(timer);
    }, []);

    const slide = slides[current];

    return (
        <div className={`hidden md:flex flex-col items-center justify-center bg-gradient-to-br ${slide.bg} transition-all duration-700 w-full h-full px-10 text-white text-center`}>

            <div key={current} className="animate-slideUp">

                <div className="text-8xl mb-6 drop-shadow-lg">
                    {slide.emoji}
                </div>

                <h2 className="text-3xl font-extrabold mb-3 leading-snug">
                    {slide.title}
                </h2>

                <p className="text-base opacity-90 leading-relaxed max-w-xs mx-auto">
                    {slide.subtitle}
                </p>

            </div>

            {/* Dot indicators */}
            <div className="flex gap-2 mt-10">
                {slides.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setCurrent(i)}
                        className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${i === current ? "bg-white scale-125" : "bg-white/40"
                            }`}
                    />
                ))}
            </div>

        </div>
    );
}