import {
    createContext,
    useContext,
    useState
} from "react";

import authService from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {

    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem("user");
        return saved ? JSON.parse(saved) : null;
    });

    const [loading, setLoading] = useState(false);

    const login = async (email, password) => {

        setLoading(true);

        try {
            const result = await authService.login({
                email,
                password
            });

            localStorage.setItem("token", result.token);
            localStorage.setItem(
                "user",
                JSON.stringify(result.account)
            );

            setUser(result.account);

            return result.account;

        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {

        try {
            await authService.logout();
        } catch (error) {
            console.error(error);
        }

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setUser(null);
    };

    const updateUser = (account) => {

        localStorage.setItem(
            "user",
            JSON.stringify(account)
        );

        setUser(account);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                login,
                logout,
                updateUser
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}