import { Button, Stack, TextareaAutosize, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { getTranslations } from "../vocabList/translationsApi";
import type { Translation } from "../vocabList/DictionaryPage";
import { useLocalStorage } from "usehooks-ts";

const DEFAULT_PROMPT = `I am learning Tagalog. I have a list of words which I will provide under this. I want you to take my words and construct sentences from them. I want you to give me the Tagalog sentences first, five of them, then I will give my answers. I want you to then mark my answers and correct them where needed. Please don't use any words I haven't provided. 

After I answer, also provide a breakdown to explain the grammatical structure of each sentence.
When you grade my work, if I am not exactly correct please mark it as incorrect and let me know.

These are the words I want you to use:`;

const PROMPT_KEY = "sentencesPrompt";

export function SentencesPage() {
  const [translations, setTranslations] = useState<Translation[]>([]);
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useLocalStorage(PROMPT_KEY, DEFAULT_PROMPT);

  useEffect(() => {
    setLoading(true);
    getTranslations().then((data) => {
      setTranslations(data);
      setLoading(false);
    });
  }, []);

  function openChatGPT() {
    const words = translations
      .map((translation) => translation.tagalog)
      .join(", ");

    navigator.clipboard.writeText(prompt + "\n" + words);

    // Try to open the ChatGPT app
    window.location.href = "chatgpt://";

    // Optional: fallback to the web app after a short delay
    setTimeout(() => {
      window.location.href = "https://chat.openai.com/";
    }, 1000);
  }

  return (
    <Stack gap={2} justifyContent="space-around" height="100%">
      <Typography variant="h1">Sentences</Typography>

      <Stack border="1px solid black" borderRadius={0}>
        <Typography variant="subtitle1">ChatGPT prompt</Typography>
        <TextareaAutosize
          minRows={3}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
      </Stack>

      <Button variant="contained" onClick={openChatGPT} disabled={loading}>
        Get full prompt
      </Button>
    </Stack>
  );
}
