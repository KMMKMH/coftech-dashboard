import {
    Box,
    BoxProps,
    Text
} from "@chakra-ui/react";
import { FILEMANAGER } from "@component/constants/fileManager";
import useCoftechColors from "@component/hooks/useCoftechColors";
import React from "react";

interface TabButtonProps extends BoxProps {
    text: string,
    active: boolean,
    onClick: () => void
}

const TabButton = ({ text, onClick, active, ...boxProps }: TabButtonProps) => {

    const {
        panelBgColor,
        borderColor
    } = useCoftechColors();

    return (
        <Box
            {...boxProps}
            h={FILEMANAGER.TAB_BUTTON.HEIGHT}
            bg={active ? panelBgColor : borderColor}
            borderTopRadius={FILEMANAGER.TAB_BUTTON.BORDER.RADIUS_T}
            w={FILEMANAGER.TAB_BUTTON.WIDTH}
            py={FILEMANAGER.TAB_BUTTON.PADDING_Y}
            cursor={FILEMANAGER.TAB_BUTTON.CURSOR}
            onClick={onClick}
        >
            <Text textAlign={FILEMANAGER.TEXT.CENTER}>
                {text}
            </Text>
        </Box>
    );
};

export default TabButton;
