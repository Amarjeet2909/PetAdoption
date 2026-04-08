import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getPets } from "../api/petsApi";
import type { Pet } from "../types/petTypes";
import Loader from "../components/ui/Loader";

export default function PetsPage() {

    const [pets, setPets] = useState<Pet[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const fetchPets = async () => {
            try {
                const data = await getPets();
                setPets(data.items);
            } catch {
                alert("Failed to load pets");
            } finally {
                setLoading(false);
            }
        };

        fetchPets();

    }, []);

    if (loading) return <Loader />;

    return (
        <div className="max-w-6xl mx-auto px-6 py-12">

            <h1 className="text-3xl font-bold text-gray-900 mb-8">
                Pets Available
            </h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

                {pets.map((pet) => (

                    <Link
                        key={pet.id}
                        to={`/pets/${pet.id}`}
                        className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md hover:scale-[1.01] transition-all block"
                    >
                        <h2 className="text-xl font-semibold text-gray-800 mb-3">
                            {pet.name}
                        </h2>

                        <div className="text-sm text-gray-500 space-y-1">
                            <p>🐾 Species: <span className="text-gray-700">{pet.species}</span></p>
                            <p>🎂 Age: <span className="text-gray-700">{pet.ageInMonths} months</span></p>
                            <p>⚧ Gender: <span className="text-gray-700">{pet.gender}</span></p>
                            <p>💉 Vaccinated: <span className="text-gray-700">{pet.isVaccinated ? "Yes" : "No"}</span></p>
                            <p>📍 Location: <span className="text-gray-700">{pet.city}, {pet.state}</span></p>
                            <p>🏷️ Status: <span className="text-orange-500 font-medium">{pet.status}</span></p>
                        </div>

                        <div className="mt-4 text-xs text-orange-400 font-semibold">
                            View Details →
                        </div>

                    </Link>

                ))}

            </div>

        </div>
    );
}