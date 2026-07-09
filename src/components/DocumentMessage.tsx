import {
  Box,
  Text,
  Button,
  HStack,
  BoxProps,
  VStack,
  useToken,
} from "@chakra-ui/react";
import useCoftechColors from "@component/hooks/useCoftechColors";
import React from "react";
import MessageCaption from "./MessageCaption";
import MessageEditedRevoked from "./MessageEditedRevoked";
import MessageTimeStamp from "./MessageTimeStamp";
import { MESSAGE } from "@component/constants/message";
import { Message } from "@component/types/messageType";
import { useBase64ToBlobUrl } from "@component/utils/mediaUtils";
import { File04 } from "@untitled-ui/icons-react";
import { useTranslation } from "react-i18next";

interface Metadata {
  filename: string,
  mimetype: string,
  filesize: string,
}

interface DocumentMessageProps extends BoxProps {
  msg: Message,
}

const DocumentMessage = ({ msg, ...boxProps }: DocumentMessageProps) => {
  const { t } = useTranslation("common");

  const dataInfo: Metadata = msg?.metadata;

  const strippedFileName = `${dataInfo?.filename?.substring(0, MESSAGE.DOCUMENT.NAME_MAX_LENGTH)}...`

  const documentURL = useBase64ToBlobUrl(msg.body, dataInfo?.mimetype || "application/octet-stream")

  const { descriptionColor, textColor, bgColor } = useCoftechColors();

  const [accentColor] = useToken('colors', [bgColor])

  const handleDownload = (filename) => {
    const link = document.createElement("a");
    link.href = documentURL;
    link.download = filename;
    link.click();
  };

  return (
    <Box id={msg?.message_id} {...boxProps}>
      <Box textAlign={MESSAGE.TEXT.CENTER} my={MESSAGE.MARGIN.LARGE} overflow={MESSAGE.DOCUMENT.OVERFLOW}>
        <Button
          size={MESSAGE.DOCUMENT.SIZE}
          variant={MESSAGE.DOCUMENT.BUTTON_VARIANT}
          fontSize={MESSAGE.TEXT.REGULAR}
          onClick={() => handleDownload(dataInfo?.filename)}
          _hover={MESSAGE.DOCUMENT.HOVER}
        >
          <HStack w={MESSAGE.WIDTH.FULL}>
            <File04 width={MESSAGE.WIDTH.PERCENT_100} height={MESSAGE.DOCUMENT.ICON_HEIGHT} color={accentColor}/>
            <VStack w={MESSAGE.WIDTH.FULL} m={MESSAGE.MARGIN.SMALL}>
              {dataInfo?.filename && dataInfo?.filename != "null" ? (
                <Text color={textColor} textAlign={MESSAGE.TEXT.START} w={MESSAGE.WIDTH.FULL} fontWeight={MESSAGE.TEXT.NORMAL_WEIGHT}>{dataInfo?.filename.length > MESSAGE.DOCUMENT.NAME_MAX_LENGTH ? strippedFileName : dataInfo?.filename}</Text>
              ) : (
                <Text color={textColor} textAlign={MESSAGE.TEXT.START} w={MESSAGE.WIDTH.FULL} fontWeight={MESSAGE.TEXT.NORMAL_WEIGHT}>{t("chats.noName")}</Text>
              )}
              <Text color={descriptionColor} textAlign={MESSAGE.TEXT.START} w={MESSAGE.WIDTH.FULL} fontWeight={MESSAGE.TEXT.NORMAL_WEIGHT} textTransform={MESSAGE.DOCUMENT.FORMAT_TRANSFOME}>{dataInfo?.mimetype?.split(MESSAGE.DOCUMENT.SPLITTING_TOKEN)[1]}</Text>
            </VStack>
          </HStack>
        </Button>
      </Box>
      <MessageCaption
        msg={msg}
      />
      <MessageTimeStamp
        msg={msg}
      />
      <MessageEditedRevoked
        msg={msg}
      />
    </Box>
  )
};

const equality = (prevProps: DocumentMessageProps, nextProps: DocumentMessageProps) => prevProps.msg.message_id === nextProps.msg.message_id && prevProps.msg.body === nextProps.msg.body

export default React.memo(DocumentMessage, equality);
