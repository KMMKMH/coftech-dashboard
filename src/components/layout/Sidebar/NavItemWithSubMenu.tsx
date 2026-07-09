import { useDisclosure, useColorModeValue, useBreakpointValue, Box, HStack, IconButton, VStack, Tooltip, Flex, Collapse } from "@chakra-ui/react";
import useCoftechColors from "@component/hooks/useCoftechColors";
import { ChevronDown, ChevronRight } from "@untitled-ui/icons-react";
import { useRouter } from "next/router";
import { useEffect, useRef } from "react";
import { NavItemSimple, NavItemWithSubMenuProps, NavSubItem } from "..";


const NavItemWithSubMenu = ({
  isViews = false,
  link,
  setSubMenuOpen,
  t,
  isOpenCollapse,
  hasScroll = false
}: NavItemWithSubMenuProps) => {
  const { isOpen, onToggle, onClose } = useDisclosure();
  const router = useRouter();
  const childRoutes = link?.children?.map((child) => child.path);
  const { hoverColor, bgColor } = useCoftechColors();
  const stageBg = useColorModeValue("", "coftech.background.dark");
  const stageColor = useColorModeValue("#475569", "#94A3B8");

  const isChildRouteActive =
    Array.isArray(childRoutes) && childRoutes.includes(router.asPath);


  useEffect(() => {
  }, [isChildRouteActive, isOpen])

  const handleClick = () => {
    if (link.children) {
      onToggle();
    }
  };

  const navItemWithSubMenuRefs = useRef({});
  const setNavItemWithSubMenuRef = (path) => (el) => {
    navItemWithSubMenuRefs.current[path] = el;
  };
  useEffect(() => {
    const target = navItemWithSubMenuRefs.current[router.asPath];
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [router.asPath]);

  useEffect(() => {
    if (!isChildRouteActive) {
      onClose();
    }
  }, [isOpenCollapse]);

  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <Box w={"full"}>
      <Flex onClick={handleClick} flexDirection={"column"} mx={!hasScroll ? 4 : 3}>
        <Tooltip
          label={t(`header.${link.name}`)}
          placement="right"
          isDisabled={isOpenCollapse || isMobile}
          hasArrow
        >
          <HStack
            cursor="pointer"
            bg={stageBg}
            color={stageColor}
            _hover={{
              bg: hoverColor,
              color: "white",
            }}
            borderRadius={"lg"}
            className="group"
            ref={setNavItemWithSubMenuRef(link.path)}
          >
            <NavItemSimple
              t={t}
              path={link.path}
              icon={link.icon}
              isOpenCollapse={isOpenCollapse}
              hasScroll={hasScroll}
            >
              {t(`header.${link.name}`)}
            </NavItemSimple>
            {link.children && isOpenCollapse && (
              <IconButton
                variant="ghost"
                size="sm"
                aria-label="Toggle Submenu"
                _groupHover={{
                  color: "white",
                }}
                color={bgColor}
                _hover={{
                  bg: hoverColor,
                }}
                icon={
                  isOpen || isChildRouteActive ? (
                    <ChevronDown />
                  ) : (
                    <ChevronRight />
                  )
                }
              />
            )}
          </HStack>
        </Tooltip>
        {link.children && (
          <Collapse in={isChildRouteActive ? true : isOpen} animateOpacity>
            <VStack
              pl={{ base: 6, md: isOpenCollapse ? 6 : 0 }}
              pt={2}
            >
              {link.children.map((child) => (
                <Tooltip
                  key={child.name}
                  label={t(`header.${child.name}`)}
                  placement="right"
                  hasArrow
                  isDisabled={isOpenCollapse || isMobile}
                >
                  <Box
                    as="span"
                    display={{ base: "contents", md: isOpenCollapse ? 'contents' : 'flex' }}
                    w="full"
                  >
                    <NavSubItem
                      t={t}
                      name={child.name}
                      path={child.path}
                      icon={child.icon}
                      isOpenCollapse={isOpenCollapse}
                    >
                      {isViews === true
                        ? `${child.name}`
                        : t(`header.${child.name}`)}
                    </NavSubItem>
                  </Box>
                </Tooltip>
              ))}
            </VStack>
          </Collapse>
        )}
      </Flex>
    </Box>
  );
};

export default NavItemWithSubMenu
