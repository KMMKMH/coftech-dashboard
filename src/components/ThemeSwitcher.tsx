import {
  Box,
  Button,
  useColorMode,
  useColorModeValue,
  Icon,
  useBreakpointValue,
} from "@chakra-ui/react";
import { Moon02, Sun } from "@untitled-ui/icons-react";
import useCoftechColors from "@component/hooks/useCoftechColors";
import { useEffect } from "react";

const ThemeSwitcher = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const stageMoonColor = useColorModeValue("#64748B", "coftech.primary.dark");
  const stageSunColor = useColorModeValue("coftech.primary.dark", "#64748B");
  const isLight = colorMode === "light";
  const { panelBgColor, backgroundColor } = useCoftechColors();
  const translateXValue = useBreakpointValue({
    base: "translateX(2.7rem)",
    md: "translateX(3.2rem)",
  });

  useEffect(() => {
    if (colorMode === "dark") {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [colorMode]);

  return (
    <Button
      onClick={toggleColorMode}
      justifyContent="space-between"
      alignItems="center"
      width={{ base: "100px", md: "110px" }}
      height={{ base: "42px", md: "56px" }}
      borderRadius="30px"
      background={{ base: backgroundColor, md: panelBgColor }}
      _hover={{
        bg: { base: backgroundColor, md: panelBgColor },
      }}
      boxShadow="0px 2px 4px -2px #0F172A0F, 0px 4px 8px -2px #0F172A1A"
      paddingLeft={"10px"}
      cursor="pointer"
    >
      <Box
        as="span"
        position="absolute"
        height="2.4rem"
        width="2.4rem"
        borderRadius="50%"
        transform={isLight ? "translateX(0)" : translateXValue}
        transition="transform 0.3s, background-color 0.1s ease"
        background={{ base: panelBgColor, md: backgroundColor }}
      />
      <Box
        as="svg"
        width="24px"
        height="24px"
        viewBox="0 0 24 24"
        zIndex="9"
        display={"flex"}
        alignItems={"center"}
        justifyContent={"center"}
        ml={"6px"}
      >
        <Icon as={Sun} color={stageSunColor} opacity={isLight ? "1" : "0.6"} />
      </Box>
      <Box
        as="svg"
        width="24px"
        height="24px"
        viewBox="0 0 24 24"
        fill="none"
        zIndex="9"
      >
        <Icon
          as={Moon02}
          color={stageMoonColor}
          opacity={isLight ? "0.6" : "1"}
        />
      </Box>
    </Button>
  );
};

export default ThemeSwitcher;
