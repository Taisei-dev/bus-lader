import { extendTheme } from '@chakra-ui/react';

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

export default theme;
