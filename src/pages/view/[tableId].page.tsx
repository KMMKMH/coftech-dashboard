/* eslint-disable react-hooks/exhaustive-deps */
import {
  Button,
  Container,
  HStack,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Spinner,
  Tab,
  Table,
  TableContainer,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  VStack,
} from "@chakra-ui/react";
import { AppShell } from '@component/components/layout'
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { withTranslation } from "react-i18next";
import { useAuthStore } from "@component/store/auth";
import useCoftechColors from "@component/hooks/useCoftechColors";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {
  CreateDeskTableColumn,
  CreateDeskTableData,
  GetDeskTableById,
  GetDeskTableColumn,
  GetDeskTableData,
  RemoveDeskTableColumn,
  UpdateDeskTableColumn,
} from "@component/store/deskSlice";
import { AppDispatch } from "@component/store";
import {
  ChevronRight,
  Dataflow02,
  File02,
  Grid01,
  Hash02,
  Type01,
} from "@untitled-ui/icons-react";
import { SearchIcon } from "@chakra-ui/icons";
import { useError } from "@component/utils/errorContext";

export const getServerSideProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
};

const TablePage = ({ t }) => {
  const dispatch: AppDispatch = useDispatch();
  const router = useRouter();
  const { showError } = useError();
  const { tableId } = router.query;
  const { user } = useAuthStore();
  const { base, table, columns, data, loading, error: deskError } = useSelector(
    (state: any) => state.desk
  );
  const [tableTitle, setTableTitle] = useState("");
  const [selectedField, setSelectedField] = useState(null);

  const [newFieldVisible, setNewFieldVisible] = useState(false);
  const [newColumnName, setNewColumnName] = useState("");
  const [newColumnType, setNewColumnType] = useState("string");

  const [editableColumnName, setEditableColumnName] = useState("");
  const [editableColumnType, setEditableColumnType] = useState("");

  const [columnValues, setColumnValues] = useState<{ [key: string]: string }>(
    {}
  );

  const [isChanges, setIsChanges] = useState(false);

  const {
    bgColor,
    hoverColor,
    panelBgColor,
    backgroundColor,
    descriptionColor,
    borderColor,
    textColor,
  } = useCoftechColors();

  const tableIdString = Array.isArray(tableId) ? tableId[0] : tableId;

  useEffect(() => {
    if (deskError.message.length > 1) {
      showError(deskError.message)
    }
  }, [deskError])

  useEffect(() => {
    setNewColumnName("");
    setNewColumnType("string");
    if (
      user?.company_id !== undefined &&
      base?.uuid_unique !== undefined &&
      tableIdString
    ) {
      dispatch(
        GetDeskTableById({ baseId: base.uuid_unique, tableId: tableIdString })
      ).then((res) => {
        setTableTitle(res.payload.data[0].table_name);
        dispatch(
          GetDeskTableColumn({ tableId: res.payload.data[0].uuid_unique })
        ).then((res) => {
          const firstColumn = res.payload.data[0];
          setNewFieldVisible(false);
          setSelectedField(firstColumn);
          setEditableColumnName(firstColumn?.column_name);
          setEditableColumnType(firstColumn?.column_type);
        });
      });
    }
  }, [dispatch, user?.company_id, base?.uuid_unique, tableId, tableIdString]);

  useEffect(() => {
    setColumnValues({});
    if (tableIdString) {
      dispatch(GetDeskTableData({ tableId: tableIdString }));
    }
  }, [dispatch, user?.company_id, base?.uuid_unique, tableIdString]);

  const handleSaveChanges = () => {
    if (selectedField) {
      dispatch(
        UpdateDeskTableColumn({
          tableId: tableIdString,
          columnId: selectedField.uuid_unique,
          editColumnName: editableColumnName,
          editColumnType: editableColumnType,
        })
      ).then((result) => {
        if (UpdateDeskTableColumn.fulfilled.match(result)) {
          dispatch(GetDeskTableColumn({ tableId: tableIdString }));
        } else {
          console.error("Failed to update column:", result.error.message);
        }
      });
    } else if (newFieldVisible) {
      dispatch(
        CreateDeskTableColumn({
          tableId: tableIdString,
          newColumnName: newColumnName,
          newColumnType: newColumnType,
        })
      ).then((result) => {
        if (CreateDeskTableColumn.fulfilled.match(result)) {
          const newColumn = {
            uuid_unique: result.payload.data.uuid_unique,
            column_name: newColumnName,
            column_type: newColumnType,
          };
          setSelectedField(newColumn);
          setEditableColumnName(newColumnName);
          setEditableColumnType(newColumnType);
          dispatch(GetDeskTableColumn({ tableId: tableIdString }));
          setNewFieldVisible(false);
        } else {
          console.error("Failed to create new column:", result.error.message);
        }
      });
    }
  };

  const handleNewFieldClick = () => {
    setNewColumnName("");
    setNewColumnType("string");
    setSelectedField(null);
    setNewFieldVisible(true);
  };

  const handleSelectFieldClick = (item: any) => {
    setSelectedField(item);
    setEditableColumnName(item.column_name);
    setEditableColumnType(item.column_type);
    setNewFieldVisible(false);
  };

  const handleRemoveColumn = () => {
    if (selectedField) {
      dispatch(
        RemoveDeskTableColumn({
          tableId: tableIdString,
          columnId: selectedField.uuid_unique,
        })
      ).then((result) => {
        if (RemoveDeskTableColumn.fulfilled.match(result)) {
          dispatch(GetDeskTableColumn({ tableId: tableIdString })).then(
            (res) => {
              const firstColumn = res.payload.data[0];
              setSelectedField(firstColumn);
              setEditableColumnName(firstColumn?.column_name);
              setEditableColumnType(firstColumn?.column_type);
            }
          );
          setSelectedField(null);
        } else {
          console.error("Failed to remove column:", result.error.message);
        }
      });
    }
  };

  const handleInputChange = (columnId: string, value: string) => {
    setColumnValues((prev) => ({
      ...prev,
      [columnId]: value,
    }));
    setIsChanges(true);
  };

  const handleInputSaveChanges = () => {
    const columnData = columns.map((item) => ({
      columnID: item.uuid_unique,
      data: columnValues[item.uuid_unique] || "",
    }));

    dispatch(
      CreateDeskTableData({
        tableId: tableIdString,
        columnData: columnData,
      })
    ).then((result) => {
      if (CreateDeskTableData.fulfilled.match(result)) {
        dispatch(GetDeskTableData({ tableId: tableIdString })).then((res) => {
          setIsChanges(false);
          setColumnValues({});
        });
      } else {
        console.error("Failed to create table data:", result.error.message);
      }
    });
  };

  return (
    <>
      <AppShell>
        <Container
          minHeight="100vh"
          maxW="full"
          h={"full"}
          display={"flex"}
          flexDirection={"column"}
          gap={6}
          bg={backgroundColor}
        >
          <Tabs variant={"none"}>
            <HStack justify={"space-between"}>
              <Text fontSize={24} fontWeight={500}>
                {tableTitle}
              </Text>

              <TabList
                display={"flex"}
                borderWidth={1}
                borderColor={borderColor}
                background={panelBgColor}
                p={1}
                gap={1}
                borderRadius={8}
              >
                <Tab
                  _selected={{ bg: bgColor, color: "white" }}
                  display={"flex"}
                  gap={1}
                  borderRadius={6}
                  px={2}
                  py={1}
                >
                  <Icon as={Grid01} w={4} h={4} />
                  <Text fontSize={14}>{t("deskPage.header.data")}</Text>
                </Tab>
                <Tab
                  _selected={{ bg: bgColor, color: "white" }}
                  display={"flex"}
                  gap={1}
                  borderRadius={6}
                  px={2}
                  py={1}
                >
                  <Icon as={Dataflow02} w={4} h={4} />
                  <Text fontSize={14}>{t("deskPage.header.details")}</Text>
                </Tab>
              </TabList>
            </HStack>
            <TabPanels>
              {/* Data */}
              <TabPanel>
                {loading ? (
                  <Spinner color={bgColor} size="lg" />
                ) : columns.length === 0 ? (
                  <Text fontSize={16} fontWeight={500}>
                    {t("deskPage.noColumn")}
                  </Text>
                ) : (
                  <VStack alignItems={"end"} gap={4}>
                    <TableContainer
                      w={"full"}
                      borderWidth={1}
                      borderColor={borderColor}
                      borderRadius={"12px"}
                      background={panelBgColor}
                    >
                      <Table size="md" variant="simple">
                        <Thead>
                          <Tr>
                            {columns.map((item) => (
                              <Th
                                borderColor={borderColor}
                                key={item.uuid_unique}
                              >
                                {item.column_name}
                              </Th>
                            ))}
                          </Tr>
                        </Thead>
                        <Tbody>
                          {data.length === 0 ? (
                            <Tr>
                              <Td colSpan={columns.length}>
                                <Text>{t("deskPage.noData")}</Text>
                              </Td>
                            </Tr>
                          ) : (
                            data.map((row, rowIndex) => (
                              <Tr key={rowIndex}>
                                {columns.map((column) => (
                                  <Td
                                    borderColor={borderColor}
                                    key={column.uuid_unique}
                                  >
                                    {row[column.column_name] || ""}{" "}
                                  </Td>
                                ))}
                              </Tr>
                            ))
                          )}
                          <Tr>
                            {columns.map((item) => (
                              <Td
                                borderColor={borderColor}
                                key={item.uuid_unique}
                              >
                                <Input
                                  _focus={{
                                    borderWidth: 1,
                                    borderColor: bgColor,
                                    boxShadow: "none",
                                  }}
                                  placeholder={`${t("deskPage.enter")} ${item.column_name
                                    }`}
                                  value={columnValues[item.uuid_unique] || ""}
                                  onChange={(e) =>
                                    handleInputChange(
                                      item.uuid_unique,
                                      e.target.value
                                    )
                                  }
                                />
                              </Td>
                            ))}
                          </Tr>
                        </Tbody>
                      </Table>
                    </TableContainer>

                    {isChanges && (
                      <Button
                        bg={bgColor}
                        color={"white"}
                        height={"36px"}
                        _hover={{
                          bg: hoverColor,
                        }}
                        fontSize={14}
                        fontWeight={300}
                        onClick={handleInputSaveChanges}
                      >
                        {t("deskPage.saveChanges")}
                      </Button>
                    )}
                  </VStack>
                )}
              </TabPanel>
              {/* Details */}
              <TabPanel display={"flex"} flexDir={"column"} gap={4}>
                <HStack justify={"space-between"}>
                  <InputGroup
                    sx={{
                      background: panelBgColor,
                      borderRadius: "20px",
                      width: { base: "100%", md: "300px" },
                      boxShadow:
                        "0px 2px 4px -2px #0F172A0F, 0px 4px 8px -2px #0F172A1A",
                    }}
                  >
                    <InputLeftElement pointerEvents="none">
                      <SearchIcon color={bgColor} />
                    </InputLeftElement>
                    <Input
                      focusBorderColor={bgColor}
                      border={"0.5px"}
                      placeholder={t("deskPage.search")}
                    />
                  </InputGroup>
                  <Button
                    bg={bgColor}
                    color={"white"}
                    height={"36px"}
                    _hover={{
                      bg: hoverColor,
                    }}
                    fontSize={14}
                    fontWeight={300}
                    onClick={handleNewFieldClick}
                  >
                    {t("deskPage.newField")}
                  </Button>
                </HStack>
                <HStack align={"start"}>
                  {/* Field Section */}
                  <VStack
                    background={panelBgColor}
                    p={4}
                    w={"full"}
                    maxHeight={"600px"}
                    h={"600px"}
                    borderRadius={8}
                    borderWidth={1}
                    borderColor={borderColor}
                  >
                    {columns.length === 0 ? (
                      <Text fontSize={16} fontWeight={500}>
                        {t("deskPage.noColumn")}
                      </Text>
                    ) : (
                      columns.map((item) => (
                        <HStack
                          key={item.uuid_unique}
                          bg={
                            selectedField?.column_name === item.column_name
                              ? backgroundColor
                              : "transparent"
                          }
                          borderRadius={6}
                          borderWidth={1}
                          borderColor={borderColor}
                          gap={4}
                          justify={
                            selectedField?.column_name === item.column_name
                              ? "space-between"
                              : "flex-start"
                          }
                          w={"full"}
                          px={4}
                          py={2}
                          onClick={() => {
                            handleSelectFieldClick(item);
                          }}
                          cursor={"pointer"}
                          _focus={{
                            bg: bgColor,
                          }}
                        >
                          <HStack>
                            {item.column_type === "string" ? (
                              <Icon as={Type01} w={5} h={5} />
                            ) : item.column_type === "int" ? (
                              <Icon as={Hash02} w={5} h={5} />
                            ) : item.column_type === "float" ? (
                              <svg
                                data-v-883ffaa0=""
                                stroke="currentColor"
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <rect
                                  x="8.36365"
                                  y="3"
                                  width="4.3636"
                                  height="8.52631"
                                  rx="2.1818"
                                  stroke="currentColor"
                                  stroke-width="2"
                                ></rect>
                                <ellipse
                                  cx="4.96727"
                                  cy="11.2635"
                                  rx="0.967266"
                                  ry="0.945"
                                  fill="currentColor"
                                ></ellipse>
                                <rect
                                  x="15.6362"
                                  y="3"
                                  width="4.3636"
                                  height="8.52631"
                                  rx="2.1818"
                                  stroke="currentColor"
                                  stroke-width="2"
                                ></rect>
                                <path
                                  d="M16.6061 21L20 17.6842L16.6061 14.3684"
                                  stroke="currentColor"
                                  stroke-width="2"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                ></path>
                                <path
                                  d="M8.36365 17.6843H19.9999"
                                  stroke="currentColor"
                                  stroke-width="2"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                ></path>
                              </svg>
                            ) : item.column_type === "longtext" ? (
                              <Icon as={File02} w={5} h={5} />
                            ) : (
                              <Text>{item.column_type}</Text>
                            )}
                            <Text
                              borderColor={borderColor}
                              fontSize={16}
                              fontWeight={300}
                            >
                              {item.column_name}
                            </Text>
                          </HStack>
                          {selectedField?.column_name === item.column_name ? (
                            <Icon as={ChevronRight} w={4} h={4} />
                          ) : (
                            ""
                          )}
                        </HStack>
                      ))
                    )}
                  </VStack>

                  {/* Detail Section */}
                  <VStack
                    borderWidth={1}
                    borderColor={borderColor}
                    background={panelBgColor}
                    p={4}
                    w={"full"}
                    maxHeight={"600px"}
                    justify={"space-between"}
                    h={"600px"}
                    borderRadius={8}
                  >
                    <VStack w={"full"}>
                      {selectedField && (
                        <>
                          <Input
                            placeholder={t(
                              "create.createBaseModal.baseNamePlaceholder"
                            )}
                            value={editableColumnName}
                            onChange={(e) =>
                              setEditableColumnName(e.target.value)
                            }
                            background={backgroundColor}
                            border="none"
                            focusBorderColor={bgColor}
                            borderRadius="md"
                            boxShadow="0px 2px 4px -2px #0F172A0F, 0px 4px 8px -2px #0F172A1A"
                          />
                          <Select
                            borderWidth={1}
                            focusBorderColor={bgColor}
                            onChange={(e) =>
                              setEditableColumnType(e.target.value)
                            }
                            value={editableColumnType}
                          >
                            <option value="string">
                              {t("deskPage.columnType.string")}
                            </option>
                            <option value="int">
                              {t("deskPage.columnType.int")}
                            </option>
                            <option value="float">
                              {t("deskPage.columnType.float")}
                            </option>
                            <option value="longtext">
                              {t("deskPage.columnType.longtext")}
                            </option>
                          </Select>
                        </>
                      )}
                      {newFieldVisible && (
                        <>
                          <Input
                            placeholder={t("deskPage.newColumnPlaceholder")}
                            value={newColumnName}
                            onChange={(e) => setNewColumnName(e.target.value)}
                          />
                          <Select
                            onChange={(e) => setNewColumnType(e.target.value)}
                            value={newColumnType}
                          >
                            <option value="string">
                              {t("deskPage.columnType.string")}
                            </option>
                            <option value="int">
                              {t("deskPage.columnType.int")}
                            </option>
                            <option value="float">
                              {t("deskPage.columnType.float")}
                            </option>
                            <option value="longtext">
                              {t("deskPage.columnType.longtext")}
                            </option>
                          </Select>
                        </>
                      )}
                    </VStack>
                    <HStack w={"full"} justify={"space-between"}>
                      <Button
                        height={"36px"}
                        fontSize={14}
                        fontWeight={300}
                        onClick={handleRemoveColumn}
                      >
                        {t("deskPage.remove")}
                      </Button>
                      <Button
                        bg={bgColor}
                        color={"white"}
                        height={"36px"}
                        _hover={{
                          bg: hoverColor,
                        }}
                        fontSize={14}
                        fontWeight={300}
                        onClick={handleSaveChanges}
                      >
                        {t("deskPage.saveChanges")}
                      </Button>
                    </HStack>
                  </VStack>
                </HStack>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Container>
      </AppShell>
    </>
  );
};

export default withTranslation("common")(TablePage);
