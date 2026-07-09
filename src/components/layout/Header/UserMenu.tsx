import { MenuButton, HStack, Box, MenuList, MenuItem, Icon, Menu, Avatar, Text } from "@chakra-ui/react"
import useCoftechColors from "@component/hooks/useCoftechColors";
import router from "next/router"
import { FiChevronDown } from "react-icons/fi"
import { UserMenuProps } from "..";



const UserMenu = ({ t, user, userPhoto, onOpenModal }: UserMenuProps) => {

    const {
        bgColor,
        panelBgColor,
        borderColor,
        backgroundColor,
    } = useCoftechColors();

    return (
        <Menu>
            <MenuButton
                bg={{ base: "transparent", md: panelBgColor }}
                px={{ base: 0, md: 2 }}
                borderRadius={100}
                transition="all 0.3s"
                _focus={{ boxShadow: "none" }}
                boxShadow="0px 2px 4px -2px #0F172A0F, 0px 4px 8px -2px #0F172A1A"
            >
                <HStack>
                    <Box
                        display="flex"
                        borderRadius={{ base: 1000, md: "0" }}
                        borderColor={{ base: borderColor, md: "transparent" }}
                        borderWidth={2}
                        p={{ base: 0, md: 2 }}
                        alignItems="center"
                        gap={"6px"}
                    >
                        {userPhoto ? (
                            <Avatar size="sm" src={userPhoto} mr={{ base: 0, md: 2 }} />
                        ) : (
                            <Avatar
                                size="sm"
                                name={`${user?.first_name} ${user?.last_name}`}
                                mr={{ base: 0, md: 2 }}
                            />
                        )}
                        <Box display={{ base: "none", md: "block" }}>
                            <Text fontWeight="bold" fontSize={14} textAlign={"left"}>
                                {user?.first_name} {user?.last_name}
                            </Text>
                            <Text fontSize={12} color={bgColor} textAlign={"left"}>
                                {user?.rol_name}
                            </Text>
                        </Box>
                    </Box>
                    <Box display={{ base: "none", md: "flex" }} pr={"4px"}>
                        <Icon as={FiChevronDown} color={bgColor} />
                    </Box>
                </HStack>
            </MenuButton>
            <MenuList
                bg={backgroundColor}
                px={"8px"}
                display={"flex"}
                flexDirection={"column"}
                gap={"8px"}
            >
                <MenuItem
                    onClick={() =>
                        router.push(`/users/${user?.company_id}/${user?.uuid_unique}`)
                    }
                    borderRadius={"5px"}
                    bg={backgroundColor}
                    _hover={{
                        bg: bgColor,
                        color: "white",
                    }}
                >
                    {t(`header.editProfile`)}
                </MenuItem>
                <MenuItem
                    onClick={onOpenModal}
                    borderRadius={"5px"}
                    bg={backgroundColor}
                    _hover={{
                        bg: bgColor,
                        color: "white",
                    }}
                >
                    {t(`header.logout`)}
                </MenuItem>
            </MenuList>
        </Menu>
    )
}

export default UserMenu