import { Button, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

export function HomePage() {
  const navigate = useNavigate();

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
      </Stack>
    </Stack>
  );
}
