import React from "react";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaReddit,
  FaTelegram,
  FaTwitter,
  FaWhatsapp,
} from "react-icons/fa";

interface NetWorkIconProps {
  network: string;
}
const iconsMap: { [key: string]: JSX.Element } = {
  WHATSAPP: <FaWhatsapp color="green" size="12px" />,
}
const NetworkIcon: React.FC<NetWorkIconProps> = ({ network="WHATSAPP" }) => {
  const icon = iconsMap[network.toUpperCase()];
  return icon || null;
};
export default NetworkIcon;