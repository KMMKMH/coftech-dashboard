/* eslint-disable react-hooks/exhaustive-deps */
import { Inter } from "next/font/google";
import {
  Container,
  Flex,
  HStack,
  Text,
  Box,
  Button,
  InputGroup,
  InputLeftElement,
  Input,
  Spinner,
} from "@chakra-ui/react";
import { AppShell } from '@component/components/layout'
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { withTranslation } from "react-i18next";
import { ArrowDownIcon, ArrowUpIcon, SearchIcon } from "@chakra-ui/icons";
import { Select } from "chakra-react-select";
import { useAuthStore } from "@component/store/auth";
import { AppDispatch } from "@component/store";
import { Edit01 } from "@untitled-ui/icons-react";
import {
  companyGlobalConfGet,
  companyUpdate,
} from "@component/store/settingSlice";
import { companiesGet } from "@component/store/companySlice";
import { Table } from "@component/components/Table/Table";
import { Thead } from "@component/components/Table/Thead";
import { Tr } from "@component/components/Table/Tr";
import { Th } from "@component/components/Table/Th";
import { Tbody } from "@component/components/Table/Tbody";
import { Td } from "@component/components/Table/Td";
import useCoftechColors from "@component/hooks/useCoftechColors";
import { useError } from "@component/utils/errorContext";

const inter = Inter({ subsets: ["latin"] });

const Settings = ({ t }) => {
  const dispatch: AppDispatch = useDispatch();
  const { token, user } = useAuthStore();
  const { showError } = useError();

  const { companies, loading: loadingCompanies, error: companiesError } = useSelector(
    (state: any) => state.company
  );
  const { companyConfig, loading, error: settingError } = useSelector((resp: any) => resp.setting);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "" });
  const [companyFilter, setCompanyFilter] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editedData, setEditedData] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  const {
    bgColor,
    hoverColor,
    panelBgColor,
    backgroundColor,
    descriptionColor,
    iconColor,
  } = useCoftechColors();

  useEffect(() => {
    if (companiesError.message.length > 1) {
      showError(companiesError.message)
    }
  }, [companiesError])

  useEffect(() => {
    if (settingError.message.length > 1) {
      showError(settingError.message)
    }
  }, [settingError])

  useEffect(() => {
    if (user?.company_id) {
      if (user.rol_key === "SUPERADMIN") {
        dispatch(companiesGet());
      }
      const fetchCompanyConfig = async () => {
        await dispatch(
          companyGlobalConfGet({ companyId: companyFilter || user.company_id, ownerType: "company" })
        )
      };
      fetchCompanyConfig();
    }
  }, [dispatch, user?.company_id, user?.rol_key, companyFilter]);

  const sortedCompany = useMemo(() => {
    let sortableAccounts = [...companyConfig];
    if (sortConfig.key) {
      sortableAccounts.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableAccounts;
  }, [companyConfig, sortConfig]);

  const filteredCompany = useMemo(() => {
    return sortedCompany.filter((company) => {
      return company.template_key
        ?.toLowerCase()
        .includes(search.toLowerCase());
    });
  }, [sortedCompany, search]);

  const totalPages = Math.ceil(filteredCompany.length / itemsPerPage);
  const currentCompany = filteredCompany.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const handleEditClick = (company) => {
    setEditingId(company.uuid_unique);
    setEditedData(company.data);
  };

  const handleSaveClick = (company) => {
    setUpdatingId(company.uuid_unique);
    dispatch(
      companyUpdate({
        companyId: company.company_id,
        data: { key: company.template_key, data: editedData },
      })
    ).then((res) => {
      dispatch(companyGlobalConfGet({ companyId: company.company_id, ownerType: "company" }));
      setUpdatingId(null);
      setEditingId(null);
    });
  };

  const handleKeyDown = useCallback((event) => {
    if (event.key === "Escape") {
      setEditingId(null);
      setEditedData("");
    }
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  const maskSensitiveData = (data) => {
    if (data.length >= 10) {
      return data.slice(0, 6) + "*****" + data.slice(-6);
    }
    return data;
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

  const handleFilterByCompany = (e) => {
    setCompanyFilter(e ? e.value : null);
  };

  return (
    <>
      <AppShell title={t("settings.title")}>
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
              {user?.rol_key === "SUPERADMIN" && (
                <Select
                  isSearchable={false}
                  onChange={handleFilterByCompany}
                  options={optionsCompanies}
                  placeholder={t("users.filterByCompany")}
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
              )}
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
                  placeholder={t("settings.searchForCompany")}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </InputGroup>
            </HStack>
            {loading ? (
              <Flex justifyContent="center" alignItems="center" height="50vh">
                <Spinner size="xl" color={bgColor} />
              </Flex>
            ) : (
              <Box
                style={{
                  overflowY: "auto",
                }}
              >
                <Table variant="simple" w={"full"} className="responsiveTable">
                  <Thead>
                    <Tr>
                      <Th>
                        {t("settings.table.key")}
                        <Button
                          onClick={() => requestSort("key")}
                          size="xs"
                          variant="ghost"
                        >
                          {sortConfig.key === "key" &&
                            sortConfig.direction === "ascending" ? (
                            <ArrowUpIcon color={bgColor} />
                          ) : (
                            <ArrowDownIcon color={bgColor} />
                          )}
                        </Button>
                      </Th>
                      <Th>
                        {t("settings.table.data")}
                        <Button
                          onClick={() => requestSort("data")}
                          size="xs"
                          variant="ghost"
                        >
                          {sortConfig.key === "data" &&
                            sortConfig.direction === "ascending" ? (
                            <ArrowUpIcon color={bgColor} />
                          ) : (
                            <ArrowDownIcon color={bgColor} />
                          )}
                        </Button>
                      </Th>
                      <Th>
                        {t("settings.table.description")}
                        <Button
                          onClick={() => requestSort("description")}
                          size="xs"
                          variant="ghost"
                        >
                          {sortConfig.key === "description" &&
                            sortConfig.direction === "ascending" ? (
                            <ArrowUpIcon color={bgColor} />
                          ) : (
                            <ArrowDownIcon color={bgColor} />
                          )}
                        </Button>
                      </Th>
                      <Th>{t("users.table.actions")}</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {currentCompany.length > 0 ? (
                      currentCompany.map((company) => (
                        <Tr key={company.uuid_unique}>
                          <Td>{company.template_key}</Td>
                          <Td>
                            {editingId === company.uuid_unique ? (
                              <Input
                                value={editedData}
                                borderColor={"gray.300"}
                                onChange={(e) => setEditedData(e.target.value)}
                              />
                            ) : (
                              maskSensitiveData(company.data)
                            )}
                          </Td>
                          <Td>{company?.template_description}</Td>
                          <Td>
                            <Box display="flex" alignItems="center" gap={6}>
                              {editingId === company.uuid_unique ? (
                                updatingId === company.uuid_unique ? (
                                  <Spinner size="sm" color={bgColor} />
                                ) : (
                                  <Button
                                    bg={bgColor}
                                    color="white"
                                    padding="6px 12px"
                                    _hover={{ bg: hoverColor }}
                                    onClick={() => handleSaveClick(company)}
                                  >
                                    Save
                                  </Button>
                                )
                              ) : (
                                <Box
                                  display="flex"
                                  alignItems="center"
                                  p={2}
                                  borderRadius={8}
                                  background={backgroundColor}
                                  onClick={() => handleEditClick(company)}
                                  style={{ cursor: "pointer" }}
                                >
                                  <Edit01
                                    style={{ cursor: "pointer" }}
                                    color={iconColor}
                                  />
                                </Box>
                              )}
                            </Box>
                          </Td>
                        </Tr>
                      ))
                    ) : (
                      <Tr>
                        <Td colSpan={6}>
                          <Text textAlign="center" color="gray.500">
                            {t("users.noUsersFound")}
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
                {t("campaigns.showing")} {currentCompany.length}{" "}
                {t("campaigns.of")} {filteredCompany.length}{" "}
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
    </>
  );
};

export const getStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common"])),
  },
});

export default withTranslation("common")(Settings);
