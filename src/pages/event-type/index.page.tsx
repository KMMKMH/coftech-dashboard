import { Inter } from "next/font/google";
import {
  Avatar,
  Box,
  Button,
  Container,
  Divider,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  HStack,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  SimpleGrid,
  Stack,
  Text,
  Textarea,
  useColorModeValue,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { AppShell } from '@component/components/layout'
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { withTranslation } from "react-i18next";
import { useAuthStore } from "@component/store/auth";
import useCoftechColors from "@component/hooks/useCoftechColors";
import {
  CalendarDate,
  ChevronDown,
  ChevronLeftDouble,
  ChevronRightDouble,
  Copy04,
  Copy06,
  Edit05,
  List,
  Plus,
  Settings02,
  Share07,
  Trash04,
} from "@untitled-ui/icons-react";
import { SearchIcon } from "@chakra-ui/icons";
import {
  Calendar,
  Views,
  ToolbarProps,
  momentLocalizer,
} from "react-big-calendar";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@component/store";
import moment from "moment";

const EventTypePage = ({ t }) => {
  const dispatch: AppDispatch = useDispatch();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user } = useAuthStore();
  const {
    bgColor,
    hoverColor,
    panelBgColor,
    backgroundColor,
    descriptionColor,
    borderColor,
    textColor,
  } = useCoftechColors();

  return (
    <>
      <AppShell title={t("eventType.title")}>
        <Container
          minHeight="100vh"
          maxW="full"
          h={"full"}
          bg={backgroundColor}
        >
          <HStack justify={"flex-end"}>
            <HStack gap={4}>
              <InputGroup
                sx={{
                  background: panelBgColor,
                  borderRadius: "20px",
                  width: { base: "100%", md: "300px" },
                }}
                boxShadow="0px 2px 4px -2px #0F172A0F, 0px 4px 8px -2px #0F172A1A"
              >
                <InputLeftElement pointerEvents="none">
                  <SearchIcon color={bgColor} />
                </InputLeftElement>
                <Input
                  focusBorderColor={bgColor}
                  border={"0.5px"}
                  placeholder={t("eventType.search")}
                />
              </InputGroup>
              <Button
                leftIcon={<Plus />}
                variant="solid"
                bg={bgColor}
                _hover={{ bg: hoverColor }}
                color="white"
                borderRadius={8}
                onClick={onOpen}
              >
                {t("eventType.new")}
              </Button>
            </HStack>
          </HStack>
          <Stack w={"full"} py={8} justify={"flex-start"}>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
              <VStack
                gap={"10px"}
                py={"16px"}
                width={"full"}
                background={panelBgColor}
                borderRadius={"8px"}
                boxShadow="0px 2px 4px -2px #0F172A0F, 0px 4px 8px -2px #0F172A1A"
              >
                <VStack px={"24px"} alignItems={"flex-start"} w={"full"}>
                  <HStack justify={"space-between"} w={"full"}>
                    <Text fontSize={"18px"}>{t("eventType.30min")}</Text>
                    <HStack color={descriptionColor} gap={0}>
                      <Menu>
                        <MenuButton>
                          <Icon as={Settings02} w={"24px"} h={"24px"}></Icon>
                          <Icon as={ChevronDown} w={"16px"} h={"16px"}></Icon>
                        </MenuButton>
                        <MenuList bg={panelBgColor} px={2} minW={"max-content"}>
                          <MenuItem
                            icon={<Edit05 />}
                            bg={panelBgColor}
                            borderRadius={"5px"}
                            px={2}
                            _hover={{
                              bg: bgColor,
                              color: "white",
                            }}
                          >
                            {t("eventType.edit")}
                          </MenuItem>
                          <MenuItem
                            icon={<Trash04 />}
                            bg={panelBgColor}
                            borderRadius={"5px"}
                            px={2}
                            _hover={{
                              bg: bgColor,
                              color: "white",
                            }}
                          >
                            {t("eventType.delete")}
                          </MenuItem>
                        </MenuList>
                      </Menu>
                    </HStack>
                  </HStack>
                  <HStack>
                    <Text fontSize={"14px"} color={descriptionColor}>
                      {t("eventType.p2p")}
                    </Text>
                  </HStack>
                  <HStack>
                    <Text
                      fontSize={"16px"}
                      color={bgColor}
                      textDecoration={"underline"}
                      cursor={"pointer"}
                    >
                      {t("eventType.viewBookingPage")}
                    </Text>
                  </HStack>
                </VStack>
                <Divider color={backgroundColor} />
                <VStack px={"24px"} justify={"center"}>
                  <HStack cursor={"pointer"}>
                    <Icon
                      as={Copy06}
                      color={bgColor}
                      w={"24px"}
                      h={"24px"}
                    ></Icon>
                    <Text fontSize={"16px"} color={bgColor}>
                      {t("eventType.copyLink")}
                    </Text>
                  </HStack>
                </VStack>
              </VStack>
              <VStack
                gap={"10px"}
                py={"16px"}
                width={"full"}
                background={panelBgColor}
                borderRadius={"8px"}
                boxShadow="0px 2px 4px -2px #0F172A0F, 0px 4px 8px -2px #0F172A1A"
              >
                <VStack px={"24px"} alignItems={"flex-start"} w={"full"}>
                  <HStack justify={"space-between"} w={"full"}>
                    <Text fontSize={"18px"}>{t("eventType.60min")}</Text>
                    <HStack color={descriptionColor} gap={0}>
                      <Menu>
                        <MenuButton>
                          <Icon as={Settings02} w={"24px"} h={"24px"}></Icon>
                          <Icon as={ChevronDown} w={"16px"} h={"16px"}></Icon>
                        </MenuButton>
                        <MenuList bg={panelBgColor} px={2} minW={"max-content"}>
                          <MenuItem
                            icon={<Edit05 />}
                            bg={panelBgColor}
                            borderRadius={"5px"}
                            px={2}
                            _hover={{
                              bg: bgColor,
                              color: "white",
                            }}
                          >
                            {t("eventType.edit")}
                          </MenuItem>
                          <MenuItem
                            icon={<Trash04 />}
                            bg={panelBgColor}
                            borderRadius={"5px"}
                            px={2}
                            _hover={{
                              bg: bgColor,
                              color: "white",
                            }}
                          >
                            {t("eventType.delete")}
                          </MenuItem>
                        </MenuList>
                      </Menu>
                    </HStack>
                  </HStack>
                  <HStack>
                    <Text fontSize={"14px"} color={descriptionColor}>
                      {t("eventType.group")}
                    </Text>
                  </HStack>
                  <HStack>
                    <Text
                      fontSize={"16px"}
                      color={bgColor}
                      textDecoration={"underline"}
                      cursor={"pointer"}
                    >
                      {t("eventType.viewBookingPage")}
                    </Text>
                  </HStack>
                </VStack>
                <Divider color={backgroundColor} />
                <VStack px={"24px"} justify={"center"}>
                  <HStack cursor={"pointer"}>
                    <Icon
                      as={Copy06}
                      color={bgColor}
                      w={"24px"}
                      h={"24px"}
                    ></Icon>
                    <Text fontSize={"16px"} color={bgColor}>
                      {t("eventType.copyLink")}
                    </Text>
                  </HStack>
                </VStack>
              </VStack>
            </SimpleGrid>
          </Stack>
        </Container>
      </AppShell>
      <Modal isCentered variant="coftechModal" isOpen={isOpen} onClose={onClose}>
        <ModalOverlay
          sx={{
            backdropFilter: "blur(10px)",
          }}
        />
        <ModalContent maxW={"650px"}>
          <ModalHeader>{t("eventType.newEventModal.title")}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack>
              <VStack
                bg={backgroundColor}
                w={"full"}
                px={6}
                py={2}
                borderRadius={"10px"}
                justify={"flex-start"}
                alignItems={"flex-start"}
                boxShadow="0px 2px 4px -2px #0F172A0F, 0px 4px 8px -2px #0F172A1A"
              >
                <Text fontSize={"16px"}>
                  {t("eventType.newEventModal.eventName")}
                </Text>
                <Input
                  background={backgroundColor}
                  borderWidth={"1px"}
                  borderColor={descriptionColor}
                  focusBorderColor={bgColor}
                  borderRadius="md"
                  boxShadow="0px 2px 4px -2px #0F172A0F, 0px 4px 8px -2px #0F172A1A"
                />
              </VStack>
              <VStack
                bg={backgroundColor}
                w={"full"}
                px={6}
                py={2}
                borderRadius={"10px"}
                justify={"flex-start"}
                alignItems={"flex-start"}
                boxShadow="0px 2px 4px -2px #0F172A0F, 0px 4px 8px -2px #0F172A1A"
              >
                <Text fontSize={"16px"}>
                  {t("eventType.newEventModal.eventType")}
                </Text>
                <Select
                  borderWidth={"1px"}
                  borderColor={descriptionColor}
                  focusBorderColor={bgColor}
                  borderRadius="md"
                  boxShadow="0px 2px 4px -2px #0F172A0F, 0px 4px 8px -2px #0F172A1A"
                  cursor={"pointer"}
                >
                  <option value="option1">One-on-One</option>
                  <option value="option2">Group</option>
                </Select>
              </VStack>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button
              variant="solid"
              bg={bgColor}
              _hover={{ bg: hoverColor }}
              color="white"
              borderRadius={8}
              onClick={onClose}
            >
              {t("eventType.newEventModal.save")}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export const getStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common"])),
  },
});

export default withTranslation("common")(EventTypePage);
