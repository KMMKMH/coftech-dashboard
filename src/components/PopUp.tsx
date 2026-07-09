/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import {
    Text,
    Box,
    Icon,
    HStack,
} from "@chakra-ui/react";
import useCoftechColors from "@component/hooks/useCoftechColors";
import { CheckCircle, SlashCircle01 } from "@untitled-ui/icons-react";

const PopUp = ({ isShown, setIsShown, type, msg }) => {

    const {
        bgColor,
        backgroundColor,
    } = useCoftechColors();

    useEffect(() => {
        if (isShown) {
            setTimeout(() => {
                setIsShown(false)
            }, 1500)
        }
    }, [isShown])

    return (
        <Box>
            <Box w={"full"} h={"full"} zIndex={10} pointerEvents={isShown ? "all" : "none"} bg={isShown ? "black" : null} opacity={"0.6"} position={"fixed"} top={0} right={0} transition={"all 0.3s"} />
            <Box pointerEvents={isShown ? "all" : "none"} opacity={isShown ? "1" : "0"} position={"fixed"} zIndex={11} bottom={10} right={10} bg={backgroundColor} p={3} transition={"all 0.3s"} borderRadius={"15px"}>
                <HStack gap={"10px"}>
                    {type == "success" ? (
                        <Icon
                            as={CheckCircle}
                            w={8}
                            h={8}
                            color={bgColor}
                        />
                    ) : (
                        <Icon
                            as={SlashCircle01}
                            w={8}
                            h={8}
                            color={"red"}
                        />
                    )}
                    <Text>{msg}</Text>
                </HStack>
            </Box>
        </Box>
    );
};

export default PopUp;
