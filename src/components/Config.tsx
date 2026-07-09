import { Box, HStack, Button, Tooltip, Text, ResponsiveValue, BoxProps } from "@chakra-ui/react";
import useCoftechColors from "@component/hooks/useCoftechColors";
import { InfoCircle } from "@untitled-ui/icons-react";
import Link from "next/link";

interface ConfigProps extends BoxProps { 
    config: any, 
    t: any, 
    handleFieldDirection: (param: any) => ResponsiveValue<any>, 
    renderInputField: (param: any) => JSX.Element, 
    renderCopyField?: (param: any) => JSX.Element | null,
}

const Config = ({ config, t, handleFieldDirection, renderInputField, renderCopyField = null, ...boxProps }: ConfigProps) => {

    const {
        bgColor,
        hoverColor,
        titleColor
    } = useCoftechColors();

    return (
        <Box {...boxProps} width={"full"} display={"flex"} gap={3} flexDirection={handleFieldDirection(config)}>
            <HStack width={"full"} gap={2} color={titleColor}>
                <Text mr={"0px"}>{config.name ?? config.key}</Text>
                <Tooltip label={config.description} hasArrow={true} padding={2} borderRadius={"10px"} placement="top">
                    <Box w={"30px"}>
                        <Box m={"auto"} w={"min-content"}>
                            <InfoCircle />
                        </Box>
                    </Box>
                </Tooltip>
                {config.key == "ADMIN_API_KEY" && (
                    <HStack mr={"auto"} ml={"30px"}>
                        <Button
                            as={Link}
                            target="_blank"
                            href={"https://platform.openai.com/settings/organization/admin-keys"}
                            bg={bgColor}
                            color={"white"}
                            _hover={{
                                bg: hoverColor
                            }}>
                            {t("integrations.apiKeys")}
                        </Button>
                    </HStack>
                )}
            </HStack>
            <HStack>
                {renderInputField(config)}
                {renderCopyField && renderCopyField(config)}
            </HStack>
        </Box>
    )
}

export default Config;