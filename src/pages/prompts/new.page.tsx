/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  VStack,
  HStack,
  Text,
  Heading,
  Textarea,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Spinner,
  Icon,
  useToken,
} from "@chakra-ui/react";
import { AppShell } from '@component/components/layout'
import { useAuthStore } from "@component/store/auth";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { withTranslation } from "react-i18next";
import { Select } from "chakra-react-select";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@component/store";
import { companiesGet } from "@component/store/companySlice";
import { GetBotsByCompany } from "@component/store/botsSlice";
import { useRouter } from "next/router";
import { CheckCircle } from "@untitled-ui/icons-react";
import useCoftechColors from "@component/hooks/useCoftechColors";
import PromptChatTest from "@component/components/PromptChatTest";
import PromptEdit_Create from "@component/components/PromptCreate_Edit";
import useCoftechSelect from "@component/hooks/useCoftechSelect";
import useErrorHandler from "@component/hooks/useErrorHandler";

const Prompt = ({ t }) => {
  const router = useRouter();
  const dispatch: AppDispatch = useDispatch();
  const { user } = useAuthStore();


  const [responseText, setResponseText] = useState("");
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [selectedBot, setSelectedBot] = useState(null);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const { companies, error: companiesError } = useSelector(
    (state: any) => state.company
  );
  const { bots, loading: loadingBots, error: botsError } = useSelector((resp: any) => resp.bots);
  const { handleError } = useErrorHandler();

  const {
    bgColor,
    hoverColor,
    backgroundColor,
    borderColor,
  } = useCoftechColors();

  const {
    style
  } = useCoftechSelect();

  const [accentColor] = useToken('colors', [bgColor]);

  useEffect(() => {
    if (user?.rol_key === "SUPERADMIN") {
      dispatch(companiesGet());
    } else if (user?.company_id) {
      //@ts-ignore
      dispatch(GetBotsByCompany(user?.company_id));
      setSelectedCompany({ value: user?.company_id });
    }
  }, [dispatch, user?.company_id, user?.rol_key]);

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
    if (user?.rol_key === "SUPERADMIN" && selectedCompany) {
      //@ts-ignore
      dispatch(GetBotsByCompany(selectedCompany.value));
      setSelectedBot(null)
    }
  }, [dispatch, user?.rol_key, selectedCompany]);

  const optionsCompanies = companies.map((company) => {
    return {
      value: company.uuid_unique,
      label: (
        <HStack>
          <Text>{company.name}</Text>
        </HStack>
      ),
    };
  });

  const optionsBots = bots.map((bot) => {
    return {
      value: bot.uuid_unique,
      label: (
        <HStack>
          <Text>{bot.name}</Text>
        </HStack>
      ),
    };
  });

  return (
    <AppShell
      onBackButtonClick={() => router.back()}
      showBackButton={true}
      title={t("prompt.title")}
    >
      <Box p={{ base: 0, md: 4 }} minH="100vh">
        <HStack
          mb={12}
          marginY={4}
          justifyContent={"start"}
          flexWrap={{ base: "wrap" }}
        >
          <HStack mr={"auto"}>
            {user?.rol_key === "SUPERADMIN" && (
              <VStack alignItems="start" w={{ base: "100%", md: "auto" }}>
                <Heading size="sx">{t("prompt.selectCompany")}</Heading>
                <Select
                  isSearchable={false}
                  onChange={(option) => {
                    setSelectedCompany(option);
                    //@ts-ignore
                    dispatch(GetBotsByCompany(option.value));
                  }}
                  options={optionsCompanies}
                  placeholder={t("prompt.selectCompany")}
                  focusBorderColor={bgColor}
                  chakraStyles={style}
                />
              </VStack>
            )}

            <VStack alignItems="start" w={{ base: "100%", md: "auto" }}>
              <Heading size="sx">{t("prompt.selectBot")}</Heading>
              {loadingBots ? (
                <Spinner color={bgColor} size="lg" />
              ) : (
                <Select
                  isSearchable={false}
                  onChange={(option) => setSelectedBot(option)}
                  options={optionsBots}
                  placeholder={t("prompt.selectBot")}
                  isDisabled={!selectedCompany && user?.rol_key === "SUPERADMIN"}
                  focusBorderColor={bgColor}
                  chakraStyles={style}
                />
              )}
            </VStack>
          </HStack>
          <Button
            px={"50px"}
            borderRadius={"15px"}
            color={accentColor}
            bgColor={backgroundColor}
            border={`1px solid ${accentColor}`}
            _hover={{
              color: "white",
              bgColor: accentColor
            }}
            onClick={() => {
              router.push("/prompts/history")
            }}
          >
            {t("prompt.history")}
          </Button>
        </HStack>

        <HStack
          spacing={34}
          flexDirection={{ base: "column", md: "column", lg: "row" }}
        >
          <PromptEdit_Create
            tran={t}
            prompt={undefined}
            responseText={responseText}
            setTestPrompt={() => {}}
            selectedBot={selectedBot}
            selectedCompany={selectedCompany?.value}
            setIsConfirmationOpen={setIsConfirmationOpen}
          />

          <PromptChatTest
            tran={t}
            selectedBot={selectedBot}
            prompt={false}
            selectedCompany={selectedCompany?.value}
            testPrompt={""}
            setResponseText={setResponseText}
          />
        </HStack>
      </Box>

      <Modal
        isOpen={isConfirmationOpen}
        onClose={() => setIsConfirmationOpen(false)}
        isCentered
        variant="coftechModal"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign="center" mt={4}></ModalHeader>
          <ModalCloseButton />
          <ModalBody textAlign="center">
            <Box display="flex" justifyContent="center">
              <Icon as={CheckCircle} color={bgColor} fontSize={"4xl"} mb={2} />
            </Box>
            <Text fontSize="xl" fontWeight={600} mb={4}>
              {t("prompt.created")}
            </Text>

            <Button
              bg={bgColor}
              color="white"
              _hover={{
                bg: hoverColor,
              }}
              onClick={() => {
                setIsConfirmationOpen(false);
                router.push("/prompts");
              }}
              borderRadius={"md"}
              w={"100%"}
            >
              {t("modal.continue")}
            </Button>
          </ModalBody>
          <ModalFooter />
        </ModalContent>
      </Modal>
    </AppShell>
  );
};

export const getStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common"])),
  },
});

export default withTranslation("common")(Prompt);
