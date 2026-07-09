import {
  Box,
  BoxProps,
  Link,
  Text,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import React from "react";
import MessageEditedRevoked from "./MessageEditedRevoked";
import MessageCaption from "./MessageCaption";
import MessageTimeStamp from "./MessageTimeStamp";
import { MESSAGE } from "@component/constants/message";
import { Message } from "@component/types/messageType";
import { formatPhoneNumber } from "@component/utils/formatters";

interface Metadata {
  fullName: string,
  phoneInternational: string,
}

interface ContactMessageProps extends BoxProps {
  msg: Message,
}

const ContactMessage = ({ msg, ...boxProps }: ContactMessageProps) => {
  const { t } = useTranslation("common");

  const dataInfo: Metadata = msg?.metadata;

  return (
    <Box
      maxW={MESSAGE.CONTACT.WIDTH}
      p={4}
      bg={MESSAGE.CONTACT.BACKGROUND_COLOR}
      borderRadius={MESSAGE.CONTACT.BORDER_RADIUS}
      boxShadow={MESSAGE.CONTACT.SHADOW}
      border={MESSAGE.CONTACT.BORDER}
      borderColor={MESSAGE.CONTACT.BORDER_COLOR}
      id={msg?.message_id}
      {...boxProps}
    >
      <Text
        fontSize={MESSAGE.TEXT.REGULAR}
        color={MESSAGE.COLOR.DARK_GRAY}
        mb={MESSAGE.MARGIN.REGULAR}
        textTransform={MESSAGE.CONTACT.TITLE_TEXT_TRANSFORM}
        letterSpacing={MESSAGE.CONTACT.TITLE_LETTER_SPACING}
      >
        {t("chats.contact")}
      </Text>
      <Box bg={MESSAGE.CONTACT.COLOR} p={3} borderRadius={MESSAGE.CONTACT.NAME_BORDER_RADIUS} mb={4} color={MESSAGE.COLOR.TITLE_COLOR}>
        <Text fontWeight={MESSAGE.TEXT.BOLD} fontSize={MESSAGE.TEXT.LARGE} textAlign={MESSAGE.TEXT.CENTER}>
          {
            dataInfo?.fullName && dataInfo?.fullName != "null" ? dataInfo?.fullName : t("chats.noName")
          }
        </Text>
      </Box>
      {dataInfo?.phoneInternational && dataInfo?.phoneInternational != "null" ? (
        <>
          <Box display={MESSAGE.CONTACT.DESCRIPTION_DISPLAY} alignItems={MESSAGE.CONTACT.DESCRIPTION_ALIGNMENT} mb={MESSAGE.MARGIN.REGULAR}>
            <Text fontSize={MESSAGE.TEXT.REGULAR} color={MESSAGE.COLOR.BLACK} fontWeight={MESSAGE.TEXT.MEDIUM_WEIGHT} mr={MESSAGE.MARGIN.REGULAR}>
              {t("chats.phone")}:
            </Text>
            <Text fontSize={MESSAGE.TEXT.REGULAR} color={MESSAGE.COLOR.BLACK}>
              {
                formatPhoneNumber(dataInfo?.phoneInternational)
              }
            </Text>
          </Box>
          <Link
            href={`tel:${dataInfo?.phoneInternational
              }`}
            color={MESSAGE.CONTACT.COLOR}
            fontWeight={MESSAGE.TEXT.MEDIUM_WEIGHT}
            textAlign={MESSAGE.TEXT.CENTER}
            display={MESSAGE.CONTACT.BUTTON_DISPLAY}
            p={MESSAGE.PADDING.REGULAR}
            bg={MESSAGE.CONTACT.BUTTON_COLOR}
            borderRadius={MESSAGE.CONTACT.BUTTON_BORDER_RADIUS}
            _hover={{ bg: MESSAGE.CONTACT.BUTTON_HOVER_COLOR }}
            mt={MESSAGE.MARGIN.REGULAR}
          >
            {t("chats.call")}
          </Link>
        </>
      ) : (
        <Box display={MESSAGE.CONTACT.DESCRIPTION_DISPLAY} alignItems={MESSAGE.CONTACT.DESCRIPTION_ALIGNMENT} mb={MESSAGE.MARGIN.REGULAR}>
          <Text fontSize={MESSAGE.TEXT.REGULAR} color={MESSAGE.COLOR.BLACK} fontWeight={MESSAGE.TEXT.MEDIUM_WEIGHT} mr={MESSAGE.MARGIN.REGULAR}>
            {t("chats.phoneError")}
          </Text>
        </Box>
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

const equality = (prevProps: ContactMessageProps, nextProps: ContactMessageProps) => prevProps.msg.message_id === nextProps.msg.message_id && prevProps.msg.body === nextProps.msg.body

export default React.memo(ContactMessage, equality);
