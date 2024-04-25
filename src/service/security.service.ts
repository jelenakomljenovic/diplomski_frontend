import {TOKEN_HEADER, TOKEN_STORAGE} from '../constants/constants';
import {backendUrl, paths} from '../constants/urlConstants';
import axiosService from '../axios/axiosService';
import {LoginData} from '../login/LoginDialog';
import {removeTokenFromStorage} from "../token/token";
import {NavigateFunction} from "react-router-dom";


const axiosInstance = axiosService(false);

export const loginRequest = async (loginData: LoginData) =>
    axiosInstance.post(backendUrl.AUTHENTICATE, loginData)
        .then(res => {
            let token = res.headers[TOKEN_HEADER];
            token = token.replace('Bearer', '').trim();
            if (token) {
                sessionStorage.setItem(TOKEN_STORAGE, token);
            }
            return token;
        });

export const logoutHandler = async (navigate: NavigateFunction, toggleAdmin: (isAdmin: boolean) => void) => {
    removeTokenFromStorage();
    navigate(paths.HOME);
    localStorage.removeItem('isAdmin');
    toggleAdmin(false);
};
