import {
  Menu,
  MenuButton,
  MenuList,
  MenuItemOption,
  MenuOptionGroup,
  Button,
} from '@chakra-ui/react';
import { ChevronDownIcon, MoonIcon, SunIcon } from '@chakra-ui/icons';
import { useColorMode } from '@chakra-ui/react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
export default function ColorModePrefMenu() {
  const [mounted, setMounted] = useState(false);
  const { theme, resolvedTheme, setTheme } = useTheme();
  const { setColorMode } = useColorMode();

  useEffect(() => {
    setColorMode(resolvedTheme);
  }, [resolvedTheme]);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }
  return (
    <Menu closeOnSelect={false}>
      <MenuButton
        as={Button}
        rightIcon={<ChevronDownIcon />}
        position="fixed"
        top={6}
        right={6}
      >
        {resolvedTheme == 'light' ? <MoonIcon /> : <SunIcon />}
      </MenuButton>
      <MenuList>
        <MenuOptionGroup
          title="外観モードの設定"
          type="radio"
          value={theme}
          onChange={setTheme}
        >
          <MenuItemOption value="system">システムのデフォルト</MenuItemOption>
          <MenuItemOption value="light">ライト</MenuItemOption>
          <MenuItemOption value="dark">ダーク</MenuItemOption>
        </MenuOptionGroup>
      </MenuList>
    </Menu>
  );
}
