/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/display-name */
import { Inter } from "next/font/google";
import {
  Box,
  Button,
  Container,
  HStack,
  Avatar,
  Text,
  FormControl,
  FormLabel,
  Input,
  IconButton,
  Select,
  Flex,
  useToast,
  Spinner,
  FormErrorMessage,
  InputGroup,
  InputRightElement,
  useToken,
  useDisclosure,
} from "@chakra-ui/react";
import { EditIcon, ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { AppShell } from '@component/components/layout'
import { useAuthStore } from "@component/store/auth";
import { useDispatch, useSelector } from "react-redux";
import React, { forwardRef, useState, useEffect, LegacyRef } from "react";
import { accountGetById, rolesGet } from "@component/store/usersSlice";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation, withTranslation } from "react-i18next";
import { companiesGet } from "@component/store/companySlice";
import { AxiosUrl } from "@component/configs/AxiosConfig";
import { useRouter } from "next/router";
import { ArrowSquareLeft } from "@untitled-ui/icons-react";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import useCoftechColors from "@component/hooks/useCoftechColors";
import BackToLogin from "@component/components/BackToLogin";
import CodeSent from "@component/components/CodeSent";
import EmailRecoveryModal from "@component/components/EmailRecovery";
import NewPassword from "@component/components/NewPassword";
import PasswordRecoveryModal from "@component/components/PasswordRecoveryMethod";
import ValidateCode from "@component/components/ValidateCode";
import WhatsappRecoveryModal from "@component/components/WhatsappPasswordRecovery";
import { ChakraPhoneInput } from "@component/components/ChakraPhoneInput";
import { useError } from "@component/utils/errorContext";

const inter = Inter({ subsets: ["latin"] });

const UpdateUser = ({ t }) => {
  const { user } = useAuthStore();
  const { showError } = useError();
  const dispatch = useDispatch();
  const router = useRouter();
  const { userId, companyId } = router.query;
  const toast = useToast();
  const {
    account,
    roles,
    loading: loadingAccounts,
    error: usersError
  } = useSelector(
    //@ts-ignore
    (resp) => resp.users
  );

  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(
    "https://picsum.photos/200/200"
  );

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "",
    company: "",
    status: false,
    photo: "",
  });

  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [initialFormData, setInitialFormData] = useState(null);

  const {
    bgColor,
    hoverColor,
    panelBgColor,
    backgroundColor,
    descriptionColor,
    borderColor,
    textColor,
    iconColor,
    inputBorderColor,
  } = useCoftechColors();
  const [accentColor] = useToken('colors', [bgColor])
  const [email_whatsapp, setEmail_Whatsapp] = useState([]);
  const [jwt, setJWT] = useState<string>("")
  const {
    isOpen: isOpenMethod,
    onOpen: onOpenMethod,
    onClose: onCloseMethod,
  } = useDisclosure();
  const {
    isOpen: isOpenWhatsapp,
    onOpen: onOpenWhatsapp,
    onClose: onCloseWhatsapp,
  } = useDisclosure();
  const {
    isOpen: isOpenCodeSent,
    onOpen: onOpenCodeSent,
    onClose: onCloseCodeSent,
  } = useDisclosure();
  const {
    isOpen: isOpenEmail,
    onOpen: onOpenEmail,
    onClose: onCloseEmail,
  } = useDisclosure();
  const {
    isOpen: isOpenValidateCode,
    onOpen: onOpenValidateCode,
    onClose: onCloseValidateCode,
  } = useDisclosure();
  const {
    isOpen: isOpenNewPassword,
    onOpen: onOpenNewPassword,
    onClose: onCloseNewPassword,
  } = useDisclosure();
  const {
    isOpen: isOpenBackToLogin,
    onOpen: onOpenBackToLogin,
    onClose: onCloseBackToLogin,
  } = useDisclosure();

  useEffect(() => {
    if (usersError.message.length > 1) {
      showError(usersError.message)
    }
  }, [usersError])

  useEffect(() => {
    if (user?.rol_key === "SUPERADMIN") {
      //@ts-ignore
      dispatch(companiesGet(user?.company_id));
    }
    
    if (companyId && userId) {
      //@ts-ignore
      dispatch(accountGetById({ companyId: companyId, userId }));
    }

    //@ts-ignore
    dispatch(rolesGet());
  }, [dispatch, user?.company_id, userId, companyId, user?.rol_key]);

  useEffect(() => {
    if (account) {
      const initial = {
        firstName: account.first_name || "",
        lastName: account.last_name || "",
        email: account.email || "",
        phone: `+${account.phone}` || "",
        password: "",
        confirmPassword: "",
        role: account.rol_id || "",
        company: account.company_id || "",
        photo: account.photo || "",
        status: account.status === 1,
      };
      setFormData(initial);
      setInitialFormData(initial);
      setImagePreview(account.photo || "https://picsum.photos/200/200");
    }
  }, [account]);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        //@ts-ignore
        setImagePreview(reader.result);
        //@ts-ignore
        setFormData((prev) => ({
          ...prev,
          photo: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePhoneChange = (value) => {
    if (value) {
      const newValue =
        value.startsWith("+1") || value.startsWith("+") ? value : `+1${value}`;
      setFormData((prev) => ({
        ...prev,
        phone: String(newValue),
      }));
    }
  };

  const handleChange = (e) => {
    if (typeof e === "object") {
      const { id, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        [id]: value,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        phone: e,
      }));
    }
  };

  const handlePasswordChange = (e) => {
    const { id, value } = e.target;

    if (id === "password") {
      setNewPassword(value);
    } else if (id === "confirmPassword") {
      setConfirmNewPassword(value);
    }

    if (id === "confirmPassword" && newPassword && value !== newPassword) {
      setPasswordError(true);
    } else if (
      id === "password" &&
      confirmNewPassword &&
      confirmNewPassword !== value
    ) {
      setPasswordError(true);
    } else {
      setPasswordError(false);
    }
  };

  const handleSubmit = async () => {
    const requestBody = {
      first_name: formData.firstName,
      last_name: formData.lastName,
      status: formData.status,
      email: formData.email,
      photo: formData.photo,
      phone: formData.phone,
      rol_id: formData.role,
    };

    try {
      await AxiosUrl.put(`accounts?userID=${userId}`, requestBody
      );

      if (newPassword && newPassword === confirmNewPassword) {
        await AxiosUrl.put("/auth/save/password", {
          password: newPassword,
          email: formData.email,
        });
      }

      if (user?.uuid_unique === userId && formData.photo) {
        localStorage.setItem("user_photo", formData.photo);
      }

      toast({
        title: t("updateUser.userUpdated"),
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      router.push("/users");
    } catch (error) {
      console.error("Error updating user:", error);
      toast({
        title: t("updateUser.updateFailed"),
        description: error?.response?.data?.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <>
      <AppShell
        title={t("updateUser.updateUser")}
        onBackButtonClick={() => router.back()}
        showBackButton={true}
      >
        <PasswordRecoveryModal
          isOpen={isOpenMethod}
          onClose={onCloseMethod}
          openWhatsapp={onOpenWhatsapp}
          openEmail={onOpenEmail}
          openSent={onOpenCodeSent}
          setEmail_Whatsapp={setEmail_Whatsapp}
          user={formData}
        />
        <CodeSent
          isOpen={isOpenCodeSent}
          onClose={onCloseCodeSent}
          openValidateCode={onOpenValidateCode}
        />
        <ValidateCode
          isOpen={isOpenValidateCode}
          onClose={onCloseValidateCode}
          openNewPassword={onOpenNewPassword}
          value={email_whatsapp}
          setJWT={setJWT}
        />
        <NewPassword
          isOpen={isOpenNewPassword}
          onClose={onCloseNewPassword}
          openBackToLogin={onOpenBackToLogin}
          jwt={jwt}
          setJWT={setJWT}
          setEmail_Whatsapp={setEmail_Whatsapp}
        />
        <BackToLogin
          isOpen={isOpenBackToLogin}
          onClose={onCloseBackToLogin}
        />
        <Container
          minHeight="100vh"
          p={{ base: 0, md: 4 }}
          maxW="full"
          h={"full"}
        >
          {loadingAccounts ? (
            <Flex justify="center" align="center" minHeight="50vh" marginY={4}>
              <Spinner size="xl" />
            </Flex>
          ) : (
            <Box
              marginY={4}
              bg={panelBgColor}
              p={{ base: 4, md: 8 }}
              rounded="lg"
              boxShadow="lg"
            >
              <HStack
                justify={{ base: "center", md: "start" }}
                spacing={8}
                mb={8}
                position="relative"
                w={"full"}
              >
                <Avatar size="2xl" src={imagePreview}>
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
                    onClick={() => document.getElementById("fileInput").click()}
                  />
                </Avatar>
                <input
                  id="fileInput"
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handleImageChange}
                />
                <Button ml={"auto"} bg={"transparent"} color={bgColor} border={`1px solid ${accentColor}`} _hover={{ bg: bgColor, color: "white" }} onClick={onOpenMethod}>
                  {t("recovery.restore")}
                </Button>
              </HStack>
              <HStack
                spacing={4}
                mb={4}
                flexDirection={{ base: "column", md: "row" }}
              >
                <FormControl id="firstName">
                  <FormLabel>{t("createUser.firstName")}</FormLabel>
                  <Input
                    placeholder={t("createUser.enterFirstName")}
                    value={formData.firstName}
                    bg={backgroundColor}
                    _focus={{ borderColor: bgColor, boxShadow: "none" }}
                    onChange={handleChange}
                  />
                </FormControl>
                <FormControl id="lastName">
                  <FormLabel>{t("createUser.lastName")}</FormLabel>
                  <Input
                    placeholder={t("createUser.enterLastName")}
                    value={formData.lastName}
                    bg={backgroundColor}
                    _focus={{ borderColor: bgColor, boxShadow: "none" }}
                    onChange={handleChange}
                  />
                </FormControl>
              </HStack>
              <HStack spacing={4} mb={4}>
                <FormControl id="email">
                  <FormLabel>{t("createUser.email")}</FormLabel>
                  <Input
                    type="email"
                    placeholder={t("createUser.enterEmail")}
                    value={formData.email}
                    bg={backgroundColor}
                    _focus={{ borderColor: bgColor, boxShadow: "none" }}
                    onChange={handleChange}
                  />
                </FormControl>
              </HStack>
              <HStack spacing={4} mb={4}>
                <FormControl id="phone">
                  <FormLabel>{t("createUser.phone")}</FormLabel>
                  <PhoneInput
                    defaultCountry="AR"
                    value={formData.phone}
                    onChange={handlePhoneChange}
                    inputComponent={ChakraPhoneInput}
                    international
                    countryCallingCodeEditable={false}
                    limitMaxLength
                  />
                </FormControl>
              </HStack>
              <HStack
                spacing={4}
                mb={4}
                flexDirection={{ base: "column", md: "row" }}
              >

              </HStack>
              {user?.uuid_unique !== userId && (
                <HStack
                  spacing={4}
                  mb={4}
                  flexDirection={{ base: "column", md: "row" }}
                >
                  <FormControl id="role">
                    <FormLabel>{t("updateUser.role")}</FormLabel>
                    <Select
                      placeholder={t("updateUser.selectRole")}
                      value={formData.role}
                      background={backgroundColor}
                      _focus={{ borderColor: bgColor, boxShadow: "none" }}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          role: e.target.value,
                        })
                      }
                    >
                      {roles.map((role) => (
                        <option key={role.uuid_unique} value={role.uuid_unique}>
                          {role.name}
                        </option>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl id="status">
                    <FormLabel>{t("createUser.status")}</FormLabel>
                    <Select
                      placeholder={t("createUser.selectStatus")}
                      value={formData.status ? "true" : "false"}
                      background={backgroundColor}
                      _focus={{ borderColor: bgColor, boxShadow: "none" }}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          status: e.target.value === "true",
                        })
                      }
                    >
                      <option value="true">{t("createUser.active")}</option>
                      <option value="false">{t("createUser.inactive")}</option>
                    </Select>
                  </FormControl>
                </HStack>
              )}

              <HStack
                justifyContent="flex-end"
                mt={4}
                spacing={4}
                flexWrap="wrap"
              >
                <Button
                  variant="outline"
                  color={bgColor}
                  borderColor={bgColor}
                  onClick={() => {
                    if (initialFormData) {
                      setFormData(initialFormData);
                      setNewPassword("");
                      setConfirmNewPassword("");
                      setPasswordError(false);
                      setImagePreview(
                        initialFormData.photo || "https://picsum.photos/200/200"
                      );
                    }
                  }}
                >
                  {t("modal.cancelDelete")}
                </Button>
                <Button
                  bg={bgColor}
                  color="white"
                  _hover={{ bg: hoverColor }}
                  onClick={handleSubmit}
                  isDisabled={passwordError}
                >
                  {t("updateUser.updateUser")}
                </Button>
              </HStack>
            </Box>
          )}
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

export default withTranslation("common")(UpdateUser);
