import Head from "next/head";
import { Inter } from "next/font/google";
import {
  Button,
  Checkbox,
  FormControl,
  Text,
  FormLabel,
  Input,
  Icon,
  Heading,
  Stack,
  Link,
  Box,
  InputGroup,
  InputRightElement,
  useDisclosure,
} from "@chakra-ui/react";
import { useState } from "react";
import { useRouter } from "next/router";
import { CoftechIcon } from "@component/components/Icons";
import { useAuthStore } from "@component/store/auth";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import useCoftechColors from "@component/hooks/useCoftechColors";
import PasswordRecoveryModal from "@component/components/PasswordRecoveryMethod";
import WhatsappRecoveryModal from "@component/components/WhatsappPasswordRecovery";
import CodeSent from "@component/components/CodeSent";
import ValidateCode from "@component/components/ValidateCode";
import NewPassword from "@component/components/NewPassword";
import BackToLogin from "@component/components/BackToLogin";
import EmailRecoveryModal from "@component/components/EmailRecovery";
import { getSocket, initSocket } from "@component/pages/socket";
import { useLoginMutation } from "@component/store/RTK/auth";
import { temporaryAccessToken, temporaryAccessUser, isTemporaryAccessEnabled } from "@component/utils/temporaryAccess";

const inter = Inter({ subsets: ["latin"] });

export default function Login() {
  const router = useRouter();
  const [error, setError] = useState(false);
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [email_whatsapp, setEmail_Whatsapp] = useState([]);
  const [jwt, setJWT] = useState<string>("")
  const { login } = useAuthStore();
  const [ triggerLogin ] = useLoginMutation();
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

  const {
    bgColor,
    hoverColor,
    panelBgColor,
    backgroundColor,
    descriptionColor,
    borderColor,
    textColor,
    iconColor,
  } = useCoftechColors();

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    setError(false);
    setLoading(true);
    try {
      const response = await triggerLogin({email: username, password}).unwrap();
      const data = response.data;

      if (data.account.company_logo) {
        localStorage.setItem("company_logo", data.account.company_logo);
      }

      if (data.account.photo) {
        localStorage.setItem("user_photo", data.account.photo);
      }

      const { company_logo, photo, ...accountWithoutLogoAndPhoto } =
        data.account;

      login({ account: accountWithoutLogoAndPhoto, token: data.token });

      try {
        const socket = getSocket()
        if (socket) {
          socket.disconnect();
        }
      } catch (e) {
        if (process.env.NODE_ENV === 'development') {
          console.warn('[Socket] ❌ Failed to disconnect old socket', e);
        }
      }

      if (data.token) {
        initSocket(data.token);
      }

      router.push("/");
    } catch (e) {
      setError(true);
      setPassword("");
      setLoading(false);
    }
  };

  const handleTemporaryAccess = () => {
    // TEMP login bypass while the backend is unavailable.
    login({ account: temporaryAccessUser, token: temporaryAccessToken });
    router.push("/");
  };

  return (
    <>
      <Head>
        <title>Log in | Coftech Bot</title>
        <meta name="description" content="Log in | Coftech Bot" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <PasswordRecoveryModal
        isOpen={isOpenMethod}
        onClose={onCloseMethod}
        openWhatsapp={onOpenWhatsapp}
        openEmail={onOpenEmail}
        user={undefined}
        openSent={undefined}
        setEmail_Whatsapp={undefined}
      />
      <WhatsappRecoveryModal
        isOpen={isOpenWhatsapp}
        onClose={onCloseWhatsapp}
        openCodeSent={onOpenCodeSent}
        setWhatsappValue={setEmail_Whatsapp}
      />
      <EmailRecoveryModal
        isOpen={isOpenEmail}
        onClose={onCloseEmail}
        openCodeSent={onOpenCodeSent}
        setEmailValue={setEmail_Whatsapp}
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
      <Stack
        minH={"100vh"}
        align={"center"}
        justify={"center"}
        backgroundColor={backgroundColor}
        direction={{ base: "column", md: "row" }}
      >
        <Box rounded={"lg"} bg={panelBgColor} boxShadow={"lg"} p={8} px={14}>
          <Box textAlign={"center"} mb={4}>
            <Icon
              as={CoftechIcon}
              w={{ base: "60%", md: "100%" }}
              h={20}
            />
            <Heading mb={2} fontSize={32}>
              Log in
            </Heading>
            <Text fontSize={16}>
              Welcome, enter your details to log in.
            </Text>
          </Box>
          <Stack spacing={4} as="form" onSubmit={handleSubmit}>
            <FormControl id="email">
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                placeholder="Enter your email address"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </FormControl>
            <FormControl id="password">
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="*******"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <InputRightElement h={"full"}>
                  <Button
                    variant={"link"}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <ViewOffIcon /> : <ViewIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>
            <Stack spacing={10}>
              <Stack
                direction={{ base: "column", sm: "row" }}
                align={"start"}
                justify={"space-between"}
              >
                <Checkbox>Remember password</Checkbox>
                <Link color={bgColor} onClick={onOpenMethod}>
                  I forgot my password
                </Link>
              </Stack>
              <Button
                bg={bgColor}
                type="submit"
                color={"white"}
                _hover={{
                  bg: hoverColor,
                }}
                isLoading={loading}
              >
                Log in
              </Button>
              {error && (
                <Text color="red.500" textAlign="center">
                  Incorrect credentials. Please try again.
                </Text>
              )}
            </Stack>
            {isTemporaryAccessEnabled && (
                <Button
                  variant="outline"
                  borderColor={borderColor}
                  color={textColor}
                  _hover={{
                    bg: hoverColor,
                    color: "white",
                  }}
                  onClick={handleTemporaryAccess}
                >
                  Continue without backend
                </Button>
              )}
          </Stack>
        </Box>
      </Stack>
    </>
  );
}
