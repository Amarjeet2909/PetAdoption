export interface Pet {
    id: number;
    name: string;
    species: string;
    ageInMonths: number;
    gender: string;
    isVaccinated: boolean;
    city: string;
    state: string;
    status: string;
    description?: string;
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
}

export interface PagedResponse<T> {
    pageNumber: number;
    pageSize: number;
    totalCount: number;
    items: T[];
}