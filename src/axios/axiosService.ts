import axios from "axios";

function axiosService(useAuth = false) {
    const axiosInstance = axios.create({
        baseURL: "http://localhost:8080/api",
        headers: {
            "Content-Type": "application/json",
        }
    });

    return axiosInstance;
}

export default axiosService;