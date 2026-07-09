/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useColorModeValue,
  Box,
  useBreakpointValue,
} from "@chakra-ui/react";
import { FILEMANAGER } from "@component/constants/fileManager";

interface FileViewProps {
  isOpen: boolean,
  url: string,
  onClose: () => void
}

const FileView: React.FC<FileViewProps> = ({ isOpen, url, onClose }) => {
  const [isLoading] = useState(false)
  const isMobile = useBreakpointValue(FILEMANAGER.MOBILE_BREAKPOINT);
  const stageBorderColor = useColorModeValue(FILEMANAGER.MODAL.BORDER.COLOR.LIGHT, FILEMANAGER.MODAL.BORDER.COLOR.DARK);

  return (
    <Modal
      isOpen={isOpen}
      onClose={isLoading ? () => {} : onClose}
      isCentered
      variant={FILEMANAGER.MODAL.VARIANT}
    >
      <ModalOverlay />
      <ModalContent border={`${FILEMANAGER.MODAL.BORDER.VALUE} ${stageBorderColor}`} w={FILEMANAGER.MODAL.FILE_VIEW.WIDTH} maxW={FILEMANAGER.MODAL.FILE_VIEW.WIDTH} p={isMobile ? FILEMANAGER.MODAL.FILE_VIEW.PADDING.MOBILE : FILEMANAGER.MODAL.FILE_VIEW.PADDING.PC}>
        <ModalHeader></ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box
          m={FILEMANAGER.MARGIN.AUTO}
          as={FILEMANAGER.MODAL.FILE_VIEW.FILE_VIWER.VALUE}
          src={url}
          w={isMobile ?  FILEMANAGER.MODAL.FILE_VIEW.FILE_VIWER.WIDTH.MOBILE : FILEMANAGER.MODAL.FILE_VIEW.FILE_VIWER.WIDTH.PC}
          h={isMobile ?  FILEMANAGER.MODAL.FILE_VIEW.FILE_VIWER.HEIGHT.MOBILE : FILEMANAGER.MODAL.FILE_VIEW.FILE_VIWER.HEIGHT.PC}
          >
          </Box>
        </ModalBody>
        <ModalFooter></ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default FileView;
