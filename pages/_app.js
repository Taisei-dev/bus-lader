import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { ThemeProvider } from 'next-themes';
import '../styles/global.css';

const components = {
  Drawer: {
    variants: {
      alwaysOpen: {
        parts: ['dialog, dialogContainer'],
        dialog: {
          pointerEvents: 'auto',
        },
        dialogContainer: {
          pointerEvents: 'none',
        },
      },
    },
  },
};

const theme = extendTheme({
  components,
});

export default function App({ Component, pageProps }) {
  return (
    <ThemeProvider defaultTheme="system" enableSystem>
      <ChakraProvider theme={theme}>
        <Component {...pageProps} />
      </ChakraProvider>
    </ThemeProvider>
  );
}
