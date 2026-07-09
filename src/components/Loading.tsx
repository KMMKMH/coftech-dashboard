import { Flex, Spinner } from "@chakra-ui/react";
import React from "react";

type Mode = "normal" | "small";
interface LoadingProps {
  mode: Mode;
}

function Loading({ mode="normal"}: LoadingProps) {
  return (
    <Flex justifyContent="center" alignItems="center" height={mode === "normal" ? "200px": "50px"}>
      <Spinner size="xl" />
    </Flex>
  );
}

export default Loading;
