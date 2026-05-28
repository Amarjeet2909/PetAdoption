import { Navigate } from "react-router-dom";
import { isAdmin } from "../utils/authUtils";

export default function AdminRoute({ children }: { children: React.ReactNode }) {
    const token = localStorage.getItem("token");

    if (!token) return <Navigate to="/login" />;
    if (!isAdmin()) return <Navigate to="/" />;

    return <>{children}</>;
}