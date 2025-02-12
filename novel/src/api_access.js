import axios from "axios";

const api = axios.create({
    baseURL: 'http://localhost:65535/api/'
});

export default api;
