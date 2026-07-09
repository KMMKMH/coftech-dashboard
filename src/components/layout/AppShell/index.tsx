/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  Box,
  Drawer,
  DrawerContent,
  useDisclosure,
  Spinner,
  Stack,
} from "@chakra-ui/react";
import { useAuthStore } from "@component/store/auth";
import { withTranslation } from "react-i18next";
import { allLinkItems, BottomLinkItems } from "@component/utils";
import Head from "next/head";

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@component/store";

import useCoftechColors from "@component/hooks/useCoftechColors";
import { GetDeskBase, GetDeskTable } from "@component/store/deskSlice";
import { toggleCollapse } from "@component/store/sidebarCollapseSlice";
import { useError } from "@component/utils/errorContext";
import { getBaseRouterPath } from "@component/utils/router";
import { AppShellProps, Header, Sidebar } from "..";

function AppShell({
  children,
  t,
  title,
  showBackButton = false,
  onBackButtonClick,
}: AppShellProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();
  const { user } = useAuthStore();
  const dispatch: AppDispatch = useDispatch();
  const { locale } = router;
  const { backgroundColor } = useCoftechColors();
  const [isLoading, setIsLoading] = useState(true);
  const [hasHydrated, setHasHydrated] = useState(false);
  const { showError } = useError();

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [selectedLanguage, setSelectedLanguage] = useState<string>(
    locale || "es"
  );

  const { base, error: deskError } = useSelector((state: any) => state.desk);

  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const sidebarCollapse = useSelector((state: any) => state.sidebarCollapse.isOpenCollapse);

  const handleCollapse = () => {
    dispatch(toggleCollapse());
  };

  useEffect(() => {
    if (deskError.message.length > 1) {
      showError(deskError.message)
    }
  }, [deskError])

  useEffect(() => {
    setIsOpenCollapse(sidebarCollapse);
  }, [sidebarCollapse]);

  useEffect(() => {
    //@ts-ignore
    useAuthStore.persist.rehydrate().then(() => {
      setHasHydrated(true);
    });
  }, []);

  useEffect(() => {
    if (hasHydrated) {
      if (!isAuthenticated) {
        router.push("/auth/login");
      } else {
        setIsLoading(false);
      }
    }
  }, [isAuthenticated, router, hasHydrated]);

  useEffect(() => {
    if (user?.company_id !== undefined) {
      dispatch(GetDeskBase({ companyId: user?.company_id })).then(() => {
        if (base?.uuid_unique !== undefined) {
          dispatch(GetDeskTable({ baseId: base.uuid_unique }));
        }
      });
    }
  }, [dispatch, user?.company_id, user?.rol_key, base?.uuid_unique]);


  const currentLink = [...allLinkItems, ...BottomLinkItems].find(
    (link) => link.path === getBaseRouterPath(router)
  );

  const pageTitle = currentLink ? currentLink.name : "Coftech Bot";
  const translatedTitle = t(`header.${pageTitle}`, {
    defaultValue: "Coftech Bot",
  });

  if (isLoading) {
    return (
      <>
        <Stack
          minH={"100vh"}
          align={"center"}
          justify={"center"}
          backgroundColor={"coftech.primary.light"} // Use light mode color as default
          direction={{ base: "column", md: "row" }}
        >
          <Spinner w="50px" h="50px" thickness="5px" color="white" />
        </Stack>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>{translatedTitle} | Coftech Bot</title>
        <meta name="description" content={`${translatedTitle} | Coftech Bot`} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Box minH="100vh" bg={backgroundColor}>
        <Sidebar
          onClose={() => onClose}
          display={{ base: "none", md: "flex" }}
          t={t}
          selectedLanguage={selectedLanguage}
          setSelectedLanguage={setSelectedLanguage}
          isOpenCollapse={isOpenCollapse}
          handleCollapse={handleCollapse}
        />
        <Drawer
          isOpen={isOpen}
          placement="left"
          onClose={onClose}
          returnFocusOnClose={false}
          onOverlayClick={onClose}
          size="full"
        >
          <DrawerContent>
            <Sidebar
              onClose={onClose}
              t={t}
              selectedLanguage={selectedLanguage}
              setSelectedLanguage={setSelectedLanguage}
              isOpenCollapse={isOpenCollapse}
              handleCollapse={handleCollapse}
            />
          </DrawerContent>
        </Drawer>
        <Header
          display={{ base: "flex", md: "flex" }}
          ml={{ md: isOpenCollapse ? 80 : 20 }}
          t={t}
          title={title}
          onOpen={onOpen}
          showBackButton={showBackButton}
          onBackButtonClick={onBackButtonClick}
          selectedLanguage={selectedLanguage}
          setSelectedLanguage={setSelectedLanguage}
          transition="margin-left 0.3s ease-in-out"
        />
        <Box
          ml={{ base: 0, md: isOpenCollapse ? 80 : 20 }}
          p="4"
          transition="margin-left 0.3s ease-in-out"
        >
          {children}
        </Box>
      </Box>
    </>
  );
}

export default withTranslation("common")(AppShell);
