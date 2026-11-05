import axiosClient from "../api/axiosClient";

const accountService = {

    getAll: async (search = "") => {
        const response = await axiosClient.get(
            "/accounts",
            { params: { search } }
        );

        return response.data;
    },

    getById: async (id) => {
        const response = await axiosClient.get(
            `/accounts/${id}`
        );

        return response.data;
    },

    create: async (data) => {
        const response = await axiosClient.post(
            "/accounts",
            data
        );

        return response.data;
    },

    update: async (id, data) => {
        const response = await axiosClient.put(
            `/accounts/${id}`,
            data
        );

        return response.data;
    },

    delete: async (id) => {
        const response = await axiosClient.delete(
            `/accounts/${id}`
        );

        return response.data;
    },

    updateProfile: async (data) => {
        const response = await axiosClient.put(
            "/accounts/profile",
            data
        );

        return response.data;
    }

};

export default accountService;