import axiosClient from "../api/axiosClient";

const categoryService = {

    getAll: async (search = "") => {
        const response = await axiosClient.get(
            "/categories",
            { params: { search } }
        );

        return response.data;
    },

    create: async (data) => {
        const response = await axiosClient.post(
            "/categories",
            data
        );

        return response.data;
    },

    update: async (id, data) => {
        const response = await axiosClient.put(
            `/categories/${id}`,
            data
        );

        return response.data;
    },

    delete: async (id) => {
        const response = await axiosClient.delete(
            `/categories/${id}`
        );

        return response.data;
    }

};

export default categoryService;