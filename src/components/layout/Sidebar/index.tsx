/* eslint-disable react-hooks/exhaustive-deps */
import { useColorModeValue, Text, Box, Stack, CloseButton, VStack, Tooltip, Icon, Flex, Button } from "@chakra-ui/react";
import { CoftechIcon } from "@component/components/Icons";
import LanguageSelector from "@component/components/LanguageSelector";
import { CoftechLogo } from "@component/components/Logo-mini";
import ThemeSwitcher from "@component/components/ThemeSwitcher";
import useCoftechColors from "@component/hooks/useCoftechColors";
import { AppDispatch } from "@component/store";
import { useAuthStore } from "@component/store/auth";
import { companyConfigExtensionGet } from "@component/store/settingSlice";
import { LinkItemProps, allLinkItems, BottomLinkItems } from "@component/utils";
import { Database01, LayoutLeft } from "@untitled-ui/icons-react";
import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import useHasVerticalScroll from "@component/hooks/useHasVerticalScroll";
import { NavItem, NavItemWithSubMenu, SidebarProps } from "..";

const Sidebar = ({
  onClose,
  t,
  selectedLanguage,
  setSelectedLanguage,
  isOpenCollapse,
  handleCollapse,
  ...rest
}: SidebarProps) => {
  const dispatch: AppDispatch = useDispatch();
  const [linkItems, setLinkItems] = useState<LinkItemProps[] | []>([]);
  const [bottomLinkItems, setBottomLinkItems] = useState<LinkItemProps[] | []>([]);
  const { user } = useAuthStore();
  const { table } = useSelector((state: any) => state.desk);
  const [isSubMenuOpen, setSubMenuOpen] = useState<boolean>()

  const { bgColor, panelBgColor, inputBorderColor } = useCoftechColors();

  useEffect(() => {
    if (user?.company_id) {
      dispatch(companyConfigExtensionGet(user?.company_id));
    }
  }, [dispatch, user?.company_id]);

  useEffect(() => {
    if (user) {
      const filteredLinks = allLinkItems.filter(
        (link) =>
          link.allowedRoles.includes(user.rol_key) ||
          link.allowedRoles.includes("ALL")
      );

      const filteredLinkItemsWithChildren = filteredLinks.map((link) => ({
        ...link,
        children: link.children?.filter(
          (child) =>
            child.allowedRoles.includes(user.rol_key) ||
            child.allowedRoles.includes("ALL")
        ),
      }));

      setLinkItems(filteredLinkItemsWithChildren);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      const filteredLinks = BottomLinkItems.filter(
        (link) =>
          link.allowedRoles.includes(user.rol_key) ||
          link.allowedRoles.includes("ALL")
      );

      setBottomLinkItems(filteredLinks);
    }
  }, [user]);

  const dynamicViewLinks = table.map((item) => ({
    name: item.table_name,
    path: `/view/${item.uuid_unique}`,
    allowedRoles: ["ALL"],
    icon: Database01,
  }));

  const filteredLinkItems = linkItems.map((link: LinkItemProps) => {
    if (link.name === "views") {
      return {
        ...link,
        children: [...(link.children || []), ...dynamicViewLinks],
      };
    }
    return link;
  });

  const menuScrollRef = useRef<HTMLDivElement>(null);
  const hasScroll = useHasVerticalScroll(menuScrollRef);

  const stageColor = useColorModeValue("#475569", "#94A3B8");

  return (
    <Flex
      role="group"
      zIndex={5}
      direction="column"
      justifyContent="space-between"
      paddingBottom={5}
      bg={panelBgColor}
      borderRight="1px"
      borderRightColor={inputBorderColor}
      w={isOpenCollapse ? "80" : { base: "full", md: 20 }}
      transition="width 0.3s ease-in-out"
      pos="fixed"
      h="full"
      overflow="hidden"
      {...rest}
    >
      <Box overflowY={"auto"} overflowX={"hidden"} ref={menuScrollRef}>
        <Flex
          display={{ base: "none", md: "flex" }}
          p={4}
        >
          <Tooltip
            label={isOpenCollapse ? `${t('header.collapseSidebar')}` : `${t('header.expandSidebar')}`}
            placement="right"
            hasArrow
          >
            <Button
              onClick={() => { handleCollapse(!isOpenCollapse) }}
              borderRadius="md"
            >
              <Box>
                {isOpenCollapse ? <LayoutLeft color={stageColor} /> : <LayoutLeft color={stageColor} />}
              </Box>
            </Button>
          </Tooltip>
        </Flex>
        <Flex h="20" alignItems="center" mx={isOpenCollapse ? "8" : "0"} justifyContent="space-between">
          <Stack
            display={{ base: "none", md: "flex" }}
            alignItems="center"
            justifyContent="center"
            w="100%"
          >
            {isOpenCollapse ?
              <Icon
                as={CoftechIcon}
                transition="opacity 0.3s ease-in-out"
                w={"250px"}
                h={"70px"}
                mb={4}
              /> : <Icon
                as={CoftechLogo}
                transition="opacity 0.3s ease-in-out"
                w={"50px"}
                h={"50px"}
                mb={4}
              />}
          </Stack>

          <Icon
            as={CoftechIcon}
            display={{ base: "block", md: "none" }}
            transition="opacity 0.3s ease-in-out"
            w={"200px"}
            h={"60px"}
          />
          <Stack display={{ base: "block", md: "none" }}>
            <ThemeSwitcher />
          </Stack>
          <Stack display={{ base: "block", md: "none" }}>
            <LanguageSelector
              selectedLanguage={selectedLanguage}
              setSelectedLanguage={setSelectedLanguage}
              t={t}
            />
          </Stack>
          <CloseButton
            display={{ base: "flex", md: "none" }}
            onClick={onClose}
          />
        </Flex>
        <VStack>
          {filteredLinkItems.map((link: LinkItemProps) => {
            const hasAccess =
              link.allowedRoles.includes("ALL") ||
              (link.type !== "subMenu" && link.allowedRoles.includes(user?.rol_key));

            const isSubMenu = link.type == "subMenu"

            const isViews = link.name === "views";

            const renderComponent = () => {
              if (hasAccess) {
                return (
                  <NavItem
                    t={t}
                    name={link.name}
                    path={link.path}
                    icon={link.icon}
                    isOpenCollapse={isOpenCollapse}
                    hasScroll={hasScroll}
                  >
                    {t(`header.${link.name}`)}
                  </NavItem>
                );
              }

              return (
                <NavItemWithSubMenu
                  isViews={isViews}
                  t={t}
                  link={link}
                  isOpenCollapse={isOpenCollapse}
                  hasScroll={hasScroll}
                  setSubMenuOpen={setSubMenuOpen}
                />
              );
            };

            return (
              <Box
                key={link.name}
                as="span"
                display={{ base: "contents", md: isOpenCollapse ? "contents" : "flex" }}
                w="full"
              >
                {renderComponent()}
              </Box>
            );
          })}
        </VStack>

      </Box>
      <VStack gap="10px" bgColor={panelBgColor} pt={4}>
        {bottomLinkItems.map((link: LinkItemProps) => (
          <Box
            key={link.name}
            as="span"
            display={{ base: "contents", md: isOpenCollapse ? 'contents' : 'flex' }}
            w="full"
          >
            <NavItem
              t={t}
              name={link.name}
              path={link.path}
              icon={link.icon}
              isOpenCollapse={isOpenCollapse}
              isBottomLinkItems={true}
              hasScroll={hasScroll}
            >
              {t(`header.${link.name}`)}
            </NavItem>
          </Box>
        ))}
      </VStack>
    </Flex >
  );
};

export default Sidebar
