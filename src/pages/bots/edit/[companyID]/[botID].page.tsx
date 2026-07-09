/* eslint-disable react-hooks/exhaustive-deps */
import {
  Box,
  Button,
  Container,
  FormControl,
  FormErrorMessage,
  IconButton,
  Input,
  Stack,
  Text,
  Textarea,
  useColorModeValue,
  useDisclosure,
  useToast,
  useToken,
  VStack,
  WrapItem,
} from "@chakra-ui/react";
import { FiEdit } from "react-icons/fi";
import { AppShell } from '@component/components/layout'
import { GetBotsByCompany } from "@component/store/botsSlice";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useTranslation, withTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import Loading from "@component/components/Loading";
import StatusAvatar from "@component/components/StatusAvatar";
import useCoftechColors from "@component/hooks/useCoftechColors";
import { useError } from "@component/utils/errorContext";
import { useUpdateBotMutation } from "@component/store/RTK/botsRTK";
import { BOT } from "@component/constants/bot";
import { ERROR } from "@component/constants/error";

const validationConfig = {
  name: {
    required: true,
    message: `editBot.errorName`,
  },
  description: {
    required: false,
    message: "",
  },
  photo: {
    required: false,
    message: "",
  },
};

const validateForm = (formValues, setErrors) => {
  let valid = true;
  const newErrors = {};

  Object.keys(validationConfig).forEach((key) => {
    const { required, message } = validationConfig[key];

    if (required && !formValues[key]) {
      newErrors[key] = message;
      valid = false;
    }
  });

  setErrors(newErrors);

  return valid;
};

interface FormState {
  name: string;
  description: string;
  photo: any;
}

const Edit = () => {
  const toast = useToast();
  const { showError } = useError();
  const { t } = useTranslation(BOT.COMMON);
  const router = useRouter();
  const { botID, companyID } = router.query;
  const [currentBot, setCurrentBot] = useState<any>();
  const dispatch = useDispatch();
  const { bots, loading, error: botsError } = useSelector((state: any) => state.bots);
  const [triggerUpdate] = useUpdateBotMutation()

  useEffect(() => {
    //@ts-ignore
    dispatch(GetBotsByCompany(companyID))
  }, [])

  useEffect(() => {
    setCurrentBot(bots.filter((bot) => {
      if (bot.uuid_unique === botID) {
        return bot
      }
    })[0])
  }, [bots])

  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>(
    {}
  );
  const [formValues, setFormValues] = useState<FormState>({
    name: "",
    description: "",
    photo: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    description: "",
    photo: "",
  });

  const [saveChanges, setSaveChanges] = useState<boolean>(false);
  const [photo, setPhoto] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const {
    bgColor,
    lightAccent,
    hoverColor,
    panelBgColor,
    backgroundColor,
  } = useCoftechColors();

  useEffect(() => {
    if (botsError.message.length > 1) {
      showError(botsError.message)
    }
  }, [botsError])

  const onChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveChanges = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!validateForm(formValues, setErrors)) {
      setLoadingStates((prev) => ({ ...prev, saveChanges: false }));
      return;
    }

    setLoadingStates((prev) => ({ ...prev, saveChanges: true }));
    try {
      await triggerUpdate({ uuid: currentBot.uuid_unique, companyID: currentBot.company_id, data: formValues }).unwrap()
      setSaveChanges(true);
      toast({
        title: t("editBot.success"),
        status: BOT.TOAST.STATUS.SUCCESS,
        duration: BOT.TOAST.DURATION,
        isClosable: BOT.TOAST.IS_CLOSABLE,
      });
    } catch (error) {
      setLoadingStates((prev) => ({ ...prev, saveChanges: false }));
      if (error.status === ERROR.BAD_REQUEST || error.status === ERROR.UNEXPECTED_ERROR) {
        showError(error.data?.message)
      } else {
        showError(error.error)
      }
    } finally {
      setLoadingStates((prev) => ({ ...prev, saveChanges: false }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (BOT.AVATAR_ALLOWED_TYPES.includes(file.type)) {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64String = reader.result as string;
          setFormValues((prev) => ({ ...prev, photo: base64String }));
          setSelectedImage(base64String);
        };
        reader.readAsDataURL(file);
      } else {
        if (!(toast.isActive(BOT.TOAST.ID.A))) {
          toast({
            id: BOT.TOAST.ID.A,
            title: t("recovery.error"),
            description: t("bots.profilePictureType"),
            status: BOT.TOAST.STATUS.SUCCESS,
            duration: BOT.TOAST.DURATION,
            isClosable: BOT.TOAST.IS_CLOSABLE,
          })
        }
      }
    }
  };

  useEffect(() => {
    if (saveChanges) {
      //@ts-ignore
      dispatch(GetBotsByCompany(currentBot.company_id));
      setSaveChanges(false);
    }
  }, [dispatch, saveChanges]);

  useEffect(() => {
    if (currentBot) {
      const bot = currentBot;
      setFormValues({
        name: bot.name || "",
        description: bot.description || "",
        photo: bot.photo || "",
      });
      setSelectedImage(bot.photo || "");
      setPhoto(bot.photo || "");
    }
  }, [currentBot]);

  return (
    <>
      <AppShell
        title={t("editBot.editBot")}
        showBackButton={BOT.EDIT.BACK_BUTTON}
        onBackButtonClick={() => router.back()}
      >
        <Container
          maxW={BOT.EDIT.MAX_WIDTH}
          padding={BOT.EDIT.PADDING}
          display={BOT.EDIT.DISPLAY}
          flexDirection={BOT.EDIT.DIRECTION}
          gap={BOT.EDIT.GAP}
        >
          {currentBot && !loading ? (
            <VStack
              marginY={BOT.EDIT.PANEL.MARGIN_Y}
              padding={BOT.EDIT.PANEL.PADDING}
              gap={BOT.EDIT.PANEL.GAP}
              align={BOT.EDIT.PANEL.ALIGN}
              justifyContent={BOT.EDIT.PANEL.JUSTIFY.CONTENT}
              background={panelBgColor}
              borderRadius={BOT.EDIT.PANEL.BORDER.RADIUS}
              w={BOT.EDIT.PANEL.WIDTH}
              flex={BOT.EDIT.PANEL.FLEX}
              minH={BOT.EDIT.PANEL.MIN_HEIGHT}
            >
              <Box width={BOT.EDIT.CHOOSE_AVATAR.WIDTH}>
                <WrapItem justifyContent={BOT.EDIT.CHOOSE_AVATAR.JUSTIFY.CONTENT}>
                  <StatusAvatar
                    size={BOT.EDIT.CHOOSE_AVATAR.AVATAR.SIZE}
                    name={BOT.EDIT.CHOOSE_AVATAR.AVATAR.NAME}
                    src={selectedImage || photo}
                    status={currentBot?.suspended ? BOT.EDIT.CHOOSE_AVATAR.AVATAR.SUSPENDED : BOT.EDIT.CHOOSE_AVATAR.AVATAR.ACTIVATED}
                  />
                  <Box
                    display={BOT.EDIT.CHOOSE_AVATAR.BUTTON.DISPLAY}
                    alignItems={BOT.EDIT.CHOOSE_AVATAR.BUTTON.ALIGN.ITEMS}
                    justifyContent={BOT.EDIT.CHOOSE_AVATAR.BUTTON.JUSTIFY.CONTENT}
                    backgroundColor={BOT.EDIT.CHOOSE_AVATAR.BUTTON.BACKGROUND}
                    position={BOT.EDIT.CHOOSE_AVATAR.BUTTON.POSITION}
                    top={BOT.EDIT.CHOOSE_AVATAR.BUTTON.TOP}
                    width={BOT.EDIT.CHOOSE_AVATAR.BUTTON.WIDTH}
                    borderRadius={BOT.EDIT.CHOOSE_AVATAR.BUTTON.BORDER.RADIUS}
                  >
                    <IconButton
                      aria-label={BOT.EDIT.CHOOSE_AVATAR.BUTTON.ICON.ARIA_LABEL}
                      icon={<FiEdit />}
                      color={panelBgColor}
                      bg={bgColor}
                      _hover={{
                        bg: hoverColor
                      }}
                      position={BOT.EDIT.CHOOSE_AVATAR.BUTTON.ICON.POSITION}
                      bottom={BOT.EDIT.CHOOSE_AVATAR.BUTTON.ICON.BOTTOM}
                      right={BOT.EDIT.CHOOSE_AVATAR.BUTTON.ICON.RIGHT}
                      height={BOT.EDIT.CHOOSE_AVATAR.BUTTON.ICON.HEIGHT}
                      width={BOT.EDIT.CHOOSE_AVATAR.BUTTON.ICON.WIDTH}
                      minW={BOT.EDIT.CHOOSE_AVATAR.BUTTON.ICON.MIN_WIDTH}
                      onClick={() =>
                        document.getElementById(BOT.EDIT.CHOOSE_AVATAR.BUTTON.UPLOAD_ELEMENT.ID).click()
                      }
                    />
                    <Input
                      width={BOT.EDIT.CHOOSE_AVATAR.BUTTON.UPLOAD_ELEMENT.WIDTH}
                      name={BOT.EDIT.CHOOSE_AVATAR.BUTTON.UPLOAD_ELEMENT.NAME}
                      type={BOT.EDIT.CHOOSE_AVATAR.BUTTON.UPLOAD_ELEMENT.TYPE}
                      id={BOT.EDIT.CHOOSE_AVATAR.BUTTON.UPLOAD_ELEMENT.ID}
                      accept={BOT.EDIT.CHOOSE_AVATAR.BUTTON.UPLOAD_ELEMENT.ACCEPTED_FILES}
                      style={BOT.EDIT.CHOOSE_AVATAR.BUTTON.UPLOAD_ELEMENT.STYLE}
                      onChange={handleImageChange}
                    />
                  </Box>
                </WrapItem>
              </Box>
              <Box
                display={BOT.EDIT.FIELDS.DISPLAY}
                flexDirection={BOT.EDIT.FIELDS.DIRECTION}
                width={BOT.EDIT.FIELDS.WIDTH}
                gap={BOT.EDIT.FIELDS.GAP}
              >
                <Box
                  display={BOT.EDIT.FIELDS.FIELD.DISPLAY}
                  flexDirection={BOT.EDIT.FIELDS.FIELD.DIRECTION}
                  gap={BOT.EDIT.FIELDS.FIELD.GAP}
                  as={BOT.EDIT.FIELDS.FIELD.TYPE}
                  width={BOT.EDIT.FIELDS.FIELD.WIDTH}
                  onSubmit={handleSaveChanges}
                >
                  <FormControl
                    width={BOT.EDIT.FIELDS.FIELD.FORM.WIDTH}
                    isInvalid={!!errors.name}
                    display={BOT.EDIT.FIELDS.FIELD.FORM.DISPLAY}
                    flexDirection={BOT.EDIT.FIELDS.FIELD.FORM.DIRECTION}
                    gap={BOT.EDIT.FIELDS.FIELD.FORM.GAP}
                  >
                    <Text>{t("editBot.botName")}</Text>
                    <Input
                      maxLength={BOT.EDIT.FIELDS.FIELD.NAME.MAX_LENGTH}
                      value={formValues.name}
                      name={BOT.EDIT.FIELDS.FIELD.NAME.NAME}
                      onChange={onChange}
                      placeholder={formValues ? "" : t("editBot.botName")}
                      variant={BOT.EDIT.FIELDS.FIELD.INPUT.VARIANT}
                      boxShadow={BOT.EDIT.FIELDS.FIELD.INPUT.SHADOW}
                      border={BOT.EDIT.FIELDS.FIELD.INPUT.BORDER.VALUE}
                      borderRadius={BOT.EDIT.FIELDS.FIELD.INPUT.BORDER.RADIUS}
                      backgroundColor={backgroundColor}
                      _focus={{
                        backgroundColor: backgroundColor,
                        border: `${BOT.EDIT.FIELDS.FIELD.INPUT.FOCUSED.BORDER.VALUE} ${bgColor}`
                      }}
                    />
                    <FormErrorMessage>{t(errors.name)}</FormErrorMessage>
                  </FormControl>


                </Box>
                <Box
                  width={BOT.EDIT.FIELDS.FIELD.WIDTH}
                  display={BOT.EDIT.FIELDS.FIELD.DISPLAY}
                  flexDirection={BOT.EDIT.FIELDS.FIELD.DIRECTION}
                  gap={BOT.EDIT.FIELDS.FIELD.GAP}
                >
                  <FormControl
                    isInvalid={!!errors.description}
                    width={BOT.EDIT.FIELDS.FIELD.FORM.WIDTH}
                    display={BOT.EDIT.FIELDS.FIELD.FORM.DISPLAY}
                    flexDirection={BOT.EDIT.FIELDS.FIELD.FORM.DIRECTION}
                    gap={BOT.EDIT.FIELDS.FIELD.FORM.GAP}
                  >
                    <Text>{t("editBot.description")}</Text>
                    <Textarea
                      maxLength={BOT.EDIT.FIELDS.FIELD.DESCRIPTION.MAX_LENGTH}
                      resize={BOT.EDIT.FIELDS.FIELD.DESCRIPTION.RESIZE}
                      value={formValues.description}
                      name={BOT.EDIT.FIELDS.FIELD.DESCRIPTION.NAME}
                      onChange={onChange}
                      placeholder={formValues ? "" : t("editBot.description")}
                      variant={BOT.EDIT.FIELDS.FIELD.INPUT.VARIANT}
                      height={BOT.EDIT.FIELDS.FIELD.DESCRIPTION.HEIGHT}
                      boxShadow={BOT.EDIT.FIELDS.FIELD.INPUT.SHADOW}
                      border={BOT.EDIT.FIELDS.FIELD.INPUT.BORDER.VALUE}
                      borderRadius={BOT.EDIT.FIELDS.FIELD.INPUT.BORDER.RADIUS}
                      backgroundColor={backgroundColor}
                      _focus={{
                        backgroundColor: backgroundColor,
                        border: `${BOT.EDIT.FIELDS.FIELD.INPUT.FOCUSED.BORDER.VALUE} ${bgColor}`
                      }}
                    ></Textarea>
                    <FormErrorMessage>
                      {t(errors.description)}
                    </FormErrorMessage>
                  </FormControl>
                </Box>
              </Box>
              <Box
                width={BOT.EDIT.BUTTONS.WIDTH}
                display={BOT.EDIT.BUTTONS.DISPLAY}
                flexDirection={BOT.EDIT.BUTTONS.DIRECTION}
                justifyContent={BOT.EDIT.BUTTONS.JUSTIFY.CONTENT}
                gap={BOT.EDIT.BUTTONS.GAP}
              >
                <Button
                  color={lightAccent}
                  width={BOT.EDIT.BUTTONS.DEFAULT.WIDTH}
                  border={BOT.EDIT.BUTTONS.CANCEL.BORDER.VALUE}
                  borderColor={bgColor}
                  borderRadius={BOT.EDIT.BUTTONS.DEFAULT.BORDER.RADIUS}
                  _hover={{ bg: bgColor, color: panelBgColor }}
                  onClick={() => { router.back() }}
                  colorScheme={BOT.EDIT.BUTTONS.DEFAULT.COLOR_SCHEME}
                  variant={BOT.EDIT.BUTTONS.CANCEL.VARIANT}
                  spinnerPlacement={BOT.EDIT.BUTTONS.DEFAULT.SPINNER_PLACEMENT}
                >
                  {t("modal.cancel")}
                </Button>
                <Button
                  type={BOT.EDIT.BUTTONS.SAVE.TYPE}
                  bg={bgColor}
                  color={panelBgColor}
                  width={BOT.EDIT.BUTTONS.DEFAULT.WIDTH}
                  borderRadius={BOT.EDIT.BUTTONS.DEFAULT.BORDER.RADIUS}
                  _hover={{ bg: hoverColor }}
                  onClick={handleSaveChanges}
                  isLoading={loadingStates["saveChanges"] || false}
                  loadingText={t("editBot.savingChanges")}
                  colorScheme={BOT.EDIT.BUTTONS.DEFAULT.COLOR_SCHEME}
                  spinnerPlacement={BOT.EDIT.BUTTONS.DEFAULT.SPINNER_PLACEMENT}
                >
                  {t("editBot.saveChanges")}
                </Button>
              </Box>
            </VStack>
          ) : (
            <Container
              display={BOT.EDIT.DISPLAY}
              alignItems={BOT.EDIT.INVALID.ALIGN.ITEMS}
              justifyContent={BOT.EDIT.INVALID.JUSTIFY.CONTENT}
              height={BOT.EDIT.INVALID.HEIGHT}
            >
              <Loading mode={BOT.LOADING_MODE} />
            </Container>
          )}
        </Container>
      </AppShell>
    </>
  );
};

export const getStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, [BOT.COMMON])),
  },
});

export const getStaticPaths = ({ locales }) => {
  return {
    paths: [],
    fallback: BOT.EDIT.FALLBACK,
  };
};

export default withTranslation(BOT.COMMON)(Edit);
