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
  useToast,
  Input,
  Textarea,
  useToken,
  useBreakpointValue,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import useCoftechColors from "@component/hooks/useCoftechColors";
import { useUpdateFileMutation } from "@component/store/RTK/FileManager"
import { BaseQueryFn, FetchArgs, FetchBaseQueryError, QueryDefinition, QueryStatus } from "@reduxjs/toolkit/query";
import { accentMap } from "@component/utils/accentMap";
import { useError } from "@component/utils/errorContext";
import { LazyQueryTrigger } from "@reduxjs/toolkit/dist/query/react/buildHooks";
import { FileType } from "@component/types/fileType";
import { FILEMANAGER } from "@component/constants/fileManager";
import { useFileManagerErrorEvent, useManageSocketEvent } from "@component/hooks/useFileOperations";
import { getSocket } from "@component/pages/socket";

interface EditFileModalProps {
  isOpen: boolean,
  botID: string,
  file: FileType,
  onClose: () => void,
  refetch: LazyQueryTrigger<QueryDefinition<any, BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError>, never, any, "fileManagerApi">>,
  setRetrigger: (retrigger: boolean) => void
}

const EditFileModal: React.FC<EditFileModalProps> = ({ isOpen, botID, file, onClose, refetch, setRetrigger }) => {
  const socket = getSocket()
  const { t } = useTranslation(FILEMANAGER.COMMON);
  const { showError } = useError();
  const { bgColor, hoverColor } =
    useCoftechColors();
  const [trigger, { status }] = useUpdateFileMutation()
  const [name, setName] = useState(file?.name || "")
  const [isLoading, setIsLoading] = useState(false)
  const [notification, setNotification] = useState<{ event: string, message: string, roomID: string }>()
  const [shadowColorDesc, setShadowColorDesc] = useState<any>(bgColor)
  const [description, setDescription] = useState<string>("")

  const handleDescriptionChange = (value) => {
    if (value) {
      if (!(value.target.value.length > FILEMANAGER.FILE.MAX_DESCRIPTION)) {
        setDescription(value.target.value)
        if (shadowColorDesc == FILEMANAGER.COLOR.RED) {
          setShadowColorDesc(bgColor)
        }
      } else {
        setDescription(value.target.value)
        setShadowColorDesc(FILEMANAGER.COLOR.RED)
      }
    }
  }

  useEffect(() => {
    if (file) {
      setName(file?.name)
      setDescription(file?.description)
    }
  }, [file])

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

  const handleNameChange = (value) => {
    if (value) setName(value.target.value)
  }

  const handleEdit = () => {
    if (file) {
      setIsLoading(true)
      const fileName = name.split('').map(char => accentMap[char] ?? char).join('')
      const fileDesc = description?.split('').map(char => accentMap[char] ?? char).join('')
      trigger({ companyID: file.company_id, fileID: file.uuid_unique, name: fileName, description: fileDesc }).then((result) => {
        if ((result as { error: any }).error) {
          setIsLoading(false)
          toast({
            title: t("fileManager.error"),
            description: `${t(`fileManager.errorRename`)}: ${(result as { error: any }).error.data.message}`,
            status: FILEMANAGER.TOAST.ERROR,
            duration: FILEMANAGER.TOAST.DURATION,
            isClosable: FILEMANAGER.TOAST.IS_CLOSABLE,
          });
        }
      })
    }
  }

  useEffect(() => {
    if (!isOpen && file) {
      setShadowColorDesc(bgColor)
    }
  }, [isOpen])

  useEffect(() => {
    if (status == QueryStatus.fulfilled) {
      toast({
        title: t(`fileManager.success`),
        description: t(`fileManager.successRename`),
        status: FILEMANAGER.TOAST.SUCCESS,
        duration: FILEMANAGER.TOAST.DURATION,
        isClosable: FILEMANAGER.TOAST.IS_CLOSABLE,
      })
      onClose()
      refetch({ companyID: file?.company_id, source: file?.source, status: FILEMANAGER.STATUS.ENABLED, botID }).then(async (result) => {
        if ((result as { error: any })?.error?.data?.message) {
          showError((result as { error: any })?.error?.data?.message)
        } else {
          setRetrigger(true)
        }
      })
    }
  }, [status])

  const isMobile = useBreakpointValue(FILEMANAGER.MOBILE_BREAKPOINT);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size={FILEMANAGER.MODAL.FILE_EDIT.SIZE}
      isCentered
      variant={FILEMANAGER.MODAL.VARIANT}
    >
      <ModalOverlay />
      <ModalContent maxW={isMobile ? FILEMANAGER.MODAL.FILE_EDIT.WIDTH.MAX.MOBILE : FILEMANAGER.MODAL.FILE_EDIT.WIDTH.MAX.PC}>
        <ModalCloseButton />
        <ModalHeader>
          <Text fontWeight={FILEMANAGER.MODAL.FILE_EDIT.TITLE.TEXT.WEIGHT} fontSize={FILEMANAGER.MODAL.FILE_EDIT.TITLE.TEXT.SIZE}>{t(`modal.editFile`)}</Text>
        </ModalHeader>
        <ModalBody>
          <VStack paddingTop={FILEMANAGER.MODAL.FILE_EDIT.FILE_NAME.PADDING_T} align={FILEMANAGER.ALIGN.START}>
            <Text>{t(`modal.fileName`)}</Text>
            <Input value={name} onChange={handleNameChange} _focus={{ boxShadow: `${FILEMANAGER.MODAL.FILE_EDIT.INPUT.SHADOW} ${bgColor}`, border: `${FILEMANAGER.MODAL.FILE_EDIT.INPUT.BORDER} ${bgColor}` }} />
          </VStack>
          <VStack mt={FILEMANAGER.MARGIN.NORMAL} align={FILEMANAGER.ALIGN.START}>
            <Text>{t(`modal.fileDescription`)}</Text>
            <Textarea value={description} onChange={handleDescriptionChange} isDisabled={isLoading} _focus={{ boxShadow: `${FILEMANAGER.MODAL.FILE_EDIT.INPUT.SHADOW} ${shadowColorDesc}`, border: `${FILEMANAGER.MODAL.FILE_EDIT.INPUT.BORDER} ${shadowColorDesc}` }} maxH={FILEMANAGER.MODAL.FILE_EDIT.INPUT.DESCRIPTION.MAXHEIGHT} placeholder={t(`modal.descMax`)} />
            <Text fontSize={FILEMANAGER.MODAL.FILE_EDIT.INPUT.DESCRIPTION.ERROR.SIZE} color={FILEMANAGER.COLOR.RED} h={FILEMANAGER.MODAL.FILE_EDIT.INPUT.DESCRIPTION.ERROR.HEIGHT} textAlign={FILEMANAGER.TEXT.CENTER} w={FILEMANAGER.WIDTH.FULL}>{shadowColorDesc == FILEMANAGER.COLOR.RED ? t(`modal.descMaxExceeded`) : ""}</Text>
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
              onClick={handleEdit}
              isLoading={isLoading}
              isDisabled={shadowColorDesc == FILEMANAGER.COLOR.RED}
            >
              {t(`modal.saveChanges`)}
            </Button>
            <Button variant={FILEMANAGER.MODAL.CANCEL_BUTTON.VARIANT} w={FILEMANAGER.WIDTH.FULL} onClick={onClose}>
              {t(`modal.cancel`)}
            </Button>
          </VStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditFileModal;
