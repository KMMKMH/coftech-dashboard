import { chakra } from "@chakra-ui/react";
import React from "react";

export const CoftechLogo = React.forwardRef<HTMLImageElement, any>((props, ref) => (
  <chakra.img
    ref={ref}
    src="/Logo.png"
    alt="Coftech Bot"
    bg="white"
    borderRadius="8px"
    objectFit="contain"
    {...props}
  />
));

CoftechLogo.displayName = "CoftechLogo";
