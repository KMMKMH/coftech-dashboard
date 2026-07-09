import React, { ReactElement } from "react";
import { TableHeadProps, Thead as ChakraThead } from "@chakra-ui/react";

interface ExtendedTableHeadProps extends TableHeadProps {
  children: ReactElement<{ inHeader?: boolean }>;
}

export const Thead = (props: ExtendedTableHeadProps) => {
  const { children, ...rest } = props;

  return (
    <ChakraThead {...rest}>
      {React.isValidElement(children) &&
        React.cloneElement(children, { inHeader: true })}
    </ChakraThead>
  );
};
