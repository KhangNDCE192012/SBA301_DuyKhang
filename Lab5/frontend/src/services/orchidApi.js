
import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

export const getOrchids = () => api.get("");

export const getOrchid = (id) =>
    api.get(`/${id}`);

export const createOrchid = (data) =>
    api.post("", data);

export const updateOrchid = (id, data) =>
    api.put(`/${id}`, data);

export const deleteOrchid = (id) =>
    api.delete(`/${id}`);
