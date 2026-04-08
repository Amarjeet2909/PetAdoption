import apiClient from "./apiClient";
import type { Pet, PetDetail, PagedResponse } from "../types/petTypes";

export const getPets = async (pageNumber = 1, pageSize = 10): Promise<PagedResponse<Pet>> => {
    const response = await apiClient.get<PagedResponse<Pet>>("/pets", {
        params: { pageNumber, pageSize }
    });

    return response.data;
};

export const getPetById = async (id: string): Promise<PetDetail> => {
    const response = await apiClient.get<PetDetail>(`/pets/${id}`);

    return response.data;
}