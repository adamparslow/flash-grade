import type { Translation } from "../vocabList/DictionaryPage";
import { httpFetch } from "../general/http";

export interface Question {
    translations: Translation[];
    type: "SINGLE" | "MULTI" | "MATCH";
    englishFirst: boolean;
}

export interface Answer {
    translationId: string;
    correct: number;
    wrong: number;
    date: Date;
}

export interface Streak {
    streak: number;
    freeze: number;
}

export async function getQuestions() {
    return httpFetch("questions", "GET") as Promise<Question[]>;
}

export async function postAnswers(answers: Answer[]) {
    return httpFetch("answers", "POST", answers)
}

export async function getStreak() {
    return httpFetch("streak", "GET") as Promise<Streak>;
}
