import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPetById } from "../api/petsApi";
import { sendAdoptionRequest } from "../api/adoptionApi";
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

    const [message, setMessage] = useState("");
    const [requesting, setRequesting] = useState(false);
    const [requestSent, setRequestSent] = useState(false);
    const [requestError, setRequestError] = useState("");

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

    const handleSendRequest = async () => {
        setRequestError("");
        setRequesting(true);
        try {
            await sendAdoptionRequest(id!, message.trim());
            setRequestSent(true);
        } catch (err: any) {
            setRequestError(err?.response?.data?.message || "Failed to send request. Please try again.");
        } finally {
            setRequesting(false);
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

                <ImageCarousel images={pet.photoUrls} altText={pet.name} height="h-72 sm:h-96" rounded="" interval={4000} />

                <div className="bg-gradient-to-r from-orange-400 to-orange-500 px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <h1 className="text-2xl font-extrabold text-white">{pet.name}</h1>
                    <div className="flex gap-2">
                        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${badgeStyle}`}>🏷️ {pet.status}</span>
                        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-orange-100 text-orange-700">{pet.species}</span>
                    </div>
                </div>

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

                    {/* Right — Description + Adoption Request */}
                    <div>
                        <h2 className="text-lg font-bold text-gray-800 mb-4">📝 About {pet.name}</h2>
                        <p className="text-sm text-gray-600 leading-relaxed bg-orange-50 rounded-2xl p-4">
                            {pet.description || "No description provided for this pet."}
                        </p>

                        {pet.status === "Available" && !requestSent && (
                            <div className="mt-6 space-y-3">
                                <h3 className="text-sm font-bold text-gray-800">❤️ Request Adoption</h3>
                                <textarea
                                    rows={3}
                                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none"
                                    placeholder="Introduce yourself and why you'd like to adopt this pet..."
                                    value={message}
                                    onChange={e => setMessage(e.target.value)}
                                />
                                {requestError && (
                                    <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3">⚠️ {requestError}</div>
                                )}
                                <button
                                    onClick={handleSendRequest}
                                    disabled={requesting}
                                    className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-all hover:scale-[1.02] shadow-md"
                                >
                                    {requesting ? "Sending Request... 🐾" : `❤️ Send Adoption Request`}
                                </button>
                                <p className="text-xs text-center text-gray-400">
                                    The owner will review and approve your request.
                                </p>
                            </div>
                        )}

                        {requestSent && (
                            <div className="mt-6 bg-green-50 border border-green-200 rounded-xl p-4 text-center">
                                <span className="text-3xl">🎉</span>
                                <p className="text-green-700 font-semibold mt-2">Request Sent!</p>
                                <p className="text-green-600 text-xs mt-1">
                                    The owner will review your request. Check your requests in{" "}
                                    <button onClick={() => navigate("/adoption-requests")} className="underline font-semibold">My Requests</button>.
                                </p>
                            </div>
                        )}

                        {pet.status === "Adopted" && (
                            <div className="mt-6 bg-gray-50 border border-gray-200 rounded-xl p-4 text-center">
                                <span className="text-3xl">🏠</span>
                                <p className="text-gray-600 font-semibold mt-2">This pet has found a home!</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}