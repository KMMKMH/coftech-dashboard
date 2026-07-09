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
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  VStack,
  ModalFooter,
  useDisclosure,
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
import { Edit01, Play, Trash01, Upload01 } from "@untitled-ui/icons-react";
import Image from "next/image";
import active from "@component/assets/images/active.svg";
import inactive from "@component/assets/images/disable.svg";
import BotImage from "@component/assets/images/bot.svg";
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

const Campaigns = ({ t }) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const dateLocale = router.locale === "es" ? es : router.locale === "ch" ? zhCN : enUS;
  const [campaigns, setCampaigns] = useState([
    {
      uuid_unique: "1",
      campaignName: "Campaign 1",
      campaignNumber: "313144124",
      activated: true,
      updated_at: "2023-10-01T00:00:00Z",
    },
    {
      uuid_unique: "2",
      campaignName: "Campaign 2",
      campaignNumber: "313144124",
      activated: true,
      updated_at: "2023-10-02T00:00:00Z",
    },
    {
      uuid_unique: "3",
      campaignName: "Campaign 3",
      campaignNumber: "313144124",
      activated: true,
      updated_at: "2023-10-02T00:00:00Z",
    },
    {
      uuid_unique: "4",
      campaignName: "Campaign 4",
      campaignNumber: "313144124",
      activated: true,
      updated_at: "2023-10-02T00:00:00Z",
    },
    {
      uuid_unique: "5",
      campaignName: "Campaign 5",
      campaignNumber: "313144124",
      activated: true,
      updated_at: "2023-10-02T00:00:00Z",
    },
    {
      uuid_unique: "6",
      campaignName: "Campaign 6",
      campaignNumber: "313144124",
      activated: true,
      updated_at: "2023-10-02T00:00:00Z",
    },
    {
      uuid_unique: "7",
      campaignName: "Campaign 7",
      campaignNumber: "313144124",
      activated: true,
      updated_at: "2023-10-02T00:00:00Z",
    },
    {
      uuid_unique: "8",
      campaignName: "Campaign 8",
      campaignNumber: "313144124",
      activated: true,
      updated_at: "2023-10-02T00:00:00Z",
    },
  ]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [totalEntries, setTotalEntries] = useState(campaigns.length);
  const { token, user } = useAuthStore();

  const [sortConfig, setSortConfig] = useState({ key: "", direction: "" });

  const { isOpen, onOpen, onClose } = useDisclosure();

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
    const hasSeenModal = localStorage.getItem("CampaignsWelcomeModal");
    if (!hasSeenModal) {
      onOpen();
      localStorage.setItem("CampaignsWelcomeModal", "true");
    }
  }, [onOpen]);

  const optionsBot = [
    {
      value: "Bot1",
      label: (
        <HStack>
          <Image src={BotImage} alt="Bot1" width={24} height={24} />
          <Text>Bot1</Text>
        </HStack>
      ),
    },
    {
      value: "Bot2",
      label: (
        <HStack>
          <Image src={BotImage} alt="Bot2" width={24} height={24} />
          <Text>Bot2</Text>
        </HStack>
      ),
    },
    {
      value: "Bot3",
      label: (
        <HStack>
          <Image src={BotImage} alt="Bot3" width={24} height={24} />
          <Text>Bot3</Text>
        </HStack>
      ),
    },
  ];

  const optionsStatus = [
    {
      value: "activated",
      label: (
        <HStack>
          <Image src={active} alt="activated" />
          <Text>{t("campaigns.activated")}</Text>
        </HStack>
      ),
    },
    {
      value: "inactivated",
      label: (
        <HStack>
          <Image src={inactive} alt="inactivated" />
          <Text>{t("campaigns.inactivated")}</Text>
        </HStack>
      ),
    },
  ];

  const sortedCampaigns = React.useMemo(() => {
    let sortableCampaigns = [...campaigns];
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
  }, [campaigns, sortConfig]);

  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const filteredCampaigns = sortedCampaigns.filter((campaign) =>
    campaign.campaignName.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredCampaigns.length / itemsPerPage);
  const currentCampaigns = filteredCampaigns.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <AppShell title={t("campaigns.title")}>
      <Container maxW="full" padding={{ base: "0", md: "48px 32px" }}>
        <Modal
          isOpen={isOpen}
          onClose={onClose}
          size={"xl"}
          isCentered
          variant="coftechModal"
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader textAlign="center">
              {t("modalsWelcome.campaigns.welcome")}
            </ModalHeader>
            <ModalBody>
              <VStack spacing={4} textAlign="center">
                <Image
                  src="/images/notifications.png"
                  alt="Campaigns"
                  width={300}
                  height={30}
                />
                <Text fontSize="md">
                  {t("modalsWelcome.campaigns.description")}
                </Text>
              </VStack>
            </ModalBody>
            <ModalFooter justifyContent="center">
              <Button
                bg={bgColor}
                color={"white"}
                _hover={{
                  bg: hoverColor,
                }}
                w={"100%"}
                onClick={onClose}
              >
                {t("modalsWelcome.campaigns.start")}
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        <Box display={"flex"} flexDirection={"column"} gap={"30px"}>
          <Box display="flex" justifyContent="space-between">
            <Text fontSize={32} fontWeight="700"></Text>
          </Box>

          <HStack gap={"24px"} justifyContent={"end"}>
            <Button
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
              {t("campaigns.viewDocuments")}
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
            <Select
              options={optionsBot}
              placeholder={t("campaigns.filterByBot")}
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
              options={optionsStatus}
              placeholder={t("campaigns.filterByStatus")}
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
                  width: "180px",
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
                    {t("campaigns.campaignName")}
                    <Button
                      onClick={() => requestSort("campaignName")}
                      size="xs"
                      variant="ghost"
                    >
                      {sortConfig.key === "campaignName" &&
                      sortConfig.direction === "ascending" ? (
                        <ArrowUpIcon color={bgColor} />
                      ) : (
                        <ArrowDownIcon color={bgColor} />
                      )}
                    </Button>
                  </Th>
                  <Th>
                    {t("campaigns.assignedBot")}
                    <Button
                      onClick={() => requestSort("campaignNumber")}
                      size="xs"
                      variant="ghost"
                    >
                      {sortConfig.key === "campaignNumber" &&
                      sortConfig.direction === "ascending" ? (
                        <ArrowUpIcon color={bgColor} />
                      ) : (
                        <ArrowDownIcon color={bgColor} />
                      )}
                    </Button>
                  </Th>
                  <Th>
                    {t("campaigns.programmed")}
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
                    {t("campaigns.state")}
                    <Button
                      onClick={() => requestSort("activated")}
                      size="xs"
                      variant="ghost"
                    >
                      {sortConfig.key === "activated" &&
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
                {currentCampaigns.map((campaign) => (
                  <Tr key={campaign.uuid_unique}>
                    <Td>{campaign.campaignName}</Td>
                    <Td>
                      <Box display="flex" alignItems="center" gap="12px">
                        <FaWhatsapp color="green" size={30} />
                        {campaign.campaignNumber}
                      </Box>
                    </Td>
                    <Td>
                      {format(new Date(campaign.updated_at), "dd MMMM yyyy", {
                        locale: dateLocale,
                      })}
                    </Td>
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
                        width="110px"
                      >
                        <Image src={active} alt="Active"></Image>
                        {t("campaigns.activated")}
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
                          style={{ cursor: "pointer" }}
                        >
                          <Play color={iconColor} />
                        </Box>
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

export default withTranslation("common")(Campaigns);
