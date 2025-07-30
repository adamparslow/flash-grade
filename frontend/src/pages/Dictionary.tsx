import { Link } from "react-router-dom";
import { getTranslations } from "../services/translations";
import { useEffect, useMemo, useState } from "react";
import {
  Box,
  FormControlLabel,
  FormControl,
  RadioGroup,
  Stack,
  Typography,
  useTheme,
  Radio,
  IconButton,
  TextField,
  Button,
} from "@mui/material";
import { Add } from "@mui/icons-material";

export type Translation = {
  id?: number;
  tagalog: string;
  english: string;
};

export function Dictionary() {
  const theme = useTheme();

  const [translations, setTranslations] = useState<Translation[]>([]);
  const [language, setLanguage] = useState<"tagalog" | "english">("tagalog");
  const [loading, setLoading] = useState(false);
  const [searchWord, setSearchWord] = useState<string>("");

  useEffect(() => {
    setLoading(true);
    getTranslations().then((data) => {
      setTranslations(data);
      setLoading(false);
    });
  }, []);

  const visibleTranslations = useMemo(() => {
    return translations
      .filter(
        (translation) =>
          searchWord === "" ||
          translation.english.includes(searchWord) ||
          translation.tagalog.includes(searchWord)
      )
      .sort((a, b) => a[language].localeCompare(b[language]));
  }, [translations, language, searchWord]);

  return (
    <Stack padding={4} gap={8}>
      <IconButton
        component={Link}
        to="/search"
        sx={{
          backgroundColor: theme.palette.primary.main,
          position: "fixed",
          bottom: "40px",
          right: "40px",
        }}
        size="large"
      >
        <Add fontSize="large" />
      </IconButton>

      <Stack gap={3}>
        <TextField
          placeholder="Search"
          size="small"
          value={searchWord}
          onChange={(e) => setSearchWord(e.target.value)}
        />

        <Stack>
          <Typography variant="h5">{visibleTranslations.length}</Typography>
          <Typography>Translations</Typography>
        </Stack>

        <Stack direction="row" justifyContent="center" gap={1}>
          <TabButton
            onClick={() => setLanguage("tagalog")}
            enabled={language === "tagalog"}
          >
            Tagalog
          </TabButton>
          <TabButton
            onClick={() => setLanguage("english")}
            enabled={language === "english"}
          >
            English
          </TabButton>
        </Stack>
      </Stack>

      <Stack alignItems="flex-start" gap={4}>
        {visibleTranslations.map((card) => {
          return (
            <Stack alignItems="flex-start" width="100%">
              <Typography variant="h6" fontWeight={600}>
                {language === "tagalog" ? card.tagalog : card.english}
              </Typography>
              <Typography>
                {language === "tagalog" ? card.english : card.tagalog}
              </Typography>

              <Box
                border="solid 1px"
                borderColor={theme.palette.grey[200]}
                width="100%"
              />
            </Stack>
          );
        })}
      </Stack>
    </Stack>
  );
}

type TabButtonProps = {
  children: React.ReactNode;
  enabled: boolean;
  onClick: () => void;
};

const TabButton = ({ children, enabled, onClick }: TabButtonProps) => {
  return (
    <Button
      variant="contained"
      onClick={onClick}
      sx={{
        backgroundColor: enabled
          ? (theme) => theme.palette.primary.main + "50" // CC = 80% opacity in hex
          : "transparent",
        color: "black",
      }}
    >
      {children}
    </Button>
  );
};
