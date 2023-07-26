import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import '../styles/global.css';
const config = {
  initialColorMode: 'true',
  useSystemColorMode: true,
};

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
  config,
  components,
});

export default function App({ Component, pageProps }) {
  return (
    <ChakraProvider theme={theme}>
      <Component {...pageProps} />
    </ChakraProvider>
  );
}
