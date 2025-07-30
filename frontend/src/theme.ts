import { createTheme } from "@mui/material";

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#7DA6FF', // Soft Blue
    },
    secondary: {
      main: '#FFE680', // Soft Yellow
    },
    error: {
      main: '#FF9A9A', // Pastel Red
    },
    background: {
      default: '#FFFDF8', // Very light cream
      paper: '#FFFFFF',
    },
    text: {
      primary: '#3A3A3A',
    },
  },
  typography: {
    fontFamily: 'Nunito, sans-serif',
  },
  components: {
    MuiButton: {
      defaultProps: {
        disableElevation: true
      }
    },
  },
});
