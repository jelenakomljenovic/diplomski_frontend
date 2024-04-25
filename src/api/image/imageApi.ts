import axiosService from "../../axios/axiosService";
import {backendUrl} from "../../constants/urlConstants";
import {SendImage} from "./imageType";

export async function getAllImagesByUniversityId(id: number) {
    const response = await axiosService(true).get(`${backendUrl.IMAGES_URL}/${id}`);
    return response;
}

export async function saveImage(id: number, pictureBase64: SendImage) {
    const response = await axiosService(true).post(`${backendUrl.IMAGES_SAVE_URL}/${id}`, pictureBase64);
    return response;
}

export async function deleteImage(id: number) {
    const response = await axiosService(true).delete(`${backendUrl.IMAGES_URL}/${id}/delete`);
    return response;
}