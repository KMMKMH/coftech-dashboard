import React from "react";
import {
    IconButton,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    Icon,
    Text,
    Spinner,
    Box
} from "@chakra-ui/react";
import { FaEllipsisV } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import useCoftechColors from "@component/hooks/useCoftechColors";
import { IconType } from "react-icons";

interface MenuItemConfig {
    label: string;
    icon: IconType;
    onClick: () => void;
}

interface CoftechMenuProps {
    isMobile: boolean;
    items: MenuItemConfig[];
    loading: boolean;
}

const CoftechMenu: React.FC<CoftechMenuProps> = ({ items, isMobile, loading }) => {
    const { t } = useTranslation("common");
    const { bgColor, panelBgColor, backgroundColor, hoverColor } = useCoftechColors();

    return (
        <Menu closeOnSelect={false}>
            <MenuButton
                as={IconButton}
                icon={<FaEllipsisV />}
                onClick={(e) => e.stopPropagation()}
                fontSize={isMobile ? "12px" : null}
                size={isMobile ? "sm" : null}
                color={bgColor}
                bgColor={backgroundColor}
                border={`1px solid ${bgColor}`}
            />
            <MenuList
                bgColor={panelBgColor}
                padding={2}
                maxW={"200px"}
                border={`1px solid ${bgColor}`}
                boxShadow={`0px 0px 10px 1px ${bgColor}`}
            >
                {items?.length > 0 ? items.map((item, i) => (
                    <MenuItem
                        key={i}
                        marginY={"5px"}
                        bgColor={backgroundColor}
                        borderRadius={"10px"}
                        _hover={{
                            bgColor: hoverColor
                        }}
                        icon={loading ? null : <Icon as={item.icon} fontSize={"x-large"} color={bgColor} />}
                        onClick={(e) => {
                            e.stopPropagation();
                            if (!loading) {
                                item.onClick()
                            }
                        }}
                    >
                        {loading ? (
                            <Box width={"full"}>
                                <Box margin={"auto"} w={"fit-content"}>
                                    <Spinner size={"md"} color={bgColor}></Spinner>
                                </Box>
                            </Box>
                        ) : (
                            <Text>{t(`chats.${item.label}`)}</Text>
                        )}
                    </MenuItem>
                )) : (
                    <></>
                )}
            </MenuList>
        </Menu>
    );
};

export default CoftechMenu;
