import { Box, Button, Stack, TextareaAutosize, Typography } from "@mui/material";
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

  useEffect(() => {
    setLoading(true);
    getTranslations().then((data) => {
      setTranslations(data);
      setLoading(false);
    });
  }, []);

  function kRandomWords(array: string[], k: number) {
    for (let i = array.length - 1; i > 0; i--) {
      // Generate a random index from 0 to i
      const j = Math.floor(Math.random() * (i + 1));

      // Swap elements at indices i and j
      const temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
    return array.slice(0, k);
  }

  function openChatGPT() {
    const wordsArr = translations.map((translation) => translation.tagalog);
    const randomWords = kRandomWords(wordsArr, 10);
    console.log("randomWords", { randomWords })
    const words = randomWords.join(", ");

    navigator.clipboard.writeText(DEFAULT_PROMPT + "\n" + words);

    // Try to open the ChatGPT app
    window.location.href = "chatgpt://";

    // Optional: fallback to the web app after a short delay
    setTimeout(() => {
      window.location.href = "https://chat.openai.com/";
    }, 1000);
  }

  return (
    <Stack gap={4} justifyContent="center" height="100%" padding={2} position="relative">
      <Typography variant="h3">Sentences</Typography>

      <Box border="1px solid black" borderRadius={5} padding={2}>
        <Typography>Click below to copy todays prompt and be redirected to ChatGPT</Typography>
      </Box>

      <Button variant="contained" onClick={openChatGPT} disabled={loading}>
        Let's go
      </Button>

      <Box height={150} />
    </Stack>
  );
}
