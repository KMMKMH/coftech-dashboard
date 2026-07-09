/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from "react";
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
    useToast,
    FormControl,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import useCoftechColors from "@component/hooks/useCoftechColors";
import { useRecoveryTypeMutation } from "@component/store/RTK/PasswordRecovery";
import { ChakraEmailInput } from "./ChakraEmailInput";

const EmailRecoveryModal = ({ isOpen, onClose, openCodeSent, setEmailValue }) => {
    const { t } = useTranslation("common");
    const translate = !(t("recovery.i") == "recovery.i")
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    const [trigger] = useRecoveryTypeMutation()

    const handleChange = (value) => {
        setEmail(value.target.value)
        setTrue(regex.test(value.target.value) || value.target.value.length <= 0)
    }

    const [email, setEmail] = useState<string>("")
    const [isTrue, setTrue] = useState<boolean>(true)

    const toast = useToast()

    const handleClick = () => {
        trigger({ value: email, type: "email" }).then((result) => {
            if ((result as { error: any })?.error) {
                if (!(toast.isActive("124"))) {
                    toast({
                        id: "124",
                        title: translate ? t("recovery.error") : "Error",
                        description: (result as { error: any })?.error.data.message,
                        status: "error",
                        duration: 2000,
                        isClosable: true,
                    })
                }
            } else {
                onClose()
                openCodeSent()
                setEmailValue([email, "email"])
            }
        })
    }

    const { bgColor, hoverColor } = useCoftechColors();

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
                    <Text margin={"auto"} mt={12} mb={"30px"} textAlign={"center"} fontSize={"20px"} fontWeight={"bold"}>{translate ? t("recovery.email") : "Restore by email"}</Text>
                </ModalBody>

                <ModalFooter>
                    <VStack w={"full"} mb={7}>
                        <HStack w={"full"} gap={1}>
                            <Text mr={2} fontSize={"15px"}>{translate ? t("recovery.emailValue") : "Email"}</Text>
                            {!isTrue && (
                                <Text mr={"auto"} color={"red"} fontSize={"15px"}>{translate ? t("recovery.emailValidity") : "Invalid email"}</Text>
                            )}
                        </HStack>
                        <FormControl w={"full"}>
                            {ChakraEmailInput(email, handleChange, isTrue)}
                        </FormControl>
                        <Button
                            bg={bgColor}
                            color={"white"}
                            _hover={{
                                bg: hoverColor,
                            }}
                            w={"full"}
                            m={1}
                            onClick={handleClick}
                            isDisabled={!(email?.length > 0 && regex.test(email))}
                        >
                            {translate ? t("recovery.sendCode") : "Send code"}
                        </Button>
                    </VStack>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default EmailRecoveryModal;
