import { Link } from "react-router-dom";
import { Button, Stack } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";

export function Navigation() {
  return (
    <nav>
      <Stack direction="row" gap={2} padding={0.5}>
        <Button component={Link} to="/" variant="contained">
          <ArrowBack />
        </Button>
      </Stack>
    </nav>
  );
}
