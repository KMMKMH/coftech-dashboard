/* eslint-disable react-hooks/exhaustive-deps */
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
  useBreakpointValue,
  useToken,
  useDisclosure,
  Icon,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import { AppShell } from '@component/components/layout'
import React, { useEffect, useState, useMemo } from "react";
import { useAuthStore } from "@component/store/auth";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  SearchIcon,
} from "@chakra-ui/icons";
import { withTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@component/store";
import { Select } from "chakra-react-select";
import { CheckCircle } from "@untitled-ui/icons-react";
import { AxiosUrl } from "@component/configs/AxiosConfig";
import { companiesGet, GetCompanyById } from "@component/store/companySlice";
import { Table } from "@component/components/Table/Table";
import { Thead } from "@component/components/Table/Thead";
import { Tr } from "@component/components/Table/Tr";
import { Th } from "@component/components/Table/Th";
import { Tbody } from "@component/components/Table/Tbody";
import { Td } from "@component/components/Table/Td";
import useCoftechColors from "@component/hooks/useCoftechColors";
import { resetFilters } from "@component/store/filtersSlice";
import { useLazyGetBackupsQuery } from "@component/store/RTK/PromptsBackups";
import PromptView from "@component/components/PromptView";
import { useError } from "@component/utils/errorContext";

const Home = ({ t }) => {
  const dispatch: AppDispatch = useDispatch();
  const { user } = useAuthStore();
  const { showError } = useError();
  const router = useRouter();
  const { companyId, botId } = router.query;
  const [trigger, { data, isLoading }] = useLazyGetBackupsQuery()
  const isMobile = useBreakpointValue({ base: true, md: false });
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "" });
  const [preview, setPreview] = useState<any>()
  const [isLoadingRestore, setIsLoadingRestore] = useState<number>(-1)
  const [isConfirmationOpen, setIsConfirmationOpen] = useState<boolean>(false);
  const filters = useSelector((state: any) => state.filters);

  const {
    bgColor,
    hoverColor,
    panelBgColor,
    descriptionColor,
  } = useCoftechColors();

  const [accentColor] = useToken('colors', [bgColor]);

  useEffect(() => {
    if (user?.rol_key === "SUPERADMIN") {
      dispatch(companiesGet());
    } else if (user?.company_id) {
      //@ts-ignore
      dispatch(GetCompanyById(user?.company_id));
    }
  }, [dispatch, user?.company_id, user?.rol_key, filters]);

  useEffect(() => {
    if (filters && Object.keys(filters).length > 0 && data?.data.length > 0) {
      if (filters.itemsPerPage != null) setItemsPerPage(filters.itemsPerPage);
      if (filters.search != null && filters.search != "") setSearch(filters.search);
      dispatch(resetFilters())
    }
  }, [data]);

  const filteredPrompts = useMemo(() => {
    const prompts = data?.data
    if (prompts) {
      let sortablePrompts = [...prompts];

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
        return matchesSearch;
      });
    }
  }, [data, sortConfig, search]);

  const totalPages = Math.ceil(filteredPrompts?.length / itemsPerPage);
  const currentPrompts = filteredPrompts?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    const fetchBackups = async () => {
      if (botId && companyId) {
        try {
          await trigger({ companyID: companyId, botID: botId }).unwrap()
        } catch (err) {
          if (err.status === 404) {
            showError(err.data?.message)
          } else {
            showError(err.error)
          }
        }

      }
    }

    fetchBackups()
  }, [botId, companyId])

  const handleRestorePrompt = async (prompt, index) => {
    setIsLoadingRestore(index);
    try {
      await AxiosUrl.post(
        `/prompts?companyID=${prompt.company_id}&botID=${prompt.bot_id}`,
        {
          name: prompt.name,
          data: prompt.data,
          type: 0
        }
      );
      setIsConfirmationOpen(true);
    } catch (error) {
      showError(error?.response?.data?.message)
    } finally {
      setIsLoadingRestore(-1);
    }
  }

  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  function formatDateTime(isoString) {
    const date = new Date(isoString);

    const days = [t("prompt.sun"), t("prompt.mon"), t("prompt.tue"), t("prompt.wed"), t("prompt.thu"), t("prompt.fri"), t("prompt.sat")];

    const day = days[date.getDay()];
    const dayNum = String(date.getDate()).padStart(2, '0');
    const monthNum = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${day} ${monthNum}/${dayNum}/${year} - ${hours}:${minutes}`;
  }

  const {
    isOpen: isPreviewOpen,
    onOpen: onOpenPreview,
    onClose: onClosePreview,
  } = useDisclosure();

  return (
    <>
      <AppShell
        onBackButtonClick={() => router.back()}
        showBackButton={true}
        title={t("prompt.history")}
      >
        <PromptView
          isOpen={isPreviewOpen}
          onClose={onClosePreview}
          prompt={preview}
          setIsConfirmationOpen={setIsConfirmationOpen}
        />
        <Container maxW="full" padding={0}>
          <Box mb={"20px"}>
            <Text color={descriptionColor}>
              {t("prompt.historyDesc")}
            </Text>
          </Box>
          <Box display="flex" flexDirection="column" gap={4}>
            <Flex justify="end" mb={isMobile ? 4 : null}>
            </Flex>
            {!isMobile && (
              <HStack>
                <Text
                  position={"relative"}
                  top={2}
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
                <InputGroup
                  size={"sm"}
                  sx={{
                    background: panelBgColor,
                    borderRadius: "20px",
                    width: { base: "100%", md: "400px" },
                  }}
                >
                  <InputLeftElement pointerEvents="none">
                    <SearchIcon color={bgColor} />
                  </InputLeftElement>
                  <Input
                    placeholder={t(`prompt.search`)}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </InputGroup>
              </HStack>
            </HStack>
            {isLoading ? (
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
                        {t(`prompt.modificationDate`)}
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
                      <Th>{t(`prompt.actions`)}</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {currentPrompts?.length > 0 ? (
                      currentPrompts?.map((prompt, index) => {
                        return (
                          <Tr key={index}>
                            <Td>
                              <Box display={"flex"}>
                                <Text>{prompt.name}</Text>
                              </Box>
                            </Td>
                            <Td>
                              <Box display={"flex"}>
                                <Text>{formatDateTime(prompt.updated_at)}</Text>
                              </Box>
                            </Td>
                            <Td>
                              <Box display={"flex"} gap={4}>
                                <Box
                                  display="flex"
                                  alignItems="center"
                                  p={2}
                                  w={"200px"}
                                  borderRadius={"20px"}
                                  background={bgColor}
                                  onClick={() => {
                                    setPreview(prompt)
                                    onOpenPreview()
                                  }}
                                  _hover={{
                                    cursor: "pointer",
                                    bg: hoverColor
                                  }}
                                >
                                  <Text textAlign={"center"} w={"full"}>{t("prompt.view")}</Text>
                                </Box>
                                <Box
                                  display="flex"
                                  alignItems="center"
                                  p={2}
                                  textAlign={"center"}
                                  w={"200px"}
                                  borderRadius={"20px"}
                                  background={panelBgColor}
                                  border={`1px solid ${accentColor}`}
                                  onClick={() => { handleRestorePrompt(prompt, index) }}
                                  _hover={{
                                    cursor: "pointer",
                                    bg: bgColor
                                  }}
                                >
                                  {isLoadingRestore == index ? (
                                    <Box m={"auto"}>
                                      <Spinner size={"sm"}></Spinner>
                                    </Box>
                                  ) : (
                                    <Text textAlign={"center"} w={"full"}>{t("prompt.restore")}</Text>
                                  )}
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
                {t("campaigns.showing")} {currentPrompts?.length}{" "}
                {t("campaigns.of")} {filteredPrompts?.length}{" "}
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

      <Modal
        isOpen={isConfirmationOpen}
        onClose={() => setIsConfirmationOpen(false)}
        isCentered
        variant="coftechModal"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign="center" mt={4}></ModalHeader>
          <ModalCloseButton />
          <ModalBody textAlign="center">
            <Box display="flex" justifyContent="center">
              <Icon as={CheckCircle} color={bgColor} fontSize={"4xl"} mb={2} />
            </Box>
            <Text fontSize="xl" fontWeight={600} mb={4}>
              {t("prompt.restored")}
            </Text>

            <Button
              bg={bgColor}
              color="white"
              _hover={{
                bg: hoverColor,
              }}
              onClick={() => {
                setIsConfirmationOpen(false);
                router.push("/prompts");
              }}
              borderRadius={"md"}
              w={"100%"}
            >
              {t("modal.continue")}
            </Button>
          </ModalBody>
          <ModalFooter />
        </ModalContent>
      </Modal>
    </>
  );
};

export async function getStaticPaths() {
  return {
    paths: [
      { params: { companyId: "1", botId: "1" } },
    ],
    fallback: "blocking",
  };
}

export const getStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common"])),
  },
});

export default withTranslation("common")(Home);
