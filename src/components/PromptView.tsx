/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from "react";
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
    useColorModeValue,
    HStack,
    Box,
    Input,
    Textarea,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import useCoftechColors from "@component/hooks/useCoftechColors";
import { AxiosUrl } from "@component/configs/AxiosConfig";
import { useError } from "@component/utils/errorContext";

const PromptView = ({ isOpen, onClose, prompt, setIsConfirmationOpen }) => {
    const { t } = useTranslation("common");
    const { showError } = useError();

    const [isLoading, setIsLoading] = useState(false)
    const [lines, setLines] = useState<number>()

    const lineBgColor = useColorModeValue("rgb(242, 242, 242)", "rgb(28, 28, 28)");

    const {
        bgColor,
        hoverColor,
        backgroundColor,
        descriptionColor,
        inputBorderColor,
    } = useCoftechColors();

    const stageBorderColor = useColorModeValue("#E5EEF7", "#17304F");

    const textareaRef = useRef(null);
    const lineNumberRef = useRef(null);

    useEffect(() => {

        const timeout = setTimeout(() => {
            const height = textareaRef.current?.scrollHeight;
            setLines(Math.floor(height / (16 * 1.5)));
        }, 100);

        return () => clearTimeout(timeout);
    }, [isOpen]);

    const handleScroll = () => {
        if (lineNumberRef.current && textareaRef.current) {
            lineNumberRef.current.scrollTop = textareaRef.current.scrollTop;
        }
    };

    const handleScroll2 = () => {
        if (lineNumberRef.current && textareaRef.current) {
            textareaRef.current.scrollTop = lineNumberRef.current.scrollTop;
        }
    };

    const handleRestorePrompt = async () => {
        setIsLoading(true);
        try {
            await AxiosUrl.post(
                `/prompts?companyID=${prompt.company_id}&botID=${prompt.bot_id}`,
                {
                    name: prompt.name,
                    data: prompt.data,
                    type: 0
                },
            );
            onClose();
            setIsConfirmationOpen(true);
        } catch (error) {
            showError(error?.response?.data?.message)
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={isLoading ? () => { } : onClose}
            size="lg"
            isCentered
            variant="coftechModal"
        >
            <ModalOverlay />
            <ModalContent border={`1px solid ${stageBorderColor}`} w={"full"}>
                <ModalCloseButton isDisabled={isLoading} />
                <ModalHeader>
                    <Text>{t("prompt.title")}</Text>
                </ModalHeader>
                <ModalBody>
                    <VStack
                        spacing={8}
                        align="start"
                        w="full"
                        overflowY="auto"
                        flex="1"
                    >
                        <Input
                            placeholder={t("prompt.promptName")}
                            background={backgroundColor}
                            borderColor={inputBorderColor}
                            _focus={{
                                boxShadow: "none",
                                borderColor: bgColor
                            }}
                            readOnly={true}
                            value={prompt?.name}
                        />
                        <Text fontSize={16} fontWeight="500" color={descriptionColor}>
                            {t("prompt.autoPromptDescription")}
                        </Text>
                        <HStack h={"240px"} w={"full"} gap={0} bg={lineBgColor} borderRadius={"7px"}>
                            <Box h={"full"} w={"100px"} px={3} py={"9.5px"} overflowY={"auto"} ref={lineNumberRef} onScroll={handleScroll2} sx={{
                                scrollbarWidth: 'none',
                                msOverflowStyle: 'none',
                                '&::-webkit-scrollbar': {
                                    display: 'none',
                                },
                            }}>
                                {Array.from({ length: lines || 1 }, (_, i) => (
                                    <Text key={i} h="1.5em" w={"full"} textAlign={"center"} color={descriptionColor}>{i < 9 ? `0${i + 1}` : (i + 1)}</Text>
                                ))}
                            </Box>
                            <Textarea
                                ref={textareaRef}
                                mb={"auto"}
                                onScroll={handleScroll}
                                bg={backgroundColor}
                                borderLeftRadius={"0px"}
                                placeholder={t("prompt.writePrompt")}
                                minH={"240px"}
                                maxH={"240px"}
                                lineHeight="1.5em"
                                borderColor={inputBorderColor}
                                _focus={{
                                    boxShadow: "none",
                                    borderColor: bgColor
                                }}
                                readOnly={true}
                                value={prompt?.data}
                            />
                        </HStack>
                    </VStack>
                </ModalBody>

                <ModalFooter>
                    <Button
                        bg={bgColor}
                        color="white"
                        py={6}
                        w="50%"
                        _hover={{ bg: hoverColor }}
                        onClick={handleRestorePrompt}
                        isLoading={isLoading}
                    >
                        {t("prompt.restore")}
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal >
    );
};

export default PromptView;
