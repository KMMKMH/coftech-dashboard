/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  VStack,
  Button,
  Text,
  useColorModeValue,
  HStack,
  Box,
  useBreakpointValue,
  Input,
  InputGroup,
  InputRightElement,
  SimpleGrid,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import useCoftechColors from "@component/hooks/useCoftechColors";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@component/store";
import { useLazyGetFileDataQuery } from "@component/store/RTK/FileManager";
import { GetBotExtension } from "@component/store/integrationsSlice";
import { useError } from "@component/utils/errorContext";
import { FILEMANAGER } from "@component/constants/fileManager";
import { useFileManagerErrorEvent } from "@component/hooks/useFileOperations";
import { SearchIcon } from "@chakra-ui/icons";
import { Select } from "chakra-react-select";
import useCoftechSelect from "@component/hooks/useCoftechSelect";
import FileCard from "./FileCard";
import { FileType } from "@component/types/fileType";
import Loading from "./Loading";
import { sanitizeHTML } from "@component/utils/sanitization";

interface PromptFilesModalProps {
  company: string,
  isOpen: boolean,
  botID: string,
  allowedTypes: string[],
  markerId: string,
  loadingFiles: boolean,
  files: FileType[],
  textRef: any,
  onClose: () => void,
  updateLines: () => void
}

const PromptFilesModal: React.FC<PromptFilesModalProps> = ({ isOpen, botID, allowedTypes, markerId, loadingFiles, files, textRef, onClose, updateLines }) => {
  const { t } = useTranslation(FILEMANAGER.COMMON);
  const { showError } = useError();

  const { bgColor, hoverColor, panelBgColor, descriptionColor, lightAccent } = useCoftechColors();
  const { style } = useCoftechSelect();

  const optionsFormats: any = (allowedTypes || []).map((type) => {
    return {
      value: type,
      label: (
        <HStack>
          <Text>{type}</Text>
        </HStack>
      ),
    }
  }
  )

  const optionsDays: any = ([5, 20, 50]).map((days) => {
    return {
      value: days,
      label: (
        <HStack>
          <Text>{t("fileManager.last_days", { days })}</Text>
        </HStack>
      ),
    }
  }
  )


  const dispatch: AppDispatch = useDispatch()

  const [isLoading, setIsLoading] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<number[]>([]);
  const [notification, setNotification] = useState<{ event: string, message: string, roomID: string }>()
  const [formatFilter, setFormatFilter] = useState()
  const [daysFilter, setDaysFilter] = useState<number>()
  const [search, setSearch] = useState<string>("")
  const [filteredFiles, setFilteredFiles] = useState<FileType[]>([])
  const delimiter = "~~~END~~~";

  const [triggerGetURL] = useLazyGetFileDataQuery();

  useFileManagerErrorEvent({
    notification,
    onClose,
    setNotification,
    setIsLoading,
  })

  useEffect(() => {
    if (files) {
      setFilteredFiles(files)
    }
  }, [files])

  useEffect(() => {
    if (files) {
      setFilteredFiles(files.filter((file) => formatFilter ? file.extension.includes(formatFilter) : true).filter((file) => search.length > 0 ? file.name.toLowerCase().includes(search.toLowerCase()) : true).filter((file) => {
        if (daysFilter) {
          const fileDate = new Date(file.created_at);
          const now = new Date();
          const diffTime = now.getTime() - fileDate.getTime();
          const diffDays = diffTime / (1000 * 60 * 60 * 24);
          return diffDays <= daysFilter;
        }

        return file
      }))
    }
  }, [formatFilter, search, daysFilter, files])

  const handleAddFiles = async () => {
    const fileFromSelectedIDs = files.filter((file) => selectedFiles.includes(file.id))
    if (fileFromSelectedIDs.length > 0) {
      if (textRef.current.innerHTML == "<br>") {
        textRef.current.innerHTML = sanitizeHTML("")
      }
      let text
      if (textRef.current.lastChild?.nodeType == 3 || textRef.current.lastChild?.nodeType == 1) {
        text = textRef.current.lastChild?.textContent
      }
      if (text && !text.includes(delimiter)) {
        textRef.current.lastChild?.remove()
        textRef.current.innerHTML += text

      }


      fileFromSelectedIDs.forEach(async (file: FileType) => {
        const button = document.createElement('button');
        const box = document.createElement('div');
        const text = document.createElement('span');
        const path = document.createElement('span');
        const delimiterDoc = document.createElement('span');

        delimiterDoc.style.cssText = `
        display:inline-block;
        position:absolute;
        width:0px;
        height:0px;
        color:transparent;
        top:0px;
        pointer-events:none;
        `;
        path.style.cssText = `
        display:inline-block;
        position:absolute;
        top:0;
        cursor: pointer;
        pointer-events:none;
        color:transparent;
        width:200px;
        `;
        text.style.cssText = `
        display:inline-block;
        color:${bgColor};
        `;
        box.style.cssText = `
        display:inline-block;
        padding:0px 6px;
        background: ${hoverColor};
        color:${bgColor};
        border-radius:6px;
        margin:0 2px;
        cursor: pointer;
        user-select: none;
        `;
        button.style.cssText = `
        display:inline-block;
        padding:0px 6px;
        color:white;
        cursor: pointer;
        user-select: none;
        `;
        delimiterDoc.textContent = delimiter
        path.textContent = `[[${file.path}]]`
        button.textContent = "×"
        text.textContent = file.name;
        box.contentEditable = 'false';

        box.className = "imageBox"
        path.setAttribute("data-file-link", "true")

        text.setAttribute("data-file-text", "true")
        text.setAttribute("path", file.path)

        box.setAttribute("data-file-box", "true")
        box.setAttribute("path", file.path)
        button.setAttribute("data-file-button", "true")
        try {
          const response = await triggerGetURL({ companyID: file.company_id, fileID: file.uuid_unique }).unwrap();
          box.setAttribute("data-image-url", response?.data?.url)
          text.setAttribute("data-image-url", response?.data?.url)
        } catch (err) {
          showError('Failed to get file URL');
        }

        box.appendChild(delimiterDoc)
        box.appendChild(text)
        box.appendChild(button)
        box.appendChild(path)

        const marker = document.getElementById(markerId);
        if (!marker) textRef.current.appendChild(box);

        marker?.replaceWith(box);
        updateLines()
      })
    }
    onClose()
  }

  useEffect(() => {
    if (!isOpen) {
      setSelectedFiles([])
    }
  }, [isOpen])

  useEffect(() => {
    if (botID) {
      dispatch(GetBotExtension(botID));
    }
  }, [dispatch, botID]);

  const handleSelectFile = (fileId: number) => {
    setSelectedFiles((prevSelected) =>
      prevSelected.includes(fileId)
        ? prevSelected.filter((id) => id !== fileId)
        : [...prevSelected, fileId]
    );
  };

  const stageBorderColor = useColorModeValue(FILEMANAGER.MODAL.BORDER.COLOR.LIGHT, FILEMANAGER.MODAL.BORDER.COLOR.DARK);

  const isMobile = useBreakpointValue(FILEMANAGER.MOBILE_BREAKPOINT);

  return (
    <Modal
      isOpen={isOpen}
      onClose={isLoading ? () => { } : onClose}
      size={FILEMANAGER.SIZE.MEDIUM}
      isCentered
      variant={FILEMANAGER.MODAL.VARIANT}
    >
      <ModalOverlay />
      <ModalContent border={`${FILEMANAGER.MODAL.BORDER.VALUE} ${stageBorderColor}`} w={"full"} h={"full"} maxH={"600px"} maxW={isMobile ? "600px" : "1000px"} borderRadius={"30px"}>
        <ModalCloseButton isDisabled={isLoading} color={bgColor} mt={"5px"} />
        <ModalBody mt={"50px"}>
          <VStack>
            <HStack w={"full"} mb={"10px"}>
              <InputGroup
                size={"sm"}
                mr={"auto"}
                sx={{
                  background: panelBgColor,
                  borderRadius: "20px",
                  width: { base: "100%", md: "230px" },
                }}
              >
                <InputRightElement pointerEvents="none">
                  <SearchIcon color={bgColor} />
                </InputRightElement>
                <Input
                  placeholder={t(`fileManager.inputSearch`)}
                  focusBorderColor={bgColor}
                  borderRadius={"20px"}
                  value={search}
                  onChange={(e) => { setSearch(e.target.value) }}
                />
              </InputGroup>
              <HStack>
                <Box w={"full"} maxW={isMobile ? null : "fit-content"}>
                  <Select
                    size={"sm"}
                    focusBorderColor={bgColor}
                    value={optionsDays.filter((days) => days.value === daysFilter)}
                    isClearable={true}
                    options={optionsDays}
                    placeholder={t("activity.filterByDate")}
                    onChange={(option) => setDaysFilter(option?.value)}
                    isSearchable={false}
                    chakraStyles={{
                      ...style,
                      container: (provided) => ({
                        ...provided,
                        borderRadius: 20,
                        background: panelBgColor,
                        cursor: "pointer",
                        color: descriptionColor,
                        w: "inherit"
                      }),
                    }}
                  />
                </Box>
                <Box w={"full"} maxW={isMobile ? null : "fit-content"}>
                  <Select
                    size={"sm"}
                    focusBorderColor={bgColor}
                    options={optionsFormats}
                    value={optionsFormats.filter((format) => format.value == formatFilter)}
                    isClearable={true}
                    placeholder={t("fileManager.filterByFormat")}
                    onChange={(option) => setFormatFilter(option?.value || null)}
                    isSearchable={false}
                    chakraStyles={{
                      ...style,
                      container: (provided) => ({
                        ...provided,
                        borderRadius: 20,
                        background: panelBgColor,
                        cursor: "pointer",
                        color: descriptionColor,
                        w: "inherit"
                      }),
                    }}
                  />
                </Box>
              </HStack>
            </HStack>
            <SimpleGrid
              columns={
                loadingFiles || filteredFiles?.length == 0 || !files ? [1] : [1, 2, 3, 4]
              }
              gap={FILEMANAGER.FILES_GRID.GAP}
              w={FILEMANAGER.FILES_GRID.WIDTH}
            >
              {isLoading || loadingFiles ? (
                <Loading mode={FILEMANAGER.FILES_GRID.LOADING_MODE} />
              ) : filteredFiles?.length > 0 ? (
                filteredFiles?.map((file: FileType, index) => (
                  <FileCard
                    status={1}
                    key={index}
                    file={file}
                    isFileManager={false}
                    onOpenDeleteModal={() => { }}
                    onOpenRenameModal={() => { }}
                    onOpenDisableModal={() => { }}
                    setFileToDelete={() => { }}
                    setFileToDisable_Enable={() => { }}
                    setFileToRename={() => { }}
                    isSelected={selectedFiles?.includes((file.id))}
                    onSelectChange={() => { handleSelectFile(file.id) }}
                    setUrl={() => { }}
                    openView={() => { }}
                  />
                ))
              ) : (
                <Text w={FILEMANAGER.WIDTH.HUNDRED} textAlign={FILEMANAGER.TEXT.CENTER}>
                  {t(`fileManager.noFilesFound`)}
                </Text>
              )}
            </SimpleGrid>
          </VStack>
        </ModalBody>

        <ModalFooter mb={"20px"}>
          <HStack w={FILEMANAGER.WIDTH.FULL} gap={"10px"}>
            <Button
              size={"md"}
              ml={"auto"}
              color={lightAccent}
              border={`1px solid ${bgColor}`}
              borderRadius={"50px"}
              variant={FILEMANAGER.MODAL.CANCEL_BUTTON.VARIANT}
              _hover={{
                bg: bgColor,
                color: panelBgColor
              }}
              w={"200px"}
              isDisabled={isLoading}
              onClick={onClose}
            >
              {t(`modal.cancel`)}
            </Button>
            <Button
              size={"md"}
              bg={bgColor}
              borderRadius={"50px"}
              color={panelBgColor}
              _hover={{
                bg: hoverColor,
              }}
              w={"200px"}
              onClick={handleAddFiles}
              isLoading={isLoading}
              isDisabled={selectedFiles.length <= 0}
            >
              {t(`fileManager.addFiles`)}
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default PromptFilesModal;
