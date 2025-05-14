import type { Translation } from "../pages/Dictionary";
import { httpFetch } from "./helper";

export interface Question {
    translations: Translation[];
    type: "SINGLE" | "MULTI" | "MATCH";
    englishFirst: boolean;
}

export async function getQuestions() {
    return httpFetch("questions", "GET");
}
