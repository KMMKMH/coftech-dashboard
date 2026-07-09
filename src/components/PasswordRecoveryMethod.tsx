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
    useToast,
    useToken,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import useCoftechColors from "@component/hooks/useCoftechColors";
import { WarningTwoIcon } from "@chakra-ui/icons";
import { useRecoveryTypeMutation } from "@component/store/RTK/PasswordRecovery";

const PasswordRecoveryModal = ({ isOpen, onClose, openWhatsapp, openEmail, openSent, user, setEmail_Whatsapp }) => {
    const { t } = useTranslation("common");
    const translate = !(t("recovery.i") == "recovery.i")

    const toast = useToast()

    const { bgColor, textColor, borderColor } = useCoftechColors();

    const stageBorderColor = useColorModeValue("#E5EEF7", "#17304F");
    const [accentColor] = useToken('colors', [bgColor]);
    const stageColor = useColorModeValue("white", "gray.700");
    const bg = useColorModeValue("gray.100", "black");

    const [trigger] = useRecoveryTypeMutation()

    const handleChoose = (isEmail) => {
        if (isEmail) {
            if (openSent != undefined) {
                trigger({ value: user?.email, type: "email" }).then((result) => {
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
                        openSent()
                        setEmail_Whatsapp([user?.email, "email"])
                    }
                })
            } else {
                onClose()
                openEmail()
            }
        } else {
            if (openSent != undefined) {
                trigger({ value: user?.phone, type: "phone" }).then((result) => {
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
                        openSent()
                        setEmail_Whatsapp([user?.phone, "phone"])
                    }
                })
            } else {
                onClose()
                openWhatsapp()
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
                    <HStack
                        m={"auto"}
                        mt={12}
                        mb={3}
                        borderRadius={"50%"}
                        w={"60px"}
                        h={"60px"}
                        bgColor={borderColor}
                    >
                        <VStack m={"auto"} mt={3}>
                            <Icon
                                as={WarningTwoIcon}
                                w={8}
                                h={8}
                                color={bgColor}
                            />
                        </VStack>
                    </HStack>
                    <Text margin={"auto"} textAlign={"center"} fontSize={"20px"} fontWeight={"bold"}>{translate ? t("recovery.sendCodeWhere") : "How do you want to receive the recovery code?"}</Text>
                </ModalBody>

                <ModalFooter>
                    <VStack w={"full"} mb={7}>
                        <Button
                            bg={stageColor}
                            color={textColor}
                            border={`2px solid ${accentColor}`}
                            _hover={{
                                bg: bgColor,
                            }}
                            w={"full"}
                            m={1}
                            onClick={() => {
                                handleChoose(true)
                            }}
                        >
                            {translate ? t("recovery.byEmail") : "By email"}
                        </Button>
                        <Button
                            bg={stageColor}
                            border={`2px solid ${accentColor}`}
                            color={textColor}
                            _hover={{
                                bg: bgColor,
                            }}
                            w={"full"}
                            m={1}
                            onClick={() => {
                                handleChoose(false)
                            }}
                        >
                            {translate ? t("recovery.byWhatsapp") : "By WhatsApp"}
                        </Button>
                    </VStack>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default PasswordRecoveryModal;
