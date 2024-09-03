import {backendUrl} from "../../constants/urlConstants";
import axiosService from "../../axios/axiosService";

export async function getAllFaculties() {
    const response = await axiosService(true).get(`${backendUrl.FACULTY_URL}`);
    return response;
}

export async function getAllCountries() {
    const response = await axiosService(true).get(`${backendUrl.COUNTRIES_URL}`);
    return response;
}

export async function getUniversityById(id: number) {
    const response = await axiosService(true).get(`${backendUrl.FACULTY_URL}/${id}`);
    return response;
}

export async function getAllCities(countriesList: Array<String>) {
    const response = await axiosService(true).post(`${backendUrl.CITIES_URL}`, countriesList);
    return response;
}

export async function deleteUniversity(id: number) {
    const response = await axiosService(true).delete(`${backendUrl.FACULTY_URL}/${id}`);
    return response;
}

export async function getAllFacultiesByKeyword(keywords: string[]) {
    const response = await axiosService(true).post(`${backendUrl.FACULTY_KEYWORD_URL}`, keywords);
    return response;
}

export async function getAllByCity(universities: string[], city: string) {
    const response = await axiosService(true).post(`${backendUrl.FACULTY_FIND_BY_CITY}/${city}`, universities);
    return response;
}