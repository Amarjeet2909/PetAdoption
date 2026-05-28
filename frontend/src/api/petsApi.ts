import apiClient from "./apiClient";
import type { Pet, PetDetail, CreatePetRequest, UpdatePetRequest, NearbyPetsParams, PagedResponse } from "../types/petTypes";

export const getPets = async (pageNumber = 1, pageSize = 10, search?: string): Promise<PagedResponse<Pet>> => {
    const response = await apiClient.get<PagedResponse<Pet>>("/pets", {
        params: { pageNumber, pageSize, search: search || undefined }
    });
    return response.data;
};

export const getPetById = async (id: string): Promise<PetDetail> => {
    const response = await apiClient.get<PetDetail>(`/pets/${id}`);
    return response.data;
};

export const createPet = async (data: CreatePetRequest): Promise<{ petId: string }> => {
    const response = await apiClient.post<{ petId: string }>("/pets", data);
    return response.data;
};

export const updatePet = async (id: string, data: UpdatePetRequest): Promise<void> => {
    await apiClient.put(`/pets/${id}`, data);
};

export const deletePet = async (id: string): Promise<void> => {
    await apiClient.delete(`/pets/${id}`);
};

export const adoptPet = async (id: string): Promise<void> => {
    await apiClient.post(`/pets/${id}/adopt`, {});
};

export const getMyPets = async (pageNumber = 1, pageSize = 10): Promise<PagedResponse<Pet>> => {
    const response = await apiClient.get<PagedResponse<Pet>>("/pets/mine", {
        params: { pageNumber, pageSize }
    });
    return response.data;
};

export const getAdoptedPets = async (pageNumber = 1, pageSize = 10): Promise<PagedResponse<Pet>> => {
    const response = await apiClient.get<PagedResponse<Pet>>("/pets/adopted", {
        params: { pageNumber, pageSize }
    });
    return response.data;
};

export const getNearbyPets = async (params: NearbyPetsParams): Promise<PagedResponse<Pet>> => {
    const response = await apiClient.get<PagedResponse<Pet>>("/pets/nearby", { params });
    return response.data;
};

export const uploadPetPhotos = async (petId: string, files: File[]): Promise<{ photoUrls: string[] }> => {
    const formData = new FormData();
    files.forEach(file => formData.append("files", file));

    const response = await apiClient.post<{ photoUrls: string[] }>(`/pets/${petId}/photos`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
    });
    return response.data;
};