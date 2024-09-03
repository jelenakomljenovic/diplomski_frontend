import {JobProfileRequest} from "../jobprofile/jobprofile";
import axiosService from "../../axios/axiosService";
import {backendUrl} from "../../constants/urlConstants";
import {QuestionRequest} from "./questionData";

export async function getQuestions() {
    const response = await axiosService(true).get(`${backendUrl.QUESTIONS}`);
    return response;
}

export async function updateQuestions(questionId: number, question: QuestionRequest) {
    const response = await axiosService(true).put(`${backendUrl.QUESTIONS}/update/${questionId}`, question);
    return response;
}