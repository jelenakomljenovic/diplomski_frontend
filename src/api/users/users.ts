import axiosService from "../../axios/axiosService";
import {backendUrl} from "../../constants/urlConstants";
import {
    ChangePasswordType,
    NewUserType,
    ResetPasswordType,
    SavePasswordType,
    UpdateUserType,
    UserType
} from "./userType";
import {DepartmentType} from "../faculty/department";

export async function getAllUsers() {
    const response = await axiosService(true).get(backendUrl.USERS_URL);
    return response;
}

export async function deleteUser(id: number) {
    const response = await axiosService(true).delete(`${backendUrl.USERS_URL}/${id}`);
    return response;
}

export async function findUserById(userId: number) {
    const response = await axiosService(true).get(backendUrl.USERS_URL + `/${userId}`);
    return response;
}

export async function changePassword(passwordInfo: ChangePasswordType | undefined, userId: number) {
    const response = await axiosService(true).patch(   `${backendUrl.USERS_URL}/${userId}`, passwordInfo);
    return response;
}

export async function savePassword(passwordInfo: SavePasswordType | undefined) {
    const response = await axiosService(true).post(   `${backendUrl.SAVE_PASSWORD_URL}`, passwordInfo);
    return response;
}


export async function resetPassword(email: ResetPasswordType) {
    const response = await axiosService(true).post(   `${backendUrl.RESET_PASSWORD}`, email);
    return response;
}

export async function insertUser(user: NewUserType) {
    const response = await axiosService(true).post(`${backendUrl.USER_INSERT}`, user);
    return response;
}

export async function updateUser(user: UpdateUserType | undefined, userId: number) {
    const response = await axiosService(true).put(`${backendUrl.USER_UPDATE}/${userId}`, user);
    return response;
}