/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
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
  useColorModeValue,
  HStack,
  useToast,
  Box,
  Stack,
  useToken,
  Textarea,
  useBreakpointValue,
} from "@chakra-ui/react";
import { FiUpload } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import useCoftechColors from "@component/hooks/useCoftechColors";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@component/store";
import { useCreateFileMutation } from "@component/store/RTK/FileManager";
import { Trash01 } from "@untitled-ui/icons-react";
import { GetBotExtension } from "@component/store/integrationsSlice";
import { accentMap } from "@component/utils/accentMap";
import { useError } from "@component/utils/errorContext";
import { LazyQueryTrigger } from "@reduxjs/toolkit/dist/query/react/buildHooks";
import { QueryDefinition, BaseQueryFn, FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { FILEMANAGER } from "@component/constants/fileManager";
import { useFileManagerErrorEvent } from "@component/hooks/useFileOperations";
import { getSocket } from "@component/pages/socket";

interface UploadFilesModalProps {
  company: string,
  isOpen: boolean,
  source: string,
  botID: string,
  allowedTypes: string[],
  onClose: () => void,
  refetch: LazyQueryTrigger<QueryDefinition<any, BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError>, never, any, "fileManagerApi">>,
  setRetrigger: (retrigger: boolean) => void
}

const UploadFilesModal: React.FC<UploadFilesModalProps> = ({ company, isOpen, source, botID, allowedTypes, onClose, refetch, setRetrigger }) => {
  const socket = getSocket()
  const { t } = useTranslation(FILEMANAGER.COMMON);
  const { showError } = useError();

  const { bgColor, hoverColor, panelBgColor } = useCoftechColors();

  const [fileInputRef, setFileInputRef] = useState(null);

  const [trigger] = useCreateFileMutation();

  const dispatch: AppDispatch = useDispatch()

  const [files, setFiles] = useState<File[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [progress, setProgress] = useState<number>(0)
  const [response, setResponse] = useState<Response>()
  const [notification, setNotification] = useState<{ event: string, message: string, roomID: string }>()
  const [file_uuid, setFile_uuid] = useState()
  const [description, setDescription] = useState<string>("")
  const [shadowColor, setShadowColor] = useState<any>(bgColor)

  const toast = useToast()

  useFileManagerErrorEvent({
    notification,
    onClose,
    setNotification,
    setIsLoading,
  })

  const handleDescriptionChange = (value) => {
    if (value) {
      if (!(value.target.value.length > FILEMANAGER.FILE.MAX_DESCRIPTION)) {
        setDescription(value.target.value)
        if (shadowColor == FILEMANAGER.COLOR.RED) {
          setShadowColor(bgColor)
        }
      } else {
        setDescription(value.target.value)
        setShadowColor(FILEMANAGER.COLOR.RED)
      }
    }
  }

  useEffect(() => {
    if (progress && response) {
      if (response.ok && progress == FILEMANAGER.EVENT.UPLOAD_COMPLETED_VALUE && !notification) {
        socket.emit(FILEMANAGER.EVENT.LEAVE, { roomID: file_uuid });
        socket.off(FILEMANAGER.EVENT.NOTIFICATION);
        setTimeout(() => {
          toast({
            title: t(`fileManager.success`),
            description: t(`fileManager.successUpload`),
            status: FILEMANAGER.TOAST.SUCCESS,
            duration: FILEMANAGER.TOAST.DURATION,
            isClosable: FILEMANAGER.TOAST.IS_CLOSABLE,
          })
          setDescription("")
          onClose()
          setIsLoading(false)
          refetch({ companyID: company, source, status: FILEMANAGER.STATUS.ENABLED, botID }).then(async (result) => {
            if ((result as { error: any })?.error?.data?.message) {
              showError((result as { error: any })?.error?.data?.message)
            } else {
              setRetrigger(true)
            }
          })
        }, FILEMANAGER.TIMEOUT.REFETCH)
      }
    }
  }, [response, progress])

  useEffect(() => {
    if (botID) {
      dispatch(GetBotExtension(botID));
    }
  }, [dispatch, botID]);

  useEffect(() => {
    if (!isOpen) {
      setFiles([])
      setIsLoading(false)
      setProgress(0)
      setDescription("")
      setShadowColor(bgColor)
    }
  }, [isOpen])

  const handleFileSelect = (event) => {
    setFiles(Array.from(event.target.files))
  };

  const handleButtonClick = () => {
    if (files.length > 0) {
      setProgress(0)
      const fileName = files[0]?.name.split('').map(char => accentMap[char] ?? char).join('')
      const fileDesc = description.split('').map(char => accentMap[char] ?? char).join('')
      const fileExtension = files[0]?.name.split(".").pop()?.toLowerCase()
      const isSupported = allowedTypes.includes(fileExtension)
      if (isSupported) {
        setIsLoading(true)
        trigger({ companyID: company, file: files[0], fileName, source: source, botID: botID, description: fileDesc }).then(async (result) => {
          if (socket) {
            if (result && (result as { data: any }).data?.data?.url) {
              setFile_uuid((result as { data: any }).data?.data?.url)
              socket.emit(FILEMANAGER.EVENT.JOIN_FILE, (result as { data: any }).data?.data?.file_uuid)
              socket.emit(FILEMANAGER.EVENT.JOIN, { roomID: (result as { data: any }).data?.data?.file_uuid });
              socket.on(FILEMANAGER.EVENT.NOTIFICATION, (data) => {
                if (data.fileID === (result as { data: any }).data?.data?.file_uuid) {
                  setNotification(data)
                }
              });
              socket.on(FILEMANAGER.EVENT.UPLOAD_PROGRESS, (data) => {
                if (data?.fileID == (result as { data: any }).data?.data?.file_uuid) {
                  setProgress(data.progress)
                }
              });
              socket.on(FILEMANAGER.EVENT.UPLOAD_COMPLETE, (data) => {
                if (data?.fileID == (result as { data: any }).data?.data?.file_uuid) {
                  setProgress(FILEMANAGER.EVENT.UPLOAD_COMPLETED_VALUE)
                }
              });
              const response = await fetch((result as { data: any }).data?.data?.url, {
                method: FILEMANAGER.FETCH_PUT,
                body: files[0],
                headers: {
                  'Content-Type': files[0].type,
                  'preferred-lang': t("prompt.lang")
                }
              });
              setTimeout(() => {
                setResponse(response)
              }, FILEMANAGER.TIMEOUT.RESPONSE)
            } else {
              onClose()
              showError((result as { error: any })?.error?.data?.message)
              setIsLoading(false)
            }
          }
          else {
            toast({
              title: t(`fileManager.error`),
              description: t(`socket.undefined`),
              status: FILEMANAGER.TOAST.ERROR,
              duration: FILEMANAGER.TOAST.DURATION,
              isClosable: FILEMANAGER.TOAST.IS_CLOSABLE,
            })
            setIsLoading(false)
          }
        })
      }
      else {
        toast({
          title: t("fileManager.extensionError"),
          description: t("fileManager.extensionUnsupported", { extensions: allowedTypes.join(", ") }),
          status: FILEMANAGER.TOAST.ERROR,
          duration: FILEMANAGER.TOAST.DURATION,
          isClosable: FILEMANAGER.TOAST.IS_CLOSABLE,
        })
      }
    }
    else {
      toast({
        title: t("fileManager.file"),
        description: t("fileManager.provideData"),
        status: FILEMANAGER.TOAST.ERROR,
        duration: FILEMANAGER.TOAST.DURATION,
        isClosable: FILEMANAGER.TOAST.IS_CLOSABLE,
      })
    }
  }

  const progressBg = useColorModeValue(FILEMANAGER.MODAL.PROGRESS_BAR.BG.LIGHT, FILEMANAGER.MODAL.PROGRESS_BAR.BG.DARK);

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
      <ModalContent border={`${FILEMANAGER.MODAL.BORDER.VALUE} ${stageBorderColor}`} maxW={isMobile ? FILEMANAGER.MODAL.MAX_WIDTH : null}>
        <ModalHeader>{t(`fileManager.uploadFiles`)}</ModalHeader>
        <ModalCloseButton isDisabled={isLoading} />
        <ModalBody>
          <VStack
            spacing={FILEMANAGER.SPACING.NORMAL}
            p={FILEMANAGER.PADDING.NORMAL}
            border={FILEMANAGER.MODAL.FILE_UPLOAD.BORDER.VALUE}
            borderColor={bgColor}
            borderRadius={FILEMANAGER.MODAL.FILE_UPLOAD.BORDER.RADIUS}
            justify={FILEMANAGER.JUSTIFY.CENTER}
            align={FILEMANAGER.ALIGN.CENTER}
            bg={panelBgColor}
            h={FILEMANAGER.MODAL.FILE_UPLOAD.HEIGHT}
            onClick={() => fileInputRef?.click()}
            cursor={FILEMANAGER.MODAL.FILE_UPLOAD.CURSOR}
          >
            {files && files?.length > 0 ? (
              <HStack padding={FILEMANAGER.PADDING.XSMALL} w={FILEMANAGER.WIDTH.FULL}>
                <HStack overflowX={FILEMANAGER.OVERFLOW.AUTO} w={FILEMANAGER.WIDTH.INHERIT} sx={{ '&::-webkit-scrollbar': FILEMANAGER.MODAL.SCROLL_BAR.WEBKIT, '-ms-overflow-style': FILEMANAGER.MODAL.SCROLL_BAR.MS_OVERFLOW, 'scrollbar-width': FILEMANAGER.MODAL.SCROLL_BAR.WIDTH }}>
                  <Text padding={FILEMANAGER.PADDING.SMALLEST} fontSize={FILEMANAGER.MODAL.FONT.SIZE.LARGE} fontWeight={FILEMANAGER.MODAL.FONT.WEIGHT} m={FILEMANAGER.MARGIN.AUTO}>
                    {files[0].name}
                  </Text>
                </HStack>
                <Trash01 color={isLoading ? FILEMANAGER.MODAL.TRASH.COLOR.INACTIVE : FILEMANAGER.MODAL.TRASH.COLOR.ACTIVE} onClick={isLoading ? () => { } : () => setFiles([])}></Trash01>
              </HStack>
            ) : (
              <>
                <Icon as={FiUpload} w={FILEMANAGER.MODAL.FILE_UPLOAD.ICON.WIDTH} h={FILEMANAGER.MODAL.FILE_UPLOAD.ICON.HEIGHT} color={bgColor} />
                <VStack spacing={FILEMANAGER.SPACING.SMALLEST}>
                  <Text fontSize={FILEMANAGER.MODAL.FONT.SIZE.LARGE} fontWeight={FILEMANAGER.MODAL.FONT.WEIGHT}>
                    {t(`fileManager.addFiles`)}
                  </Text>
                  <Text fontSize={FILEMANAGER.MODAL.FONT.SIZE.MEDIUM} fontWeight={FILEMANAGER.MODAL.FONT.WEIGHT}>
                    {t("fileManager.uploadLimit", { size: FILEMANAGER.MODAL.FILE_UPLOAD.FILE_MAX_SIZE })}
                  </Text>
                </VStack>
                <input
                  type={FILEMANAGER.MODAL.INPUT.TYPE}
                  multiple
                  ref={(ref) => setFileInputRef(ref)}
                  style={FILEMANAGER.MODAL.INPUT.STYLE}
                  onChange={handleFileSelect}
                />
              </>
            )}
          </VStack>
          {!isLoading && (
            <VStack mt={FILEMANAGER.MARGIN.NORMAL} textAlign={FILEMANAGER.TEXT.START}>
              <Text w={FILEMANAGER.WIDTH.FULL}>{t(`modal.fileDescription`)}</Text>
              <Textarea value={description} onChange={handleDescriptionChange} isDisabled={isLoading} _focus={{ boxShadow: `${FILEMANAGER.MODAL.DESCRIPTION.SHADOW} ${shadowColor}`, border: `${FILEMANAGER.MODAL.DESCRIPTION.BORDER} ${shadowColor}` }} maxH={FILEMANAGER.MODAL.DESCRIPTION.MAXHEIGHT} placeholder={t(`modal.descMax`)} />
              <Text fontSize={FILEMANAGER.MODAL.DESCRIPTION.ERROR.FONT_SIZE} color={FILEMANAGER.COLOR.RED} h={FILEMANAGER.MODAL.DESCRIPTION.ERROR.HEIGHT}>{shadowColor == FILEMANAGER.COLOR.RED ? t(`modal.descMaxExceeded`) : ""}</Text>
            </VStack>
          )}
        </ModalBody>

        <ModalFooter>
          <VStack w={FILEMANAGER.WIDTH.FULL}>
            {isLoading && (
              <>
                {(progress != FILEMANAGER.EVENT.UPLOAD_COMPLETED_VALUE || source == FILEMANAGER.SOURCE.FILEMANAGER) && <Text textAlign={FILEMANAGER.TEXT.CENTER} fontSize={FILEMANAGER.MODAL.PROGRESS_BAR.TEXT.SIZE} mt={FILEMANAGER.MODAL.PROGRESS_BAR.TEXT.MARGIN_T} fontWeight={FILEMANAGER.MODAL.PROGRESS_BAR.TEXT.WEIGHT}>{progress == FILEMANAGER.EVENT.UPLOAD_COMPLETED_VALUE ? t("fileManager.uploadCompleted") : t("fileManager.uploading")}</Text>}
                {source == FILEMANAGER.SOURCE.RAG && (
                  <>
                    <Text textAlign={FILEMANAGER.TEXT.CENTER} fontSize={progress == FILEMANAGER.EVENT.UPLOAD_COMPLETED_VALUE ? FILEMANAGER.MODAL.PROGRESS_BAR.PROGRESS_TEXT.COMPLETE_SIZE : FILEMANAGER.MODAL.PROGRESS_BAR.PROGRESS_TEXT.SIZE} fontWeight={FILEMANAGER.MODAL.PROGRESS_BAR.PROGRESS_TEXT.WEIGHT}>{progress == FILEMANAGER.EVENT.UPLOAD_COMPLETED_VALUE ? t("fileManager.uploadCompleted") : t("fileManager.progress", { progress })}</Text>
                    <Stack h={FILEMANAGER.MODAL.PROGRESS_BAR.HEIGHT} w={FILEMANAGER.WIDTH.HUNDRED} display={FILEMANAGER.MODAL.PROGRESS_BAR.DISPLAY}>
                      <Box gridColumn={FILEMANAGER.MODAL.PROGRESS_BAR.GRID} gridRow={FILEMANAGER.MODAL.PROGRESS_BAR.GRID} borderRadius={FILEMANAGER.MODAL.PROGRESS_BAR.BORDER_RADIUS} mb={FILEMANAGER.MARGIN.XSMALL} mr={FILEMANAGER.MARGIN.AUTO} h={FILEMANAGER.MODAL.PROGRESS_BAR.GRID_HEIGHT} w={`${progress == FILEMANAGER.EVENT.UPLOAD_COMPLETED_VALUE ? FILEMANAGER.MODAL.PROGRESS_BAR.PROGRESS_COMPLETED_WIDTH : progress}%`} bg={bgColor} zIndex={FILEMANAGER.MODAL.PROGRESS_BAR.PROGRESS_GRID_Z_INDEX}></Box>
                      <Box gridColumn={FILEMANAGER.MODAL.PROGRESS_BAR.GRID} gridRow={FILEMANAGER.MODAL.PROGRESS_BAR.GRID} borderRadius={FILEMANAGER.MODAL.PROGRESS_BAR.BORDER_RADIUS} mb={FILEMANAGER.MARGIN.XSMALL} mr={FILEMANAGER.MARGIN.AUTO} h={FILEMANAGER.MODAL.PROGRESS_BAR.GRID_HEIGHT} w={FILEMANAGER.WIDTH.HUNDRED} bg={progressBg}></Box>
                    </Stack>
                  </>
                )}
              </>
            )}
            <Button
              bg={bgColor}
              color={FILEMANAGER.MODAL.ACCEPT_BUTTON.COLOR}
              _hover={{
                bg: hoverColor,
              }}
              w={FILEMANAGER.WIDTH.FULL}
              mb={FILEMANAGER.MARGIN.XSMALL}
              onClick={handleButtonClick}
              isLoading={isLoading}
              isDisabled={shadowColor == FILEMANAGER.COLOR.RED}
            >
              {t(`fileManager.addFiles`)}
            </Button>
            <Button variant={FILEMANAGER.MODAL.CANCEL_BUTTON.VARIANT} w={FILEMANAGER.WIDTH.FULL} isDisabled={isLoading} onClick={onClose}>
              {t(`modal.cancel`)}
            </Button>
          </VStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default UploadFilesModal;
