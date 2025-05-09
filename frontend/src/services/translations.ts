import { Translation } from "../pages/Dictionary";

const BACKEND_URL = "http://localhost:10000";

export async function getTranslations() {
    const response = await fetch(`${BACKEND_URL}/api/translations`);
    const data = await response.json();
    return data;
}

export async function updateTranslation(translation: Translation) {
    const response = await fetch(`${BACKEND_URL}/api/translations/${translation.id}`, {
        method: "PUT",
        body: JSON.stringify(translation),
    });

    return response.json();
}

export async function createTranslation(translation: Translation) {
    const response = await fetch(`${BACKEND_URL}/api/translations`, {
        method: "POST",
        body: JSON.stringify({ tagalog: translation.tagalog, english: translation.english }),
    });
    return response.json(); 
}

export async function deleteTranslation(id: number) {
    const response = await fetch(`${BACKEND_URL}/api/translations/${id}`, {
        method: "DELETE",
    });
    return response.json();
}