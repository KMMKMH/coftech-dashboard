import React, { useState, useEffect } from "react";
import { Box, Button, Flex, HStack, Text } from "@chakra-ui/react";
import { Select } from "chakra-react-select";
import useCoftechSelect from "@component/hooks/useCoftechSelect";
import useCoftechColors from "@component/hooks/useCoftechColors";

interface CoftechCronProps {
    t: (key: string) => string;
    value: string;
    isClearable: boolean;
    onChange: (val: string) => void;
    disabled?: boolean;
    allowedPeriods?: string[];
}

const CoftechCron = ({
    t,
    value,
    isClearable,
    onChange,
    disabled = false,
    allowedPeriods = ["Year", "Month", "Week", "Day", "Hour", "Minute"],
}: CoftechCronProps) => {
    const [parts, setParts] = useState(["*", "*", "*", "*", "*"]);
    const [Every, setEvery] = useState<number>();

    const loadMinutes = ["Year", "Month", "Week", "Day", "Hour"].includes(allowedPeriods[Every])
    const loadHours = ["Year", "Month", "Week", "Day"].includes(allowedPeriods[Every])
    const loadDays = ["Year", "Month", "Week"].includes(allowedPeriods[Every])
    const loadDayOfMonth = ["Year", "Month"].includes(allowedPeriods[Every])
    const loadMonths = ["Year"].includes(allowedPeriods[Every])

    const { cron, disabled: cronDisabled } = useCoftechSelect()
    const {
        bgColor,
        hoverColor
    } = useCoftechColors()

    const updateInitialEvery = (parts: string[]) => {
        if (!(parts[3].includes("*"))) {
            setEvery(0)
        } else if (!(parts[2].includes("*"))) {
            setEvery(1)
        } else if (!(parts[4].includes("*"))) {
            setEvery(2)
        } else if (!(parts[1].includes("*"))) {
            setEvery(3)
        } else if (!(parts[0].includes("*"))) {
            setEvery(4)
        } else {
            setEvery(5)
        }
    }

    useEffect(() => {
        if (allowedPeriods.length === 6) {
            const split = value?.split(" ") ?? ["*", "*", "*", "*", "*"];
            if (split.length === 5) {
                updateInitialEvery(split);
            }
        } else {
            setEvery(allowedPeriods.length - 1)
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if (value) {
            const split = value?.split(" ") ?? ["*", "*", "*", "*", "*"];
            if (split.length === 5) {
                setParts(split);
            }
        }
    }, [value]);

    const updateEvery = (newEvery: number) => {
        setEvery(newEvery);

        const newParts = [...parts];
        const period = allowedPeriods[newEvery];

        for (let i = 0; i < 5; i++) {
            newParts[i] = "*";
        }

        switch (period) {
            case "Minute":
                break;

            case "Hour":
                newParts[0] = parts[0] || "0";
                break;

            case "Day":
                newParts[0] = parts[0] || "0";
                newParts[1] = parts[1] || "0";
                break;

            case "Week":
                newParts[0] = parts[0] || "0";
                newParts[1] = parts[1] || "0";
                newParts[4] = parts[4] || "0";
                break;

            case "Month":
                newParts[0] = parts[0] || "0";
                newParts[1] = parts[1] || "0";
                newParts[4] = parts[4] || "0";
                newParts[2] = parts[2] || "1";
                break;

            case "Year":
                newParts[0] = parts[0] || "0";
                newParts[1] = parts[1] || "0";
                newParts[4] = parts[4] || "0";
                newParts[2] = parts[2] || "1";
                newParts[3] = parts[3] || "1";
                break;

            default:
                break;
        }
        onChange?.(newParts.join(" "));
    };

    const update = (i: number, v: string) => {
        const newParts = [...parts];
        newParts[i] = v;
        onChange?.(newParts.join(" "));
    };

    const clear = () => {
        const newParts = ["*", "*", "*", "*", "*"];
        onChange?.(newParts.join(" "));
    };

    const periods = Array.from({ length: allowedPeriods.length }, (_, i) =>
        i
    );
    const allowedOption = (periods || []).map((value: number) => ({
        value: value,
        label: t(`cron.periods.${allowedPeriods[value].toLowerCase()}`)
    }))

    const minutesoOfTheHour = Array.from({ length: 60 }, (_, i) =>
        i.toString().padStart(2, "0")
    );
    const minutes = Array.from({ length: 60 }, (_, i) =>
        i
    );
    const minutesOptions = minutes.map((value) => ({
        value: value,
        label: minutesoOfTheHour[value]
    }))

    const hoursOfTheDay = Array.from({ length: 24 }, (_, i) =>
        i.toString().padStart(2, "0")
    );
    const hours = Array.from({ length: 24 }, (_, i) =>
        i
    );
    const hoursOptions = hours.map((value) => ({
        value: value,
        label: hoursOfTheDay[value]
    }))

    const daysOfTheWeek = [
        t("cron.days.sunday"),
        t("cron.days.monday"),
        t("cron.days.tuesday"),
        t("cron.days.wednesday"),
        t("cron.days.thursday"),
        t("cron.days.friday"),
        t("cron.days.saturday")
    ]
    const days = Array.from({ length: 7 }, (_, i) =>
        i
    );
    const daysOptions = days.map((value) => ({
        value: value,
        label: daysOfTheWeek[value]
    }))

    const dayOfTheMonth = Array.from({ length: 31 }, (_, i) =>
        (i + 1).toString().padStart(2, "0")
    );
    const day = Array.from({ length: 31 }, (_, i) =>
        i + 1
    );
    const daysOfTheMonthOptions = day.map((value) => ({
        value: value,
        label: dayOfTheMonth[value - 1]
    }))

    const months = [
        t("cron.months.january"),
        t("cron.months.february"),
        t("cron.months.march"),
        t("cron.months.april"),
        t("cron.months.may"),
        t("cron.months.june"),
        t("cron.months.july"),
        t("cron.months.august"),
        t("cron.months.september"),
        t("cron.months.october"),
        t("cron.months.november"),
        t("cron.months.december")
    ]
    const month = Array.from({ length: 12 }, (_, i) =>
        i + 1
    );
    const monthsOptions = month.map((value) => ({
        value: value,
        label: months[value - 1]
    }))

    const createSelect = (
        placeHolder: string,
        text: string,
        options: any[],
        variable: any,
        setVar: any,
        index: number | null
    ) => {
        if (options.length > 1) {
            return (
                <HStack minW="fit-content">
                    <Text ml={2} whiteSpace="nowrap">{text}</Text>
                    <Select
                        placeholder={placeHolder}
                        size="sm"
                        isClearable={isClearable && index != null}
                        menuPlacement="top"
                        isDisabled={disabled}
                        isSearchable={false}
                        value={options.filter((option) => index != null ? option.value === Number(variable[index]) : option.value === variable)}
                        options={options}
                        onChange={index != null ? (e) => setVar(index, e == null ? "*" : e.value) : (e) => updateEvery(e.value)}
                        focusBorderColor={bgColor}
                        chakraStyles={cron}
                    />
                </HStack>
            )
        }

        return (
            <HStack minW="fit-content">
                <Text ml={2} whiteSpace="nowrap">{text}</Text>
                <Select
                    size="sm"
                    isDisabled={true}
                    value={options.filter((option) => index != null ? option.value === Number(variable[index]) : option.value === variable)}
                    chakraStyles={cronDisabled}
                />
            </HStack>
        )
    }

    return (
        <Flex
            direction={"row"}
            gap={2}
            flexWrap="wrap"
            align="flex-start"
            w="full"
        >
            {createSelect("", t("cron.every"), allowedOption, Every, setEvery, null)}
            {loadMonths && (
                <>
                    {createSelect(t("cron.placeholders.month"), t("cron.in"), monthsOptions, parts, update, 3)}
                </>
            )}
            {loadDayOfMonth && (
                <>
                    {createSelect(t("cron.placeholders.dayMonth"), t("cron.on"), daysOfTheMonthOptions, parts, update, 2)}
                </>
            )}
            {loadDays && (
                <>
                    {createSelect(t("cron.placeholders.dayWeek"), loadDayOfMonth ? t("cron.and") : t("cron.on"), daysOptions, parts, update, 4)}
                </>
            )}
            {loadHours && (
                <>
                    {createSelect(t("cron.placeholders.hour"), t("cron.at"), hoursOptions, parts, update, 1)}
                </>
            )}
            {loadMinutes && (
                <>
                    {createSelect(t("cron.placeholders.minute"), loadHours ? t("cron.colon") : t("cron.at_minute"), minutesOptions, parts, update, 0)}
                </>
            )}
            {isClearable && (
                <Button
                    ml={2}
                    size={"sm"}
                    bg={bgColor}
                    color={"white"}
                    px={5}
                    py={0}
                    onClick={clear}
                    _hover={{
                        bg: hoverColor
                    }}>
                    {t("cron.clear")}
                </Button>
            )}
        </Flex>
    );
};

export default CoftechCron