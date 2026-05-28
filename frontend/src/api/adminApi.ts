import apiClient from "./apiClient";
import type { AdminDashboardStats, AdminUser, AdminPet, AdminAnalytics, RecentActivity, Announcement, PagedResponse } from "../types/petTypes";

export const getAdminDashboard = async (): Promise<AdminDashboardStats> => {
    const response = await apiClient.get<AdminDashboardStats>("/admin/dashboard");
    return response.data;
};

export const getAdminAnalytics = async (range = "month"): Promise<AdminAnalytics> => {
    const response = await apiClient.get<AdminAnalytics>("/admin/analytics", { params: { range } });
    return response.data;
};

export const getRecentActivity = async (count = 10): Promise<RecentActivity[]> => {
    const response = await apiClient.get<RecentActivity[]>("/admin/activity", { params: { count } });
    return response.data;
};

export const getAdminUsers = async (pageNumber = 1, pageSize = 10, search?: string): Promise<PagedResponse<AdminUser>> => {
    const response = await apiClient.get<PagedResponse<AdminUser>>("/admin/users", {
        params: { pageNumber, pageSize, search: search || undefined }
    });
    return response.data;
};

export const toggleUserStatus = async (id: string): Promise<void> => { await apiClient.put(`/admin/users/${id}/toggle-status`); };
export const changeUserRole = async (id: string, role: string): Promise<void> => { await apiClient.put(`/admin/users/${id}/role`, { role }); };

export const getAdminPets = async (pageNumber = 1, pageSize = 10, search?: string, status?: string): Promise<PagedResponse<AdminPet>> => {
    const response = await apiClient.get<PagedResponse<AdminPet>>("/admin/pets", {
        params: { pageNumber, pageSize, search: search || undefined, status: status || undefined }
    });
    return response.data;
};

export const adminDisablePet = async (id: string): Promise<void> => { await apiClient.put(`/admin/pets/${id}/disable`); };
export const adminEnablePet = async (id: string): Promise<void> => { await apiClient.put(`/admin/pets/${id}/enable`); };
export const adminDeletePet = async (id: string): Promise<void> => { await apiClient.delete(`/admin/pets/${id}`); };

export const createAnnouncement = async (message: string, type: string): Promise<void> => { await apiClient.post("/admin/announcements", { message, type }); };
export const getAnnouncements = async (): Promise<Announcement[]> => { const r = await apiClient.get<Announcement[]>("/admin/announcements"); return r.data; };
export const deleteAnnouncement = async (id: string): Promise<void> => { await apiClient.delete(`/admin/announcements/${id}`); };

export const exportUsersCSV = async (): Promise<void> => {
    const data = await getAdminUsers(1, 9999);
    const csv = "Name,Email,Role,Active,Joined\n" + data.items.map(u => `${u.name},${u.email},${u.role},${u.isActive},${new Date(u.createdAt).toLocaleDateString()}`).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "users.csv"; a.click();
};

export const exportPetsCSV = async (): Promise<void> => {
    const data = await getAdminPets(1, 9999);
    const csv = "Name,Species,City,State,Status,Active,CreatedBy,CreatedAt\n" + data.items.map(p => `${p.name},${p.species},${p.city},${p.state},${p.status},${p.isActive},${p.createdBy},${new Date(p.createdAt).toLocaleDateString()}`).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "pets.csv"; a.click();
};