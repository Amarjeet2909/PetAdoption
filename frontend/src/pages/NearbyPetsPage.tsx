import { useState } from "react";
import { Link } from "react-router-dom";
import { getNearbyPets } from "../api/petsApi";
import type { Pet } from "../types/petTypes";
import Loader from "../components/ui/Loader";
import ImageCarousel from "../components/ui/ImageCarousel";

export default function NearbyPetsPage() {

    const [lat, setLat] = useState<number | null>(null);
    const [lon, setLon] = useState<number | null>(null);
    const [radius, setRadius] = useState(10);

    const [species, setSpecies] = useState("");
    const [gender, setGender] = useState("");
    const [vaccinated, setVaccinated] = useState("");
    const [sortBy, setSortBy] = useState("name");
    const [sortOrder, setSortOrder] = useState("asc");

    const [pets, setPets] = useState<Pet[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize] = useState(6);

    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);
    const [error, setError] = useState("");

    const totalPages = Math.ceil(totalCount / pageSize);

    const handleDetectLocation = () => {
        setError("");
        if (!navigator.geolocation) {
            setError("Geolocation is not supported by your browser.");
            return;
        }
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setLat(position.coords.latitude);
                setLon(position.coords.longitude);
            },
            () => setError("Unable to detect location. Please allow location access.")
        );
    };

    const handleSearch = async (page = 1) => {
        setError("");
        if (lat === null || lon === null) {
            setError("Please detect or enter your location first.");
            return;
        }

        setLoading(true);
        setPageNumber(page);

        try {
            const params: any = { lat, lon, radius, pageNumber: page, pageSize, sortBy, sortOrder };
            if (species) params.species = species;
            if (gender) params.gender = gender;
            if (vaccinated) params.isVaccinated = vaccinated;

            const data = await getNearbyPets(params);
            setPets(data.items);
            setTotalCount(data.totalCount);
            setSearched(true);
        } catch {
            setError("Failed to search nearby pets. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (page: number) => handleSearch(page);

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">

            {/* Header */}
            <div className="text-center mb-8 sm:mb-10">
                <span className="text-4xl sm:text-5xl">📍</span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-3">Find Pets Near You</h1>
                <p className="text-gray-500 mt-1 text-sm">Detect your location and discover adoptable pets in your area.</p>
            </div>

            {/* Filters Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 mb-8 sm:mb-10">

                {/* Row 1: Location */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-5">
                    <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Latitude</label>
                        <input type="number" step="any" className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" placeholder="Latitude" value={lat ?? ""} onChange={e => setLat(Number(e.target.value))} />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Longitude</label>
                        <input type="number" step="any" className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" placeholder="Longitude" value={lon ?? ""} onChange={e => setLon(Number(e.target.value))} />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Radius: {radius} km</label>
                        <input type="range" min={1} max={100} value={radius} onChange={e => setRadius(Number(e.target.value))} className="w-full mt-2 accent-orange-500" />
                    </div>
                    <div className="flex items-end">
                        <button onClick={handleDetectLocation} className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-xl px-4 py-2.5 transition-colors">📡 Detect Location</button>
                    </div>
                </div>

                {/* Row 2: Filters */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-4 sm:mb-5">
                    <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Species</label>
                        <select className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-400" value={species} onChange={e => setSpecies(e.target.value)}>
                            <option value="">All</option>
                            <option value="Dog">🐶 Dog</option>
                            <option value="Cat">🐱 Cat</option>
                            <option value="Rabbit">🐰 Rabbit</option>
                            <option value="Bird">🐦 Bird</option>
                            <option value="Fish">🐟 Fish</option>
                            <option value="Other">🐾 Other</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Gender</label>
                        <select className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-400" value={gender} onChange={e => setGender(e.target.value)}>
                            <option value="">All</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Vaccinated</label>
                        <select className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-400" value={vaccinated} onChange={e => setVaccinated(e.target.value)}>
                            <option value="">All</option>
                            <option value="true">Yes</option>
                            <option value="false">No</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Sort By</label>
                        <select className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-400" value={sortBy} onChange={e => setSortBy(e.target.value)}>
                            <option value="name">Name</option>
                            <option value="age">Age</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Order</label>
                        <select className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-400" value={sortOrder} onChange={e => setSortOrder(e.target.value)}>
                            <option value="asc">Ascending</option>
                            <option value="desc">Descending</option>
                        </select>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3 mb-4">⚠️ {error}</div>
                )}

                <button onClick={() => handleSearch(1)} disabled={loading} className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-semibold px-8 py-3 rounded-xl transition-all hover:scale-[1.02] shadow-md">
                    {loading ? "Searching... 🐾" : "🔍 Search Nearby Pets"}
                </button>
            </div>

            {loading && <Loader />}

            {!loading && searched && (
                <>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-2">
                        <h2 className="text-xl font-bold text-gray-800">Results</h2>
                        <span className="text-sm text-gray-500">{totalCount} pet{totalCount !== 1 ? "s" : ""} found within {radius} km</span>
                    </div>

                    {pets.length === 0 && (
                        <div className="text-center py-16">
                            <span className="text-6xl">😿</span>
                            <p className="text-gray-500 mt-4 text-lg">No pets found in this area. Try increasing the radius.</p>
                        </div>
                    )}

                    {/* Cards — same style as PetsPage with ImageCarousel */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        {pets.map((pet) => (
                            <Link key={pet.id} to={`/pets/${pet.id}`} className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:scale-[1.01] transition-all block">
                                <ImageCarousel images={pet.photoUrls} altText={pet.name} height="h-48" rounded="rounded-t-2xl" />
                                <div className="p-4 sm:p-5">
                                    <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3">{pet.name}</h2>
                                    <div className="text-sm text-gray-500 space-y-1">
                                        <p>🐾 Species: <span className="text-gray-700">{pet.species}</span></p>
                                        <p>🎂 Age: <span className="text-gray-700">{pet.ageInMonths} months</span></p>
                                        <p>📍 Location: <span className="text-gray-700">{pet.city}, {pet.state}</span></p>
                                        <p>🏷️ Status: <span className="text-orange-500 font-medium">{pet.status}</span></p>
                                    </div>
                                    <div className="mt-4 text-xs text-orange-400 font-semibold">View Details →</div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {totalPages > 1 && (
                        <div className="flex flex-wrap items-center justify-center gap-2 mt-10 sm:mt-12">
                            <button onClick={() => handlePageChange(pageNumber - 1)} disabled={pageNumber === 1} className="px-3 sm:px-4 py-2 text-sm font-medium rounded-lg border border-gray-200 hover:bg-orange-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">← Prev</button>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                <button key={page} onClick={() => handlePageChange(page)} className={`w-9 h-9 sm:w-10 sm:h-10 text-sm font-semibold rounded-lg transition-all ${page === pageNumber ? "bg-orange-500 text-white shadow-md scale-105" : "border border-gray-200 text-gray-600 hover:bg-orange-50"}`}>{page}</button>
                            ))}
                            <button onClick={() => handlePageChange(pageNumber + 1)} disabled={pageNumber === totalPages} className="px-3 sm:px-4 py-2 text-sm font-medium rounded-lg border border-gray-200 hover:bg-orange-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">Next →</button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}