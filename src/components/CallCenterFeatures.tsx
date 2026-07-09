import React from "react";
import {
  Box,
  VStack,
  HStack,
  Text,
  Input,
  Spinner,
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import { Select } from "chakra-react-select";
import {
  Plus,
  FileAttachment02,
  Keyboard02,
  MessageDotsCircle,
  Toggle03Left,
  Toggle03Right,
  FaceSmile,
} from "@untitled-ui/icons-react";
import useCoftechColors from "@component/hooks/useCoftechColors";

interface CallCenterFeaturesProps {
  extensions: any;
  loadingBots: boolean;
  userRole: string;
  inputValue: string;
  setInputValue: (value: string) => void;
  t: (key: string) => string;
}

const useCallCenterFeatures = ({
  extensions,
  loadingBots,
  userRole,
  inputValue,
  setInputValue,
  t,
}: CallCenterFeaturesProps) => {
  const {
    bgColor,
    panelBgColor,
    backgroundColor,
  } = useCoftechColors();

  const hasCallCenterExtension = () => {
    return extensions?.bots?.[0]?.extensions?.some(
      (ext) => ext?.key === "CALL_CENTER"
    );
  };

  const renderSelectDepartment = () => {
    if (!hasCallCenterExtension()) return null;

    return (
      <VStack
        gap={"12px"}
        my={{ base: 4, md: 8 }}
        align={"start"}
        width={{ base: "100%", md: "auto" }}
        zIndex={1}
      >
        <Text fontSize={"16px"} fontWeight={"500"}>
          {t("chats.filterDepartment")}
        </Text>
        {loadingBots && userRole !== "SUPERADMIN" ? (
          <Spinner size={"md"} color={bgColor} />
        ) : (
          <Select
            options={[]}
            placeholder={t("chats.filterDepartment")}
            isSearchable={false}
            chakraStyles={{
              container: (provided) => ({
                ...provided,
                borderRadius: 20,
                background: panelBgColor,
                cursor: "pointer",
                width: { base: "100%", md: "auto" },
              }),
              dropdownIndicator: (provided) => ({
                ...provided,
                color: bgColor,
                width: "20px",
                background: panelBgColor,
              }),
              control: (provided) => ({
                ...provided,
                borderRadius: 20,
              }),
              inputContainer: (provided) => ({
                ...provided,
                width: "150px",
              }),
            }}
          />
        )}
      </VStack>
    );
  };

  const renderTransferChat = () => {
    if (!hasCallCenterExtension()) return null;

    return (
      <Box
        right={4}
        top="50%"
        zIndex={0}
        w={"240px"}
      >
        <Select
          placeholder={t("chats.transferChat")}
          isSearchable={false}
          chakraStyles={{
            container: (provided) => ({
              ...provided,
              borderRadius: 20,
              background: backgroundColor,
              cursor: "pointer",
              width: { base: "100%", md: "auto" },
            }),
            dropdownIndicator: (provided) => ({
              ...provided,
              color: bgColor,
              width: "20px",
              background: backgroundColor,
            }),
            control: (provided) => ({
              ...provided,
              borderRadius: 20,
            }),
            inputContainer: (provided) => ({
              ...provided,
              width: "150px",
            }),
          }}
        />
      </Box>
    );
  };

  const renderWriteMessages = () => {
    if (!hasCallCenterExtension()) return null;

    return (
      <HStack w={"full"} p={1}>
        <Menu>
          <MenuButton
            as={IconButton}
            icon={<Plus />}
            color={bgColor}
            aria-label="Add"
            p={"8px"}
            cursor={"pointer"}
          />
          <MenuList
            padding={"8px"}
            gap={"8px"}
            display={"flex"}
            flexDirection={"column"}
            bg={backgroundColor}
          >
            <MenuItem
              padding={"8px 10px"}
              gap={"8px"}
              bg={backgroundColor}
              _hover={{
                bg: bgColor,
              }}
              className="group"
              borderRadius={"5px"}
              onClick={() => console.log("Attach Documents")}
            >
              <Icon
                as={FileAttachment02}
                color={bgColor}
                w={"24px"}
                h={"24px"}
                _groupHover={{ color: "white" }}
              />
              <Text
                fontSize={"14px"}
                fontWeight={"500"}
                _groupHover={{ color: "white" }}
              >
                {t("chats.attach")}
              </Text>
            </MenuItem>
            <MenuItem
              padding={"8px 10px"}
              gap={"8px"}
              bg={backgroundColor}
              _hover={{
                bg: bgColor,
              }}
              className="group"
              borderRadius={"5px"}
              onClick={() => console.log("Attach Documents")}
            >
              <Icon
                as={Keyboard02}
                color={bgColor}
                w={"24px"}
                h={"24px"}
                _groupHover={{ color: "white" }}
              />
              <Text
                fontSize={"14px"}
                fontWeight={"500"}
                _groupHover={{ color: "white" }}
              >
                {t("chats.shortcutsMessages")}
              </Text>
            </MenuItem>
            <MenuItem
              padding={"8px 10px"}
              gap={"8px"}
              bg={backgroundColor}
              _hover={{
                bg: bgColor,
              }}
              className="group"
              borderRadius={"5px"}
              onClick={() => console.log("Attach Documents")}
            >
              <Icon
                as={MessageDotsCircle}
                color={bgColor}
                w={"24px"}
                h={"24px"}
                _groupHover={{ color: "white" }}
              />
              <Text
                fontSize={"14px"}
                fontWeight={"500"}
                _groupHover={{ color: "white" }}
              >
                {t("chats.shortcutsKeys")}
              </Text>
            </MenuItem>
            <MenuItem
              padding={"8px 10px"}
              gap={"8px"}
              bg={backgroundColor}
              _hover={{
                bg: bgColor,
              }}
              className="group"
              borderRadius={"5px"}
              onClick={() => console.log("Attach Documents")}
            >
              <Icon
                as={Toggle03Left}
                color={bgColor}
                w={"24px"}
                h={"24px"}
                _groupHover={{ color: "white" }}
              />
              <Text
                fontSize={"14px"}
                fontWeight={"500"}
                _groupHover={{ color: "white" }}
              >
                {t("chats.on")}
              </Text>
            </MenuItem>
            <MenuItem
              padding={"8px 10px"}
              gap={"8px"}
              bg={backgroundColor}
              _hover={{
                bg: bgColor,
              }}
              className="group"
              borderRadius={"5px"}
              onClick={() => console.log("Attach Documents")}
            >
              <Icon
                as={Toggle03Right}
                color={bgColor}
                w={"24px"}
                h={"24px"}
                _groupHover={{ color: "white" }}
              />
              <Text
                fontSize={"14px"}
                fontWeight={"500"}
                _groupHover={{ color: "white" }}
              >
                {t("chats.off")}
              </Text>
            </MenuItem>
          </MenuList>
        </Menu>
        <InputGroup>
          <Input
            background={backgroundColor}
            focusBorderColor={bgColor}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={t("chats.chatHere")}
          />
          <InputRightElement>
            <Icon as={FaceSmile} color={bgColor} cursor="pointer" />
          </InputRightElement>
        </InputGroup>
      </HStack>
    );
  };

  return {
    renderSelectDepartment,
    renderTransferChat,
    renderWriteMessages,
  };
};

export default useCallCenterFeatures;