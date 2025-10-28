import { Button, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { getStreak, postAnswers, type Answer, type Streak } from "../quiz/questionsApi";
import { useEffect, useState } from "react";

export function HomePage() {
  const navigate = useNavigate();

  const [streak, setStreak] = useState<Streak | undefined>();

  const testAnswer: Answer[] = [
    {
      correct: 1,
      wrong: 1,
      date: new Date(),
      translationId: "1"
    }
  ]

  useEffect(() => {
    getStreak().then(response => setStreak(response));
  }, []);

  return (
    <Stack gap={16} padding={4} justifyContent="center" height="100vh">
      <Typography variant="h3" color="primary">
        FlashGrade
      </Typography>

      <Stack gap={4}>
        <Button onClick={() => navigate("/quiz")} variant="contained" fullWidth>
          Quiz
        </Button>
        <Button
          onClick={() => navigate("/dictionary")}
          variant="contained"
          fullWidth
        >
          Vocab List
        </Button>
        <Button
          onClick={() => navigate("/sentences")}
          variant="contained"
          fullWidth
        >
          Sentences
        </Button>
        <Button onClick={() => postAnswers(testAnswer)}>
          Submit Answer
        </Button>

        <Typography>Streak {JSON.stringify(streak) ?? "0"}</Typography>
      </Stack>
    </Stack>
  );
}
