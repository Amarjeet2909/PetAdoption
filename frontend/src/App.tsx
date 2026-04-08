import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./components/layout/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import PetsPage from "./pages/PetsPage";
import PetDetailPage from "./pages/PetDetailPage";

function App() {
    return (
        <BrowserRouter>
            <Layout>
                <Routes>

                    {/* Public Routes */}
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />

                    {/* Protected Routes */}
                    <Route
                        path="/pets"
                        element={<ProtectedRoute><PetsPage /></ProtectedRoute>}
                    />
                    <Route
                        path="/pets/:id"
                        element={<ProtectedRoute><PetDetailPage /></ProtectedRoute>}
                    />

                </Routes>
            </Layout>
        </BrowserRouter>
    );
}

export default App