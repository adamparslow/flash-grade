import type { Translation } from "../vocabList/DictionaryPage";
import { httpFetch } from "../general/http";

export interface Question {
    translations: Translation[];
    type: "SINGLE" | "MULTI" | "MATCH";
    englishFirst: boolean;
}

export async function getQuestions() {
    return httpFetch("questions", "GET") as Promise<Question[]>;
}
