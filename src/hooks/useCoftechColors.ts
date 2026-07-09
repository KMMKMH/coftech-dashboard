import { useColorModeValue, useTheme } from "@chakra-ui/react";

const useCoftechColors = () => {

  const theme = useTheme()

  const lightAccent = useColorModeValue(
    theme.colors.coftech.accent.cyan,
    theme.colors.coftech.primary_hover.dark
  );
  const bgColor = useColorModeValue(
    theme.colors.coftech.primary.light,
    theme.colors.coftech.primary.dark
  );
  const hoverColor = useColorModeValue(
    theme.colors.coftech.primary_hover.light,
    theme.colors.coftech.primary_hover.dark
  );
  const panelBgColor = useColorModeValue(
    theme.colors.coftech.panel.light,
    theme.colors.coftech.panel.dark
  );
  const backgroundColor = useColorModeValue(
    theme.colors.coftech.background.light,
    theme.colors.coftech.background.dark
  );
  const descriptionColor = useColorModeValue(
    theme.colors.coftech.descriptionColor.light,
    theme.colors.coftech.descriptionColor.dark
  );
  const borderColor = useColorModeValue(
    theme.colors.coftech.border.light,
    theme.colors.coftech.border.dark
  );
  const textColor = useColorModeValue(theme.colors.coftech.text.light, theme.colors.coftech.text.dark);
  const inTextColor = useColorModeValue(
    theme.colors.coftech.inText.light,
    theme.colors.coftech.inText.dark
  );
  const iconColor = useColorModeValue(theme.colors.coftech.icon.light, theme.colors.coftech.icon.dark);
  const titleColor = useColorModeValue(theme.colors.coftech.icon.light, theme.colors.coftech.descriptionColor.dark);
  const inputBorderColor = useColorModeValue(
    theme.colors.coftech.inputBorder.light,
    theme.colors.coftech.inputBorder.dark
  );

  return {
    bgColor,
    hoverColor,
    panelBgColor,
    backgroundColor,
    descriptionColor,
    borderColor,
    textColor,
    inTextColor,
    iconColor,
    inputBorderColor,
    titleColor,
    lightAccent,
  };
};

export default useCoftechColors;
