import axios from "axios";

const api = axios.create({
    baseURL: "https://car-recommendation-api-mk56.onrender.com",
});

export default api;