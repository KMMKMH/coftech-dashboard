import React from "react";
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
  useBreakpointValue,
} from "@chakra-ui/react";
import { FiAlertCircle } from "react-icons/fi";
import { useTranslation } from "react-i18next";

const ErrorModal = ({ isOpen, onClose, errorMessages }) => {
  const { t } = useTranslation("common");

  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="md"
      isCentered
      variant="coftechModal"
    >
      <ModalOverlay />
      <ModalContent maxW={isMobile ? "320px" : null}>
        <ModalHeader>{t("modal.errorTitle")}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4} align="center">
            <Icon as={FiAlertCircle} w={12} h={12} color="red.500" />
            {typeof (errorMessages) === "string" ? (
              <Text fontSize="lg" fontWeight="300">
                {errorMessages || t("modal.genericErrorMessage")}
              </Text>
            ) : errorMessages?.map((message, index) => (
              <Text key={index} fontSize="lg" fontWeight="300">
                {message || t("modal.genericErrorMessage")}
              </Text>
            ))}
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="red" w="full" onClick={onClose}>
            {t("modal.close")}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ErrorModal;
