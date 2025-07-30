import type { Translation } from "../pages/Dictionary";
import { httpFetch } from "./helper";

const captialise = (word: string) => {
    if (word.length <= 1) {
        return word.toUpperCase();
    }

    return word.slice(0, 1).toUpperCase() + word.slice(1).toLowerCase();
}

export async function getTranslations() {
    const response = await httpFetch("translations", "GET") as Translation[];
    return response.map(translation => ({...translation, english: captialise(translation.english), tagalog: captialise(translation.tagalog)}))
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