/* eslint-disable react-hooks/exhaustive-deps */
import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import {
  Container,
  Flex,
  HStack,
  Text,
  Button,
  Box,
  Avatar,
  InputGroup,
  InputLeftElement,
  Input,
  Spinner,
  useBreakpointValue,
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
import { i18n, withTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import active from "../../assets/images/active.svg";
import disable from "../../assets/images/disable.svg";
import { useDispatch, useSelector } from "react-redux";
import { accountsGet } from "@component/store/usersSlice";
import { AppDispatch } from "@component/store";
import { Select } from "chakra-react-select";
import { Edit01, Trash01 } from "@untitled-ui/icons-react";
import DeleteUserModal from "@component/components/DeleteUserModal";
import { AxiosUrl } from "@component/configs/AxiosConfig";
import { companiesGet } from "@component/store/companySlice";
import { Table } from "@component/components/Table/Table";
import { Thead } from "@component/components/Table/Thead";
import { Tr } from "@component/components/Table/Tr";
import { Th } from "@component/components/Table/Th";
import { Tbody } from "@component/components/Table/Tbody";
import { Td } from "@component/components/Table/Td";
import useCoftechColors from "@component/hooks/useCoftechColors";
import { resetFilters, setFilters } from "@component/store/filtersSlice";
import { useError } from "@component/utils/errorContext";
import { useDeleteUserMutation } from "@component/store/RTK/auth";
import useErrorHandler from "@component/hooks/useErrorHandler";

const inter = Inter({ subsets: ["latin"] });

const Home = ({ t }) => {
  const dispatch: AppDispatch = useDispatch();
  const { token, user } = useAuthStore();
  const { handleError } = useErrorHandler();
  const router = useRouter();
  const { accounts, loading, error: usersError } = useSelector((state: any) => state.users);
  const { companies, loading: loadingCompanies, error: companiesError } = useSelector(
    (state: any) => state.company
  );
  const isMobile = useBreakpointValue({ base: true, md: false });
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: string;
  }>({ key: "", direction: "" });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [statusFilter, setStatusFilter] = useState<number | null>(null);
  const [companyFilter, setCompanyFilter] = useState<string | null>(
    user?.company_id || null
  );
  const [loadingFilter, setLoadingFilter] = useState(false);
  const [ triggerDelete ] = useDeleteUserMutation();
  const filters = useSelector((state: any) => state.filters);

  const {
    bgColor,
    hoverColor,
    panelBgColor,
    backgroundColor,
    descriptionColor,
    borderColor,
    textColor,
    iconColor,
    inputBorderColor,
  } = useCoftechColors();

  useEffect(() => {
    if (companiesError.message.length > 1) {
      handleError(companiesError)
    }
  }, [companiesError])

  useEffect(() => {
    if (usersError.message.length > 1) {
      handleError(usersError)
    }
  }, [usersError])

  useEffect(() => {
    if (user?.company_id) {
      if (user?.rol_key === "SUPERADMIN") {
        dispatch(companiesGet());
      }
      const fetchAccounts = async () => {
        setLoadingFilter(true);
        if (companyFilter) {
          await dispatch(accountsGet(companyFilter));
        } else {
          await dispatch(accountsGet(user.company_id));
        }
        setLoadingFilter(false);
      };
      if (Object.keys(filters).length == 0) {
        fetchAccounts();
      }
    }
  }, [dispatch, user?.company_id, user?.rol_key, companyFilter, filters]);

  useEffect(() => {
    if (filters && Object.keys(filters).length > 0 && accounts.length > 0) {
      if (filters.itemsPerPage != null) setItemsPerPage(filters.itemsPerPage);
      if (filters.companyFilter != null) {
        const fetchAccounts = async () => {
          setLoadingFilter(true);
          await dispatch(accountsGet(filters.companyFilter));
          setCompanyFilter(filters.companyFilter);
          setLoadingFilter(false);
        };
        fetchAccounts();
      };
      if (filters.statusFilter != null) setStatusFilter(filters.statusFilter);
      if (filters.search != null) setSearch(filters.search);
      dispatch(resetFilters())
    }
  }, [accounts]);

  const filteredAccounts = useMemo(() => {
    let sortableAccounts = [...accounts];
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
    return sortableAccounts.filter((account) => {
      const matchesSearch = account.company_name
        ?.toLowerCase()
        .includes(search.toLowerCase());
      const matchesStatus =
        statusFilter === null || account.status === statusFilter;
      const matchesCompany =
        companyFilter === null || account.company_id === companyFilter;
      const matchesRole =
        user?.rol_key === "ADMIN" ? account.rol_key !== "SUPERADMIN" : true;
      return matchesSearch && matchesStatus && matchesCompany && matchesRole;
    });
  }, [accounts, sortConfig, search, statusFilter, companyFilter, user?.rol_key]);

  const totalPages = Math.ceil(filteredAccounts.length / itemsPerPage);
  const currentAccounts = filteredAccounts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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

  const handleDeleteUser = (user: any) => {
    setUserToDelete(user);
    setIsModalOpen(true);
  };

  const confirmDeleteUser = async () => {
    if (userToDelete) {
      setIsDeleting(true);
      try {
        await triggerDelete({ companyID: userToDelete.company_id, userID: userToDelete.uuid_unique }).unwrap();
        //@ts-ignore
        if (companyFilter) {
          await dispatch(accountsGet(companyFilter));
        } else {
          await dispatch(accountsGet(user.company_id));
        }
        setIsModalOpen(false);
      } catch (error) {
        handleError(error, { companyID: userToDelete.company_id, userID: userToDelete.uuid_unique })
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleEditUser = (account) => {
    dispatch(setFilters({
      itemsPerPage,
      companyFilter,
      statusFilter,
      search
    }));
    router.push(
      `/users/${account.company_id}/${account.uuid_unique}`
    )
  }

  const requestSort = (key: string) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const handleFilterByCompany = (e: any) => {
    setCompanyFilter(e ? e.value : null);
  };

  const optionsCompanies = companies.map((company: any) => {
    return {
      value: company.uuid_unique,
      label: (
        <HStack>
          <Text>{company.name}</Text>
        </HStack>
      ),
    };
  });

  return (
    <>
      <AppShell title={t("users.title")}>
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
              <HStack gap={user?.rol_key == "SUPERADMIN" ? 2 : 5} flexWrap={isMobile ? { base: "wrap" } : null}>
                <HStack>
                  <Select
                    size={"sm"}
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
                  />
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
                {user?.rol_key === "SUPERADMIN" && (
                  <Select
                    size={"sm"}
                    value={optionsCompanies.find((option) => option.value === companyFilter)}
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
                <Select
                  size={"sm"}
                  value={optionsStatus.find((option) => Number(option.value) === statusFilter)}
                  options={optionsStatus}
                  placeholder={t("users.filterByStatus")}
                  onChange={(option) =>
                    setStatusFilter(option?.value ? Number(option.value) : null)
                  }
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
                <InputGroup
                  size={"sm"}
                  sx={{
                    background: panelBgColor,
                    borderRadius: "20px",
                    width: { base: "100%", md: "230px" },
                  }}
                >
                  <InputLeftElement pointerEvents="none">
                    <SearchIcon color={bgColor} />
                  </InputLeftElement>
                  <Input
                    placeholder={t("users.searchForCompany")}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </InputGroup>
              </HStack>
              <Button
                size={"sm"}
                fontSize={"12px"}
                leftIcon={<AddIcon />}
                variant="solid"
                bg={bgColor}
                onClick={() => router.push("/users/add-user")}
                _hover={{ bg: hoverColor }}
                color="white"
                borderRadius={20}
              >
                {t("users.newUser")}
              </Button>
            </HStack>
            {loadingFilter ? (
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
                        {t("users.table.user")}
                        <Button
                          onClick={() => requestSort("username")}
                          size="xs"
                          variant="ghost"
                        >
                          {sortConfig.key === "username" &&
                            sortConfig.direction === "ascending" ? (
                            <ArrowUpIcon color={bgColor} />
                          ) : (
                            <ArrowDownIcon color={bgColor} />
                          )}
                        </Button>
                      </Th>
                      <Th>
                        {t("users.table.state")}
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
                        {t("users.table.userRole")}
                        <Button
                          onClick={() => requestSort("rol_name")}
                          size="xs"
                          variant="ghost"
                        >
                          {sortConfig.key === "rol_name" &&
                            sortConfig.direction === "ascending" ? (
                            <ArrowUpIcon color={bgColor} />
                          ) : (
                            <ArrowDownIcon color={bgColor} />
                          )}
                        </Button>
                      </Th>
                      <Th>
                        {t("users.table.company")}
                        <Button
                          onClick={() => requestSort("company_name")}
                          size="xs"
                          variant="ghost"
                        >
                          {sortConfig.key === "company_name" &&
                            sortConfig.direction === "ascending" ? (
                            <ArrowUpIcon color={bgColor} />
                          ) : (
                            <ArrowDownIcon color={bgColor} />
                          )}
                        </Button>
                      </Th>
                      <Th>{t("users.table.actions")}</Th>
                      <Th></Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {currentAccounts.length > 0 ? (
                      currentAccounts.map((account) => (
                        <Tr key={account.uuid_unique}>
                          <Td>
                            <Box display="flex" alignItems="center" gap={3}>
                              <Avatar
                                w={"40px"}
                                h={"40px"}
                                src={account.photo}
                              />
                              {account.first_name} {account.last_name}
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
                                background={backgroundColor}
                                borderRadius="5px"
                                padding="2px 6px"
                                width="100px"
                              >
                                <Image src={active} alt="Active"></Image>
                                {t("company.table.active")}
                              </Box>
                            ) : (
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
                                <Image src={disable} alt="Inactive"></Image>
                                {t("company.table.inActive")}
                              </Box>
                            )}
                          </Td>
                          <Td>{account?.rol_name}</Td>
                          <Td>{account?.company_name}</Td>
                          <Td>
                            <Box display={"flex"} gap={4}>
                              <Box
                                display="flex"
                                alignItems="center"
                                p={2}
                                borderRadius={8}
                                background={backgroundColor}
                                cursor={"pointer"}
                                onClick={() => handleDeleteUser(account)}
                              >
                                <Trash01 color={iconColor} />
                              </Box>
                              <Box
                                display="flex"
                                alignItems="center"
                                p={2}
                                borderRadius={8}
                                background={backgroundColor}
                                cursor={"pointer"}
                                onClick={() => handleEditUser(account)}
                              >
                                <Edit01 color={iconColor} />
                              </Box>
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
                {t("campaigns.showing")} {currentAccounts.length}{" "}
                {t("campaigns.of")} {filteredAccounts.length}{" "}
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

      <DeleteUserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onDelete={confirmDeleteUser}
        username={userToDelete?.username}
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
