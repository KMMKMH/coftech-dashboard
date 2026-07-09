import React, { useState } from "react";
import {
  Box,
  HStack,
  Avatar,
  Text,
  Flex,
  Heading,
  useTheme,
  VStack,
  Button,
  Progress,
  Container,
  Textarea,
  Input,
  Radio,
  RadioGroup,
  Stack,
  Select as ChakraSelect,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from "@chakra-ui/react";
import {
  AlertTriangle,
  ArrowSquareLeft,
  File05,
} from "@untitled-ui/icons-react";
import { AppShell } from '@component/components/layout'
import { useAuthStore } from "@component/store/auth";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { withTranslation } from "react-i18next";
import Image from "next/image";
import { useRouter } from "next/router";
import { Select } from "chakra-react-select";
import BotImage from "@component/assets/images/bot.svg";
import ActiveImage from "@component/assets/images/active.svg";
import InactiveImage from "@component/assets/images/disable.svg";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import useCoftechColors from "@component/hooks/useCoftechColors";

const CreateCampaign = ({ t }) => {
  const { user } = useAuthStore();
  const router = useRouter();

  const [message, setMessage] = useState("");
  const [endDate, setEndDate] = useState(new Date());
  const [activeDay, setActiveDay] = useState(null);

  const handleInsertText = (text) => {
    setMessage((prev) => `${prev} ${text}`);
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

  const handleDateChange = (date) => {
    if (Array.isArray(date)) {
      setEndDate(date[0]);
    } else {
      setEndDate(date);
    }
  };

  const optionsBot = [
    {
      value: "Bot1",
      label: (
        <HStack>
          <Image src={BotImage} alt="Bot1" width={24} height={24} />
          <Text>Bot1</Text>
        </HStack>
      ),
    },
    {
      value: "Bot2",
      label: (
        <HStack>
          <Image src={BotImage} alt="Bot2" width={24} height={24} />
          <Text>Bot2</Text>
        </HStack>
      ),
    },
    {
      value: "Bot3",
      label: (
        <HStack>
          <Image src={BotImage} alt="Bot3" width={24} height={24} />
          <Text>Bot3</Text>
        </HStack>
      ),
    },
  ];

  const optionsStatus = [
    {
      value: "activated",
      label: (
        <HStack>
          <Image src={ActiveImage} alt="activated" />
          <Text>{t("campaigns.activated")}</Text>
        </HStack>
      ),
    },
    {
      value: "inactivated",
      label: (
        <HStack>
          <Image src={InactiveImage} alt="inactivated" />
          <Text>{t("campaigns.inactivated")}</Text>
        </HStack>
      ),
    },
  ];

  const optionsContactbase = [
    {
      value: "contactbase1",
      label: "Contactbase 1",
    },
    {
      value: "contactbase2",
      label: "Contactbase 2",
    },
    {
      value: "contactbase3",
      label: "Contactbase 3",
    },
  ];

  const options = [
    { value: "week", label: t("campaigns.createCampaign.week") },
    { value: "month", label: t("campaigns.createCampaign.month") },
  ];

  return (
    <>
      <AppShell
        title={t("campaigns.createCampaign.title")}
        showBackButton={true}
        onBackButtonClick={() => router.push("/campaigns")}
      >
        <Container
          maxW="full"
          padding={"48px 32px"}
          display={"flex"}
          flexDirection={"column"}
          gap={"40px"}
        >
          <HStack w={"full"} gap={"25px"} alignItems={"stretch"}>
            <VStack
              padding={"40px"}
              gap={"20px"}
              align={"flex-start"}
              background={panelBgColor}
              borderRadius={20}
              w={"full"}
              flex={1}
              minH={"full"}
            >
              <Text fontSize={18} fontWeight={700}>
                {t("campaigns.createCampaign.message")}
              </Text>
              <Text fontSize={16} fontWeight={500}>
                {t("campaigns.createCampaign.insertVariable")}
              </Text>
              <HStack gap={"12px"}>
                <Button
                  borderColor={bgColor}
                  borderWidth={1}
                  onClick={() => handleInsertText("${name}")}
                >
                  {t("campaigns.createCampaign.name")}
                </Button>
                <Button
                  borderColor={bgColor}
                  borderWidth={1}
                  onClick={() => handleInsertText("${number}")}
                >
                  {t("campaigns.createCampaign.number")}
                </Button>
                <Button
                  borderColor={bgColor}
                  borderWidth={1}
                  onClick={() => handleInsertText("${item}")}
                >
                  {t("campaigns.createCampaign.item")}
                </Button>
              </HStack>
              <Textarea
                h={"650px"}
                py={"20px"}
                placeholder={t("campaigns.createCampaign.writeMessage")}
                background={backgroundColor}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <VStack align={"flex-start"} w={"full"}>
                <Text fontSize={14} fontWeight={500}>
                  {t("campaigns.createCampaign.numberForTesting")}
                </Text>
                <Input
                  placeholder="+43 424 242 456"
                  background={backgroundColor}
                />
              </VStack>
              <Button
                w={"full"}
                borderColor={bgColor}
                color={bgColor}
                _hover={{ bg: hoverColor, color: "white" }}
                borderWidth={1}
              >
                {t("campaigns.createCampaign.testMessage")}
              </Button>
            </VStack>
            <VStack
              padding={"40px"}
              gap={"40px"}
              align={"flex-start"}
              justifyContent={"space-between"}
              background={panelBgColor}
              borderRadius={20}
              w={"full"}
              flex={1}
              minH={"full"}
            >
              <VStack gap={"40px"} w={"full"}>
                <VStack align={"flex-start"} w={"full"}>
                  <Text fontSize={14} fontWeight={500}>
                    {t("campaigns.createCampaign.campaignName")}
                  </Text>
                  <Input
                    placeholder={t(
                      "campaigns.createCampaign.campaignNamePlaceholder"
                    )}
                    background={backgroundColor}
                  />
                </VStack>
                <VStack align={"flex-start"} w={"full"}>
                  <Text fontSize={14} fontWeight={500}>
                    {t("campaigns.createCampaign.selectBot")}
                  </Text>
                  <Select
                    options={optionsBot}
                    placeholder={t(
                      "campaigns.createCampaign.selectBotPlaceholder"
                    )}
                    chakraStyles={{
                      container: (provided) => ({
                        ...provided,
                        background: backgroundColor,
                        cursor: "pointer",
                        w: "full",
                        borderRadius: "5px",
                      }),
                      dropdownIndicator: (provided) => ({
                        ...provided,
                        color: bgColor,
                        width: "20px",
                        background: backgroundColor,
                      }),
                    }}
                  />
                </VStack>
                <VStack align={"flex-start"} w={"full"}>
                  <Text fontSize={14} fontWeight={500}>
                    {t("campaigns.createCampaign.whenSent")}
                  </Text>
                  <VStack
                    alignItems={"start"}
                    borderColor={inputBorderColor}
                    borderWidth={1}
                    background={backgroundColor}
                    borderRadius={"8px"}
                    padding={"10px 14px"}
                    w={"full"}
                    gap={"24px"}
                  >
                    <Text fontSize={16} fontWeight={500}>
                      {t("campaigns.createCampaign.whenSentPlaceholder")}
                    </Text>
                    <HStack gap={"10px"} w={"full"}>
                      <HStack>
                        <Text>
                          {t("campaigns.createCampaign.alwaysRepeat")}
                        </Text>
                        <NumberInput>
                          <NumberInputField w={20} />
                          <NumberInputStepper w={5}>
                            <NumberIncrementStepper color={bgColor} />
                            <NumberDecrementStepper color={bgColor} />
                          </NumberInputStepper>
                        </NumberInput>
                      </HStack>
                      <Select
                        options={options}
                        placeholder={t(
                          "campaigns.createCampaign.whenSentPlaceholder"
                        )}
                        chakraStyles={{
                          container: (provided) => ({
                            ...provided,
                            background: panelBgColor,
                            cursor: "pointer",
                          }),
                          dropdownIndicator: (provided) => ({
                            ...provided,
                            color: bgColor,
                            width: "20px",
                            background: panelBgColor,
                          }),
                        }}
                      />
                    </HStack>
                    <VStack alignItems={"start"} gap={"20px"}>
                      <Text>{t("campaigns.createCampaign.repeatDays")}</Text>
                      <HStack gap={"10px"}>
                        {["L", "M", "M", "J", "V", "S", "D"].map(
                          (day, index) => (
                            <Button
                              key={index}
                              w={"40px"}
                              h={"40px"}
                              borderRadius={"100px"}
                              bg={activeDay === index ? bgColor : "gray.100"}
                              color={activeDay === index ? "white" : "black"}
                              _hover={{
                                bg:
                                  activeDay === index ? hoverColor : "gray.300",
                              }}
                              onClick={() => setActiveDay(index)}
                            >
                              {day}
                            </Button>
                          )
                        )}
                      </HStack>
                    </VStack>
                    <VStack alignItems={"start"} w={"full"}>
                      <Text>{t("campaigns.createCampaign.ends")}</Text>
                      <RadioGroup w={"full"}>
                        <Stack direction="column" gap={"12px"}>
                          <Radio value="1" size={"lg"}>
                            {t("campaigns.createCampaign.never")}
                          </Radio>
                          <HStack gap={"100px"}>
                            <Radio value="2" size={"lg"}>
                              {t("campaigns.createCampaign.and")}
                            </Radio>
                            <DatePicker
                              selected={endDate}
                              onChange={handleDateChange}
                              customInput={<Input w={"130px"} />}
                            />
                          </HStack>
                          <HStack gap={"60px"}>
                            <Radio value="3" size={"lg"}>
                              {t("campaigns.createCampaign.after")}
                            </Radio>
                            <HStack>
                              <NumberInput>
                                <NumberInputField w={20} />
                                <NumberInputStepper w={5}>
                                  <NumberIncrementStepper color={bgColor} />
                                  <NumberDecrementStepper color={bgColor} />
                                </NumberInputStepper>
                              </NumberInput>
                              <Text>
                                {t("campaigns.createCampaign.occurrences")}
                              </Text>
                            </HStack>
                          </HStack>
                        </Stack>
                      </RadioGroup>
                    </VStack>
                  </VStack>
                </VStack>
                <VStack align={"flex-start"} w={"full"}>
                  <Text fontSize={14} fontWeight={500}>
                    {t("campaigns.createCampaign.state")}
                  </Text>
                  <Select
                    options={optionsStatus}
                    placeholder={t("campaigns.createCampaign.statePlaceholder")}
                    chakraStyles={{
                      container: (provided) => ({
                        ...provided,
                        background: backgroundColor,
                        w: "full",
                        cursor: "pointer",
                        borderRadius: "5px",
                      }),
                      dropdownIndicator: (provided) => ({
                        ...provided,
                        color: bgColor,
                        width: "20px",
                        background: backgroundColor,
                      }),
                    }}
                  />
                </VStack>
                <VStack align={"flex-start"} w={"full"}>
                  <Text fontSize={14} fontWeight={500}>
                    {t("campaigns.createCampaign.selectContactbase")}
                  </Text>
                  <Select
                    options={optionsContactbase}
                    placeholder={t(
                      "campaigns.createCampaign.selectContactbasePlaceholder"
                    )}
                    chakraStyles={{
                      container: (provided) => ({
                        ...provided,
                        background: backgroundColor,
                        cursor: "pointer",
                        w: "full",
                        borderRadius: "20px",
                      }),
                      dropdownIndicator: (provided) => ({
                        ...provided,
                        color: bgColor,
                        width: "20px",
                        background: backgroundColor,
                      }),
                    }}
                  />
                </VStack>
              </VStack>
              <HStack w={"full"} gap={"24px"}>
                <Button
                  w={"full"}
                  borderColor={bgColor}
                  color={bgColor}
                  _hover={{ bg: hoverColor, color: "white" }}
                  borderWidth={1}
                >
                  {t("campaigns.createCampaign.keep")}
                </Button>
                <Button
                  w={"full"}
                  bg={bgColor}
                  color={"white"}
                  _hover={{
                    bg: hoverColor,
                  }}
                >
                  {t("campaigns.createCampaign.toSend")}
                </Button>
              </HStack>
            </VStack>
          </HStack>
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

export default withTranslation("common")(CreateCampaign);
