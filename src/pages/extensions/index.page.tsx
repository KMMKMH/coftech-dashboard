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
  Icon,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@chakra-ui/react";
import * as FaIcons from "react-icons/fa";
import { AppShell } from '@component/components/layout'
import React, { useEffect, useState, useMemo, useRef } from "react";
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
import {
  GetBotsByCompany,
  ResetBots,
} from "@component/store/botsSlice";
import { companiesGet } from "@component/store/companySlice";
import {
  AssignExtensionsByBot,
  DeleteExtensionsByBot,
  GetExtensionsByBot,
  GetExtensionsData,
} from "@component/store/extensionsSlice";
import { Check, X } from "@untitled-ui/icons-react";
import { useError } from "@component/utils/errorContext";

const Extensions = ({ t }) => {
  const dispatch: AppDispatch = useDispatch();
  const { user } = useAuthStore();
  const { showError } = useError();
  const { companies, error: companiesError } = useSelector((state: any) => state.company);
  const { bots, error: botsError } = useSelector((state: any) => state.bots);
  const { allExtensions, extensionsByBot, loading, error: extensionsError } = useSelector(
    (state: any) => state.extensions
  );
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "" });
  const [selectedBot, setSelectedBot] = useState("");
  const [selectedBotName, setSelectedBotName] = useState("");
  const hasFetchedExtensions = useRef(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmedExtensions, setConfirmedExtensions] = useState(new Set());
  const [selectedExtensionId, setSelectedExtensionId] = useState(null);
  const [assignAction, setAssignAction] = useState("");

  const [selectedCompany, setSelectedCompany] = useState(
    user?.company_id || null
  );

  const { bgColor, hoverColor, panelBgColor, descriptionColor, textColor } =
    useCoftechColors();

  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

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
    if (extensionsError.message.length > 1) {
      showError(extensionsError.message)
    }
  }, [extensionsError])

  useEffect(() => {
    if (user?.rol_key !== "SUPERADMIN") {
      dispatch(GetBotsByCompany(user?.company_id));
    }
    dispatch(ResetBots());
  }, [dispatch, user?.company_id, user?.rol_key]);

  useEffect(() => {
    if (companies?.length > 0 && !selectedCompany) {
      setSelectedCompany(companies[0].uuid_unique);
    } else if (user?.rol_key !== "SUPERADMIN") {
      setSelectedCompany(user?.company_id);
    }
  }, [companies, selectedCompany, user?.company_id, user?.rol_key]);

  useEffect(() => {
    if (bots?.length > 0 && !selectedBot) {
      setSelectedBot(bots[0].uuid_unique);
      setSelectedBotName(bots[0].name);
    }
  }, [bots, selectedBot]);

  useEffect(() => {
    if (selectedCompany) {
      dispatch(GetBotsByCompany(selectedCompany)).then((response) => {
        if (response.payload && response.payload.length > 0) {
          setSelectedBot(response.payload[0].uuid_unique);
          setSelectedBotName(response.payload[0].name);
        } else {
          setSelectedBot(null);
          setSelectedBotName("");
        }
      });
    }
  }, [dispatch, selectedCompany]);

  useEffect(() => {
    if (selectedBot) {
      dispatch(GetExtensionsByBot(selectedBot));
    }
  }, [dispatch, selectedBot]);

  useEffect(() => {
    if (user?.company_id) {
      if (user.rol_key === "SUPERADMIN") {
        dispatch(companiesGet());
      }
    }
  }, [dispatch, user?.company_id, user?.rol_key]);

  const handleCompanyChange = (selectedOption) => {
    setSelectedCompany(selectedOption.value);
    dispatch(GetBotsByCompany(selectedOption.value)).then((response) => {
      if (response.payload.length > 0) {
        setSelectedBot(response.payload[0].uuid_unique);
        setSelectedBotName(response.payload[0].name);
      } else {
        setSelectedBot(null);
        setSelectedBotName("");
      }
    });
  };

  const handleBotChange = (selectedOption) => {
    setSelectedBot(selectedOption.value);
    setSelectedBotName(selectedOption.label);
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
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

  const optionsBots = (bots || []).map((bot) => {
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
    if (
      !hasFetchedExtensions.current &&
      optionsBots &&
      optionsBots.length > 0
    ) {
      const firstBotId = optionsBots[0].value;
      dispatch(GetExtensionsData());
      dispatch(GetExtensionsByBot(firstBotId));
      hasFetchedExtensions.current = true;
    }
  }, [optionsCompany, optionsBots, selectedCompany, selectedBot, dispatch]);

  const sortedExtensions = useMemo(() => {
    let sortableExtensions = [...allExtensions];
    if (sortConfig.key) {
      sortableExtensions.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableExtensions;
  }, [allExtensions, sortConfig]);

  const filteredExtensions = useMemo(() => {
    return sortedExtensions.filter((extension) => {
      const matchesSearch = extension.name
        ?.toLowerCase()
        .includes(search.toLowerCase());
      return matchesSearch;
    });
  }, [sortedExtensions, search]);

  const currentExtensions = filteredExtensions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(filteredExtensions.length / itemsPerPage);

  const handleCheckClick = (action, extensionId) => {
    setIsModalOpen(true);
    setSelectedExtensionId(extensionId);
    setAssignAction(action);
  };

  const handleConfirm = () => {
    setConfirmedExtensions((prev) => new Set(prev).add(selectedExtensionId));
    setIsModalOpen(false);

    if (assignAction === "unassign") {
      dispatch(
        DeleteExtensionsByBot({
          botId: selectedBot,
          extensionId: selectedExtensionId,
        })
      )
        .then((response) => {
          if (response.payload.code === 200 && response.payload.status) {
            dispatch(GetExtensionsData());
            dispatch(GetExtensionsByBot(selectedBot));
          }
        })
        .catch((error) => {
          console.error("Failed to delete extension:", error);
        });
    } else if (assignAction === "assign") {
      dispatch(
        AssignExtensionsByBot({
          botId: selectedBot,
          extensionId: selectedExtensionId,
        })
      )
        .then((response) => {
          if (response.payload.code === 200 && response.payload.status) {
            dispatch(GetExtensionsData());
            dispatch(GetExtensionsByBot(selectedBot));
          }
        })
        .catch((error) => {
          console.error("Failed to assign extension:", error);
        });
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <AppShell title={t("extensions.title")}>
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
                      _focus: {
                        borderColor: bgColor,
                      },
                      _focusVisible: {
                        boxShadow: `0 0 0 1px ${bgColor}`,
                      },
                    }),
                  }}
                />
                <Text
                  width={"140px"}
                  fontSize={16}
                  fontWeight={500}
                  color={descriptionColor}
                >
                  {t("campaigns.dataPerPage")}
                </Text>
              </HStack>

              {user?.rol_key === "SUPERADMIN" && companies.length > 0 && (
                <Select
                  isSearchable={false}
                  onChange={handleCompanyChange}
                  options={optionsCompany}
                  placeholder={t("bots.filterByCompany")}
                  value={optionsCompany.find(
                    (option) => option.value === selectedCompany
                  )}
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
              {user?.rol_key === "SUPERADMIN" && bots?.length > 0 && (
                <Select
                  isSearchable={false}
                  onChange={handleBotChange}
                  options={optionsBots}
                  placeholder={t("extensions.filterByBot")}
                  value={optionsBots?.find(
                    (option) => option.value === selectedBot
                  )}
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
                  focusBorderColor={bgColor}
                  border={"0.5px"}
                  placeholder={t("extensions.search")}
                  value={search}
                  onChange={handleSearchChange}
                />
              </InputGroup>
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
                <Table variant="simple" w={"full"} className="responsiveTable">
                  <Thead>
                    <Tr>
                      <Th>
                        {t("extensions.table.name")}
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
                      <Th>{t("extensions.table.description")}</Th>
                      <Th>{t("extensions.table.botName")}</Th>
                      <Th>{t("extensions.table.actions")}</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {currentExtensions?.map((extension) => {
                      const IconComponent = FaIcons[extension.icon];
                      const isExtensionInBot = extensionsByBot.some(
                        (ext) => ext.extension === extension.uuid_unique
                      );

                      return (
                        <Tr key={extension.uuid_unique}>
                          <Td minW={"150px"}>
                            <Box display={"flex"} alignItems={"center"} gap={4}>
                              {IconComponent && (
                                <Icon
                                  as={IconComponent}
                                  color={bgColor}
                                  w={"24px"}
                                  height={"24px"}
                                />
                              )}
                              {extension.name}
                            </Box>
                          </Td>
                          <Td maxW={"480px"}>
                            {extension.description !== null
                              ? extension.description.english
                              : "-"}
                          </Td>
                          <Td>
                            {isExtensionInBot && selectedBotName
                              ? selectedBotName
                              : "-"}
                          </Td>
                          <Td minW={"100px"}>
                            {isExtensionInBot ? (
                              <Button
                                w={"40px"}
                                h={"40px"}
                                onClick={() =>
                                  handleCheckClick(
                                    "unassign",
                                    extension.uuid_unique
                                  )
                                }
                              >
                                <Icon as={X} w={6} h={6} color={"red"} />
                              </Button>
                            ) : (
                              <Button
                                w={"40px"}
                                h={"40px"}
                                onClick={() =>
                                  handleCheckClick(
                                    "assign",
                                    extension.uuid_unique
                                  )
                                }
                              >
                                <Icon as={Check} w={6} h={6} color={"green"} />
                              </Button>
                            )}
                          </Td>
                        </Tr>
                      );
                    })}
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
                {t("campaigns.showing")} {currentExtensions.length}{" "}
                {t("campaigns.of")} {filteredExtensions.length}{" "}
                {t("campaigns.entries")}
              </Text>
              <HStack>
                <Button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  color={currentPage === 1 ? "gray" : textColor}
                >
                  &lt;
                </Button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <Button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      variant={page === currentPage ? "solid" : ""}
                      background={
                        page === currentPage ? bgColor : "transparent"
                      }
                      color={page === currentPage ? "white" : textColor}
                      _hover={{
                        bg: page === currentPage ? hoverColor : hoverColor,
                        color: "white",
                      }}
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
                  color={currentPage === totalPages ? "gray" : textColor}
                >
                  &gt;
                </Button>
              </HStack>
            </Box>
          </Box>
        </Container>
      </AppShell>
      <Modal
        isOpen={isModalOpen}
        onClose={handleCancel}
        isCentered
        variant="coftechModal"
      >
        <ModalOverlay
          sx={{
            backdropFilter: "blur(10px)",
          }}
        />
        <ModalContent>
          <ModalHeader textAlign={"center"}>{t("extensions.sure")}</ModalHeader>
          <ModalFooter gap={4}>
            <Button
              variant="solid"
              bg={bgColor}
              onClick={handleConfirm}
              w={"full"}
              _hover={{ bg: hoverColor }}
              color={"white"}
            >
              {t("extensions.yes")}
            </Button>
            <Button
              variant="outline"
              borderColor={bgColor}
              onClick={handleCancel}
              w={"full"}
              _hover={{ bg: hoverColor, color: "white" }}
            >
              {t("extensions.no")}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export const getStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common"])),
  },
});

export default withTranslation("common")(Extensions);
