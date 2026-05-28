import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPet, uploadPetPhotos } from "../api/petsApi";

const speciesOptions = [
    { value: 0, label: "🐶 Dog" },
    { value: 1, label: "🐱 Cat" },
    { value: 2, label: "🐰 Rabbit" },
    { value: 3, label: "🐦 Bird" },
    { value: 4, label: "🐟 Fish" },
    { value: 5, label: "🐾 Other" },
];

const genderOptions = [
    { value: 0, label: "Unknown" },
    { value: 1, label: "Male" },
    { value: 2, label: "Female" },
];

export default function CreatePetPage() {

    const navigate = useNavigate();

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

    const [photos, setPhotos] = useState<File[]>([]);
    const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handlePhotosChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);

        if (files.length + photos.length > 5) {
            setError("Maximum 5 images allowed.");
            return;
        }

        for (const file of files) {
            if (file.size > 5 * 1024 * 1024) {
                setError(`"${file.name}" exceeds 5MB limit.`);
                return;
            }
        }

        setError("");
        setPhotos(prev => [...prev, ...files]);
        setPhotoPreviews(prev => [...prev, ...files.map(f => URL.createObjectURL(f))]);
    };

    const removePhoto = (index: number) => {
        setPhotos(prev => prev.filter((_, i) => i !== index));
        setPhotoPreviews(prev => prev.filter((_, i) => i !== index));
    };

    const handleDetectLocation = () => {
        if (!navigator.geolocation) {
            setError("Geolocation is not supported by your browser.");
            return;
        }
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setLatitude(position.coords.latitude);
                setLongitude(position.coords.longitude);
            },
            () => setError("Unable to detect your location. Please enter manually.")
        );
    };

    const handleSubmit = async () => {
        setError("");

        if (photos.length === 0) {
            setError("At least one pet photo is required.");
            return;
        }

        if (!name.trim() || !city.trim() || !state.trim()) {
            setError("Name, City and State are required.");
            return;
        }

        if (ageInMonths < 0) {
            setError("Age cannot be negative.");
            return;
        }

        setLoading(true);

        try {
            const result = await createPet({
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

            // Upload all photos to Cloudinary
            await uploadPetPhotos(result.petId, photos);

            navigate(`/pets/${result.petId}`);
        } catch {
            setError("Failed to create pet. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto px-6 py-12 animate-slideUp">

            {/* Page Header */}
            <div className="text-center mb-10">
                <span className="text-5xl">🏡</span>
                <h1 className="text-3xl font-extrabold text-gray-900 mt-3">
                    List a Pet for Adoption
                </h1>
                <p className="text-gray-500 mt-1 text-sm">
                    Help your pet find a loving home by filling in the details below.
                </p>
            </div>

            {/* Error Banner */}
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3 mb-6">
                    ⚠️ {error}
                </div>
            )}

            {/* Form Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-6">

                {/* Photo Upload — MANDATORY */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        📷 Pet Photos *{" "}
                        <span className="text-gray-400 font-normal">(Min 1, Max 5)</span>
                    </label>

                    {/* Previews */}
                    {photoPreviews.length > 0 && (
                        <div className="flex flex-wrap gap-3 mb-3">
                            {photoPreviews.map((preview, i) => (
                                <div key={i} className="relative group">
                                    <img
                                        src={preview}
                                        alt={`Preview ${i + 1}`}
                                        className="w-20 h-20 rounded-xl object-cover border border-gray-200"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removePhoto(i)}
                                        className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {photos.length < 5 && (
                        <div>
                            <input
                                type="file"
                                accept=".jpg,.jpeg,.png,.webp"
                                multiple
                                onChange={handlePhotosChange}
                                className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-orange-50 file:text-orange-600 hover:file:bg-orange-100"
                            />
                            <p className="text-xs text-gray-400 mt-1">
                                Max 5MB each. JPG, PNG, or WebP. {photos.length}/5 selected.
                            </p>
                        </div>
                    )}
                </div>

                {/* Row 1: Name + Species */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            🐾 Pet Name *
                        </label>
                        <input
                            type="text"
                            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
                            placeholder="e.g. Buddy"
                            value={name}
                            onChange={e => setName(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            🐶 Species *
                        </label>
                        <select
                            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 transition bg-white"
                            value={species}
                            onChange={e => setSpecies(Number(e.target.value))}
                        >
                            {speciesOptions.map(opt => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Row 2: Age + Gender */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            🎂 Age (months) *
                        </label>
                        <input
                            type="number"
                            min={0}
                            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
                            placeholder="e.g. 12"
                            value={ageInMonths}
                            onChange={e => setAgeInMonths(Number(e.target.value))}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            ⚧ Gender
                        </label>
                        <select
                            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 transition bg-white"
                            value={gender}
                            onChange={e => setGender(Number(e.target.value))}
                        >
                            {genderOptions.map(opt => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Row 3: Vaccinated */}
                <div className="flex items-center gap-3">
                    <input
                        type="checkbox"
                        id="vaccinated"
                        className="w-5 h-5 text-orange-500 border-gray-300 rounded focus:ring-orange-400"
                        checked={isVaccinated}
                        onChange={e => setIsVaccinated(e.target.checked)}
                    />
                    <label htmlFor="vaccinated" className="text-sm font-medium text-gray-700">
                        💉 Pet is vaccinated
                    </label>
                </div>

                {/* Row 4: Description */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        📝 Description
                    </label>
                    <textarea
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 transition resize-none"
                        rows={3}
                        placeholder="Tell adopters about your pet's personality, habits, etc."
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                    />
                </div>

                {/* Row 5: Location — City + State */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            🏙️ City *
                        </label>
                        <input
                            type="text"
                            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
                            placeholder="e.g. Mumbai"
                            value={city}
                            onChange={e => setCity(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            🗺️ State *
                        </label>
                        <input
                            type="text"
                            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
                            placeholder="e.g. Maharashtra"
                            value={state}
                            onChange={e => setState(e.target.value)}
                        />
                    </div>
                </div>

                {/* Row 6: Coordinates + Auto-detect */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        📍 Coordinates
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <input
                            type="number"
                            step="any"
                            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
                            placeholder="Latitude"
                            value={latitude || ""}
                            onChange={e => setLatitude(Number(e.target.value))}
                        />
                        <input
                            type="number"
                            step="any"
                            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
                            placeholder="Longitude"
                            value={longitude || ""}
                            onChange={e => setLongitude(Number(e.target.value))}
                        />
                        <button
                            type="button"
                            onClick={handleDetectLocation}
                            className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-xl px-4 py-3 transition-colors"
                        >
                            📡 Detect
                        </button>
                    </div>
                </div>

                {/* Submit */}
                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-all hover:scale-[1.02] shadow-md mt-4"
                >
                    {loading ? "Uploading & Creating... 🐾" : "🐾 List Pet for Adoption"}
                </button>
            </div>
        </div>
    );
}