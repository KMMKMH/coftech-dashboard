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
    useToken,
    Input,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import useCoftechColors from "@component/hooks/useCoftechColors";
import { useVerifyCodeMutation } from "@component/store/RTK/PasswordRecovery";

const ValidateCode = ({ isOpen, onClose, openNewPassword, value, setJWT }) => {
    const { t } = useTranslation("common");
    const translate = !(t("recovery.i") == "recovery.i")

    const [trigger] = useVerifyCodeMutation()

    const toast = useToast()

    const { bgColor, hoverColor } = useCoftechColors();

    const stageBorderColor = useColorModeValue("#E5EEF7", "#17304F");
    const [accentColor] = useToken('colors', [bgColor]);
    const [code, setCode] = useState<string>()
    const regex = /^\d{0,6}$/

    const handleChange = (value) => {
        if (regex.test(value.target.value)) {
            setCode(value.target.value)
        }
    }

    const handleClick = () => {
        trigger({ value: value[0], type: value[1], code: code }).then((result) => {
            if ((result as { error: any })?.error) {
                if (!(toast.isActive("125"))) {
                    toast({
                        id: "125",
                        title: translate ? t("recovery.error") : "Error",
                        description: (result as { error: any })?.error.data.message,
                        status: "error",
                        duration: 2000,
                        isClosable: true,
                    })
                }
            } else {
                setJWT((result as { data: any })?.data.data.token)
                onClose()
                openNewPassword()
            }
        })
    }

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
                    <Text margin={"auto"} mt={12} mb={"30px"} textAlign={"center"} fontSize={"20px"} fontWeight={"bold"}>{translate ? t("recovery.restore") : "Restore password"}</Text>
                </ModalBody>

                <ModalFooter>
                    <VStack w={"full"} mb={7}>
                        <Text mr={"auto"} fontSize={"15px"}>{translate ? t("recovery.code") : "Enter your verification code"}</Text>
                        <Input value={code} onChange={handleChange} _focus={{ boxShadow: `0 0 5px 1px ${accentColor}`, border: `1px solid ${accentColor}` }} placeholder="XXX-XXX" />
                        <Button
                            bg={bgColor}
                            color={"white"}
                            _hover={{
                                bg: hoverColor,
                            }}
                            w={"full"}
                            m={1}
                            onClick={handleClick}
                        >
                            {translate ? t("recovery.continue") : "Continue"}
                        </Button>
                    </VStack>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default ValidateCode;
