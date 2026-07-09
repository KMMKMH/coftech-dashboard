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
  InputGroup,
  InputLeftElement,
  Input,
  Spinner,
} from "@chakra-ui/react";
import { AppShell } from '@component/components/layout'
import React, { useEffect, useState, useMemo } from "react";
import { useAuthStore } from "@component/store/auth";
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
import { Table } from "@component/components/Table/Table";
import { Thead } from "@component/components/Table/Thead";
import { Tr } from "@component/components/Table/Tr";
import { Th } from "@component/components/Table/Th";
import { Tbody } from "@component/components/Table/Tbody";
import { Td } from "@component/components/Table/Td";
import useCoftechColors from "@component/hooks/useCoftechColors";
import { GetAllBots } from "@component/store/botsSlice";
import { resetFilters, setFilters } from "@component/store/filtersSlice";
import { useError } from "@component/utils/errorContext";

const NPS = ({ t }) => {
  const dispatch: AppDispatch = useDispatch();
  const { token, user } = useAuthStore();
  const router = useRouter();
  const { showError } = useError();
  const { companies } = useSelector((state: any) => state.company);
  const { bots, loading: loadingCompanies, error: botsError } = useSelector(
    (state: any) => state.bots
  );
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "" });
  const [statusFilter, setStatusFilter] = useState(null);
  const [botFilter, setBotFilter] = useState(user?.company_id || null);
  const [filteredBots, setFilteredBots] = useState([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState(user?.company_id);
  const [selectedBotId, setSelectedBotId] = useState(null);
  const filters = useSelector((state: any) => state.filters);

  const {
    bgColor,
    hoverColor,
    panelBgColor,
    backgroundColor,
    descriptionColor,
    inputBorderColor,
  } = useCoftechColors();

  useEffect(() => {
    if (user?.rol_key === "SUPERADMIN") {
      dispatch(GetAllBots());
    }
  }, [dispatch, user?.rol_key]);

  useEffect(() => {
    if (user?.company_id && bots) {
      const filtered = bots.filter((bot) => bot.company_id === user.company_id);
      setFilteredBots(filtered);
    } else {
      setFilteredBots(bots);
    }
  }, [bots, user?.company_id]);

  useEffect(() => {
    if (botsError.message.length > 1) {
      showError(botsError.message)
    }
  }, [botsError])

  // const sortedNPS = useMemo(() => {
  //   let sortableNPS = [...npsData];
  //   if (sortConfig.key) {
  //     sortableNPS.sort((a, b) => {
  //       if (a[sortConfig.key] < b[sortConfig.key]) {
  //         return sortConfig.direction === "ascending" ? -1 : 1;
  //       }
  //       if (a[sortConfig.key] > b[sortConfig.key]) {
  //         return sortConfig.direction === "ascending" ? 1 : -1;
  //       }
  //       return 0;
  //     });
  //   }
  //   return sortableNPS;
  // }, [npsData, sortConfig]);

  // const filteredNPS = useMemo(() => {
  //   return sortedNPS.filter((nps) => {
  //     const matchesSearch = nps.name
  //       ?.toLowerCase()
  //       .includes(search.toLowerCase());
  //     const matchesStatus =
  //       statusFilter === null || nps.status === Number(statusFilter);
  //     const matchesCompany =
  //       botFilter === null || nps.company_id === botFilter;
  //     return matchesSearch && matchesStatus && matchesCompany;
  //   });
  // }, [sortedNPS, search, statusFilter, botFilter]);

  // const totalPages = Math.ceil(filteredNPS.length / itemsPerPage);
  // const currentNPS = filteredNPS.slice(
  //   (currentPage - 1) * itemsPerPage,
  //   currentPage * itemsPerPage
  // );

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

  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const handleFilterByCompany = (e) => {
    setSelectedCompanyId(e.value);
    const filteredCompany = bots.filter((bot) => bot.company_id === e.value);
    setFilteredBots(filteredCompany);
  };

  const handleFilterByBot = (option) => {
    setSelectedBotId(option.value);
    setBotFilter(option ? option.value : null);
  };

  const handleEditer = (option) => {
    dispatch(setFilters({
      itemsPerPage,
      selectedCompanyId,
      selectedBotId,
      statusFilter
    }));
    router.push(`/nps/edit-nps`);
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

  const optionsBots = bots?.map((bot) => {
    return {
      value: bot.uuid_unique,
      label: (
        <HStack>
          <Text>{bot.name}</Text>
        </HStack>
      ),
    };
  });

  useEffect(() => {
    if (filters && Object.keys(filters).length > 0 && bots.length > 0) {
      if (filters.itemsPerPage != null) setItemsPerPage(filters.itemsPerPage);
      if (filters.selectedCompanyId != null) handleFilterByCompany({ value: filters.selectedCompanyId });
      if (filters.selectedBotId != null) handleFilterByBot({ value: filters.selectedBotId });
      if (filters.statusFilter != null) setStatusFilter(filters.statusFilter);
      dispatch(resetFilters())
    }
  }, [bots]);

  return (
    <>
      <AppShell>
        <Container maxW="full" padding={{ base: "0", md: "48px 32px" }}>
          <Box display="flex" flexDirection="column" gap={4}>
            <Flex justify="space-between" mb={4}>
              <Text fontSize="32px" fontWeight="700">
                {t("nps.title")}
              </Text>
              <HStack gap={"24px"}>
                <Button
                  leftIcon={<AddIcon />}
                  variant="solid"
                  bg={bgColor}
                  onClick={() => router.push("/nps/create-nps")}
                  _hover={{ bg: hoverColor }}
                  color="white"
                  borderRadius={20}
                >
                  {t("nps.new")}
                </Button>
              </HStack>
            </Flex>
            <HStack
              mb={4}
              justifyContent={"space-between"}
              flexWrap={{ base: "wrap" }}
              spacing={{ base: 4, md: 6 }}
            >
              <HStack
                gap={{ base: 4, md: 6 }}
                flexWrap={{ base: "wrap", md: "nowrap" }}
              >
                <Select
                  value={{
                    value: itemsPerPage,
                    label: itemsPerPage.toString(),
                  }}
                  onChange={(option) => setItemsPerPage(option.value)}
                  options={[
                    { value: 5, label: "5" },
                    { value: 10, label: "10" },
                    { value: 20, label: "20" },
                  ]}
                  chakraStyles={{
                    container: (provided) => ({
                      ...provided,
                      borderRadius: 20,
                      background: panelBgColor,
                      cursor: "pointer",
                    }),
                    dropdownIndicator: (provided) => ({
                      ...provided,
                      color: bgColor,
                      width: "20px",
                      background: panelBgColor,
                    }),
                    control: (provided) => ({
                      ...provided,
                      borderRadius: 20,
                      _focus: {
                        borderColor: bgColor,
                      },
                      _focusVisible: {
                        boxShadow: `0 0 0 1px ${bgColor}`,
                      },
                    }),
                  }}
                ></Select>
                <Text
                  width={"140px"}
                  fontSize={16}
                  fontWeight={500}
                  color={descriptionColor}
                >
                  {t("campaigns.dataPerPage")}
                </Text>
              </HStack>
              {user?.rol_key === "SUPERADMIN" && bots?.length > 0 && (
                <>
                  <Select
                    isSearchable={false}
                    value={optionsCompany.find((option) => option.value === selectedCompanyId)}
                    onChange={handleFilterByCompany}
                    options={optionsCompany}
                    placeholder={t("bots.filterByCompany")}
                    chakraStyles={{
                      container: (provided) => ({
                        ...provided,
                        borderRadius: 20,
                        background: panelBgColor,
                        cursor: "pointer",
                        width: { base: "100%", md: "auto" },
                      }),
                      dropdownIndicator: (provided) => ({
                        ...provided,
                        color: bgColor,
                        width: "20px",
                        background: panelBgColor,
                      }),
                      control: (provided) => ({
                        ...provided,
                        borderRadius: 20,
                      }),
                      inputContainer: (provided) => ({
                        ...provided,
                        width: "150px",
                      }),
                    }}
                  />
                  <Select
                    isSearchable={false}
                    value={optionsBots.find((option) => option.value === selectedBotId)}
                    onChange={handleFilterByBot}
                    options={optionsBots}
                    placeholder={t("nps.filterByBot")}
                    chakraStyles={{
                      container: (provided) => ({
                        ...provided,
                        borderRadius: 20,
                        background: panelBgColor,
                        cursor: "pointer",
                        width: { base: "100%", md: "auto" },
                      }),
                      dropdownIndicator: (provided) => ({
                        ...provided,
                        color: bgColor,
                        width: "20px",
                        background: panelBgColor,
                      }),
                      control: (provided) => ({
                        ...provided,
                        borderRadius: 20,
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
                </>
              )}

              <Select
                isSearchable={false}
                value={optionsStatus.find((option) => option.value === statusFilter)}
                options={optionsStatus}
                placeholder={t("users.filterByStatus")}
                onChange={(option) => setStatusFilter(option?.value || null)}
                chakraStyles={{
                  container: (provided) => ({
                    ...provided,
                    borderRadius: 20,
                    background: panelBgColor,
                    cursor: "pointer",
                    width: { base: "100%", md: "auto" },
                  }),
                  dropdownIndicator: (provided) => ({
                    ...provided,
                    color: bgColor,
                    width: "20px",
                    background: panelBgColor,
                  }),
                  control: (provided) => ({
                    ...provided,
                    borderRadius: 20,
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
              <InputGroup
                sx={{
                  background: panelBgColor,
                  borderRadius: "20px",
                  width: { base: "100%", md: "300px" },
                }}
              >
                <InputLeftElement pointerEvents="none">
                  <SearchIcon color={bgColor} />
                </InputLeftElement>
                <Input
                  focusBorderColor={bgColor}
                  border={"0.5px"}
                  placeholder={t("nps.search")}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </InputGroup>
            </HStack>
            {/* {loading ? (
              <Flex justify="center" align="center" h="200px">
                <Spinner size="xl" color={bgColor} />
              </Flex>
            ) : ( */}
            <Box
              style={{
                overflowY: "auto",
              }}
            >
              <Table variant="simple" w={"full"} className="responsiveTable">
                <Thead>
                  <Tr>
                    <Th>
                      {t("nps.table.name")}
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
                      {t("nps.table.date")}
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
                      {t("nps.table.bot")}
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
                      {t("nps.table.state")}
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
                    <Th></Th>
                  </Tr>
                </Thead>
                <Tbody>
                  <Tr>
                    <Td>User1</Td>
                    <Td>2024-09-24</Td>
                    <Td>Bot</Td>
                    <Td>
                      <Box
                        display="flex"
                        alignItems="center"
                        gap="12px"
                        justifyContent="center"
                        border="1px"
                        borderColor={inputBorderColor}
                        background={backgroundColor}
                        borderRadius="5px"
                        padding="2px 6px"
                        width="140px"
                      >
                        <Image src={active} alt={"Active"} />
                        Active
                      </Box>
                    </Td>
                    <Td>
                      <Button
                        variant={"solid"}
                        bg={bgColor}
                        color={"white"}
                        px={10}
                        onClick={handleEditer}
                        _hover={{ bg: hoverColor }}
                      >
                        Editer
                      </Button>
                    </Td>
                  </Tr>
                  <Tr>
                    <Td>User2</Td>
                    <Td>2024-09-24</Td>
                    <Td>Bot</Td>
                    <Td>
                      <Box
                        display="flex"
                        alignItems="center"
                        gap="12px"
                        justifyContent="center"
                        border="1px"
                        borderColor={inputBorderColor}
                        background={backgroundColor}
                        borderRadius="5px"
                        padding="2px 6px"
                        width="140px"
                      >
                        <Image src={active} alt={"Active"} />
                        Active
                      </Box>
                    </Td>
                    <Td>
                      <Button
                        variant={"solid"}
                        bg={bgColor}
                        color={"white"}
                        px={10}
                        onClick={handleEditer}
                        _hover={{ bg: hoverColor }}
                      >
                        Editer
                      </Button>
                    </Td>
                  </Tr>
                  <Tr>
                    <Td>User3</Td>
                    <Td>2024-09-24</Td>
                    <Td>Bot</Td>
                    <Td>
                      <Box
                        display="flex"
                        alignItems="center"
                        gap="12px"
                        justifyContent="center"
                        border="1px"
                        borderColor={inputBorderColor}
                        background={backgroundColor}
                        borderRadius="5px"
                        padding="2px 6px"
                        width="140px"
                      >
                        <Image src={active} alt={"Active"} />
                        Active
                      </Box>
                    </Td>
                    <Td>
                      <Button
                        variant={"solid"}
                        bg={bgColor}
                        color={"white"}
                        px={10}
                        onClick={handleEditer}
                        _hover={{ bg: hoverColor }}
                      >
                        Editer
                      </Button>
                    </Td>
                  </Tr>
                  <Tr>
                    <Td>User4</Td>
                    <Td>2024-09-24</Td>
                    <Td>Bot</Td>
                    <Td>
                      <Box
                        display="flex"
                        alignItems="center"
                        gap="12px"
                        justifyContent="center"
                        border="1px"
                        borderColor={inputBorderColor}
                        background={backgroundColor}
                        borderRadius="5px"
                        padding="2px 6px"
                        width="140px"
                      >
                        <Image src={active} alt={"Active"} />
                        Active
                      </Box>
                    </Td>
                    <Td>
                      <Button
                        variant={"solid"}
                        bg={bgColor}
                        color={"white"}
                        px={10}
                        onClick={handleEditer}
                        _hover={{ bg: hoverColor }}
                      >
                        Editer
                      </Button>
                    </Td>
                  </Tr>
                  <Tr>
                    <Td>User5</Td>
                    <Td>2024-09-24</Td>
                    <Td>Bot</Td>
                    <Td>
                      <Box
                        display="flex"
                        alignItems="center"
                        gap="12px"
                        justifyContent="center"
                        border="1px"
                        borderColor={inputBorderColor}
                        background={backgroundColor}
                        borderRadius="5px"
                        padding="2px 6px"
                        width="140px"
                      >
                        <Image src={active} alt={"Active"} />
                        Active
                      </Box>
                    </Td>
                    <Td>
                      <Button
                        variant={"solid"}
                        bg={bgColor}
                        color={"white"}
                        px={10}
                        onClick={handleEditer}
                        _hover={{ bg: hoverColor }}
                      >
                        Editer
                      </Button>
                    </Td>
                  </Tr>
                  {/* <Tr>
                        <Td colSpan={5}>
                          <Text textAlign="center" color="gray.500">
                            {t("users.noUsersFound")}
                          </Text>
                        </Td>
                      </Tr> */}
                </Tbody>
              </Table>
            </Box>
            {/* )} */}
            {/* <Box
              display="flex"
              justifyContent="space-between"
              mt={4}
              flexWrap={"wrap"}
              gap={"8px"}
            >
              <Text fontSize={16} fontWeight={500} color={descriptionColor}>
                {t("campaigns.showing")} {currentNPS.length} {t("campaigns.of")}{" "}
                {filteredNPS.length} {t("campaigns.entries")}
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
            </Box> */}
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

export default withTranslation("common")(NPS);
