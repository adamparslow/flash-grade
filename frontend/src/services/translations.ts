import type { Translation } from "../pages/Dictionary";
import { httpFetch } from "./helper";

export async function getTranslations() {
    return httpFetch("translations", "GET");
}

export async function updateTranslation(translation: Translation) {
    return httpFetch(`translations/${translation.id}`, "PUT", translation);
}

export async function createTranslation(translation: Translation) {
    return httpFetch("translations", "POST", { tagalog: translation.tagalog, english: translation.english });
}

export async function deleteTranslation(id: number) {
    return httpFetch(`translations/${id}`, "DELETE");
}