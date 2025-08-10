import { Button, Stack, Typography } from "@mui/material";
import type { Translation } from "./DictionaryPage";
import { Link, useParams } from "react-router";
import {
  deleteTranslation,
  getTranslations,
} from "./translationsApi";
import { useEffect, useState } from "react";

export const DeleteTranslationPage = () => {
  const { id: idStr } = useParams<{ id: string }>();
  const id = parseInt(idStr || "0");
  const [translation, setTranslation] = useState<Translation | undefined>();

  useEffect(() => {
    getTranslations().then((translations) => {
      setTranslation(translations.find((t) => t.id === id));
    });
  }, []);

  const deleteCard = async () => {
    await deleteTranslation(id);
  };

  if (!translation) {
    return "Loading";
  }

  return (
    <Stack>
      <Typography>Do you want to delete this entry?</Typography>
      <Typography>Tagalog: {translation.tagalog}</Typography>
      <Typography>English: {translation.english}</Typography>

      <Button onClick={deleteCard}>Delete</Button>
      <Button component={Link} to="/dictionary">
        Cancel
      </Button>
    </Stack>
  );
};
