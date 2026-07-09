/* eslint-disable react-hooks/exhaustive-deps */
import Head from "next/head";
import Image from "next/image";
import {
  Container,
  Flex,
  HStack,
  Text,
  Button,
  Box,
  Avatar,
  InputGroup,
  Input,
  Spinner,
  useBreakpointValue,
  Switch,
  InputRightElement,
} from "@chakra-ui/react";
import { AppShell } from '@component/components/layout'
import React, { useEffect, useState, useMemo, use } from "react";
import { useAuthStore } from "@component/store/auth";
import { formatDate } from "@component/utils";
import {
  AddIcon,
  ArrowDownIcon,
  ArrowUpIcon,
  SearchIcon,
} from "@chakra-ui/icons";
import { withTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import active from "../../assets/images/active.svg";
import disable from "../../assets/images/disable.svg";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@component/store";
import { Select } from "chakra-react-select";
import { Edit01, Trash01 } from "@untitled-ui/icons-react";
import DeletePromptModal from "@component/components/DeletePromptModal";
import { companiesGet, GetCompanyById } from "@component/store/companySlice";
import { Table } from "@component/components/Table/Table";
import { Thead } from "@component/components/Table/Thead";
import { Tr } from "@component/components/Table/Tr";
import { Th } from "@component/components/Table/Th";
import { Tbody } from "@component/components/Table/Tbody";
import { Td } from "@component/components/Table/Td";
import useCoftechColors from "@component/hooks/useCoftechColors";
import { resetFilters, setFilters } from "@component/store/filtersSlice";
import { GetBotsByCompany } from "@component/store/botsSlice";
import useCoftechSelect from "@component/hooks/useCoftechSelect";
import { useDeletePromptMutation, useLazyGetPromptsQuery, useSetPromptStatusMutation } from "@component/store/RTK/promptsRTK";
import useErrorHandler from "@component/hooks/useErrorHandler";

const Home = ({ t }) => {
  const dispatch: AppDispatch = useDispatch();
  const { user } = useAuthStore();
  const { handleError } = useErrorHandler();
  const router = useRouter();
  const [triggerPrompts, { data: prompts, isFetching: loading, error: promptsError }] = useLazyGetPromptsQuery();
  const { companies, loading: loadingCompanies, error: companiesError } = useSelector(
    (state: any) => state.company
  );
  const isMobile = useBreakpointValue({ base: true, md: false });
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "" });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [promptToDelete, setPromptToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [statusFilter, setStatusFilter] = useState(null);
  const [companyFilter, setCompanyFilter] = useState(user?.company_id || null);
  const [botFilter, setBotFilter] = useState<any>(null);
  const [status, setStatus] = useState<number>(-1);
  const [loadingActive, setLoadingActive] = useState<number>(-1)
  const filters = useSelector((state: any) => state.filters);
  const { bots, error: botsError } = useSelector((state: any) => state.bots)
  const [triggerDelete] = useDeletePromptMutation();
  const [triggerStatusUpdate] = useSetPromptStatusMutation();


  const {
    bgColor,
    hoverColor,
    panelBgColor,
    backgroundColor,
    descriptionColor,
    iconColor,
  } = useCoftechColors();

  const {
    style
  } = useCoftechSelect();

  useEffect(() => {
    if (user?.rol_key === "SUPERADMIN") {
      dispatch(companiesGet());
    } else if (user?.company_id) {
      //@ts-ignore
      dispatch(GetCompanyById(user?.company_id));
    }
  }, [dispatch, companyFilter, user?.company_id, user?.rol_key, filters]);

  useEffect(() => {
    if (filters && Object.keys(filters).length > 0 && prompts?.data.length > 0) {
      if (filters.itemsPerPage != null) setItemsPerPage(filters.itemsPerPage);
      if (filters.companyFilter != null && botFilter != null) {
        triggerPrompts({ companyID: filters.companyFilter, botID: botFilter });
        setCompanyFilter(filters.companyFilter);
      }
      if (filters.statusFilter != null) setStatusFilter(filters.statusFilter);
      if (filters.search != null && filters.search != "") setSearch(filters.search);
      dispatch(resetFilters())
    }
  }, [prompts]);

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
    if (promptsError) {
      handleError(promptsError, { companyID: companyFilter, botID: botFilter })
    }
  }, [promptsError])

  useEffect(() => {
    if (prompts && prompts?.data?.length > 0) {
      prompts?.data.map((prompt) => {
        if (prompt.status == 1) {
          setStatus(prompt.uuid_unique)
        }
      })
    }
  }, [prompts])

  const filteredPrompts = useMemo(() => {
    if (prompts && prompts?.data?.length > 0) {
      let sortablePrompts = [...(prompts?.data)];

      if (sortConfig.key) {
        sortablePrompts.sort((a, b) => {
          if (a[sortConfig.key] < b[sortConfig.key]) {
            return sortConfig.direction === "ascending" ? -1 : 1;
          }
          if (a[sortConfig.key] > b[sortConfig.key]) {
            return sortConfig.direction === "ascending" ? 1 : -1;
          }
          return 0;
        });
      }

      return sortablePrompts.filter((prompt) => {
        const matchesSearch = prompt.name
          ?.toLowerCase()
          .includes(search.toLowerCase());
        const matchesStatus =
          statusFilter === null || prompt.status === Number(statusFilter);
        const matchesCompany =
          companyFilter === null || prompt.company_id === companyFilter;
        return matchesSearch && matchesStatus && matchesCompany;
      });
    } else {
      return []
    }
  }, [prompts, sortConfig, search, statusFilter, companyFilter]);

  const totalPages = Math.ceil(filteredPrompts.length / itemsPerPage);
  const currentPrompts = filteredPrompts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    if (companyFilter) {
      dispatch(GetBotsByCompany(companyFilter))
    }
  }, [companyFilter])

  useEffect(() => {
    if (bots) {
      if (bots[0]?.company_id == companyFilter)
        setBotFilter(bots[0]?.uuid_unique)
    }
  }, [bots])

  useEffect(() => {
    if (botFilter) {
      triggerPrompts({ companyID: companyFilter, botID: botFilter });
    }
  }, [botFilter])

  const optionsBots = (bots || []).map((bot) => {
    return {
      value: bot.uuid_unique,
      label: (
        <HStack>
          <Text>{bot.name}</Text>
        </HStack>
      ),
    }
  }
  )

  const optionsStatus = [
    {
      value: "1",
      label: (
        <HStack>
          <Image src={active} alt="activated" />
          <Text>{t("prompt.activated")}</Text>
        </HStack>
      ),
    },
    {
      value: "0",
      label: (
        <HStack>
          <Image src={disable} alt="inactivated" />
          <Text>{t("prompt.inactivated")}</Text>
        </HStack>
      ),
    },
  ];

  const handleDeletePrompt = (prompt) => {
    setPromptToDelete(prompt);
    setIsModalOpen(true);
  };

  const handleEditPrompt = (prompt) => {
    dispatch(setFilters({
      itemsPerPage,
      companyFilter,
      statusFilter,
      search
    }));
    router.push(
      `/prompts/${prompt.company_id}/${prompt.bot_id}/${prompt.uuid_unique}`
    )
  }

  const confirmDeletePrompt = async () => {
    if (promptToDelete) {
      setIsDeleting(true);
      try {
        await triggerDelete({ companyID: promptToDelete.company_id, promptID: promptToDelete.uuid_unique, botID: promptToDelete.bot_id }).unwrap();
        triggerPrompts({ companyID: companyFilter, botID: botFilter });
        setIsModalOpen(false);
      } catch (error) {
        handleError(error, { companyID: promptToDelete.company_id, promptID: promptToDelete.uuid_unique, botID: promptToDelete.bot_id })
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const handleFilterByCompany = (option) => {
    setCompanyFilter(option ? option.value : null);
  };

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

  const handleSwitch = async (prompt) => {
    setLoadingActive(prompt.uuid_unique)
    try {
      const prev = status;
      if (prev != prompt.uuid_unique) {
        await triggerStatusUpdate({ companyID: companyFilter, botID: botFilter, promptID: prompt.uuid_unique, status: true }).unwrap();
        setStatus(prompt.uuid_unique)
      } else {
        await triggerStatusUpdate({ companyID: companyFilter, botID: botFilter, promptID: prompt.uuid_unique, status: false }).unwrap();
        setStatus(-1)
      }

    } catch (error) {
      handleError(error, { companyID: companyFilter, botID: botFilter, promptID: prompt.uuid_unique, status: "boolean" })
    } finally {
      setLoadingActive(-1)
    }
  }

  return (
    <>
      <AppShell title={t("prompt.title")}>
        <Container maxW="full" padding={0}>
          <Box display="flex" flexDirection="column" gap={4}>
            <Flex justify="end" mb={isMobile ? 4 : null}>
            </Flex>
            {!isMobile && (
              <HStack>
                <Text
                  position={"absolute"}
                  top={145}
                  fontSize={10}
                  fontWeight={500}
                  color={descriptionColor}
                >
                  {t("campaigns.dataPerPage")}
                </Text>
              </HStack>
            )}
            <HStack
              mb={4}
              justifyContent={"space-between"}
              flexWrap={isMobile ? { base: "wrap" } : null}
              gap={isMobile ? 5 : null}
            >
              <HStack gap={user?.rol_key == "SUPERADMIN" ? 2 : 5} flexWrap={{ base: "wrap" }}>
                <HStack>
                  <Select
                    size={"sm"}
                    focusBorderColor={bgColor}
                    value={{
                      value: itemsPerPage,
                      label: itemsPerPage.toString(),
                    }}
                    isSearchable={false}
                    onChange={(option) => setItemsPerPage(option.value)}
                    options={[
                      { value: 20, label: "20" },
                      { value: 50, label: "50" },
                      { value: 100, label: "100" },
                    ]}
                    chakraStyles={style}
                  ></Select>
                  {isMobile && (
                    <Text
                      fontSize={12}
                      fontWeight={500}
                      color={descriptionColor}
                    >
                      {t("campaigns.dataPerPage")}
                    </Text>
                  )}
                </HStack>
                {user?.rol_key === "SUPERADMIN" && companies.length > 0 && (
                  <Box w={"full"} maxW={isMobile ? null : "fit-content"}>
                    <Select
                      size={"sm"}
                      focusBorderColor={bgColor}
                      value={optionsCompanies.find((option) => option.value === companyFilter)}
                      isSearchable={false}
                      onChange={handleFilterByCompany}
                      options={optionsCompanies}
                      placeholder={t("users.filterByCompany")}
                      chakraStyles={style}
                    />
                  </Box>
                )}
                <Box w={"full"} maxW={isMobile ? null : "fit-content"}>
                  <Select
                    size={"sm"}
                    focusBorderColor={bgColor}
                    value={optionsBots.find((option) => option.value === botFilter)}
                    options={optionsBots}
                    placeholder={t("fileManager.filterByBot")}
                    onChange={(option) => setBotFilter(option?.value || null)}
                    isSearchable={false}
                    chakraStyles={style}
                  />
                </Box>
                <Box w={"full"} maxW={isMobile ? null : "fit-content"}>
                  <Select
                    size={"sm"}
                    focusBorderColor={bgColor}
                    value={optionsStatus.find((option) => option.value === statusFilter)}
                    options={optionsStatus}
                    placeholder={t("users.filterByStatus")}
                    onChange={(option) => setStatusFilter(option?.value || null)}
                    isSearchable={false}
                    chakraStyles={style}
                  />
                </Box>
                <InputGroup
                  size={"sm"}
                  sx={{
                    background: panelBgColor,
                    borderRadius: "20px",
                    border: "1px transparent",
                    width: { base: "100%", md: "230px" },
                  }}
                >
                  <InputRightElement pointerEvents="none">
                    <SearchIcon color={bgColor} />
                  </InputRightElement>
                  <Input
                    placeholder={t(`prompt.search`)}
                    focusBorderColor={bgColor}
                    borderRadius={"20px"}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </InputGroup>
              </HStack>
              <Button
                size={"sm"}
                fontSize={"12px"}
                leftIcon={<AddIcon />}
                bg={bgColor}
                onClick={() => router.push("/prompts/new")}
                _hover={{ bg: hoverColor }}
                color="white"
                borderRadius={20}
              >
                <Text overflow={"hidden"}>
                  {t(`prompt.create`)}
                </Text>
              </Button>
            </HStack>
            {loading ? (
              <Flex justify="center" align="center" h="200px">
                <Spinner size="xl" color={bgColor} />
              </Flex>
            ) : (
              <Box
                style={{
                  overflowY: "auto",
                }}
              >
                <Table variant="simple" w={"full"} className="responsiveTable" borderTopRadius={"25px"}>
                  <Thead>
                    <Tr>
                      <Th>
                        {t(`prompt.promptNameHeader`)}
                        <Button
                          onClick={() => requestSort("name")}
                          size="xs"
                          variant="ghost"
                        >
                          {sortConfig.key === "name" &&
                            sortConfig.direction === "ascending" ? (
                            <ArrowUpIcon color={bgColor} />
                          ) : (
                            <ArrowDownIcon color={bgColor} />
                          )}
                        </Button>
                      </Th>
                      <Th>
                        {t(`prompt.botID`)}
                        <Button
                          onClick={() => requestSort("bot_id")}
                          size="xs"
                          variant="ghost"
                        >
                          {sortConfig.key === "bot_id" &&
                            sortConfig.direction === "ascending" ? (
                            <ArrowUpIcon color={bgColor} />
                          ) : (
                            <ArrowDownIcon color={bgColor} />
                          )}
                        </Button>
                      </Th>
                      <Th>
                        {t(`prompt.date`)}
                        <Button
                          onClick={() => requestSort("created_at")}
                          size="xs"
                          variant="ghost"
                        >
                          {sortConfig.key === "created_at" &&
                            sortConfig.direction === "ascending" ? (
                            <ArrowUpIcon color={bgColor} />
                          ) : (
                            <ArrowDownIcon color={bgColor} />
                          )}
                        </Button>
                      </Th>
                      <Th>
                        {t(`prompt.state`)}
                        <Button
                          onClick={() => requestSort("status")}
                          size="xs"
                          variant="ghost"
                        >
                          {sortConfig.key === "status" &&
                            sortConfig.direction === "ascending" ? (
                            <ArrowUpIcon color={bgColor} />
                          ) : (
                            <ArrowDownIcon color={bgColor} />
                          )}
                        </Button>
                      </Th>
                      <Th>{t(`prompt.actions`)}</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {currentPrompts.length > 0 ? (
                      currentPrompts.map((prompt, index) => {
                        return (
                          <Tr key={prompt.uuid_unique}>
                            <Td>{prompt.name}</Td>
                            <Td>
                              <HStack>
                                <Avatar size="xs" src={prompt?.bot_photo} />
                                <Text>{prompt.bot_name}</Text>
                              </HStack>
                            </Td>
                            <Td>
                              {formatDate(prompt.created_at)}
                            </Td>
                            <Td>
                              <Box
                                display="flex"
                                alignItems="center"
                                gap="12px"
                                justifyContent="center"
                                padding="2px 6px"
                                width="170px"
                              >
                                {loadingActive == prompt.uuid_unique ? (
                                  <Flex justify="center" align="center" h="20px" mr={"auto"}>
                                    <Spinner size="sm" color={bgColor} />
                                  </Flex>
                                ) : (
                                  <Switch
                                    mr={"auto"}
                                    isChecked={status == prompt.uuid_unique}
                                    onChange={() => handleSwitch(prompt)}
                                    sx={{
                                      '&[data-checked] span.chakra-switch__track': {
                                        backgroundColor: bgColor,
                                      },
                                    }}
                                  />
                                )}
                                {status == prompt.uuid_unique
                                  ? t("prompt.activated")
                                  : t("prompt.inactivated")}
                              </Box>
                            </Td>
                            <Td>
                              <Box display={"flex"} gap={4}>
                                <Box
                                  display="flex"
                                  alignItems="center"
                                  p={2}
                                  borderRadius={8}
                                  background={backgroundColor}
                                  onClick={() => handleDeletePrompt(prompt)}
                                  style={{ cursor: "pointer" }}
                                >
                                  <Trash01 color={iconColor} />
                                </Box>
                                <Box
                                  display="flex"
                                  alignItems="center"
                                  p={2}
                                  borderRadius={8}
                                  background={backgroundColor}
                                  onClick={() => handleEditPrompt(prompt)}
                                  style={{ cursor: "pointer" }}
                                >
                                  <Edit01 color={iconColor} />
                                </Box>
                              </Box>
                            </Td>
                          </Tr>
                        )
                      })
                    ) : (
                      <Tr>
                        <Td colSpan={5}>
                          <Text textAlign="center" color="gray.500">
                            {t("prompt.notFound")}
                          </Text>
                        </Td>
                      </Tr>
                    )}
                  </Tbody>
                </Table>
              </Box>
            )}
            <Box
              display="flex"
              justifyContent="space-between"
              mt={4}
              flexWrap={"wrap"}
              gap={"8px"}
            >
              <Text fontSize={16} fontWeight={500} color={descriptionColor}>
                {t("campaigns.showing")} {currentPrompts.length}{" "}
                {t("campaigns.of")} {filteredPrompts.length}{" "}
                {t("campaigns.entries")}
              </Text>
              <HStack>
                <Button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                >
                  {t("campaigns.previous")}
                </Button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <Button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      variant={page === currentPage ? "solid" : "outline"}
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
        </Container>
      </AppShell>

      <DeletePromptModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onDelete={confirmDeletePrompt}
        username={promptToDelete?.name}
        isDeleting={isDeleting}
      />
    </>
  );
};

export const getStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common"])),
  },
});

export default withTranslation("common")(Home);
