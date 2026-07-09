import {
  Box,
  BoxProps,
  Link,
  Text,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import React from "react";
import MessageTimeStamp from "./MessageTimeStamp";
import MessageCaption from "./MessageCaption";
import MessageEditedRevoked from "./MessageEditedRevoked";
import { MESSAGE } from "@component/constants/message";
import { Message } from "@component/types/messageType";
import { formatDate2 } from "@component/utils/formatters";

interface Metadata {
  description: string,
  name: string,
  start: string,
  end: string,
  link: string,
  location: string
}

interface EventMessageProps extends BoxProps {
  msg: Message,
}

const EventMessage = ({ msg, ...boxProps }: EventMessageProps) => {
  const { t } = useTranslation("common");

  const dataInfo: Metadata = msg?.metadata;

  return (
    <Box
      maxW={MESSAGE.EVENT.WIDTH}
      p={4}
      bg={MESSAGE.EVENT.BACKGROUND_COLOR}
      borderRadius={MESSAGE.EVENT.BORDER_RADIUS}
      boxShadow={MESSAGE.EVENT.SHADOW}
      border={MESSAGE.EVENT.BORDER}
      borderColor={MESSAGE.EVENT.BORDER_COLOR}
      id={msg?.message_id}
      {...boxProps}
    >
      <Text
        fontSize={MESSAGE.TEXT.REGULAR}
        color={MESSAGE.COLOR.DARK_GRAY}
        mb={MESSAGE.MARGIN.REGULAR}
        textTransform={MESSAGE.EVENT.TITLE_TEXT_TRANSFORM}
        letterSpacing={MESSAGE.EVENT.TITLE_LETTER_SPACING}
      >
        {t("chats.event")}
      </Text>
      <Box bg={MESSAGE.EVENT.COLOR} p={MESSAGE.PADDING.REGULAR} borderRadius={MESSAGE.EVENT.NAME_BORDER_RADIUS} mb={4} color={MESSAGE.COLOR.TITLE_COLOR}>
        <Text fontWeight={MESSAGE.TEXT.BOLD} fontSize={MESSAGE.TEXT.LARGE} textAlign={MESSAGE.TEXT.CENTER}>
          {
            dataInfo?.name && dataInfo?.name != "null" ? dataInfo.name : t("chats.noName")
          }
        </Text>
      </Box>
      <Box display={MESSAGE.EVENT.DESCRIPTION_DISPLAY} flexDirection={MESSAGE.EVENT.DESCRIPTION_FLEX_DIRECTION} alignItems={MESSAGE.EVENT.DESCRIPTION_ALIGNMENT} mb={MESSAGE.MARGIN.REGULAR}>
        {dataInfo?.description && dataInfo?.description != "null" && (
          <Text fontSize={MESSAGE.TEXT.LARGE} color={MESSAGE.COLOR.BLACK}>
            {
              dataInfo?.description
            }
          </Text>
        )}
        {dataInfo?.start && dataInfo?.start != "null" && (
          <Text fontSize={MESSAGE.TEXT.REGULAR} color={MESSAGE.COLOR.BLACK}>
            {formatDate2(dataInfo?.start)} {dataInfo?.end && dataInfo?.end != "null" ? `- ${formatDate2(dataInfo?.end)}` : ""}
          </Text>
        )}
        {dataInfo?.location && dataInfo?.location != "null" && (
          <Text fontSize={MESSAGE.TEXT.REGULAR} color={MESSAGE.COLOR.BLACK}>
            {dataInfo?.location}
          </Text>
        )}
      </Box>
      {dataInfo?.link && dataInfo?.link.length > 0 && dataInfo?.link != "null" && (
        <Link
          href={`${dataInfo?.link}`}
          color={MESSAGE.EVENT.COLOR}
          fontWeight={MESSAGE.TEXT.MEDIUM_WEIGHT}
          textAlign={MESSAGE.TEXT.CENTER}
          display={MESSAGE.EVENT.BUTTON_DISPLAY}
          p={MESSAGE.PADDING.REGULAR}
          bg={MESSAGE.EVENT.BUTTON_COLOR}
          borderRadius={MESSAGE.EVENT.BUTTON_BORDER_RADIUS}
          _hover={{ bg: MESSAGE.EVENT.BUTTON_HOVER_COLOR }}
          mt={MESSAGE.MARGIN.REGULAR}
        >
          {t("chats.join")}
        </Link>
      )}
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
  );
};

const equality = (prevProps: EventMessageProps, nextProps: EventMessageProps) => prevProps.msg.message_id === nextProps.msg.message_id && prevProps.msg.body === nextProps.msg.body

export default React.memo(EventMessage, equality);
