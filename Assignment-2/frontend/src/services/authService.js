import axiosClient from "../api/axiosClient";

const authService = {

    login: async (data) => {
        const response = await axiosClient.post(
            "/auth/login",
            data
        );

        return response.data;
    },

    logout: async () => {
        const response = await axiosClient.post(
            "/auth/logout"
        );

        return response.data;
    }

};

export default authService;