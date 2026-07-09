import {
    Box,
    BoxProps,
    Flex,
    Spinner,
    Tooltip,
    useToken,
} from "@chakra-ui/react";
import { COFTECH_ICON_BUTTON } from "@component/constants/coftechIconButton";
import useCoftechColors from "@component/hooks/useCoftechColors";
import { getReactIconComponent } from "@component/utils/iconUtils";
import React from "react";

interface CoftechIconButtonProps extends BoxProps {
    disabled?: boolean,
    icon: string,
    loading?: boolean,
    tip?: string
    onClick: () => void,
}

const CoftechIconButton = ({ disabled, icon, onClick, loading, tip=COFTECH_ICON_BUTTON.TIP.DEFAULT, ...boxProps }: CoftechIconButtonProps) => {

    const IconComponent = getReactIconComponent(
        icon
    );

    const { bgColor, panelBgColor, descriptionColor } = useCoftechColors();

    return (
        <Tooltip label={tip} hasArrow={true} p={COFTECH_ICON_BUTTON.TIP.PADDING}>
            <Box
                {...boxProps}
                display={COFTECH_ICON_BUTTON.DISPLAY}
                alignItems={COFTECH_ICON_BUTTON.ALIGN.ITEMS}
                bg={COFTECH_ICON_BUTTON.BACKGROUND}
                p={COFTECH_ICON_BUTTON.PADDING}
                borderRadius={COFTECH_ICON_BUTTON.BORDER.RADIUS}
                cursor={disabled ? COFTECH_ICON_BUTTON.CURSOR.DISABLED : COFTECH_ICON_BUTTON.CURSOR.ENABLED}
                onClick={disabled ? () => { } : onClick}
                color={disabled ? descriptionColor : bgColor}
                _hover={!loading && !disabled ? {
                    bg: bgColor,
                    color: panelBgColor
                } : {}}
            >
                {loading ? (
                    <Spinner size={COFTECH_ICON_BUTTON.LOADING.SIZE} color={bgColor} />
                ) : (
                    <IconComponent />
                )}
            </Box>
        </Tooltip>
    );

};

export default CoftechIconButton;
