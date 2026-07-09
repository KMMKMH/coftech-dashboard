import { BoxProps, FlexProps } from "@chakra-ui/react";
import { Translation } from "@component/types/types";
import { LinkItemProps } from "@component/utils";
import { ReactNode } from "react";
import { IconType } from "react-icons";

export interface SidebarProps extends BoxProps {
    onClose: () => void;
    t: Translation;
    selectedLanguage: string;
    setSelectedLanguage: (language: string) => void;
    isOpenCollapse: boolean;
    handleCollapse: (value: boolean) => void;
}

export interface NavItemProps extends FlexProps {
    t: Translation;
    name: string;
    icon: IconType;
    path?: string;
    children: ReactNode;
    isOpenCollapse: boolean;
    isBottomLinkItems?: boolean;
    hasScroll?: boolean;
}

export interface NavItemWithSubMenuProps extends FlexProps {
    t: Translation;
    link: LinkItemProps;
    setSubMenuOpen: (param: boolean) => void,
    isViews?: boolean;
    isOpenCollapse: boolean;
    hasScroll?: boolean;
}