import { HStack, Text, TextProps } from "@chakra-ui/react"
import { MESSAGE } from "@component/constants/message";
import useCoftechColors from "@component/hooks/useCoftechColors";
import { formatDate } from "@component/utils/formatters";
import React from "react";


interface Metadata {
    filename: string,
    mimetype: string,
    filesize: string,
    __typename: string
}

interface Message {
    message_id: string,
    via: string,
    created_at: string,
    metadata: Metadata
}

interface MessageTimeStampProps extends TextProps {
    msg: Message,
}


const MessageTimeStamp = ({ msg, ...textProps }: MessageTimeStampProps) => {

    const { descriptionColor, textColor } = useCoftechColors();

    const dataInfo: Metadata = msg?.metadata
    const fileSize = dataInfo?.filesize?.split(" ")[0]

    return (

        <HStack w={MESSAGE.WIDTH.FULL} mt={MESSAGE.MARGIN.REGULAR}>
            {dataInfo?.__typename == "MediaJsonType" && fileSize && fileSize != "null" && (
                <Text
                    fontSize={MESSAGE.TEXT.SMALL}
                    w={MESSAGE.WIDTH.FULL}
                    color={msg.via === MESSAGE.SEND ? textColor : descriptionColor}
                    align={MESSAGE.TEXT.START}
                    {...textProps}
                >
                    {dataInfo?.filesize}
                </Text>
            )}
            <Text
                fontSize={MESSAGE.TEXT.SMALL}
                w={MESSAGE.WIDTH.FULL}
                color={msg.via === MESSAGE.SEND ? textColor : descriptionColor}
                align={MESSAGE.TEXT.END}
                {...textProps}
            >
                {formatDate(msg.created_at)}
            </Text>
        </HStack>
    )
}

const equality = (prevProps: MessageTimeStampProps, nextProps: MessageTimeStampProps) => prevProps.msg.created_at === nextProps.msg.created_at && prevProps.msg.message_id === nextProps.msg.message_id && prevProps.msg.metadata?.filename === nextProps.msg.metadata?.filename && prevProps.msg.metadata?.filesize === nextProps.msg.metadata?.filesize && prevProps.msg.metadata?.mimetype === nextProps.msg.metadata?.mimetype

export default React.memo(MessageTimeStamp, equality);