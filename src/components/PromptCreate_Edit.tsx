/* eslint-disable react-hooks/exhaustive-deps */
import {
    HStack,
    Text,
    Button,
    Box,
    Input,
    VStack,
    Heading,
    useColorModeValue,
    useDisclosure,
    useToast,
    Tooltip,
} from "@chakra-ui/react";
import React, { useEffect, useState, useRef, useMemo } from "react";
import { useAuthStore } from "@component/store/auth";
import useCoftechColors from "@component/hooks/useCoftechColors";
import { useCreatePromptMutation, useSavePromptMutation } from "@component/store/RTK/promptsRTK";
import { FiUpload } from "react-icons/fi";
import PromptFilesModal from "./PromptFilesModal";
import { useLazyGetFileByCompanyQuery, useLazyGetFileDataQuery } from "@component/store/RTK/FileManager";
import { FileType } from "@component/types/fileType";
import { sanitizeHTML } from "@component/utils/sanitization";
import useErrorHandler from "@component/hooks/useErrorHandler";

interface Translation {
    (key: string, options?: Record<string, unknown>): string;
}

interface Bot {
    value: string;
    label: string;
}

interface Prompt {
    id: string;
    name: string;
    data: string;
    status: number;
}

interface PromptEdit_CreateProps {
    tran: Translation,
    prompt: Prompt | undefined,
    responseText: string,
    selectedBot: Bot | null,
    selectedCompany: string,
    setIsConfirmationOpen: (value: boolean) => void,
    setTestPrompt: (value: string) => void,
}

const PromptEdit_Create: React.FC<PromptEdit_CreateProps> = ({ tran, prompt, responseText, selectedBot, selectedCompany, setTestPrompt, setIsConfirmationOpen }) => {
    const t = tran
    const { user } = useAuthStore();
    const { handleError } = useErrorHandler();
    const [triggerUpdate] = useSavePromptMutation();
    const [triggerCreate] = useCreatePromptMutation();
    const [triggerGetFiles, { data: responseFiles, isLoading: loadingFiles }] = useLazyGetFileByCompanyQuery();
    const allowedTypes = ["png", "jpg"]
    const files: FileType[] = responseFiles?.data
    const ref = useRef<HTMLDivElement>(null);
    const placeholder = useRef<HTMLDivElement>(null);
    const [markerId, setMarkerId] = useState<string>()
    const [triggerGetURL] = useLazyGetFileDataQuery();
    const [responseBlocked, setResponseBlocked] = useState<boolean>(true)
    const {
        isOpen: isOpenModal,
        onOpen: onOpenModal,
        onClose: onCloseModal,
    } = useDisclosure();

    const fetchFiles = async () => {
        try {
            await triggerGetFiles({ companyID: selectedCompany, source: "filemanager", botID: selectedBot?.value, status: 1, extensions: allowedTypes }).unwrap()
        } catch (err) {
            handleError(err)
        }
    }

    const updateLines = () => {
        if (ref.current) {
            const style = window.getComputedStyle(ref.current);
            const lineHeight = parseFloat(style.lineHeight);
            if (placeholder.current) {
                const text = ref.current?.innerText || "";
                const chars = [...text]
                const isEmpty = chars.length <= 1 && (chars[0] == null || chars[0]?.charCodeAt(0) == 10)
                const singleLine = Math.round(ref.current.scrollHeight / lineHeight) <= 1;
                placeholder.current.textContent = isEmpty && singleLine ? t("prompt.writePrompt") : "";
            }
            setLines(() => {
                if (!lineHeight) return 1;
                return Math.round(ref.current.scrollHeight / lineHeight);
            })
        }
    }

    const {
        bgColor,
        hoverColor,
        panelBgColor,
        backgroundColor,
        descriptionColor,
        inputBorderColor,
        textColor
    } = useCoftechColors();

    const lineBgColor = useColorModeValue("rgb(242, 242, 242)", "rgb(28, 28, 28)");
    const delimiter = "~~~END~~~";

    const handleOpenModal = () => {
        if (ref.current?.innerHTML.trim() === "") {
            ref.current.innerHTML = sanitizeHTML("\u200B");
        }

        const sel = window.getSelection();
        if (!sel || sel.rangeCount === 0) return;

        const range = sel.getRangeAt(0);
        const container = range.commonAncestorContainer;

        if (!ref.current?.contains(container)) {
            onOpenModal()
            return;
        }

        const marker = document.createElement("span");
        const id = "marker-" + Date.now();
        marker.id = id;
        marker.appendChild(document.createTextNode("\u200B"));

        range.insertNode(marker);
        setMarkerId(id);
        onOpenModal()
    }

    const regularPaste = (text) => {
        const selection = window.getSelection();
        if (!selection || !selection.rangeCount) return;

        const range = selection.getRangeAt(0);
        range.deleteContents();

        const textNode = document.createTextNode(text);
        range.insertNode(textNode);

        range.setStartAfter(textNode);
        range.setEndAfter(textNode);
        selection.removeAllRanges();
        selection.addRange(range);
    }

    const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
        e.preventDefault();

        const text = e.clipboardData.getData("text/plain");

        const matches = [...text.matchAll(/\[\[([\s\S]*?)\]\]/g)].map(m => m[1]);

        if (matches?.length > 0) {
            const data = matches[0].split(/\r?\n/)

            if (data.length == 3) {
                const safeUrl = sanitizeHTML(data[1]);
                const safeFileUrl = sanitizeHTML(data[0]);
                const safeFileName = sanitizeHTML(data[2]);

                const html = `<div contenteditable="false" class="imageBox" data-file-box="true" data-image-url="${safeFileUrl}" path="${safeUrl}" style="display:inline-block;padding:0px 6px;background:${hoverColor};color:${bgColor};border-radius:6px;margin:0px 2px;cursor:pointer;user-select:none;"><span style="display:inline-block;position:absolute;width:0px;height:0px;color:transparent;top:0px;pointer-events:none">${delimiter}</span><span data-file-text="true" data-image-url="${safeFileUrl}" path="${safeUrl}" style="display:inline-block;color:${bgColor};">${safeFileName}</span><button data-file-button="true" style="display:inline-block;padding:0px 6px;color:white;cursor:pointer;user-select:none;">×</button><span data-file-link="true" style="display:inline-block;position:absolute;top:0px;cursor:pointer;pointer-events:none;color:transparent;width:200px;">[[${safeUrl}]]</span></div>`;

                const selection = window.getSelection();
                if (!selection || !selection.rangeCount) return;

                const range = selection.getRangeAt(0);
                range.deleteContents();

                const temp = document.createElement("div");
                temp.innerHTML = sanitizeHTML(html);

                const frag = document.createDocumentFragment();
                let lastNode = null;
                while (temp.firstChild) {
                    lastNode = frag.appendChild(temp.firstChild);
                }

                range.insertNode(frag);

                if (lastNode) {
                    selection.removeAllRanges();
                    range.setStartAfter(lastNode);
                    range.setEndAfter(lastNode);
                    selection.addRange(range);
                }
            } else {
                regularPaste(text)
            }
        } else {
            regularPaste(text)
        }

        updateLines()
    };

    const handleInput = (e) => {
        updateLines()
    };

    const placeCaretAtEnd = (el: HTMLElement) => {
        el.focus();
        if (typeof window.getSelection !== "undefined" && typeof document.createRange !== "undefined") {
            const range = document.createRange();
            range.selectNodeContents(el);
            range.collapse(false);
            const sel = window.getSelection();
            sel?.removeAllRanges();
            sel?.addRange(range);
        }
    }

    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (ref.current) {
            if (ref.current.contains(e.target as Node)) {
                return;
            }
            placeCaretAtEnd(ref.current);
        }
    };

    useEffect(() => {
        if (selectedCompany) {
            fetchFiles()
            if (ref.current && prompt) {
                ref.current.innerHTML = sanitizeHTML("")
                updateLines()
            }
        }
    }, [selectedCompany])

    const noImageText = useMemo(() => t("prompt.noImage"), [t]);

    const renderTextWithBoxesHTML = (text: string, filesURLs) => {

        return text.replace(/\[\[(.*?)\]\]/g, (_, url) => {
            const file = files?.filter((file) => file.path == url)[0]

            const safeUrl = sanitizeHTML(url);
            const safeFileUrl = sanitizeHTML(filesURLs[file?.id]);
            const safeFileName = sanitizeHTML(file?.name);

            if (file) {
                return `<div contenteditable="false" class="imageBox" data-file-box="true" data-image-url="${safeFileUrl}" path="${safeUrl}" style="display:inline-block;padding:0px 6px;background:${hoverColor};color:${bgColor};border-radius:6px;margin:0px 2px;cursor:pointer;user-select:none;"><span style="display:inline-block;position:absolute;width:0px;height:0px;color:transparent;top:0px;pointer-events:none">${delimiter}</span><span data-file-text="true" data-image-url="${safeFileUrl}" path="${safeUrl}" style="display:inline-block;color:${bgColor};">${safeFileName}</span><button data-file-button="true" fdprocessedid="g2516d" style="display:inline-block;padding:0px 6px;color:white;cursor:pointer;user-select:none;">×</button><span data-file-link="true" style="display:inline-block;position:absolute;top:0px;cursor:pointer;pointer-events:none;color:transparent;width:200px;">[[${safeUrl}]]</span></div>
`.replaceAll("\n", "")
            }

            return `<div contenteditable="false" class="imageBox" data-file-box="true" data-image-url="" path="${safeUrl}" style="display:inline-block;padding:0px 6px;background:darkred;color:red;border-radius:6px;margin:0px 2px;cursor:pointer;user-select:none;"><span style="display:inline-block;position:absolute;width:0px;height:0px;color:transparent;top:0px;pointer-events:none">${delimiter}</span><span data-file-text="true" data-image-url="" path="${safeUrl}" style="display:inline-block;color:red;">${noImageText}</span><button data-file-button="true" fdprocessedid="g2516d" style="display:inline-block;padding:0px 6px;color:white;cursor:pointer;user-select:none;">×</button><span data-file-link="true" style="display:inline-block;position:absolute;top:0px;cursor:pointer;pointer-events:none;color:transparent;width:200px;">[[${safeUrl}]]</span></div>
`.replaceAll("\n", "")

        });
    }

    useEffect(() => {
        let cancelled = false;
        const run = async () => {
            try {
                const filesURLs: Record<string, string> = {};

                const uniqueFiles = Array.from(
                    new Map(files.map((file) => [file.path, file])).values()
                );

                if (cancelled) return;
                if (uniqueFiles.length > 0) {
                    const results = await Promise.allSettled(
                        uniqueFiles.map(async (file) => {
                            const response = await triggerGetURL({
                                companyID: file?.company_id,
                                fileID: file?.uuid_unique,
                            }).unwrap();

                            return { id: file?.id, url: response?.data?.url };
                        })
                    );

                    if (cancelled) return;

                    let errored = false
                    for (const result of results) {
                        if (cancelled) return;
                        if (result.status === "fulfilled") {
                            const { id, url } = result.value;
                            filesURLs[id] = url;
                        } else {
                            if (!errored) {
                                errored = true
                                handleError(result.reason)
                            }
                        }
                    }

                    if (cancelled) return;

                    if (ref.current) {
                        ref.current.innerHTML = sanitizeHTML(
                            renderTextWithBoxesHTML(prompt.data, filesURLs)
                        );
                    }
                } else if (ref.current) {
                    ref.current.innerHTML = sanitizeHTML(prompt.data);
                }

                updateLines();

                await new Promise(requestAnimationFrame);
                if (cancelled) return;

                const promptRaw = ref.current?.innerText ?? "";
                const { finalPrompt, filteredMatches } = processPrompt(promptRaw);

                if (!cancelled && validatePrompt(finalPrompt, filteredMatches, true)) {
                    setTestPrompt(finalPrompt);
                }

            } catch (err) {
                handleError(err)
            } finally {
                if (!cancelled) setResponseBlocked(false);
            }
        };

        if (prompt && files) {
            run();
        } else {
            setResponseBlocked(false);
        }

        return () => { cancelled = true; };
    }, [prompt, responseFiles, noImageText]);

    useEffect(() => {
        if (prompt != undefined) {
            setPromptName(prompt.name)
        }
    }, [prompt])

    useEffect(() => {
        if (ref.current && !responseBlocked) {
            ref.current.innerHTML = sanitizeHTML(responseText)
            updateLines()

            ref.current.scrollTo({
                top: 99999999,
                behavior: "auto",
            });
        }
    }, [responseText])


    const [promptName, setPromptName] = useState<string>("")
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [lines, setLines] = useState<number>(1)

    const processPrompt = (promptRaw: string): { finalPrompt: string; filteredMatches: string[] } => {

        let finalPrompt = promptRaw


        while (finalPrompt.indexOf(delimiter) != -1) {
            let firstIndex = finalPrompt.indexOf(delimiter)
            let lastIndex = finalPrompt.indexOf("[", firstIndex)

            let subset1 = finalPrompt.substring(0, firstIndex)

            let split = subset1.split("\n")
            if (split[split.length - 1].length == 0) {
                split.pop()
            }
            let subset1_2 = split.join("\n")

            let subset2 = finalPrompt.substring(lastIndex - 1).trimStart()
            let subset3 = subset2.replace("\n", "")

            finalPrompt = `${subset1_2}\u200B${subset3}`
        }

        const matches = finalPrompt.match(/\[\[.*?\]\]/g);

        let dummyArray = []
        const filteredMatches = matches?.filter((match) => {
            if (!(dummyArray.includes(match))) {
                dummyArray.push(match)
                return match
            }
        })

        return { finalPrompt, filteredMatches };
    };

    const validatePrompt = (finalPrompt: string, filteredMatches: string[] | undefined, silent = false): boolean => {
        const companyID = selectedCompany
            ? selectedCompany
            : user?.company_id;

        if (!companyID || !selectedBot || !promptName || (filteredMatches && filteredMatches.length > 50) || (!finalPrompt || finalPrompt.replace(/\s+/gu, "").length === 0)) {
            let message = "";
            let code = "";
            if (!companyID) {
                code = "selectCompany"
                message = t("errors.selectCompany");
            } else if (!selectedBot) {
                code = "selectBot"
                message = t("errors.selectBot");
            } else if (!promptName) {
                code = "enterPromptName"
                message = t("errors.enterPromptName");
            } else if (!finalPrompt || finalPrompt.replace(/\s+/gu, "").length === 0) {
                code = "emptyPrompt"
                message = t("errors.emptyPrompt");
            } else if (filteredMatches && filteredMatches.length > 50) {
                code = "maxFiles"
                message = t("errors.maxFiles");
            }
            if (!silent) {
                handleError({ code, message });
            }
            return false;
        }
        return true;
    };


    const handleSavePrompt = async () => {

        const promptRaw: string = ref.current?.innerText;
        const { finalPrompt, filteredMatches } = processPrompt(promptRaw)

        if (!validatePrompt(finalPrompt, filteredMatches)) {
            return;
        }

        setTestPrompt(finalPrompt)
        setIsLoading(true);
        try {
            await triggerUpdate({
                companyID: selectedCompany,
                botID: selectedBot?.value,
                promptID: prompt.id,
                data: {
                    name: promptName,
                    data: finalPrompt,
                    status: prompt.status === 1,
                }
            }).unwrap();
            setIsConfirmationOpen(true);
        } catch (error) {
            handleError(error)
        } finally {
            setIsLoading(false);
        }
    };


    const handleCreatePrompt = async () => {

        const promptRaw: string = ref.current?.innerText;
        const { finalPrompt, filteredMatches } = processPrompt(promptRaw)

        if (!validatePrompt(finalPrompt, filteredMatches)) {
            return;
        }

        setIsLoading(true);
        try {
            await triggerCreate({
                companyID: selectedCompany,
                botID: selectedBot?.value,
                data: {
                    name: promptName,
                    data: finalPrompt,
                    type: 0
                }
            }).unwrap();
            setIsConfirmationOpen(true);
        } catch (error) {
            handleError(error)
        } finally {
            setIsLoading(false);
        }
    };

    const toast = useToast();

    useEffect(() => {
        let tooltip = null;

        const handleMouseEnter = (e) => {
            if (e.target.tagName === 'DIV' && e.target.hasAttribute('data-file-box')) {

                const imageUrl = e.target.getAttribute('data-image-url');

                if (imageUrl) {
                    tooltip = document.createElement('div');
                    tooltip.style.cssText = `
                    position: absolute;
                    background: white;
                    border: 4px solid ${descriptionColor};
                    border-radius: 4px;
                    padding: 8px;
                    z-index: 1000;
                    max-width: 200px;
                `;

                    const img = document.createElement('img');
                    img.src = imageUrl;
                    img.alt = imageUrl;
                    img.style.cssText = `
                    max-width: 180px;
                    max-height: 150px;
                    display: block;
                `;

                    const caption = document.createElement('div');
                    caption.textContent = imageUrl;
                    caption.style.cssText = `
                    margin-top: 8px;
                    font-size: 12px;
                    color: #64748B;
                    text-align: center;
                `;

                    tooltip.appendChild(img);
                    document.body.appendChild(tooltip);

                    const rect = e.target.getBoundingClientRect();
                    const toolTipWidth = tooltip.getBoundingClientRect().width;
                    tooltip.style.top = `${rect.bottom + window.scrollY + 5}px`;
                    tooltip.style.left = `${rect.left + window.scrollX + (toolTipWidth / 2 >= 26 ? (rect.width / 2) - (toolTipWidth / 2) : 0)}px`;
                }
            }
        };
        const handleMouseLeave = (e) => {
            if (tooltip) {
                tooltip.remove();
                tooltip = null;
            }
        };
        const handleCopy = async (data) => {
            try {
                await navigator.clipboard.writeText(data);
                if (!(toast.isActive(19))) {
                    toast({
                        id: 19,
                        title: t("fileManager.success"),
                        description: t("prompt.imageCopiedSuccess"),
                        status: "success",
                        duration: 2000,
                        isClosable: true,
                    })
                }
            } catch (err) {
                if (!(toast.isActive(19))) {
                    toast({
                        id: 19,
                        title: t("recovery.error"),
                        description: t("prompt.imageCopiedFailed"),
                        status: "error",
                        duration: 2000,
                        isClosable: true,
                    })
                }
                console.error(err)
            }
        }
        const handleClick = (e) => {
            if (e.target.tagName === 'BUTTON' && e.target.hasAttribute('data-file-button')) {
                e.preventDefault();
                e.stopPropagation();

                if (tooltip) {
                    tooltip.remove();
                    tooltip = null;
                }
                e.target.parentElement.remove()
                updateLines()
            } else if (e.target.tagName === 'SPAN' && e.target.hasAttribute('data-file-text')) {
                const imageUrl = e.target.getAttribute('data-image-url');
                const pathUrl = e.target.getAttribute('path');
                const name = e.target.textContent
                handleCopy(`[[${imageUrl}\n${pathUrl}\n${name}]]`)
            }
        }

        const currentRef = ref.current;
        if (currentRef) {
            currentRef.addEventListener('click', handleClick);
            currentRef.addEventListener('mouseenter', handleMouseEnter, true);
            currentRef.addEventListener('mouseleave', handleMouseLeave, true);
        }

        return () => {
            if (currentRef) {
                currentRef.removeEventListener('click', handleClick);
                currentRef.removeEventListener('mouseenter', handleMouseEnter, true);
                currentRef.removeEventListener('mouseleave', handleMouseLeave, true);
            }
            if (tooltip) {
                tooltip.remove();
            }
        };
    }, [ref]);

    useEffect(() => {
        if (placeholder.current) {
            placeholder.current.textContent = sanitizeHTML(t("prompt.writePrompt"))
        }
    }, [])

    const lineNumberRef = useRef(null);

    const handleScroll = () => {
        if (lineNumberRef.current && ref.current) {
            lineNumberRef.current.scrollTop = ref.current.scrollTop;
        }
    };

    return (
        <>
            <PromptFilesModal
                isOpen={isOpenModal}
                botID={selectedBot?.value}
                company={selectedCompany}
                textRef={ref}
                onClose={onCloseModal}
                files={files}
                loadingFiles={loadingFiles}
                markerId={markerId}
                allowedTypes={allowedTypes}
                updateLines={updateLines}
            />
            <VStack
                spacing={4}
                w="full"
                px={{ base: 4, md: 8 }}
                py={6}
                bg={panelBgColor}
                boxShadow="md"
                borderRadius="md"
                height="600px"
            >
                <HStack
                    spacing={4}
                    w="full"
                    mb={4}
                    display={"flex"}
                    justifyContent={"space-between"}
                >
                    <Heading size="md" textAlign="left">
                        {t("prompt.title")}
                    </Heading>
                </HStack>
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
                        value={promptName}
                        onChange={(e) => setPromptName(e.target.value)}
                    />
                    <Text fontSize={16} fontWeight="500" color={descriptionColor}>
                        {t("prompt.autoPromptDescription")}
                    </Text>
                    <HStack h={"240px"} w={"full"} gap={0} bg={lineBgColor} borderRadius={"7px"}>
                        <Box h={"full"} w={"60px"} px={3} py={"9.5px"} overflowY={"hidden"} ref={lineNumberRef} onScroll={() => { }} sx={{
                            scrollbarWidth: 'none',
                            msOverflowStyle: 'none',
                            '&::-webkit-scrollbar': {
                                display: 'none',
                            },
                        }}>
                            {Array.from({ length: lines || 1 }, (_, i) => (
                                <Text key={i} h="2em" w={"full"} textAlign={"center"} color={descriptionColor}>{i < 9 ? `0${i + 1}` : (i + 1)}</Text>
                            ))}
                        </Box>
                        <HStack width={"full"} height={"full"} border={"1px solid transparent"} borderRightRadius={"md"} onClick={handleClick} _hover={{ border: `1px solid ${bgColor}`, cursor: "text" }}>
                            <Box w={"full"} height={"full"}>
                                <Box
                                    ref={ref}
                                    width={"inherit"}
                                    mr={"2px"}
                                    mb={"auto"}
                                    whiteSpace={"pre-wrap"}
                                    wordBreak={"break-word"}
                                    contentEditable
                                    onScroll={handleScroll}
                                    px={2}
                                    py={1}
                                    onInput={handleInput}
                                    maxH={"225px"}
                                    borderRadius="md"
                                    overflowY="auto"
                                    lineHeight="2em"
                                    onPaste={handlePaste}
                                    _focus={{
                                        outline: "none",
                                        borderColor: "none",
                                        boxShadow: `0 0 0 1px transparent`,
                                    }}
                                />
                                {true && (
                                    <Box ref={placeholder} style={{ pointerEvents: "none", color: descriptionColor, position: "relative", bottom: 32, left: 10, width: "200px" }} />
                                )}
                            </Box>
                        </HStack>
                    </HStack>
                    <HStack w={"full"}>
                        <Tooltip label={t("fileManager.serviceDisabled")} placement="top">
                            <Button
                                bg={backgroundColor}
                                color={textColor}
                                mr={"auto"}
                                borderRadius={"20px"}
                                border={`2px dashed ${bgColor}`}
                                py={6}
                                w="230px"
                                _hover={{ bg: hoverColor }}
                                onClick={() => { handleOpenModal() }}
                                isDisabled={true}
                                opacity={0.6}
                                cursor="not-allowed"
                            >
                                <Box mr={"20px"}>
                                    <FiUpload color={bgColor} size={"30px"} />
                                </Box>
                                {t("prompt.embedImage")}
                            </Button>
                        </Tooltip>
                        <Button
                            bg={bgColor}
                            borderRadius={"50px"}
                            color={panelBgColor}
                            ml={"auto"}
                            py={6}
                            w="200px"
                            _hover={{ bg: hoverColor }}
                            onClick={() => {
                                if (prompt != undefined) {
                                    handleSavePrompt()
                                } else {
                                    handleCreatePrompt()
                                }
                            }}
                            isLoading={isLoading}
                            isDisabled={!selectedBot}
                        >
                            {prompt != undefined ? t("prompt.savePrompt") : t("prompt.create")}
                        </Button>
                    </HStack>
                </VStack>
            </VStack>
        </>
    );
};

export default PromptEdit_Create;
