import { HStack, StackProps, Text } from "@chakra-ui/react"
import { MESSAGE } from "@component/constants/message";
import useCoftechColors from "@component/hooks/useCoftechColors";
import React from "react";
import { useTranslation } from "react-i18next";


interface Message {
    message_id: string,
    via: string,
    is_edited: boolean,
    is_revoked: boolean,
}

interface MessageEditedRevokedProps extends StackProps {
    msg: Message,
}


const MessageEditedRevoked = ({ msg, ...stackProps }: MessageEditedRevokedProps) => {
    const { t } = useTranslation("common");

    const { descriptionColor, textColor } = useCoftechColors();

    return (
        <HStack w={MESSAGE.WIDTH.FULL} { ...stackProps }>
            {msg?.is_revoked ? (
                <Text
                    fontSize={MESSAGE.TEXT.SMALL}
                    color={MESSAGE.COLOR.RED}
                    align={MESSAGE.TEXT.END}
                    mt={MESSAGE.MARGIN.SMALL}
                    ml={MESSAGE.MARGIN.AUTO}
                >
                    {t("chats.revoked")}
                </Text>
            ) : msg?.is_edited ? (
                <Text
                    fontSize={MESSAGE.TEXT.SMALL}
                    color={msg.via === MESSAGE.SEND ? textColor : descriptionColor}
                    align={MESSAGE.TEXT.END}
                    mt={MESSAGE.MARGIN.SMALL}
                    ml={MESSAGE.MARGIN.AUTO}
                >
                    {t("chats.edited")}
                </Text>
            ) : (<></>)}
        </HStack >
    )
}

const equality = (prevProps: MessageEditedRevokedProps, nextProps: MessageEditedRevokedProps) => prevProps.msg.is_edited === nextProps.msg.is_edited && prevProps.msg.is_revoked === nextProps.msg.is_revoked && prevProps.msg.message_id === nextProps.msg.message_id

export default React.memo(MessageEditedRevoked, equality);