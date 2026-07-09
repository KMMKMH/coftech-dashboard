import React, { createContext, useContext } from "react";

const TableContext = createContext<Record<number, any>>({});

export const Provider = TableContext.Provider;
export const Consumer = TableContext.Consumer;

export const useTableContext = () => useContext(TableContext);
