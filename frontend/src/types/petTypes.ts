export interface Pet {
    id: string;
    name: string;
    species: string;
    ageInMonths: number;
    gender: string;
    isVaccinated: boolean;
    city: string;
    state: string;
    status: string;
    description?: string;
    photoUrls: string[];
}

export interface PetDetail {
    id: string;
    name: string;
    species: string;
    ageInMonths: number;
    gender: string;
    isVaccinated: boolean;
    description: string;
    latitude: number;
    longitude: number;
    city: string;
    state: string;
    status: string;
    photoUrls: string[];
}

export interface CreatePetRequest {
    name: string;
    species: number;
    ageInMonths: number;
    gender: number;
    isVaccinated: boolean;
    description: string;
    latitude: number;
    longitude: number;
    city: string;
    state: string;
}

export interface UpdatePetRequest {
    name: string;
    species: number;
    ageInMonths: number;
    gender: number;
    isVaccinated: boolean;
    description: string;
    latitude: number;
    longitude: number;
    city: string;
    state: string;
}

export interface NearbyPetsParams {
    lat: number;
    lon: number;
    radius: number;
    pageNumber?: number;
    pageSize?: number;
    sortBy?: string;
    sortOrder?: string;
    species?: string;
    gender?: string;
    isVaccinated?: string;
}

export interface PagedResponse<T> {
    pageNumber: number;
    pageSize: number;
    totalCount: number;
    items: T[];
}

export interface UserProfile {
    userId: string;
    name: string;
    email: string;
}

export interface AdminDashboardStats {
    totalUsers: number;
    activeUsers: number;
    totalPets: number;
    adoptedPets: number;
    availablePets: number;
}

export interface AdminUser {
    id: string;
    email: string;
    isActive: boolean;
    role: string;
    createdAt: string;
}

export interface AdminPet {
    id: string;
    name: string;
    species: string;
    ageInMonths: number;
    city: string;
    state: string;
    status: string;
    isActive: boolean;
    ownerId: string;
    createdBy: string;
    createdAt: string;
}

export interface AdminAnalytics {
    adoptionTrend: { date: string; count: number }[];
    userGrowth: { date: string; count: number }[];
    speciesBreakdown: { name: string; count: number }[];
    topCities: { name: string; count: number }[];
    peakHours: { name: string; count: number }[];
}

export interface RecentActivity {
    action: string;
    description: string;
    timestamp: string;
}

export interface Announcement {
    id: string;
    message: string;
    type: string;
    createdAt: string;
}

export interface AdminUser {
    id: string;
    name: string;
    email: string;
    isActive: boolean;
    role: string;
    createdAt: string;
}