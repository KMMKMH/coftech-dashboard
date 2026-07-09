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
} from "@chakra-ui/react";
import { FiTrash } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import useCoftechColors from "@component/hooks/useCoftechColors";

const DeleteUserModal = ({
  isOpen,
  onClose,
  onDelete,
  username,
  isDeleting,
}) => {
  const { t } = useTranslation("common");
  const { bgColor, hoverColor, panelBgColor, backgroundColor } =
    useCoftechColors();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="md"
      isCentered
      variant="coftechModal"
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{t("modal.deleteUser")}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4} align="center">
            <Icon as={FiTrash} w={12} h={12} color={bgColor} />
            <Text fontSize="lg" fontWeight="300">
              {t("modal.confirmDeleteUser", { username })}
            </Text>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <VStack w="full">
            <Button
              bg={bgColor}
              _hover={{
                bg: hoverColor,
              }}
              color={"white"}
              w="full"
              mb={2}
              onClick={onDelete}
              disabled={isDeleting}
              isLoading={isDeleting}
            >
              {t("modal.confirmDelete")}
            </Button>
            <Button
              variant="outline"
              w="full"
              onClick={onClose}
              disabled={isDeleting}
            >
              {t("modal.cancelDelete")}
            </Button>
          </VStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DeleteUserModal;
