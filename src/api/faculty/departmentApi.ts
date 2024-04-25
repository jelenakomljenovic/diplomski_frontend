import axiosService from "../../axios/axiosService";
import {backendUrl} from "../../constants/urlConstants";
import {DepartmentType} from "./department";


export async function insertDepartment(department: DepartmentType) {
    const response = await axiosService(true).post(`${backendUrl.DEPARTMENT_INSERT}`, department);
    return response;
}

export async function deleteDepartment(id: number) {
    const response = await axiosService(true).delete(`${backendUrl.DEPARTMENT}/${id}`);
    return response;
}

export async function getAllDepartments(universityId: number) {
    const response = await axiosService(true).get(`${backendUrl.DEPARTMENT}/${universityId}`);
    return response;
}
export async function updateDepartment(id: number | undefined, department: DepartmentType) {
    const response = await axiosService(true).put(`${backendUrl.DEPARTMENT}/update/${id}`, department);
    return response;
}
