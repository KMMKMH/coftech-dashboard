import React from 'react';
import { Box, Button, Text, VStack, Icon } from '@chakra-ui/react';
import { WarningIcon } from '@chakra-ui/icons';
import { FallbackProps } from 'react-error-boundary';
import { useTranslation } from 'react-i18next';
import useCoftechColors from '@component/hooks/useCoftechColors';

export const ErrorFallback = ({ error, resetErrorBoundary }: FallbackProps) => {
  const { t } = useTranslation("common");

  const {
    bgColor,
    hoverColor,
    descriptionColor,
    backgroundColor
  } = useCoftechColors();

  return (
    <Box w="full" h="full" display="flex" alignItems="start" justifyContent="center" p={4}>
      <VStack textAlign="center">
        <Icon as={WarningIcon} w={10} h={10} color={"red.500"} />
        <Text fontWeight="bold" fontSize="lg" m={0}>
          {t("modal.errorTitle")}
        </Text>
        <Text fontSize="sm" color={descriptionColor} maxW="md" m={0}>
          {t("errors.unknownError")}
        </Text>
        <Button
          bgColor={"red.300"}
          color={backgroundColor}
          _hover={{
            bgColor: "red.500"
          }}
          onClick={resetErrorBoundary} size="sm">
          {t("errors.retry")}
        </Button>
      </VStack>
    </Box>
  );
};

export default ErrorFallback;
