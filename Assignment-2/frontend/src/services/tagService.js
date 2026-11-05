import axiosClient from "../api/axiosClient";

const tagService = {

    getAll: async () => {
        const response = await axiosClient.get("/tags");

        return response.data;
    }

};

export default tagService;