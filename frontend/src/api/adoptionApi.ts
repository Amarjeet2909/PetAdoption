import apiClient from "./apiClient";
import type { AdoptionRequest, PagedResponse } from "../types/petTypes";

export const sendAdoptionRequest = async (
    petId: string,
    message: string
): Promise<{ requestId: string }> => {
    const response = await apiClient.post<{ requestId: string }>(
        `/adoption-requests/${petId}`,
        { message }
    );
    return response.data;
};

export const getIncomingRequests = async (
    pageNumber = 1,
    pageSize = 10,
    status?: string
): Promise<PagedResponse<AdoptionRequest>> => {
    const response = await apiClient.get<PagedResponse<AdoptionRequest>>(
        "/adoption-requests/incoming",
        { params: { pageNumber, pageSize, status: status || undefined } }
    );
    return response.data;
};

export const getMyRequests = async (
    pageNumber = 1,
    pageSize = 10,
    status?: string
): Promise<PagedResponse<AdoptionRequest>> => {
    const response = await apiClient.get<PagedResponse<AdoptionRequest>>(
        "/adoption-requests/mine",
        { params: { pageNumber, pageSize, status: status || undefined } }
    );
    return response.data;
};

export const approveRequest = async (id: string): Promise<void> => {
    await apiClient.put(`/adoption-requests/${id}/approve`);
};

export const rejectRequest = async (id: string): Promise<void> => {
    await apiClient.put(`/adoption-requests/${id}/reject`);
};

export const cancelRequest = async (id: string): Promise<void> => {
    await apiClient.delete(`/adoption-requests/${id}`);
};