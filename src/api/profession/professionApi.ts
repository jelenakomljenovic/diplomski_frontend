import {backendUrl} from "../../constants/urlConstants";
import axiosService from "../../axios/axiosService";

export async function getAllProfessions() {
    const response = await axiosService(true).get(`${backendUrl.PROFESSION_URL}`);
    return response;
}