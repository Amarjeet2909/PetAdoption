import apiClient from "./apiClient";
import type { UserProfile } from "../types/petTypes";

export const getProfile = async (): Promise<UserProfile> => {
    const response = await apiClient.get<UserProfile>("/users/profile");
    return response.data;
};

export const updateName = async (name: string): Promise<void> => {
    await apiClient.put("/users/profile/name", { name });
};

export const changePassword = async (oldPassword: string, newPassword: string): Promise<void> => {
    await apiClient.put("/users/profile/password", { oldPassword, newPassword });
};

export const deleteAccount = async (): Promise<void> => {
    await apiClient.delete("/users/profile");
};