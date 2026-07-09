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
    InputGroup,
    InputRightElement,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import useCoftechColors from "@component/hooks/useCoftechColors";
import { useSavePasswordMutation } from "@component/store/RTK/PasswordRecovery";
import { ViewOffIcon, ViewIcon } from "@chakra-ui/icons";

const NewPassword = ({ isOpen, onClose, openBackToLogin, jwt, setJWT, setEmail_Whatsapp }) => {
    const { t } = useTranslation("common");
    const translate = !(t("recovery.i") == "recovery.i")

    const toast = useToast()

    const { bgColor, hoverColor } = useCoftechColors();
    const [trigger] = useSavePasswordMutation()

    const stageBorderColor = useColorModeValue("#E5EEF7", "#17304F");
    const [accentColor] = useToken('colors', [bgColor]);
    const [pass, setPass] = useState<string>()
    const [confirm, setConfirm] = useState<string>()
    const [showConfirmation, setShowConfirmation] = useState<boolean>(false)
    const [showPassword, setShowPassword] = useState<boolean>(false)

    const handleClick = () => {
        if (pass && pass?.length >= 8 && pass == confirm) {
            trigger({ password: pass, jwt: jwt }).then((result) => {
                if ((result as { error: any })?.error) {
                    if (!(toast.isActive("126"))) {
                        toast({
                            id: "126",
                            title: translate ? t("recovery.error") : "Error",
                            description: (result as { error: any })?.error.data.message,
                            status: "error",
                            duration: 2000,
                            isClosable: true,
                        })
                    }
                } else {
                    onClose()
                    openBackToLogin()
                    setJWT("")
                    setEmail_Whatsapp([])
                }
            })
        } else {
            if (!(toast.isActive("127")) && (!pass || pass?.length < 8)) {
                toast({
                    id: "127",
                    title: translate ? t("recovery.error") : "Error",
                    description: translate ? t("recovery.length") : "The password must be at least 8 characters long",
                    status: "error",
                    duration: 2000,
                    isClosable: true,
                })
            } else if (!(toast.isActive("128")) && (pass != confirm)) {
                toast({
                    id: "128",
                    title: translate ? t("recovery.error") : "Error",
                    description: translate ? t("recovery.noMatch") : "The new password and confirmation do not match",
                    status: "error",
                    duration: 2000,
                    isClosable: true,
                })
            }
        }
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
                    <Text margin={"auto"} mt={12} mb={"15px"} textAlign={"center"} fontSize={"20px"} fontWeight={"bold"}>{translate ? t("recovery.new") : "New password"}</Text>
                    <Text margin={"auto"} mb={"30px"} textAlign={"center"} fontSize={"15px"}>{translate ? t("recovery.enterNew") : "Enter your new password"}</Text>
                </ModalBody>

                <ModalFooter>
                    <VStack w={"full"} mb={7}>
                        <Text mr={"auto"} fontSize={"15px"}>{translate ? t("recovery.new") : "New password"}</Text>
                        <InputGroup>
                            <Input value={pass} type={showPassword ? "text" : "password"} onChange={(value) => { setPass(value.target.value) }} _focus={{ boxShadow: `0 0 5px 1px ${accentColor}`, border: `1px solid ${accentColor}` }} placeholder="••••••••" />
                            <InputRightElement h={"full"}>
                                <Button
                                    variant={"link"}
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <ViewOffIcon /> : <ViewIcon />}
                                </Button>
                            </InputRightElement>
                        </InputGroup>
                        <Text mr={"auto"} fontSize={"15px"}>{translate ? t("recovery.repeat") : "Repeat password"}</Text>
                        <InputGroup mb={"15px"}>
                            <Input value={confirm} type={showConfirmation ? "text" : "password"} onChange={(value) => { setConfirm(value.target.value) }} _focus={{ boxShadow: `0 0 5px 1px ${accentColor}`, border: `1px solid ${accentColor}` }} placeholder="••••••••" />
                            <InputRightElement h={"full"}>
                                <Button
                                    variant={"link"}
                                    onClick={() => setShowConfirmation(!showConfirmation)}
                                >
                                    {showConfirmation ? <ViewOffIcon /> : <ViewIcon />}
                                </Button>
                            </InputRightElement>
                        </InputGroup>
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
                            {translate ? t("recovery.save") : "Save"}
                        </Button>
                    </VStack>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default NewPassword;
