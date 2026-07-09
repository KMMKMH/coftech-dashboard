import { chakra } from "@chakra-ui/react";
import React from "react";

export const CoftechIcon = React.forwardRef<HTMLImageElement, any>((props, ref) => (
  <chakra.img
    ref={ref}
    src="/Logo-horizontal.png"
    alt="Coftech Bot"
    bg="white"
    borderRadius="8px"
    objectFit="contain"
    {...props}
  />
));

CoftechIcon.displayName = "CoftechIcon";