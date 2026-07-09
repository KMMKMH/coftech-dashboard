import {
  Box,
  BoxProps,
  Img,
  useBreakpointValue,
} from "@chakra-ui/react";
import React from "react";
import MessageCaption from "./MessageCaption";
import MessageEditedRevoked from "./MessageEditedRevoked";
import MessageTimeStamp from "./MessageTimeStamp";
import { MESSAGE } from "@component/constants/message";
import { Message } from "@component/types/messageType";
import { useBase64ToBlobUrl } from "@component/utils/mediaUtils";

interface ImageMessageProps extends BoxProps {
  msg: Message,
  handleImageClick: (imageUrl: string) => void
}

const ImageMessage = ({ msg, handleImageClick, ...boxProps }: ImageMessageProps) => {

  const isMobile = useBreakpointValue({ base: true, md: false });

  const imageURL = useBase64ToBlobUrl(msg.body, msg?.metadata?.mimetype || "image/png")

  return (
    <Box maxW={MESSAGE.IMAGE.WIDTH} id={msg?.message_id} {...boxProps}>
      <Img
        src={imageURL}
        alt="media"
        m={MESSAGE.MARGIN.AUTO}
        style={{ width: MESSAGE.WIDTH.AUTO, maxHeight: isMobile ? MESSAGE.IMAGE.MAX_HEIGHT_1 : MESSAGE.IMAGE.MAX_HEIGHT_2, height: MESSAGE.HEIGHT.AUTO }}
        onClick={() =>
          handleImageClick(imageURL)
        }
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

const equality = (prevProps: ImageMessageProps, nextProps: ImageMessageProps) => prevProps.msg.message_id === nextProps.msg.message_id && prevProps.msg.body === nextProps.msg.body

export default React.memo(ImageMessage, equality);
