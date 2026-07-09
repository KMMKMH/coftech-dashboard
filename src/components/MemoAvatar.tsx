import { MESSAGE } from "@component/constants/message";
import { convertBase64ToBlobUrl } from "@component/utils/mediaUtils";
import Image from "next/image";
import React from "react";

interface AvatarProps {
    base64: string,
    mimeType: string,
    radius: number,
}

const MemoAvatar = ({ base64, mimeType, radius }: AvatarProps) => {

    return (
        <Image
            src={convertBase64ToBlobUrl(
                base64,
                mimeType
            )}
            alt="avatar"
            width={radius}
            height={radius}
            style={{
                borderRadius: MESSAGE.AVATAR.BORDER_RADIUS,
            }}
        />
    )
};

const equality = (prevProps: AvatarProps, nextProps: AvatarProps) => prevProps.base64 === nextProps.base64 && prevProps.mimeType === nextProps.mimeType

export default React.memo(MemoAvatar, equality);

