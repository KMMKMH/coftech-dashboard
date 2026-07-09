import { Robot } from "@component/components/Icons/Robot";
import {
  HomeLine,
  Users01,
  CpuChip01,
  Signal03,
  MessageDotsCircle,
  UserSquare,
  HelpOctagon,
  Folder,
  Settings01,
  LogOut01,
  GitBranch01,
  PuzzlePiece01,
  Database01,
  Database02,
  Dataflow01,
  Wallet01,
  ShieldZap,
  MessageQuestionCircle,
  LayersThree01,
  Phone,
  Calendar,
  Link03,
  Perspective02,
  Columns03,
  Image03,
  LayoutAlt03,
  Plus,
  Home01,
  Building01,
  Dataflow03,
  MessageTextSquare02,
  ArrowCircleBrokenLeft,
} from "@untitled-ui/icons-react";
import { IconType } from "react-icons";
import { FaList, FaRobot } from "react-icons/fa";
export interface LinkItemProps {
  name: string;
  path?: string;
  children?: LinkItemProps[];
  type?: string;
  icon: IconType;
  allowedRoles: string[];
}
export const allLinkItems: Array<LinkItemProps> = [
  {
    name: "home",
    icon: Home01,
    path: "/",
    allowedRoles: ["SUPERADMIN", "ADMIN"],
  },
  {
    name: "adminPanel",
    icon: ShieldZap,
    children: [
      {
        name: "nps",
        path: "/nps",
        icon: MessageQuestionCircle,
        allowedRoles: ["SUPERADMIN"],
      },
      {
        name: "extensions",
        path: "/extensions",
        icon: PuzzlePiece01,
        allowedRoles: ["SUPERADMIN"],
      },
    ],
    type: "subMenu",
    allowedRoles: ["SUPERADMIN"],
  },
  {
    name: "reserve",
    icon: Phone,
    children: [
      {
        name: "calendar",
        path: "/calendar",
        icon: Calendar,
        allowedRoles: ["SUPERADMIN"],
      },
      {
        name: "eventType",
        path: "/event-type",
        icon: Link03,
        allowedRoles: ["SUPERADMIN"],
      },
    ],
    type: "subMenu",
    allowedRoles: ["SUPERADMIN"],
  },
  {
    name: "views",
    icon: Perspective02,
    children: [
      {
        name: "create",
        path: "/create",
        icon: Plus,
        allowedRoles: ["ALL"],
      },
    ],
    type: "subMenu",
    allowedRoles: ["SUPERADMIN"],
  },
  {
    name: "company",
    icon: Building01,
    path: "/company",
    allowedRoles: ["SUPERADMIN", "ADMIN"],
  },
  {
    name: "bots",
    icon: Robot,
    path: "/bots",
    allowedRoles: ["SUPERADMIN", "ADMIN"],
  },
  {
    name: "prompt",
    icon: Dataflow03,
    path: "/prompts",
    allowedRoles: ["SUPERADMIN", "ADMIN"],
  },
  {
    name: "fileManager",
    icon: Folder,
    path: "/file-manager",
    allowedRoles: ["SUPERADMIN", "ADMIN"],
  },
  {
    name: "chats",
    icon: MessageTextSquare02,
    path: "/chats",
    allowedRoles: ["SUPERADMIN", "ADMIN"],
  },
  {
    name: "users",
    icon: Users01,
    path: "/users",
    allowedRoles: ["SUPERADMIN", "ADMIN"],
  },
  {
    name: "integrations",
    icon: PuzzlePiece01,
    path: "/integrations",
    allowedRoles: ["SUPERADMIN", "ADMIN"],
  },
  {
    name: "campaigns",
    icon: GitBranch01,
    path: "/campaigns",
    allowedRoles: ["SUPERADMIN"],
  },
  {
    name: "activity",
    icon: FaList,
    path: "/activity",
    allowedRoles: ["SUPERADMIN", "ADMIN"],
  },
];
export const BottomLinkItems: Array<LinkItemProps> = [
  {
    name: "support",
    icon: HelpOctagon,
    path: "/support",
    allowedRoles: ["SUPERADMIN", "ADVISOR", "MANAGER", "STAFF", "RESELLER", "GUEST"],
  },
  {
    name: "settings",
    icon: Settings01,
    path: "/settings",
    allowedRoles: ["ALL"],
  },
  { name: "logout", icon: ArrowCircleBrokenLeft, path: "", allowedRoles: ["ALL"] },
];
