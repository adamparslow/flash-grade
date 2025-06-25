import { httpFetch } from "./helper";

export async function searchEnglish(english: string) {
    const response = await httpFetch(`search?english=${english}`, "GET");
    return response;
}

export async function searchTagalog(tagalog: string) {
    const response = await httpFetch(`search?tagalog=${tagalog}`, "GET");
    return response;
}