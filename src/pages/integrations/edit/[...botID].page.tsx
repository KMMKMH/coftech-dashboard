/* eslint-disable react-hooks/exhaustive-deps */
import {
  Box,
  Button,
  Container,
  FormControl,
  VStack,
  useToast,
  Spinner,
  Text,
  FormErrorMessage,
  HStack,
  useTheme,
  Icon,
} from "@chakra-ui/react";
import { AppShell } from '@component/components/layout'
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import React, { useEffect, useState } from "react";
import { withTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@component/store";
import { useRouter } from "next/router";
import { AxiosUrl } from "@component/configs/AxiosConfig";
import {
  SwitchHorizontal02,
} from "@untitled-ui/icons-react";
import "react-js-cron/dist/styles.css";
import useCoftechColors from "@component/hooks/useCoftechColors";
import {
  GetGoogleAuth,
  GetGoogleScopes,
  GetRevokeGoogle,
} from "@component/store/integrationsSlice";
import { useConfigFieldRenderer } from "@component/components/ConfigFieldRenderer";
import Config from "@component/components/Config";
import { deepCompareUnordered } from "@component/utils/deepCompareUnordered";

const Edit = ({ t }) => {
  const theme = useTheme();
  const dispatch: AppDispatch = useDispatch();
  const router = useRouter();
  const toast = useToast();
  const { botID } = router.query;

  const botIdUnique = botID ? botID[0] : null;
  const botcompanyId = botID ? botID[2] : null;
  const botextensionId = botID ? botID[1] : null;

  const [configurations, setConfigurations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formValues, setFormValues] = useState({});
  const [initialValues, setInitialValues] = useState({});
  const [doNotSaveValues, setDoNotSaveValues] = useState([]);
  const [errors, setErrors] = useState({});
  const [extensionName, setExtensionName] = useState("");
  const [extensionDescription, setExtensionDescription] = useState<string[]>([]);
  const [disableButton, setDisableButton] = useState(false);

  const [enumExample, setEnumExample] = useState("");
  const googleAuthData = useSelector(
    (state: any) => state.integration.googleAuthData
  );
  const hasGoogleCalendarConfig = configurations.some(
    (config) =>
      config.key === "GOOGLE_CALENDAR_CLIENT_ID" ||
      config.key === "GOOGLE_CALENDAR_CLIENT_SECRET"
  );

  const {
    bgColor,
    hoverColor,
    panelBgColor,
    titleColor,
  } = useCoftechColors();

  const triggerMap = {
    openRoute: (item, label, workflow) => handleOpenRoute(item, label, workflow),
    autoRoute: (item, label, workflow) => handleAutoRoute(item, label, workflow),
  };

  const {
    renderInputField,
    handleFieldDirection
  } = useConfigFieldRenderer(formValues, t, setFormValues, setDisableButton)

  const handleOpenRoute = (item, label, workflow) => {
    const options = workflow.selectItems[item] || [];
    setConfigurations((prev) =>
      prev.map((item) =>
        item.key === workflow.setKey
          ? {
            ...item,
            options: options,
          }
          : item
      )
    );
  }

  const handleAutoRoute = (item, label, workflow) => {
    const value = item === "true";

    if (value) {
      setFormValues((prev) => {
        const updated = { ...prev };

        for (const key in updated) {
          if (workflow.disablekeys.includes(key) && key !== label) {
            updated[key] = null;
          }
        }

        updated[label] = item;
        return updated;
      });
    }

    setConfigurations((prev) =>
      prev.map((item) =>
        workflow.disablekeys.includes(item.key)
          ? {
            ...item,
            extra: {
              ...(item.extra || {}),
              disabled: value,
            },
          }
          : item
      )
    );
  };

  const onHandleActions = (item, key, trigger) => {
    const action = triggerMap[trigger?.handleTrigger];
    if (action) {
      if (trigger?.workflow) {
        action(item, key, trigger.workflow);
      } else {
        action(item, key);
      }
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await AxiosUrl.get(
          `/bots/extensions?botID=${botIdUnique}`
        );
        if (response.data && response.data.status) {
          const extension = response.data.data.find(
            (ext) => ext.extension === botextensionId
          );

          if (extension) {
            const { configs } = extension;
            const mergedData = configs.map((config) => ({
              key: config.key,
              name: config.name,
              data: config.data,
              data_type: config.type,
              options: config.options ? config.options : null,
              description: config.description,
              onHandleOption: (item) => onHandleActions(item, config.key, config?.trigger),
              extra: config?.extra ? config.extra : {},
              trigger: config?.trigger,
            }));

            setConfigurations(mergedData);

            const initialValues = {};
            const doNotSaveValues = [];
            mergedData.forEach((config) => {
              if (config?.extra?.doNotSave === true) {
                doNotSaveValues.push(config.key);
              }
              initialValues[config.key] = config.data || "";
              if (config?.trigger) {
                onHandleActions(config.data, config.key, config?.trigger)
              }
            });

            setFormValues(initialValues);
            setInitialValues(initialValues);
            setDoNotSaveValues(doNotSaveValues);
            setExtensionName(extension.extension_name);
            setExtensionDescription(extension.extension_description)
          }
        } else {
          toast({
            title: t("integrations.extensionUpdateError"),
            description: t("integrations.extensionUpdateErrorDescription"),
            status: "error",
            duration: 9000,
            isClosable: true,
          });
        }
      } catch (error) {
        toast({
          title: t("integrations.extensionUpdateError"),
          description: t("integrations.extensionUpdateErrorDescription"),
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    if (botIdUnique) {
      fetchData();
    }
  }, [botIdUnique, botextensionId, t, toast]);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      let noChanges = false
      const filteredValues = Object.entries(formValues).filter(([key, value]) => !deepCompareUnordered(value, initialValues[key])).filter(([key]) => !doNotSaveValues.includes(key))

      if (filteredValues.length === 0) {
        noChanges = true
      } else {
        await Promise.all(
          filteredValues.map(([key, data]) => {
            return AxiosUrl.put(
              `/company/config?companyID=${botcompanyId}&extensionID=${botextensionId}&botID=${botIdUnique}`,
              {
                key,
                data,
              }
            );
          })
        );

        setInitialValues(prev => {
          const updated = { ...prev };
          filteredValues.forEach(([key, data]) => {
            updated[key] = data;
          });
          return updated;
        });
      }
      toast({
        title: noChanges ? t("bots.noChanges") : t("integrations.changesSaved"),
        description: noChanges ? t("bots.noChangesDescription") : t("integrations.changesSavedDescription"),
        status: noChanges ? "info" : "success",
        duration: 9000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: t("integrations.saveChangesError"),
        description: t("integrations.saveChangesErrorDescription"),
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleConnectAccount = async () => {
    if (botIdUnique && botcompanyId) {
      try {
        const googleScopesResponse = await dispatch(
          GetGoogleScopes({ serviceName: "GOOGLE_CALENDAR" })
        ).unwrap();

        const googleScopeId = googleScopesResponse.data?.[0]?.uuid_unique;

        if (!googleScopeId) {
          throw new Error(t("integrations.googleScopeIdError"));
        }

        const googleAuthResponse = await dispatch(
          GetGoogleAuth({ botId: botIdUnique, googleScopeId })
        ).unwrap();

        if (googleAuthResponse.data.status) {
          const accessTokenUrl = googleAuthResponse.data.data;
          window.open(accessTokenUrl, "popupWindow", "popup");
        }
      } catch (error) {
        toast({
          title: t("integrations.googleAuthError"),
          description:
            error.message || t("integrations.googleAuthErrorDescription"),
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      }
    }
  };

  const handleRevokeAccount = async () => {
    if (botIdUnique && botcompanyId) {
      try {
        await dispatch(GetRevokeGoogle({ botId: botIdUnique })).unwrap();
      } catch (error) {
        toast({
          title: t("recovery.error"),
          description:
            error.message,
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      }
    }
  }

  if (loading) {
    return (
      <Container centerContent>
        <Spinner size="xl" />
      </Container>
    );
  }

  return (
    <>
      <AppShell
        title={extensionName || t("integrations.title")}
        showBackButton={true}
        onBackButtonClick={() => router.back()}
      >
        <Container minHeight="100vh" maxW="full" h={"full"}>
          <Box bg={panelBgColor} p={8} rounded="lg" boxShadow="lg">
            <VStack w={"full"} gap={"30px"} mb={"30px"}>
              <Text textAlign={"start"} w={"full"} fontSize={"25px"} fontWeight={"bold"}>{t("integrations.configurations")}</Text>
              <Text textAlign={"start"} w={"full"} fontSize={"17px"}>{extensionDescription[t("integrations.lang")]}</Text>
            </VStack>
            <HStack justify={"flex-end"} marginBottom={"20px"}>
              {hasGoogleCalendarConfig && (
                <Button
                  bg={bgColor}
                  _hover={{
                    bg: hoverColor,
                  }}
                  color={"white"}
                  isDisabled={loading}
                  leftIcon={
                    <Icon as={SwitchHorizontal02} w={"20px"} h={"20px"} />
                  }
                  onClick={
                    googleAuthData.isConnectGoogleAuth
                      ? handleRevokeAccount
                      : handleConnectAccount
                  }
                >
                  {googleAuthData.isConnectGoogleAuth
                    ? t("integrations.revokeAccount")
                    : t("integrations.connectAccount")}
                </Button>
              )}
            </HStack>
            <VStack spacing={10}>
              {configurations.map((config, index: number) => {
                if (config.data_type === "disabled") return null;
                return (
                  <FormControl key={index} isInvalid={!!errors[config.key]}>
                    <Config
                      config={config}
                      t={t}
                      renderInputField={renderInputField}
                      handleFieldDirection={handleFieldDirection}
                    />
                    {errors[config.key] && (
                      <FormErrorMessage>{errors[config.key]}</FormErrorMessage>
                    )}
                  </FormControl>
                );
              })}
              <Box display="flex" justifyContent="flex-end" width="100%">
                <Button
                  bg={bgColor}
                  _hover={{
                    bg: hoverColor,
                  }}
                  color={"white"}
                  onClick={handleSubmit}
                  isDisabled={disableButton}
                >
                  {t("integrations.saveButton")}
                </Button>
              </Box>
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

export const getStaticPaths = ({ locales }) => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export default withTranslation("common")(Edit);
