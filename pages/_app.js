import { ChakraProvider } from '@chakra-ui/react';
import theme from './theme';
import '../styles/global.css';

export default function App({ Component, pageProps }) {
  return (
    <ChakraProvider theme={theme}>
      <Component {...pageProps} />
    </ChakraProvider>
  );
}
