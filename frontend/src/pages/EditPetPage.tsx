import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPetById, updatePet } from "../api/petsApi";
import Loader from "../components/ui/Loader";

const speciesOptions = [
    { value: 0, label: "🐶 Dog" },
    { value: 1, label: "🐱 Cat" },
    { value: 2, label: "🐰 Rabbit" },
    { value: 3, label: "🐦 Bird" },
    { value: 4, label: "🐟 Fish" },
    { value: 5, label: "🐾 Other" },
];

const speciesMap: Record<string, number> = {
    Dog: 0, Cat: 1, Rabbit: 2, Bird: 3, Fish: 4, Other: 5
};

const genderOptions = [
    { value: 0, label: "Unknown" },
    { value: 1, label: "Male" },
    { value: 2, label: "Female" },
];

const genderMap: Record<string, number> = {
    Unknown: 0, Male: 1, Female: 2
};

export default function EditPetPage() {

    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const [name, setName] = useState("");
    const [species, setSpecies] = useState(0);
    const [ageInMonths, setAgeInMonths] = useState(0);
    const [gender, setGender] = useState(0);
    const [isVaccinated, setIsVaccinated] = useState(false);
    const [description, setDescription] = useState("");
    const [latitude, setLatitude] = useState(0);
    const [longitude, setLongitude] = useState(0);
    const [city, setCity] = useState("");
    const [state, setState] = useState("");

    useEffect(() => {
        const fetchPet = async () => {
            try {
                const pet = await getPetById(id!);

                if (pet.status === "Adopted") {
                    navigate("/my-pets");
                    return;
                }

                setName(pet.name);
                setSpecies(speciesMap[pet.species] ?? 0);
                setAgeInMonths(pet.ageInMonths);
                setGender(genderMap[pet.gender] ?? 0);
                setIsVaccinated(pet.isVaccinated);
                setDescription(pet.description);
                setLatitude(pet.latitude);
                setLongitude(pet.longitude);
                setCity(pet.city);
                setState(pet.state);
            } catch {
                setError("Failed to load pet details.");
            } finally {
                setLoading(false);
            }
        };

        fetchPet();
    }, [id]);

    const handleSubmit = async () => {
        setError("");

        if (!name.trim() || !city.trim() || !state.trim()) {
            setError("Name, City and State are required.");
            return;
        }

        setSaving(true);

        try {
            await updatePet(id!, {
                name: name.trim(),
                species,
                ageInMonths,
                gender,
                isVaccinated,
                description: description.trim(),
                latitude,
                longitude,
                city: city.trim(),
                state: state.trim(),
            });

            navigate(`/pets/${id}`);
        } catch {
            setError("Failed to update pet. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <Loader />;

    return (
        <div className="max-w-3xl mx-auto px-6 py-12 animate-slideUp">

            <div className="text-center mb-10">
                <span className="text-5xl">✏️</span>
                <h1 className="text-3xl font-extrabold text-gray-900 mt-3">Edit Pet</h1>
                <p className="text-gray-500 mt-1 text-sm">Update your pet's information below.</p>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3 mb-6">
                    ⚠️ {error}
                </div>
            )}

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-6">

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">🐾 Pet Name *</label>
                        <input type="text" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" value={name} onChange={e => setName(e.target.value)} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">🐶 Species *</label>
                        <select className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-400" value={species} onChange={e => setSpecies(Number(e.target.value))}>
                            {speciesOptions.map(opt => (<option key={opt.value} value={opt.value}>{opt.label}</option>))}
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">🎂 Age (months) *</label>
                        <input type="number" min={0} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" value={ageInMonths} onChange={e => setAgeInMonths(Number(e.target.value))} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">⚧ Gender</label>
                        <select className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-400" value={gender} onChange={e => setGender(Number(e.target.value))}>
                            {genderOptions.map(opt => (<option key={opt.value} value={opt.value}>{opt.label}</option>))}
                        </select>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <input type="checkbox" id="vaccinated" className="w-5 h-5 text-orange-500 border-gray-300 rounded" checked={isVaccinated} onChange={e => setIsVaccinated(e.target.checked)} />
                    <label htmlFor="vaccinated" className="text-sm font-medium text-gray-700">💉 Pet is vaccinated</label>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">📝 Description</label>
                    <textarea className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none" rows={3} value={description} onChange={e => setDescription(e.target.value)} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">🏙️ City *</label>
                        <input type="text" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" value={city} onChange={e => setCity(e.target.value)} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">🗺️ State *</label>
                        <input type="text" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" value={state} onChange={e => setState(e.target.value)} />
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">📍 Latitude</label>
                        <input type="number" step="any" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" value={latitude || ""} onChange={e => setLatitude(Number(e.target.value))} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">📍 Longitude</label>
                        <input type="number" step="any" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" value={longitude || ""} onChange={e => setLongitude(Number(e.target.value))} />
                    </div>
                </div>

                <button
                    onClick={handleSubmit}
                    disabled={saving}
                    className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-all hover:scale-[1.02] shadow-md mt-4"
                >
                    {saving ? "Saving... 🐾" : "✅ Save Changes"}
                </button>
            </div>
        </div>
    );
}