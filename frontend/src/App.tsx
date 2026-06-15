import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./components/layout/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import GuestRoute from "./components/GuestRoute";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import PetsPage from "./pages/PetsPage";
import PetDetailPage from "./pages/PetDetailPage";
import CreatePetPage from "./pages/CreatePetPage";
import EditPetPage from "./pages/EditPetPage";
import NearbyPetsPage from "./pages/NearbyPetsPage";
import MyPetsPage from "./pages/MyPetsPage";
import ProfilePage from "./pages/ProfilePage";
import DeleteAccountPage from "./pages/DeleteAccountPage";
import VerifyEmailPage from "./pages/VerifyEmailPage";
import AdoptionRequestsPage from "./pages/AdoptionRequestsPage";

import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import AdminUsersPage from "./pages/admin/AdminUsersPage";
import AdminPetsPage from "./pages/admin/AdminPetsPage";

function App() {
    return (
        <BrowserRouter>
            <Layout>
                <Routes>
                    {/* Public */}
                    <Route path="/" element={<HomePage />} />

                    {/* Guest Only */}
                    <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
                    <Route path="/register" element={<GuestRoute><RegisterPage /></GuestRoute>} />
                    <Route path="/verify-email" element={<GuestRoute><VerifyEmailPage /></GuestRoute>} />

                    {/* Protected */}
                    <Route path="/pets" element={<ProtectedRoute><PetsPage /></ProtectedRoute>} />
                    <Route path="/pets/nearby" element={<ProtectedRoute><NearbyPetsPage /></ProtectedRoute>} />
                    <Route path="/pets/create" element={<ProtectedRoute><CreatePetPage /></ProtectedRoute>} />
                    <Route path="/pets/:id/edit" element={<ProtectedRoute><EditPetPage /></ProtectedRoute>} />
                    <Route path="/pets/:id" element={<ProtectedRoute><PetDetailPage /></ProtectedRoute>} />
                    <Route path="/my-pets" element={<ProtectedRoute><MyPetsPage /></ProtectedRoute>} />
                    <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
                    <Route path="/profile/delete" element={<ProtectedRoute><DeleteAccountPage /></ProtectedRoute>} />
                    <Route path="/adoption-requests" element={<ProtectedRoute><AdoptionRequestsPage /></ProtectedRoute>} />

                    {/* Admin */}
                    <Route path="/admin" element={<AdminRoute><AdminDashboardPage /></AdminRoute>} />
                    <Route path="/admin/users" element={<AdminRoute><AdminUsersPage /></AdminRoute>} />
                    <Route path="/admin/pets" element={<AdminRoute><AdminPetsPage /></AdminRoute>} />
                </Routes>
            </Layout>
        </BrowserRouter>
    );
}

export default App;