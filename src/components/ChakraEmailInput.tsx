/* eslint-disable react/display-name */
import { Input, VStack, Text } from "@chakra-ui/react";
import useCoftechColors from "@component/hooks/useCoftechColors";

export const ChakraEmailInput = (value, onChange, isTrue) => {
    const { bgColor, textColor, inputBorderColor, backgroundColor } =
        useCoftechColors();
        
    return (
        <VStack>
            <Input
                bg={backgroundColor}
                maxW={"full"}
                w={"full"}
                color={textColor}
                _hover={{ borderColor: inputBorderColor }}
                _focus={{ borderColor: isTrue ? bgColor : "red", boxShadow: "none" }}
                value={value}
                onChange={onChange}
                onKeyDown={(e) => {
                    if (e.key === "Shift") {
                        e.preventDefault();
                    }
                }}
            />
        </VStack>
    );
}