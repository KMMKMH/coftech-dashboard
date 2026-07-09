/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from "react";
import Image from "next/image";
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalCloseButton,
    ModalBody,
    VStack,
    Button,
    Text,
    Icon,
    useColorModeValue,
    HStack,
    Box,
    Card,
    CardBody,
    CardFooter,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import useCoftechColors from "@component/hooks/useCoftechColors";
import dynamic from "next/dynamic";
import { FaPlus } from "react-icons/fa";

const IntegrationView = ({ isOpen, onClose, extension }) => {
    const { t } = useTranslation("common");
    const [isLoading, setIsLoading] = useState(false)

    const { bgColor, hoverColor, panelBgColor, descriptionColor } = useCoftechColors();

    const stageBorderColor = useColorModeValue("#E5EEF7", "#17304F");

    const getIconComponent = (iconName: any) => {
        try {
            const IconComponent = dynamic(() =>
                import(`react-icons/fa`).then((icons) => icons[iconName])
            );
            return IconComponent;
        } catch (error) {
            console.error("Icon not found:", iconName);
            return null;
        }
    };

    const IconComponent = getIconComponent(
        extension?.icon
    );

    return (
        <Modal
            isOpen={isOpen}
            onClose={isLoading ? () => { } : onClose}
            size="md"
            isCentered
            variant="coftechModal"
        >
            <ModalOverlay />
            <ModalContent border={`1px solid ${stageBorderColor}`}>
                <ModalCloseButton zIndex={9} borderRadius={"50%"} bg={bgColor} _hover={{ bg: hoverColor }} color={"white"} />
                <ModalBody>
                    <Card
                        w="100%"
                        bg={panelBgColor}
                        borderRadius="10px"
                        boxShadow="none"
                        boxSizing="content-box"
                    >
                        <CardBody
                            boxSizing="border-box"
                            p="15px 20px 15px 20px"
                            display="flex"
                            flexDir="column"
                            textAlign={"start"}
                            alignItems={"start"}
                            gap="7px"
                        >
                            {extension?.extension_image != null && (
                                <Image src={extension?.extension_image.url} width={20} height={12} alt="Extension Image" />
                            )}
                            {IconComponent && (
                                <Box
                                    borderRadius={"full"}
                                    width="60px"
                                    height="60px"
                                    display="flex"
                                    justifyContent="center"
                                    alignItems="center"
                                >
                                    <Icon
                                        as={IconComponent}
                                        color={bgColor}
                                        boxSize="50px"
                                    />
                                </Box>
                            )}
                            <Box>
                                <Text
                                    fontSize={16}
                                    fontFamily="Poppins"
                                    fontWeight="600"
                                >
                                    {extension?.name}
                                </Text>
                            </Box>
                            <Box
                                mb={1}
                            >
                                <Text
                                    fontSize={14}
                                    fontFamily="Poppins"
                                    color={descriptionColor}
                                >
                                    {extension?.description[t(`integrations.lang`)]}
                                </Text>
                            </Box>
                        </CardBody>
                        <CardFooter m={0} p={0}>
                            <VStack w="full" mb={"15px"}>
                                <Button
                                    bg={bgColor}
                                    color={"white"}
                                    _hover={{
                                        bg: hoverColor,
                                    }}
                                    w="full"
                                    mb={2}
                                    isLoading={isLoading}
                                >
                                    <HStack>
                                        <FaPlus />
                                        <Text>{t(`integrations.acquireIntegrationButton`)}</Text>
                                    </HStack>
                                </Button>
                            </VStack>
                        </CardFooter>
                    </Card>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default IntegrationView;
