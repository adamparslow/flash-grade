import "./App.css";
import { BrowserRouter, useRoutes } from "react-router-dom";
import { routes } from "./routes";
import { theme } from "./theme";
import { ThemeProvider } from "@mui/material";

function AppRoutes() {
  const element = useRoutes(routes);
  return element;
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </ThemeProvider >
  );
}

export default App;
