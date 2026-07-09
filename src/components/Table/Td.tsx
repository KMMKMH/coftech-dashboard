import React from "react";
import { TableCellProps, Td as ChakraTd } from "@chakra-ui/react";
import { Consumer } from "@component/utils/utils";
import useCoftechColors from "@component/hooks/useCoftechColors";

interface ITdInnerProps extends TableCellProps {
  columnKey?: number;
  narrowHeaders: Record<number, any>;
}

const TdInner = (props: ITdInnerProps) => {
  const { narrowHeaders, columnKey = 0, ...rest } = props;
  const classes = `${props.className || ""} pivoted`;
  const { panelBgColor } = useCoftechColors();

  return (
    <ChakraTd
      data-testid="td"
      {...rest}
      className={classes}
      style={{
        background: panelBgColor,
      }}
    >
      <div data-testid="td-before" className="tdBefore">
        {narrowHeaders[columnKey]}
      </div>
      {props.children ?? <div>&nbsp;</div>}
    </ChakraTd>
  );
};

export interface ITdProps extends Omit<ITdInnerProps, "narrowHeaders"> {}

export const Td = (props: ITdProps) => (
  <Consumer>
    {(headers) => <TdInner {...props} narrowHeaders={headers} />}
  </Consumer>
);
