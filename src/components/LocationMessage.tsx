import dynamic from "next/dynamic";
import {
  Box,
  BoxProps,
  Link,
  Text,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import useCoftechColors from "@component/hooks/useCoftechColors";
import React from "react";
import MessageTimeStamp from "./MessageTimeStamp";
import MessageEditedRevoked from "./MessageEditedRevoked";
import MessageCaption from "./MessageCaption";
import { MESSAGE } from "@component/constants/message";
import { Message } from "@component/types/messageType";

const LeafletMap = dynamic(() => import("./LeafletMap"), { ssr: false });

interface Metadata {
  latitude: string,
  longitude: string,
  description: string,
  name: string
}

interface LocationMessageProps extends BoxProps {
  msg: Message,
}

const LocationMessage = ({ msg, ...boxProps }: LocationMessageProps) => {
  const { t } = useTranslation("common");

  const { descriptionColor, textColor } = useCoftechColors();

  const dataInfo: Metadata = msg?.metadata;

  const position = [dataInfo?.latitude, dataInfo?.longitude];
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${dataInfo?.latitude},${dataInfo?.longitude}`;

  return (
    <Box w={MESSAGE.LOCATION.WIDTH} id={msg?.message_id} {...boxProps}>
      <LeafletMap position={position} />
      <Text mt={MESSAGE.MARGIN.REGULAR}>{t("chats.locationUser")}</Text>
      <Link href={googleMapsUrl} color={MESSAGE.COLOR.URL_COLOR} isExternal>
        {t("chats.viewOnGoogleMaps")}
      </Link>
      <Text
        fontSize={MESSAGE.TEXT.REGULAR}
        fontWeight={MESSAGE.TEXT.MEDIUM_WEIGHT}
        whiteSpace={MESSAGE.TEXT.MEDIUM_WEIGHT}
        mt={MESSAGE.MARGIN.SMALL}
        color={msg.via === MESSAGE.SEND ? textColor : descriptionColor}
      >
        {dataInfo?.name && dataInfo?.name != "null" ? dataInfo?.name : t("chats.noName")}
      </Text>
      {dataInfo?.description && dataInfo?.description != "null" && (
        <Text
          fontSize={MESSAGE.TEXT.REGULAR}
          fontWeight={MESSAGE.TEXT.MEDIUM_WEIGHT}
          whiteSpace={MESSAGE.TEXT.WHITE_SPACE}
          mt={MESSAGE.MARGIN.SMALL}
          color={msg.via === MESSAGE.SEND ? textColor : descriptionColor}
        >
          {dataInfo?.description}
        </Text>
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

const equality = (prevProps: LocationMessageProps, nextProps: LocationMessageProps) => prevProps.msg.message_id === nextProps.msg.message_id && prevProps.msg.body === nextProps.msg.body

export default React.memo(LocationMessage, equality);
