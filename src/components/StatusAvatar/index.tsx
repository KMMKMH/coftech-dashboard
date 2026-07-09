import React from "react";
import { Avatar, Box } from "@chakra-ui/react";

interface StatusAvatarProps {
  size?: string;
  name: string;
  src: string;
  status: "active" | "suspended";
  style?: React.CSSProperties;
}

const StatusAvatar: React.FC<StatusAvatarProps> = ({
  size,
  name,
  src,
  status,
  style,
}) => {
  const borderColor = status === "active" ? "green.200" : "gray.400";

  return (
    <Box
      border={`1px solid ${borderColor}`}
      backgroundColor={`${borderColor}`}
      borderRadius="full"
      display="inline-block"
      p="0.5%"
    >
      <Avatar size={size} name={name} src={src} style={style}/>
    </Box>
  );
};
export default StatusAvatar;