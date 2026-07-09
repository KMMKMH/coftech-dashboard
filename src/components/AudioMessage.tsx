import {
  Box,
  Text,
  Button,
  HStack,
  Avatar,
  Input,
  VStack,
  BoxProps,
} from "@chakra-ui/react";
import Image from "next/image";
import useCoftechColors from "@component/hooks/useCoftechColors";
import { FaPause, FaPlay } from "react-icons/fa";
import React from "react";
import MessageCaption from "./MessageCaption";
import MessageTimeStamp from "./MessageTimeStamp";
import MessageEditedRevoked from "./MessageEditedRevoked";
import { MESSAGE } from "@component/constants/message";
import useAudioPlayer from "@component/hooks/useAudioPlayer";
import { Message } from "@component/types/messageType";
import { useBase64ToBlobUrl } from "@component/utils/mediaUtils";
import { formatTime } from "@component/utils/formatters";
import { useError } from "@component/utils/errorContext";
import { i18n } from "next-i18next";

interface AudioMessageProps extends BoxProps {
  msg: Message,
  userAvatar: string,
  botAvatar: string
}

const AudioMessage = ({ msg, userAvatar, botAvatar, ...boxProps }: AudioMessageProps) => {

  const AudioURL = useBase64ToBlobUrl(msg.body, msg?.metadata?.mimetype || "audio/mpeg")

  const { showError } = useError();

  const sender_picture = useBase64ToBlobUrl(
    userAvatar,
    MESSAGE.AUDIO.IMAGE
  )

  const to_send_picture = useBase64ToBlobUrl(
    botAvatar,
     MESSAGE.AUDIO.IMAGE
  )

  const {
    audioRef,
    isPlaying,
    currentTime,
    duration,
    play,
    pause,
    slide,
  } = useAudioPlayer(AudioURL);

  const { descriptionColor, textColor } = useCoftechColors();

  const renderPlayButton = () => {
    if (!isPlaying) {
      return (
        <FaPlay color={descriptionColor} />
      )
    }
    else {
      return (
        <FaPause color={descriptionColor} />
      )
    }
  }

  const handlePlay = () => {
    if (!isPlaying) {
      play();
    }
    else {
      pause();
    }
  }

  const handleSliderChange = (e) => {
    if (audioRef.current !== null) {
      slide(e.target.value)
    }
  }
  return (
    <Box minW={MESSAGE.AUDIO.MIN_WIDTH} id={msg?.message_id} {...boxProps}>
      <HStack>
        {msg.via === MESSAGE.RECEIVE && (
          <HStack>
            {sender_picture &&
              sender_picture.length > 0 ? (
              <Image
                src={sender_picture}
                alt="avatar"
                width={MESSAGE.AUDIO.AVATAR_SIZE}
                height={MESSAGE.AUDIO.AVATAR_SIZE}
                style={{
                  borderRadius: MESSAGE.AUDIO.AVATAR_BORDER_RADIUS,
                }}
              />
            ) : (
              <Avatar size={MESSAGE.AUDIO.DEFAULT_AVATAR_SIZE} src="" />
            )}
          </HStack>
        )}
        <audio key={AudioURL} src={AudioURL} onError={(e) => showError(i18n?.t("chats.audioError"))} />
        <HStack>
          <Button
            p={MESSAGE.PADDING.ZERO}
            m={MESSAGE.MARGIN.ZERO}
            onClick={handlePlay}
            variant={MESSAGE.AUDIO.PLAY_BUTTON}
          >
            {renderPlayButton()}
          </Button>
          <VStack
            h={MESSAGE.AUDIO.HEIGHT}
            m={MESSAGE.MARGIN.ZERO}
            p={MESSAGE.PADDING.ZERO}
          >
            <Box
              p={MESSAGE.PADDING.ZERO}
              m={MESSAGE.MARGIN.ZERO}
            >
              <Input
                p={MESSAGE.PADDING.ZERO}
                top={MESSAGE.AUDIO.SLIDER_TOP}
                position={MESSAGE.AUDIO.SLIDER_POSITION}
                zIndex={MESSAGE.AUDIO.SLIDER_ZINDEX}
                border={MESSAGE.AUDIO.SLIDER_BORDER}
                dir={MESSAGE.AUDIO.SLIDER_DIRECTION}
                type={MESSAGE.AUDIO.SLIDER_TYPE}
                max={Number.isFinite(audioRef?.current?.duration) ? Math.floor(audioRef.current.duration) : 0}
                onChange={handleSliderChange}
                value={currentTime}
                min={MESSAGE.AUDIO.SLIDER_MINIMUM}
              />
              <Box
                mx={MESSAGE.AUDIO.TRACK_X_MARGIN}
                rounded={MESSAGE.AUDIO.TRACK_ROUNDED}
                bottom={MESSAGE.AUDIO.TRACK_BOTTOM}
                h={MESSAGE.AUDIO.TRACK_HEIGHT}
                position={MESSAGE.AUDIO.TRACK_POSITION}
                backgroundColor={descriptionColor}
                zIndex={MESSAGE.AUDIO.TRACK_ZINDEX}
              >
              </Box>
            </Box>
            <HStack
              position={MESSAGE.AUDIO.TIME_STAMP_POSITION}
              bottom={MESSAGE.AUDIO.TIME_STAMP_BOTTOM}
              w={MESSAGE.WIDTH.FULL}
              p={MESSAGE.PADDING.ZERO}
              m={MESSAGE.MARGIN.ZERO}
            >
              <Text
                fontSize={MESSAGE.TEXT.SMALL}
                color={msg.via === MESSAGE.SEND ? textColor : descriptionColor}
                w={MESSAGE.WIDTH.FULL}
                align={MESSAGE.TEXT.END}
              >
                {isPlaying ? formatTime(currentTime) : formatTime(duration)}
              </Text>
            </HStack>
          </VStack>
        </HStack>
        {msg.via === MESSAGE.SEND && (
          <HStack>
            {to_send_picture &&
              to_send_picture.length > 0 ? (
              <Image
                src={to_send_picture}
                alt="avatar"
                width={MESSAGE.AUDIO.AVATAR_SIZE}
                height={MESSAGE.AUDIO.AVATAR_SIZE}
                style={{
                  borderRadius: MESSAGE.AUDIO.AVATAR_BORDER_RADIUS,
                }}
              />
            ) : (
              <Avatar size={MESSAGE.AUDIO.DEFAULT_AVATAR_SIZE} src="" />
            )}
          </HStack>
        )}
      </HStack>
      <MessageCaption
        msg={msg}
      />
      <MessageTimeStamp
        mt={MESSAGE.MARGIN.REGULAR}
        msg={msg}
      />
      <MessageEditedRevoked
        msg={msg}
      />
    </Box>
  );

};

const equality = (prevProps: AudioMessageProps, nextProps: AudioMessageProps) => prevProps.msg.message_id === nextProps.msg.message_id && prevProps.msg.body === nextProps.msg.body

export default React.memo(AudioMessage, equality);
