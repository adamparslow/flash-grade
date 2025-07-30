import { Link } from "react-router-dom";
import { Box, IconButton, Stack, Typography } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";

export function Navigation() {
  return (
    <nav>
      <Stack
        direction="row"
        gap={2}
        padding={0.5}
        alignItems="center"
        justifyContent="space-between"
      >
        <IconButton component={Link} to="/">
          <ArrowBack fontSize="large" />
        </IconButton>

        <Typography variant="h6" color="primary">
          FlashGrade
        </Typography>

        <Box width="51px" />
      </Stack>
    </nav>
  );
}
