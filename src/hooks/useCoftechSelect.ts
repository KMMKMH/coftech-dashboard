import useCoftechColors from "@component/hooks/useCoftechColors";


const useCoftechSelect = () => {

    const {
        bgColor,
        panelBgColor,
        backgroundColor,
        descriptionColor,
        textColor,
        titleColor
    } = useCoftechColors();

    interface CustomSelectStyles {
        containerBorderRadius?: number;
        containerPointerEvents?: string;
        containerBg?: string;
        containerCursor?: string;
        containerBorder?: string;
        containerColor?: string;
        containerWidth?: string;
        zIndex?: number;

        dropdownIndicatorColor?: string;
        dropdownIndicatorWidth?: string;
        dropdownIndicatorBg?: string;

        controlBorderRadius?: number;
        controlBg?: string;
        controlBorderColor?: string;
        controlBoxShadow?: string;
        controlHoverBorderColor?: string;

        menuListBg?: string;
        menuListColor?: string;
        menuListPaddingY?: number;
        menuListBorderRadius?: number;
        menuListShadow?: string;
        menuListDarkBg?: string;
        menuListDarkShadow?: string;
        hideScrollbar?: boolean;

        optionSelectedBg?: string;
        optionSelectedColor?: string;
        optionBg?: string;
        optionColor?: string;
        optionHoverBg?: string;
        optionHoverColor?: string;
    }

    const createSelectStyle = (customStyles: CustomSelectStyles = {}) => {

        const hideScrollbar = customStyles.hideScrollbar ?? true;

        return {
            container: (provided: any) => ({
                ...provided,
                borderRadius: customStyles.containerBorderRadius ?? 20,
                background: customStyles.containerBg ?? panelBgColor,
                cursor: customStyles.containerCursor ?? "pointer",
                pointerEvents: customStyles.containerPointerEvents ?? "auto",
                border: customStyles.containerBorder ?? "1px transparent",
                color: customStyles.containerColor ?? titleColor,
                width: customStyles.containerWidth ?? "inherit",
                zIndex: customStyles.zIndex ?? null
            }),

            dropdownIndicator: (provided: any) => ({
                ...provided,
                color: customStyles.dropdownIndicatorColor ?? bgColor,
                width: customStyles.dropdownIndicatorWidth ?? "20px",
                background: customStyles.dropdownIndicatorBg ?? panelBgColor,
            }),

            control: (provided: any) => ({
                ...provided,
                borderRadius: customStyles.controlBorderRadius ?? 20,
            }),

            menuList: (provided: any) => ({
                ...provided,
                background: customStyles.menuListBg ?? panelBgColor,
                color: customStyles.menuListColor ?? titleColor,
                py: customStyles.menuListPaddingY ?? 0,
                borderRadius: customStyles.menuListBorderRadius ?? 10,
                _dark: {
                    "--menu-bg": customStyles.menuListDarkBg ?? backgroundColor,
                    "--menu-shadow": customStyles.menuListDarkShadow ?? "shadows.dark-lg",
                },
                "&::-webkit-scrollbar": { display: hideScrollbar ? "none" : "auto" },
                "-ms-overflow-style": hideScrollbar ? "none" : "auto",
                "scrollbar-width": hideScrollbar ? "none" : "auto",
            }),

            option: (provided: any) => ({
                ...provided,
                _selected: {
                    bg: customStyles.optionSelectedBg ?? bgColor,
                    color: customStyles.optionSelectedColor ?? textColor,
                },
            }),
        }
    };

    const style = createSelectStyle();

    const styleLightBorder = createSelectStyle({
        containerBorder: ""
    });

    const styleExtensions = createSelectStyle({
        containerBorderRadius: 10,
        containerBg: backgroundColor,
        containerWidth: "full",
        dropdownIndicatorBg: backgroundColor,
        controlBorderRadius: 10,
    });

    const cron = createSelectStyle({
        containerBorderRadius: 10,
        containerBg: backgroundColor,
        containerWidth: "auto",
        dropdownIndicatorBg: backgroundColor,
        controlBorderRadius: 10,
    });

    const disabled = createSelectStyle({
        containerBorderRadius: 10,
        containerBg: backgroundColor,
        containerWidth: "auto",
        dropdownIndicatorColor: titleColor,
        dropdownIndicatorBg: backgroundColor,
        controlBorderRadius: 10,
        containerPointerEvents: "none"
    })

    return {
        style,
        styleLightBorder,
        styleExtensions,
        cron,
        disabled,
        createSelectStyle
    }
}

export default useCoftechSelect