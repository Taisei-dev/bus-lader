import {
  Button,
  Heading,
  Text,
  Link,
  VStack,
  Spacer,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  List,
  ListItem,
  ListIcon,
  Icon,
  useDisclosure,
  useColorModeValue,
} from '@chakra-ui/react';
import { InfoIcon, ExternalLinkIcon } from '@chakra-ui/icons';
import { FaLocationArrow, FaLocationDot } from 'react-icons/fa6';
import constants from '../lib/constants.json';
export default function GuideButton() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const linkColor = useColorModeValue('blue.600', 'blue.200');
  return (
    <>
      <Button position="fixed" top="4.5rem" right="1rem" onClick={onOpen}>
        <InfoIcon />
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size={{ base: 'full', sm: 'lg', md: 'xl' }}
        colorScheme="gray"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>概要</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack align="left">
              <Heading size="md">このサイトについて</Heading>
              <Text>
                広島県バス協会が公開する
                <Link
                  color={linkColor}
                  textDecoration="underline"
                  isExternal
                  href="https://www.bus-kyo.or.jp/gtfs-open-data"
                >
                  GTFSオープンデータ
                  <ExternalLinkIcon mx="2px" />
                </Link>
                を利用して、広島で運行中のバスの位置情報を可視化するサイトです。
              </Text>
              <Spacer />
              <Heading size="md">使い方</Heading>
              <Text>
                アイコンをクリックすると停留所と定刻、運行経路が確認できます。
              </Text>
              <Spacer />
              <Heading size="md">対応するバス会社</Heading>
              <List>
                {...Object.keys(constants).map((companyId) => {
                  return (
                    <ListItem key={companyId}>
                      <ListIcon
                        as={FaLocationArrow}
                        color={constants[companyId].color}
                      />
                      {constants[companyId].name}
                    </ListItem>
                  );
                })}
              </List>
              <Text>
                方向のデータがない場合は
                <Icon as={FaLocationDot} />
                で表示されます。
              </Text>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button mr={3} onClick={onClose}>
              閉じる
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
