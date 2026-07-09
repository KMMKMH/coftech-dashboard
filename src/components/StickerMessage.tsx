import {
  Box,
  BoxProps,
  Img,
} from "@chakra-ui/react";
import React from "react";
import MessageTimeStamp from "./MessageTimeStamp";
import MessageCaption from "./MessageCaption";
import MessageEditedRevoked from "./MessageEditedRevoked";
import { MESSAGE } from "@component/constants/message";
import { Message } from "@component/types/messageType";
import { useBase64ToBlobUrl } from "@component/utils/mediaUtils";

interface StickerMessageProps extends BoxProps {
  msg: Message
}

const StickerMessage = ({ msg, ...boxProps }: StickerMessageProps) => {

  const stickerURL = useBase64ToBlobUrl(msg.body, msg?.metadata?.mimetype || "image/webp")

  return (
    <Box
      maxW={MESSAGE.STICKER.WIDTH}
      borderRadius={MESSAGE.STICKER.BORDER}
      overflow={MESSAGE.STICKER.OVERFLOW}
      bg={MESSAGE.COLOR.GRAY}
      p={MESSAGE.PADDING.REGULAR}
      boxShadow={MESSAGE.STICKER.SHADOW}
      id={msg?.message_id}
      {...boxProps}
    >
      <Img
        src={stickerURL}
        alt="sticker"
        style={{ width: MESSAGE.WIDTH.FULL, height: MESSAGE.HEIGHT.AUTO }}
      />
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

const equality = (prevProps: StickerMessageProps, nextProps: StickerMessageProps) => prevProps.msg.message_id === nextProps.msg.message_id && prevProps.msg.body === nextProps.msg.body

export default React.memo(StickerMessage, equality);
