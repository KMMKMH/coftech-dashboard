/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  HStack,
  Avatar,
  Text,
  useTheme,
  VStack,
  Button,
  Container,
  Input,
  useToast,
  IconButton,
} from "@chakra-ui/react";
import { ArrowSquareLeft, Edit05 } from "@untitled-ui/icons-react";
import { AppShell } from '@component/components/layout'
import { useAuthStore } from "@component/store/auth";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { withTranslation } from "react-i18next";
import Image from "next/image";
import { useRouter } from "next/router";
import { Select } from "chakra-react-select";
import ActiveImage from "@component/assets/images/active.svg";
import InactiveImage from "@component/assets/images/disable.svg";
import { AxiosUrl } from "@component/configs/AxiosConfig";
import defaultCompany from "@component/assets/images/default_company.svg";
import { formatDate } from "@component/utils";
import { AppDispatch } from "@component/store";
import { useDispatch, useSelector } from "react-redux";
import { GetCompanyById } from "@component/store/companySlice";
import { EditIcon } from "@chakra-ui/icons";
import useCoftechColors from "@component/hooks/useCoftechColors";
import { useError } from "@component/utils/errorContext";

const UpdateAccount = ({ t }) => {
  const dispatch: AppDispatch = useDispatch();
  const { user, token } = useAuthStore();
  const { showError } = useError();
  const toast = useToast();
  const router = useRouter();
  const { companyId } = router.query;
  const { companies, error: companiesError } = useSelector(
    (state: any) => state.company
  );
  const account = companies[0];

  const {
    bgColor,
    hoverColor,
    panelBgColor,
    backgroundColor,
  } = useCoftechColors();

  const [avatar, setAvatar] = useState(null);
  const [accountData, setAccountData] = useState({
    name: account?.name || "",
    status: account?.status || 1,
  });
  const fileInputRef = useRef(null);

  const optionsStatus = [
    {
      value: 1,
      label: (
        <HStack>
          <Image src={ActiveImage} alt="activated" />
          <Text>{t("campaigns.activated")}</Text>
        </HStack>
      ),
    },
    {
      value: 0,
      label: (
        <HStack>
          <Image src={InactiveImage} alt="inactivated" />
          <Text>{t("campaigns.inactivated")}</Text>
        </HStack>
      ),
    },
  ];

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };

  useEffect(() => {
    //@ts-ignore
    dispatch(GetCompanyById(companyId));
  }, [companyId, dispatch]);

  useEffect(() => {
    if (account) {
      setAccountData({
        name: account.name,
        status: account.status,
      });
    }
  }, [account]);

  useEffect(() => {
    if (companiesError.message.length > 1) {
      showError(companiesError.message)
    }
  }, [companiesError])

  const handleSaveChanges = async () => {
    let params = {
      name: accountData.name,
      status: accountData.status === 1 ? true : false,
    };

    if (avatar) {
      const reader = new FileReader();
      reader.readAsDataURL(avatar);
      reader.onloadend = async () => {
        //@ts-ignore
        params.logo = reader.result as string;

        try {
          await AxiosUrl.put(
            `company?companyID=${account.uuid_unique}`,
            params,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          toast({
            title: t("company.updateCompany.companyUpdated"),
            status: "success",
            duration: 3000,
            isClosable: true,
          });
          router.push("/company");
        } catch (error) {
          showError(error?.response?.data?.message)
        }
      };
    } else {
      try {
        await AxiosUrl.put(`company?companyID=${account.uuid_unique}`, params, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        toast({
          title: t("company.updateCompany.companyUpdated"),
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        router.push("/company");
      } catch (error) {
        showError(error?.response?.data?.message)
      }
    }
  };

  if (!account) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <AppShell
        title={t("company.updateCompany.title")}
        onBackButtonClick={() => router.push("/company")}
        showBackButton={true}
      >
        <Container
          maxW="full"
          padding={"48px 32px"}
          display={"flex"}
          flexDirection={"column"}
          gap={"40px"}
          height={"80vh"}
        >
          <VStack
            padding={"60px"}
            gap={"40px"}
            align={"flex-start"}
            justifyContent={"space-between"}
            background={panelBgColor}
            borderRadius={20}
            w={"full"}
            flex={1}
            minH={"full"}
          >
            <VStack gap={"30px"} w={"full"} align={"flex-start"}>
              <HStack spacing={8} mb={8} position="relative">
                <Avatar
                  size="2xl"
                  src={
                    avatar
                      ? URL.createObjectURL(avatar)
                      : account.logo
                        ? account.logo
                        : defaultCompany
                  }
                >
                  <IconButton
                    icon={<EditIcon />}
                    aria-label={t("createUser.editAvatar")}
                    size="sm"
                    position="absolute"
                    bottom={0}
                    right={0}
                    bg="white"
                    color={bgColor}
                    boxShadow="md"
                    borderRadius="full"
                    onClick={handleAvatarClick}
                  />
                </Avatar>
                <Input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleAvatarChange}
                  style={{ display: "none" }}
                />
              </HStack>
              <HStack w={"full"} gap={"40px"}>
                <VStack align={"flex-start"} w={"full"}>
                  <Text fontSize={14} fontWeight={500}>
                    {t("company.updateCompany.name")}
                  </Text>
                  <Input
                    placeholder={t("company.updateCompany.namePlaceholder")}
                    value={accountData.name}
                    background={backgroundColor}
                    onChange={(e) =>
                      setAccountData({ ...accountData, name: e.target.value })
                    }
                  />
                </VStack>
                {user?.rol_key === "SUPERADMIN" ? (
                  <VStack align={"flex-start"} w={"full"}>
                    <Text fontSize={14} fontWeight={500}>
                      {t("company.updateCompany.state")}
                    </Text>
                    <Select
                      options={optionsStatus}
                      placeholder={t("company.updateCompany.statePlaceholder")}
                      value={optionsStatus.find(
                        (option) => option.value === accountData.status
                      )}
                      onChange={(option) =>
                        setAccountData({
                          ...accountData,
                          status: option.value,
                        })
                      }
                      chakraStyles={{
                        container: (provided) => ({
                          ...provided,
                          background: backgroundColor,
                          w: "full",
                        }),
                        dropdownIndicator: (provided) => ({
                          ...provided,
                          color: bgColor,
                          width: "20px",
                          background: backgroundColor,
                        }),
                      }}
                    />
                  </VStack>
                ) : null}
              </HStack>
              <HStack w={"full"} gap={"40px"}>
                <VStack align={"flex-start"} w={"full"}>
                  <Text fontSize={14} fontWeight={500}>
                    {t("company.updateCompany.dateOfAdmission")}
                  </Text>
                  <Input
                    value={formatDate(account.updated_at)}
                    disabled
                    background={backgroundColor}
                  />
                </VStack>
                <VStack align={"flex-start"} w={"full"}>
                  <Text fontSize={14} fontWeight={500}>
                    {t("company.updateCompany.numberOfBots")}
                  </Text>
                  <Input
                    value={account.bot_count + t("company.table.hiredBots")}
                    disabled
                    background={backgroundColor}
                  />
                </VStack>
              </HStack>
            </VStack>
            <HStack w={"full"} gap={"24px"} justifyContent={"flex-end"}>
              <Button
                bg={bgColor}
                color={"white"}
                _hover={{
                  bg: hoverColor,
                }}
                padding={"20px 40px"}
                onClick={handleSaveChanges}
              >
                {t("company.updateCompany.saveChanges")}
              </Button>
            </HStack>
          </VStack>
        </Container>
      </AppShell>
    </>
  );
};

export const getStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common"])),
  },
});

export const getStaticPaths = ({ locales }) => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export default withTranslation("common")(UpdateAccount);
