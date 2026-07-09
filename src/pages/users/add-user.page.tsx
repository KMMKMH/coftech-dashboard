/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/display-name */
import { Inter } from "next/font/google";
import {
  Box,
  Button,
  Container,
  HStack,
  Avatar,
  FormControl,
  FormLabel,
  Input,
  IconButton,
  Select,
  useToast,
} from "@chakra-ui/react";
import { EditIcon } from "@chakra-ui/icons";
import { AppShell } from '@component/components/layout'
import { useAuthStore } from "@component/store/auth";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState, forwardRef, LegacyRef } from "react";
import { rolesGet } from "@component/store/usersSlice";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { withTranslation } from "react-i18next";
import { companiesGet } from "@component/store/companySlice";
import { useRouter } from "next/router";
import useCoftechColors from "@component/hooks/useCoftechColors";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { useRegisterMutation } from "@component/store/RTK/auth";
import useErrorHandler from "@component/hooks/useErrorHandler";

const inter = Inter({ subsets: ["latin"] });

const ChakraPhoneInput = forwardRef((props, ref) => {
  const { bgColor, textColor, inputBorderColor, backgroundColor } =
    useCoftechColors();

  return (
    <Input
      ref={ref as LegacyRef<HTMLInputElement>}
      {...props}
      bg={backgroundColor}
      color={textColor}
      _hover={{ borderColor: inputBorderColor }}
      _focus={{ borderColor: bgColor, boxShadow: "none" }}
      onKeyDown={(e) => {
        if (e.key === "Shift") {
          e.preventDefault();
        }
      }}
    />
  );
});

const Home = ({ t }) => {
  const { user } = useAuthStore();
  const dispatch = useDispatch();
  const router = useRouter();
  const toast = useToast();
  const [ triggerRegister ] = useRegisterMutation();
  const { handleError } = useErrorHandler();
  const { companies, loading: loadingCompanies, error: companiesError } = useSelector(
    //@ts-ignore
    (resp) => resp.company
  );
  const { roles, error: usersError } = useSelector(
    //@ts-ignore
    (resp) => resp.users
  );

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
    photo: "",
    role: "",
    company: user?.company_id || "",
  });

  useEffect(() => {
    if (user?.rol_key !== "ADMIN") {
      //@ts-ignore
      dispatch(companiesGet(user?.company_id));
      //@ts-ignore
      dispatch(rolesGet());
    }
  }, [dispatch, user?.company_id, user?.rol_key]);

  useEffect(() => {
    if (companiesError.message.length > 1) {
      handleError(companiesError)
    }
  }, [companiesError])

  useEffect(() => {
    if (usersError.message.length > 1) {
      handleError(usersError)
    }
  }, [usersError])

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setFormData((prev) => ({ ...prev, photo: base64String }));
        //@ts-ignore
        setImagePreview(reader.result);
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
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = async () => {
    if (formData.password !== formData.confirmPassword) {
      alert(t("createUser.passwordMismatch"));
      return;
    }

    const requestBody = {
      email: formData.email,
      registered_at: new Date().toISOString(),
      first_name: formData.firstName,
      last_name: formData.lastName,
      phone: formData.phone,
      password: formData.password,
      photo: formData.photo,
      rol_id: formData.role,
    };
    try {
      await triggerRegister({ companyID: formData?.company, data: requestBody }).unwrap();
      toast({
        title: t("createUser.success"),
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      router.push("/users");
    } catch (error) {
      handleError(error, { companyID: formData?.company, data: requestBody, ...requestBody})
    }
  };
  return (
    <>
      <AppShell
        title={t("createUser.createUser")}
        onBackButtonClick={() => router.back()}
        showBackButton={true}
      >
        <Container minHeight="100vh" maxW="full" h={"full"}>
          <Box bg={panelBgColor} p={8} rounded="lg" boxShadow="lg" marginY={4}>
            <HStack spacing={8} mb={8} position="relative">
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
            </HStack>
            <HStack spacing={4} mb={4}>
              <FormControl id="firstName">
                <FormLabel>{t("createUser.firstName")}</FormLabel>
                <Input
                  placeholder={t("createUser.enterFirstName")}
                  value={formData.firstName}
                  bg={backgroundColor}
                  onChange={handleChange}
                />
              </FormControl>
              <FormControl id="lastName">
                <FormLabel>{t("createUser.lastName")}</FormLabel>
                <Input
                  placeholder={t("createUser.enterLastName")}
                  value={formData.lastName}
                  bg={backgroundColor}
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
                  onChange={handleChange}
                />
              </FormControl>
              <FormControl>
                <>
                  <FormLabel>{t("createUser.role")}</FormLabel>
                  <Select
                    id="role"
                    placeholder={t("createUser.selectRole")}
                    value={formData.role}
                    bg={backgroundColor}
                    cursor={"pointer"}
                    onChange={handleChange}
                  >
                    {roles.map((role) => (
                      <option key={role.id} value={role.uuid_unique}>
                        {role.name}
                      </option>
                    ))}
                  </Select>
                </>
              </FormControl>
            </HStack>
            <HStack spacing={4} mb={4} display={"flex"}>
              <FormControl id="phone">
                <FormLabel>{t("createUser.phone")}</FormLabel>
                <PhoneInput
                  defaultCountry="US"
                  value={formData.phone}
                  onChange={handlePhoneChange}
                  inputComponent={ChakraPhoneInput}
                  international
                  countryCallingCodeEditable={false}
                  limitMaxLength
                />
              </FormControl>
              <FormControl id="company">
                <FormLabel>{t("createUser.company")}</FormLabel>
                {user?.rol_key === "ADMIN" ? (
                  <Input value={user?.company_name} isDisabled />
                ) : (
                  <Select
                    placeholder={t("createUser.selectCompany")}
                    value={formData.company}
                    bg={backgroundColor}
                    onChange={handleChange}
                    cursor={"pointer"}
                  >
                    {companies.map((company) => (
                      <option key={company.id} value={company.uuid_unique}>
                        {company.name}
                      </option>
                    ))}
                  </Select>
                )}
              </FormControl>
            </HStack>
            <HStack spacing={4} mb={4}>
              <FormControl id="password">
                <FormLabel>{t("createUser.password")}</FormLabel>
                <Input
                  type="password"
                  placeholder={t("createUser.enterPassword")}
                  value={formData.password}
                  bg={backgroundColor}
                  onChange={handleChange}
                />
              </FormControl>
              <FormControl id="confirmPassword">
                <FormLabel>{t("createUser.confirmPassword")}</FormLabel>
                <Input
                  type="password"
                  placeholder={t("createUser.enterPasswordAgain")}
                  value={formData.confirmPassword}
                  bg={backgroundColor}
                  onChange={handleChange}
                />
              </FormControl>
            </HStack>
            <Box display="flex" justifyContent="flex-end" mt={4}>
              <Button
                bg={bgColor}
                _hover={{
                  bg: hoverColor,
                }}
                onClick={handleSubmit}
              >
                {t("createUser.createUser")}
              </Button>
            </Box>
          </Box>
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

export default withTranslation("common")(Home);
