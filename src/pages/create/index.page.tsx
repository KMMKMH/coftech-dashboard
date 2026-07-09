/* eslint-disable react-hooks/exhaustive-deps */
import {
  Container,
  HStack,
  Text,
  VStack,
  Icon,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  Button,
  Input,
  ModalBody,
  FormControl,
  FormLabel,
  Select,
  IconButton,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
} from "@chakra-ui/react";
import { AppShell } from '@component/components/layout'
import { FiTrash2, FiPlus } from "react-icons/fi";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { withTranslation } from "react-i18next";
import { useAuthStore } from "@component/store/auth";
import useCoftechColors from "@component/hooks/useCoftechColors";
import { PlusSquare, Server01, UploadCloud01 } from "@untitled-ui/icons-react";
import { AppDispatch } from "@component/store";
import {
  CreateDeskBase,
  CreateDeskTable,
  GetDeskBase,
  GetDeskTable,
  RemoveDeskTable,
} from "@component/store/deskSlice";
import { useError } from "@component/utils/errorContext";

const Create = ({ t }) => {
  const dispatch: AppDispatch = useDispatch();
  const { user } = useAuthStore();
  const { showError } = useError();
  const [isBaseModalOpen, setIsBaseModalOpen] = useState(false);
  const [isTableModalOpen, setIsTableModalOpen] = useState(false);
  const [baseName, setBaseName] = useState("");
  const [tableName, setTableName] = useState("");
  const [columns, setColumns] = useState([{ name: "", type: "string" }]);
  const { base, table, loading, error: deskError } = useSelector((state: any) => state.desk);
  const {
    bgColor,
    hoverColor,
    panelBgColor,
    backgroundColor,
    descriptionColor,
    borderColor,
    textColor,
  } = useCoftechColors();

  useEffect(() => {
    if (user?.company_id !== undefined) {
      dispatch(GetDeskBase({ companyId: user?.company_id })).then(() => {
        if (base?.uuid_unique !== undefined) {
          dispatch(GetDeskTable({ baseId: base.uuid_unique }));
        }
      });
    }
  }, [dispatch, user?.company_id, user?.rol_key, base?.uuid_unique]);

  const handleConfirm = () => {
    dispatch(
      CreateDeskBase({
        companyId: user?.company_id,
        baseName: baseName,
      })
    )
      .then((response) => {
        if (response.payload.code === 200 && response.payload.status) {
          dispatch(GetDeskBase({ companyId: user?.company_id })).then(() => {
            setIsTableModalOpen(true);
          });
        }
      })
      .catch((error) => {
        console.error("Failed to assign extension:", error);
      });
    setIsBaseModalOpen(false);
    setBaseName("");
  };

  const handleTableConfirm = () => {
    dispatch(
      CreateDeskTable({
        baseId: base.uuid_unique,
        tableName: tableName,
        columns: columns,
      })
    ).then((response) => {
      if (response.payload.code === 200 && response.payload.status) {
        dispatch(GetDeskTable({ baseId: base.uuid_unique }));
      }
    });
    setIsTableModalOpen(false);
    setTableName("");
    setColumns([{ name: "", type: "string" }]);
  };

  const handleBaseModal = () => {
    if (base !== null) {
      setIsTableModalOpen(true);
    } else {
      setIsBaseModalOpen(true);
    }
  };

  useEffect(() => {
    if (deskError.message.length > 1) {
      showError(deskError.message)
    }
  }, [deskError])

  const handleCancel = () => {
    setIsBaseModalOpen(false);
  };

  const handleTableCancel = () => {
    setIsTableModalOpen(false);
    setColumns([{ name: "", type: "string" }]);
  };

  const handleAddColumn = () => {
    setColumns([...columns, { name: "", type: "string" }]);
  };

  const handleRemoveColumn = (index: number) => {
    const newColumns = [...columns];
    newColumns.splice(index, 1);
    setColumns(newColumns);
  };

  const handleColumnNameChange = (index: number, value: string) => {
    const newColumns = [...columns];
    newColumns[index].name = value;
    setColumns(newColumns);
  };

  const handleColumnTypeChange = (index: number, value: string) => {
    const newColumns = [...columns];
    newColumns[index].type = value;
    setColumns(newColumns);
  };

  const handleRemoveTable = (tableId: string) => {
    dispatch(RemoveDeskTable({ baseId: base.uuid_unique, tableId }))
      .then(() => {
        dispatch(GetDeskTable({ baseId: base.uuid_unique }));
      })
      .catch((error) => {
        console.error("Failed to remove table:", error);
      });
  };

  return (
    <>
      <AppShell title={t("create.title")}>
        <Container
          maxW="full"
          display={"flex"}
          flexDirection={"column"}
          gap={6}
          padding={{ base: "0", md: "48px 32px" }}
        >
          <HStack gap={"20px"}>
            <VStack
              alignItems={"flex-start"}
              bg={panelBgColor}
              p={6}
              borderWidth={1}
              borderColor={borderColor}
              borderRadius={12}
              w={"full"}
              _hover={{
                bg: bgColor,
                color: "white",
              }}
              cursor={"pointer"}
              onClick={handleBaseModal}
            >
              <Icon as={PlusSquare} w={6} h={6} />
              <Text fontSize={16} fontWeight={500}>
                {t("create.newTable.title")}
              </Text>
              <Text fontSize={14} fontWeight={500}>
                {t("create.newTable.description")}
              </Text>
            </VStack>
            <VStack
              alignItems={"flex-start"}
              bg={panelBgColor}
              p={6}
              borderWidth={1}
              borderColor={borderColor}
              borderRadius={12}
              w={"full"}
              _hover={{
                bg: bgColor,
                color: "white",
              }}
              cursor={"pointer"}
            >
              <Icon as={UploadCloud01} w={6} h={6} />
              <Text fontSize={16} fontWeight={500}>
                {t("create.importData.title")}
              </Text>
              <Text fontSize={14} fontWeight={500}>
                {t("create.importData.description")}
              </Text>
            </VStack>
            <VStack
              alignItems={"flex-start"}
              bg={panelBgColor}
              p={6}
              borderWidth={1}
              borderColor={borderColor}
              borderRadius={12}
              w={"full"}
              _hover={{
                bg: bgColor,
                color: "white",
              }}
              cursor={"pointer"}
            >
              <Icon as={Server01} w={6} h={6} />
              <Text fontSize={16} fontWeight={500}>
                {t("create.connectData.title")}
              </Text>
              <Text fontSize={14} fontWeight={500}>
                {t("create.connectData.description")}
              </Text>
            </VStack>
          </HStack>
          <HStack>
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
                    <Th borderColor={borderColor}>{t("create.table.table")}</Th>
                    <Th borderColor={borderColor}>
                      {t("create.table.source")}
                    </Th>
                    <Th borderColor={borderColor}>
                      {t("create.table.created")}
                    </Th>
                    <Th borderColor={borderColor}></Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {table.map((item) => (
                    <Tr
                      key={item.uuid_unique}
                      _hover={{
                        background: borderColor,
                      }}
                      cursor={"pointer"}
                    >
                      <Td borderColor={borderColor}>{item.table_name}</Td>
                      <Td borderColor={borderColor}>-</Td>
                      <Td borderColor={borderColor} fontSize={14}>
                        {item.created_at}
                      </Td>
                      <Td borderColor={borderColor}>
                        <IconButton
                          icon={<FiTrash2 />}
                          aria-label="Remove table"
                          onClick={() => handleRemoveTable(item.uuid_unique)}
                          variant="ghost"
                          colorScheme="red"
                        />
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          </HStack>
        </Container>
      </AppShell>

      {/* Base Modal */}
      <Modal
        isOpen={isBaseModalOpen}
        onClose={handleCancel}
        isCentered
        variant="coftechModal"
      >
        <ModalOverlay
          sx={{
            backdropFilter: "blur(10px)",
          }}
        />
        <ModalContent p={2}>
          <ModalHeader textAlign={"start"}>
            {t("create.createBaseModal.title")}
          </ModalHeader>
          <VStack px={6}>
            <Input
              placeholder={t("create.createBaseModal.baseNamePlaceholder")}
              value={baseName}
              onChange={(e) => setBaseName(e.target.value)}
              background={backgroundColor}
              border="none"
              focusBorderColor={bgColor}
              _placeholder={{ color: "gray.500" }}
              borderRadius="md"
              boxShadow="0px 2px 4px -2px #0F172A0F, 0px 4px 8px -2px #0F172A1A"
            />
          </VStack>
          <ModalFooter gap={4}>
            <Button
              variant="outline"
              borderColor={bgColor}
              onClick={handleCancel}
              _hover={{ bg: hoverColor, color: "white" }}
            >
              {t("create.createBaseModal.cancel")}
            </Button>
            <Button
              variant="solid"
              bg={bgColor}
              onClick={handleConfirm}
              _hover={{ bg: hoverColor }}
              color={"white"}
            >
              {t("create.createBaseModal.createBase")}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Table Modal */}
      <Modal
        isOpen={isTableModalOpen}
        onClose={handleTableCancel}
        isCentered
        variant="coftechModal"
      >
        <ModalOverlay
          sx={{
            backdropFilter: "blur(10px)",
          }}
        />
        <ModalContent p={2}>
          <ModalHeader textAlign={"start"}>
            {t("create.createTableModal.title")}
          </ModalHeader>
          <ModalBody>
            <VStack gap={4}>
              <Input
                placeholder={t("create.createTableModal.tableNamePlaceholder")}
                value={tableName}
                onChange={(e) => setTableName(e.target.value)}
                background={backgroundColor}
                border="none"
                focusBorderColor={bgColor}
                _placeholder={{ color: "gray.500" }}
                borderRadius="md"
                boxShadow="0px 2px 4px -2px #0F172A0F, 0px 4px 8px -2px #0F172A1A"
              />
              <VStack
                maxH={"300px"}
                overflowY={"auto"}
                p={1}
                sx={{
                  "&::-webkit-scrollbar": {
                    width: "4px",
                  },
                  "&::-webkit-scrollbar-thumb": {
                    background: "#64748B",
                    borderRadius: "2px",
                  },
                  "&::-webkit-scrollbar-thumb:hover": {
                    background: "#475569",
                  },
                }}
              >
                {columns.map((column, index) => (
                  <HStack key={index} w="full" alignItems={"flex-end"}>
                    <FormControl>
                      <FormLabel fontSize={14} fontWeight={300}>
                        {t("create.createTableModal.columnName")}
                      </FormLabel>
                      <Input
                        value={column.name}
                        onChange={(e) =>
                          handleColumnNameChange(index, e.target.value)
                        }
                        background={backgroundColor}
                        border="none"
                        focusBorderColor={bgColor}
                        _placeholder={{ color: "gray.500" }}
                        borderRadius="md"
                        boxShadow="0px 2px 4px -2px #0F172A0F, 0px 4px 8px -2px #0F172A1A"
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel fontSize={14} fontWeight={300}>
                        {t("create.createTableModal.olumnType")}
                      </FormLabel>
                      <Select
                        value={column.type}
                        onChange={(e) =>
                          handleColumnTypeChange(index, e.target.value)
                        }
                        background={backgroundColor}
                        border="none"
                        focusBorderColor={bgColor}
                        borderRadius="md"
                        boxShadow="0px 2px 4px -2px #0F172A0F, 0px 4px 8px -2px #0F172A1A"
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
                    </FormControl>
                    <IconButton
                      icon={<FiTrash2 />}
                      aria-label="Remove column"
                      onClick={() => handleRemoveColumn(index)}
                      variant="ghost"
                      colorScheme="red"
                    />
                  </HStack>
                ))}
              </VStack>
              <Button
                variant="ghost"
                onClick={handleAddColumn}
                leftIcon={<FiPlus />}
                color={bgColor}
              >
                {t("create.createTableModal.addColumn")}
              </Button>
            </VStack>
          </ModalBody>
          <ModalFooter gap={4}>
            <Button
              variant="outline"
              borderColor={bgColor}
              onClick={handleTableCancel}
              _hover={{ bg: hoverColor, color: "white" }}
            >
              {t("create.createTableModal.cancel")}
            </Button>
            <Button
              variant="solid"
              bg={bgColor}
              onClick={handleTableConfirm}
              _hover={{ bg: hoverColor }}
              color={"white"}
            >
              {t("create.createTableModal.createTable")}
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

export default withTranslation("common")(Create);
