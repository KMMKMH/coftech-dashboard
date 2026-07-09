import { Inter } from "next/font/google";
import {
  Container,
  Icon,
  Box,
  Button,
  VStack,
  Heading,
  Text,
} from "@chakra-ui/react";
import { AppShell } from '@component/components/layout'
import { CoftechIcon } from "@component/components/Icons";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import useCoftechColors from "@component/hooks/useCoftechColors";

const inter = Inter({ subsets: ["latin"] });

const NotFoundError: React.FC = () => {
  const router = useRouter();
  const { t } = useTranslation("common");
  const {
    bgColor,
    hoverColor,
    panelBgColor,
    backgroundColor,
    descriptionColor,
    borderColor,
    textColor,
  } = useCoftechColors();

  return (
    <>
      <AppShell>
        <Container minHeight="100vh" maxW="full" h={"full"} centerContent>
          <VStack spacing={6} mt={10} textAlign="center">
            <Icon as={CoftechIcon} w={{ base: "70%", md: "90%" }} h={20} mb={6} />
            <Heading as="h1" size="2xl">
              404
            </Heading>
            <Text fontSize="xl" color={descriptionColor}>
              {t(`errorPage.notFound`)}
            </Text>
            <Text fontSize="md" color={descriptionColor}>
              {t(`errorPage.info`)}
            </Text>
            <Link href="/" passHref>
              <Button
                onClick={() => router.push("/")}
                bg={bgColor}
                color={"white"}
                _hover={{
                  bg: hoverColor,
                }}
                size="lg"
              >
                {t(`errorPage.return`)}
              </Button>
            </Link>
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
export default NotFoundError;
