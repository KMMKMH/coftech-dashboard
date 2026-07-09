/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  VStack,
  Button,
  Text,
  Icon,
  useToast,
  HStack,
  useBreakpointValue,
} from "@chakra-ui/react";
import { FiUpload } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import useCoftechColors from "@component/hooks/useCoftechColors";
import { WarningTwoIcon } from "@chakra-ui/icons";
import { useSet_removeFileDisabledMutation } from "@component/store/RTK/FileManager"
import { BaseQueryFn, FetchArgs, FetchBaseQueryError, QueryDefinition, QueryStatus } from "@reduxjs/toolkit/query";
import { useError } from "@component/utils/errorContext";
import { LazyQueryTrigger } from "@reduxjs/toolkit/dist/query/react/buildHooks";
import { FileType } from "@component/types/fileType";
import { FILEMANAGER } from "@component/constants/fileManager";
import { useFileManagerErrorEvent, useManageSocketEvent } from "@component/hooks/useFileOperations";
import { getSocket } from "@component/pages/socket";

interface Disable_EnableFileModalProps {
  isOpen: boolean,
  botID: string,
  file: FileType,
  fileStatus: number,
  onClose: () => void,
  refetch: LazyQueryTrigger<QueryDefinition<any, BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError>, never, any, "fileManagerApi">>,
  setRetrigger: (retrigger: boolean) => void
}

const Disable_EnableFileModal: React.FC<Disable_EnableFileModalProps> = ({ isOpen, botID, file, fileStatus, onClose, refetch, setRetrigger }) => {
  const socket = getSocket()
  const { t } = useTranslation(FILEMANAGER.COMMON);
  const { showError } = useError();
  const { bgColor, hoverColor, panelBgColor, backgroundColor } =
    useCoftechColors();
  const [trigger, { status }] = useSet_removeFileDisabledMutation()
  const [isLoading, setIsLoading] = useState(false)
  const [notification, setNotification] = useState<{ event: string, message: string, roomID: string }>()

  const toast = useToast()

  useFileManagerErrorEvent({
    notification,
    onClose,
    setNotification,
    setIsLoading,
  })

  useManageSocketEvent({
    socket,
    isOpen,
    file,
    setNotification,
    setIsLoading,
  })

  const handleDisable_Enable = () => {
    if (file) {
      setIsLoading(true)
      trigger({ companyID: file.company_id, botID: file.bot_id, fileID: file.uuid_unique, status: fileStatus }).then((result) => {
        if ((result as { error: any }).error) {
          setIsLoading(false)
          toast({
            title: t("fileManager.error"),
            description: `${fileStatus == FILEMANAGER.STATUS.ENABLED ? t(`fileManager.errorDisable`) : t(`fileManager.errorEnable`)}: ${(result as { error: any }).error.data.message}`,
            status: FILEMANAGER.TOAST.ERROR,
            duration: FILEMANAGER.TOAST.DURATION,
            isClosable: FILEMANAGER.TOAST.IS_CLOSABLE,
          });
        }
      })
    }
  }

  useEffect(() => {
    if (status) {
      if (status == QueryStatus.fulfilled) {
        toast({
          title: t(`fileManager.success`),
          description: fileStatus == FILEMANAGER.STATUS.ENABLED ? t(`fileManager.successDisable`) : t(`fileManager.successEnable`),
          status: FILEMANAGER.TOAST.SUCCESS,
          duration: FILEMANAGER.TOAST.DURATION,
          isClosable: FILEMANAGER.TOAST.IS_CLOSABLE,
        })
        onClose()
        refetch({ companyID: file?.company_id, source: file?.source, status: fileStatus, botID }).then(async (result) => {
          if ((result as { error: any })?.error?.data?.message) {
            showError((result as { error: any })?.error?.data?.message)
          } else {
            setRetrigger(true)
          }
        })
      }
    }
  }, [status])

  const isMobile = useBreakpointValue(FILEMANAGER.MOBILE_BREAKPOINT);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size={FILEMANAGER.MODAL.FILE_ENABLE_DISABLE.SIZE}
      isCentered
      variant={FILEMANAGER.MODAL.VARIANT}
    >
      <ModalOverlay />
      <ModalContent maxW={isMobile ? FILEMANAGER.MODAL.FILE_ENABLE_DISABLE.WIDTH.MAX.MOBILE : FILEMANAGER.MODAL.FILE_ENABLE_DISABLE.WIDTH.MAX.PC}>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={FILEMANAGER.SPACING.NORMAL} paddingTop={FILEMANAGER.MODAL.FILE_ENABLE_DISABLE.BODY_PADDING_T} align={FILEMANAGER.ALIGN.CENTER} w={FILEMANAGER.WIDTH.FULL}>
            <WarningTwoIcon w={FILEMANAGER.MODAL.FILE_ENABLE_DISABLE.ICON.SIZE} h={FILEMANAGER.MODAL.FILE_ENABLE_DISABLE.ICON.SIZE} color={bgColor} />
            <Text fontWeight={FILEMANAGER.MODAL.FILE_ENABLE_DISABLE.TITLE.WEIGHT} fontSize={FILEMANAGER.MODAL.FILE_ENABLE_DISABLE.TITLE.SIZE} textAlign={FILEMANAGER.TEXT.START}>{fileStatus == FILEMANAGER.STATUS.ENABLED ? t(`modal.disableFile`) : t(`modal.enableFile`)}</Text>
            <HStack overflowX={FILEMANAGER.OVERFLOW.AUTO} w={FILEMANAGER.WIDTH.INHERIT} sx={{ '&::-webkit-scrollbar': FILEMANAGER.MODAL.FILE_ENABLE_DISABLE.SCROLL_BAR.WEBKIT, '-ms-overflow-style': FILEMANAGER.MODAL.FILE_ENABLE_DISABLE.SCROLL_BAR.MS_OVERFLOW, 'scrollbar-width': FILEMANAGER.MODAL.FILE_ENABLE_DISABLE.SCROLL_BAR.WIDTH }}>
              <Text padding={FILEMANAGER.MODAL.FILE_ENABLE_DISABLE.CONFIRMATION.PADDING} fontSize={FILEMANAGER.MODAL.FILE_ENABLE_DISABLE.CONFIRMATION.SIZE} fontWeight={FILEMANAGER.MODAL.FILE_ENABLE_DISABLE.CONFIRMATION.WEIGHT} m={FILEMANAGER.MARGIN.AUTO} textAlign={FILEMANAGER.TEXT.START}>
                {fileStatus == FILEMANAGER.STATUS.ENABLED ? t(`modal.confirmDisableFile`, { filename: file?.file_name }) : t(`modal.confirmEnableFile`, { filename: file?.file_name })}
              </Text>
            </HStack>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <VStack w={FILEMANAGER.WIDTH.FULL}>
            <Button
              bg={bgColor}
              color={FILEMANAGER.MODAL.ACCEPT_BUTTON.COLOR}
              _hover={{
                bg: hoverColor,
              }}
              w={FILEMANAGER.WIDTH.FULL}
              mb={FILEMANAGER.MARGIN.XSMALL}
              onClick={handleDisable_Enable}
              isLoading={isLoading}
            >
              {fileStatus == FILEMANAGER.STATUS.ENABLED ? t(`modal.confirmDisable`) : t(`modal.confirmEnable`)}
            </Button>
            <Button variant={FILEMANAGER.MODAL.CANCEL_BUTTON.VARIANT} w={FILEMANAGER.WIDTH.FULL} onClick={onClose}>
              {fileStatus == FILEMANAGER.STATUS.ENABLED ? t(`modal.cancelDisable`) : t(`modal.cancelEnable`)}
            </Button>
          </VStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default Disable_EnableFileModal;
