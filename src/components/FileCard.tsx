import React, { useMemo, useRef, useState } from "react";
import {
  Box,
  VStack,
  HStack,
  IconButton,
  Checkbox,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Text,
  Badge,
} from "@chakra-ui/react";
import { EditIcon, DeleteIcon } from "@chakra-ui/icons";
import { FaEllipsisV, FaMinus, FaPlus } from "react-icons/fa";
import { File04 } from "@untitled-ui/icons-react";
import { useTranslation } from "react-i18next";
import useCoftechColors from "@component/hooks/useCoftechColors";
import { formatDate } from "@component/utils";
import { IoDownload } from "react-icons/io5";
import { useError } from "@component/utils/errorContext";
import { useFileOperations } from "@component/hooks/useFileOperations";
import { FileType } from "@component/types/fileType";
import { FILEMANAGER } from "@component/constants/fileManager";
import { ERROR } from "@component/constants/error";

interface FileCardProps {
  status: number,
  file: FileType,
  isSelected: boolean,
  isFileManager: boolean,
  onOpenDeleteModal: () => void,
  onOpenRenameModal: () => void,
  onOpenDisableModal: () => void,
  setFileToDelete: (file: FileType[] | FileType) => void,
  setFileToRename: (file: any) => void,
  setFileToDisable_Enable: (file: any) => void,
  onSelectChange: (fileID: string) => void,
  setUrl: (url: string) => void,
  openView: () => void
}

const FileCard: React.FC<FileCardProps> = ({
  status,
  file,
  isSelected,
  isFileManager,
  onOpenDeleteModal,
  onOpenRenameModal,
  onOpenDisableModal,
  setFileToDelete,
  setFileToRename,
  setFileToDisable_Enable,
  onSelectChange,
  setUrl,
  openView
}) => {
  const { t } = useTranslation(FILEMANAGER.COMMON);
  const { showError } = useError();
  const { getFileUrl } = useFileOperations(file);
  const { bgColor, panelBgColor, borderColor, backgroundColor, descriptionColor, hoverColor } =
    useCoftechColors();
  const description = useMemo(() => {
    if (!file.description || file.description.length <= FILEMANAGER.FILE_CARD.DESCRIPTION_LENGTH) return file.description;
    const truncated = file.description.slice(0, FILEMANAGER.FILE_CARD.DESCRIPTION_LENGTH);
    const lastSpace = truncated.lastIndexOf(' ');
    return `${lastSpace > 0 ? truncated.slice(0, lastSpace) : truncated}...`;
  }, [file.description]);

  const handleDownload = async () => {
    try {
      const result = await getFileUrl();
      if (result == null) throw new Error('No file URL available');

      const response = await fetch(result);
      if (!response.ok) throw new Error(`Download failed: ${response.statusText}`);

      const blob = await response.blob();
      const link = document.createElement("a");

      link.href = URL.createObjectURL(blob);
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      if (err.status === ERROR.BAD_REQUEST || err.status === ERROR.UNEXPECTED_ERROR) {
        showError(err.data?.message)
      } else {
        showError(err.message || err.error || 'Failed to download file')
      }
    }
  };

  const handleOpenView = async () => {
    try {
      const result = await getFileUrl();
      if (result == null) throw new Error('No file URL available');
      let url = result
      if (file.extension == FILEMANAGER.FILE_CARD.DOCUMENT_EXTENSION) {
        url = `${FILEMANAGER.FILE_CARD.DOCUMENT_URL}${encodeURIComponent(
          url
        )}${FILEMANAGER.FILE_CARD.DOCUMENT_URL_EMBEDDED}`;
      }
      setUrl(url)
      openView()
    } catch (err) {
      if (err.status === ERROR.BAD_REQUEST || err.status === ERROR.UNEXPECTED_ERROR) {
        showError(err.data?.message)
      } else {
        showError(err.message || err.error || 'Failed to open file view')
      }
    }
  }

  return (
    <Box
      p={FILEMANAGER.PADDING.NORMAL}
      bg={backgroundColor}
      borderRadius={FILEMANAGER.FILE_CARD.BORDER.RADIUS}
      borderColor={isSelected ? bgColor : borderColor}
      borderWidth={FILEMANAGER.FILE_CARD.BORDER.WIDTH}
      position={FILEMANAGER.FILE_CARD.POSITION}
      display={FILEMANAGER.FILE_CARD.DISPLAY.VALUE}
      flexDirection={FILEMANAGER.FILE_CARD.DISPLAY.DIRECTION}
      justifyContent={FILEMANAGER.JUSTIFY.SPACE_BETWEEN}
    >
      <HStack justify={FILEMANAGER.JUSTIFY.SPACE_BETWEEN} mb={FILEMANAGER.MARGIN.XSMALL}>
        <div onClick={(e) => e.stopPropagation()}>
          <Checkbox
            size={FILEMANAGER.SIZE.LARGE}
            bg={panelBgColor}
            isChecked={isSelected}
            _focus={FILEMANAGER.FILE_CARD.CHECK_BOX.FOCUS}
            _focusVisible={FILEMANAGER.FILE_CARD.CHECK_BOX.FOCUS}
            onChange={() => onSelectChange(String(file.id))}
            sx={{
              '.chakra-checkbox__control': {
                _checked: {
                  bg: bgColor,
                  borderColor: bgColor,
                },
                _hover: {
                  bg: isSelected ? hoverColor : null,
                  borderColor: hoverColor,
                }
              },
              'input:focus-visible + span, input:focus + span': FILEMANAGER.FILE_CARD.CHECK_BOX.FOCUS,
            }}
          />{" "}
        </div>
        {isFileManager && (
          <Menu>
            <MenuButton
              as={IconButton}
              icon={<FaEllipsisV />}
              variant={FILEMANAGER.FILE_CARD.MENU_BUTTON.VARIANT}
              onClick={(e) => e.stopPropagation()}
              color={descriptionColor}
            />
            <MenuList>
              {status == FILEMANAGER.STATUS.ENABLED || file?.source == FILEMANAGER.SOURCE.FILEMANAGER ? (
                <>
                  <MenuItem
                    icon={<EditIcon />}
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenRenameModal();
                      setFileToRename(file);
                    }}
                  >
                    {t(`fileCard.edit`)}
                  </MenuItem>
                  <MenuItem
                    icon={<DeleteIcon />}
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenDeleteModal();
                      setFileToDelete(file);
                    }}
                  >
                    {t(`fileCard.delete`)}
                  </MenuItem>
                  {file?.source == FILEMANAGER.SOURCE.RAG && (
                    <MenuItem
                      icon={<FaMinus />}
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenDisableModal();
                        setFileToDisable_Enable(file);
                      }}
                    >
                      {t(`fileCard.disable`)}
                    </MenuItem>
                  )}
                </>
              ) : (
                <>
                  <MenuItem
                    icon={<FaPlus />}
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenDisableModal();
                      setFileToDisable_Enable(file);
                    }}
                  >
                    {t(`fileCard.enable`)}
                  </MenuItem>
                </>
              )}
            </MenuList>
          </Menu>
        )}
      </HStack>
      <VStack align={FILEMANAGER.ALIGN.CENTER} justify={FILEMANAGER.JUSTIFY.CENTER} flex={FILEMANAGER.FLEX.NORMAL}>
        <VStack
          w={FILEMANAGER.WIDTH.FULL}
          onClick={isFileManager ? handleOpenView : () => onSelectChange(String(file.id))}
          _hover={{
            cursor: FILEMANAGER.FILE_CARD.CURSOR
          }}
        >
          <File04 width={FILEMANAGER.FILE_CARD.ICON.WIDTH} height={FILEMANAGER.FILE_CARD.ICON.HEIGHT} color={bgColor} />
          <VStack
            paddingTop={FILEMANAGER.PADDING.XSMALL}
            align={FILEMANAGER.ALIGN.START}
            justify={FILEMANAGER.JUSTIFY.CENTER}
            flex={FILEMANAGER.FLEX.NORMAL}
            w={FILEMANAGER.WIDTH.HUNDRED}
            gap={FILEMANAGER.FILE_CARD.GAP}
          >
            <HStack overflowX={FILEMANAGER.OVERFLOW.AUTO} h={FILEMANAGER.FILE_CARD.NAME.HEIGHT} w={FILEMANAGER.FILE_CARD.NAME.WIDTH} sx={{ '&::-webkit-scrollbar': FILEMANAGER.FILE_CARD.SCROLL_BAR.WEBKIT, '-ms-overflow-style': FILEMANAGER.FILE_CARD.SCROLL_BAR.MS_OVERFLOW, 'scrollbar-width': FILEMANAGER.FILE_CARD.SCROLL_BAR.WIDTH }}>
              <Text fontWeight={FILEMANAGER.FILE_CARD.NAME.FONT_WEIGHT} mr={FILEMANAGER.MARGIN.AUTO}>
                {file.file_name}
              </Text>
            </HStack>
            <Text fontSize={FILEMANAGER.FILE_CARD.FEATURES.TEXT.SIZE} textAlign={FILEMANAGER.TEXT.START} color={descriptionColor} m={FILEMANAGER.MARGIN.ZERO}>
              {formatDate(file.created_at)}
            </Text>
            <Text fontSize={FILEMANAGER.FILE_CARD.FEATURES.TEXT.SIZE} mt={FILEMANAGER.FILE_CARD.FEATURES.MARGIN_T} textAlign={FILEMANAGER.TEXT.START} w={FILEMANAGER.WIDTH.FULL} color={descriptionColor}>
              {description}
            </Text>
            {file.file_size && (
              <Box
                mt={FILEMANAGER.FILE_CARD.FEATURES.FILE_SIZE.MARGIN_T}
                color={bgColor}
                fontWeight={FILEMANAGER.FILE_CARD.FEATURES.FILE_SIZE.TEXT.WEIGHT}
                fontSize={FILEMANAGER.FILE_CARD.FEATURES.FILE_SIZE.TEXT.SIZE}
                textAlign={FILEMANAGER.TEXT.CENTER}
                width={FILEMANAGER.WIDTH.FULL}
              >
                {file.file_size}
              </Box>
            )}

          </VStack>
        </VStack>
        {isFileManager && (
          <HStack w={FILEMANAGER.WIDTH.FULL}>
            <Box ml={FILEMANAGER.MARGIN.AUTO} mt={FILEMANAGER.MARGIN.AUTO} w={FILEMANAGER.FILE_CARD.FEATURES.DOWNLOAD_BUTTON.SIZE} h={FILEMANAGER.FILE_CARD.FEATURES.DOWNLOAD_BUTTON.SIZE} color={bgColor} _hover={{ color: hoverColor, cursor: FILEMANAGER.FILE_CARD.FEATURES.DOWNLOAD_BUTTON.CURSOR }} onClick={async () => {
              handleDownload()
            }}>
              <IoDownload size={FILEMANAGER.FILE_CARD.FEATURES.DOWNLOAD_BUTTON.SIZE}></IoDownload>
            </Box>
          </HStack>
        )}
      </VStack>
    </Box>
  );
};

export default FileCard;
