import {
  Box,
  BoxProps,
  Text,
} from "@chakra-ui/react";
import useCoftechColors from "@component/hooks/useCoftechColors";
import React from "react";
import MessageCaption from "./MessageCaption";
import MessageEditedRevoked from "./MessageEditedRevoked";
import MessageTimeStamp from "./MessageTimeStamp";
import { MESSAGE } from "@component/constants/message";
import { Message } from "@component/types/messageType";

interface DefaultMessageProps extends BoxProps {
  msg: Message,
}

const DefaultMessage = ({ msg, ...boxProps }: DefaultMessageProps) => {

  const { descriptionColor, textColor } = useCoftechColors();

  return (
    <Box w={MESSAGE.DEFAULT.WIDTH} id={msg?.message_id} { ...boxProps }>
      <Text
        fontSize={MESSAGE.TEXT.REGULAR}
        fontWeight={MESSAGE.TEXT.MEDIUM_WEIGHT}
        whiteSpace={MESSAGE.TEXT.WHITE_SPACE}
        color={msg.via === MESSAGE.SEND ? textColor : descriptionColor}
      >
        {msg.body}
      </Text>
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

const equality = (prevProps: DefaultMessageProps, nextProps: DefaultMessageProps) => prevProps.msg.message_id === nextProps.msg.message_id && prevProps.msg.body === nextProps.msg.body

export default React.memo(DefaultMessage, equality);
