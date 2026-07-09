/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
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
    Icon,
    useColorModeValue,
    HStack,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import useCoftechColors from "@component/hooks/useCoftechColors";
import { CheckCircle } from "@untitled-ui/icons-react";

const CodeSent = ({ isOpen, onClose, openValidateCode }) => {
    const { t } = useTranslation("common");
    const translate = !(t("recovery.i") == "recovery.i")

    const { bgColor, hoverColor, borderColor } = useCoftechColors();

    const stageBorderColor = useColorModeValue("#E5EEF7", "#17304F");

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            size="md"
            isCentered
            variant="coftechModal"
        >
            <ModalOverlay />
            <ModalContent border={`1px solid ${stageBorderColor}`} w={"full"}>
                <ModalCloseButton />
                <ModalBody>
                    <HStack
                        m={"auto"}
                        mt={12}
                        mb={3}
                        borderRadius={"50%"}
                        w={"60px"}
                        h={"60px"}
                        bgColor={borderColor}
                    >
                        <VStack m={"auto"} mt={3.5}>
                            <Icon
                                as={CheckCircle}
                                w={8}
                                h={8}
                                color={bgColor}
                            />
                        </VStack>
                    </HStack>
                    <Text margin={"auto"} textAlign={"center"} fontSize={"20px"} fontWeight={"bold"}>{translate ? t("recovery.codeSent") : "Code sent successfully"}</Text>
                </ModalBody>

                <ModalFooter>
                    <VStack w={"full"} mb={7}>
                        <Button
                            bg={bgColor}
                            color={"white"}
                            _hover={{
                                bg: hoverColor,
                            }}
                            w={"full"}
                            m={1}
                            onClick={() => {
                                onClose()
                                openValidateCode()
                            }}
                        >
                            {translate ? t("recovery.continue") : "Continue"}
                        </Button>
                    </VStack>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default CodeSent;
