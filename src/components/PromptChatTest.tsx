/* eslint-disable react-hooks/exhaustive-deps */
import {
    HStack,
    Text,
    Button,
    Box,
    Avatar,
    InputGroup,
    Input,
    Spinner,
    useBreakpointValue,
    VStack,
    Heading,
    useColorModeValue,
    InputRightElement,
    useToken,
    Stack,
} from "@chakra-ui/react";
import React, { useEffect, useState, useRef } from "react";
import useCoftechColors from "@component/hooks/useCoftechColors";
import { FaPaperPlane } from "react-icons/fa";
import { LayoutRight } from "@untitled-ui/icons-react";
import { CoftechLogo } from "./Logo-mini";
import useErrorHandler from "@component/hooks/useErrorHandler";
import { usePromptAssistMutation, useTestPromptMutation } from "@component/store/RTK/promptsRTK";

interface PromptChatTestProps {
    tran: any,
    selectedBot: any,
    selectedCompany: string,
    testPrompt: string,
    prompt: any,
    setResponseText: (value: string) => void,
}

const PromptChatTest: React.FC<PromptChatTestProps> = ({ tran, selectedBot, selectedCompany, testPrompt, prompt, setResponseText }) => {
    const t = tran
    const isMobile = useBreakpointValue({ base: true, md: false });
    const { handleError } = useErrorHandler();

    const [chatOpen, setChatOpen] = useState<boolean>(true)
    const [isTestLoading, setIsTestLoading] = useState<boolean>(false)
    const [quickResponses, setQuickResponses] = useState<any>([])
    const [supportHistory, setSupportHistory] = useState<any>([
        {
            role: "assistant",
            content: t("prompt.question"),
        },
    ]);

    const [supportFrontendHistory, setSupportFrontendHistory] = useState<any>([
        {
            role: "assistant",
            content: t("prompt.question"),
        },
    ]);
    const [messageHistory, setMessageHistory] = useState([]);

    const {
        bgColor,
        panelBgColor,
        backgroundColor,
        textColor,
    } = useCoftechColors();
    const stageOwnChatColor = useColorModeValue("#E8F4FF", "#12385C");
    const [testMessage, setTestMessage] = useState("");
    const [supportMessage, setSupportMessage] = useState("");
    const [promptProgress, setPromptProgress] = useState("");
    const [question, setQuestion] = useState("")
    const [accentColor] = useToken('colors', [bgColor]);
    const [selected, setSelected] = useState<number>(0);
    const [supportEnd, setSupportEnd] = useState<boolean>(false);
    const chatRef = useRef<any>()
    const [triggerTest] = useTestPromptMutation();
    const [triggerAssist] = usePromptAssistMutation();

    useEffect(() => {
        if (promptProgress) {
            const letters = promptProgress.split("");
            let text = ""

            for (let i = 0; i < letters.length; i++) {
                setTimeout(() => {
                    text += letters[i];
                    setResponseText(text)
                }, 100)
            }
        }
    }, [promptProgress])

    useEffect(() => {
        chatRef?.current?.scrollTo({
            top: 99999999,
            behavior: "smooth",
        });
    }, [supportFrontendHistory, messageHistory, selected])

    const combinedMessages = [
        ...messageHistory,
    ];

    const handleOpenChat = () => {
        setChatOpen(!chatOpen)
    }

    const handleSupport = () => {
        setSelected(0)
    }

    const handleTestPrompt = () => {
        setSelected(1)
    }

    useEffect(() => {
        setSupportHistory((prevHistory) => {
            const newHistory = [...prevHistory];
            const questionIndex = newHistory.findIndex(
                (msg) => msg.content === "What type of bot would you like to create?"
            );
            if (questionIndex !== -1) {
                newHistory[questionIndex] = {
                    role: "assistant",
                    content: t("prompt.question"),
                };
            }
            return newHistory;
        });

        setSupportFrontendHistory((prevHistory) => {
            const newHistory = [...prevHistory];
            const questionIndex = newHistory.findIndex(
                (msg) => msg.content === "What type of bot would you like to create?"
            );
            if (questionIndex !== -1) {
                newHistory[questionIndex] = {
                    role: "assistant",
                    content: t("prompt.question"),
                };
            }
            return newHistory;
        });
    }, [t("prompt.question")])

    function formatAIText(content: string) {
        const quotes: string[] = [];
        const numberRanges: string[] = [];

        let protectedText = content.replace(/"([^"]*?)"/g, (match, inner) => {
            quotes.push(inner);
            return `__QUOTE_${quotes.length - 1}__`;
        });

        protectedText = protectedText.replace(/\b(\d{1,4})\s*-\s*(\d{1,4})\b/g, (match, a, b) => {
            numberRanges.push(`${a} - ${b}`);
            return `__NUMRANGE_${numberRanges.length - 1}__`;
        });

        const cleaned = protectedText
            .replace(/(?<!\b(?:Mr|Mrs|Ms|Dr|Sr|Jr|etc))([.?!])\s+(?![\p{Emoji_Presentation}\p{Extended_Pictographic}])/gu, "$1\n")
            .replace(/(\s*-\s*)(?!\d)/g, "\n- ")
            .replace(/\n{2,}/g, "\n")
            .trim();

        const restored = cleaned
            .replace(/__NUMRANGE_(\d+)__/g, (_, index) => numberRanges[+index])
            .replace(/__QUOTE_(\d+)__/g, (_, index) => `"${quotes[+index]}"`);

        const lines = restored.split("\n").filter(Boolean);

        return (
            <Stack spacing={3}>
                {lines.map((line, index) => (
                    <Text key={index} whiteSpace="pre-wrap">
                        {line.trim()}
                    </Text>
                ))}
            </Stack>
        );
    }


    function formatResponseText(content: string) {
        const cleaned = content
            .replace(/([.?!])\s*/g, "$1\n")
            .replace(/\n{2,}/g, "\n")
            .trim();

        const lines = cleaned.split("\n").filter(Boolean);

        return (
            <>
                {lines.map((line, index) => (
                    <Text key={index} whiteSpace="pre-wrap">
                        {line.trim()}
                    </Text>
                ))}
            </>
        );
    }

    const handleSupportGenerate = async (message) => {
        let answer = supportMessage;

        if (message != null) {
            answer = message
        }

        if (!answer) return;
        if (isTestLoading) return;

        setSupportHistory((prevHistory) => [
            ...prevHistory,
            {
                role: "user",
                content: answer,
            },
            {
                role: "loading",
                content: "Loading...",
            },
        ]);

        setSupportFrontendHistory((prevHistory) => [
            ...prevHistory,
            {
                role: "user",
                content: answer,
            },
            {
                role: "loading",
                content: "Loading...",
            },
        ]);

        setSupportMessage("");

        setIsTestLoading(true);
        const data = supportHistory?.length > 0 && promptProgress?.length > 0 ? {
            question: question,
            answer: answer,
            history: supportHistory,
            prompt_in_progress: promptProgress
        } : supportHistory?.length > 0 ? {
            question: "What type of bot would you like to create?",
            answer: answer,
            history: supportHistory
        } : {
            question: "What type of bot would you like to create?",
            answer: answer,
        };

        try {
            const response = await triggerAssist({ companyID: selectedCompany, botID: selectedBot?.value, data }).unwrap();
            const parsedData = JSON.parse(response.data)

            setQuickResponses(parsedData?.quick_responses)

            setSupportEnd(parsedData?.is_complete == true && parsedData.final_prompt?.length > 0)

            if (parsedData?.is_complete == true && parsedData?.final_prompt?.length > 0) {
                setPromptProgress(parsedData?.final_prompt)
            } else {
                setPromptProgress(parsedData?.prompt_progress)
            }

            setQuestion(parsedData?.message)

            setSupportHistory((prevHistory) => {
                const newHistory = [...prevHistory];
                const loadingIndex = newHistory.findIndex(
                    (msg) => msg.role === "loading"
                );
                if (loadingIndex !== -1) {
                    newHistory[loadingIndex] = {
                        role: "assistant",
                        content: parsedData?.message,
                    };
                }
                return newHistory;
            });

            setSupportFrontendHistory((prevHistory) => {
                const newHistory = [...prevHistory];
                const loadingIndex = newHistory.findIndex(
                    (msg) => msg.role === "loading"
                );
                if (loadingIndex !== -1) {
                    newHistory[loadingIndex] = {
                        role: "assistant",
                        content: parsedData?.message,
                        next_question: parsedData?.next_question,
                        quickResponses: parsedData?.quick_responses,
                    };
                }
                return newHistory;
            });

        } catch (error) {
            setSupportHistory([{
                role: "assistant",
                content: t("prompt.question"),
            },]);
            setSupportFrontendHistory([{
                role: "assistant",
                content: t("prompt.question"),
            },]);
            setPromptProgress("");
            setQuickResponses([]);
            handleError(error, { ...data, companyID: selectedCompany, botID: selectedBot?.value })
        } finally {
            setIsTestLoading(false);
        }
    };

    const handleTestGenerate = async () => {
        if (!testMessage) return;
        if (!testPrompt) return;
        if (isTestLoading) return;

        setMessageHistory((prevHistory) => [
            ...prevHistory,
            {
                type: "user",
                text: testMessage,
            },
            {
                type: "loading",
                text: "Loading...",
            },
        ]);

        setTestMessage("");

        setIsTestLoading(true);
        const testData = {
            prompt: testPrompt,
            data: testMessage,
        }

        try {
            const response = await triggerTest({ botID: selectedBot?.value, data: testData }).unwrap();

            setMessageHistory((prevHistory) => {
                const newHistory = [...prevHistory];
                const loadingIndex = newHistory.findIndex(
                    (msg) => msg.type === "loading"
                );
                if (loadingIndex !== -1) {
                    newHistory[loadingIndex] = {
                        type: "other",
                        text: response?.data,
                    };
                }
                return newHistory;
            });

        } catch (error) {
            handleError(error, { botID: selectedBot?.value, ...testData })
        } finally {
            setIsTestLoading(false);
        }
    };

    return (
        <>
            <VStack
                spacing={4}
                w={isMobile ? "full" : chatOpen ? { base: "full", md: "full", lg: "60%" } : "100px"}
                transition="width 0.5s ease-in-out"
                px={{ base: 4, md: 8 }}
                py={6}
                bg={panelBgColor}
                boxShadow="md"
                borderRadius="md"
                height="600px"
            >
                {!isMobile && (
                    <Box position={"absolute"} right={"63px"} zIndex={9} borderRadius={"50%"} p={"7px"} _hover={{ cursor: "pointer", filter: "brightness(82%)", transition: "filter 0.1s ease-in-out" }} onClick={handleOpenChat}>
                        <Box m={"auto"}>
                            <LayoutRight color={accentColor} />
                        </Box>
                    </Box>
                )}
                <VStack w={"full"} h={"full"} opacity={chatOpen ? 1 : 0} transition={chatOpen ? "opacity 1.5s ease-in-out" : "opacity 0.2s ease-in-out"}>
                    <HStack spacing={4} w="full" mb={4}>
                        <Heading size="md" textAlign="left" w="full">
                            {selected == 0 ? t("prompt.support") : t("prompt.test")}
                        </Heading>
                    </HStack>
                    {prompt && (
                        <HStack w={"full"}>
                            <Button
                                w={"70%"}
                                bg={selected == 0 ? bgColor : "transparent"}
                                color={selected == 0 ? backgroundColor : accentColor}
                                border={`1px solid ${accentColor}`}
                                borderRadius={"15px"}
                                _hover={{
                                    bg: bgColor,
                                    color: "black"
                                }}
                                onClick={handleSupport}
                            >
                                <Text overflow={"hidden"}>{t("prompt.support")}</Text>
                            </Button>
                            <Button
                                w={"full"}
                                bg={selected == 1 ? bgColor : "transparent"}
                                color={selected == 1 ? backgroundColor : accentColor}
                                border={`1px solid ${accentColor}`}
                                borderRadius={"15px"}
                                _hover={{
                                    bg: bgColor,
                                    color: backgroundColor
                                }}
                                onClick={handleTestPrompt}
                            >
                                <Text overflow={"hidden"}>{t("prompt.test")}</Text>
                            </Button>

                        </HStack>
                    )}
                    {selected == 1 && (
                        <Box color={textColor} fontWeight={"bold"}>{t("prompt.savePromptNote")}</Box>
                    )}
                    <VStack
                        spacing={3}
                        align="start"
                        w="full"
                        overflowY="auto"
                        ref={chatRef}
                        flex="1"
                        p={1}
                    >
                        {selected == 0 ? (
                            <>
                                {chatOpen && supportFrontendHistory.length > 1 ? (
                                    <>
                                        {supportFrontendHistory.map((msg, i) => {
                                            return (
                                                <HStack
                                                    key={i}
                                                    align="start"
                                                    w="full"
                                                    justify={msg.role === "assistant" ? "flex-start" : "flex-end"}
                                                >
                                                    <HStack
                                                        w={"350px"}
                                                        mr={msg.role == "loading" ? "auto" : null}
                                                    >
                                                        {(msg.role === "assistant" || msg.role === "loading") && (
                                                            <Box mb={"auto"}>
                                                                <Avatar size="sm" as={CoftechLogo} bg={"transparent"} w={"23px"} mr={1} />
                                                            </Box>
                                                        )}
                                                        <VStack w={"full"} p={1}>
                                                            <HStack
                                                                bg={msg.role == "user" ? backgroundColor : stageOwnChatColor}
                                                                p={2}
                                                                borderRadius={"10px"}
                                                                borderTopRightRadius={msg.role === "user" ? "0px" : "10px"}
                                                                borderTopLeftRadius={msg.role === "user" ? "10px" : "0px"}
                                                                mr={msg.role == "assistant" ? "auto" : msg.role == "loading" ? "auto" : null}
                                                                ml={msg.role == "user" ? "auto" : null}
                                                            >
                                                                <Box
                                                                    p={3}
                                                                    w="full"
                                                                    display={"flex"}
                                                                    justifyContent={
                                                                        msg.role === "assistant" ? "flex-start" : "flex-end"
                                                                    }
                                                                    mr={msg.role === "loading" ? "auto" : null}
                                                                >
                                                                    <VStack>
                                                                        {msg.role === "loading" ? (
                                                                            <Spinner size="sm" />
                                                                        ) : (
                                                                            <>
                                                                                {msg.role == "assistant" ? (
                                                                                    <>
                                                                                        {formatAIText(msg.content)}
                                                                                    </>
                                                                                ) : (
                                                                                    <>
                                                                                        {msg.content}
                                                                                    </>
                                                                                )}
                                                                            </>
                                                                        )}
                                                                    </VStack>
                                                                </Box>
                                                            </HStack>
                                                            {msg.next_question && (
                                                                <HStack
                                                                    bg={msg.role == "user" ? backgroundColor : stageOwnChatColor}
                                                                    p={2}
                                                                    borderRadius={"10px"}
                                                                    borderTopRightRadius={msg.role === "user" ? "0px" : "10px"}
                                                                    borderTopLeftRadius={msg.role === "user" ? "10px" : "0px"}
                                                                    mr={msg.role == "assistant" ? "auto" : msg.role == "loading" ? "auto" : null}
                                                                    ml={msg.role == "user" ? "auto" : null}
                                                                >
                                                                    <Box
                                                                        p={3}
                                                                        w="full"
                                                                        display={"flex"}
                                                                        justifyContent={
                                                                            msg.role === "assistant" ? "flex-start" : "flex-end"
                                                                        }
                                                                        mr={msg.role === "loading" ? "auto" : null}
                                                                    >
                                                                        {msg.next_question}
                                                                    </Box>
                                                                </HStack>
                                                            )}
                                                            {msg.quickResponses && msg.role === "assistant" && (supportFrontendHistory?.length - 1) == i ? (
                                                                <>
                                                                    {quickResponses.map((response, index) => {
                                                                        return (
                                                                            <Box key={index} w={"full"} border={`1px solid ${accentColor}`} borderRadius={"10px"} bg={"transparent"} color={bgColor} _hover={{ cursor: "pointer", bg: bgColor, color: "white" }}
                                                                                onClick={() => {
                                                                                    handleSupportGenerate(response);
                                                                                }}
                                                                            >
                                                                                <Box m={2} textAlign={"center"}>
                                                                                    {formatResponseText(response)}
                                                                                </Box>
                                                                            </Box>
                                                                        )
                                                                    })}
                                                                </>
                                                            ) : (
                                                                <></>
                                                            )}
                                                        </VStack>
                                                        {msg.role === "user" && (
                                                            <Box mb={"auto"}>
                                                                <Avatar size="sm" src={"https://picsum.photos/45/45"} />
                                                            </Box>
                                                        )}
                                                    </HStack>
                                                </HStack>
                                            )
                                        })}
                                    </>
                                ) : (
                                    <>
                                        {chatOpen && (
                                            <>
                                                <Box mx={"auto"}>
                                                    <CoftechLogo width="133px" height="132px" />
                                                </Box>

                                                <Box mx={"auto"}>
                                                    <HStack>
                                                        <Text textAlign={"center"}>
                                                            {t("prompt.supportWelcome")}
                                                            <Text as="span" color={bgColor}>
                                                                {t("prompt.bot")}
                                                            </Text>
                                                        </Text>
                                                    </HStack>
                                                </Box>

                                                <Box mx={"auto"} mt={"20px"}>
                                                    <Text textAlign={"center"} fontSize={"20px"} fontWeight={"bold"} maxW={"300px"}>
                                                        {t("prompt.question")}
                                                    </Text>
                                                </Box>
                                            </>
                                        )}
                                    </>
                                )}
                            </>
                        ) : (
                            <>
                                {chatOpen && combinedMessages.map((msg, i) => {
                                    return (
                                        <HStack
                                            key={i}
                                            align="start"
                                            w="full"
                                            justify={msg.type === "user" ? "flex-start" : "flex-end"}
                                        >
                                            <HStack
                                                w={"350px"}
                                            >
                                                {msg.type === "user" && (
                                                    <Box mb={"auto"}>
                                                        <Avatar size="sm" src={msg.avatar} />
                                                    </Box>
                                                )}
                                                <HStack
                                                    w={msg.type === "loading" ? "full" : null}
                                                    bg={msg.type === "loading" ? "transparent" : msg.type == "user" ? stageOwnChatColor : backgroundColor}
                                                    p={2}
                                                    borderRadius={"10px"}
                                                    borderTopLeftRadius={msg.type === "user" ? "0px" : "10px"}
                                                    borderTopRightRadius={msg.type === "user" ? "10px" : "0px"}
                                                    mr={msg.type == "user" ? "auto" : null}
                                                    ml={msg.type == "other" ? "auto" : null}
                                                >
                                                    <Box
                                                        p={3}
                                                        w="full"
                                                        display={"flex"}
                                                        justifyContent={
                                                            msg.type === "user" ? "flex-start" : "flex-end"
                                                        }
                                                        ml={msg.type === "loading" ? "auto" : null}
                                                    >
                                                        {msg.type === "loading" ? (
                                                            <Box ml={"auto"} p={3} px={4} borderRadius={"10px"} bg={backgroundColor} borderTopRightRadius={"0px"}>
                                                                <Spinner size="sm" />
                                                            </Box>
                                                        ) : (
                                                            msg.text
                                                        )}
                                                    </Box>
                                                </HStack>
                                                {msg.type === "other" && (
                                                    <Box mb={"auto"}>
                                                        <Avatar size="sm" src={msg.avatar} />
                                                    </Box>
                                                )}
                                            </HStack>
                                        </HStack>
                                    )
                                })}
                            </>
                        )}
                    </VStack>
                    {selected == 0 && supportEnd ? (
                        <HStack w={"full"}>
                            <Button
                                m={"auto"}
                                bg={"transparent"}
                                color={accentColor}
                                border={`1px solid ${accentColor}`}
                                borderRadius={"15px"}
                                _hover={{
                                    bg: bgColor,
                                    color: backgroundColor
                                }}
                                onClick={() => {
                                    setSupportEnd(false);
                                    setSupportHistory([
                                        {
                                            role: "assistant",
                                            content: t("prompt.question"),
                                        },
                                    ]);
                                    setSupportFrontendHistory([
                                        {
                                            role: "assistant",
                                            content: t("prompt.question"),
                                        },
                                    ])
                                    setPromptProgress("");
                                    setQuickResponses([]);
                                }}
                                w={"80%"}>
                                {t("prompt.restart")}
                            </Button>
                        </HStack>
                    ) : (
                        <InputGroup>
                            <Input
                                placeholder={t("prompt.writeMessage")}
                                value={selected == 0 ? supportMessage : testMessage}
                                onChange={selected == 0 ? (e) => setSupportMessage(e.target.value) : (e) => setTestMessage(e.target.value)}
                                focusBorderColor={accentColor}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        if (selected == 0) {
                                            handleSupportGenerate(null);
                                        } else {
                                            handleTestGenerate();
                                        }
                                    }
                                }}
                            />
                            <InputRightElement mr={2}>
                                <Button
                                    size="sm"
                                    onClick={selected == 0 ? () => handleSupportGenerate(null) : () => handleTestGenerate()}
                                    isLoading={isTestLoading}
                                    bg={"transparent"}
                                >
                                    {isTestLoading ? <Spinner size="sm" /> : <FaPaperPlane color={accentColor} />}
                                </Button>
                            </InputRightElement>
                        </InputGroup>
                    )}
                </VStack >
            </VStack >
        </>
    );
};

export default PromptChatTest;
