import React, { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  HStack,
  Text,
  Input,
  InputGroup,
  InputLeftElement,
  Container,
  useTheme,
} from "@chakra-ui/react";
import { Select, StylesConfig } from "chakra-react-select";
import { AppShell } from '@component/components/layout'
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { withTranslation } from "react-i18next";
import {
  AddIcon,
  DeleteIcon,
  EditIcon,
  SearchIcon,
  ArrowUpIcon,
  ArrowDownIcon,
} from "@chakra-ui/icons";
import {
  ArrowSquareLeft,
  ClockFastForward,
  Edit01,
  Play,
  Trash01,
} from "@untitled-ui/icons-react";
import Image from "next/image";
import active from "@component/assets/images/active.svg";
import inactive from "@component/assets/images/disable.svg";
import BotImage from "@component/assets/images/bot.svg";
import UpdateImage from "@component/assets/images/update.svg";
import { useAuthStore } from "@component/store/auth";
import { format } from "date-fns";
import { enUS, es, zhCN } from "date-fns/locale";
import { FaWhatsapp } from "react-icons/fa";
import { useRouter } from "next/router";
import { Table } from "@component/components/Table/Table";
import { Thead } from "@component/components/Table/Thead";
import { Tr } from "@component/components/Table/Tr";
import { Th } from "@component/components/Table/Th";
import { Tbody } from "@component/components/Table/Tbody";
import { Td } from "@component/components/Table/Td";
import useCoftechColors from "@component/hooks/useCoftechColors";

const Documents = ({ t }) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const dateLocale = router.locale === "es" ? es : router.locale === "ch" ? zhCN : enUS;
  const [documents, setDocuments] = useState([
    {
      uuid_unique: "1",
      databaseName: "Database 1",
      contactCounts: "5600",
      uploaded_at: "2023-10-01T00:00:00Z",
      updated_at: "2023-10-01T00:00:00Z",
    },
    {
      uuid_unique: "2",
      databaseName: "Database 2",
      contactCounts: "5600",
      uploaded_at: "2023-10-02T00:00:00Z",
      updated_at: "2023-10-02T00:00:00Z",
    },
    {
      uuid_unique: "3",
      databaseName: "Database 3",
      contactCounts: "5600",
      uploaded_at: "2023-10-02T00:00:00Z",
      updated_at: "2023-10-02T00:00:00Z",
    },
    {
      uuid_unique: "4",
      databaseName: "Database 4",
      contactCounts: "5600",
      uploaded_at: "2023-10-02T00:00:00Z",
      updated_at: "2023-10-02T00:00:00Z",
    },
    {
      uuid_unique: "5",
      databaseName: "Database 5",
      contactCounts: "5600",
      uploaded_at: "2023-10-02T00:00:00Z",
      updated_at: "2023-10-02T00:00:00Z",
    },
    {
      uuid_unique: "6",
      databaseName: "Database 6",
      contactCounts: "5600",
      uploaded_at: "2023-10-02T00:00:00Z",
      updated_at: "2023-10-02T00:00:00Z",
    },
    {
      uuid_unique: "7",
      databaseName: "Database 7",
      contactCounts: "5600",
      uploaded_at: "2023-10-02T00:00:00Z",
      updated_at: "2023-10-02T00:00:00Z",
    },
    {
      uuid_unique: "8",
      databaseName: "Database 8",
      contactCounts: "5600",
      uploaded_at: "2023-10-02T00:00:00Z",
      updated_at: "2023-10-02T00:00:00Z",
    },
  ]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [totalEntries, setTotalEntries] = useState(documents.length);
  const { token, user } = useAuthStore();

  const [sortConfig, setSortConfig] = useState({ key: "", direction: "" });

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

  const sortedCampaigns = React.useMemo(() => {
    let sortableCampaigns = [...documents];
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
  }, [documents, sortConfig]);

  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const filteredCampaigns = sortedCampaigns.filter((document) =>
    document.databaseName.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredCampaigns.length / itemsPerPage);
  const currentCampaigns = filteredCampaigns.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <AppShell
      title={t("campaigns.documents.title")}
      onBackButtonClick={() => router.push("/campaigns")}
      showBackButton={true}
    >
      <Container maxW="full" padding={{ base: "0", md: "48px 32px" }}>
        <Box display={"flex"} flexDirection={"column"} gap={"30px"}>
          <HStack gap={"24px"} justifyContent={"end"}>
            <Button
              leftIcon={<AddIcon />}
              variant="solid"
              bg={bgColor}
              _hover={{ bg: hoverColor }}
              color="white"
              borderRadius={8}
              onClick={() => router.push("/campaigns/new-campaign")}
            >
              {t("campaigns.newCampaign")}
            </Button>
          </HStack>

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
                value={{ value: itemsPerPage, label: itemsPerPage.toString() }}
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
                width={"140px"}
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
                placeholder={t("campaigns.documents.searchDatabase")}
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
            <Table variant="simple" w={"full"} className="responsiveTable">
              <Thead>
                <Tr>
                  <Th>
                    {t("campaigns.documents.databaseName")}
                    <Button
                      onClick={() => requestSort("databaseName")}
                      size="xs"
                      variant="ghost"
                    >
                      {sortConfig.key === "databaseName" &&
                      sortConfig.direction === "ascending" ? (
                        <ArrowUpIcon color={bgColor} />
                      ) : (
                        <ArrowDownIcon color={bgColor} />
                      )}
                    </Button>
                  </Th>
                  <Th>
                    {t("campaigns.documents.numberOfContacts")}
                    <Button
                      onClick={() => requestSort("contactCounts")}
                      size="xs"
                      variant="ghost"
                    >
                      {sortConfig.key === "contactCounts" &&
                      sortConfig.direction === "ascending" ? (
                        <ArrowUpIcon color={bgColor} />
                      ) : (
                        <ArrowDownIcon color={bgColor} />
                      )}
                    </Button>
                  </Th>
                  <Th>
                    {t("campaigns.documents.uploadDate")}
                    <Button
                      onClick={() => requestSort("uploaded_at")}
                      size="xs"
                      variant="ghost"
                    >
                      {sortConfig.key === "uploaded_at" &&
                      sortConfig.direction === "ascending" ? (
                        <ArrowUpIcon color={bgColor} />
                      ) : (
                        <ArrowDownIcon color={bgColor} />
                      )}
                    </Button>
                  </Th>
                  <Th>
                    {t("campaigns.documents.lastUpdate")}
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
                  <Th>{t("campaigns.actions")}</Th>
                </Tr>
              </Thead>
              <Tbody>
                {currentCampaigns.map((document) => (
                  <Tr key={document.uuid_unique}>
                    <Td>{document.databaseName}</Td>
                    <Td>
                      {document.contactCounts}
                      {t("campaigns.documents.contacts")}
                    </Td>
                    <Td>
                      {format(new Date(document.uploaded_at), "dd MMMM yyyy", {
                        locale: dateLocale,
                      })}
                    </Td>
                    <Td>
                      {format(new Date(document.updated_at), "dd MMMM yyyy", {
                        locale: dateLocale,
                      })}
                    </Td>
                    <Td>
                      <Box display={"flex"} gap={4}>
                        <Box
                          display="flex"
                          alignItems="center"
                          p={2}
                          borderRadius={8}
                          background={backgroundColor}
                          style={{ cursor: "pointer" }}
                        >
                          <ClockFastForward color={iconColor} />
                        </Box>
                        <Box
                          display="flex"
                          alignItems="center"
                          p={2}
                          borderRadius={8}
                          background={backgroundColor}
                          style={{ cursor: "pointer" }}
                        >
                          <Trash01 color={iconColor} />
                        </Box>
                      </Box>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>

          <Box
            display="flex"
            justifyContent="space-between"
            mt={4}
            flexWrap={"wrap"}
            gap={"8px"}
          >
            <Text fontSize={16} fontWeight={500} color={descriptionColor}>
              {t("campaigns.showing")} {currentCampaigns.length}{" "}
              {t("campaigns.of")} {totalEntries} {t("campaigns.entries")}
            </Text>
            <HStack>
              <Button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
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
  );
};

export const getStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common"])),
  },
});

export default withTranslation("common")(Documents);
