import {CreateProfessionRequest} from "../profession/profession";
import {Logo, SendImage} from "../image/imageType";

export type CreateFacultyRequest = {
    id: number,
    classification: CreateProfessionRequest,
    name: string,
    address: string,
    city: string,
    postalCode: string,
    country: string,
    phoneNumber: string,
    website: string,
    email: string,
    coordinates: string,
    type: boolean,
    logo: string,
    secondaryName: string
}