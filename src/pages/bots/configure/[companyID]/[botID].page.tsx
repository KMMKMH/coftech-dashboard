/* eslint-disable react-hooks/exhaustive-deps */
import {
    Box,
    Button,
    Container,
    Flex,
    FormControl,
    HStack,
    Icon,
    Input,
    InputGroup,
    InputRightElement,
    Select,
    SimpleGrid,
    Spinner,
    Switch,
    Text,
    Textarea,
    Tooltip,
    useColorModeValue,
    useDisclosure,
    useTheme,
    useToast,
    useToken,
    VStack,
} from "@chakra-ui/react";
import Link from "next/link";
import { AppShell } from '@component/components/layout'
import { GetBotsByCompany } from "@component/store/botsSlice";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation, withTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import Loading from "@component/components/Loading";
import useCoftechColors from "@component/hooks/useCoftechColors";
import { useError } from "@component/utils/errorContext";
import { useLazyGetProvidersQuery, useUpdateConfigsMutation } from "@component/store/RTK/social";
import { useLazyGetBotConfigsQuery, useLazyGetSocialNetworkActivationsQuery, useUpdateBotConfigMutation, useUpdateSocialNetworkActivationsMutation } from "@component/store/RTK/botsRTK";
import { Select as ChackraSelect } from "chakra-react-select";
import TimePicker from "react-time-picker";
import Cron from "react-js-cron";
import { Clipboard, Minus, X } from "@untitled-ui/icons-react";
import { IoArrowDown, IoArrowUp } from "react-icons/io5";
import "react-js-cron/dist/styles.css";
import { getIconComponent } from "@component/utils/iconUtils";
import CoftechIconButton from "@component/components/CoftechIconButton";
import { BOT } from "@component/constants/bot";
import { ERROR } from "@component/constants/error";
import { useConfigFieldRenderer } from "@component/components/ConfigFieldRenderer";
import Config from "@component/components/Config";
import { deepCompareUnordered } from "@component/utils/deepCompareUnordered";

const Configure = () => {
    const toast = useToast();
    const theme = useTheme();
    const { showError } = useError();
    const { t } = useTranslation(BOT.COMMON);
    const router = useRouter();
    const { botID, companyID } = router.query;
    const [currentBot, setCurrentBot] = useState<any>();
    const dispatch = useDispatch();
    const { bots, loading, error: botsError } = useSelector((state: any) => state.bots);
    const [triggerGetProviders, { data: providers }] = useLazyGetProvidersQuery();
    const [triggerUpdate] = useUpdateConfigsMutation();
    const [triggerActivationsUpdate] = useUpdateSocialNetworkActivationsMutation();
    const [triggerGetBotConfigs, { data: botConfigs }] = useLazyGetBotConfigsQuery();
    const [triggerUpdateBotConfig] = useUpdateBotConfigMutation();

    useEffect(() => {
        //@ts-ignore
        dispatch(GetBotsByCompany(companyID))
        triggerGetBotConfigs(botID)
    }, [])

    useEffect(() => {
        setCurrentBot(bots.filter((bot) => {
            if (bot.uuid_unique === botID) {
                return bot
            }
        })[0])
    }, [bots])

    useEffect(() => {
        const fetchActivations = async () => {
            if (currentBot) {
                try {
                    await triggerActivations(currentBot.uuid_unique).unwrap()
                } catch (err) {
                    if (err.status === ERROR.BAD_REQUEST || err.status === ERROR.UNEXPECTED_ERROR) {
                        showError(err.data?.message)
                    } else {
                        showError(err.error)
                    }
                }
            }
        }

        fetchActivations()
    }, [currentBot])

    const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>(
        {}
    );

    const [formValues, setFormValues] = useState({});
    const [initialValues, setInitialValues] = useState({});
    const [internalValues, setInternalValues] = useState({});
    const [botInitialValues, setBotInitialValues] = useState({});
    const [mergedBotConfigs, setMergedBotConfigs] = useState([])
    const [botFormValues, setBotFormValues] = useState({});
    const [botInternalValues, setBotInternalValues] = useState({});

    const [triggerActivations, { data: networks }] = useLazyGetSocialNetworkActivationsQuery();

    const [saveChanges, setSaveChanges] = useState<boolean>(false);
    const [selectedNetwork, setSelectedNetwork] = useState<any>()
    const [selectedProvider, setSelectedProvider] = useState<any>()
    const [currentProvider, setCurrentProvider] = useState<any>()
    const [disableButton, setDisableButton] = useState(false);
    const [disableBotButton, setDisableBotButton] = useState(false);
    const networksScrollRef = useRef<HTMLDivElement | null>()

    const handleNetworks = (network) => {
        setSelectedNetwork(network)
    }

    useEffect(() => {
        if (selectedProvider) {
            setCurrentProvider(providers?.data?.[0].providers?.filter((provider) => selectedProvider.value == provider.uuid_unique)[0])
        }
    }, [selectedProvider, providers])

    useEffect(() => {
        if (selectedNetwork) {
            const fetchProvider = async () => {
                try {
                    await triggerGetProviders({ networkID: selectedNetwork?.social_network_id }).unwrap()
                } catch (err) {
                    if (err.status === ERROR.BAD_REQUEST || err.status === ERROR.UNEXPECTED_ERROR) {
                        showError(err.data?.message)
                    } else {
                        showError(err.error)
                    }
                }
            }

            fetchProvider()
        }
    }, [selectedNetwork])

    const optionsProviders = (providers?.data?.[0].providers || []).map((provider) => {
        return {
            value: provider.uuid_unique,
            label: (
                <HStack>
                    <Text>{provider.name}</Text>
                </HStack>
            ),
        };
    }).filter((provider) => provider != undefined);

    useEffect(() => {
        if (selectedNetwork) {
            setSelectedProvider({
                value: selectedNetwork.sn_provider_id,
                label: (
                    <HStack>
                        <Text>{selectedNetwork.provider_name}</Text>
                    </HStack>
                ),
            })
        }
    }, [selectedNetwork])

    useEffect(() => {
        if (selectedNetwork && selectedNetwork?.provider_is_required_configs) {
            const tempInitialValues = {};
            const tempInternalValues = {};

            selectedNetwork?.provider_configs?.map((config) => {
                if (config.internal === BOT.CONFIG.EDITABLE) {
                    tempInitialValues[config.key] = config.data || "";
                } else {
                    tempInternalValues[config.key] = config.data || "";
                }
            })

            setInternalValues(tempInternalValues);
            setFormValues(tempInitialValues);
            setInitialValues(tempInitialValues)
        } else {
            setInitialValues({})
            setInternalValues({});
            setFormValues({});
        }
    }, [selectedNetwork])

    useEffect(() => {
        if (botConfigs?.data?.length > 0) {
            const tempInitialValues = {};
            const tempInternalValues = {};
            setMergedBotConfigs([])

            botConfigs?.data.map((setting) => {
                setMergedBotConfigs((prev) => [...prev, ...(setting?.configs)])
                setting?.configs?.map((config) => {
                    if (config.internal === BOT.CONFIG.EDITABLE) {
                        tempInitialValues[config.key] = config.data || "";
                    } else {
                        tempInternalValues[config.key] = config.data || "";
                    }
                })
            })

            setBotInternalValues(tempInternalValues);
            setBotFormValues(tempInitialValues);
            setBotInitialValues(tempInitialValues)
        } else {
            setBotInitialValues({})
            setBotInternalValues({});
            setBotFormValues({});
        }
    }, [botConfigs])

    const {
        renderInputField,
        handleFieldDirection
    } = useConfigFieldRenderer(formValues, t, setFormValues, setDisableButton, internalValues)

    const {
        renderInputField: renderBotInputField,
        handleFieldDirection: handleBotFieldDirection
    } = useConfigFieldRenderer(botFormValues, t, setBotFormValues, setDisableBotButton, botInternalValues)

    const handelCopy = async (config) => {
        try {
            await navigator.clipboard.writeText(config?.data);
            if (!(toast.isActive(BOT.CONFIG.COPY.SUCCESS_TOAST.ID))) {
                toast({
                    id: BOT.CONFIG.COPY.SUCCESS_TOAST.ID,
                    title: t("fileManager.success"),
                    description: t("bots.copySuccess"),
                    status: BOT.CONFIG.COPY.SUCCESS_TOAST.STATUS,
                    duration: BOT.CONFIG.COPY.SUCCESS_TOAST.DURATION,
                    isClosable: BOT.CONFIG.COPY.SUCCESS_TOAST.IS_CLOSABLE,
                })
            }
        } catch (err) {
            if (!(toast.isActive(BOT.CONFIG.COPY.ERROR_TOAST.ID))) {
                toast({
                    id: BOT.CONFIG.COPY.ERROR_TOAST.ID,
                    title: t("recovery.error"),
                    description: t("bots.copyFailed"),
                    status: BOT.CONFIG.COPY.ERROR_TOAST.STATUS,
                    duration: BOT.CONFIG.COPY.ERROR_TOAST.DURATION,
                    isClosable: BOT.CONFIG.COPY.ERROR_TOAST.IS_CLOSABLE,
                })
            }
            console.error(err)
        }
    }

    const renderCopyField = (config) => {
        if (config?.internal == BOT.CONFIG.INTERNAL) {
            return (
                <CoftechIconButton
                    tip={t("bots.copy")}
                    icon={BOT.CONFIG.COPY.ICON}
                    onClick={() => { handelCopy(config) }}
                />
            )
        }
        return (<></>)
    }

    const {
        bgColor,
        hoverColor,
        panelBgColor,
        backgroundColor,
        inputBorderColor,
        descriptionColor,
        textColor,
        lightAccent
    } = useCoftechColors();

    useEffect(() => {
        if (networks?.data) {
            setSelectedNetwork(networks?.data?.[0])
        }
    }, [networks])

    useEffect(() => {
        if (botsError.message.length > 1) {
            showError(botsError.message)
        }
    }, [botsError])

    const handleSaveChanges = async (event: React.FormEvent) => {
        event.preventDefault();
        if (currentBot && selectedProvider && selectedNetwork && selectedProvider) {
            try {
                setLoadingStates((prev) => ({ ...prev, saveChanges: true }));
                let noChanges = false;
                if (selectedNetwork.sn_provider_id !== selectedProvider?.value) {
                    const response = await triggerActivationsUpdate({ id: currentBot?.uuid_unique, networkID: selectedNetwork?.social_network_id, providerID: selectedProvider?.value }).unwrap();

                    setSelectedNetwork(response?.data)
                } else {
                    const changedEntries = Object.entries(formValues).filter(([key, value]) => !deepCompareUnordered(value, initialValues[key]))
                    if (changedEntries.length === 0) {
                        noChanges = true
                    } else {
                        await Promise.all(
                            changedEntries.map(([key, data]) => {
                                return triggerUpdate({ companyID: currentBot?.company_id, sn_providerID: selectedProvider?.value, botID: currentBot?.uuid_unique, key, data }).unwrap();
                            }),
                        );

                        setInitialValues(prev => {
                            const updated = { ...prev };
                            changedEntries.forEach(([key, data]) => {
                                updated[key] = data;
                            });
                            return updated;
                        });
                    }
                }

                toast({
                    title: noChanges ? t("bots.noChanges") : t("modal.changesSavedSuccess"),
                    description: noChanges ? t("bots.noChangesDescription") : null,
                    status: noChanges ? BOT.CONFIG.SAVE.INFO_TOAST.STATUS : BOT.CONFIG.SAVE.SUCCESS_TOAST.STATUS,
                    duration: BOT.CONFIG.SAVE.SUCCESS_TOAST.DURATION,
                    isClosable: BOT.CONFIG.SAVE.SUCCESS_TOAST.IS_CLOSABLE,
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
        }
    };

    const handleBotSaveChanges = async (event: React.FormEvent) => {
        event.preventDefault();
        if (currentBot) {
            try {
                setLoadingStates((prev) => ({ ...prev, saveBotChanges: true }));
                let noChanges = false;

                const changedEntries = Object.entries(botFormValues).filter(([key, value]) => !deepCompareUnordered(value, botInitialValues[key]))
                if (changedEntries.length === 0) {
                    noChanges = true
                } else {
                    await Promise.all(
                        changedEntries.map(([key, data]) => {
                            return triggerUpdateBotConfig({ id: botID, config: mergedBotConfigs.find((config) => config.key === key).id, data }).unwrap();
                        }),
                    );

                    setBotInitialValues(prev => {
                        const updated = { ...prev };
                        changedEntries.forEach(([key, data]) => {
                            updated[key] = data;
                        });
                        return updated;
                    });
                }

                toast({
                    title: noChanges ? t("bots.noChanges") : t("modal.changesSavedSuccess"),
                    description: noChanges ? t("bots.noChangesDescription") : null,
                    status: noChanges ? BOT.CONFIG.SAVE.INFO_TOAST.STATUS : BOT.CONFIG.SAVE.SUCCESS_TOAST.STATUS,
                    duration: BOT.CONFIG.SAVE.SUCCESS_TOAST.DURATION,
                    isClosable: BOT.CONFIG.SAVE.SUCCESS_TOAST.IS_CLOSABLE,
                });

            } catch (error) {
                setLoadingStates((prev) => ({ ...prev, saveBotChanges: false }));
                if (error.status === ERROR.BAD_REQUEST || error.status === ERROR.UNEXPECTED_ERROR) {
                    showError(error.data?.message)
                } else {
                    showError(error.error)
                }
            } finally {
                setLoadingStates((prev) => ({ ...prev, saveBotChanges: false }));
            }
        }
    };

    useEffect(() => {
        if (saveChanges) {
            //@ts-ignore
            dispatch(GetBotsByCompany(currentBot.company_id));
            setSaveChanges(false);
        }
    }, [dispatch, currentBot, saveChanges]);

    return (
        <>
            <AppShell
                title={t("settings.title")}
                showBackButton={BOT.CONFIG.BACK_BUTTON}
                onBackButtonClick={() => router.back()}
            >
                <Container
                    maxW={BOT.CONFIG.MAX_WIDTH}
                    padding={BOT.CONFIG.PADDING}
                    display={BOT.CONFIG.DISPLAY}
                    flexDirection={BOT.CONFIG.DIRECTION}
                    gap={BOT.CONFIG.GAP}
                >
                    {currentBot && !loading ? (
                        <>
                            <VStack
                                marginY={BOT.CONFIG.PANEL.MARGIN_Y}
                                marginBottom={0}
                                padding={BOT.CONFIG.PANEL.PADDING}
                                gap={BOT.CONFIG.PANEL.GAP}
                                align={BOT.CONFIG.PANEL.ALIGN}
                                justifyContent={BOT.CONFIG.PANEL.JUSTIFY.CONTENT}
                                background={panelBgColor}
                                borderRadius={BOT.CONFIG.PANEL.BORDER.RADIUS}
                                w={BOT.CONFIG.PANEL.WIDTH}
                                flex={BOT.CONFIG.PANEL.FLEX}
                                minH={BOT.CONFIG.PANEL.MIN_HEIGHT}
                            >
                                <Text fontSize={BOT.CONFIG.PANEL.TITLE.SIZE} fontWeight={BOT.CONFIG.PANEL.TITLE.WEIGHT}>{t("bots.configs")}</Text>

                                <VStack width={BOT.CONFIG.SOCIAL_NETWORKS.CONFIGS.WIDTH}>
                                    {mergedBotConfigs?.length > 0 ?
                                        (
                                            <>
                                                {mergedBotConfigs?.map((config) => {
                                                    return (
                                                        <VStack key={config.id} width={BOT.CONFIG.SOCIAL_NETWORKS.CONFIGS.CONFIG.WIDTH} mb={BOT.CONFIG.SOCIAL_NETWORKS.CONFIGS.CONFIG.MARGIN_B}>
                                                            <FormControl>
                                                                <Config
                                                                    config={config}
                                                                    t={t}
                                                                    renderInputField={renderBotInputField}
                                                                    handleFieldDirection={handleBotFieldDirection}
                                                                    renderCopyField={renderCopyField}
                                                                />
                                                            </FormControl>
                                                        </VStack>
                                                    )
                                                })}

                                                <Box
                                                    width={BOT.CONFIG.BUTTONS.WIDTH}
                                                    display={BOT.CONFIG.BUTTONS.DISPLAY}
                                                    mt={BOT.CONFIG.BUTTONS.MARGIN_T}
                                                    flexDirection={BOT.CONFIG.BUTTONS.DIRECTION}
                                                    justifyContent={BOT.CONFIG.BUTTONS.JUSTIFY.CONTENT}
                                                    gap={BOT.CONFIG.BUTTONS.GAP}
                                                >
                                                    <Button
                                                        color={lightAccent}
                                                        width={BOT.CONFIG.BUTTONS.DEFAULT.WIDTH}
                                                        border={BOT.CONFIG.BUTTONS.CANCEL.BORDER.VALUE}
                                                        borderColor={bgColor}
                                                        borderRadius={BOT.CONFIG.BUTTONS.DEFAULT.BORDER.RADIUS}
                                                        _hover={{ bg: bgColor, color: panelBgColor }}
                                                        onClick={() => { router.back() }}
                                                        colorScheme={BOT.CONFIG.BUTTONS.DEFAULT.COLOR_SCHEME}
                                                        variant={BOT.CONFIG.BUTTONS.CANCEL.VARIANT}
                                                        spinnerPlacement={BOT.CONFIG.BUTTONS.DEFAULT.SPINNER_PLACEMENT}
                                                    >
                                                        {t("modal.cancel")}
                                                    </Button>
                                                    <Button
                                                        type={BOT.CONFIG.BUTTONS.SAVE.TYPE}
                                                        isDisabled={disableBotButton}
                                                        bg={bgColor}
                                                        color={panelBgColor}
                                                        width={BOT.CONFIG.BUTTONS.DEFAULT.WIDTH}
                                                        borderRadius={BOT.CONFIG.BUTTONS.DEFAULT.BORDER.RADIUS}
                                                        _hover={{ bg: hoverColor }}
                                                        onClick={handleBotSaveChanges}
                                                        isLoading={loadingStates[BOT.CONFIG.BUTTONS.SAVE.BOT_LOADING_STATE] || false}
                                                        loadingText={t("editBot.savingChanges")}
                                                        colorScheme={BOT.CONFIG.BUTTONS.DEFAULT.COLOR_SCHEME}
                                                        spinnerPlacement={BOT.CONFIG.BUTTONS.DEFAULT.SPINNER_PLACEMENT}
                                                    >
                                                        {t("editBot.saveChanges")}
                                                    </Button>
                                                </Box>
                                            </>
                                        ) :
                                        (
                                            <>
                                                <Loading mode={BOT.LOADING_MODE} />
                                            </>
                                        )}
                                </VStack>
                            </VStack>
                            <VStack
                                marginY={BOT.CONFIG.PANEL.MARGIN_Y}
                                padding={BOT.CONFIG.PANEL.PADDING}
                                gap={BOT.CONFIG.PANEL.GAP}
                                align={BOT.CONFIG.PANEL.ALIGN}
                                justifyContent={BOT.CONFIG.PANEL.JUSTIFY.CONTENT}
                                background={panelBgColor}
                                borderRadius={BOT.CONFIG.PANEL.BORDER.RADIUS}
                                w={BOT.CONFIG.PANEL.WIDTH}
                                flex={BOT.CONFIG.PANEL.FLEX}
                                minH={BOT.CONFIG.PANEL.MIN_HEIGHT}
                            >
                                <Text fontSize={BOT.CONFIG.PANEL.TITLE.SIZE} fontWeight={BOT.CONFIG.PANEL.TITLE.WEIGHT}>{t("bots.socialNetworks")}</Text>

                                <VStack w={BOT.CONFIG.SOCIAL_NETWORKS.WIDTH}>
                                    <HStack overflowX={BOT.CONFIG.SOCIAL_NETWORKS.OVERFLOW_X} ref={networksScrollRef} gap={BOT.CONFIG.SOCIAL_NETWORKS.GAP} w={BOT.CONFIG.SOCIAL_NETWORKS.WIDTH} sx={{ '&::-webkit-scrollbar': BOT.CONFIG.SOCIAL_NETWORKS.SCROLL_BAR.WEBKIT, msOverflowStyle: BOT.CONFIG.SOCIAL_NETWORKS.SCROLL_BAR.MS_OVERFLOW, scrollbarWidth: BOT.CONFIG.SOCIAL_NETWORKS.SCROLL_BAR.WIDTH }}>
                                        {networks?.data?.length > 0 ?
                                            (
                                                <>
                                                    {networks?.data?.map((network) => {
                                                        const iconName = BOT.CONFIG.SOCIAL_NETWORKS.NETWORK.ICON.TYPE + network.network_name
                                                        const IconComponent = getIconComponent(
                                                            iconName
                                                        );
                                                        return (
                                                            <Box
                                                                key={network.uuid_unique}
                                                                display={BOT.CONFIG.SOCIAL_NETWORKS.NETWORK.DISPLAY}
                                                                flexDirection={BOT.CONFIG.SOCIAL_NETWORKS.NETWORK.DIRECTION}
                                                                fontSize={BOT.CONFIG.SOCIAL_NETWORKS.NETWORK.ICON.SIZE}
                                                                onClick={() => { handleNetworks(network) }}
                                                                p={BOT.CONFIG.SOCIAL_NETWORKS.NETWORK.PADDING}
                                                                borderRadius={BOT.CONFIG.SOCIAL_NETWORKS.NETWORK.BORDER.RADIUS}
                                                                px={BOT.CONFIG.SOCIAL_NETWORKS.NETWORK.PADDING_X}
                                                                cursor={BOT.CONFIG.SOCIAL_NETWORKS.NETWORK.CURSOR}
                                                                color={selectedNetwork?.uuid_unique === network?.uuid_unique ? textColor : descriptionColor}
                                                                border={selectedNetwork?.uuid_unique === network.uuid_unique ? `${BOT.CONFIG.SOCIAL_NETWORKS.NETWORK.BORDER.SELECTED} ${bgColor}` : BOT.CONFIG.SOCIAL_NETWORKS.NETWORK.BORDER.UNSELECTED}
                                                                bgColor={selectedNetwork?.uuid_unique === network.uuid_unique ? backgroundColor : null}>
                                                                <IconComponent />
                                                                <Text mx={BOT.CONFIG.SOCIAL_NETWORKS.NETWORK.TEXT.MARGIN_X} fontSize={BOT.CONFIG.SOCIAL_NETWORKS.NETWORK.TEXT.SIZE} my={BOT.CONFIG.SOCIAL_NETWORKS.NETWORK.TEXT.MARGIN_Y}>{network.network_name}</Text>
                                                            </Box>
                                                        )
                                                    })}
                                                </>
                                            ) : (
                                                <Loading mode={BOT.LOADING_MODE} />
                                            )}
                                    </HStack>
                                    <Text ml={BOT.CONFIG.SOCIAL_NETWORKS.AMOUNT.MARGIN_L} my={BOT.CONFIG.SOCIAL_NETWORKS.AMOUNT.MARGIN_Y}>{t("bots.providers", { a: networks?.data?.length })}</Text>
                                </VStack>
                                <VStack width={BOT.CONFIG.SOCIAL_NETWORKS.CONFIGS.WIDTH}>
                                    <Text mr={BOT.CONFIG.SOCIAL_NETWORKS.CONFIGS.TITLE.MARGIN_R}>{t("bots.provider")}</Text>
                                    <ChackraSelect
                                        size={BOT.CONFIG.SOCIAL_NETWORKS.CONFIGS.SELECT.SIZE}
                                        focusBorderColor={bgColor}
                                        isSearchable={BOT.CONFIG.SOCIAL_NETWORKS.CONFIGS.SELECT.IS_SEARCHABLE}
                                        noOptionsMessage={() => t("bots.noProviders")}
                                        placeholder={t("bots.selectProvider")}
                                        value={optionsProviders?.filter((option) => option?.value == selectedProvider?.value)}
                                        onChange={(option) => { setSelectedProvider(option) }}
                                        options={optionsProviders}
                                        chakraStyles={{
                                            container: (provided) => ({
                                                ...provided,
                                                w: BOT.CONFIG.SOCIAL_NETWORKS.CONFIGS.SELECT.CONTAINER.WIDTH,
                                                background: panelBgColor,
                                                cursor: BOT.CONFIG.SOCIAL_NETWORKS.CONFIGS.SELECT.CONTAINER.CURSOR,
                                                color: descriptionColor
                                            }),
                                            dropdownIndicator: (provided) => ({
                                                ...provided,
                                                color: bgColor,
                                                width: BOT.CONFIG.SOCIAL_NETWORKS.CONFIGS.SELECT.DROPDOWN.WIDTH,
                                                background: panelBgColor,
                                            }),
                                            control: (provided) => ({
                                                ...provided,
                                                borderRadius: BOT.CONFIG.SOCIAL_NETWORKS.CONFIGS.SELECT.CONTROL.BORDER.RADIUS,
                                            }),
                                            menuList: (provided) => ({
                                                ...provided,
                                                bg: BOT.CONFIG.SOCIAL_NETWORKS.CONFIGS.SELECT.MENU.BACKGROUND,
                                                color: BOT.CONFIG.SOCIAL_NETWORKS.CONFIGS.SELECT.MENU.COLOR,
                                                py: BOT.CONFIG.SOCIAL_NETWORKS.CONFIGS.SELECT.MENU.PADDING_Y,
                                                borderRadius: BOT.CONFIG.SOCIAL_NETWORKS.CONFIGS.SELECT.MENU.BORDER.RADIUS,
                                                background: panelBgColor,
                                                _dark: {
                                                    "--menu-bg": backgroundColor,
                                                    "--menu-shadow": BOT.CONFIG.SOCIAL_NETWORKS.CONFIGS.SELECT.MENU.SHADOW
                                                },
                                                '&::-webkit-scrollbar': BOT.CONFIG.SOCIAL_NETWORKS.CONFIGS.SELECT.MENU.SCROLL_BAR.WEBKIT,
                                                '-ms-overflow-style': BOT.CONFIG.SOCIAL_NETWORKS.CONFIGS.SELECT.MENU.SCROLL_BAR.MS_OVERFLOW,
                                                'scrollbar-width': BOT.CONFIG.SOCIAL_NETWORKS.CONFIGS.SELECT.MENU.SCROLL_BAR.WIDTH
                                            }),
                                            option: (provided) => ({
                                                ...provided,
                                                _selected: {
                                                    bg: bgColor,
                                                    color: textColor
                                                }
                                            })
                                        }}
                                    />
                                    {currentProvider && (
                                        <Text my={BOT.CONFIG.SOCIAL_NETWORKS.CONFIGS.DESCRIPTION.MARGIN_Y} mr={BOT.CONFIG.SOCIAL_NETWORKS.CONFIGS.DESCRIPTION.MARGIN_R}>{currentProvider?.description?.[0][t("integrations.lang")]}</Text>
                                    )}

                                    {selectedProvider && selectedProvider.value == selectedNetwork?.sn_provider_id && selectedNetwork?.provider_configs?.map((config) => {
                                        return (
                                            <VStack key={config.company_config_id} width={BOT.CONFIG.SOCIAL_NETWORKS.CONFIGS.CONFIG.WIDTH} mb={BOT.CONFIG.SOCIAL_NETWORKS.CONFIGS.CONFIG.MARGIN_B}>
                                                <FormControl>
                                                    <Config
                                                        config={config}
                                                        t={t}
                                                        renderInputField={renderInputField}
                                                        handleFieldDirection={handleFieldDirection}
                                                        renderCopyField={renderCopyField}
                                                    />
                                                </FormControl>
                                            </VStack>
                                        )
                                    })}

                                    {selectedProvider?.value != selectedNetwork?.sn_provider_id && currentProvider?.is_required_configs == BOT.CONFIG.SOCIAL_NETWORKS.CONFIGS.CONFIG.REQUIRED_CONFIG && (
                                        <Text mr={BOT.CONFIG.SOCIAL_NETWORKS.CONFIGS.SAVE_TO_DISPLAY.MARGIN_R}>{t("bots.configsNote")}</Text>
                                    )}

                                    <Box
                                        width={BOT.CONFIG.BUTTONS.WIDTH}
                                        display={BOT.CONFIG.BUTTONS.DISPLAY}
                                        mt={BOT.CONFIG.BUTTONS.MARGIN_T}
                                        flexDirection={BOT.CONFIG.BUTTONS.DIRECTION}
                                        justifyContent={BOT.CONFIG.BUTTONS.JUSTIFY.CONTENT}
                                        gap={BOT.CONFIG.BUTTONS.GAP}
                                    >
                                        <Button
                                            color={lightAccent}
                                            width={BOT.CONFIG.BUTTONS.DEFAULT.WIDTH}
                                            border={BOT.CONFIG.BUTTONS.CANCEL.BORDER.VALUE}
                                            borderColor={bgColor}
                                            borderRadius={BOT.CONFIG.BUTTONS.DEFAULT.BORDER.RADIUS}
                                            _hover={{ bg: bgColor, color: panelBgColor }}
                                            onClick={() => { router.back() }}
                                            colorScheme={BOT.CONFIG.BUTTONS.DEFAULT.COLOR_SCHEME}
                                            variant={BOT.CONFIG.BUTTONS.CANCEL.VARIANT}
                                            spinnerPlacement={BOT.CONFIG.BUTTONS.DEFAULT.SPINNER_PLACEMENT}
                                        >
                                            {t("modal.cancel")}
                                        </Button>
                                        <Button
                                            type={BOT.CONFIG.BUTTONS.SAVE.TYPE}
                                            isDisabled={disableButton}
                                            bg={bgColor}
                                            color={panelBgColor}
                                            width={BOT.CONFIG.BUTTONS.DEFAULT.WIDTH}
                                            borderRadius={BOT.CONFIG.BUTTONS.DEFAULT.BORDER.RADIUS}
                                            _hover={{ bg: hoverColor }}
                                            onClick={handleSaveChanges}
                                            isLoading={loadingStates[BOT.CONFIG.BUTTONS.SAVE.LOADING_STATE] || false}
                                            loadingText={t("editBot.savingChanges")}
                                            colorScheme={BOT.CONFIG.BUTTONS.DEFAULT.COLOR_SCHEME}
                                            spinnerPlacement={BOT.CONFIG.BUTTONS.DEFAULT.SPINNER_PLACEMENT}
                                        >
                                            {t("editBot.saveChanges")}
                                        </Button>
                                    </Box>
                                </VStack>
                            </VStack>
                        </>
                    ) : (
                        <Container
                            display={BOT.CONFIG.DISPLAY}
                            alignItems={BOT.CONFIG.INVALID.ALIGN.ITEMS}
                            justifyContent={BOT.CONFIG.INVALID.JUSTIFY.CONTENT}
                            height={BOT.CONFIG.INVALID.HEIGHT}
                        >
                            <Loading mode={BOT.LOADING_MODE} />
                        </Container>
                    )}
                </Container>
            </AppShell >
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
        fallback: BOT.CONFIG.FALL_BACK,
    };
};

export default withTranslation(BOT.COMMON)(Configure);
