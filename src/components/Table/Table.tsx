import React from "react";
import { Table as ChakraTable, TableProps } from "@chakra-ui/react";
import { Provider } from "@component/utils/utils";
import useCoftechColors from "@component/hooks/useCoftechColors";

export const Table = (props: TableProps) => {
  const { className, ...rest } = props;
  const classes = `${className || ""} responsiveTable`;
  const { panelBgColor } = useCoftechColors();

  return (
    <ChakraTable {...rest} className={classes} background={panelBgColor} />
  );
};
