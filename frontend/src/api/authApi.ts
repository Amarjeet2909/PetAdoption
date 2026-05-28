import apiClient from "./apiClient";
import type { LoginRequest, RegisterRequest, LoginResponse, VerifyEmailRequest } from "../types/authTypes";

export const loginUser = async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>("/auth/login", data);
    return response.data;
};

export const registerUser = async (data: RegisterRequest): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>("/auth/register", data);
    return response.data;
};

export const verifyEmail = async (data: VerifyEmailRequest): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>("/auth/verify-email", data);
    return response.data;
};

export const resendVerification = async (email: string): Promise<void> => {
    await apiClient.post("/auth/resend-verification", { email });
};

export const googleLogin = async (credential: string): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>("/auth/google", { credential });
    return response.data;
};