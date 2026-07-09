import { ViewOffIcon, ViewIcon } from "@chakra-ui/icons";
import { HStack, Box, VStack, SimpleGrid, InputGroup, InputRightElement, Textarea, Flex, Input, theme, Switch, Button, Text, Icon, useToast, ResponsiveValue, Tooltip } from "@chakra-ui/react";
import useCoftechColors from "@component/hooks/useCoftechColors";
import useCoftechSelect from "@component/hooks/useCoftechSelect";
import { useError } from "@component/utils/errorContext";
import { OptionType } from "@component/types/types";
import { X, Minus } from "@untitled-ui/icons-react";
import { Select } from "chakra-react-select";
import Link from "next/link";
import { SetStateAction, useMemo, useState } from "react";
import { IoArrowUp, IoArrowDown } from "react-icons/io5";
import TimePicker from "react-time-picker";
import CoftechCron from "./CoftechCron";

const SelectComponent = (props: any) => {
    const RealSelect = Select as any;
    return <RealSelect {...props} />;
};

export const useConfigFieldRenderer = (formValues: any, t: any, setFormValues: (param: any) => void, setDisableButton: (value: boolean) => void, internalValues?: any) => {

    const { showError } = useError();
    const [openedJson, setOpenedJson] = useState<number[]>([]);
    const [showField, setShowField] = useState<string[]>([]);

    const allValues = useMemo(() => ({ ...(formValues || {}), ...(internalValues || {}) }), [formValues, internalValues])

    const {
        bgColor,
        hoverColor,
        panelBgColor,
        backgroundColor,
        inputBorderColor,
    } = useCoftechColors();

    const {
        styleExtensions
    } = useCoftechSelect()

    const toast = useToast()

    const handleChange = (key, value, onHandle = null) => {
        setFormValues(prev => ({
            ...prev,
            [key]: value,
        }));

        if (onHandle) {
            onHandle(value, key);
        }
    };

    const handleShowField = (current) => {
        if (showField.includes(current)) {
            setShowField((prev) => prev.filter((field) => field != current))
        } else {
            setShowField((prev) => [...prev, current])
        }
    }

    const checkForKeys = (input: string): boolean => {
        if (input.includes("API") || input.includes("KEY") || input.includes("SECRET") || input.includes("TOKEN")) {
            return true
        }
        return false
    }

    const handleFieldDirection = (config): ResponsiveValue<any> => {
        switch (config.data_type ?? config.type) {
            case "time":
                return (
                    "column"
                );
            case "cron":
                return (
                    "column"
                );
            case "float":
                return (
                    "column"
                );
            case "enum":
                return (
                    "column"
                );
            case "boolean":
                return (
                    "row"
                );
            case "integer":
                return (
                    "column"
                );
            case "enum_array":
                return (
                    "column"
                );
            case "string_commas":
                return (
                    "column"
                );
            case "json_array":
                return (
                    "column"
                );
            case "string":
                return (
                    "column"
                );
            default:
                return (
                    "column"
                );
        }
    }


    const renderInputField = (config) => {
        switch (config.data_type ?? config.type) {
            case "time":
                return (
                    <Flex direction="column" w={"full"}>
                        <TimePicker
                            disabled={config?.internal === 1}
                            value={allValues[config.key] || ""}
                            clockIcon={null}
                            clearIcon={null}
                            format="HH:mm"
                            hourAriaLabel="Hour"
                            hourPlaceholder="00"
                            minutePlaceholder="00"
                            onChange={(e) => handleChange(config.key, e)}
                        />
                    </Flex>
                );
            case "cron":
                const isWeeklyReport = config.name === "Weekly Report Cron";
                return (
                    <Flex alignItems="center" w={"full"}>
                        <CoftechCron
                            t={t}
                            disabled={config?.internal === 1}
                            value={allValues[config.key] || ""}
                            isClearable={!isWeeklyReport}
                            allowedPeriods={
                                isWeeklyReport
                                    ? ["Week"]
                                    : ["Year", "Month", "Week", "Day", "Hour", "Minute"]
                            }
                            onChange={(val) => handleChange(config.key, val)}
                        />
                    </Flex>
                );
            case "float":
                return (
                    <Flex alignItems="center" w={"full"}>
                        <Input
                            w={"full"}
                            isDisabled={config?.internal === 1}
                            type="range"
                            focusBorderColor={bgColor}
                            borderRadius={10}
                            defaultValue={allValues[config.key] || ""}
                            max={config.options?.max}
                            min={config.options?.min}
                            step={config.options?.step || 0.1}
                            onChange={(e) => handleChange(config.key, e.target.value)}
                            variant="outline"
                        />
                        <Text
                            textAlign="center"
                            fontSize="md"
                            minW="50px"
                            border="1px solid grey"
                            borderRadius="10px"
                        >
                            {allValues[config.key] || 0}
                        </Text>
                    </Flex>
                );
            case "enum":
                const getExampleLink = () => {
                    const selectedOption = config.options?.find(
                        (o) => o.value === allValues[config.key]
                    );
                    return selectedOption?.example || "";
                };

                const optionsEnum: OptionType[] = (config.options || []).map((option) => ({
                    value: option.value,
                    label: option.label,
                }));

                return (
                    <Flex align="center" gap="1rem" w={"full"}>
                        {/* @ts-ignore */}
                        <SelectComponent
                            placeholder={t("bots.select")}
                            focusBorderColor={bgColor}
                            options={optionsEnum}
                            isClearable={true}
                            isSearchable={false}
                            value={optionsEnum?.find((option) => allValues[config.key] == option.value) || null}
                            onChange={(e) => {
                                const selectedValue = e?.value || "";
                                const selectedOption = config.options?.find(
                                    (o) => o.value === selectedValue
                                ) || null;
                                handleChange(config.key, selectedValue, config?.onHandleOption);
                            }}
                            isDisabled={config?.extra?.disabled || config?.internal === 1}
                            chakraStyles={styleExtensions}
                        />
                        {getExampleLink() && (
                            <Link target="_blank" href={getExampleLink()} passHref>
                                <Box
                                    px={3}
                                    height={theme.sizes[10]}
                                    lineHeight={theme.sizes[10]}
                                    bg="green.100"
                                    color="green.700"
                                    borderRadius={theme.radii.md}
                                    borderWidth="1px"
                                    borderColor={theme.colors.gray[200]}
                                    fontWeight="medium"
                                    fontSize="sm"
                                    display="inline-flex"
                                    alignItems="center"
                                    _hover={{
                                        bg: "green.200",
                                        textDecoration: "none",
                                        borderColor: theme.colors.gray[300],
                                    }}
                                    _focus={{
                                        boxShadow: theme.shadows.outline,
                                        borderColor: theme.colors.blue[500],
                                    }}
                                >
                                    {t("integrations.enumExample")}
                                </Box>
                            </Link>
                        )}
                    </Flex>
                );
            case "boolean":
                return (
                    <Flex alignItems="center" w={"full"}>
                        <Switch
                            isDisabled={config?.internal === 1}
                            isChecked={allValues[config.key] === "true"}
                            sx={{
                                'span.chakra-switch__track': {
                                    _checked: {
                                        bg: bgColor,
                                    },
                                },
                            }}
                            onChange={(e) =>
                                handleChange(config.key, e.target.checked.toString(), config?.onHandleOption)
                            }
                        />
                    </Flex>
                );
            case "integer":
                return (
                    <Input
                        w={"full"}
                        isDisabled={config?.internal === 1}
                        bgColor={backgroundColor}
                        border={"1px solid transparent"}
                        focusBorderColor={bgColor}
                        borderRadius={10}
                        type="number"
                        value={allValues[config.key] || ""}
                        onChange={(e) => handleChange(config.key, e.target.value)}
                    />
                );
            case "enum_array":
                const selectedValues = allValues[config.key]
                    ? (() => {
                        try {
                            const parsed = JSON.parse(allValues[config.key]);
                            return Array.isArray(parsed) ? parsed : [];
                        } catch {
                            return [];
                        }
                    })()
                    : [];
                const maxItems = config?.extra?.selectMaxItem || Infinity;
                const availableOptions = config.options?.filter((opt) => !selectedValues.includes(opt.value)) || [];

                const optionsEnumArray: OptionType[] = (availableOptions || []).map((option) => ({
                    value: option.value,
                    label: option.label
                }));
                return (
                    <VStack align="start" spacing={2} w={"full"}>
                        {/* @ts-ignore */}
                        <SelectComponent
                            placeholder={t("bots.select")}
                            focusBorderColor={bgColor}
                            value={null}
                            options={optionsEnumArray}
                            onChange={(e) => {
                                const newValue = e.value;
                                if (
                                    newValue &&
                                    !selectedValues.includes(newValue) &&
                                    selectedValues.length < maxItems
                                ) {
                                    const updated = [...selectedValues, newValue];
                                    handleChange(config.key, JSON.stringify(updated));
                                }
                            }}
                            isDisabled={
                                selectedValues.length >= maxItems || config?.extra?.disabled || config?.internal === 1
                            }
                            chakraStyles={styleExtensions}
                        />
                        <HStack wrap="wrap" bg={backgroundColor}>
                            {selectedValues.map((value) => {
                                const label = config.options?.find((o) => o.value === value)?.label || value;
                                return (
                                    <HStack
                                        key={value}
                                        bg={bgColor}
                                        _hover={{
                                            bg: hoverColor,
                                        }}
                                        px={2}
                                        py={1}
                                        borderRadius="md"
                                        spacing={1}
                                    >
                                        <Text>{label}</Text>
                                        <Icon
                                            as={X}
                                            boxSize={6}
                                            color={"black"}
                                            cursor="pointer"
                                            onClick={config?.internal === 1 ? () => { } : () => {
                                                const updated = selectedValues.filter((v) => v !== value);
                                                handleChange(config.key, JSON.stringify(updated));
                                            }}
                                        />
                                    </HStack>
                                );
                            })}
                        </HStack>
                    </VStack>
                );
            case "string_commas":
                const values = allValues[config.key]?.split(",") || [""];
                return (
                    <VStack align="start" w={"full"}>
                        {values.map((value, index) => (
                            <HStack key={index} w={"full"}>
                                <Input
                                    isDisabled={config?.internal === 1}
                                    bgColor={backgroundColor}
                                    border={"1px solid transparent"}
                                    borderRadius={10}
                                    focusBorderColor={bgColor}
                                    type="text"
                                    value={value}
                                    w={"full"}
                                    onChange={(e) => {
                                        const newValues = [...values];
                                        newValues[index] = e.target.value;
                                        handleChange(config.key, newValues.join(","));
                                    }}
                                />
                                <Button
                                    w={"40px"}
                                    h={"40px"}
                                    onClick={config?.internal === 1 ? () => { } : () => {
                                        const newValues = values.filter((_, i) => i !== index);
                                        handleChange(config.key, newValues.join(","));
                                    }}
                                >
                                    <Icon as={Minus} w={"24px"} h={"24px"} />
                                </Button>
                            </HStack>
                        ))}
                        <Button
                            onClick={config?.internal === 1 ? () => { } : () => {
                                const newValues = [...values, ""];
                                handleChange(config.key, newValues.join(","));
                            }}
                        >
                            {t("integrations.addValue")}
                        </Button>
                    </VStack>
                );
            case "json_array":
                try {
                    const dataJson = JSON.parse(allValues[config.key])
                    return (
                        <VStack align="start" bg={backgroundColor} p={7} gap={5} borderRadius={"10px"} w={"full"}>
                            {dataJson.map((value, index) => {
                                return (
                                    <HStack key={index} w={"full"} p={5} bg={panelBgColor} borderRadius={"10px"}>
                                        <VStack padding={"10px"} w="full" gap={10}>
                                            <HStack w="full" gap={"50px"}>
                                                <VStack w="full">
                                                    <Text w={"full"} textAlign={"start"}>{t("integrations.name")}</Text>
                                                    <Input
                                                        isDisabled={config?.internal === 1}
                                                        focusBorderColor={bgColor}
                                                        type="text"
                                                        value={value["name"]}
                                                        w={"full"}
                                                        bg={backgroundColor}
                                                        borderColor={inputBorderColor}
                                                        _hover={{ borderColor: inputBorderColor }}
                                                        _focus={{ borderColor: bgColor, boxShadow: "none" }}
                                                        onChange={(e) => {
                                                            const newValue = e.target.value;
                                                            dataJson[index]["name"] = newValue;
                                                            if (newValue.length > 1024) {
                                                                setDisableButton(true);
                                                                toast({
                                                                    title: t("integrations.toastTitleError"),
                                                                    description: t("integrations.toastDescriptionError"),
                                                                    status: "warning",
                                                                    duration: 3000,
                                                                    isClosable: true,
                                                                })
                                                            } else {
                                                                setDisableButton(false);
                                                            }
                                                            handleChange(config.key, JSON.stringify(dataJson));
                                                        }} />
                                                </VStack>
                                                <VStack w="full">
                                                    <Text w={"full"} textAlign={"start"}>{t("integrations.status")}</Text>
                                                    <HStack bg={backgroundColor} mr={"auto"} pl={4} w={"full"} h={"40px"} borderRadius={"5px"}>
                                                        <Switch
                                                            isDisabled={config?.internal === 1}
                                                            isChecked={value["status"] === "true"}
                                                            onChange={(e) => {
                                                                dataJson[index]["status"] = e.target.checked.toString()
                                                                handleChange(config.key, JSON.stringify(dataJson))
                                                            }
                                                            }
                                                            sx={{
                                                                'span.chakra-switch__track': {
                                                                    _checked: {
                                                                        bg: bgColor,
                                                                    },
                                                                },
                                                            }}
                                                        />
                                                        <Text ml={2}>
                                                            {value["status"] === "true"
                                                                ? t("integrations.activated")
                                                                : t("integrations.deactivated")}
                                                        </Text>
                                                    </HStack>
                                                </VStack>
                                                <HStack>
                                                    <Box
                                                        w={"30px"}
                                                        h={"30px"}
                                                        mb={"auto"}
                                                        borderRadius={"50%"}
                                                        justifyItems={"center"}
                                                        bg={bgColor}
                                                        color={panelBgColor}
                                                        _hover={{ bg: hoverColor, cursor: "pointer" }}
                                                        onClick={config?.internal === 1 ? () => { } : () => {
                                                            if (!(openedJson.includes(index))) {
                                                                setOpenedJson((prev) => {
                                                                    return [...prev, index]
                                                                })
                                                            } else {
                                                                setOpenedJson((prev) => {
                                                                    let now = prev.filter((id) => id != index)
                                                                    return [...now]
                                                                })
                                                            }
                                                        }}
                                                    >
                                                        <Box mt={"5px"}>
                                                            <Icon as={openedJson.includes(index) ? IoArrowUp : IoArrowDown} w={"19px"} h={"19px"} />
                                                        </Box>
                                                    </Box>
                                                    <Box
                                                        w={"30px"}
                                                        h={"30px"}
                                                        mb={"auto"}
                                                        borderRadius={"50%"}
                                                        justifyItems={"center"}
                                                        bg={dataJson.length <= 1 ? "#17304F" : bgColor}
                                                        color={dataJson.length <= 1 ? "#94A3B8" : panelBgColor}
                                                        _hover={dataJson.length > 1 ? { bg: hoverColor, cursor: "pointer" } : { cursor: "not-allowed" }}
                                                        onClick={config?.internal === 1 ? () => { } : () => {
                                                            if (dataJson.length > 1) {
                                                                const newValue = dataJson.filter((_, i) => i !== index);
                                                                handleChange(config.key, JSON.stringify(newValue));
                                                            }
                                                        }}
                                                    >
                                                        <Box mt={"5px"}>
                                                            <Icon as={Minus} w={"19px"} h={"19px"} />
                                                        </Box>
                                                    </Box>
                                                </HStack>
                                            </HStack>
                                            {openedJson.includes(index) && Object.keys(value)
                                                .filter((key) => key !== "restrictions" && key != "name" && key != "status")
                                                .map((keys) => {
                                                    switch (keys) {
                                                        case "fields":
                                                            return (
                                                                <VStack key={keys} w="full" gap={6}>
                                                                    <Text w={"full"} fontSize={"25px"} fontWeight={"bold"}>{t("integrations." + keys)}</Text>
                                                                    <VStack align="start" w="full" padding={"10px"}>
                                                                        <SimpleGrid
                                                                            columns={[1, 2]}
                                                                            gap={6}
                                                                            w="full"
                                                                            mb={4}
                                                                        >
                                                                            {value[keys].map((field_value, field_index) => (
                                                                                <InputGroup
                                                                                    key={field_index}
                                                                                    w={"full"}
                                                                                >
                                                                                    <Input
                                                                                        isDisabled={config?.internal === 1}
                                                                                        focusBorderColor={bgColor}
                                                                                        type="text"
                                                                                        value={field_value}
                                                                                        w={"full"}
                                                                                        bg={backgroundColor}
                                                                                        borderColor={inputBorderColor}
                                                                                        _hover={{ borderColor: inputBorderColor }}
                                                                                        _focus={{ borderColor: bgColor, boxShadow: "none" }}
                                                                                        onChange={(e) => {
                                                                                            dataJson[index][keys][field_index] = e.target.value;
                                                                                            handleChange(config.key, JSON.stringify(dataJson));
                                                                                        }} />
                                                                                    <InputRightElement>
                                                                                        <Box
                                                                                            w={"25px"}
                                                                                            h={"25px"}
                                                                                            borderRadius={"3px"}
                                                                                            mr={3}
                                                                                            bg={bgColor}
                                                                                            _hover={{ bg: hoverColor, cursor: "pointer" }}
                                                                                            onClick={config?.internal === 1 ? () => { } : () => {
                                                                                                dataJson[index][keys] = dataJson[index][keys].filter((_, i) => i !== field_index);
                                                                                                handleChange(config.key, JSON.stringify(dataJson));
                                                                                            }}
                                                                                        >
                                                                                            <Icon as={Minus} w={"25px"} h={"25px"} />
                                                                                        </Box>
                                                                                    </InputRightElement>
                                                                                </InputGroup>
                                                                            ))}
                                                                        </SimpleGrid>
                                                                        <Button
                                                                            isDisabled={config?.internal === 1}
                                                                            bg={"transparent"}
                                                                            color={bgColor}
                                                                            border={`1px solid ${bgColor}`}
                                                                            _hover={{
                                                                                color: "white",
                                                                                bg: bgColor
                                                                            }}
                                                                            onClick={() => {
                                                                                let length = value[keys].length
                                                                                value[keys][length] = ""
                                                                                handleChange(config.key, JSON.stringify(dataJson));
                                                                            }}
                                                                        >
                                                                            {t("integrations.addField")}
                                                                        </Button>
                                                                    </VStack>
                                                                </VStack>
                                                            );
                                                        case "prompt":
                                                            return (
                                                                <VStack key={keys} w="full">
                                                                    <Text w={"full"} fontSize={"25px"} fontWeight={"bold"} >{t("integrations." + keys)}</Text>
                                                                    <Textarea
                                                                        isDisabled={config?.internal === 1}
                                                                        maxH={"200px"}
                                                                        value={value[keys]}
                                                                        w={"full"}
                                                                        bg={backgroundColor}
                                                                        borderColor={inputBorderColor}
                                                                        _hover={{ borderColor: inputBorderColor }}
                                                                        _focus={{ borderColor: bgColor, boxShadow: "none" }}
                                                                        onChange={(e) => {
                                                                            const newValue = e.target.value;
                                                                            dataJson[index][keys] = newValue;
                                                                            if (newValue.length > 1024) {
                                                                                setDisableButton(true);
                                                                                toast({
                                                                                    title: t("integrations.toastTitleError"),
                                                                                    description: t("integrations.toastDescriptionError"),
                                                                                    status: "warning",
                                                                                    duration: 3000,
                                                                                    isClosable: true,
                                                                                })
                                                                            } else {
                                                                                setDisableButton(false);
                                                                            }
                                                                            handleChange(config.key, JSON.stringify(dataJson));
                                                                        }} />
                                                                </VStack>
                                                            )
                                                        case "group":
                                                            return (
                                                                <VStack key={keys} w="full">
                                                                    <Text w={"full"} >{t("integrations." + keys)}</Text>
                                                                    <Input
                                                                        isDisabled={config?.internal === 1}
                                                                        focusBorderColor={bgColor}
                                                                        type="text"
                                                                        value={value[keys]}
                                                                        w={"full"}
                                                                        bg={backgroundColor}
                                                                        borderColor={inputBorderColor}
                                                                        _hover={{ borderColor: inputBorderColor }}
                                                                        _focus={{ borderColor: bgColor, boxShadow: "none" }}
                                                                        onChange={(e) => {
                                                                            const newValue = e.target.value;
                                                                            dataJson[index][keys] = newValue;
                                                                            if (newValue.length > 1024) {
                                                                                setDisableButton(true);
                                                                                toast({
                                                                                    title: t("integrations.toastTitleError"),
                                                                                    description: t("integrations.toastDescriptionError"),
                                                                                    status: "warning",
                                                                                    duration: 3000,
                                                                                    isClosable: true,
                                                                                })
                                                                            } else {
                                                                                setDisableButton(false);
                                                                            }
                                                                            handleChange(config.key, JSON.stringify(dataJson));
                                                                        }} />
                                                                </VStack>
                                                            )
                                                    }
                                                })}
                                        </VStack>
                                    </HStack>
                                )
                            })}
                            <Button
                                isDisabled={config?.internal === 1}
                                ml={"auto"}
                                bg={bgColor}
                                _hover={{
                                    bg: hoverColor
                                }}
                                onClick={() => {
                                    let length = dataJson.length
                                    dataJson[length] = dataJson[length - 1]
                                    handleChange(config.key, JSON.stringify(dataJson));
                                }}
                            >
                                {t("integrations.addValue")}
                            </Button>
                        </VStack>
                    );
                } catch (error) {
                    const message = error instanceof Error ? error.message : String(error);
                    showError(message)
                    return (
                        <></>
                    )
                }
            case "string":
                if (checkForKeys(config.key)) {
                    return (
                        <InputGroup>
                            <Input
                                w={"full"}
                                isDisabled={config?.internal === 1}
                                bgColor={backgroundColor}
                                border={"1px solid transparent"}
                                borderRadius={10}
                                focusBorderColor={bgColor}
                                type={showField.includes(config.key) ? "text" : "password"}
                                value={allValues[config.key] || ""}
                                onChange={(e) => handleChange(config.key, e.target.value)}
                            />
                            <InputRightElement>
                                <Button
                                    variant={"link"}
                                    onClick={() => { handleShowField(config.key) }}
                                >
                                    {showField.includes(config.key) ? <ViewOffIcon /> : <ViewIcon />}
                                </Button>
                            </InputRightElement>
                        </InputGroup>
                    );
                } else {
                    return (
                        <Input
                            w={"full"}
                            isDisabled={config?.internal === 1}
                            bgColor={backgroundColor}
                            border={"1px solid transparent"}
                            borderRadius={10}
                            focusBorderColor={bgColor}
                            type="text"
                            value={allValues[config.key] || ""}
                            onChange={(e) => handleChange(config.key, e.target.value)}
                        />
                    );
                }
            default:
                if (checkForKeys(config.key)) {
                    return (
                        <InputGroup>
                            <Input
                                w={"full"}
                                isDisabled={config?.internal === 1}
                                bgColor={backgroundColor}
                                border={"1px solid transparent"}
                                borderRadius={10}
                                focusBorderColor={bgColor}
                                type={showField.includes(config.key) ? "text" : "password"}
                                value={allValues[config.key] || ""}
                                onChange={(e) => handleChange(config.key, e.target.value)}
                            />
                            <InputRightElement>
                                <Button
                                    variant={"link"}
                                    onClick={() => { handleShowField(config.key) }}
                                >
                                    {showField.includes(config.key) ? <ViewOffIcon /> : <ViewIcon />}
                                </Button>
                            </InputRightElement>
                        </InputGroup>
                    );
                } else {
                    return (
                        <Input
                            w={"full"}
                            isDisabled={config?.internal === 1}
                            bgColor={backgroundColor}
                            border={"1px solid transparent"}
                            borderRadius={10}
                            focusBorderColor={bgColor}
                            type="text"
                            value={allValues[config.key] || ""}
                            onChange={(e) => handleChange(config.key, e.target.value)}
                        />
                    );
                }
        }
    };

    return {
        checkForKeys,
        renderInputField,
        handleFieldDirection
    }
}
