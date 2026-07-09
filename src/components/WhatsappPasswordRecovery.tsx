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
    useToast,
    FormControl,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import useCoftechColors from "@component/hooks/useCoftechColors";
import PhoneInput from "react-phone-number-input";
import { useRecoveryTypeMutation } from "@component/store/RTK/PasswordRecovery";
import { ChakraPhoneInput } from "./ChakraPhoneInput";

const WhatsappRecoveryModal = ({ isOpen, onClose, openCodeSent, setWhatsappValue }) => {
    const { t } = useTranslation("common");
    const translate = !(t("recovery.i") == "recovery.i")
    
    const [number, setNumber] = useState<string>("")
    const [trigger] = useRecoveryTypeMutation()

    const toast = useToast()

    const { bgColor, hoverColor } = useCoftechColors();

    const handleClick = () => {
        trigger({ value: number, type: "phone" }).then((result) => {
            if ((result as { error: any })?.error) {
                if (!(toast.isActive("122"))) {
                    toast({
                        id: "122",
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
                setWhatsappValue([number, "phone"])
            }
        })
    }

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
                    <Text margin={"auto"} mt={12} mb={"30px"} textAlign={"center"} fontSize={"20px"} fontWeight={"bold"}>{translate ? t("recovery.whatsapp") : "Restore via WhatsApp"}</Text>
                </ModalBody>

                <ModalFooter>
                    <VStack w={"full"} mb={7}>
                        <Text mr={"auto"} fontSize={"15px"}>{translate ? t("recovery.whatsappNumber") : "WhatsApp number"}</Text>
                        <FormControl w={"full"}>
                            <PhoneInput
                                defaultCountry="AR"
                                value={number}
                                onChange={(value) => { setNumber(value) }}
                                inputComponent={ChakraPhoneInput}
                                international
                                countryCallingCodeEditable={false}
                                limitMaxLength
                            />
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
                            isDisabled={!(number?.length > 0)}
                        >
                            {translate ? t("recovery.sendCode") : "Send code"}
                        </Button>
                    </VStack>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default WhatsappRecoveryModal;
