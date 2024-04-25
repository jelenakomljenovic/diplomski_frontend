import {Runtime} from "inspector";

export type UserType = {
    id: number,
    firstName: string,
    lastName: string,
    username: string,
    email: string
}

export type UpdateUserType = {
    id?: number,
    firstName?: string,
    lastName?: string,
    username?: string,
    email?: string
}

export type ChangePasswordType = {
    currentPassword: string,
    newPassword: string,
    confirmationPassword: string
}

export type SavePasswordType = {
    password: string,
    token: string | null
}

export type ResetPasswordType = {
    email: string
}

export type NewUserType = {
    firstName?: string,
    lastName?: string,
    username?: string,
    email?: string,
    password: string,

}