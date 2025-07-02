import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";        // ⬅️ spinner icon
import { useAuth } from "./AuthContext";

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        // Centered full‑screen spinner
        return (
            <div className="flex h-screen w-screen items-center justify-center bg-slate-900">
                <Loader2 size={42} className="animate-spin text-blue-600" />
            </div>
        );
    }

    return isAuthenticated
        ? children
        : <Navigate to="/" state={{ from: location }} replace />;
};

export default ProtectedRoute;
