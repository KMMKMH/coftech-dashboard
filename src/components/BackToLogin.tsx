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
    Link,
    useToken,
    Input,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import useCoftechColors from "@component/hooks/useCoftechColors";
import { CheckCircle, CheckDone01, Trash01 } from "@untitled-ui/icons-react";

const BackToLogin = ({ isOpen, onClose }) => {
    const { t } = useTranslation("common");
    const translate = !(t("recovery.i") == "recovery.i")
    const [isLoading, setIsLoading] = useState(false)

    const toast = useToast()
    const router = useRouter();

    const { bgColor, hoverColor, textColor, panelBgColor, borderColor } = useCoftechColors();
    const progressBg = useColorModeValue("gray.100", "gray.700");

    const stageBorderColor = useColorModeValue("#E5EEF7", "#17304F");

    const handleClick = () => {
        onClose()
        if (!router.pathname.includes("/auth/login")) {
            router.push("/auth/login");
        }
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={isLoading ? () => { } : onClose}
            size="md"
            isCentered
            variant="coftechModal"
        >
            <ModalOverlay />
            <ModalContent border={`1px solid ${stageBorderColor}`} w={"full"}>
                <ModalCloseButton isDisabled={isLoading} />
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
                    <Text margin={"auto"} mb={"15px"} textAlign={"center"} fontSize={"20px"} fontWeight={"bold"}>{translate ? t("recovery.restored") : "Password Restored"}</Text>
                    <Text margin={"auto"} mb={0} textAlign={"center"} fontSize={"15px"}>{translate ? t("recovery.restoredDesc") : "You can now use your new password"}</Text>
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
                            mt={0}
                            onClick={handleClick}
                        >
                            {translate ? t("recovery.return") : "Back to login"}
                        </Button>
                    </VStack>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default BackToLogin;
