/* eslint-disable react-hooks/exhaustive-deps */
import Image from "next/image";
import { Inter } from "next/font/google";
import {
  Container,
  HStack,
  Text,
  Box,
  VStack,
  useColorModeValue,
  Icon,
  Button,
  useBreakpointValue,
  useToast,
  useToken,
} from "@chakra-ui/react";
import dynamic from "next/dynamic";
import { AppShell } from '@component/components/layout'
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { withTranslation } from "react-i18next";
import { useAuthStore } from "@component/store/auth";
import useCoftechColors from "@component/hooks/useCoftechColors";
import active from "../assets/images/active.svg";
import disable from "../assets/images/disable.svg";
import StatusAvatar from "@component/components/StatusAvatar";
import router from "next/router";
import { AppDispatch } from "@component/store";
import { GetBotsByCompany } from "@component/store/botsSlice";
import { formatDate } from "@component/utils";
import { Select as SelectChakra } from "chakra-react-select";
import { GetBotExtension } from "@component/store/integrationsSlice";
import { useGetCostsMutation } from "@component/store/RTK/OpenAI";
import { companiesGet } from "@component/store/companySlice";
import { useLazyGetBotSummaryQuery } from "@component/store/RTK/botsRTK";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { FaKey } from "react-icons/fa";
import { WarningIcon } from "@chakra-ui/icons";
import { useLazyGetPromptsQuery } from "@component/store/RTK/promptsRTK";
import useErrorHandler from "@component/hooks/useErrorHandler";
import useCoftechSelect from "@component/hooks/useCoftechSelect";

const inter = Inter({ subsets: ["latin"] });

const Home = ({ t }) => {
  const { user } = useAuthStore();
  const { handleError } = useErrorHandler();
  const { style, styleLightBorder } = useCoftechSelect();
  const {
    hoverColor,
    panelBgColor,
    backgroundColor,
    descriptionColor,
    borderColor,
    textColor,
  } = useCoftechColors();
  const bgColor = useColorModeValue("coftech.primary.dark", "coftech.primary.dark")
  const [shadowColor] = useToken('colors', [bgColor]);
  const bulletColor = useColorModeValue("gray.300", "gray.500")
  const stageColor = useColorModeValue("#D9E2EC", "#F8FBFF");
  const [triggerPrompts, { data: prompts, error: promptsError }] = useLazyGetPromptsQuery();
  const { bots, error: botsError } = useSelector((resp: any) => resp.bots);
  const { botExtensions, error: extensionError } = useSelector((state: any) => state.integration);
  const { companies, error: companiesError } = useSelector((state: any) => state.company);
  const isMobile = useBreakpointValue({ base: true, md: false });
  const [trigger, { data: cost, isLoading }] = useGetCostsMutation()
  const [triggerSummary, { data: messages, isLoading: isLoadingMessages }] = useLazyGetBotSummaryQuery()

  const [selectedBotI, setSelectedBotI] = useState<{ value: string, label: JSX.Element } | null>(null)
  const [selectedBotII, setSelectedBotII] = useState<{ value: string, label: JSX.Element } | null>(null)
  const [selectedBotIII, setSelectedBotIII] = useState<{ value: string, label: JSX.Element } | null>(null)
  const [selectedCompany, setSelectedCompany] = useState<{ value: string, label: JSX.Element } | null>(null)
  const [botsBullets, setBotsBullets] = useState<number>()
  const [startIndexBots, setStartIndexBots] = useState<number>(0)
  const [integrationsBullets, setIntegrationsBullets] = useState<number>(0)
  const [startIndexInteg, setStartIndexInteg] = useState<number>()
  const [time, setTime] = useState<{ value: string, label: JSX.Element }>()
  const [start, setStart] = useState<number>()
  const [end, setEnd] = useState<number>()
  const [openAIIntegButton, setOpenAIIntegButton] = useState<boolean>(false)
  const [openAIInteg, setOpenAIInteg] = useState<any>()

  const toast = useToast()

  const dispatch: AppDispatch = useDispatch()

  const botsScrollRef = useRef<HTMLDivElement | null>()
  const integrationsScrollRef = useRef<HTMLDivElement | null>()

  const handleBotBulletPress = (index) => {
    setStartIndexBots(index);
    const position = isMobile ? (385) : (470)
    const goBy = (index * position)
    if (botsScrollRef.current) {
      botsScrollRef.current.scrollTo({
        left: goBy,
        behavior: 'smooth',
      })
    }
  }

  const handleArrowBotsPress = (isLeft) => {
    const position = isMobile ? (385) : (470)
    let newIndex = 0
    if (isLeft) {
      newIndex = Math.max(startIndexBots - 1, 0)
    } else {
      newIndex = Math.min([...Array(botsBullets)].length - 1, startIndexBots + 1)
    }
    setStartIndexBots(newIndex)
    const goBy = (newIndex * position)
    if (botsScrollRef.current) {
      botsScrollRef.current.scrollTo({
        left: goBy,
        behavior: 'smooth',
      })
    }
  }

  useEffect(() => {
    if (botExtensions) {
      const openAi = botExtensions.filter((ext) => {
        if (ext.extension_key == "OPEN_AI_SERVICE") {
          return ext
        }
      })[0]
      setOpenAIInteg(openAi)
    }
  }, [botExtensions])

  const handleArrowIntegPress = (isLeft) => {
    const position = isMobile ? (298) : (442)
    let newIndex = 0
    if (isLeft) {
      newIndex = Math.max(startIndexInteg - 1, 0)
    } else {
      newIndex = Math.min([...Array(integrationsBullets)].length - 1, startIndexInteg + 1)
    }
    setStartIndexInteg(newIndex)
    const goBy = (newIndex * position)
    if (integrationsScrollRef.current) {
      integrationsScrollRef.current.scrollTo({
        left: goBy,
        behavior: 'smooth',
      })
    }
  }

  const handleIntegBulletPress = (index) => {
    setStartIndexInteg(index);
    const position = isMobile ? (368) : (442)
    const goBy = (index * position)
    if (integrationsScrollRef.current) {
      integrationsScrollRef.current.scrollTo({
        left: goBy,
        behavior: 'smooth',
      })
    }
  }

  useEffect(() => {
    if (botsError.message.length > 1) {
      handleError(botsError)
    }
  }, [botsError])

  useEffect(() => {
    if (companiesError.message.length > 1) {
      handleError(companiesError)
    }
  }, [companiesError])

  useEffect(() => {
    if (extensionError.message.length > 1) {
      handleError(extensionError)
    }
  }, [extensionError])

  useEffect(() => {
    if (promptsError) {
      handleError(promptsError, { companyID: selectedCompany.value, botID: selectedBotIII.value })
    }
  }, [promptsError])

  useEffect(() => {
    if (selectedCompany?.value) {
      dispatch(GetBotsByCompany(selectedCompany.value));
      setStartIndexBots(0)
      setStartIndexInteg(0)
    }
  }, [selectedCompany])

  useEffect(() => {
    if (selectedBotIII && selectedCompany) {
      triggerPrompts({ companyID: selectedCompany.value, botID: selectedBotIII.value });
    }
  }, [selectedBotIII])

  useEffect(() => {
    if (bots) {
      const storageValue = localStorage.getItem("default_bot")
      const defaultBotValue = storageValue && !(storageValue.includes("undefined")) ? JSON.parse(storageValue) : undefined
      setBotsBullets(Math.ceil(bots.length / 2))
      if (defaultBotValue) {
        const option1 = botOptions.filter((option) => {
          if (option.value == defaultBotValue.uuid_unique) {
            return option
          }
        })
        const option2 = botOptions.filter((option) => {
          if (option.value == bots[0].uuid_unique) {
            return option
          }
        })
        if (option1.length > 0) {
          setSelectedBotI(option1[0])
          setSelectedBotII(option1[0])
          setSelectedBotIII(option1[0])
        } else {
          setSelectedBotI(option2[0])
          setSelectedBotII(option2[0])
          setSelectedBotIII(option2[0])
          if (option2[0]) {
            localStorage.setItem("default_bot", JSON.stringify(bots[0]))
          }
        }
        setOpenAIIntegButton(false)
      }
    }
  }, [bots])

  useEffect(() => {
    if (botExtensions) {
      if (selectedBotI) {
        setIntegrationsBullets(Math.ceil(botExtensions.length / 3))
      }
    }
  }, [botExtensions])

  useEffect(() => {
    if (selectedBotI) {
      dispatch(GetBotExtension(selectedBotI.value));
    }
  }, [selectedBotI, dispatch])

  useEffect(() => {
    if (time) {
      const now = Math.floor(Date.now() / 1000);

      setStart(Math.floor((Date.now() - ((Number(time?.value)) * 24 * 60 * 60 * 1000)) / 1000))
      setEnd(now)
    }
  }, [time])

  useEffect(() => {
    if (selectedBotII && start && end) {
      const bot = bots.filter((bot) => {
        if (selectedBotII?.value == bot.uuid_unique) {
          return bot
        }
      })[0]
      if (bot.company_id == selectedCompany?.value) {
        trigger({ companyID: selectedCompany?.value, botID: selectedBotII?.value, start: start, end: end }).then((data) => {
          if ((data as { error: any })?.error) {
            if ((data as { error: any })?.error?.data?.message?.includes("Admin key not found")) {
              setOpenAIIntegButton(true)
              if (!(toast.isActive("777"))) {
                toast({
                  id: "777",
                  title: t(`fileManager.error`),
                  description: t(`home.adminKey`),
                  status: "error",
                  duration: 2000,
                  isClosable: true,
                })
              }
            } else {
              if (!(toast.isActive("888"))) {
                toast({
                  id: "888",
                  title: t(`fileManager.error`),
                  description: (data as { error: any })?.error?.data?.message,
                  status: "error",
                  duration: 2000,
                  isClosable: true,
                })
              }
            }
          }
        })
        triggerSummary({ company: selectedCompany?.value, botId: selectedBotII?.value, type: time.value == "1" ? "DAILY" : "RANGE", from: start, to: end }).then((data) => {
          if ((data as { error: any })?.error) {
            toast({
              title: t(`fileManager.error`),
              description: (data as { error: any })?.error?.data?.message,
              status: "error",
              duration: 2000,
              isClosable: true,
            })
          }
        })
      }
    }
  }, [selectedBotII, end])

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

  useEffect(() => {
    if (companies) {
      const storageValue = localStorage.getItem("default_bot")
      const defaultBotValue = storageValue && !(storageValue.includes("undefined")) ? JSON.parse(storageValue) : undefined
      if (defaultBotValue) {
        setSelectedCompany(companyOptions.filter((option) => {
          if (option.value == defaultBotValue.company_id) {
            return option
          }
        })[0])
      } else {
        setSelectedCompany({
          value: user?.company_id,
          label: (
            <HStack>
              <Text>{user?.company_name}</Text>
            </HStack>
          ),
        })
      }
    }
  }, [companies])

  useEffect(() => {
    if (user?.rol_key == "SUPERADMIN") {
      dispatch(companiesGet());
    }
    else {
      setSelectedCompany({
        value: user?.company_id,
        label: (
          <HStack>
            <Text>{user?.company_name}</Text>
          </HStack>
        ),
      })
    }
    const storageValue = localStorage.getItem("default_date")
    const defaultDateValue = storageValue && !(storageValue.includes("undefined")) ? JSON.parse(storageValue) : undefined
    if (defaultDateValue) {
      setTime({
        value: defaultDateValue,
        label: (
          <HStack>
            <Text>{Number(defaultDateValue) > 1 ? t("home.lastDays", { days: defaultDateValue }) : t("home.today")}</Text>
          </HStack>
        ),
      })
    }
  }, [dispatch, user?.company_id]);

  const botOptions = (bots || []).map((bot) => {
    return {
      value: bot.uuid_unique,
      label: (
        <HStack>
          <Text>{bot.name}</Text>
        </HStack>
      ),
    };
  });

  const companyOptions = (companies || []).map((company) => {
    return {
      value: company.uuid_unique,
      label: (
        <HStack>
          <Text>{company.name}</Text>
        </HStack>
      ),
    };
  });

  const handleDurationChange = (value) => {
    setTime(value)
    localStorage.setItem("default_date", value.value)
  }

  const durationOptions = (["1", "7", "15", "30"]).map((duration) => {
    return {
      value: duration,
      label: (
        <HStack>
          <Text>{Number(duration) > 1 ? t("home.lastDays", { days: duration }) : t("home.today")}</Text>
        </HStack>
      ),
    };
  });

  return (
    <>
      <AppShell title={`${t("home.welcome")} ${user?.first_name}`}>
        <Container
          minHeight="100vh"
          maxW="full"
          h={"full"}
          bg={backgroundColor}
        >
          <Box display="flex" flexDirection="column" gap={4} h={"100vh"}>
            {user?.rol_key == "SUPERADMIN" && (
              <SelectChakra
                isSearchable={false}
                maxMenuHeight={200}
                onChange={(value: any) => { setSelectedCompany(value) }}
                value={selectedCompany}
                options={companyOptions}
                placeholder={t("fileManager.selectCompany")}
                focusBorderColor={bgColor}
                chakraStyles={style}
              />
            )}
            <HStack gap={5} pb={5}>
              <VStack w={"full"} gap={5} mb={"auto"} h={"full"}>
                <VStack bg={panelBgColor} p={7} borderRadius={15} gap={5} w={"full"} boxShadow={"md"}>
                  {!selectedBotII && (
                    <Text mx={"100px"} fontWeight={"bold"} fontSize={"20px"} textAlign={"center"}>{t(`home.requiredBotMessages`)}</Text>
                  )}
                  <HStack w={"full"}>
                    <SelectChakra
                      isSearchable={false}
                      maxMenuHeight={200}
                      onChange={(value: any) => {
                        setSelectedBotII(value);
                        setOpenAIIntegButton(false);
                        localStorage.setItem("default_bot", JSON.stringify(bots.filter((bot) => {
                          if (bot.uuid_unique == value.value)
                            return bot
                        })[0]))
                      }}
                      value={selectedBotII}
                      options={botOptions}
                      placeholder={t("fileManager.selectBot")}
                      focusBorderColor={bgColor}
                      chakraStyles={styleLightBorder}
                    />
                    <SelectChakra
                      isSearchable={false}
                      maxMenuHeight={200}
                      onChange={handleDurationChange}
                      value={durationOptions.filter(
                        (option) => option.value == time?.value
                      )}
                      options={durationOptions}
                      placeholder={t("home.duration")}
                      focusBorderColor={bgColor}
                      chakraStyles={styleLightBorder}
                    />
                  </HStack>
                  {selectedBotII && (
                    <>
                      <HStack gap={5}>
                        <VStack mt={4} mb={10} w={"full"}>
                          {isLoading ? (<Text mr={"auto"} color={bgColor} fontWeight={"bold"} fontSize={"32px"}>...</Text>) : (<Text mr={"auto"} color={bgColor} fontWeight={"bold"} fontSize={"32px"} >{cost && selectedBotII && time ? `${cost?.data?.total_amount.toFixed(2)} ${cost?.data?.currency}` : "-"}</Text>)}
                          <Text mr={"auto"}>{t("home.cost")}</Text>
                        </VStack>
                        <VStack mt={4} mb={10} w={"full"}>
                          {isLoadingMessages ? (<Text mr={"auto"} color={bgColor} fontWeight={"bold"} fontSize={"32px"}>...</Text>) : (<Text mr={"auto"} color={bgColor} fontWeight={"bold"} fontSize={"32px"}>{messages && selectedBotII && time ? `${messages?.data?.total_messages}` : "-"}</Text>)}
                          <Text mr={"auto"}>{t("home.messages")}</Text>
                        </VStack>
                        <VStack mt={4} mb={10} w={"full"}>
                          {isLoadingMessages ? (<Text mr={"auto"} color={bgColor} fontWeight={"bold"} fontSize={"32px"}>...</Text>) : (<Text mr={"auto"} color={bgColor} fontWeight={"bold"} fontSize={"32px"}>{messages && selectedBotII && time ? `${messages?.data?.total_senders}` : "-"}</Text>)}
                          <Text mr={"auto"}>{t("home.messagesSent")}</Text>
                        </VStack>
                      </HStack>
                      {openAIIntegButton && (
                        <HStack>
                          <HStack borderRadius={"5px"} fontWeight={"bold"} p={2} gap={3} bg={bgColor} color={"white"} _hover={{ bg: hoverColor, cursor: "pointer" }} onClick={() => {
                            if (openAIInteg && selectedBotII) {
                              router.push(`/integrations/edit/${selectedBotII.value}/${openAIInteg.extension}/${selectedCompany?.value}`);
                              setOpenAIIntegButton(false);
                            }
                          }}>
                            <FaKey />
                            <Text>{t("home.adminKeyButton")}</Text>
                          </HStack>
                        </HStack>
                      )}
                    </>
                  )}
                </VStack>

                <VStack bg={panelBgColor} p={7} borderRadius={15} gap={5} w={"full"} h={"full"} boxShadow={"md"}>
                  <Text w={"full"} mr={"auto"} fontWeight={"bold"} fontSize={"20px"}>{t("home.prompts")}</Text>
                  <VStack gap={5} h={"full"} w={"full"} mt={"30px"} p={3} sx={{ '&::-webkit-scrollbar': { display: 'none' }, '-ms-overflow-style': 'none', 'scrollbar-width': 'none' }}>
                    {!selectedBotIII && (
                      <VStack>
                        <Box p={4}>
                          <WarningIcon w={"50px"} h={"50px"} color={"#3BA3F7"}></WarningIcon>
                        </Box>
                        <Text mx={"100px"} fontWeight={"bold"} fontSize={"20px"} textAlign={"center"}>{t(`home.requiredBotIntegrations`)}</Text>
                      </VStack>
                    )}
                    <SelectChakra
                      isSearchable={false}
                      maxMenuHeight={200}
                      onChange={(value: any) => {
                        setSelectedBotIII(value);
                        localStorage.setItem("default_bot", JSON.stringify(bots.filter((bot) => {
                          if (bot.uuid_unique == value.value)
                            return bot
                        })[0]))
                      }}
                      value={selectedBotIII}
                      options={botOptions}
                      placeholder={t("fileManager.selectBot")}
                      focusBorderColor={bgColor}
                      chakraStyles={styleLightBorder}
                    />

                    {selectedBotIII && (
                      <>
                        {prompts && prompts.data?.length > 0 ? prompts.data.map((prompt, index) => (
                          <HStack key={index} bg={backgroundColor} borderRadius={15} w={"full"} p={5} border={"2px solid"} borderColor={"transparent"} _hover={{ border: "2px solid", borderColor: bgColor, cursor: "pointer", boxShadow: `0 0 5px 1px ${shadowColor}` }}
                            onClick={
                              async () => {
                                router.push(
                                  `/prompts/${prompt.company_id}/${prompt.bot_id}/${prompt.uuid_unique}`
                                )
                              }
                            }>
                            <VStack w={"full"}>
                              <Text mr={"auto"} fontWeight={"bold"} fontSize={isMobile ? "12px" : null}>{prompt.name}</Text>
                              <Text mr={"auto"} fontSize={isMobile ? "10px" : null}>{formatDate(prompt.created_at)}</Text>
                            </VStack>
                            <Box
                              display="flex"
                              alignItems="center"
                              gap="12px"
                              justifyContent="center"
                              border="1px"
                              borderColor={stageColor}
                              background={backgroundColor}
                              borderRadius="5px"
                              padding="2px 10px"
                              maxW="140px"
                              fontSize={isMobile ? "10px" : null}
                            >
                              {prompt.status == 1 ? (
                                <>
                                  <Image src={active} alt="Active"></Image>
                                  {t("bots.activated")}
                                </>
                              ) : (
                                <>
                                  <Image src={disable} alt="Inactive"></Image>
                                  {t("bots.deactivated")}
                                </>
                              )}
                            </Box>
                          </HStack>
                        )) : (<HStack w={"full"} mt={2}><Text m={"auto"}>{t("home.noIntegrations")}</Text></HStack>)}
                      </>
                    )}
                  </VStack>
                </VStack>
                {isMobile && (

                  <VStack w={"full"} gap={5} mb={"auto"} h={"full"}>
                    <VStack bg={panelBgColor} p={7} borderRadius={15} gap={5} w={"full"} boxShadow={"md"}>
                      <Text w={"full"} mr={"auto"} fontWeight={"bold"} fontSize={"20px"}>{t("home.bots")}</Text>
                      <HStack w={"full"} maxW={"510px"} h={"full"}>
                        <Box borderRadius={"50%"} p={1} _hover={{ cursor: "pointer", bg: bulletColor }} onClick={() => {
                          handleArrowBotsPress(true)
                        }}>
                          <IoIosArrowBack color={"#3BA3F7"} />
                        </Box>
                        <HStack w={"full"} maxW={"500px"} ref={botsScrollRef} h={"full"} overflowX={"auto"} gap={3} p={3} pb={2} sx={{ '&::-webkit-scrollbar': { display: 'none' }, '-ms-overflow-style': 'none', 'scrollbar-width': 'none' }}>
                          {bots && bots.length > 0 ? bots.map((bot, index) => {
                            return (
                              <HStack key={index} mb={"auto"} w={"full"} h={"full"}>
                                <VStack bg={backgroundColor} p={3} borderRadius={15} gap={8} w={"135px"} h={"full"} minH={"200px"} border={"2px solid"} borderColor={"transparent"} _hover={{ border: "2px solid", borderColor: bgColor, cursor: "pointer", boxShadow: `0 0 5px 1px ${shadowColor}` }}
                                  onClick={
                                    () => {
                                      router.push(`bots/configure/${bot?.company_id}/${bot?.uuid_unique}`);
                                    }
                                  }>
                                  <Box
                                    display="flex"
                                    alignItems="center"
                                    gap="12px"
                                    justifyContent="center"
                                    fontSize={10}
                                    background={panelBgColor}
                                    borderRadius="5px"
                                    padding="2px 10px"
                                    maxW="140px"
                                    mr={"auto"}
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
                                  <VStack h={"full"}>
                                    <Text fontWeight={"bold"} textAlign={"center"} m={"auto"} fontSize={"12px"}>{bot.name}</Text>
                                  </VStack>
                                </VStack>
                              </HStack>
                            )
                          }) : (<HStack w={"full"} mt={2}><Text m={"auto"}>{t("home.noBots")}</Text></HStack>)}
                        </HStack>
                        <Box borderRadius={"50%"} p={1} _hover={{ cursor: "pointer", bg: bulletColor }} onClick={() => {
                          handleArrowBotsPress(false)
                        }}>
                          <IoIosArrowForward color={"#3BA3F7"} />
                        </Box>
                      </HStack>
                      {botsBullets > 1 && (
                        <HStack gap={5}>
                          {[...Array(botsBullets)].map((e, index) => {
                            const isSelected = (startIndexBots) == index
                            return (
                              <Box key={index} borderRadius={"50%"} w={"10px"} h={"10px"} bg={isSelected ? bgColor : bulletColor} _hover={{ bg: isSelected ? hoverColor : null, cursor: "pointer" }} onClick={() => { handleBotBulletPress(index) }}></Box>
                            )
                          })}
                        </HStack>
                      )}
                    </VStack>

                    <VStack bg={panelBgColor} p={7} borderRadius={15} gap={5} w={"full"} h={"full"} boxShadow={"md"}>
                      <Text w={"full"} mr={"auto"} fontWeight={"bold"} fontSize={"20px"}>{t("home.integrations")}</Text>
                      {!selectedBotI && (
                        <VStack>
                          <Box p={4}>
                            <WarningIcon w={"50px"} h={"50px"} color={"#3BA3F7"}></WarningIcon>
                          </Box>
                          <Text mx={"100px"} fontWeight={"bold"} fontSize={"20px"} textAlign={"center"}>{t(`home.requiredBotIntegrations`)}</Text>
                        </VStack>
                      )}
                      <SelectChakra
                        maxMenuHeight={200}
                        isSearchable={false}
                        onChange={(value: any) => {
                          setSelectedBotI(value)
                          localStorage.setItem("default_bot", JSON.stringify(bots.filter((bot) => {
                            if (bot.uuid_unique == value.value)
                              return bot
                          })[0]))
                        }}
                        value={selectedBotI}
                        options={botOptions}
                        placeholder={t("fileManager.selectBot")}
                        focusBorderColor={bgColor}
                        chakraStyles={styleLightBorder}
                      />
                      {selectedBotI && (
                        <>
                          <HStack w={"full"} maxW={"510px"} h={"full"}>
                            <Box borderRadius={"50%"} p={1} _hover={{ cursor: "pointer", bg: bulletColor }} onClick={() => {
                              handleArrowIntegPress(true)
                            }}>
                              <IoIosArrowBack color={"#3BA3F7"} />
                            </Box>
                            <HStack ref={integrationsScrollRef} w={"full"} h={"full"} maxW={"500px"} overflowX={"auto"} gap={3} p={3} pb={2} sx={{ '&::-webkit-scrollbar': { display: 'none' }, '-ms-overflow-style': 'none', 'scrollbar-width': 'none' }}>
                              {selectedBotI && botExtensions && botExtensions.length > 0 ? botExtensions.map((integ, index) => {
                                const IconComponent = getIconComponent(
                                  integ.extension_icon
                                );
                                return (
                                  <VStack key={index} bg={backgroundColor} p={3} borderRadius={15} gap={2} w={"87px"} h={"full"} minH={"200px"} border={"2px solid"} borderColor={"transparent"} _hover={{ border: "2px solid", borderColor: bgColor, boxShadow: `0 0 5px 1px ${shadowColor}` }}>
                                    {IconComponent && (
                                      <Box
                                        bg={"black"}
                                        borderRadius={"full"}
                                        width="60px"
                                        height="60px"
                                        display="flex"
                                        justifyContent="center"
                                        alignItems="center"
                                      >
                                        <Icon
                                          as={IconComponent}
                                          color="white"
                                          boxSize="25px"
                                        />
                                      </Box>
                                    )}
                                    <Text fontWeight={"bold"} textAlign={"center"} fontSize={"12px"}>{integ.extension_name}</Text>
                                    <Button
                                      bg={bgColor}
                                      size={"sm"}
                                      color="white"
                                      w={"100%"}
                                      borderRadius="md"
                                      _hover={{ bg: hoverColor }}
                                      onClick={() =>
                                        router.push(
                                          `/integrations/edit/${integ.bot_id}/${integ.extension}/${user?.company_id}`
                                        )
                                      }
                                      alignSelf={["center", "flex-end"]}
                                      mt={"auto"}
                                      fontSize={"10px"}
                                    >
                                      {t("integrations.configureButton")}
                                    </Button>
                                  </VStack>
                                )
                              }) : (<HStack w={"full"} mt={2}><Text m={"auto"}>{t("home.noIntegrations")}</Text></HStack>)}
                            </HStack>
                            <Box borderRadius={"50%"} p={1} _hover={{ cursor: "pointer", bg: bulletColor }} onClick={() => {
                              handleArrowIntegPress(false)
                            }}>
                              <IoIosArrowForward color={"#3BA3F7"} />
                            </Box>
                          </HStack>
                          {selectedBotI && integrationsBullets > 1 && (
                            <HStack gap={5}>
                              {[...Array(integrationsBullets)].map((e, index) => {
                                const isSelected = (startIndexInteg) == index
                                return (
                                  <Box key={index} borderRadius={"50%"} w={"10px"} h={"10px"} bg={isSelected ? bgColor : bulletColor} _hover={{ bg: isSelected ? hoverColor : null, cursor: "pointer" }} onClick={() => { handleIntegBulletPress(index) }}></Box>
                                )
                              })}
                            </HStack>
                          )}
                        </>
                      )}
                    </VStack>
                  </VStack>
                )}
              </VStack>

              {!isMobile && (
                <VStack w={"full"} gap={5} mb={"auto"} h={"full"}>
                  <VStack bg={panelBgColor} p={7} borderRadius={15} gap={5} w={"full"} boxShadow={"md"}>
                    <Text w={"full"} mr={"auto"} fontWeight={"bold"} fontSize={"20px"}>{t("home.bots")}</Text>
                    <HStack w={"full"} maxW={"510px"} h={"full"}>
                      <Box borderRadius={"50%"} p={1} _hover={{ cursor: "pointer", bg: bulletColor }} onClick={() => {
                        handleArrowBotsPress(true)
                      }}>
                        <IoIosArrowBack color={"#3BA3F7"} />
                      </Box>
                      <HStack h={"full"} w={"full"} maxW={"510px"} ref={botsScrollRef} overflowX={"auto"} p={3} gap={3} pb={2} sx={{ '&::-webkit-scrollbar': { display: 'none' }, '-ms-overflow-style': 'none', 'scrollbar-width': 'none' }}>
                        {bots && bots.length > 0 ? bots.map((bot, index) => {
                          return (
                            <HStack key={index} mb={"auto"} h={"full"}>
                              <VStack bg={backgroundColor} p={3} borderRadius={15} gap={8} w={"205px"} h={"full"} minH={"200px"} border={"2px solid"} borderColor={"transparent"} _hover={{ border: "2px solid", borderColor: bgColor, cursor: "pointer", boxShadow: `0 0 5px 1px ${shadowColor}` }}
                                onClick={
                                  () => {
                                    router.push(`bots/configure/${bot?.company_id}/${bot?.uuid_unique}`);
                                  }
                                }>
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
                                <VStack h={"full"}>
                                  <Text fontWeight={"bold"} textAlign={"center"} m={"auto"}>{bot.name}</Text>
                                </VStack>
                              </VStack>
                            </HStack>
                          )
                        }) : (<HStack w={"full"} mt={2}><Text m={"auto"}>{t("home.noBots")}</Text></HStack>)}
                      </HStack>
                      <Box borderRadius={"50%"} p={1} _hover={{ cursor: "pointer", bg: bulletColor }} onClick={() => {
                        handleArrowBotsPress(false)
                      }}>
                        <IoIosArrowForward color={"#3BA3F7"} />
                      </Box>
                    </HStack>
                    {botsBullets > 1 && (
                      <HStack gap={5}>
                        {[...Array(botsBullets)].map((e, index) => {
                          const isSelected = (startIndexBots) == index
                          return (
                            <Box key={index} borderRadius={"50%"} w={"10px"} h={"10px"} bg={isSelected ? bgColor : bulletColor} _hover={{ bg: isSelected ? hoverColor : null, cursor: "pointer" }} onClick={() => { handleBotBulletPress(index) }}></Box>
                          )
                        })}
                      </HStack>
                    )}
                  </VStack>

                  <VStack bg={panelBgColor} p={7} borderRadius={15} gap={5} w={"full"} boxShadow={"md"}>
                    <Text w={"full"} mr={"auto"} fontWeight={"bold"} fontSize={"20px"}>{t("home.integrations")}</Text>
                    {!selectedBotI && (
                      <VStack>
                        <Box p={4}>
                          <WarningIcon w={"50px"} h={"50px"} color={"#3BA3F7"}></WarningIcon>
                        </Box>
                        <Text mx={"100px"} fontWeight={"bold"} fontSize={"20px"} textAlign={"center"}>{t(`home.requiredBotIntegrations`)}</Text>
                      </VStack>
                    )}
                    <SelectChakra
                      maxMenuHeight={200}
                      isSearchable={false}
                      onChange={(value: any) => {
                        setSelectedBotI(value)
                        localStorage.setItem("default_bot", JSON.stringify(bots.filter((bot) => {
                          if (bot.uuid_unique == value.value)
                            return bot
                        })[0]))
                      }}
                      value={selectedBotI}
                      options={botOptions}
                      placeholder={t("fileManager.selectBot")}
                      focusBorderColor={bgColor}
                      chakraStyles={styleLightBorder}
                    />
                    {selectedBotI && (
                      <>
                        <HStack w={"full"} maxW={"510px"} h={"full"}>
                          <Box borderRadius={"50%"} p={1} _hover={{ cursor: "pointer", bg: bulletColor }} onClick={() => {
                            handleArrowIntegPress(true)
                          }}>
                            <IoIosArrowBack color={"#3BA3F7"} />
                          </Box>
                          <HStack w={"full"} maxW={"500px"} h={"full"} gap={3} ref={integrationsScrollRef} overflowX={"auto"} p={3} pb={2} sx={{ '&::-webkit-scrollbar': { display: 'none' }, '-ms-overflow-style': 'none', 'scrollbar-width': 'none' }}>
                            {selectedBotI && botExtensions && botExtensions.length > 0 ? botExtensions.map((integ, index) => {
                              const IconComponent = getIconComponent(
                                integ.extension_icon
                              );
                              return (
                                <HStack key={index} h={"full"}>
                                  <VStack bg={backgroundColor} p={3} borderRadius={15} gap={2} w={"135px"} h={"full"} minH={"200px"} border={"2px solid"} borderColor={"transparent"} _hover={{ border: "2px solid", borderColor: bgColor, boxShadow: `0 0 5px 1px ${shadowColor}` }}>
                                    {IconComponent && (
                                      <Box
                                        bg={"black"}
                                        borderRadius={"full"}
                                        width="60px"
                                        height="60px"
                                        display="flex"
                                        justifyContent="center"
                                        alignItems="center"
                                      >
                                        <Icon
                                          as={IconComponent}
                                          color="white"
                                          boxSize="25px"
                                        />
                                      </Box>
                                    )}
                                    <Text fontWeight={"bold"} textAlign={"center"}>{integ.extension_name}</Text>
                                    <Button
                                      bg={bgColor}
                                      size={"sm"}
                                      color="white"
                                      w={"100%"}
                                      borderRadius="md"
                                      _hover={{ bg: hoverColor }}
                                      onClick={() =>
                                        router.push(
                                          `/integrations/edit/${integ.bot_id}/${integ.extension}/${user?.company_id}`
                                        )
                                      }
                                      alignSelf={["center", "flex-end"]}
                                      mt={"auto"}
                                    >
                                      {t("integrations.configureButton")}
                                    </Button>
                                  </VStack>
                                </HStack>
                              )
                            }) : (<HStack w={"full"} mt={2}><Text m={"auto"}>{t("home.noIntegrations")}</Text></HStack>)}
                          </HStack>
                          <Box borderRadius={"50%"} p={1} _hover={{ cursor: "pointer", bg: bulletColor }} onClick={() => {
                            handleArrowIntegPress(false)
                          }}>
                            <IoIosArrowForward color={"#3BA3F7"} />
                          </Box>
                        </HStack>
                        {selectedBotI && integrationsBullets > 1 && (
                          <HStack gap={5}>
                            {[...Array(integrationsBullets)].map((e, index) => {
                              const isSelected = (startIndexInteg) == index
                              return (
                                <Box key={index} borderRadius={"50%"} w={"10px"} h={"10px"} bg={isSelected ? bgColor : bulletColor} _hover={{ bg: isSelected ? hoverColor : null, cursor: "pointer" }} onClick={() => { handleIntegBulletPress(index) }}></Box>
                              )
                            })}
                          </HStack>
                        )}
                      </>
                    )}
                  </VStack>

                </VStack>
              )}
            </HStack>
          </Box>
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

export default withTranslation("common")(Home);
