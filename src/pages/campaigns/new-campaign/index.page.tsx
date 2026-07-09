import React, { useState } from "react";
import {
  Box,
  HStack,
  Avatar,
  Text,
  Flex,
  Heading,
  useTheme,
  VStack,
  Button,
  Progress,
  Container,
} from "@chakra-ui/react";
import {
  AlertTriangle,
  ArrowSquareLeft,
  File05,
  Upload01,
} from "@untitled-ui/icons-react";
import { AppShell } from '@component/components/layout'
import { useAuthStore } from "@component/store/auth";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { withTranslation } from "react-i18next";
import Image from "next/image";
import UploadImage from "@component/assets/images/upload.svg";
import TimerImage from "@component/assets/images/timer.svg";
import { useRouter } from "next/router";
import useCoftechColors from "@component/hooks/useCoftechColors";

const NewCampaign = ({ t }) => {
  const { user } = useAuthStore();
  const router = useRouter();

  const [uploadStatus, setUploadStatus] = useState("default"); // default, uploading, uploaded
  const [uploadProgress, setUploadProgress] = useState(0);
  const [fileName, setFileName] = useState("");

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

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileName(file.name);
      setUploadStatus("uploading");
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setUploadStatus("uploaded");
            return 100;
          }
          return prev + 20;
        });
      }, 500);
    }
  };

  return (
    <>
      <AppShell
        title={t("campaigns.createNewCampaign")}
        showBackButton={true}
        onBackButtonClick={() => router.back()}
      >
        <Container maxW="full" padding={"48px 32px"}>
          <Box
            display={"flex"}
            alignItems={"center"}
            justifyContent={"center"}
            marginY={4}
          >
            <VStack
              justify="center"
              mb={12}
              width={378}
              gap={"27px"}
              mt={"36px"}
            >
              <AlertTriangle width={72} height={72} color={bgColor} />
              <Text fontSize={24} fontWeight={600} textAlign={"center"}>
                {t("campaigns.header")}
              </Text>
              <Box
                w="full"
                bg={panelBgColor}
                minH="127px"
                borderStyle="dashed"
                borderWidth="2px"
                borderColor={bgColor}
                borderRadius="20px"
                cursor="pointer"
                justifyContent="center"
                alignItems="center"
                display="flex"
                gap={4}
                onClick={() => document.getElementById("fileInput").click()}
              >
                <input
                  id="fileInput"
                  type="file"
                  accept=".xlsx, .xls, .csv"
                  style={{ display: "none" }}
                  onChange={handleFileUpload}
                />
                {uploadStatus === "default" && (
                  <>
                    <Upload01 width={32} height={32} color={bgColor} />
                    <HStack
                      flexDirection={"column"}
                      alignItems={"start"}
                      gap={0}
                    >
                      <Text fontSize={16} fontWeight="500" color={textColor}>
                        {t("campaigns.uploadFile")}
                      </Text>
                      <Text fontSize={12} fontWeight={500} color={textColor}>
                        {t("campaigns.onlyCSV")}
                      </Text>
                    </HStack>
                  </>
                )}
                {uploadStatus === "uploading" && (
                  <>
                    <File05 width={32} height={32} color={bgColor} />
                    <HStack
                      flexDirection={"column"}
                      alignItems={"start"}
                      gap={"9px"}
                    >
                      <Text fontSize={16} fontWeight="500">
                        {fileName} {/* Display the file name */}
                      </Text>
                      <Progress
                        value={uploadProgress}
                        size="xs"
                        w="154px"
                        bg={bgColor}
                        rounded={"100px"}
                      />
                    </HStack>
                  </>
                )}
                {uploadStatus === "uploaded" && (
                  <>
                    <File05 width={32} height={32} color={bgColor} />
                    <HStack
                      flexDirection={"column"}
                      alignItems={"start"}
                      gap={"9px"}
                    >
                      <Text fontSize={16} fontWeight="500" width={154}>
                        {t("campaigns.successful")}
                      </Text>
                    </HStack>
                  </>
                )}
              </Box>
              <HStack alignItems={"start"} gap={"13px"}>
                <Image src={TimerImage} alt="Timer" />
                <Text fontSize={16} fontWeight={500} color={descriptionColor}>
                  {t("campaigns.duration")}
                </Text>
              </HStack>
              {uploadStatus === "uploaded" ? (
                <VStack gap={"19px"} w={"full"}>
                  <Button
                    color={textColor}
                    px={6}
                    w={"full"}
                    _hover={{
                      bg: hoverColor,
                      color: "white",
                    }}
                    onClick={() => router.push("/campaigns/contacts")}
                  >
                    {t("campaigns.seeContactDatabase")}
                  </Button>
                  <Button
                    bg={bgColor}
                    color={"white"}
                    borderWidth="1px"
                    px={6}
                    w={"full"}
                    _hover={{
                      bg: hoverColor,
                    }}
                    onClick={() => router.push("/campaigns/create-campaign")}
                  >
                    {t("campaigns.createNewCampaign")}
                  </Button>
                </VStack>
              ) : (
                <Button
                  bg={"gray.300"}
                  color={"gray.500"}
                  px={6}
                  w={"full"}
                  _hover={{
                    bg: "gray.300",
                  }}
                  disabled={true}
                >
                  {t("campaigns.continue")}
                </Button>
              )}
            </VStack>
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

export default withTranslation("common")(NewCampaign);
