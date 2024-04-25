import jwt_decode from 'jwt-decode';
import {Roles, TOKEN_ID, TOKEN_STORAGE} from "../constants/constants";

export function getIdFromToken(): number {
    const token = getTokenFromStorage();
    if (token) {
        const decoded: any = jwt_decode(token);
        return decoded[TOKEN_ID];
    }
    return -1;
}

export function hasRole(role: Roles): boolean {
    const token = getTokenFromStorage();
    if (token) {
        const decoded: any = jwt_decode(token);
        if (decoded.roles.find((tokenRole: any) => tokenRole === role))
            return true;
    }
    return false;
}

export function getTokenFromStorage(): string | null {
    return sessionStorage.getItem(TOKEN_STORAGE);
}

export function removeTokenFromStorage() {
    sessionStorage.removeItem(TOKEN_STORAGE);
}