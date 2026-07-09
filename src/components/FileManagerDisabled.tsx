import React from "react";
import {
  Box,
  Container,
  VStack,
  Text,
  Heading,
  Icon,
  Circle,
  useColorModeValue,
} from "@chakra-ui/react";
import { Folder } from "@untitled-ui/icons-react";
import { AlertCircle } from "@untitled-ui/icons-react";
import { AppShell } from '@component/components/layout'
import useCoftechColors from "@component/hooks/useCoftechColors";
import { useTranslation } from "react-i18next";

const FileManagerDisabled: React.FC = () => {
  const { t } = useTranslation("common");
  const {
    backgroundColor,
    descriptionColor,
    textColor,
    bgColor,
    panelBgColor,
  } = useCoftechColors();

  const borderColor = useColorModeValue("gray.200", "gray.700");

  return (
    <AppShell title={t("fileManager.title")}>
      <Container maxW="container.xl" py={12}>
        <VStack spacing={8} align="center" justify="center" minH="65vh">
          <Box
            bg={backgroundColor}
            p={12}
            borderRadius="2xl"
            boxShadow="2xl"
            textAlign="center"
            maxW="600px"
            w="full"
            border="1px solid"
            borderColor={borderColor}
            position="relative"
            overflow="hidden"
          >
            {/* Decorative background gradient */}
            <Box
              position="absolute"
              top="-50%"
              left="-50%"
              width="200%"
              height="200%"
              bgGradient={`radial(${bgColor}20 1px, transparent 1px)`}
              backgroundSize="20px 20px"
              opacity={0.3}
              pointerEvents="none"
            />

            {/* Content */}
            <VStack spacing={6} position="relative" zIndex={1}>
              {/* Icon container with animation */}
              <Circle
                size="80px"
                bg={bgColor}
                position="relative"
                boxShadow="md"
              >
                <Icon as={Folder} boxSize={10} color="white" />
                <Circle
                  size="28px"
                  bg={panelBgColor}
                  position="absolute"
                  bottom="-2"
                  right="-2"
                  border="3px solid"
                  borderColor={backgroundColor}
                >
                  <Icon as={AlertCircle} boxSize={4} color={bgColor} />
                </Circle>
              </Circle>

              {/* Title */}
              <VStack spacing={3}>
                <Heading
                  size="lg"
                  color={textColor}
                  fontWeight="bold"
                  letterSpacing="tight"
                >
                  {t("fileManager.serviceDisabled")}
                </Heading>

                {/* Description */}
                <Text
                  color={descriptionColor}
                  fontSize="md"
                  lineHeight="tall"
                  maxW="400px"
                >
                  {t("fileManager.disabledDescription")}
                </Text>
              </VStack>

              {/* Additional info box */}
              <Box
                bg={bgColor}
                px={6}
                py={3}
                borderRadius="lg"
                border="1px solid"
                borderColor={bgColor}
                mt={2}
              >
                <Text
                  color="white"
                  fontSize="sm"
                  fontWeight="medium"
                >
                  {t("fileManager.reactivationNote")}
                </Text>
              </Box>
            </VStack>
          </Box>
        </VStack>
      </Container>
    </AppShell>
  );
};

export default FileManagerDisabled;
