import { FlexProps } from "@chakra-ui/react";
import { User } from "@component/store/auth";
import { Translation } from "@component/types/types";

export interface HeaderProps extends FlexProps {
  onOpen: () => void;
  t?: Translation;
  title?: string;
  showBackButton?: boolean;
  onBackButtonClick?: () => void;
  selectedLanguage: string;
  setSelectedLanguage: (language: string) => void;
}

export interface UserMenuProps {
  t: Translation,
  user: User,
  userPhoto: string | null,
  onOpenModal: () => void
}