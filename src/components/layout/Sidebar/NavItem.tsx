/* eslint-disable react-hooks/exhaustive-deps */
import { useDisclosure, useColorModeValue, useBreakpointValue, Box, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, Heading, ModalFooter, Tooltip, Flex, Modal, Button, Icon } from "@chakra-ui/react";
import useCoftechColors from "@component/hooks/useCoftechColors";
import { useAuthStore } from "@component/store/auth";
import { getBaseRouterPath } from "@component/utils/router";
import { AlertCircle } from "@untitled-ui/icons-react";
import { useRouter } from "next/router";
import { useRef, useEffect } from "react";
import { NavItemProps } from "..";

export const NavItem = ({ t, name, icon, path = "/", children, isOpenCollapse, isBottomLinkItems = false, hasScroll = false, ...rest }: NavItemProps) => {
    const router = useRouter();
    const { isOpen, onOpen, onClose } = useDisclosure();

    const { bgColor, hoverColor, panelBgColor } = useCoftechColors();

    const stageBg = useColorModeValue("", "coftech.background.dark");

    const stageColor = useColorModeValue("#475569", "#94A3B8");

    const handleLogout = () => {
        useAuthStore.getState().logout();
    };

    const onClick = () => {
        if (path) {
            router.push(path);
        }
    };

    const navItemRefs = useRef({});
    const setNavItemRef = (path) => (el) => {
        navItemRefs.current[path] = el;
    };

    const baseRouterPath = getBaseRouterPath(router)

    useEffect(() => {
        const target = navItemRefs.current[baseRouterPath];
        if (target) {
            target.scrollIntoView({ behavior: "smooth", block: "center" });
        }
    }, [router.pathname]);

    const isMobile = useBreakpointValue({ base: true, md: false });
    const isActive = baseRouterPath === path

    if (children === "Salir" || children === "Logout") {
        return (
            <>
                <Tooltip
                    label={t(`header.${name}`)}
                    placement="right"
                    isDisabled={isOpenCollapse || isMobile}
                    hasArrow
                >
                    <Box
                        as="a"
                        onClick={onOpen}
                        style={{ textDecoration: "none" }}
                        _focus={{ boxShadow: "none" }}
                        w="full"
                    >
                        <Flex
                            p="8px 12px"
                            mx="4"
                            borderRadius="lg"
                            role="group"
                            cursor="pointer"
                            bg={isActive ? bgColor : stageBg}
                            color={isActive ? panelBgColor : stageColor}
                            _hover={{
                                bg: isActive ? bgColor : hoverColor,
                                color: isActive ? panelBgColor : "white",
                            }}
                            wrap="nowrap"
                            {...rest}
                            ref={setNavItemRef(path)}
                        >
                            {icon ? (
                                <Icon
                                    as={icon}
                                    fontSize="20"
                                    color={isActive ? panelBgColor : "inherit"}
                                    transition="color 0.3s, margin-left 0.1s"
                                    ml={!isOpenCollapse && (isBottomLinkItems || !hasScroll) ? 0.5 : 0}
                                />
                            ) : (
                                <Box
                                    fontSize="20"
                                    fontWeight="bold"
                                    textTransform="uppercase"
                                    color={isActive ? panelBgColor : "inherit"}
                                    transition="color 0.3s, margin-left 0.1s"
                                    ml={!isOpenCollapse && (isBottomLinkItems || !hasScroll) ? 0.5 : 0}
                                >
                                    {typeof children === "string" ? children.charAt(0) : "?"}
                                </Box>
                            )}

                            <Box
                                transition={{ base: "none", md: "opacity 0.3s, height 0.3s" }}
                                opacity={{ base: 1, md: isOpenCollapse ? 1 : 0 }}
                                pointerEvents={{ base: "auto", md: isOpenCollapse ? "auto" : "none" }}
                                height={{ base: "auto", md: "10px" }}
                                fontSize={14}
                                minW={"100px"}
                                ml={4}
                            >
                                {children}
                            </Box>
                        </Flex>
                    </Box>
                </Tooltip>
                <Modal isOpen={isOpen} onClose={onClose} variant="coftechModal">
                    <ModalOverlay />
                    <ModalContent borderRadius="20px" p="12" gap="2.5rem">
                        <ModalHeader>
                            <Flex justify="center" align="center" width="100%">
                                <Icon
                                    alignSelf="center"
                                    mr="4"
                                    color={bgColor}
                                    boxSize="10"
                                    as={AlertCircle}
                                />
                            </Flex>
                        </ModalHeader>
                        <ModalCloseButton />
                        <ModalBody padding="0">
                            <Flex display="flex" align="center">
                                <Heading
                                    as="h4"
                                    padding="0"
                                    textAlign="center"
                                    fontWeight="bold"
                                    fontSize="24px"
                                >
                                    {t(`questions.confirmLogout`)}
                                </Heading>
                            </Flex>
                        </ModalBody>
                        <ModalFooter padding="0">
                            <Flex
                                width={"100%"}
                                align="center"
                                justifyContent="center"
                                flexDirection="column"
                                gap="0.5rem"
                            >
                                <Button
                                    w={"100%"}
                                    bg={bgColor}
                                    color={"white"}
                                    _hover={{ backgroundColor: hoverColor, color: "white" }}
                                    onClick={handleLogout}
                                >
                                    {t(`answers.affirmativeLogout`)}
                                </Button>
                                <Button
                                    w={"100%"}
                                    _hover={{ backgroundColor: hoverColor, color: "white" }}
                                    onClick={onClose}
                                >
                                    {t(`answers.negativeLogout`)}
                                </Button>
                            </Flex>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            </>
        );
    }

    return (
        <Tooltip
            label={t(`header.${name}`)}
            placement="right"
            isDisabled={isOpenCollapse || isMobile}
            hasArrow
        >
            <Box
                as="a"
                onClick={onClick}
                style={{ textDecoration: "none" }}
                _focus={{ boxShadow: "none" }}
                w="full"
                px={isBottomLinkItems || !hasScroll ? 4 : 3}
            >
                <Flex
                    p={path.includes("/bots") ? "8px 0px 8px 11px" : "8px 12px"}
                    w="full"
                    borderRadius="lg"
                    cursor="pointer"
                    bg={isActive ? bgColor : stageBg}
                    color={isActive ? panelBgColor : stageColor}
                    _hover={{
                        bg: isActive ? bgColor : hoverColor,
                        color: isActive ? panelBgColor : "white",
                    }}
                    transition="all 0.3s ease"
                    {...rest}
                    ref={setNavItemRef(path)}
                >
                    {icon ? (
                        <Icon
                            as={icon}
                            fontSize={path.includes("/bots") ? "23" : "20"}
                            color={isActive ? panelBgColor : "inherit"}
                            transition="color 0.3s, margin-left 0.1s"
                            ml={!isOpenCollapse && (isBottomLinkItems || !hasScroll) ? 0.5 : 0}
                        />
                    ) : (
                        <Box
                            fontSize="20"
                            fontWeight="bold"
                            textTransform="uppercase"
                            color={isActive ? panelBgColor : "inherit"}
                            transition="color 0.3s, margin-left 0.1s"
                            ml={!isOpenCollapse && (isBottomLinkItems || !hasScroll) ? 0.5 : 0}
                        >
                            {typeof children === "string" ? children.charAt(0) : "?"}
                        </Box>
                    )}

                    <Box
                        transition={{ base: "none", md: "opacity 0.3s, height 0.3s" }}
                        opacity={{ base: 1, md: isOpenCollapse ? 1 : 0 }}
                        pointerEvents={{ base: "auto", md: isOpenCollapse ? "auto" : "none" }}
                        height={{ base: "auto", md: "10px" }}
                        fontSize={14}
                        ml={path.includes("/bots") ? "14px" : 4}
                        my={path.includes("/bots") ? "1px" : null}
                        minW={"100px"}
                    >
                        {children}
                    </Box>
                </Flex>
            </Box>
        </Tooltip>
    );
};

export const NavItemSimple = ({ t, path, icon, children, isOpenCollapse, hasScroll = false }) => {
  const router = useRouter();
  const navItemSimpleRefs = useRef({});
  const setNavItemSimpleRef = (path) => (el) => {
    navItemSimpleRefs.current[path] = el;
  };
  useEffect(() => {
    const target = navItemSimpleRefs.current[router.asPath];
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [router.asPath]);

  return (
    <Flex
      as="a"
      href={path}
      w="full"
      px={3}
      py={2}
      borderRadius="md"
      role="group"
      cursor="pointer"
      transition="all 0.3s ease"
      className="group"
      ref={setNavItemSimpleRef(path)}
    >
      {icon ? (
        <Icon
          as={icon}
          fontSize="20"
          transition="color 0.3s"
          ml={!isOpenCollapse && !hasScroll ? 0.5 : 0}
        />
      ) : (
        <Box
          fontSize="20"
          fontWeight="bold"
          textTransform="uppercase"
          transition="color 0.3s"
          ml={!isOpenCollapse && !hasScroll ? 0.5 : 0}
        >
          {typeof children === "string" ? children.charAt(0) : "?"}
        </Box>
      )}

      <Box
        transition={{ base: "none", md: "opacity 0.3s, height 0.3s" }}
        opacity={{ base: 1, md: isOpenCollapse ? 1 : 0 }}
        pointerEvents={{ base: "auto", md: isOpenCollapse ? "auto" : "none" }}
        height={{ base: "auto", md: "10px" }}
        fontSize={14}
        minW={"100px"}
        ml={4}
      >
        {children}
      </Box>
    </Flex>
  );
};
