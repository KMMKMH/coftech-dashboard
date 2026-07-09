/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
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
  useToast,
  HStack,
  useBreakpointValue,
} from "@chakra-ui/react";
import { WarningTwoIcon } from "@chakra-ui/icons";
import { useTranslation } from "react-i18next";
import useCoftechColors from "@component/hooks/useCoftechColors";
import { useDeleteFileMutation } from "@component/store/RTK/FileManager";
import { useError } from "@component/utils/errorContext";
import { LazyQueryTrigger } from "@reduxjs/toolkit/dist/query/react/buildHooks";
import { QueryDefinition, BaseQueryFn, FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { FileType } from "@component/types/fileType";
import { useFileManagerErrorEvent } from "@component/hooks/useFileOperations";
import { FILEMANAGER } from "@component/constants/fileManager";
import { ERROR } from "@component/constants/error";
import { getSocket } from "@component/pages/socket";

interface DeleteFileModalProps {
  isOpen: boolean,
  files: FileType[],
  botID: string,
  onClose: () => void,
  refetch: LazyQueryTrigger<QueryDefinition<any, BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError>, never, any, "fileManagerApi">>,
  setRetrigger: (retrigger: boolean) => void,
  onClearSelection: () => void
}

const DeleteFileModal: React.FC<DeleteFileModalProps> = ({
  isOpen,
  files = [],
  botID,
  onClose,
  refetch,
  setRetrigger,
  onClearSelection
}) => {
  const socket = getSocket()
  const { t } = useTranslation(FILEMANAGER.COMMON);
  const { showError } = useError();
  const { bgColor, hoverColor } =
    useCoftechColors();
  const [trigger] = useDeleteFileMutation()
  const [isLoading, setIsLoading] = useState(false)
  const [notification, setNotification] = useState<{ event: string, message: string, roomID: string }>()
  const toast = useToast()

  useFileManagerErrorEvent({
    notification,
    onClose,
    setNotification,
    setIsLoading,
  })

  useEffect(() => {
    if (isOpen && files) {
      for (let i: number = 0; i < files.length; i++) {
        socket.emit(FILEMANAGER.EVENT.JOIN, { roomID: files[i]?.uuid_unique });
      }
      socket.on(FILEMANAGER.EVENT.NOTIFICATION, (data) => {
        for (let i: number = 0; i < files.length; i++) {
          if (data.fileID === files[i]?.uuid_unique) {
            setNotification(data)
          }
        }
      });
    } else if (files) {
      setIsLoading(false)
      for (let i: number = 0; i < files.length; i++) {
        socket.emit(FILEMANAGER.EVENT.LEAVE, { roomID: files[i]?.uuid_unique });
      }
      socket.off(FILEMANAGER.EVENT.NOTIFICATION);
    } else {
      socket.off(FILEMANAGER.EVENT.NOTIFICATION);
    }
  }, [isOpen])

  const handleDelete = async () => {
    try {
      setIsLoading(true)
      const deletePromises = files.map((file) =>
        trigger({
          companyID: file.company_id,
          fileID: file.uuid_unique,
        }).unwrap()
      );

      await Promise.all(deletePromises);

      const [firstFile] = files;
      await refetch({
        companyID: firstFile.company_id,
        source: firstFile.source,
        status: FILEMANAGER.STATUS.ENABLED,
        botID: firstFile.source === FILEMANAGER.SOURCE.RAG ? botID : undefined,
      }).unwrap();

      toast({
        title: t("fileManager.success"),
        description: t("fileManager.successDelete"),
        status: FILEMANAGER.TOAST.SUCCESS,
        duration: FILEMANAGER.TOAST.DURATION,
        isClosable: FILEMANAGER.TOAST.IS_CLOSABLE,
      });
      if (onClearSelection) onClearSelection();
      setRetrigger(true);
      setIsLoading(false)
      onClose();
    } catch (error) {
      if (error.status === ERROR.BAD_REQUEST || error.status === ERROR.UNEXPECTED_ERROR) {
        showError(error.data?.message)
      } else {
        showError(error.error)
      }
    }
  };

  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size={FILEMANAGER.MODAL.FILE_DELETE.SIZE}
      variant={FILEMANAGER.MODAL.VARIANT}
      isCentered
    >
      <ModalOverlay />
      <ModalContent maxW={isMobile ? FILEMANAGER.MODAL.FILE_DELETE.WIDTH.MAX.MOBILE : FILEMANAGER.MODAL.FILE_DELETE.WIDTH.MAX.PC}>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={FILEMANAGER.SPACING.NORMAL} pt={FILEMANAGER.MODAL.FILE_DELETE.BODY_PADDING_T} align={FILEMANAGER.ALIGN.CENTER} w={FILEMANAGER.WIDTH.FULL}>
            <WarningTwoIcon w={FILEMANAGER.MODAL.FILE_DELETE.ICON.SIZE} h={FILEMANAGER.MODAL.FILE_DELETE.ICON.SIZE} color={bgColor} />
            <Text fontWeight={FILEMANAGER.MODAL.FILE_DELETE.TITLE.WEIGHT} fontSize={FILEMANAGER.MODAL.FILE_DELETE.TITLE.SIZE} textAlign={FILEMANAGER.TEXT.CENTER}>
              {files.length > 1
                ? t("modal.deleteMultipleFiles")
                : t("modal.deleteFile")}
            </Text>
            <HStack overflowX={FILEMANAGER.OVERFLOW.AUTO} w={FILEMANAGER.WIDTH.INHERIT} sx={{ '&::-webkit-scrollbar': FILEMANAGER.MODAL.FILE_DELETE.SCROLL_BAR.WEBKIT, '-ms-overflow-style': FILEMANAGER.MODAL.FILE_DELETE.SCROLL_BAR.MS_OVERFLOW, 'scrollbar-width': FILEMANAGER.MODAL.FILE_DELETE.SCROLL_BAR.WIDTH }}>
              <Text padding={FILEMANAGER.MODAL.FILE_DELETE.CONFIRMATION.PADDING} fontSize={FILEMANAGER.MODAL.FILE_DELETE.CONFIRMATION.SIZE} fontWeight={FILEMANAGER.MODAL.FILE_DELETE.CONFIRMATION.WEIGHT} m={FILEMANAGER.MARGIN.AUTO} textAlign={FILEMANAGER.TEXT.START}>
                {files.length > 1
                  ? t("modal.confirmDeleteMultiple", { count: files.length })
                  : t("modal.confirmDeleteFile", {
                    filename: files[0]?.file_name,
                  })}
              </Text>
            </HStack>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <VStack w={FILEMANAGER.WIDTH.FULL}>
            <Button
              w={FILEMANAGER.WIDTH.FULL}
              bg={bgColor}
              color={FILEMANAGER.MODAL.ACCEPT_BUTTON.COLOR}
              _hover={{ bg: hoverColor }}
              onClick={handleDelete}
              isLoading={isLoading}
            >
              {t("modal.confirmDelete")}
            </Button>
            <Button variant={FILEMANAGER.MODAL.CANCEL_BUTTON.VARIANT} w={FILEMANAGER.WIDTH.FULL} onClick={onClose}>
              {t("modal.cancelDelete")}
            </Button>
          </VStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DeleteFileModal;
