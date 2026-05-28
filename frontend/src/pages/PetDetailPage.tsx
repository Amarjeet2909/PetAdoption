import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPetById, adoptPet } from "../api/petsApi";
import type { PetDetail } from "../types/petTypes";
import Loader from "../components/ui/Loader";
import ImageCarousel from "../components/ui/ImageCarousel";

const statusStyles: Record<string, string> = {
    Available: "bg-green-100 text-green-700",
    Adopted: "bg-gray-100 text-gray-500",
    Disabled: "bg-red-100 text-red-500",
};

export default function PetDetailPage() {

    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [pet, setPet] = useState<PetDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    const [adopting, setAdopting] = useState(false);
    const [adopted, setAdopted] = useState(false);
    const [adoptError, setAdoptError] = useState("");

    useEffect(() => {
        const fetchPet = async () => {
            try {
                const data = await getPetById(id!);
                setPet(data);
            } catch (err: any) {
                if (err?.response?.status === 404) setNotFound(true);
            } finally {
                setLoading(false);
            }
        };
        fetchPet();
    }, [id]);

    const handleAdopt = async () => {
        setAdoptError("");
        setAdopting(true);
        try {
            await adoptPet(id!);
            setAdopted(true);
            setPet(prev => prev ? { ...prev, status: "Adopted" } : prev);
        } catch (err: any) {
            setAdoptError(err?.response?.data?.message || "Adoption failed. Please try again.");
        } finally {
            setAdopting(false);
        }
    };

    if (loading) return <Loader />;

    if (notFound || !pet) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6">
                <span className="text-7xl mb-4">🐾</span>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Pet Not Found</h2>
                <p className="text-gray-500 mb-6">This pet may have already been adopted or removed.</p>
                <button onClick={() => navigate("/pets")} className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-full transition-all">← Back to Pets</button>
            </div>
        );
    }

    const badgeStyle = statusStyles[pet.status] ?? "bg-gray-100 text-gray-500";

    return (
        <div className="max-w-4xl mx-auto px-6 py-12 animate-slideUp">

            <button onClick={() => navigate("/pets")} className="flex items-center gap-2 text-sm text-gray-500 hover:text-orange-500 transition-colors mb-8">← Back to all pets</button>

            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">

                {/* Image Gallery — Auto-scrolling */}
                <ImageCarousel
                    images={pet.photoUrls}
                    altText={pet.name}
                    height="h-72 sm:h-96"
                    rounded=""
                    interval={4000}
                />

                {/* Name + Status bar */}
                <div className="bg-gradient-to-r from-orange-400 to-orange-500 px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <h1 className="text-2xl font-extrabold text-white">{pet.name}</h1>
                    <div className="flex gap-2">
                        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${badgeStyle}`}>🏷️ {pet.status}</span>
                        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-orange-100 text-orange-700">{pet.species}</span>
                    </div>
                </div>

                {/* Content */}
                <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">

                    {/* Left — Key Facts */}
                    <div>
                        <h2 className="text-lg font-bold text-gray-800 mb-4">🐾 Pet Details</h2>
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

                    {/* Right — Description + Adopt */}
                    <div>
                        <h2 className="text-lg font-bold text-gray-800 mb-4">📝 About {pet.name}</h2>
                        <p className="text-sm text-gray-600 leading-relaxed bg-orange-50 rounded-2xl p-4">
                            {pet.description || "No description provided for this pet."}
                        </p>

                        {pet.status === "Available" && !adopted && (
                            <div className="mt-6">
                                {adoptError && (
                                    <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3 mb-3">⚠️ {adoptError}</div>
                                )}
                                <button onClick={handleAdopt} disabled={adopting} className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-all hover:scale-[1.02] shadow-md">
                                    {adopting ? "Processing... 🐾" : `❤️ Adopt ${pet.name}`}
                                </button>
                                <p className="text-xs text-center text-gray-400 mt-2">Any logged-in user can adopt an available pet.</p>
                            </div>
                        )}

                        {adopted && (
                            <div className="mt-6 bg-green-50 border border-green-200 rounded-xl p-4 text-center">
                                <span className="text-3xl">🎉</span>
                                <p className="text-green-700 font-semibold mt-2">{pet.name} has been adopted!</p>
                                <p className="text-green-600 text-xs mt-1">Congratulations on your new companion.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}