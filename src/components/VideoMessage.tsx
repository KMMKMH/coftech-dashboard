import {
  Box,
  BoxProps,
} from "@chakra-ui/react";
import React from "react";
import MessageEditedRevoked from "./MessageEditedRevoked";
import MessageTimeStamp from "./MessageTimeStamp";
import MessageCaption from "./MessageCaption";
import { MESSAGE } from "@component/constants/message";
import { Message } from "@component/types/messageType";
import { useBase64ToBlobUrl } from "@component/utils/mediaUtils";

interface VideoMessageProps extends BoxProps {
  msg: Message,
}

const VideoMessage = ({ msg, ...boxProps }: VideoMessageProps) => {
  const base64Content = msg?.body || "";
  const videoURL = useBase64ToBlobUrl(base64Content, msg?.metadata?.mimetype || "video/mp4")

  return (
    <Box w={MESSAGE.VIDEO.WIDTH} id={msg?.message_id} {...boxProps}>
      <video
        src={videoURL}
        width={MESSAGE.WIDTH.FULL}
        height={MESSAGE.HEIGHT.AUTO}
        controls
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

const equality = (prevProps: VideoMessageProps, nextProps: VideoMessageProps) => prevProps.msg.message_id === nextProps.msg.message_id && prevProps.msg.body === nextProps.msg.body

export default React.memo(VideoMessage, equality);
