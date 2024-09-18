import {CreateFacultyRequest} from "./faculty";
import {Majors} from "../../components/CreateDepartmentDialog";


export type DepartmentType = {
    id?: number,
    name: string | undefined,
    university: CreateFacultyRequest | undefined,
    majors: Majors[],
    website?: string
}

export type Department = {
    id: number,
    name: string,
    university: CreateFacultyRequest | undefined,
    majors: Majors[],
    website?: string
}