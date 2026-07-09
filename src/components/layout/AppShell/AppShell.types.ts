import { Translation } from "@component/types/types";
import { ReactNode } from "react";

export interface AppShellProps {
    children: ReactNode;
    t: Translation;
    title?: string;
    showBackButton?: boolean;
    onBackButtonClick?: () => void;
}