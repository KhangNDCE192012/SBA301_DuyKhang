import axiosClient from "../api/axiosClient";

const newsService = {

    getAll: async (params = {}) => {
        const response = await axiosClient.get(
            "/news-articles",
            { params }
        );

        return response.data;
    },

    getById: async (id) => {
        const response = await axiosClient.get(
            `/news-articles/${id}`
        );

        return response.data;
    },

    create: async (data) => {
        const response = await axiosClient.post(
            "/news-articles",
            data
        );

        return response.data;
    },

    update: async (id, data) => {
        const response = await axiosClient.put(
            `/news-articles/${id}`,
            data
        );

        return response.data;
    },

    delete: async (id) => {
        const response = await axiosClient.delete(
            `/news-articles/${id}`
        );

        return response.data;
    },

    getMyHistory: async () => {
        const response = await axiosClient.get(
            "/news-articles/my-history"
        );

        return response.data;
    }

};

export default newsService;