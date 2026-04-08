import apiClient from "./apiClient";
import type { LoginRequest, RegisterRequest, LoginResponse } from "../types/authTypes";

export const loginUser = async (data: LoginRequest) => {
    const response = await apiClient.post<LoginResponse>(
        "/auth/login",
        data
    );

    return response.data;
};

export const registerUser = async (data: RegisterRequest) => {
    const response = await apiClient.post<LoginResponse>(
        "/auth/register",
        data
    );

    return response.data;
};