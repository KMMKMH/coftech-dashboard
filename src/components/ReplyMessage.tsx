import {
  Box,
  HStack,
  Icon,
  IconButton,
  Textarea,
  useToast,
  VStack,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import { FaPaperPlane } from "react-icons/fa";
import { useEffect, useRef, useState } from "react";
import useCoftechColors from "@component/hooks/useCoftechColors";
import FilePreview from "./FilePreview";

export default function ReplyMessage({ t, socket, botID, phone }) {
  const [message, setMessage] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const toast = useToast();

  const {
    bgColor,
    hoverColor,
    backgroundColor,
    borderColor,
    textColor,
    descriptionColor,
  } = useCoftechColors();

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "40px";
      textarea.style.height = textarea.scrollHeight + "px";
    }
  }, [message]);

  const isAllowedType = (type: string) => {
    return (
      type.startsWith("image/") ||
      [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/zip",
        "application/x-rar-compressed",
        "application/x-zip-compressed",
      ].includes(type)
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files ?? []);

    const validFiles = newFiles.filter((file) => {
      const isAllowed = isAllowedType(file.type);
      if (!isAllowed) {
        toast({
          title: t("chats.invalidFileType"),
          description: t("chats.unsupportedFileType", { type: file.type }),
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
      return isAllowed;
    });

    const uniqueNewFiles = validFiles.filter((newFile) => {
      return !selectedFiles.some(
        (existingFile) =>
          existingFile.name === newFile.name &&
          existingFile.size === newFile.size &&
          existingFile.type === newFile.type
      );
    });

    const totalFiles = selectedFiles.length + uniqueNewFiles.length;

    if (totalFiles > 2) {
      toast({
        title: t("chats.warning"),
        description: t("chats.maxFiles", { count: 2 }),
        status: "warning",
        duration: 3000,
        isClosable: true,
      });

      const allowedNewFiles = uniqueNewFiles.slice(0, 2 - selectedFiles.length);
      setSelectedFiles((prev) => [...prev, ...allowedNewFiles]);
    } else {
      setSelectedFiles((prev) => [...prev, ...uniqueNewFiles]);
    }

    e.target.value = "";
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const fileToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        const base64 = result.split(",")[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const handleSend = async () => {
    const isMedia = selectedFiles.length > 0;

    if (!message.trim() && !isMedia) {
      toast({
        title: t("chats.emptyMessage"),
        description: t("chats.writeMessageOrAttachFile"),
        status: "warning",
        duration: 2000,
        isClosable: true,
      });
      return;
    }

    let payload: any = {
      botID,
      phone: phone,
      isMedia,
    };

    if (isMedia) {
      const filesToSend = selectedFiles.slice(0, 2);
      const media = await Promise.all(
        filesToSend.map(async (file) => ({
          base64: await fileToBase64(file),
          mimeType: file.type,
          fileName: file.name,
          caption: message || undefined,
        }))
      );
      payload.media = media;
    } else {
      payload.message = message.trim();
    }

    socket.emit("message:send", payload);
    setMessage("");
    setSelectedFiles([]);
  };

  return (
    <Box w="full" position="relative">
      <Icon
        as={FaPaperPlane}
        boxSize={5}
        color={bgColor}
        position="absolute"
        top={5}
        right={5}
        zIndex={10}
        cursor="pointer"
        onClick={handleSend}
      />

      <HStack align="flex-start" mr={1}>
        <IconButton
          aria-label={t("chats.attach")}
          icon={<AddIcon />}
          bg={bgColor}
          color="white"
          onClick={() => fileInputRef.current?.click()}
          _hover={{
            bg: hoverColor,
          }}
        />

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: "none" }}
          multiple
        />

        <VStack
          align="start"
          borderWidth="1px"
          borderRadius="md"
          p={3}
          spacing={2}
          flex="1"
          position="relative"
          background={backgroundColor}
        >
          {selectedFiles.length > 0 && (
            <Wrap w="100%">
              {selectedFiles.map((file, index) => (
                <WrapItem key={index}>
                  <FilePreview
                    file={file}
                    onRemove={() => handleRemoveFile(index)}
                  />
                </WrapItem>
              ))}
            </Wrap>
          )}

          <Textarea
            ref={textareaRef}
            pl={0}
            placeholder={t("chats.writeMessage")}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            minH={10}
            resize="none"
            overflow="hidden"
            focusBorderColor="transparent"
            border="none"
            bg="transparent"
            _placeholder={{ color: "gray.400" }}
            _focus={{
              border: "none",
              boxShadow: "none",
            }}
          />
        </VStack>
      </HStack>
    </Box>
  );
}
