import {
    Routes,
    Route,
    Navigate
} from "react-router-dom";

import { useAuth } from "./context/AuthContext";

import Header from "./components/Header";
import ProtectedRoute from "./components/ProtectedRoute";

import PublicNews from "./pages/PublicNews";
import Login from "./pages/Login";
import AccountManagement from "./pages/AccountManagement";
import CategoryManagement from "./pages/CategoryManagement";
import NewsManagement from "./pages/NewsManagement";
import MyNewsHistory from "./pages/MyNewsHistory";
import MyProfile from "./pages/MyProfile";

export default function App() {

    const { user } = useAuth();

    return (

        <>
            <Header />

            <Routes>

                <Route
                    path="/"
                    element={<PublicNews />}
                />

                <Route
                    path="/login"
                    element={
                        user
                            ? <Navigate to="/" />
                            : <Login />
                    }
                />

                <Route
                    path="/admin/accounts"
                    element={
                        <ProtectedRoute allowedRoles={[1]}>
                            <AccountManagement />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/staff/categories"
                    element={
                        <ProtectedRoute allowedRoles={[2]}>
                            <CategoryManagement />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/staff/news"
                    element={
                        <ProtectedRoute allowedRoles={[2]}>
                            <NewsManagement />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/staff/history"
                    element={
                        <ProtectedRoute allowedRoles={[2]}>
                            <MyNewsHistory />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/staff/profile"
                    element={
                        <ProtectedRoute allowedRoles={[2]}>
                            <MyProfile />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="*"
                    element={<Navigate to="/" />}
                />

            </Routes>

        </>
    );
}