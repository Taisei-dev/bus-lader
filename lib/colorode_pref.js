import { useColorMode } from '@chakra-ui/react';
import { useEffect, useState } from 'react';

const COLOR_MODE_PREF_KEY = 'color-mode-prefernce';

export const useColorModePref = function () {
  const { colorMode, toggleColorMode } = useColorMode();
  const [colorModePref, setColorPref] = useState(null);
  const [deviceColorPref, setDeviceColorPref] = useState(null);

  const setChakraColorMode = () => {
    console.log(colorMode, colorModePref, deviceColorPref);
    if (
      (colorModePref === 'system' && colorMode !== deviceColorPref) ||
      (colorModePref !== 'system' && colorModePref !== colorMode)
    ) {
      toggleColorMode();
    }
  };

  const onColorModeChange = (e) => {
    console.log(deviceColorPref);
    if (e.matches) {
      setDeviceColorPref('dark');
    } else {
      setDeviceColorPref('light');
    }
  };

  useEffect(() => {
    const pref = localStorage.getItem(COLOR_MODE_PREF_KEY) || 'system';
    setColorModePref(pref);
    const prefers_color_scheme = window.matchMedia(
      '(prefers-color-scheme: dark)'
    );
    prefers_color_scheme.addEventListener('change', onColorModeChange);
    onColorModeChange(prefers_color_scheme);
  }, []);

  useEffect(() => {
    setChakraColorMode();
  }, [colorModePref, deviceColorPref]);

  const setColorModePref = (pref) => {
    localStorage.setItem(COLOR_MODE_PREF_KEY, pref);
    setColorPref(pref);
  };
  return { colorMode, colorModePref, setColorModePref };
};
