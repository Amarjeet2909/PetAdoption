import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPetById } from "../api/petsApi";
import type { PetDetail } from "../types/petTypes";
import Loader from "../components/ui/Loader";

const speciesEmoji: Record<string, string> = {
    Dog: "🐶",
    Cat: "🐱",
    Rabbit: "🐰",
    Bird: "🐦",
    Fish: "🐟",
    Other: "🐾",
};

const statusStyles: Record<string, string> = {
    Available: "bg-green-100 text-green-700",
    Adopted:   "bg-gray-100 text-gray-500",
    Disabled:  "bg-red-100 text-red-500",
};

export default function PetDetailPage() {

    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [pet, setPet] = useState<PetDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {

        const fetchPet = async () => {
            try {
                const data = await getPetById(id!);
                setPet(data);
            } catch (err: any) {
                if (err?.response?.status === 404) {
                    setNotFound(true);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchPet();

    }, [id]);

    if (loading) return <Loader />;

    // ── Not Found State ──
    if (notFound || !pet) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6">
                <span className="text-7xl mb-4">🐾</span>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Pet Not Found</h2>
                <p className="text-gray-500 mb-6">
                    This pet may have already been adopted or removed.
                </p>
                <button
                    onClick={() => navigate("/pets")}
                    className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-full transition-all"
                >
                    ← Back to Pets
                </button>
            </div>
        );
    }

    const emoji = speciesEmoji[pet.species] ?? "🐾";
    const badgeStyle = statusStyles[pet.status] ?? "bg-gray-100 text-gray-500";

    // ── Detail Page ──
    return (
        <div className="max-w-4xl mx-auto px-6 py-12 animate-slideUp">

            {/* Back Button */}
            <button
                onClick={() => navigate("/pets")}
                className="flex items-center gap-2 text-sm text-gray-500 hover:text-orange-500 transition-colors mb-8"
            >
                ← Back to all pets
            </button>

            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">

                {/* Top Banner */}
                <div className="bg-gradient-to-r from-orange-400 to-orange-500 px-8 py-10 flex flex-col sm:flex-row items-center gap-6">

                    {/* Avatar */}
                    <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-5xl shadow-md flex-shrink-0">
                        {emoji}
                    </div>

                    {/* Name + Status */}
                    <div className="text-center sm:text-left">
                        <h1 className="text-3xl font-extrabold text-white">
                            {pet.name}
                        </h1>
                        <div className="mt-2 flex flex-wrap justify-center sm:justify-start gap-2">
                            <span className={`text-xs font-semibold px-3 py-1 rounded-full ${badgeStyle}`}>
                                🏷️ {pet.status}
                            </span>
                            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-orange-100 text-orange-700">
                                {pet.species}
                            </span>
                        </div>
                    </div>

                </div>

                {/* Content */}
                <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">

                    {/* Left — Key Facts */}
                    <div>
                        <h2 className="text-lg font-bold text-gray-800 mb-4">
                            🐾 Pet Details
                        </h2>

                        <ul className="space-y-3 text-sm">
                            <li className="flex items-center justify-between border-b border-gray-50 pb-2">
                                <span className="text-gray-500">🎂 Age</span>
                                <span className="font-medium text-gray-800">{pet.ageInMonths} months</span>
                            </li>
                            <li className="flex items-center justify-between border-b border-gray-50 pb-2">
                                <span className="text-gray-500">⚧ Gender</span>
                                <span className="font-medium text-gray-800">{pet.gender}</span>
                            </li>
                            <li className="flex items-center justify-between border-b border-gray-50 pb-2">
                                <span className="text-gray-500">💉 Vaccinated</span>
                                <span className={`font-medium ${pet.isVaccinated ? "text-green-600" : "text-red-500"}`}>
                                    {pet.isVaccinated ? "Yes ✅" : "No ❌"}
                                </span>
                            </li>
                            <li className="flex items-center justify-between border-b border-gray-50 pb-2">
                                <span className="text-gray-500">📍 City</span>
                                <span className="font-medium text-gray-800">{pet.city}</span>
                            </li>
                            <li className="flex items-center justify-between pb-2">
                                <span className="text-gray-500">🗺️ State</span>
                                <span className="font-medium text-gray-800">{pet.state}</span>
                            </li>
                        </ul>
                    </div>

                    {/* Right — Description */}
                    <div>
                        <h2 className="text-lg font-bold text-gray-800 mb-4">
                            📝 About {pet.name}
                        </h2>

                        <p className="text-sm text-gray-600 leading-relaxed bg-orange-50 rounded-2xl p-4">
                            {pet.description || "No description provided for this pet."}
                        </p>

                        {/* Adopt CTA */}
                        {pet.status === "Available" && (
                            <div className="mt-6">
                                <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-xl transition-all hover:scale-[1.02] shadow-md">
                                    ❤️ Adopt {pet.name}
                                </button>
                                <p className="text-xs text-center text-gray-400 mt-2">
                                    You will be connected with the owner to proceed.
                                </p>
                            </div>
                        )}

                    </div>

                </div>

            </div>

        </div>
    );
}