/* eslint-disable react-hooks/exhaustive-deps */
import React, { use, useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Container,
  VStack,
  HStack,
  Avatar,
  Text,
  Input,
  Select,
  Heading,
  Flex,
  SimpleGrid,
  InputGroup,
  InputLeftElement,
  useDisclosure,
  useColorModeValue,
  useBreakpointValue,
  Checkbox,
  Tooltip,
} from "@chakra-ui/react";
import { AddIcon, DeleteIcon, SearchIcon } from "@chakra-ui/icons";
import { Select as SelectChakra } from "chakra-react-select";
import { AppShell } from '@component/components/layout'
import { useAuthStore } from "@component/store/auth";
import FileCard from "@component/components/FileCard";
import UploadFilesModal from "@component/components/UploadFilesModal";
import DeleteFileModal from "@component/components/DeleteFileModal";
import { withTranslation } from "react-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useDispatch, useSelector } from "react-redux";
import { companiesGet } from "@component/store/companySlice";
import Image from "next/image";
import {
  useGetFileTypesQuery,
  useLazyGetFileByCompanyQuery,
} from "@component/store/RTK/FileManager";
import Loading from "@component/components/Loading";
import useCoftechColors from "@component/hooks/useCoftechColors";
import { GetBotsByCompany } from "@component/store/botsSlice";
import { AppDispatch } from "@component/store";
import EditFileModal from "@component/components/EditFileModal";

import Disable_EnableFileModal from "@component/components/Disable-EnableFileModal";
import active from "../../assets/images/active.svg";
import disable from "../../assets/images/disable.svg";
import { GetBotExtension } from "@component/store/integrationsSlice";
import FileView from "@component/components/FileView";
import { useError } from "@component/utils/errorContext";
import TabButton from "@component/components/TabButton";
import { FileType } from "@component/types/fileType";
import { FILEMANAGER } from "@component/constants/fileManager";
import { ERROR } from "@component/constants/error";
import { UNI } from "@component/constants/universal";
import FileManagerDisabled from "@component/components/FileManagerDisabled";

// Constant used to control whether the service is available
const FILE_MANAGER_ENABLED = false;

const FileManagerActive = ({ t }) => {
  const { user } = useAuthStore();
  const { showError } = useError();
  const dispatch: AppDispatch = useDispatch();
  const isMobile = useBreakpointValue(FILEMANAGER.MOBILE_BREAKPOINT);

  const {
    bgColor,
    hoverColor,
    panelBgColor,
    backgroundColor,
    inputBorderColor,
    descriptionColor,
    textColor,
    borderColor
  } = useCoftechColors();

  const { companies, error: companiesError } = useSelector((state: any) => state.company);
  const { bots, loading: loadingBots, error: botsError } = useSelector((resp: any) => resp.bots);
  const { botExtensions, LoadingBotExtension, error: extensionError } = useSelector(
    (state: any) => state.integration
  );

  const [activeTab, setActiveTab] = useState<number>(FILEMANAGER.TAB.MYFILES)
  const { data: dataTypes, isLoading: isLoadingFileTypes } =
    useGetFileTypesQuery({ ragCompatible: activeTab == FILEMANAGER.TAB.LEARNING });
  const [trigger, { data: responseFiles, isLoading }] =
    useLazyGetFileByCompanyQuery();
  const [loadingFiles, setLoadingFiles] = useState<boolean>(false)

  const [files, setFiles] = useState([]);
  const [company, setCompany] = useState(user?.company_id);
  const [type, setType] = useState("");
  const [search, setSearch] = useState("");
  const [botID, setBotID] = useState();
  const [status, setStatus] = useState(1);
  const [fileToDelete, setFileToDelete] = useState<FileType | FileType[]>();
  const [fileToDisable_Enable, setFileToDisable_Enable] = useState();
  const [fileToRename, setFileToRename] = useState();
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [canUpload, setCanUpload] = useState(false);
  const [retrigger, setRetrigger] = useState(false);
  const [url, setUrl] = useState<string>()
  const {
    isOpen: isOpenModal,
    onOpen: onOpenModal,
    onClose: onCloseModal,
  } = useDisclosure();
  const {
    isOpen: isOpenView,
    onOpen: onOpenView,
    onClose: onCloseView,
  } = useDisclosure();
  const {
    isOpen: isDeleteModalOpen,
    onOpen: onOpenDeleteModal,
    onClose: onCloseDeleteModal,
  } = useDisclosure();
  const {
    isOpen: isDisable_EnableModalOpen,
    onOpen: onOpenDisable_EnableModal,
    onClose: onCloseDisable_EnableModal,
  } = useDisclosure();
  const {
    isOpen: isRenameModalOpen,
    onOpen: onOpenRenameModal,
    onClose: onCloseRenameModal,
  } = useDisclosure();

  const fetchFiles = async () => {
    try {
      setLoadingFiles(true)
      await trigger({ companyID: company, source: activeTab == FILEMANAGER.TAB.MYFILES ? FILEMANAGER.SOURCE.FILEMANAGER : FILEMANAGER.SOURCE.RAG, botID: botID, status: activeTab == FILEMANAGER.TAB.MYFILES ? FILEMANAGER.STATUS.ENABLED : status }).unwrap()
      setRetrigger(true)
    } catch (err) {
      setLoadingFiles(false)
      setRetrigger(false)
      if (err.status === ERROR.BAD_REQUEST || err.status === ERROR.UNEXPECTED_ERROR) {
        showError(err.data?.message)
      } else {
        showError(err.error)
      }
    }
  }

  useEffect(() => {
    if (botsError?.message?.length > 0) {
      showError(botsError.message)
    }
  }, [botsError])

  useEffect(() => {
    if (companiesError?.message?.length > 0) {
      showError(companiesError.message)
    }
  }, [companiesError])

  useEffect(() => {
    if (extensionError?.message?.length > 0) {
      showError(extensionError.message)
    }
  }, [extensionError])

  useEffect(() => {
    if (!isDeleteModalOpen && fileToDelete) {
      setFileToDelete(undefined);
    }
  }, [isDeleteModalOpen]);

  useEffect(() => {
    if (!isRenameModalOpen && fileToRename) {
      setFileToRename(undefined);
    }
  }, [isRenameModalOpen]);

  const FileTypes = useMemo(() => {
  return dataTypes?.data ?? []
}, [dataTypes])

  useEffect(() => {
    if (user?.rol_key === UNI.ROLE.SUPERADMIN) {
      //@ts-ignore
      dispatch(companiesGet());
    } else if (botID || (activeTab == FILEMANAGER.TAB.MYFILES && company)) {
      fetchFiles()
    }
  }, [user?.rol_key, dispatch, user?.company_id, trigger, botID]);

  useEffect(() => {
    if (company) {
      dispatch(GetBotsByCompany(company));
      setBotID(undefined);
      setCanUpload(false);
      if (activeTab == FILEMANAGER.TAB.MYFILES) {
        fetchFiles()
      }
    }
  }, [company, dispatch]);

  useEffect(() => {
    if (botID) {
      dispatch(GetBotExtension(botID));
    }
  }, [botID]);

  useEffect(() => {
    if (botExtensions && botID) {
      const geminiExt = botExtensions?.filter(
        (extension) => extension.extension_key == FILEMANAGER.EXTENSION.GEMINI
      );
      const pineconeExt = botExtensions?.filter(
        (extension) => extension.extension_key == FILEMANAGER.EXTENSION.PINECONE
      );
      if (geminiExt.length > 0 && pineconeExt.length > 0) {
        const geminiStatus =
          geminiExt[0].configs.filter(
            (config) => config.key == FILEMANAGER.EXTENSION.CONFIG.GEMINI_STATUS
          )[0].data == FILEMANAGER.EXTENSION.CONFIG.TRUE;
        const pineconeStatus =
          pineconeExt[0].configs.filter(
            (config) => config.key == FILEMANAGER.EXTENSION.CONFIG.PINECONE_STATUS
          )[0].data == FILEMANAGER.EXTENSION.CONFIG.TRUE;
        if (geminiStatus && pineconeStatus) {
          setCanUpload(true);
        } else {
          setCanUpload(false);
        }
      } else {
        setCanUpload(false);
      }
    } else {
      setCanUpload(false);
    }
  }, [botExtensions]);

  useEffect(() => {
    if (!company) {
      setCompany(user?.company_id);
    }
  }, [company, user?.company_id]);

  useEffect(() => {
    if (botID || (activeTab == FILEMANAGER.TAB.MYFILES && company)) {
      fetchFiles()
    }
  }, [status, botID, activeTab, trigger]);

  useEffect(() => {
    if (botID || (activeTab == FILEMANAGER.TAB.MYFILES && company)) {
      if (retrigger) {
        setLoadingFiles(false)
        setRetrigger(false);
        let filterData;
        if (responseFiles?.status) {
          filterData = responseFiles?.data;
        }
        if (search) {
          filterData = filterData.filter((file) =>
            file.file_name?.toLowerCase().includes(search.toLowerCase())
          );
        }
        if (optionsFileTypes?.filter((fileType) => fileType.value == type)?.length > 0) {
          filterData = filterData.filter((file) =>
            file.extension.includes(type)
          );
        }
        setFiles(filterData);
      }
    } else {
      setLoadingFiles(false)
      setFiles(undefined);
    }
  }, [type, search, retrigger, botID, activeTab, company]);

  const handleFilterByCompany = (company) => {
    if (company) setCompany(company.value);
  };

  const handleFilterByFileType = (fileType) => {
    if (fileType) {
      setType(fileType.value);
      setRetrigger(true);
    } else {
      setType(undefined);
      setRetrigger(true);
    }
  };

  const handleFilterByBotID = (bot) => {
    if (bot) setBotID(bot.value);
  };

  const handleSearch = (search) => {
    if (search) {
      setSearch(search.target.value);
      setRetrigger(true);
    }
  };

  const handleFilterByFileStatus = (status) => {
    if (status) {
      setStatus(status.value);
    }
  };

  const handleSelectFile = (fileId: string) => {
    setSelectedFiles((prevSelected) =>
      prevSelected.includes(fileId)
        ? prevSelected.filter((id) => id !== fileId)
        : [...prevSelected, fileId]
    );
  };

  const clearSelectedFiles = () => {
    setSelectedFiles([]);
  };

  const optionsCompany = (companies || []).map((company) => {
    return {
      value: company.uuid_unique,
      label: (
        <HStack>
          <Text>{company.name}</Text>
        </HStack>
      ),
    };
  });

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

  const optionsFileTypes = useMemo(() => {
    return FileTypes.map((fileType) => {
      return {
        value: fileType.name,
        label: (
          <HStack>
            <Text>{fileType.key}</Text>
          </HStack>
        ),
      };
    });
  }, [FileTypes]);

  const optionsStatus = [
    {
      value: FILEMANAGER.STATUS.ENABLED,
      label: (
        <HStack>
          <Image src={active} alt={FILEMANAGER.STATUS.ALT.ENABLED} />
          <Text>{t("fileManager.enabled")}</Text>
        </HStack>
      ),
    },
    {
      value: FILEMANAGER.STATUS.DISABLED,
      label: (
        <HStack>
          <Image src={disable} alt={FILEMANAGER.STATUS.ALT.DISABLED} />
          <Text>{t("fileManager.disabled")}</Text>
        </HStack>
      ),
    },
  ];

  const FileExtensionsArray = useMemo(() => {
    return FileTypes.map((fileType) => {
      return fileType.name
    });
  }, [FileTypes]);

  return (
    <AppShell title={t("fileManager.title")}>
      <Container maxW={FILEMANAGER.WIDTH.FULL} p={FILEMANAGER.PADDING.NORMAL}>
        <UploadFilesModal
          company={company}
          source={activeTab == FILEMANAGER.TAB.MYFILES ? FILEMANAGER.SOURCE.FILEMANAGER : FILEMANAGER.SOURCE.RAG}
          botID={botID}
          allowedTypes={FileExtensionsArray}
          isOpen={isOpenModal}
          refetch={trigger}
          onClose={onCloseModal}
          setRetrigger={setRetrigger}
        />
        <FileView
          isOpen={isOpenView}
          onClose={onCloseView}
          url={url}
        />
        <DeleteFileModal
          isOpen={isDeleteModalOpen}
          onClose={onCloseDeleteModal}
          files={Array.isArray(fileToDelete) ? fileToDelete : [fileToDelete]}
          botID={botID}
          refetch={trigger}
          onClearSelection={clearSelectedFiles}
          setRetrigger={setRetrigger}
        />
        <Disable_EnableFileModal
          fileStatus={status}
          isOpen={isDisable_EnableModalOpen}
          onClose={onCloseDisable_EnableModal}
          file={fileToDisable_Enable}
          botID={botID}
          refetch={trigger}
          setRetrigger={setRetrigger}
        />
        <EditFileModal
          isOpen={isRenameModalOpen}
          onClose={onCloseRenameModal}
          file={fileToRename}
          botID={botID}
          refetch={trigger}
          setRetrigger={setRetrigger}
        />
        {isMobile ? (
          <VStack justify={FILEMANAGER.JUSTIFY.SPACE_BETWEEN} align={FILEMANAGER.ALIGN.CENTER} mb={FILEMANAGER.MARGIN.NORMAL}>
            {user?.rol_key === UNI.ROLE.SUPERADMIN && companies.length > 0 && (
              <VStack spacing={FILEMANAGER.SPACING.XSMALL} w={FILEMANAGER.WIDTH.FULL}>
                <Heading size={FILEMANAGER.SIZE.MEDIUM}>{t("fileManager.selectCompany")}</Heading>
                <SelectChakra
                  isSearchable={FILEMANAGER.SELECT.IS_SEARCHABLE}
                  onChange={handleFilterByCompany}
                  options={optionsCompany}
                  placeholder={t("bots.filterByCompany")}
                  defaultValue={{
                    value: user?.company_id,
                    label: (
                      <HStack>
                        <Text>
                          {
                            (
                              companies.find(
                                (company) =>
                                  company.uuid_unique === user?.company_id
                              ) || {}
                            ).name
                          }
                        </Text>
                      </HStack>
                    ),
                  }}
                  focusBorderColor={bgColor}
                  chakraStyles={{
                    container: (provided) => ({
                      ...provided,
                      borderRadius: FILEMANAGER.SELECT.CONTAINER.BORDER.RADIUS,
                      w: FILEMANAGER.SELECT.CONTAINER.WIDTH,
                      background: panelBgColor,
                      cursor: FILEMANAGER.SELECT.CONTAINER.CURSOR,
                      border: FILEMANAGER.SELECT.CONTAINER.BORDER.TRANSPARENT,
                      color: descriptionColor
                    }),
                    dropdownIndicator: (provided) => ({
                      ...provided,
                      color: bgColor,
                      width: FILEMANAGER.SELECT.DROPDOWN.WIDTH,
                      background: panelBgColor,
                    }),
                    control: (provided) => ({
                      ...provided,
                      borderRadius: FILEMANAGER.SELECT.CONTROL.BORDER.RADIUS,
                    }),
                    menuList: (provided) => ({
                      ...provided,
                      bg: FILEMANAGER.SELECT.MENU.BG,
                      color: FILEMANAGER.SELECT.MENU.COLOR,
                      py: FILEMANAGER.SELECT.MENU.PADDING_Y,
                      borderRadius: FILEMANAGER.SELECT.MENU.BORDER.RADIUS,
                      background: panelBgColor,
                      _dark: {
                        "--menu-bg": backgroundColor,
                        "--menu-shadow": FILEMANAGER.SELECT.MENU.DARK.SHADOW
                      },
                      '&::-webkit-scrollbar': FILEMANAGER.SELECT.MENU.SCROLL_BAR.WEBKIT,
                      '-ms-overflow-style': FILEMANAGER.SELECT.MENU.SCROLL_BAR.MS_OVERFLOW,
                      'scrollbar-width': FILEMANAGER.SELECT.MENU.SCROLL_BAR.WIDTH
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
              </VStack>
            )}
            <VStack
              justify={FILEMANAGER.JUSTIFY.SPACE_BETWEEN}
              align={FILEMANAGER.ALIGN.CENTER}
              my={FILEMANAGER.MARGIN.NORMAL}
              spacing={FILEMANAGER.SPACING.XSMALL}
              w={FILEMANAGER.WIDTH.FULL}
            >
              <Heading size={FILEMANAGER.SIZE.MEDIUM}>{t("fileManager.selectBot")}</Heading>
              <HStack w={FILEMANAGER.WIDTH.HUNDRED}>
                <SelectChakra
                  isSearchable={FILEMANAGER.SELECT.IS_SEARCHABLE}
                  onChange={handleFilterByBotID}
                  options={botOptions}
                  value={botOptions.filter((option) => option.value == botID)}
                  placeholder={t(`fileManager.filterByBot`)}
                  focusBorderColor={bgColor}
                  chakraStyles={{
                    container: (provided) => ({
                      ...provided,
                      borderRadius: FILEMANAGER.SELECT.CONTAINER.BORDER.RADIUS,
                      w: FILEMANAGER.SELECT.CONTAINER.WIDTH,
                      background: panelBgColor,
                      cursor: FILEMANAGER.SELECT.CONTAINER.CURSOR,
                      border: FILEMANAGER.SELECT.CONTAINER.BORDER.TRANSPARENT,
                      color: descriptionColor
                    }),
                    dropdownIndicator: (provided) => ({
                      ...provided,
                      color: bgColor,
                      width: FILEMANAGER.SELECT.DROPDOWN.WIDTH,
                      background: panelBgColor,
                    }),
                    control: (provided) => ({
                      ...provided,
                      borderRadius: FILEMANAGER.SELECT.CONTROL.BORDER.RADIUS,
                    }),
                    menuList: (provided) => ({
                      ...provided,
                      bg: FILEMANAGER.SELECT.MENU.BG,
                      color: FILEMANAGER.SELECT.MENU.COLOR,
                      py: FILEMANAGER.SELECT.MENU.PADDING_Y,
                      borderRadius: FILEMANAGER.SELECT.MENU.BORDER.RADIUS,
                      background: panelBgColor,
                      _dark: {
                        "--menu-bg": backgroundColor,
                        "--menu-shadow": FILEMANAGER.SELECT.MENU.DARK.SHADOW
                      },
                      '&::-webkit-scrollbar': FILEMANAGER.SELECT.MENU.SCROLL_BAR.WEBKIT,
                      '-ms-overflow-style': FILEMANAGER.SELECT.MENU.SCROLL_BAR.MS_OVERFLOW,
                      'scrollbar-width': FILEMANAGER.SELECT.MENU.SCROLL_BAR.WIDTH
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
              </HStack>
            </VStack>
            <Tooltip label={
              canUpload || activeTab == FILEMANAGER.TAB.MYFILES
                ? ""
                : botID
                  ? t("fileManager.botExtensionDescription")
                  : t(`fileManager.botIdRequired`)
            } hasArrow={FILEMANAGER.UPLOAD_TOOLTIP.HAS_ARROW} p={FILEMANAGER.UPLOAD_TOOLTIP.PADDING}>
              <Button
                leftIcon={<AddIcon />}
                w={isMobile ? FILEMANAGER.WIDTH.FULL : null}
                bg={bgColor}
                color={FILEMANAGER.UPLOAD_BUTTON.COLOR}
                _hover={{
                  bg: hoverColor,
                }}
                onClick={onOpenModal}
                borderRadius={FILEMANAGER.UPLOAD_BUTTON.BORDER.RADIUS}
                isDisabled={!canUpload && activeTab != FILEMANAGER.TAB.MYFILES}
              >
                {t("fileManager.uploadFiles")}
              </Button>
            </Tooltip>
          </VStack>
        ) : (
          <Flex justify={FILEMANAGER.JUSTIFY.SPACE_BETWEEN} align={FILEMANAGER.ALIGN.CENTER} mb={FILEMANAGER.MARGIN.NORMAL}>
            <HStack spacing={FILEMANAGER.SPACING.LARGE} my={FILEMANAGER.MARGIN.NORMAL} w={FILEMANAGER.WIDTH.SEVENTY}>
              {user?.rol_key === UNI.ROLE.SUPERADMIN && companies.length > 0 && (
                <VStack w={FILEMANAGER.WIDTH.FULL} maxW={FILEMANAGER.FILTER.MAXWIDTH}>
                  <Heading size={FILEMANAGER.SIZE.MEDIUM}>{t("fileManager.selectCompany")}</Heading>
                  <SelectChakra
                    isSearchable={FILEMANAGER.SELECT.IS_SEARCHABLE}
                    onChange={handleFilterByCompany}
                    options={optionsCompany}
                    placeholder={t("bots.filterByCompany")}
                    defaultValue={{
                      value: user?.company_id,
                      label: (
                        <HStack>
                          <Text>
                            {
                              (
                                companies.find(
                                  (company) =>
                                    company.uuid_unique === user?.company_id
                                ) || {}
                              ).name
                            }
                          </Text>
                        </HStack>
                      ),
                    }}
                    focusBorderColor={bgColor}
                    chakraStyles={{
                      container: (provided) => ({
                        ...provided,
                        borderRadius: FILEMANAGER.SELECT.CONTAINER.BORDER.RADIUS,
                        w: FILEMANAGER.SELECT.CONTAINER.WIDTH,
                        background: panelBgColor,
                        cursor: FILEMANAGER.SELECT.CONTAINER.CURSOR,
                        border: FILEMANAGER.SELECT.CONTAINER.BORDER.TRANSPARENT,
                        color: descriptionColor
                      }),
                      dropdownIndicator: (provided) => ({
                        ...provided,
                        color: bgColor,
                        width: FILEMANAGER.SELECT.DROPDOWN.WIDTH,
                        background: panelBgColor,
                      }),
                      control: (provided) => ({
                        ...provided,
                        borderRadius: FILEMANAGER.SELECT.CONTROL.BORDER.RADIUS,
                      }),
                      menuList: (provided) => ({
                        ...provided,
                        bg: FILEMANAGER.SELECT.MENU.BG,
                        color: FILEMANAGER.SELECT.MENU.COLOR,
                        py: FILEMANAGER.SELECT.MENU.PADDING_Y,
                        borderRadius: FILEMANAGER.SELECT.MENU.BORDER.RADIUS,
                        background: panelBgColor,
                        _dark: {
                          "--menu-bg": backgroundColor,
                          "--menu-shadow": FILEMANAGER.SELECT.MENU.DARK.SHADOW
                        },
                        '&::-webkit-scrollbar': FILEMANAGER.SELECT.MENU.SCROLL_BAR.WEBKIT,
                        '-ms-overflow-style': FILEMANAGER.SELECT.MENU.SCROLL_BAR.MS_OVERFLOW,
                        'scrollbar-width': FILEMANAGER.SELECT.MENU.SCROLL_BAR.WIDTH
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
                </VStack>
              )}
              <VStack w={FILEMANAGER.WIDTH.FULL} maxW={FILEMANAGER.FILTER.MAXWIDTH}>
                <Heading size={FILEMANAGER.SIZE.MEDIUM}>{t("fileManager.selectBot")}</Heading>
                <SelectChakra
                  isSearchable={FILEMANAGER.SELECT.IS_SEARCHABLE}
                  onChange={handleFilterByBotID}
                  options={botOptions}
                  value={botOptions.filter((option) => option.value == botID)}
                  placeholder={t(`fileManager.filterByBot`)}
                  focusBorderColor={bgColor}
                  chakraStyles={{
                    container: (provided) => ({
                      ...provided,
                      borderRadius: FILEMANAGER.SELECT.CONTAINER.BORDER.RADIUS,
                      w: FILEMANAGER.SELECT.CONTAINER.WIDTH,
                      background: panelBgColor,
                      cursor: FILEMANAGER.SELECT.CONTAINER.CURSOR,
                      border: FILEMANAGER.SELECT.CONTAINER.BORDER.TRANSPARENT,
                      color: descriptionColor
                    }),
                    dropdownIndicator: (provided) => ({
                      ...provided,
                      color: bgColor,
                      width: FILEMANAGER.SELECT.DROPDOWN.WIDTH,
                      background: panelBgColor,
                    }),
                    control: (provided) => ({
                      ...provided,
                      borderRadius: FILEMANAGER.SELECT.CONTROL.BORDER.RADIUS,
                    }),
                    menuList: (provided) => ({
                      ...provided,
                      bg: FILEMANAGER.SELECT.MENU.BG,
                      color: FILEMANAGER.SELECT.MENU.COLOR,
                      py: FILEMANAGER.SELECT.MENU.PADDING_Y,
                      borderRadius: FILEMANAGER.SELECT.MENU.BORDER.RADIUS,
                      background: panelBgColor,
                      _dark: {
                        "--menu-bg": backgroundColor,
                        "--menu-shadow": FILEMANAGER.SELECT.MENU.DARK.SHADOW
                      },
                      '&::-webkit-scrollbar': FILEMANAGER.SELECT.MENU.SCROLL_BAR.WEBKIT,
                      '-ms-overflow-style': FILEMANAGER.SELECT.MENU.SCROLL_BAR.MS_OVERFLOW,
                      'scrollbar-width': FILEMANAGER.SELECT.MENU.SCROLL_BAR.WIDTH
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
              </VStack>
            </HStack>
            <Tooltip
              label={
                canUpload || activeTab == FILEMANAGER.TAB.MYFILES
                  ? ""
                  : botID
                    ? t("fileManager.botExtensionDescription")
                    : t(`fileManager.botIdRequired`)
              }
              hasArrow={FILEMANAGER.UPLOAD_TOOLTIP.HAS_ARROW}
              placement={FILEMANAGER.UPLOAD_TOOLTIP.PLACEMANT}
              p={FILEMANAGER.UPLOAD_TOOLTIP.PADDING}
            >
              <Button
                leftIcon={<AddIcon />}
                bg={bgColor}
                color={FILEMANAGER.UPLOAD_BUTTON.COLOR}
                _hover={{
                  bg: hoverColor,
                }}
                onClick={onOpenModal}
                borderRadius={FILEMANAGER.UPLOAD_BUTTON.BORDER.RADIUS}
                isDisabled={!canUpload && activeTab != FILEMANAGER.TAB.MYFILES}
              >
                {t("fileManager.uploadFiles")}
              </Button>
            </Tooltip>
          </Flex>
        )}

        <Box>
          <HStack>
            <TabButton
              text={t("fileManager.myFiles")}
              active={activeTab == FILEMANAGER.TAB.MYFILES}
              onClick={() => {
                setActiveTab(FILEMANAGER.TAB.MYFILES)
              }}
            />
            <TabButton
              text={t("fileManager.learn")}
              active={activeTab == FILEMANAGER.TAB.LEARNING}
              onClick={() => {
                setActiveTab(FILEMANAGER.TAB.LEARNING)
              }}
            />
          </HStack>
          <VStack
            align={FILEMANAGER.ALIGN.START}
            spacing={FILEMANAGER.SPACING.XLARGE}
            bg={panelBgColor}
            p={FILEMANAGER.PADDING.XLARGE}
            borderBottomRadius={FILEMANAGER.PANEL.BORDER.RADIUS}
            boxShadow={FILEMANAGER.PANEL.SHADOW}
          >
            {isMobile ? (
              <VStack w={FILEMANAGER.WIDTH.FULL}>
                <InputGroup
                  sx={{
                    background: backgroundColor,
                  }}
                  borderRadius={FILEMANAGER.SEARCH_BAR.BORDER.RADIUS}
                >
                  <InputLeftElement pointerEvents={FILEMANAGER.SEARCH_BAR.POINTER.EVENTS}>
                    <SearchIcon color={bgColor} />
                  </InputLeftElement>
                  <Input
                    placeholder={t("fileManager.inputSearch")}
                    pl={FILEMANAGER.SEARCH_BAR.PADDING_L}
                    border={FILEMANAGER.SEARCH_BAR.BORDER.VALUE}
                    borderColor={inputBorderColor}
                    _placeholder={FILEMANAGER.SEARCH_BAR.PLACE_HOLDER}
                    onChange={handleSearch}
                    focusBorderColor={bgColor}
                  />
                </InputGroup>
                {selectedFiles.length > 0 && (
                  <Button
                    my={FILEMANAGER.DELETE_BUTTON.MARGIN_Y}
                    bg={bgColor}
                    color={FILEMANAGER.DELETE_BUTTON.COLOR}
                    _hover={{
                      bg: hoverColor,
                    }}
                    w={FILEMANAGER.DELETE_BUTTON.WIDTH}
                    variant={FILEMANAGER.DELETE_BUTTON.VARIANT}
                    alignSelf={FILEMANAGER.DELETE_BUTTON.ALIGN_SELF}
                    leftIcon={<DeleteIcon />}
                    onClick={() => {
                      const selected = files.filter((f: FileType) =>
                        selectedFiles.includes(String(f.id))
                      );
                      setFileToDelete(selected);
                      onOpenDeleteModal();
                    }}
                  >
                    {t("fileManager.deleteSelected")} ({selectedFiles.length})
                  </Button>
                )}
                {activeTab == FILEMANAGER.TAB.LEARNING && (
                  <SelectChakra
                    isSearchable={FILEMANAGER.SELECT.IS_SEARCHABLE}
                    onChange={handleFilterByFileStatus}
                    options={optionsStatus}
                    value={optionsStatus.filter((option) => option.value == status)}
                    placeholder={t(`fileManager.filterByStatus`)}
                    focusBorderColor={bgColor}
                    chakraStyles={{
                      container: (provided) => ({
                        ...provided,
                        borderRadius: FILEMANAGER.SELECT.CONTAINER.BORDER.RADIUS,
                        w: FILEMANAGER.SELECT.CONTAINER.WIDTH,
                        background: panelBgColor,
                        cursor: FILEMANAGER.SELECT.CONTAINER.CURSOR,
                        color: descriptionColor
                      }),
                      dropdownIndicator: (provided) => ({
                        ...provided,
                        color: bgColor,
                        width: FILEMANAGER.SELECT.DROPDOWN.WIDTH,
                        background: panelBgColor,
                      }),
                      control: (provided) => ({
                        ...provided,
                        borderRadius: FILEMANAGER.SELECT.CONTROL.BORDER.RADIUS,
                      }),
                      menuList: (provided) => ({
                        ...provided,
                        bg: FILEMANAGER.SELECT.MENU.BG,
                        color: FILEMANAGER.SELECT.MENU.COLOR,
                        py: FILEMANAGER.SELECT.MENU.PADDING_Y,
                        borderRadius: FILEMANAGER.SELECT.MENU.BORDER.RADIUS,
                        background: panelBgColor,
                        _dark: {
                          "--menu-bg": backgroundColor,
                          "--menu-shadow": FILEMANAGER.SELECT.MENU.DARK.SHADOW
                        },
                        '&::-webkit-scrollbar': FILEMANAGER.SELECT.MENU.SCROLL_BAR.WEBKIT,
                        '-ms-overflow-style': FILEMANAGER.SELECT.MENU.SCROLL_BAR.MS_OVERFLOW,
                        'scrollbar-width': FILEMANAGER.SELECT.MENU.SCROLL_BAR.WIDTH
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
                )}

                <SelectChakra
                  isSearchable={FILEMANAGER.SELECT.IS_SEARCHABLE}
                  onChange={handleFilterByFileType}
                  isClearable={FILEMANAGER.SELECT.IS_CLEARABLE}
                  value={optionsFileTypes.filter((fileType) => fileType.value == type)}
                  options={optionsFileTypes}
                  placeholder={t(`fileManager.filterByFormat`)}
                  focusBorderColor={bgColor}
                  chakraStyles={{
                    container: (provided) => ({
                      ...provided,
                      borderRadius: FILEMANAGER.SELECT.CONTAINER.BORDER.RADIUS,
                      w: FILEMANAGER.SELECT.CONTAINER.WIDTH,
                      background: panelBgColor,
                      cursor: FILEMANAGER.SELECT.CONTAINER.CURSOR,
                      color: descriptionColor
                    }),
                    dropdownIndicator: (provided) => ({
                      ...provided,
                      color: bgColor,
                      width: FILEMANAGER.SELECT.DROPDOWN.WIDTH,
                      background: panelBgColor,
                    }),
                    control: (provided) => ({
                      ...provided,
                      borderRadius: FILEMANAGER.SELECT.CONTROL.BORDER.RADIUS,
                    }),
                    menuList: (provided) => ({
                      ...provided,
                      bg: FILEMANAGER.SELECT.MENU.BG,
                      color: FILEMANAGER.SELECT.MENU.COLOR,
                      py: FILEMANAGER.SELECT.MENU.PADDING_Y,
                      borderRadius: FILEMANAGER.SELECT.MENU.BORDER.RADIUS,
                      background: panelBgColor,
                      _dark: {
                        "--menu-bg": backgroundColor,
                        "--menu-shadow": FILEMANAGER.SELECT.MENU.DARK.SHADOW
                      },
                      '&::-webkit-scrollbar': FILEMANAGER.SELECT.MENU.SCROLL_BAR.WEBKIT,
                      '-ms-overflow-style': FILEMANAGER.SELECT.MENU.SCROLL_BAR.MS_OVERFLOW,
                      'scrollbar-width': FILEMANAGER.SELECT.MENU.SCROLL_BAR.WIDTH
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
              </VStack>
            ) : (
              <HStack spacing={FILEMANAGER.SPACING.LARGER} w={FILEMANAGER.WIDTH.FULL} justify={FILEMANAGER.JUSTIFY.SPACE_BETWEEN}>
                <VStack w={FILEMANAGER.SEARCH_BAR.WIDTH}>
                  <InputGroup
                    sx={{
                      background: backgroundColor,
                    }}
                    borderRadius={FILEMANAGER.SEARCH_BAR.BORDER.RADIUS}
                  >
                    <InputLeftElement pointerEvents={FILEMANAGER.SEARCH_BAR.POINTER.EVENTS}>
                      <SearchIcon color={bgColor} />
                    </InputLeftElement>
                    <Input
                      focusBorderColor={bgColor}
                      placeholder={t("fileManager.inputSearch")}
                      pl={FILEMANAGER.SEARCH_BAR.PADDING_L}
                      border={FILEMANAGER.SEARCH_BAR.BORDER.VALUE}
                      borderColor={inputBorderColor}
                      _placeholder={FILEMANAGER.SEARCH_BAR.PLACE_HOLDER}
                      onChange={handleSearch}
                    />
                  </InputGroup>
                  {selectedFiles.length > 0 && (
                    <Button
                      px={FILEMANAGER.DELETE_BUTTON.PADDING_X}
                      bg={bgColor}
                      color={FILEMANAGER.DELETE_BUTTON.COLOR}
                      _hover={{
                        bg: hoverColor,
                      }}
                      w={FILEMANAGER.DELETE_BUTTON.WIDTH}
                      variant={FILEMANAGER.DELETE_BUTTON.VARIANT}
                      alignSelf={FILEMANAGER.DELETE_BUTTON.ALIGN_SELF}
                      leftIcon={<DeleteIcon />}
                      onClick={() => {
                        const selected = files.filter((f: FileType) =>
                          selectedFiles.includes(String(f.id))
                        );
                        setFileToDelete(selected);
                        onOpenDeleteModal();
                      }}
                    >
                      {t("fileManager.deleteSelected")} ({selectedFiles.length})
                    </Button>
                  )}
                </VStack>

                <Box display={FILEMANAGER.FILTER.DIPLAY} flexDirection={FILEMANAGER.FILTER.FLEX_DIRECTION} gap={FILEMANAGER.FILTER.GAP} w={FILEMANAGER.FILTER.WIDTH}>
                  <SelectChakra
                    isSearchable={FILEMANAGER.SELECT.IS_SEARCHABLE}
                    isClearable={FILEMANAGER.SELECT.IS_CLEARABLE}
                    onChange={handleFilterByFileType}
                    value={optionsFileTypes.filter((fileType) => fileType.value == type)}
                    options={optionsFileTypes}
                    placeholder={t(`fileManager.filterByFormat`)}
                    focusBorderColor={bgColor}
                    chakraStyles={{
                      container: (provided) => ({
                        ...provided,
                        borderRadius: FILEMANAGER.SELECT.CONTAINER.BORDER.RADIUS,
                        w: FILEMANAGER.SELECT.CONTAINER.WIDTH,
                        background: panelBgColor,
                        cursor: FILEMANAGER.SELECT.CONTAINER.CURSOR,
                        color: descriptionColor
                      }),
                      dropdownIndicator: (provided) => ({
                        ...provided,
                        color: bgColor,
                        width: FILEMANAGER.SELECT.DROPDOWN.WIDTH,
                        background: panelBgColor,
                      }),
                      control: (provided) => ({
                        ...provided,
                        borderRadius: FILEMANAGER.SELECT.CONTROL.BORDER.RADIUS,
                      }),
                      menuList: (provided) => ({
                        ...provided,
                        bg: FILEMANAGER.SELECT.MENU.BG,
                        color: FILEMANAGER.SELECT.MENU.COLOR,
                        py: FILEMANAGER.SELECT.MENU.PADDING_Y,
                        borderRadius: FILEMANAGER.SELECT.MENU.BORDER.RADIUS,
                        background: panelBgColor,
                        _dark: {
                          "--menu-bg": backgroundColor,
                          "--menu-shadow": FILEMANAGER.SELECT.MENU.DARK.SHADOW
                        },
                        '&::-webkit-scrollbar': FILEMANAGER.SELECT.MENU.SCROLL_BAR.WEBKIT,
                        '-ms-overflow-style': FILEMANAGER.SELECT.MENU.SCROLL_BAR.MS_OVERFLOW,
                        'scrollbar-width': FILEMANAGER.SELECT.MENU.SCROLL_BAR.WIDTH
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
                  {activeTab == FILEMANAGER.TAB.LEARNING && (
                    <SelectChakra
                      isSearchable={false}
                      onChange={handleFilterByFileStatus}
                      options={optionsStatus}
                      value={optionsStatus.filter(
                        (option) => option.value == status
                      )}
                      placeholder={t(`fileManager.filterByStatus`)}
                      focusBorderColor={bgColor}
                      chakraStyles={{
                        container: (provided) => ({
                          ...provided,
                          borderRadius: FILEMANAGER.SELECT.CONTAINER.BORDER.RADIUS,
                          w: FILEMANAGER.SELECT.CONTAINER.WIDTH,
                          background: panelBgColor,
                          cursor: FILEMANAGER.SELECT.CONTAINER.CURSOR,
                          color: descriptionColor
                        }),
                        dropdownIndicator: (provided) => ({
                          ...provided,
                          color: bgColor,
                          width: FILEMANAGER.SELECT.DROPDOWN.WIDTH,
                          background: panelBgColor,
                        }),
                        control: (provided) => ({
                          ...provided,
                          borderRadius: FILEMANAGER.SELECT.CONTROL.BORDER.RADIUS,
                        }),
                        menuList: (provided) => ({
                          ...provided,
                          bg: FILEMANAGER.SELECT.MENU.BG,
                          color: FILEMANAGER.SELECT.MENU.COLOR,
                          py: FILEMANAGER.SELECT.MENU.PADDING_Y,
                          borderRadius: FILEMANAGER.SELECT.MENU.BORDER.RADIUS,
                          background: panelBgColor,
                          _dark: {
                            "--menu-bg": backgroundColor,
                            "--menu-shadow": FILEMANAGER.SELECT.MENU.DARK.SHADOW
                          },
                          '&::-webkit-scrollbar': FILEMANAGER.SELECT.MENU.SCROLL_BAR.WEBKIT,
                          '-ms-overflow-style': FILEMANAGER.SELECT.MENU.SCROLL_BAR.MS_OVERFLOW,
                          'scrollbar-width': FILEMANAGER.SELECT.MENU.SCROLL_BAR.WIDTH
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
                  )}
                </Box>
              </HStack>
            )}
            <SimpleGrid
              columns={
                loadingFiles || isLoading || files?.length == 0 || !files ? FILEMANAGER.FILES_GRID.EMPTY : FILEMANAGER.FILES_GRID.COLUMNS
              }
              gap={FILEMANAGER.FILES_GRID.GAP}
              w={FILEMANAGER.FILES_GRID.WIDTH}
            >
              {isLoading || loadingFiles ? (
                <Loading mode={FILEMANAGER.FILES_GRID.LOADING_MODE} />
              ) : files?.length > 0 ? (
                files?.map((file: FileType, index) => (
                  <FileCard
                    status={status}
                    key={index}
                    file={file}
                    isFileManager={true}
                    onOpenDeleteModal={onOpenDeleteModal}
                    onOpenRenameModal={onOpenRenameModal}
                    onOpenDisableModal={onOpenDisable_EnableModal}
                    setFileToDelete={setFileToDelete}
                    setFileToDisable_Enable={setFileToDisable_Enable}
                    setFileToRename={setFileToRename}
                    isSelected={selectedFiles.includes(String(file.id))}
                    onSelectChange={handleSelectFile}
                    setUrl={setUrl}
                    openView={onOpenView}
                  />
                ))
              ) : (
                <Text w={FILEMANAGER.WIDTH.HUNDRED} textAlign={FILEMANAGER.TEXT.CENTER}>
                  {botID || activeTab == FILEMANAGER.TAB.MYFILES ? t(`fileManager.noFilesFound`) : t(`fileManager.botIdRequired`)}
                </Text>
              )}
            </SimpleGrid>
          </VStack>
        </Box>
      </Container>
    </AppShell>
  );
};

const FileManager = ({ t }) => {
  // If the service is disabled, show the disabled component
  if (!FILE_MANAGER_ENABLED) {
    return <FileManagerDisabled />;
  }

  // If it is enabled, show the full File Manager
  return <FileManagerActive t={t} />;
};

export const getStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, [FILEMANAGER.COMMON])),
  },
});

export default withTranslation(FILEMANAGER.COMMON)(FileManager);
