/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  Container,
  Flex,
  HStack,
  Text,
  Button,
  Box,
  Spinner,
  VStack,
  Heading,
  SimpleGrid,
  Card,
  CardBody,
  Icon,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  CardFooter,
  useColorModeValue,
  useToken,
  useBreakpointValue,
} from "@chakra-ui/react";
import dynamic from "next/dynamic";
import { AppShell } from '@component/components/layout'
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { withTranslation } from "react-i18next";
import { useRouter } from "next/router";
import { GetAllBots, GetBotsByCompany } from "@component/store/botsSlice";
import { useDispatch, useSelector } from "react-redux";
import { useAuthStore } from "@component/store/auth";
import { AppDispatch } from "@component/store";
import { companiesGet } from "@component/store/companySlice";
import { Select, StylesConfig } from "chakra-react-select";
import { GetBotExtension } from "@component/store/integrationsSlice";
import { AddIcon } from "@chakra-ui/icons";
import active from "../../assets/images/active.svg";
import disable from "../../assets/images/disable.svg";
import {
  FaWhatsapp,
  FaInstagram,
  FaFacebookMessenger,
  FaFacebookF,
  FaTelegramPlane,
  FaTwitter,
  FaChrome,
  FaGoogle,
} from "react-icons/fa";
import useCoftechColors from "@component/hooks/useCoftechColors";
import { resetFilters, setFilters } from "@component/store/filtersSlice";
import StatusAvatar from "@component/components/StatusAvatar";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { useLazyGetNotAssignedExtensionsQuery } from "@component/store/RTK/botsRTK";
import IntegrationView from "@component/components/IntegrationView";
import { useError } from "@component/utils/errorContext";
import useCoftechSelect from "@component/hooks/useCoftechSelect";

const getIconComponent = (iconName: any) => {
  try {
    const IconComponent = dynamic(() =>
      import(`react-icons/fa`).then((icons) => icons[iconName])
    );
    return IconComponent;
  } catch (error) {
    console.error("Icon not found:", iconName);
    return null;
  }
};

const Integrations = ({ t }) => {
  const router = useRouter();
  const { showError } = useError();
  const dispatch: AppDispatch = useDispatch();
  const { bots, loading: loadingBots, error: botsError } = useSelector(
    (state: any) => state.bots
  );
  const { companies, loading: loadingCompanies, error: companiesError } = useSelector(
    (state: any) => state.company
  );
  const { botExtensions, loading: loadingExtensions, error: extensionError } = useSelector(
    (state: any) => state.integration
  );
  const { user } = useAuthStore();

  const [selectedCompany, setSelectedCompany] = useState(null);
  const [botFilter, setBotFilter] = useState<string | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const {
    bgColor,
    hoverColor,
    panelBgColor,
    backgroundColor,
    descriptionColor,
    borderColor,
    textColor,
    iconColor,
    inputBorderColor,
  } = useCoftechColors();

  const {
    style
  } = useCoftechSelect();

  const filters = useSelector((state: any) => state.filters);

  useEffect(() => {
    const hasSeenModal = localStorage.getItem("WelcomeModal");
    if (!hasSeenModal) {
      onOpen();
      localStorage.setItem("WelcomeModal", "true");
    }
  }, [onOpen]);

  useEffect(() => {
    if (user?.company_id && user.rol_key === "SUPERADMIN") {
      dispatch(companiesGet());
    }
    const company = localStorage.getItem("latestIntegCompany");
    if (company != undefined) {
      setSelectedCompany(company)
    } else {
      setSelectedCompany(user?.company_id)
    }
  }, [dispatch, user?.company_id, user?.rol_key]);

  useEffect(() => {
    if (selectedCompany) {
      dispatch(GetBotsByCompany(selectedCompany));
      setSelectedBot(null)
    }
  }, [selectedCompany])

  const optionsCompanies = companies?.map((company) => ({
    value: company.uuid_unique,
    label: (
      <HStack>
        <Text>{company.name}</Text>
      </HStack>
    ),
  }));

  const optionsBots = bots.map((bot) => ({
    value: bot.uuid_unique,
    label: (
      <HStack>
        <Text>{bot.name}</Text>
      </HStack>
    ),
  }));

  const handleFilterByBot = (e: any) => {
    setBotFilter(e ? e.value : null);
  };

  const handleFilterByCompany = (option: any) => {
    setSelectedCompany(option.value);
    dispatch(GetBotsByCompany(option.value));
  };

  const handleIntegrationEdit = (extension) => {
    dispatch(setFilters({
      selectedCompany: selectedCompany,
      botFilter: botFilter
    }));
    router.push(
      `/integrations/edit/${extension.bot_id}/${extension.extension}/${selectedCompany}`
    );
  }

  useEffect(() => {
    if (botsError.message.length > 1) {
      showError(botsError.message)
    }
  }, [botsError])

  useEffect(() => {
    if (companiesError.message.length > 1) {
      showError(companiesError.message)
    }
  }, [companiesError])

  useEffect(() => {
    if (extensionError.message.length > 1) {
      showError(extensionError.message)
    }
  }, [extensionError])

  useEffect(() => {
    const bot = localStorage.getItem("latestIntegBot")
    if (filters && Object.keys(filters).length > 0 && bots.length > 0) {
      if (filters.selectedCompany != null) handleFilterByCompany({ value: filters.selectedCompany });
      if (filters.botFilter != null) handleFilterByBot({ value: filters.botFilter });
      dispatch(resetFilters())
    }

    if (bot != undefined && bots.some((aBot) => aBot.uuid_unique == bot)) {
      setSelectedBot(bot)
    }
  }, [bots]);

  const [startIndexBots, setStartIndexBots] = useState<number>(0)

  const bulletColor = useColorModeValue("gray.300", "gray.500")
  const botPanelColor = useColorModeValue("rgb(235, 235, 235)", "rgb(45, 45, 45)")
  const botsScrollRef = useRef<HTMLDivElement | null>()
  const [shadowColor] = useToken('colors', [bgColor]);
  const isMobile = useBreakpointValue({ base: true, md: false });
  const [selectedBot, setSelectedBot] = useState<any>()
  const [unassignedTrigger, { data: unassigned }] = useLazyGetNotAssignedExtensionsQuery();
  const [modalExtension, setModalExtension] = useState()

  useEffect(() => {
    if (selectedBot) {
      dispatch(GetBotExtension(selectedBot));
      unassignedTrigger(selectedBot);
    }
  }, [dispatch, selectedBot]);

  useEffect(() => {
    setStartIndexBots(0)
  }, [bots, isMobile])

  const handleArrowBotsPress = (isLeft) => {
    const maxWidth = botsScrollRef.current?.scrollWidth - botsScrollRef.current?.clientWidth
    const sections = maxWidth / (bots.length - 1)
    let newIndex = 0
    if (isLeft) {
      newIndex = Math.max(startIndexBots - 1, 0)
    } else {
      newIndex = Math.min(bots.length - 1, startIndexBots + 1)
    }
    setStartIndexBots(newIndex)
    const goBy = (newIndex * sections)
    if (botsScrollRef.current) {
      botsScrollRef.current.scrollTo({
        left: goBy,
        behavior: 'smooth',
      })
    }
  }

  const {
    isOpen: isModalOpen,
    onOpen: onOpenModal,
    onClose: onCloseModal,
  } = useDisclosure();

  return (
    <>
      <AppShell title={t("integrations.title")}>
        <Container
          minHeight="100vh"
          maxW="full"
          h={"full"}
          p={{ base: 0, md: "auto" }}
        >
          <IntegrationView
            onClose={onCloseModal}
            isOpen={isModalOpen}
            extension={modalExtension}
          />
          <Modal
            isOpen={isOpen}
            onClose={onClose}
            size={"xl"}
            isCentered
            variant="coftechModal"
          >
            <ModalOverlay />
            <ModalContent>
              <ModalHeader textAlign="center">
                {t("modalsWelcome.integrations.welcome")}
              </ModalHeader>
              <ModalBody>
                <VStack spacing={4} textAlign="center">
                  <HStack spacing={4}>
                    <Icon as={FaWhatsapp} boxSize={6} />
                    <Icon as={FaInstagram} boxSize={6} />
                    <Icon as={FaFacebookMessenger} boxSize={6} />
                    <Icon as={FaFacebookF} boxSize={6} />
                    <Icon as={FaTelegramPlane} boxSize={6} />
                    <Icon as={FaTwitter} boxSize={6} />
                    <Icon as={FaGoogle} boxSize={6} />
                    <Icon as={FaChrome} boxSize={6} />
                  </HStack>
                  <Text fontSize="md">
                    {t("modalsWelcome.integrations.description")}
                  </Text>
                  <Text fontSize="sm">
                    {t("modalsWelcome.integrations.reminder")}
                  </Text>
                </VStack>
              </ModalBody>
              <ModalFooter justifyContent="center">
                <Button
                  bg={bgColor}
                  color={"white"}
                  _hover={{
                    bg: hoverColor,
                  }}
                  w={"100%"}
                  onClick={onClose}
                >
                  {t("modalsWelcome.integrations.continue")}
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>

          <Box display="flex" flexDirection="column" gap={4} px={4}>
            <VStack
              mb={4}
              gap={"20px"}
              w={"full"}
            >
              {user?.rol_key === "SUPERADMIN" && (
                <VStack
                  spacing={4}
                  alignItems="start"
                  w={{ base: "100%", md: "auto" }}
                  mr={"auto"}
                >
                  <Heading size="sx">{t("prompt.selectCompany")}</Heading>
                  <Select
                    isSearchable={false}
                    value={optionsCompanies.find((option) => option.value === selectedCompany)}
                    onChange={handleFilterByCompany}
                    options={optionsCompanies}
                    placeholder={t("prompt.selectCompany")}
                    focusBorderColor={bgColor}
                    chakraStyles={style}
                  />
                </VStack>
              )}
              <VStack
                spacing={4}
                alignItems="start"
                w={"full"}
                mr={"auto"}
              >
                <Heading size="sx">{t("prompt.selectBot")}</Heading>
                {loadingBots ? (
                  <Spinner color={bgColor} size="lg" />
                ) : (
                  <VStack gap={5} w={"full"}>
                    <HStack w={"full"} h={"full"}>
                      <Box borderRadius={"50%"} p={1} _hover={{ cursor: "pointer", bg: bulletColor }} onClick={() => {
                        handleArrowBotsPress(true)
                      }}>
                        <IoIosArrowBack color="#1B89E6" />
                      </Box>
                      <HStack h={"full"} w={"full"} ref={botsScrollRef} overflowX={"auto"} p={3} gap={3} pb={2} sx={{ '&::-webkit-scrollbar': { display: 'none' }, msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
                        {bots && bots.length > 0 ? bots.map((bot, index) => {
                          return (
                            <HStack key={index} mb={"auto"} h={"full"}>
                              <VStack bg={botPanelColor} p={3} borderRadius={15} w={"350px"} maxW={"350px"} h={"150px"} border={"2px solid"} borderColor={selectedBot == bot.uuid_unique ? bgColor : "transparent"} boxShadow={selectedBot == bot.uuid_unique ? `0 0 5px 1px ${shadowColor}` : null} _hover={{ border: "2px solid", borderColor: bgColor, cursor: "pointer", boxShadow: `0 0 5px 1px ${shadowColor}` }}
                                onClick={
                                  async () => {
                                    setSelectedBot(bot.uuid_unique)
                                    localStorage.setItem("latestIntegBot", bot.uuid_unique)
                                    localStorage.setItem("latestIntegCompany", bot.company_id)
                                  }
                                }>
                                <HStack h={"full"} w={"full"}>
                                  <VStack my={"auto"} mr={"10px"}>
                                    <StatusAvatar
                                      name="photo"
                                      src={bot.photo}
                                      status={
                                        true
                                          ? "suspended"
                                          : "active"
                                      }
                                      style={{
                                        borderRadius: "50%",
                                        height: "70px",
                                        width: "70px",
                                        margin: "1px",
                                      }}
                                    />
                                  </VStack>
                                  <VStack w={"full"}>
                                    <Box
                                      display="flex"
                                      alignItems="center"
                                      gap="12px"
                                      justifyContent="center"
                                      fontSize={13}
                                      background={panelBgColor}
                                      borderRadius="5px"
                                      padding="2px 10px"
                                      maxW="140px"
                                      mr={"auto"}
                                      mb={"auto"}
                                    >
                                      {bot.status == 0 || !bot.identifier ?
                                        (
                                          <>
                                            <Image src={disable} alt="Inactive"></Image>
                                            {t("bots.deactivated")}
                                          </>
                                        ) : bot.suspended ? (
                                          <>
                                            <Image src={disable} alt="Suspended"></Image>
                                            {t("bots.suspended")}
                                          </>
                                        ) : (
                                          <>
                                            <Image src={active} alt="Active"></Image>
                                            {t("bots.activated")}
                                          </>
                                        )}
                                    </Box>

                                    <VStack h={"full"}>
                                      <Text fontWeight={"bold"} textAlign={"center"} m={"auto"}>{bot.name}</Text>
                                    </VStack>
                                  </VStack>
                                </HStack>
                              </VStack>
                            </HStack>
                          )
                        }) : (<HStack w={"full"} mt={2}><Text m={"auto"}>{t("home.noBots")}</Text></HStack>)}
                      </HStack>
                      <Box borderRadius={"50%"} p={1} _hover={{ cursor: "pointer", bg: bulletColor }} onClick={() => {
                        handleArrowBotsPress(false)
                      }}>
                        <IoIosArrowForward color="#1B89E6" />
                      </Box>
                    </HStack>
                  </VStack>
                )}
              </VStack>
            </VStack>
          </Box>
          {loadingExtensions ? (
            <Flex justifyContent="center" alignItems="center" height="50vh">
              <Spinner size="xl" color={bgColor} />
            </Flex>
          ) : (
            <SimpleGrid columns={[1, 2, 3]} gap={6} w="full" mt={"16px"}>
              {selectedBot && botExtensions.length > 0 ? (
                botExtensions.map((extension, key) => {
                  const IconComponent = getIconComponent(
                    extension.extension_icon
                  );
                  return (
                    <Card
                      key={key}
                      w="100%"
                      bg={panelBgColor}
                      borderRadius="10px"
                      boxShadow="0px 4px 10px rgba(0, 0, 0, 0.05)"
                      boxSizing="content-box"
                    >
                      <CardBody
                        boxSizing="border-box"
                        p="15px 20px 15px 20px"
                        display="flex"
                        flexDir="column"
                        textAlign={"start"}
                        alignItems={"start"}
                        gap="7px"
                      >
                        {extension.extension_image != null && (
                          <Image src={extension.extension_image.url} width={20} height={12} alt="Extension Image" />
                        )}
                        {IconComponent && (
                          <Box
                            borderRadius={"full"}
                            width="60px"
                            height="60px"
                            display="flex"
                            justifyContent="center"
                            alignItems="center"
                          >
                            <Icon
                              as={IconComponent}
                              color={bgColor}
                              boxSize="50px"
                            />
                          </Box>
                        )}
                        <Box>
                          <Text
                            fontSize={16}
                            fontFamily="Poppins"
                            fontWeight="600"
                          >
                            {extension.extension_name}
                          </Text>
                        </Box>
                        <Box
                          mb={1}
                        >
                          <Text
                            fontSize={14}
                            fontFamily="Poppins"
                            color={descriptionColor}
                          >
                            {extension.extension_description[t(`integrations.lang`)]}
                          </Text>
                        </Box>
                        <Button
                          bg={bgColor}
                          color="white"
                          w={["70%", "70%"]}
                          borderRadius="md"
                          _hover={{ bg: hoverColor }}
                          onClick={() => handleIntegrationEdit(extension)}
                          alignSelf={["start", "flex-start"]}
                        >
                          {t("integrations.configureButton")}
                        </Button>
                      </CardBody>
                      <CardFooter m={0} p={0}></CardFooter>
                    </Card>
                  );
                })
              ) : (
                <>
                  {selectedBot ? (<Text>{t("integrations.noConfigBot")}</Text>) : (<></>)}
                </>
              )}
            </SimpleGrid>
          )}

          {loadingExtensions ? (
            <></>
          ) : (
            <>
              {selectedBot && unassigned?.data?.length > 0 && <Text fontSize={"25px"} fontWeight={"bold"} mt={"100px"} ml={5}>{t("integrations.unassigned")}</Text>}
              <SimpleGrid columns={[1, 2, 3]} gap={6} w="full" mt={"16px"}>
                {selectedBot && unassigned?.data?.length > 0 ? (
                  unassigned.data?.map((extension, key) => {
                    const IconComponent = getIconComponent(
                      extension.icon
                    );
                    return (
                      <Card
                        key={key}
                        w="100%"
                        bg={panelBgColor}
                        borderRadius="10px"
                        boxShadow="0px 4px 10px rgba(0, 0, 0, 0.05)"
                        boxSizing="content-box"
                      >
                        <CardBody
                          boxSizing="border-box"
                          p="15px 20px 15px 20px"
                          display="flex"
                          flexDir="column"
                          textAlign={"start"}
                          alignItems={"start"}
                          gap="7px"
                        >
                          {extension.extension_image != null && (
                            <Image src={extension.extension_image.url} width={20} height={12} alt="Extension Image" />
                          )}
                          {IconComponent && (
                            <Box
                              borderRadius={"full"}
                              width="60px"
                              height="60px"
                              display="flex"
                              justifyContent="center"
                              alignItems="center"
                            >
                              <Icon
                                as={IconComponent}
                                color={bgColor}
                                boxSize="50px"
                              />
                            </Box>
                          )}
                          <Box>
                            <Text
                              fontSize={16}
                              fontFamily="Poppins"
                              fontWeight="600"
                            >
                              {extension.name}
                            </Text>
                          </Box>
                          <Box
                            mb={1}
                          >
                            <Text
                              fontSize={14}
                              fontFamily="Poppins"
                              color={descriptionColor}
                            >
                              {extension.description[t(`integrations.lang`)]}
                            </Text>
                          </Box>
                          <Button
                            bg={bgColor}
                            color="white"
                            w={["70%", "70%"]}
                            borderRadius="md"
                            _hover={{ bg: hoverColor }}
                            onClick={() => {
                              setModalExtension(extension)
                              onOpenModal()
                            }}
                            alignSelf={["start", "flex-start"]}
                          >
                            {t("integrations.seeMore")}
                          </Button>
                        </CardBody>
                        <CardFooter m={0} p={0}></CardFooter>
                      </Card>
                    );
                  })
                ) : (
                  <></>
                )}
              </SimpleGrid>
            </>
          )}
        </Container>
      </AppShell>
    </>
  );
};

export const getStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common"])),
  },
});

export default withTranslation("common")(Integrations);
