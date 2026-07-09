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
import { Select } from "chakra-react-select";
import { AppShell } from '@component/components/layout'
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { withTranslation } from "react-i18next";
import {
  AddIcon,
  SearchIcon,
  ArrowUpIcon,
  ArrowDownIcon,
} from "@chakra-ui/icons";
import {
  ArrowSquareLeft,
  Edit01,
  Play,
  Trash01,
  Upload01,
} from "@untitled-ui/icons-react";
import Image from "next/image";
import active from "@component/assets/images/active.svg";
import inactive from "@component/assets/images/disable.svg";
import BotImage from "@component/assets/images/bot.svg";
import UpdateImage from "@component/assets/images/update.svg";
import { useAuthStore } from "@component/store/auth";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { FaWhatsapp } from "react-icons/fa";
import { useRouter } from "next/router";
import { Table } from "@component/components/Table/Table";
import { Thead } from "@component/components/Table/Thead";
import { Tr } from "@component/components/Table/Tr";
import { Th } from "@component/components/Table/Th";
import { Tbody } from "@component/components/Table/Tbody";
import { Td } from "@component/components/Table/Td";
import useCoftechColors from "@component/hooks/useCoftechColors";

const Contacts = ({ t }) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [contacts, setContacts] = useState([
    {
      uuid_unique: "1",
      user: "User 1",
      phoneNumber: "+34567890",
      paymentAmount: 20.99,
    },
    {
      uuid_unique: "2",
      user: "User 2",
      phoneNumber: "+34567890",
      paymentAmount: 20.99,
    },
    {
      uuid_unique: "3",
      user: "User 3",
      phoneNumber: "+34567890",
      paymentAmount: 20.99,
    },
    {
      uuid_unique: "4",
      user: "User 4",
      phoneNumber: "+34567890",
      paymentAmount: 20.99,
    },
    {
      uuid_unique: "5",
      user: "User 5",
      phoneNumber: "+34567890",
      paymentAmount: 20.99,
    },
    {
      uuid_unique: "6",
      user: "User 6",
      phoneNumber: "+34567890",
      paymentAmount: 20.99,
    },
    {
      uuid_unique: "7",
      user: "User 7",
      phoneNumber: "+34567890",
      paymentAmount: 20.99,
    },
    {
      uuid_unique: "8",
      user: "User 8",
      phoneNumber: "+34567890",
      paymentAmount: 20.99,
    },
  ]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [totalEntries, setTotalEntries] = useState(contacts.length);
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
    let sortableCampaigns = [...contacts];
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
  }, [contacts, sortConfig]);

  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const filteredCampaigns = sortedCampaigns.filter((document) =>
    document.user.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredCampaigns.length / itemsPerPage);
  const currentCampaigns = filteredCampaigns.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <>
      <AppShell
        title={t("campaigns.contacts.title")}
        showBackButton={true}
        onBackButtonClick={() => router.push("/campaigns/create-campaign")}
      >
        <Container maxW="full" padding={{ base: "0", md: "48px 32px" }}>
          <Box display={"flex"} flexDirection={"column"} gap={"30px"}>
            <HStack gap={"24px"} justifyContent={"end"}>
              <Button
                leftIcon={<Upload01 />}
                variant="solid"
                borderColor={bgColor}
                borderWidth={1}
                _hover={{ bg: hoverColor, color: "white" }}
                borderRadius={8}
                sx={{
                  color: bgColor,
                }}
                onClick={() => router.push("/campaigns/documents")}
              >
                {t("campaigns.contacts.updateDatabase")}
              </Button>
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
              <Table variant="simple" w={"full"} className="responsiveTable">
                <Thead>
                  <Tr>
                    <Th>
                      {t("campaigns.contacts.user")}
                      <Button
                        onClick={() => requestSort("user")}
                        size="xs"
                        variant="ghost"
                      >
                        {sortConfig.key === "user" &&
                        sortConfig.direction === "ascending" ? (
                          <ArrowUpIcon color={bgColor} />
                        ) : (
                          <ArrowDownIcon color={bgColor} />
                        )}
                      </Button>
                    </Th>
                    <Th>
                      {t("campaigns.contacts.number")}
                      <Button
                        onClick={() => requestSort("phoneNumber")}
                        size="xs"
                        variant="ghost"
                      >
                        {sortConfig.key === "phoneNumber" &&
                        sortConfig.direction === "ascending" ? (
                          <ArrowUpIcon color={bgColor} />
                        ) : (
                          <ArrowDownIcon color={bgColor} />
                        )}
                      </Button>
                    </Th>
                    <Th>
                      {t("campaigns.contacts.paymentAmount")}
                      <Button
                        onClick={() => requestSort("paymentAmount")}
                        size="xs"
                        variant="ghost"
                      >
                        {sortConfig.key === "paymentAmount" &&
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
                      <Td>{document.user}</Td>
                      <Td>{document.phoneNumber}</Td>
                      <Td>{document.paymentAmount}</Td>
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
                            <Edit01 color={iconColor} />
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

export default withTranslation("common")(Contacts);
