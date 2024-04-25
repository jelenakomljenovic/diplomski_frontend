import axios from "axios";
import axiosService from "../../axios/axiosService";
import {backendUrl} from "../../constants/urlConstants";


export async function validateToken(token: string | null) {
    const response = await axiosService(true).get(`${backendUrl.USERS_URL}/validate-request?token=${token}`);
    return response;
}
