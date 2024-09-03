import axiosService from "../../axios/axiosService";
import {backendUrl} from "../../constants/urlConstants";
import {JobProfileRequest, JobProfileSkillsRequest} from "./jobprofile";

export async function getResponsibilitiesByFaculties(jobInfo: JobProfileRequest) {
    const response = await axiosService(true).post(`${backendUrl.JOB_PROFILE_URL}`, jobInfo);
    return response;
}

export async function getSkillsByFaculties(jobInfo: JobProfileSkillsRequest) {
    const response = await axiosService(true).post(`${backendUrl.JOB_PROFILE_SKILLS_URL}`, jobInfo);
    return response;
}

export async function predict(text: string) {
    const response = await axiosService(true).post(`${backendUrl.JOB_PROFILE_PREDICT_URL}`, text);
    return response;
}

export async function getRecommendations(text: string) {

    const response = await axiosService(true).post(`${backendUrl.JOB_PROFILE_RECOMMENDATIONS}`, {faculty: text}, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return response;

}