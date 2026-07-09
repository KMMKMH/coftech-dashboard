import { Text, TextProps } from "@chakra-ui/react"
import { MESSAGE } from "@component/constants/message";
import useCoftechColors from "@component/hooks/useCoftechColors";
import React from "react";


interface Message {
    message_id: string,
    via: string,
    caption: string,
}

interface MessageCaptionProps extends TextProps {
    msg: Message,
}


const MessageCaption = ({ msg, ...textProps }: MessageCaptionProps) => {

    const { descriptionColor, textColor } = useCoftechColors();

    return (
        <Text
            fontSize={MESSAGE.TEXT.REGULAR}
            fontWeight={MESSAGE.TEXT.MEDIUM_WEIGHT}
            whiteSpace={MESSAGE.TEXT.WHITE_SPACE}
            mt={MESSAGE.MARGIN.REGULAR}
            align={MESSAGE.TEXT.START}
            color={msg.via === MESSAGE.SEND ? textColor : descriptionColor}
            { ...textProps }
        >
            {msg.caption}
        </Text>
    )
}

const equality = (prevProps: MessageCaptionProps, nextProps: MessageCaptionProps) => prevProps.msg.message_id === nextProps.msg.message_id && prevProps.msg.caption === nextProps.msg.caption

export default React.memo(MessageCaption, equality);