/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  VStack,
  HStack,
  Text,
  Heading,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Spinner,
  Icon,
  useDisclosure,
  useToken,
} from "@chakra-ui/react";
import { AppShell } from '@component/components/layout'
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { withTranslation } from "react-i18next";
import { Select } from "chakra-react-select";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@component/store";
import { GetBotsByCompany } from "@component/store/botsSlice";
import { useRouter } from "next/router";
import { CheckCircle } from "@untitled-ui/icons-react";
import useCoftechColors from "@component/hooks/useCoftechColors";
import PromptEdit_Create from "@component/components/PromptCreate_Edit";
import PromptChatTest from "@component/components/PromptChatTest";
import useCoftechSelect from "@component/hooks/useCoftechSelect";
import { useLazyGetPromptsQuery } from "@component/store/RTK/promptsRTK";
import useErrorHandler from "@component/hooks/useErrorHandler";

const EditPrompt = ({ t }) => {
  const router = useRouter();
  const { handleError } = useErrorHandler();
  const { promptId, companyId, botId } = router.query;
  const dispatch: AppDispatch = useDispatch();
  const [responseText, setResponseText] = useState("");
  const [testPrompt, setTestPrompt] = useState<string>("")
  const [selectedBot, setSelectedBot] = useState(null);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [currentPrompt, setCurrentPrompt] = useState<any>();
  const [triggerPrompts, { data: prompts, error: promptsError }] = useLazyGetPromptsQuery();
  const { bots, loading: loadingBots, error: botsError } = useSelector((resp: any) => resp.bots);

  const {
    bgColor,
    hoverColor,
    backgroundColor,
  } = useCoftechColors();

  const {
    style
  } = useCoftechSelect();

  useEffect(() => {
    if (companyId) {
      //@ts-ignore
      dispatch(GetBotsByCompany(companyId));
    }
  }, [dispatch, companyId]);

  useEffect(() => {
    if (botId) {
      triggerPrompts({ companyID: companyId, botID: botId });
    }
  }, [botId])

  useEffect(() => {
    if (botsError.message.length > 1) {
      handleError(botsError)
    }
  }, [botsError])

  useEffect(() => {
    if (promptsError) {
      handleError(promptsError, { companyID: companyId, botID: botId })
    }
  }, [promptsError])

  useEffect(() => {
    if (promptId && prompts && prompts.data?.length > 0) {
      const prompt = prompts.data.find((p) => p.uuid_unique === promptId);
      if (prompt) {
        setCurrentPrompt({
          id: prompt.uuid_unique,
          name: prompt.name,
          data: prompt.data,
          company: prompt.company_id,
          bot: prompt.bot_id,
          status: prompt.status
        })
        setResponseText(prompt.data);
        setSelectedBot({ value: prompt.bot_id, label: prompt.bot_name });
      }
    }
  }, [promptId, prompts]);

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

  const [accentColor] = useToken('colors', [bgColor]);

  return (
    <AppShell
      title={t("prompt.editTitle")}
      onBackButtonClick={() => router.back()}
      showBackButton={true}
    >
      <Box p={{ base: 0, md: 4 }} minH="100vh">

        <HStack mb={12} flexWrap={{ base: "wrap" }} w={"full"} gap={"16px"}>
          <VStack alignItems="start" w={{ base: "100%", md: "auto" }}>
            <Heading size="sx">{t("prompt.selectBot")}</Heading>
            {loadingBots ? (
              <Spinner color={bgColor} size="lg" />
            ) : (
              <Select
                isSearchable={false}
                value={selectedBot}
                onChange={(option) => setSelectedBot(option)}
                isDisabled
                options={optionsBots}
                placeholder={t("prompt.selectBot")}
                chakraStyles={style}
              />
            )}
          </VStack>
          <Button
            px={"50px"}
            borderRadius={"15px"}
            color={accentColor}
            bgColor={backgroundColor}
            border={`1px solid ${accentColor}`}
            ml={"auto"}
            _hover={{
              color: "white",
              bgColor: accentColor
            }}
            onClick={() => {
              router.push(`/prompts/${companyId}/${botId}/history`)
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
            prompt={currentPrompt}
            responseText={responseText}
            setTestPrompt={setTestPrompt}
            selectedBot={selectedBot}
            selectedCompany={currentPrompt?.company}
            setIsConfirmationOpen={setIsConfirmationOpen}
          />

          <PromptChatTest
            tran={t}
            prompt={true}
            selectedBot={selectedBot}
            testPrompt={testPrompt}
            setResponseText={setResponseText}
            selectedCompany={currentPrompt?.company}
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
              {t("modal.changesSavedSuccess")}
            </Text>

            <Button
              bg={bgColor}
              color="white"
              _hover={{
                bg: hoverColor,
              }}
              onClick={() => {
                setIsConfirmationOpen(false);
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

export const getStaticPaths = ({ locales }) => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export default withTranslation("common")(EditPrompt);
