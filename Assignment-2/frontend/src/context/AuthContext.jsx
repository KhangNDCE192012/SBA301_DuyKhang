/**
 * Nguyễn Duy Khang - CE192012 - Assignment 2
 * Context quản lý trạng thái xác thực (authentication) của toàn ứng dụng.
 * Cung cấp các hàm login, logout, updateUser và state user, loading
 * cho tất cả các component con thông qua React Context API.
 */

import {
    createContext,
    useContext,
    useState
} from "react";

import authService from "../services/authService";

// Tạo Context xác thực, giá trị mặc định là null
const AuthContext = createContext(null);

/**
 * AuthProvider: bọc toàn bộ ứng dụng để chia sẻ trạng thái đăng nhập.
 * Được sử dụng trong main.jsx bọc bên ngoài <App />.
 */
export function AuthProvider({ children }) {

    // Khởi tạo state user từ localStorage (giữ đăng nhập khi refresh trang)
    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem("user");
        return saved ? JSON.parse(saved) : null;
    });

    // State loading dùng để hiển thị trạng thái "đang đăng nhập..."
    const [loading, setLoading] = useState(false);

    /**
     * Hàm LOGIN : gọi authService.login() → nhận token và account từ server.
     * Lưu token và user vào localStorage, cập nhật state user.
     * Được gọi từ Login.jsx khi người dùng submit form → handleSubmit → login().
     */
    const login = async (email, password) => {

        setLoading(true);

        try {
            // Gọi API đăng nhập, nhận về { token, account }
            const result = await authService.login({
                email,
                password
            });

            // Lưu token JWT vào localStorage để axiosClient tự đính kèm sau này
            localStorage.setItem("token", result.token);
            localStorage.setItem(
                "user",
                JSON.stringify(result.account)
            );

            // Cập nhật state user để toàn ứng dụng biết người dùng đã đăng nhập
            setUser(result.account);

            return result.account;

        } finally {
            setLoading(false);
        }
    };

    /**
     * Hàm LOGOUT: gọi authService.logout() để invalidate token phía server,
     * sau đó xóa token và user khỏi localStorage, reset state user về null.
     * Được gọi từ Header.jsx khi người dùng nhấn nút Logout → handleLogout → logout().
     */
    const logout = async () => {

        try {
            // Thông báo server hủy token (có thể thất bại nếu token đã hết hạn)
            await authService.logout();
        } catch (error) {
            console.error(error);
        }

        // Luôn xóa dữ liệu cục bộ dù server có lỗi hay không
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setUser(null);
    };

    /**
     * Hàm UPDATE thông tin user trong context và localStorage.
     * Được gọi từ MyProfile.jsx sau khi cập nhật hồ sơ thành công.
     */
    const updateUser = (account) => {

        localStorage.setItem(
            "user",
            JSON.stringify(account)
        );

        setUser(account);
    };

    return (
        // Cung cấp các giá trị: user, loading, login, logout, updateUser cho toàn ứng dụng
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

/**
 * Hook tiện ích để các component con truy cập AuthContext dễ dàng.
 * Sử dụng: const { user, login, logout } = useAuth();
 */
export function useAuth() {
    return useContext(AuthContext);
}
