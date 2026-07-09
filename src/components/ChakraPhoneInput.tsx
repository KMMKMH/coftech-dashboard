/* eslint-disable react/display-name */
import { Input } from "@chakra-ui/react";
import useCoftechColors from "@component/hooks/useCoftechColors";
import { forwardRef, LegacyRef } from "react";

export const ChakraPhoneInput = forwardRef((props, ref) => {
  const { bgColor, textColor, inputBorderColor, backgroundColor } =
    useCoftechColors();

  return (
    <Input
      ref={ref as LegacyRef<HTMLInputElement>}
      {...props}
      bg={backgroundColor}
      maxW={"full"}
      w={"full"}
      color={textColor}
      _hover={{ borderColor: inputBorderColor }}
      _focus={{ borderColor: bgColor, boxShadow: "none" }}
      onKeyDown={(e) => {
        if (e.key === "Shift") {
          e.preventDefault();
        }
      }}
    />
  );
});