import { Outlet } from "react-router-dom";
import { Navigation } from "./Navigation";
import { Box, Stack } from "@mui/material";

export function Layout() {
  return (
    <Stack height="100vh">
      <header>
        <Box width="100%" maxWidth={1200} margin="0 auto">
          <Navigation />
        </Box>
      </header>

      <main>
        <Outlet />
      </main>

      <footer>
        <Box height={3} />
      </footer>
    </Stack>
  );
}
