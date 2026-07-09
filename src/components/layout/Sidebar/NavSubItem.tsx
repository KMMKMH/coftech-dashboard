import { useColorModeValue, Box, Icon, Flex } from "@chakra-ui/react";
import useCoftechColors from "@component/hooks/useCoftechColors";
import { getBaseRouterPath } from "@component/utils/router";
import { useRouter } from "next/router";
import { useRef, useEffect } from "react";
import { NavItemProps } from "..";

const NavSubItem = ({
  t,
  icon,
  path = "/",
  children,
  isOpenCollapse,
  ...rest
}: NavItemProps) => {
  const router = useRouter();

  const { bgColor, hoverColor, panelBgColor } = useCoftechColors();

  const stageBg = useColorModeValue("", "coftech.background.dark");

  const stageColor = useColorModeValue("#475569", "#94A3B8");

  const baseRouterPath = getBaseRouterPath(router)
  const isActive = baseRouterPath === path;

  const onClick = () => {
    if (path) {
      router.push(path);
    }
  };

  const navSubItemRefs = useRef({});
  const setNavSubItemRef = (path) => (el) => {
    navSubItemRefs.current[path] = el;
  };
  useEffect(() => {
    const target = navSubItemRefs.current[router.asPath];
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [router.asPath]);

  return (
    <Box
      as="a"
      onClick={onClick}
      style={{ textDecoration: "none" }}
      _focus={{ boxShadow: "none" }}
      w="full"
    >
      <Flex
        p="8px 12px"
        w="full"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        bg={isActive ? bgColor : stageBg}
        color={isActive ? panelBgColor : stageColor}
        _hover={{
          bg: isActive ? bgColor : hoverColor,
          color: isActive ? panelBgColor : "white",
        }}
        transition="all 0.3s ease"
        className="group"
        {...rest}
        ref={setNavSubItemRef(path)}
      >
        {icon ? (
          <Icon
            as={icon}
            fontSize="20"
            color={isActive ? panelBgColor : "inherit"}
            transition="color 0.3s"
          />
        ) : (
          <Box
            fontSize="20"
            fontWeight="bold"
            textTransform="uppercase"
            color={isActive ? panelBgColor : "inherit"}
            transition="color 0.3s"
          >
            {typeof children === "string" ? children.charAt(0) : "?"}
          </Box>
        )}

        <Box
          transition={{ base: "none", md: "opacity 0.3s, height 0.3s" }}
          opacity={{ base: 1, md: isOpenCollapse ? 1 : 0 }}
          pointerEvents={{ base: "auto", md: isOpenCollapse ? "auto" : "none" }}
          height={{ base: "auto", md: isOpenCollapse ? "auto" : 0 }}
          fontSize={14}
          ml={4}
        >
          {children}
        </Box>
      </Flex>
    </Box>
  );
};

export default NavSubItem
