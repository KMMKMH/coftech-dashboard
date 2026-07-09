import {
  HStack,
  Icon,
  Text,
  VStack,
  CloseButton,
  Image,
} from "@chakra-ui/react";
import useCoftechColors from "@component/hooks/useCoftechColors";
import { File04 } from "@untitled-ui/icons-react";
import {
  FaFileAlt,
  FaFileImage,
  FaFileVideo,
  FaFileArchive,
  FaFileWord,
  FaFileExcel,
} from "react-icons/fa";

type Props = {
  file: File;
  onRemove: () => void;
};

const getFileIcon = (type: string) => {
  if (type.startsWith("image/")) return FaFileImage;
  if (type === "application/pdf") return File04;
  if (type.startsWith("video/")) return FaFileVideo;
  if (type.includes("zip") || type.includes("rar")) return FaFileArchive;
  if (type.includes("msword") || type.includes("word")) return FaFileWord;
  if (type.includes("excel") || type.includes("spreadsheet"))
    return FaFileExcel;

  return FaFileAlt;
};

export default function FilePreview({ file, onRemove }: Props) {
  const {
    bgColor,
    hoverColor,
    panelBgColor,
    backgroundColor,
    descriptionColor,
    borderColor,
    textColor,
    inTextColor,
  } = useCoftechColors();

  const IconComponent = getFileIcon(file.type);

  const isImage = file.type.startsWith("image/");

  return (
    <HStack
      spacing={3}
      px={3}
      py={2}
      borderRadius="md"
      border="1px solid"
      boxShadow="sm"
      align="center"
      w="100%"
      bg={backgroundColor}
      borderColor={borderColor}
    >
      <Icon as={IconComponent} boxSize={10} color={bgColor} />

      <VStack align="start" spacing={0} flex="1">
        <Text fontSize="sm" fontWeight="medium" color={textColor} noOfLines={1}>
          {file.name}
        </Text>
        <Text fontSize="xs" color={descriptionColor} textTransform="uppercase">
          {file?.type?.split("/")[1]}
        </Text>
      </VStack>

      {isImage && (
        <Image
          src={URL.createObjectURL(file)}
          alt={file.name}
          boxSize="40px"
          objectFit="cover"
          borderRadius="md"
        />
      )}

      <CloseButton
        size="sm"
        onClick={onRemove}
        bg={bgColor}
        _hover={{
          bg: hoverColor,
        }}
      />
    </HStack>
  );
}
