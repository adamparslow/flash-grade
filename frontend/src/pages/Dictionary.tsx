import { Link } from "react-router-dom";
import { getTranslations } from "../services/translations";
import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Stack,
  Typography,
  useTheme,
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
  const [_, setLoading] = useState(false);
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
          zIndex: 10,
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

      <Stack alignItems="flex-start" gap={4} sx={{ overflowX: "hidden" }}>
        {visibleTranslations.map((translation) => {
          return (
            <TranslationCard language={language} translation={translation} />
          );
        })}
      </Stack>
    </Stack>
  );
}

const TranslationCard = ({
  language,
  translation,
}: {
  language: string;
  translation: Translation;
}) => {
  const theme = useTheme();
  const [touchStart, setTouchStart] = useState<number>(0);
  const [touchEnd, setTouchEnd] = useState<number>(0);

  return (
    <Box position="relative" height="58px" width="100%">
      <Stack
        position="absolute"
        alignItems="flex-start"
        width="100%"
        onTouchStart={(e) => {
          setTouchStart(e.targetTouches[0].clientX);
          console.log("Touch start:", e.targetTouches[0].clientX);
        }}
        onTouchMove={(e) => {
          setTouchEnd(e.targetTouches[0].clientX);
          console.log("Touch move:", e.targetTouches[0].clientX);
        }}
        onTouchEnd={() => {
          if (touchStart && touchEnd) {
            const distance = touchStart - touchEnd;
            console.log(
              `Swipe distance: ${Math.abs(distance)}px ${
                distance > 0 ? "left" : "right"
              }`
            );

            // Optional: Trigger actions based on swipe
            if (Math.abs(distance) > 50) {
              // 50px threshold
              if (distance > 0) {
                console.log("Left swipe detected");
                // Handle left swipe
              } else {
                console.log("Right swipe detected");
                // Handle right swipe
              }
            }
          }

          setTouchStart(0);
          setTouchEnd(0);
        }}
        bgcolor="white"
        sx={{ transform: `translateX(${touchEnd - touchStart}px)` }}
      >
        <Typography variant="h6" fontWeight={600}>
          {language === "tagalog" ? translation.tagalog : translation.english}
        </Typography>
        <Typography>
          {language === "tagalog" ? translation.english : translation.tagalog}
        </Typography>

        <Box
          border="solid 1px"
          borderColor={theme.palette.grey[200]}
          width="100%"
        />
      </Stack>

      <Stack
        direction="row"
        width="100%"
        height="100%"
        justifyContent="space-between"
      >
        <Stack bgcolor="red" flex={1} height="100%" justifyContent="center">
          <Typography align="left">Delete</Typography>
        </Stack>
        <Stack bgcolor="orange" flex={1} height="100%" justifyContent="center">
          <Typography align="right">Edit</Typography>
        </Stack>
      </Stack>
    </Box>
  );
};

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
