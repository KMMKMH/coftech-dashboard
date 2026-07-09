/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import {
  Container,
  HStack,
  Text,
  Button,
  Box,
  InputGroup,
  InputLeftElement,
  Input,
  Avatar,
  Spinner,
} from "@chakra-ui/react";
import { AppShell } from '@component/components/layout'
import { useAuthStore } from "@component/store/auth";
import defaultCompany from "@component/assets/images/default_company.svg";
import { ArrowDownIcon, ArrowUpIcon, SearchIcon } from "@chakra-ui/icons";
import active from "@component/assets/images/active.svg";
import disable from "@component/assets/images/disable.svg";
import { withTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { Edit01 } from "@untitled-ui/icons-react";
import { Select } from "chakra-react-select";
import { useRouter } from "next/router";
import { Table } from "@component/components/Table/Table";
import { Thead } from "@component/components/Table/Thead";
import { Tr } from "@component/components/Table/Tr";
import { Th } from "@component/components/Table/Th";
import { Tbody } from "@component/components/Table/Tbody";
import { Td } from "@component/components/Table/Td";
import { formatDate } from "@component/utils";
import { companiesGet, GetCompanyById } from "@component/store/companySlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@component/store";
import Image from "next/image";
import useCoftechColors from "@component/hooks/useCoftechColors";
import { resetFilters, setFilters } from "@component/store/filtersSlice";
import { useError } from "@component/utils/errorContext";

const Company = ({ t }) => {
  const dispatch: AppDispatch = useDispatch();
  const router = useRouter();
  const { showError } = useError();
  const { token, user } = useAuthStore();
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const { companies: accounts, loading: loadingCompanies, error: companiesError } = useSelector(
    (state: any) => state.company
  );
  const [totalEntries, setTotalEntries] = useState(accounts.length);
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "" });
  const filters = useSelector((state: any) => state.filters);

  const {
    bgColor,
    hoverColor,
    panelBgColor,
    backgroundColor,
    descriptionColor,
    iconColor,
    inputBorderColor,
  } = useCoftechColors();

  const sortedAccounts = React.useMemo(() => {
    let sortableCampaigns = [...accounts];
    if (sortConfig.key) {
      sortableCampaigns.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableCampaigns;
  }, [accounts, sortConfig]);

  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const filteredAccounts = sortedAccounts.filter((account) =>
    account.name?.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredAccounts.length / itemsPerPage);
  const currentAccounts = filteredAccounts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    if (companiesError.message.length > 1) {
      showError(companiesError.message)
    }
  }, [companiesError])

  useEffect(() => {
    if (user?.rol_key === "SUPERADMIN") {
      dispatch(companiesGet());
    } else if (user?.company_id) {
      //@ts-ignore
      dispatch(GetCompanyById(user?.company_id));
    }
  }, [dispatch, user?.company_id, user?.rol_key]);

  const handleEdit = (account) => {
    dispatch(setFilters({
      itemsPerPage: itemsPerPage,
      search: search
    }));
    router.push(`/company/update-account/${account.uuid_unique}`);
  };

  useEffect(() => {
    if (filters && Object.keys(filters).length > 0 && accounts.length > 0) {
      if (filters.itemsPerPage != null) setItemsPerPage(filters.itemsPerPage);
      if (filters.search != null) setSearch(filters.search);
      dispatch(resetFilters())
    }
  }, [accounts]);

  return (
    <>
      <AppShell title={t("company.title")}>
        <Container maxW="full" padding={{ base: "0", md: "48px 32px" }}>
          <Box display="flex" flexDirection="column" gap={4}>
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
                    }),
                  }}
                ></Select>
                <Text
                  width="140px"
                  fontSize={16}
                  fontWeight={500}
                  color={descriptionColor}
                >
                  {t("campaigns.dataPerPage")}
                </Text>
              </HStack>
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
                  placeholder={t("campaigns.search")}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </InputGroup>
            </HStack>
            <Box
              style={{
                overflowY: "auto",
              }}
            >
              {loadingCompanies ? ( // Show the spinner while companies are loading
                <Spinner
                  size="xl"
                  color={bgColor}
                  emptyColor="gray.200"
                  thickness="4px"
                  speed="0.65s"
                  margin="auto"
                  display="block"
                />
              ) : (
                <Table variant="simple" w={"full"} className="responsiveTable">
                  <Thead>
                    <Tr>
                      <Th>
                        {t("company.table.company")}
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
                        {t("company.table.state")}
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
                      <Th>
                        {t("company.table.dateOfAdmission")}
                        <Button
                          onClick={() => requestSort("updated_at")}
                          size="xs"
                          variant="ghost"
                        >
                          {sortConfig.key === "updated_at" &&
                            sortConfig.direction === "ascending" ? (
                            <ArrowUpIcon color={bgColor} />
                          ) : (
                            <ArrowDownIcon color={bgColor} />
                          )}
                        </Button>
                      </Th>
                      <Th>
                        {t("company.table.numberOfBots")}
                        <Button
                          onClick={() => requestSort("bot_count")}
                          size="xs"
                          variant="ghost"
                        >
                          {sortConfig.key === "bot_count" &&
                            sortConfig.direction === "ascending" ? (
                            <ArrowUpIcon color={bgColor} />
                          ) : (
                            <ArrowDownIcon color={bgColor} />
                          )}
                        </Button>
                      </Th>
                      <Th>{t("company.table.actions")}</Th>
                      <Th></Th>
                    </Tr>
                  </Thead>
                  <Tbody background={panelBgColor}>
                    {currentAccounts.map((account) => (
                      <Tr key={account.uuid_unique}>
                        <Td>
                          <Box
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "12px",
                            }}
                          >
                            {account.logo ? (
                              <Avatar size="md" src={account?.logo} />
                            ) : (
                              <Avatar size="md" src={defaultCompany} />
                            )}
                            {account.name}
                          </Box>
                        </Td>
                        <Td>
                          {account.status === 1 ? (
                            <Box
                              display="flex"
                              alignItems="center"
                              gap="12px"
                              justifyContent="center"
                              border="1px"
                              borderColor={inputBorderColor}
                              borderRadius="5px"
                              padding="2px 6px"
                              width="100px"
                              background={backgroundColor}
                            >
                              <Image src={active} alt="Active" />
                              {t("company.table.active")}
                            </Box>
                          ) : (
                            <Box
                              display="flex"
                              alignItems="center"
                              gap="12px"
                              justifyContent="center"
                              border="1px"
                              borderColor="#D9E2EC"
                              borderRadius="5px"
                              padding="2px 6px"
                              width="140px"
                            >
                              <Image src={disable} alt="Inactive"></Image>
                              {t("company.table.inActive")}
                            </Box>
                          )}
                        </Td>
                        <Td>{formatDate(account.updated_at)}</Td>
                        <Td>
                          {account.bot_count}
                          {t("company.table.hiredBots")}
                        </Td>
                        <Td>
                          <Button
                            background={backgroundColor}
                            onClick={() => handleEdit(account)}
                          >
                            <Edit01 color={iconColor} />
                          </Button>
                        </Td>
                        <Td>
                          <Button
                            bg={bgColor}
                            color="white"
                            display="none"
                            padding={{ base: "4px 16px", md: "16px 36px" }}
                            _hover={{ bg: hoverColor }}
                          >
                            {t("company.table.viewMore")}
                          </Button>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              )}
            </Box>
            {!loadingCompanies && (
              <Box
                display="flex"
                justifyContent="space-between"
                mt={4}
                flexWrap={"wrap"}
                gap={"8px"}
              >
                <Text fontSize={16} fontWeight={500} color={descriptionColor}>
                  {t("campaigns.showing")} {currentAccounts.length}{" "}
                  {t("campaigns.of")} {totalEntries} {t("campaigns.entries")}
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
            )}
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

export default withTranslation("common")(Company);
