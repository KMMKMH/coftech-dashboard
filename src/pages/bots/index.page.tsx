/* eslint-disable react-hooks/exhaustive-deps */
import {
  AddIcon,
  SearchIcon,
  ArrowUpIcon,
  ArrowDownIcon,
} from "@chakra-ui/icons";
import {
  useDisclosure,
  HStack,
  Container,
  Box,
  Flex,
  Button,
  InputGroup,
  InputLeftElement,
  Input,
  Alert,
  AlertIcon,
  Text,
  Avatar,
  useColorModeValue,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useBreakpointValue,
  InputRightElement,
  useToken,
  Switch,
  Spinner,
  useToast,
} from "@chakra-ui/react";
import { AppShell } from '@component/components/layout'
import { AppDispatch } from "@component/store";
import { useAuthStore } from "@component/store/auth";
import {
  GetAllBots,
  GetBotByIdentifier,
  GetBotsByCompany,
} from "@component/store/botsSlice";
import { companiesGet } from "@component/store/companySlice";
import { formatDate } from "@component/utils";
import { Select } from "chakra-react-select";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import { useState, useEffect, useMemo } from "react";
import { withTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";
import active from "../../assets/images/active.svg";
import disable from "../..//assets/images/disable.svg";
import Loading from "@component/components/Loading";
import NetworkIcon from "@component/components/NetworkIcon";

import StatusAvatar from "@component/components/StatusAvatar";

import { Table } from "@component/components/Table/Table";
import { Thead } from "@component/components/Table/Thead";
import { Tr } from "@component/components/Table/Tr";
import { Th } from "@component/components/Table/Th";
import { Tbody } from "@component/components/Table/Tbody";
import { Td } from "@component/components/Table/Td";
import useEmitterJoinRoom from "@component/hooks/useEmitterJoin";
import useCoftechColors from "@component/hooks/useCoftechColors";
import { resetFilters, setFilters } from "@component/store/filtersSlice";
import { useError } from "@component/utils/errorContext";
import { loadBotAction, resetQrExpired, resetQrGenerated } from "@component/store/Socket/socketSlice";
import useRemoveRoomFromCookie from "@component/hooks/useRemoveRoomFromCookie";
import { useEventInitializeMutation, useEventRestartMutation, useEventStartMutation, useLazyEventDeleteQuery, useLazyEventSuspendQuery, useLazyGetExtensionsQuery } from "@component/store/RTK/botsRTK";
import CoftechIconButton from "@component/components/CoftechIconButton";
import useCoftechSelect from "@component/hooks/useCoftechSelect";
import { BOT } from "@component/constants/bot";
import { UNI } from "@component/constants/universal";
import { ERROR } from "@component/constants/error";

const Bots = ({ t }) => {
  const dispatch: AppDispatch = useDispatch();
  const { user } = useAuthStore();
  const { showError } = useError();
  const toast = useToast()
  const router = useRouter();
  const { bots, loading, error: botsError } = useSelector((resp: any) => resp.bots);
  const { companies, error: companiesError } = useSelector(
    (state: any) => state.company
  );
  const isMobile = useBreakpointValue({ base: true, md: false });
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [loadingState, setLoadingState] = useState<string>("");
  const [action, setAction] = useState<string>("");
  const [qrScanned, setQrScanned] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [selectedCompanyId, setSelectedCompanyId] = useState(user?.company_id);
  const [selectedStatus, setSelectedStatus] = useState<number>(null);
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "" });
  const [filteredBots, setFilteredBots] = useState([]);

  const { emitterJoinRoom } = useEmitterJoinRoom();

  const { removeCookieRoom } = useRemoveRoomFromCookie()

  const { resolve, show } = useSelector((state: any) => state.socket.qr);
  const { resolve: actionResolve, type } = useSelector((state: any) => state.socket.action);

  const [triggerDelete] = useLazyEventDeleteQuery();
  const [triggerInitialize] = useEventInitializeMutation();
  const [triggerEventSuspend] = useLazyEventSuspendQuery();
  const [triggerStart] = useEventStartMutation();
  const [triggerRestart] = useEventRestartMutation();
  const [triggerExtensions] = useLazyGetExtensionsQuery();

  const filters = useSelector((state: any) => state.filters);

  const {
    bgColor,
    lightAccent,
    hoverColor,
    panelBgColor,
    backgroundColor,
    descriptionColor,
    textColor
  } = useCoftechColors();

  const {
    style
  } = useCoftechSelect();

  useEffect(() => {
    if (actionResolve && action && (type == BOT.EVENT.SUSPEND || type == BOT.EVENT.DELETE)) {
      setLoadingState("")
      toast({
        title: t("fileManager.success"),
        description: t(`bots.${action}Success`),
        status: BOT.TOAST.STATUS.SUCCESS,
        duration: BOT.TOAST.DURATION,
        isClosable: BOT.TOAST.IS_CLOSABLE,
      });
      dispatch(GetAllBots());
      setAction("")
    }
  }, [actionResolve])

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
    if (!show) {
      setLoadingState("");
    }
  }, [show])

  useEffect(() => {
    if (user?.company_id && user.rol_key === UNI.ROLE.SUPERADMIN) {
      dispatch(companiesGet());
      dispatch(GetAllBots());
    } else if (user?.company_id) {
      //@ts-ignore
      dispatch(GetBotsByCompany(user?.company_id));
    }
    setLoadingState("");
  }, [dispatch, user?.company_id, user?.rol_key, qrScanned]);

  useEffect(() => {
    if (user?.company_id && bots) {
      const filtered = bots.filter((bot) => bot.company_id === user.company_id);
      setFilteredBots(filtered);
    } else {
      setFilteredBots(bots);
    }
  }, [bots, user?.company_id]);

  const sortedAccounts = useMemo(() => {
    let sortableBots = [...filteredBots];
    if (sortConfig.key) {
      sortableBots.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === BOT.SORT.ASCENDING.TEXT ? BOT.SORT.ASCENDING.VALUE : BOT.SORT.DESCENDING.VALUE;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === BOT.SORT.ASCENDING.TEXT ? BOT.SORT.DESCENDING.VALUE : BOT.SORT.ASCENDING.VALUE;
        }
        return 0;
      });
    }
    return sortableBots;
  }, [filteredBots, sortConfig]);

  const requestSort = (key) => {
    let direction = BOT.SORT.ASCENDING.TEXT;
    if (sortConfig.key === key && sortConfig.direction === BOT.SORT.ASCENDING.TEXT) {
      direction = BOT.SORT.DESCENDING.TEXT;
    }
    setSortConfig({ key, direction });
  };

  const filteredAccounts = useMemo(
    () =>
      sortedAccounts.filter((account) =>
        account.name?.toLowerCase().includes(search.toLowerCase())
      ),
    [sortedAccounts, search]
  );

  const totalEntries = filteredAccounts.length;

  const currentAccounts = useMemo(
    () =>
      filteredAccounts.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      ),
    [filteredAccounts, currentPage, itemsPerPage]
  );

  const totalPages = Math.ceil(totalEntries / itemsPerPage);

  const handleFilterByCompany = (companyId) => {
    setSelectedCompanyId(companyId);
  };

  const handleFilterByStatus = (status: number) => {
    setSelectedStatus(status);
  };

  const isValidBot = (bot) => bot?.identifier?.length > 0;

  useEffect(() => {
    let filtered = [...bots];

    if (selectedCompanyId) {
      filtered = filtered.filter((bot) => bot.company_id === selectedCompanyId);
    }

    if (selectedStatus !== null) {
      switch (selectedStatus) {
        case BOT.STATUS.ACTIVATED:
          filtered = filtered.filter((bot) => bot.suspended === BOT.STATUS.NOT_SUSPENDED && isValidBot(bot));

          break;
        case BOT.STATUS.PAUSED:
          filtered = filtered.filter((bot) => bot?.suspended === BOT.STATUS.SUSPENDED && isValidBot(bot));

          break;
        case BOT.STATUS.DEACTIVATED:
          filtered = filtered.filter((bot) => !isValidBot(bot))

          break;
      }
    }

    setFilteredBots(filtered);
  }, [selectedCompanyId, selectedStatus, bots]);

  const checkOpenAIConfigured = async (botId) => {
    try {
      const response = await triggerExtensions(botId).unwrap();

      const llmCategories = new Set(['LLM']);
      const llmExtensions = response?.data?.filter(
        (ext) => llmCategories.has(ext.extension_category_name?.toUpperCase())
      );

      if (!llmExtensions?.length) {
        return false;
      }

      return llmExtensions.some(
        (ext) => ext.configs?.some(
          (config) => config.key?.endsWith('_KEY') && config.data?.trim()
        )
      );
    } catch (error) {
      console.error('Error checking OpenAI configured:', error);
      if (error.status === ERROR.BAD_REQUEST || error.status === ERROR.UNEXPECTED_ERROR) {
        showError(error.data?.message)
      } else {
        showError(error.error)
      }
      return false;
    }
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

  const optionsStatus = [
    {
      value: null,
      label: (
        <HStack>
          <Text>{t("bots.filterByStatus")}</Text>
        </HStack>
      ),
    },
    {
      value: BOT.STATUS.ACTIVATED,
      label: (
        <HStack>
          <Text>{t("bots.activated")}</Text>
        </HStack>
      ),
    },
    {
      value: BOT.STATUS.PAUSED,
      label: (
        <HStack>
          <Text>{t("bots.paused")}</Text>
        </HStack>
      ),
    },
    {
      value: BOT.STATUS.DEACTIVATED,
      label: (
        <HStack>
          <Text>{t("bots.deactivated")}</Text>
        </HStack>
      ),
    },
  ];

  const handleEvent = async (bot, event, trigger) => {
    switch (event) {
      case BOT.ACTION.ACTIVATE: {
        const isConfigured = await checkOpenAIConfigured(bot.uuid_unique);
        if (!isConfigured) {
          onOpen();
          return;
        }
        dispatch(resetQrGenerated())
        dispatch(resetQrExpired())
        break
      }
      case BOT.ACTION.DEACTIVATE: {
        dispatch(loadBotAction({ type: BOT.EVENT.SUSPEND, idBot: bot.uuid_unique }));
        break
      }
      case BOT.ACTION.START: {
        dispatch(loadBotAction({ type: BOT.EVENT.SUSPEND, idBot: bot.uuid_unique }));
        break
      }
      case BOT.ACTION.RESTART: {
        break
      }
      case BOT.ACTION.DELETE: {
        dispatch(loadBotAction({ type: BOT.EVENT.DELETE, idBot: bot.uuid_unique }));
        break
      }
    }

    setAction(event)
    removeCookieRoom()
    setLoadingState(bot.id);
    try {
      emitterJoinRoom(bot.uuid_unique);
      await trigger(bot.uuid_unique).unwrap();
      if (event == BOT.ACTION.RESTART) {
        setLoadingState("");
        removeCookieRoom();
        toast({
          title: t("fileManager.success"),
          description: t(`bots.${event}Success`),
          status: BOT.TOAST.STATUS.SUCCESS,
          duration: BOT.TOAST.DURATION,
          isClosable: BOT.TOAST.IS_CLOSABLE,
        });
      }
    } catch (error) {
      setLoadingState("");
      if (error.status === ERROR.BAD_REQUEST || error.status === ERROR.UNEXPECTED_ERROR) {
        showError(error.data?.message)
      } else {
        showError(error.error)
      }
    }
  }

  const handleBotEdit = async (bot: any) => {
    dispatch(setFilters({
      itemsPerPage: itemsPerPage,
      selectedCompanyId: selectedCompanyId,
      selectedStatus: selectedStatus,
      search: search
    }));
    router.push(`/bots/edit/${bot.company_id}/${bot.uuid_unique}`);
  };

  const handleBotConfigure = async (bot: any) => {
    dispatch(setFilters({
      itemsPerPage: itemsPerPage,
      selectedCompanyId: selectedCompanyId,
      selectedStatus: selectedStatus,
      search: search
    }));
    router.push(`/bots/configure/${bot.company_id}/${bot.uuid_unique}`);
  };

  useEffect(() => {
    if (resolve) {
      setRefreshing(true)
      setLoadingState("")
      setTimeout(() => {
        dispatch(GetAllBots());
        setRefreshing(false)
      }, BOT.QR_RESOLVE_TIMEOUT)
    }
  }, [resolve, dispatch]);

  useEffect(() => {
    if (filters && Object.keys(filters).length > 0 && bots.length > 0) {
      if (filters.itemsPerPage != null) setItemsPerPage(filters.itemsPerPage);
      if (filters.selectedCompanyId != null) handleFilterByCompany(filters.selectedCompanyId);
      if (filters.selectedStatus != null) handleFilterByStatus(filters.selectedStatus);
      if (filters.search != null) setSearch(filters.search);
      dispatch(resetFilters())
    }
  }, [bots]);

  return (
    <>
      <AppShell title={t("bots.title")}>
        <Container maxW={BOT.MAX_WIDTH.FULL} padding={BOT.MARGIN.ZERO}>
          <Box display={BOT.DISPLAY.FLEX} flexDirection={BOT.DISPLAY.DIRECTION.COLUMN} gap={BOT.GAP.REGULAR}>
            <Modal isOpen={isOpen} onClose={onClose} variant="coftechModal" isCentered>
              <ModalOverlay
                sx={{ 
                  background: BOT.MODAL.OPEN_AI.FALLBACK,
                  backdropFilter: BOT.MODAL.OPEN_AI.BACK_DROP,
                  WebkitBackdropFilter: BOT.MODAL.OPEN_AI.BACK_DROP,
                  transition: BOT.MODAL.OPEN_AI.TRANSITION,
                  zIndex: BOT.MODAL.OPEN_AI.Z_INDEX,
                }}
              />
              <ModalContent bg={panelBgColor} borderRadius={BOT.MODAL.OPEN_AI.BORDER.RADIUS}>
                <ModalHeader>{t("bots.openAIConfigRequired")}</ModalHeader>
                <ModalBody>
                  <Text>{t("bots.configureOpenAIMessage")}</Text>
                </ModalBody>
                <ModalFooter>
                  <Button onClick={onClose}>{t("bots.close")}</Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
            <Flex justify={BOT.DATA_PER_PAGE.JUSTIFY} mb={isMobile ? BOT.DATA_PER_PAGE.MARGIN_B.MOBILE : BOT.DATA_PER_PAGE.MARGIN_B.PC} alignItems={BOT.DATA_PER_PAGE.ALIGN}>
            </Flex>
            {!isMobile && (
              <HStack>
                <Text
                  position={BOT.DATA_PER_PAGE.POSITION}
                  top={BOT.DATA_PER_PAGE.TOP}
                  fontSize={BOT.DATA_PER_PAGE.SIZE.PC}
                  fontWeight={BOT.DATA_PER_PAGE.WEIGHT}
                  color={descriptionColor}
                >
                  {t("campaigns.dataPerPage")}
                </Text>
              </HStack>
            )}
            <HStack
              mb={BOT.MARGIN.REGULAR}
              justifyContent={BOT.JUSTIFY.CONTENT.SPACE_BETWEEN}
              flexWrap={isMobile ? BOT.DISPLAY.WRAP.FILTERS_DASH.MOBILE : BOT.DISPLAY.WRAP.FILTERS_DASH.PC}
              gap={isMobile ? BOT.GAP.FILTERS_DASH.MOBILE : BOT.GAP.FILTERS_DASH.PC}
            >
              <HStack gap={user?.rol_key == UNI.ROLE.SUPERADMIN ? BOT.GAP.COMPANY_FILTER.MOBILE : BOT.GAP.COMPANY_FILTER.PC} flexWrap={isMobile ? BOT.DISPLAY.WRAP.COMPANY_FILTER.MOBILE : BOT.DISPLAY.WRAP.COMPANY_FILTER.PC}>
                <HStack>
                  <Select
                    size={BOT.SELECT.SIZE}
                    isSearchable={false}
                    focusBorderColor={bgColor}
                    value={{
                      value: itemsPerPage,
                      label: itemsPerPage.toString(),
                    }}
                    onChange={(option) => setItemsPerPage(option.value)}
                    options={[
                      { value: BOT.DATA_PER_PAGE.LITTLE.VALUE, label: BOT.DATA_PER_PAGE.LITTLE.LABEL },
                      { value: BOT.DATA_PER_PAGE.MEDIUM.VALUE, label: BOT.DATA_PER_PAGE.MEDIUM.LABEL },
                      { value: BOT.DATA_PER_PAGE.LARGE.VALUE, label: BOT.DATA_PER_PAGE.LARGE.LABEL },
                    ]}
                    chakraStyles={style}
                  ></Select>
                  {isMobile && (
                    <Text
                      fontSize={BOT.DATA_PER_PAGE.SIZE.MOBILE}
                      fontWeight={BOT.DATA_PER_PAGE.WEIGHT}
                      color={descriptionColor}
                    >
                      {t("campaigns.dataPerPage")}
                    </Text>
                  )}
                </HStack>
                {user?.rol_key === UNI.ROLE.SUPERADMIN && companies.length > 0 && (
                  <Select
                    size={BOT.SELECT.SIZE}
                    isSearchable={false}
                    value={optionsCompany.find((option) => option.value === selectedCompanyId)}
                    onChange={(option) => handleFilterByCompany(option.value)}
                    options={optionsCompany}
                    focusBorderColor={bgColor}
                    chakraStyles={style}
                  />
                )}

                <Select
                  size={BOT.SELECT.SIZE}
                  value={optionsStatus.find((option) => option.value === selectedStatus)}
                  focusBorderColor={bgColor}
                  onChange={(option) => handleFilterByStatus(option.value)}
                  options={optionsStatus}
                  placeholder={t("bots.filterByStatus")}
                  isSearchable={false}
                  chakraStyles={style}
                />
                <InputGroup
                  size={BOT.SEARCH_BAR.SIZE}
                  sx={{
                    background: panelBgColor,
                    borderRadius: BOT.SEARCH_BAR.BORDER.RADIUS,
                    border: BOT.SEARCH_BAR.BORDER.TRANSPARENT,
                    width: BOT.SEARCH_BAR.WIDTH,
                  }}
                >
                  <InputRightElement pointerEvents={BOT.SEARCH_BAR.ICON.POINTER_EVENTS}>
                    <SearchIcon color={bgColor} />
                  </InputRightElement>
                  <Input
                    placeholder={t("bots.searchBots")}
                    focusBorderColor={bgColor}
                    borderRadius={BOT.SEARCH_BAR.TEXT_FIELD.BORDER.RADIUS}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </InputGroup>
              </HStack>
              <Button
                size={BOT.BUY_BOT_BUTTON.SIZE}
                display={BOT.BUY_BOT_BUTTON.DISPLAY}
                fontSize={BOT.BUY_BOT_BUTTON.FONT_SIZE}
                variant={BOT.BUY_BOT_BUTTON.VARIANT}
                bg={BOT.BUY_BOT_BUTTON.BACKGROUND}
                border={`${BOT.BUY_BOT_BUTTON.BORDER.VALUE} ${bgColor}`}
                onClick={() => router.push("https://shop.coftech.bot/")}
                _hover={{
                  bg: bgColor,
                  color: backgroundColor
                }}
                color={lightAccent}
                borderRadius={BOT.BUY_BOT_BUTTON.BORDER.RADIUS}
              >
                {t("bots.buyNewBot")}
              </Button>
            </HStack>
            {loading || refreshing ? (
              <Loading mode={BOT.LOADING_MODE} />
            ) : (
              <Box
                style={{
                  overflowY: BOT.TABLE.OVERFLOW_Y,
                }}
              >
                {filteredBots.length === 0 ? (
                  <Alert status={BOT.TABLE.ALERT.STATUS} borderRadius={BOT.TABLE.ALERT.BORDER.RADIUS}>
                    <AlertIcon />
                    {t("bots.notFound")}
                  </Alert>
                ) : (
                  <>
                    <Table
                      variant={BOT.TABLE.VARIANT}
                      w={BOT.TABLE.WIDTH}
                      className={BOT.TABLE.CSS_CLASS}
                    >
                      <Thead>
                        <Tr>
                          <Th fontWeight={BOT.TABLE.HEADERS.WEIGHT}>
                            {t("bots.identifier")}
                            <Button
                              onClick={() => requestSort(BOT.SORT.CONFIG.IDENTIFIER)}
                              size={BOT.TABLE.HEADERS.SORT.SIZE}
                              variant={BOT.TABLE.HEADERS.SORT.VARIANT}
                            >
                              {sortConfig.key === BOT.SORT.CONFIG.IDENTIFIER &&
                                sortConfig.direction === BOT.SORT.ASCENDING.TEXT ? (
                                <ArrowUpIcon color={bgColor} />
                              ) : (
                                <ArrowDownIcon color={bgColor} />
                              )}
                            </Button>
                          </Th>
                          <Th fontWeight={BOT.TABLE.HEADERS.WEIGHT}>
                            {t("bots.alias")}
                            <Button
                              onClick={() => requestSort(BOT.SORT.CONFIG.NAME)}
                              size={BOT.TABLE.HEADERS.SORT.SIZE}
                              variant={BOT.TABLE.HEADERS.SORT.VARIANT}
                            >
                              {sortConfig.key === BOT.SORT.CONFIG.NAME &&
                                sortConfig.direction === BOT.SORT.ASCENDING.TEXT ? (
                                <ArrowUpIcon color={bgColor} />
                              ) : (
                                <ArrowDownIcon color={bgColor} />
                              )}
                            </Button>
                          </Th>
                          <Th fontWeight={BOT.TABLE.HEADERS.WEIGHT}>
                            {t("bots.admissionDate")}
                            <Button
                              onClick={() => requestSort(BOT.SORT.CONFIG.CREATION_DATE)}
                              size={BOT.TABLE.HEADERS.SORT.SIZE}
                              variant={BOT.TABLE.HEADERS.SORT.VARIANT}
                            >
                              {sortConfig.key === BOT.SORT.CONFIG.CREATION_DATE &&
                                sortConfig.direction === BOT.SORT.ASCENDING.TEXT ? (
                                <ArrowUpIcon color={bgColor} />
                              ) : (
                                <ArrowDownIcon color={bgColor} />
                              )}
                            </Button>
                          </Th>
                          <Th fontWeight={BOT.TABLE.HEADERS.WEIGHT}>
                            {t("bots.status")}
                            <Button
                              onClick={() => requestSort(BOT.SORT.CONFIG.STATUS)}
                              size={BOT.TABLE.HEADERS.SORT.SIZE}
                              variant={BOT.TABLE.HEADERS.SORT.VARIANT}
                            >
                              {sortConfig.key === BOT.SORT.CONFIG.STATUS &&
                                sortConfig.direction === BOT.SORT.ASCENDING.TEXT ? (
                                <ArrowUpIcon color={bgColor} />
                              ) : (
                                <ArrowDownIcon color={bgColor} />
                              )}
                            </Button>
                          </Th>
                          <Th fontWeight={BOT.TABLE.HEADERS.WEIGHT}>{t("bots.actions")}</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {currentAccounts.map((account) => {
                          const activated = account?.suspended === BOT.STATUS.NOT_SUSPENDED && account?.identifier?.length > 0
                          const paused = account?.suspended === BOT.STATUS.SUSPENDED && account?.identifier?.length > 0
                          const deactivated = !activated && !paused
                          const inAction = loadingState != account?.id && Boolean(loadingState)
                          const onOff = action == BOT.ACTION.ACTIVATE || action == BOT.ACTION.DEACTIVATE || action == BOT.ACTION.START
                          return (
                            <Tr key={account.uuid_unique}>
                              <Td>
                                <Box
                                  display={BOT.TABLE.IDENTIFIER.DISPLAY}
                                  alignItems={BOT.TABLE.IDENTIFIER.ALIGN.ITEMS}
                                  gap={BOT.TABLE.IDENTIFIER.GAP}
                                >
                                  <>
                                    <Box position={BOT.TABLE.IDENTIFIER.AVATAR.POSITION}>
                                      {account?.photo &&
                                        account?.photo.length > 0 ? (
                                        <StatusAvatar
                                          name={BOT.TABLE.IDENTIFIER.AVATAR.NAME}
                                          src={account.photo}
                                          status={
                                            account.suspended
                                              ? BOT.TABLE.IDENTIFIER.AVATAR.SUSPENDED
                                              : BOT.TABLE.IDENTIFIER.AVATAR.ACTIVATED
                                          }
                                          style={{
                                            borderRadius: BOT.TABLE.IDENTIFIER.AVATAR.BORDER.RADIUS,
                                            height: BOT.TABLE.IDENTIFIER.AVATAR.SIZE,
                                            width: BOT.TABLE.IDENTIFIER.AVATAR.SIZE,
                                            margin: BOT.TABLE.IDENTIFIER.AVATAR.MARGIN,
                                          }}
                                        />
                                      ) : (
                                        <Avatar size={BOT.TABLE.IDENTIFIER.AVATAR.NO_PICTURE.SIZE} src="" />
                                      )}
                                      <Box
                                        position={BOT.TABLE.IDENTIFIER.AVATAR.NETWORK_ICON.POSITION}
                                        bottom={BOT.TABLE.IDENTIFIER.AVATAR.NETWORK_ICON.BOTTOM}
                                        right={BOT.TABLE.IDENTIFIER.AVATAR.NETWORK_ICON.RIGHT}
                                        bg={BOT.TABLE.IDENTIFIER.AVATAR.NETWORK_ICON.BACKGROUND}
                                        borderRadius={BOT.TABLE.IDENTIFIER.AVATAR.NETWORK_ICON.BORDER.RADIUS}
                                        p={BOT.TABLE.IDENTIFIER.AVATAR.NETWORK_ICON.PADDING}
                                      >
                                        {(true || account.network_key) && (
                                          <NetworkIcon
                                            network={account.network_key || BOT.TABLE.IDENTIFIER.AVATAR.NETWORK_ICON.ALTERNATIVE}
                                          />
                                        )}
                                      </Box>
                                    </Box>
                                    {account.identifier}
                                  </>
                                </Box>
                              </Td>
                              <Td>{account?.name}</Td>
                              <Td>{formatDate(account?.created_at)}</Td>
                              <Td>
                                <HStack display={BOT.TABLE.STATUS.DISPLAY}>
                                  <Text>
                                    {activated ? t("bots.activated") : paused ? t("bots.paused") : t("bots.deactivated")}
                                  </Text>
                                </HStack>
                              </Td>
                              <Td>
                                <Box display={BOT.TABLE.ACTIONS.DISPLAY} gap={BOT.TABLE.ACTIONS.GAP}>
                                  <CoftechIconButton
                                    disabled={inAction || (loadingState == account.id && !onOff)}
                                    loading={loadingState == account.id && onOff}
                                    icon={activated ? BOT.TABLE.ACTIONS.ICON.PAUSE : BOT.TABLE.ACTIONS.ICON.START_ACTIVATE}
                                    onClick={activated ? () => { handleEvent(account, BOT.ACTION.DEACTIVATE, triggerEventSuspend) } : paused ? () => { handleEvent(account, BOT.ACTION.START, triggerStart) } : () => { handleEvent(account, BOT.ACTION.ACTIVATE, triggerInitialize) }}
                                  />
                                  {activated && (
                                    <CoftechIconButton
                                      disabled={inAction || (loadingState == account.id && action != BOT.ACTION.RESTART)}
                                      loading={loadingState == account.id && action == BOT.ACTION.RESTART}
                                      icon={BOT.TABLE.ACTIONS.ICON.RESTART}
                                      onClick={() => { handleEvent(account, BOT.ACTION.RESTART, triggerRestart) }}
                                    />
                                  )}
                                  <CoftechIconButton
                                    disabled={inAction || loadingState == account.id}
                                    icon={BOT.TABLE.ACTIONS.ICON.EDIT}
                                    onClick={() => { handleBotEdit(account) }}
                                  />
                                  <CoftechIconButton
                                    disabled={inAction || loadingState == account.id}
                                    icon={BOT.TABLE.ACTIONS.ICON.CONFIGURE}
                                    onClick={() => { handleBotConfigure(account) }}
                                  />
                                  <CoftechIconButton
                                    disabled={inAction || (loadingState == account.id && action != BOT.ACTION.DELETE) || deactivated}
                                    loading={loadingState == account.id && action == BOT.ACTION.DELETE}
                                    icon={BOT.TABLE.ACTIONS.ICON.DELETE}
                                    onClick={() => { handleEvent(account, BOT.ACTION.DELETE, triggerDelete) }}
                                  />
                                </Box>
                              </Td>
                            </Tr>
                          )
                        })}
                      </Tbody>
                    </Table>
                  </>
                )}
              </Box>
            )}
            <Box
              display={BOT.PAGINATION.DISPLAY}
              justifyContent={BOT.PAGINATION.JUSTIFY.CONTENT}
              mt={BOT.PAGINATION.MARGIN_T}
              flexWrap={BOT.PAGINATION.WRAP}
              gap={BOT.PAGINATION.GAP}
            >
              <Text fontSize={BOT.PAGINATION.SIZE} fontWeight={BOT.PAGINATION.WEIGHT} color={descriptionColor}>
                {t("campaigns.showing")} {currentAccounts.length}{" "}
                {t("campaigns.of")} {totalEntries} {t("campaigns.entries")}
              </Text>
              <HStack>
                <Button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, BOT.PAGINATION.FIRST_PAGE))
                  }
                  disabled={currentPage === BOT.PAGINATION.FIRST_PAGE}
                >
                  {t("campaigns.previous")}
                </Button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <Button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      variant={page === currentPage ? BOT.PAGINATION.VARIANT.ACTIVE : BOT.PAGINATION.VARIANT.INACTIVE}
                    >
                      {page}
                    </Button>
                  )
                )}
                <Button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                >
                  {t("campaigns.next")}
                </Button>
              </HStack>
            </Box>
          </Box>
        </Container >
      </AppShell >
    </>
  );
};

export const getStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, [BOT.COMMON])),
  },
});

export default withTranslation(BOT.COMMON)(Bots);
