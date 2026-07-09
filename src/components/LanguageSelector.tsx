import React from "react";
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  HStack,
  Text,
  Icon,
  useColorModeValue,
} from "@chakra-ui/react";
import { FiChevronDown } from "react-icons/fi";
import { CircleFlag } from "react-circle-flags";
import { useRouter } from "next/router";
import useCoftechColors from "@component/hooks/useCoftechColors";

const LanguageSelector = ({ selectedLanguage, setSelectedLanguage, t }) => {
  const router = useRouter();
  const { hoverColor, backgroundColor, panelBgColor } =
    useCoftechColors();
  const bgColor = useColorModeValue("coftech.primary.dark", "coftech.primary.dark")

  const availableLanguages = ["en", "es", "ch"];
  const otherLanguages = availableLanguages.filter(
    (lng) => lng !== selectedLanguage
  );

  const getFlagComponent = (lng: string) => {
    switch (lng) {
      case "en":
        return <CircleFlag countryCode="gb" width={"27px"} />;
      case "es":
        return <CircleFlag countryCode="es" width={"27px"} />;
      case "ch":
        return <CircleFlag countryCode="cn" width={"27px"} />;
      default:
        return null;
    }
  };

  const onToggleLanguageClick = (lng: string) => {
    const { pathname, asPath, query } = router;
    const newLocale = lng === "en" ? "" : lng;
    router.push({ pathname, query }, `/${newLocale}${asPath}`, { locale: lng });
    setSelectedLanguage(lng);
  };

  return (
    <Menu>
      <MenuButton
        transition="all 0.3s"
        _focus={{ boxShadow: "none" }}
        bg={{ base: backgroundColor, md: panelBgColor }}
        px={{ base: 2, md: 4 }}
        h={{ base: "42px", md: "56px" }}
        borderRadius={100}
        boxShadow="0px 2px 4px -2px #0F172A0F, 0px 4px 8px -2px #0F172A1A"
      >
        <HStack gap={{ base: 3, md: 4 }}>
          {getFlagComponent(selectedLanguage)}
          <Text>{selectedLanguage.toUpperCase()}</Text>
          <Icon as={FiChevronDown} color={bgColor} />
        </HStack>
      </MenuButton>
      <MenuList
        minW={"80px"}
        px={2}
        display={"flex"}
        flexDirection={"column"}
        gap={2}
        bg={backgroundColor}
      >
        {otherLanguages.map((lng) => (
          <MenuItem
            key={lng}
            onClick={() => onToggleLanguageClick(lng)}
            bg={backgroundColor}
            _hover={{
              bg: bgColor,
              color: "white",
            }}
            borderRadius={"5px"}
            gap={2}
          >
            {getFlagComponent(lng)}
            {lng === "en" ? "English" : lng === "es" ? "Spanish" : "Chinese"}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
};

export default LanguageSelector;
