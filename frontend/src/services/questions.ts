import { httpFetch } from "./helper";

export async function getQuestions() {
    return httpFetch("questions", "GET");
}
