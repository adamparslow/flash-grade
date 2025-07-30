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
      },
      styleOverrides: {
        root: {
          borderRadius: '20px',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          // This targets the overall TextField container
          borderRadius: '40px',
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          // This targets the input's border radius
          borderRadius: '40px',
        },
        notchedOutline: {
          borderRadius: '40px',
        },
        input: {
          // Optional: if you want the input itself to have rounded corners (not always needed)
          borderRadius: '40px',
        },
      },
    },
  },
});
