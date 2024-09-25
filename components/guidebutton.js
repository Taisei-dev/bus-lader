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
                東京都交通局・公共交通オープンデータ協議会が公開する
                <Link
                  color={linkColor}
                  textDecoration="underline"
                  isExternal
                  href="https://ckan.odpt.org/dataset/b_bus_gtfs_jp-toei/resource/171a583d-4bf3-4f71-ae57-16f2140babda"
                >
                  GTFSオープンデータ
                  <ExternalLinkIcon mx="2px" />
                </Link>
                と
                <Link
                  color={linkColor}
                  textDecoration="underline"
                  isExternal
                  href="https://ckan.odpt.org/dataset/b_bus_gtfs_rt-toei/resource/4c440b4d-ae78-4eb2-bf4e-c6e9eb2fa717"
                >
                  GTFSリアルタイムデータ
                  <ExternalLinkIcon mx="2px" />
                </Link>
                を利用して、運行中のバスの位置情報を可視化するサイトです。
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
