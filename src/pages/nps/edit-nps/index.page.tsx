/* eslint-disable react-hooks/exhaustive-deps */
import { Inter } from "next/font/google";
import {
  Box,
  Button,
  VStack,
  Container,
  HStack,
  Avatar,
  Text,
  FormControl,
  FormLabel,
  Input,
  IconButton,
  Flex,
  useToast,
  Icon,
  Divider,
  useDisclosure,
} from "@chakra-ui/react";
import { AppShell } from '@component/components/layout'
import { useAuthStore } from "@component/store/auth";
import { AppDispatch } from "@component/store";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { withTranslation } from "react-i18next";
import { companiesGet } from "@component/store/companySlice";
import { useRouter } from "next/router";
import { ArrowLeft, Plus, X } from "@untitled-ui/icons-react";
import useCoftechColors from "@component/hooks/useCoftechColors";
import { GetAllBots } from "@component/store/botsSlice";
import { Select } from "chakra-react-select";
import active from "@component/assets/images/active.svg";
import disable from "@component/assets/images/disable.svg";
import Image from "next/image";
import { useError } from "@component/utils/errorContext";

const inter = Inter({ subsets: ["latin"] });

const EditNps = ({ t }) => {
  const { user } = useAuthStore();
  const dispatch: AppDispatch = useDispatch();
  const router = useRouter();
  const { showError } = useError();
  const toast = useToast();
  const { bots, loading: loadingCompanies, error: botsError } = useSelector(
    (state: any) => state.bots
  );
  const [botFilter, setBotFilter] = useState(user?.company_id || null);
  const [statusFilter, setStatusFilter] = useState(null);

  const [questions, setQuestions] = useState([{ question: "", type: "" }]);

  const handleAddQuestion = () => {
    setQuestions([...questions, { question: "", type: "" }]);
  };

  const { query } = router;

  const [formData, setFormData] = useState({
    name: query.name || "",
    date: query.date || "",
    bot: query.bot || "",
    status: query.status || "",
  });

  const handleQuestionChange = (index, field, value) => {
    const newQuestions = [...questions];
    newQuestions[index][field] = value;
    setQuestions(newQuestions);
  };

  const handleRemoveQuestion = (index) => {
    const newQuestions = questions.filter((_, i) => i !== index);
    setQuestions(newQuestions);
  };

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

  useEffect(() => {
    if (user?.rol_key === "SUPERADMIN") {
      dispatch(GetAllBots());
    }
  }, [dispatch, user?.rol_key]);

  useEffect(() => {
    if (botsError.message.length > 1) {
      showError(botsError.message)
    }
  }, [botsError])

  useEffect(() => {
    if (user?.rol_key !== "ADMIN") {
      //@ts-ignore
      dispatch(companiesGet(user?.company_id));
    }
  }, [dispatch, user?.company_id, user?.rol_key]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = async () => {
    router.push("/nps");
  };

  const handleFilterByBot = (option) => {
    setBotFilter(option ? option.value : null);
  };

  const optionsBots = bots?.map((bot) => {
    console.log("data:", bot);
    return {
      value: bot.uuid_unique,
      label: (
        <HStack>
          <Text>{bot.name}</Text>
        </HStack>
      ),
    };
  });

  const optionsStatus = [
    {
      value: "1",
      label: (
        <HStack>
          <Image src={active} alt="activated" />
          <Text>{t("campaigns.activated")}</Text>
        </HStack>
      ),
    },
    {
      value: "0",
      label: (
        <HStack>
          <Image src={disable} alt="inactivated" />
          <Text>{t("campaigns.inactivated")}</Text>
        </HStack>
      ),
    },
  ];

  return (
    <>
      <AppShell>
        <Container
          minHeight="100vh"
          maxW="full"
          h={"full"}
          display={"flex"}
          flexDirection={"column"}
          paddingX={{ base: 0, md: 4 }}
          gap={8}
        >
          <HStack spacing={2}>
            <Icon
              as={ArrowLeft}
              onClick={() => router.back()}
              cursor={"pointer"}
              color={bgColor}
              w={"24px"}
              h={"24px"}
            />
            <Text fontSize={32} fontWeight="700">
              {t("nps.edit.title")}
            </Text>
          </HStack>
          <Box
            bg={panelBgColor}
            p={{ base: 4, md: 16 }}
            rounded="20px"
            boxShadow="lg"
          >
            <VStack spacing={14}>
              <VStack spacing={6} w="full">
                <HStack
                  spacing={8}
                  w={"full"}
                  flexDirection={{ base: "column", md: "row" }}
                >
                  <FormControl id="name">
                    <FormLabel>{t("nps.edit.name")}</FormLabel>
                    <Input
                      placeholder={t("nps.edit.namePlaceholder")}
                      value={formData.name}
                      bg={backgroundColor}
                      onChange={handleChange}
                      focusBorderColor={bgColor}
                      border={".5px"}
                    />
                  </FormControl>
                  <FormControl id="bot">
                    <FormLabel>{t("nps.edit.selectBot")}</FormLabel>
                    <Select
                      isSearchable={false}
                      onChange={handleFilterByBot}
                      options={optionsBots}
                      placeholder={t("nps.filterByBot")}
                      defaultValue={optionsBots[0]}
                      chakraStyles={{
                        container: (provided) => ({
                          ...provided,
                          borderRadius: "5px",
                          background: panelBgColor,
                          cursor: "pointer",
                          width: "100%",
                          paddingRight: { base: "0px", md: "20px" },
                        }),
                        dropdownIndicator: (provided) => ({
                          ...provided,
                          color: bgColor,
                          width: "20px",
                          background: panelBgColor,
                        }),
                        control: (provided) => ({
                          ...provided,
                          borderRadius: "5px",
                          _focus: {
                            borderColor: bgColor,
                          },
                          _focusVisible: {
                            boxShadow: `0 0 0 1px ${bgColor}`,
                          },
                        }),
                        inputContainer: (provided) => ({
                          ...provided,
                          width: "150px",
                        }),
                        menuList: (provided) => ({
                          ...provided,
                          width: "max-content",
                        }),
                      }}
                    />
                  </FormControl>
                </HStack>
                <HStack spacing={8} w={"full"}>
                  <FormControl id="state">
                    <FormLabel>{t("nps.edit.state")}</FormLabel>
                    <Select
                      isSearchable={false}
                      options={optionsStatus}
                      placeholder={t("users.filterByStatus")}
                      onChange={(option) =>
                        setStatusFilter(option?.value || null)
                      }
                      defaultValue={optionsStatus[0]}
                      chakraStyles={{
                        container: (provided) => ({
                          ...provided,
                          borderRadius: 20,
                          background: panelBgColor,
                          cursor: "pointer",
                          width: { base: "100%", md: "50%" },
                          pr: { base: "0px", md: "20px" },
                        }),
                        dropdownIndicator: (provided) => ({
                          ...provided,
                          color: bgColor,
                          width: "20px",
                          background: panelBgColor,
                        }),
                        control: (provided) => ({
                          ...provided,
                          borderRadius: "5px",
                          _focus: {
                            borderColor: bgColor,
                          },
                          _focusVisible: {
                            boxShadow: `0 0 0 1px ${bgColor}`,
                          },
                        }),
                        inputContainer: (provided) => ({
                          ...provided,
                          width: "150px",
                        }),
                      }}
                    />
                  </FormControl>
                </HStack>
              </VStack>
              <VStack spacing={6} w="full" alignItems={"start"}>
                <Text fontSize={"18px"} fontWeight={"bold"} w={"full"}>
                  {t("nps.edit.questions")}
                </Text>
                {questions.map((q, index) => (
                  <HStack
                    spacing={{ base: 4, md: 8 }}
                    w={"full"}
                    justifyContent={"center"}
                    key={index}
                    flexDirection={{ base: "column", md: "row" }}
                  >
                    <FormControl id={`question-${index}`}>
                      <FormLabel>{`${t("nps.edit.question")} ${index + 1
                        }`}</FormLabel>
                      <Input
                        placeholder={t("nps.edit.question")}
                        value={q.question}
                        bg={backgroundColor}
                        onChange={(e) =>
                          handleQuestionChange(
                            index,
                            "question",
                            e.target.value
                          )
                        }
                        focusBorderColor={bgColor}
                        border={".5px"}
                      />
                    </FormControl>
                    <FormControl id={`type-${index}`}>
                      <FormLabel w={"full"}>{t("nps.edit.type")}</FormLabel>
                      <HStack spacing={6}>
                        <Select
                          isSearchable={false}
                          placeholder={t("nps.edit.typePlaceholder")}
                          chakraStyles={{
                            container: (provided) => ({
                              ...provided,
                              borderRadius: "5px",
                              background: panelBgColor,
                              cursor: "pointer",
                              width: "100%",
                              paddingRight: { base: "0px", md: "20px" },
                            }),
                            dropdownIndicator: (provided) => ({
                              ...provided,
                              color: bgColor,
                              width: "20px",
                              background: panelBgColor,
                            }),
                            control: (provided) => ({
                              ...provided,
                              borderRadius: "5px",
                              _focus: {
                                borderColor: bgColor,
                              },
                              _focusVisible: {
                                boxShadow: `0 0 0 1px ${bgColor}`,
                              },
                            }),
                            inputContainer: (provided) => ({
                              ...provided,
                              width: "150px",
                            }),
                            menuList: (provided) => ({
                              ...provided,
                              width: "max-content",
                            }),
                          }}
                        />
                        <Icon
                          as={X}
                          width={"24px"}
                          height={"24px"}
                          color={bgColor}
                          onClick={() => handleRemoveQuestion(index)}
                          cursor={"pointer"}
                        />
                      </HStack>
                    </FormControl>
                  </HStack>
                ))}
                <HStack
                  w={"full"}
                  justifyContent={"space-between"}
                  mt={4}
                  flexDirection={{ base: "column", md: "row" }}
                >
                  <Button
                    variant={"outline"}
                    borderColor={bgColor}
                    _hover={{ bg: hoverColor, color: "white" }}
                    className="group"
                    onClick={handleAddQuestion}
                    w={{ base: "full", md: "auto" }}
                    rightIcon={
                      <Icon
                        as={Plus}
                        color={bgColor}
                        _groupHover={{
                          color: "white",
                        }}
                        width={"24px"}
                        height={"24px"}
                      />
                    }
                  >
                    {t("nps.edit.addNewQuestion")}
                  </Button>
                  <Button
                    bg={bgColor}
                    _hover={{
                      bg: hoverColor,
                    }}
                    color={"white"}
                    w={{ base: "full", md: "auto" }}
                    onClick={handleSubmit}
                  >
                    {t("nps.edit.keep")}
                  </Button>
                </HStack>
              </VStack>
            </VStack>
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

export default withTranslation("common")(EditNps);
