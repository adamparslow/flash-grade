import { useNavigate } from "react-router-dom";
import {
  createTranslation,
  getTranslations,
} from "../../services/translations";
import { useState } from "react";
import { searchTagalog } from "../../services/search";
import { searchEnglish } from "../../services/search";
import {
  Button,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import type { Translation } from "../Dictionary";

export function AddTranslation() {
  const theme = useTheme();

  const [loading, setLoading] = useState(false);
  const [addCardLoading, setAddCardLoading] = useState(false);
  const [results, setResults] = useState<{
    tagalog: string;
    english: string;
    isInDictionary: boolean;
  } | null>(null);

  const [language, setLanguage] = useState<"tagalog" | "english">("english");
  const [searchWord, setSearchWord] = useState("");
  const navigate = useNavigate();

  async function addCard() {
    setAddCardLoading(true);
    if (!results) {
      setAddCardLoading(false);
      return;
    }

    await createTranslation(results);
    navigate("/dictionary");
    setAddCardLoading(false);
  }

  async function isWordInDictionary(word: string) {
    const translations = await getTranslations();

    return translations.some((translation: Translation) => {
      return translation.tagalog === word || translation.english === word;
    });
  }

  async function search() {
    setLoading(true);

    if (searchWord === "") {
      setLoading(false);
      return;
    }

    if (language === "english") {
      const response = await searchEnglish(searchWord);
      console.log(response);
      setResults({
        tagalog: response.result,
        english: searchWord,
        isInDictionary: await isWordInDictionary(response.result),
      });
    } else if (language === "tagalog") {
      const response = await searchTagalog(searchWord);
      console.log(response);
      setResults({
        tagalog: searchWord,
        english: response.result,
        isInDictionary: await isWordInDictionary(response.result),
      });
    }

    setLoading(false);
  }

  return (
    <Stack padding={2} height="100%" gap={8}>
      <Stack gap={1} width="100%">
        <TextField
          placeholder="Search"
          name="search"
          value={searchWord}
          onChange={(e) => setSearchWord(e.target.value)}
        />

        <FormControl>
          <RadioGroup
            defaultValue="English"
            name="language"
            onChange={(e) => {
              setLanguage(e.target.value as "tagalog" | "english");
            }}
            value={language}
            row
            sx={{ justifyContent: "center" }}
          >
            <FormControlLabel
              value="english"
              control={<Radio />}
              label="English"
            />
            <FormControlLabel
              value="tagalog"
              control={<Radio />}
              label="Tagalog"
            />
          </RadioGroup>
        </FormControl>

        <Button onClick={search} variant="contained">
          {loading ? "Searching..." : "Search"}
        </Button>
      </Stack>

      {results && (
        <Stack
          gap={1.5}
          bgcolor={theme.palette.secondary.main}
          borderRadius={4}
          padding={2}
          alignItems="flex-start"
        >
          <Typography variant="h5">Results</Typography>
          <Typography>Tagalog: {results.tagalog}</Typography>
          <Typography>English: {results.english}</Typography>
          {results.isInDictionary ? (
            <Typography>This word is already in the dictionary</Typography>
          ) : (
            <Button
              onClick={addCard}
              color="success"
              variant="contained"
              fullWidth
            >
              {addCardLoading ? "Adding..." : "Add to vocab list?"}
            </Button>
          )}
        </Stack>
      )}
    </Stack>
  );
}
