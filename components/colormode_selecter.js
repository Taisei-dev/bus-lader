import {
  Menu,
  MenuButton,
  MenuList,
  MenuItemOption,
  MenuOptionGroup,
  Button,
} from '@chakra-ui/react';
import { ChevronDownIcon, MoonIcon, SunIcon } from '@chakra-ui/icons';
export default function ColorModePrefMenu({
  colorMode,
  colorModePref,
  setColorModePref,
}) {
  return (
    <Menu closeOnSelect={false}>
      <MenuButton
        as={Button}
        rightIcon={<ChevronDownIcon />}
        position="fixed"
        top={6}
        right={6}
      >
        {colorMode == 'light' ? <MoonIcon /> : <SunIcon />}
      </MenuButton>
      <MenuList>
        <MenuOptionGroup
          title="外観モードの設定"
          type="radio"
          value={colorModePref}
          onChange={setColorModePref}
        >
          <MenuItemOption value="system">システムのデフォルト</MenuItemOption>
          <MenuItemOption value="light">ライト</MenuItemOption>
          <MenuItemOption value="dark">ダーク</MenuItemOption>
        </MenuOptionGroup>
      </MenuList>
    </Menu>
  );
}
