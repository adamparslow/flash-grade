import { Link, Outlet } from "react-router-dom";
import { Box, IconButton, Stack, Typography } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";

export function Layout() {
  return (
    <Stack height="100vh">
      <header>
        <Box width="100%" maxWidth={1200} margin="0 auto">
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
        </Box>
      </header>

      <main style={{ flex: 1 }}>
        <Outlet />
      </main>

      <footer>
        <Box height={3} />
      </footer>
    </Stack>
  );
}
