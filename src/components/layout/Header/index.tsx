import { useDisclosure, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, Heading, ModalFooter, HStack, Stack, IconButton, Icon, Modal, Flex, Button } from "@chakra-ui/react";
import { CoftechIcon } from "@component/components/Icons";
import LanguageSelector from "@component/components/LanguageSelector";
import ThemeSwitcher from "@component/components/ThemeSwitcher";
import useCoftechColors from "@component/hooks/useCoftechColors";
import { useAuthStore } from "@component/store/auth";
import { AlertCircle, ArrowSquareLeft, Menu01 } from "@untitled-ui/icons-react";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { HeaderProps, UserMenu } from "..";

const Header = ({
    onOpen,
    t,
    showBackButton,
    onBackButtonClick,
    title,
    selectedLanguage,
    setSelectedLanguage,
    ...rest
}: HeaderProps) => {
    const router = useRouter();
    const [userPhoto, setUserPhoto] = useState<string | null>(null);

    useEffect(() => {
        const storedPhoto = localStorage.getItem("user_photo");
        setUserPhoto(storedPhoto);
    }, []);

    const {
        isOpen: isOpenModal,
        onOpen: onOpenModal,
        onClose: onCloseModal,
    } = useDisclosure();

    const { user } = useAuthStore();

    const handleLogout = () => {
        useAuthStore.getState().logout();
        onCloseModal();
    };

    const {
        bgColor,
        hoverColor,
        panelBgColor,
        borderColor,
        backgroundColor,
        inputBorderColor,
    } = useCoftechColors();

    return (
        <>
            <Modal isOpen={isOpenModal} onClose={onCloseModal} variant="coftechModal">
                <ModalOverlay />
                <ModalContent borderRadius="20px" p="12" gap="2.5rem">
                    <ModalHeader>
                        <Flex justify="center" align="center" width="100%">
                            <Icon
                                alignSelf="center"
                                mr="4"
                                color={bgColor}
                                boxSize="10"
                                as={AlertCircle}
                            />
                        </Flex>
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody padding="0">
                        <Flex display="flex" align="center">
                            <Heading
                                as="h4"
                                padding="0"
                                textAlign="center"
                                fontWeight="bold"
                                fontSize="24px"
                            >
                                {t(`questions.confirmLogout`)}
                            </Heading>
                        </Flex>
                    </ModalBody>
                    <ModalFooter padding="0">
                        <Flex
                            width={"100%"}
                            align="center"
                            justifyContent="center"
                            flexDirection="column"
                            gap="0.5rem"
                        >
                            <Button
                                w={"100%"}
                                bg={bgColor}
                                color={"white"}
                                _hover={{ backgroundColor: hoverColor, color: "white" }}
                                onClick={handleLogout}
                            >
                                {t(`answers.affirmativeLogout`)}
                            </Button>
                            <Button
                                w={"100%"}
                                _hover={{ backgroundColor: hoverColor, color: "white" }}
                                onClick={onCloseModal}
                            >
                                {t(`answers.negativeLogout`)}
                            </Button>
                        </Flex>
                    </ModalFooter>
                </ModalContent>
            </Modal>
            <Flex
                ml={{ base: 0, md: 80 }}
                p={{ base: 4, md: 8 }}
                gap={"20px"}
                alignItems={{ base: "flex-start", md: "center" }}
                bg={backgroundColor}
                justifyContent={{ base: "flex-start", md: "space-between" }}
                flexDirection={{ base: "column-reverse", md: "row" }}
                {...rest}
            >
                <HStack gap={"16px"}>
                    {showBackButton && (
                        <Icon
                            as={ArrowSquareLeft}
                            onClick={onBackButtonClick}
                            color={bgColor}
                            width={"24px"}
                            height={"24px"}
                            cursor={"pointer"}
                        />
                    )}
                    <Heading
                        fontSize={{ base: "20px", md: "32px" }}
                        width={"max-content"}
                        fontWeight="700"
                    >
                        {title}
                    </Heading>
                </HStack>
                <HStack
                    gap={"20px"}
                    w={"100%"}
                    justify={{ base: "space-between", md: "flex-end" }}
                >
                    <Stack display={{ base: "none", md: "block" }}>
                        <ThemeSwitcher />
                    </Stack>
                    <IconButton
                        display={{ base: "flex", md: "none" }}
                        onClick={onOpen}
                        variant="outline"
                        aria-label="open menu"
                        icon={<Menu01 />}
                    />
                    <Stack display={{ base: "none", md: "block" }}>
                        <LanguageSelector
                            selectedLanguage={selectedLanguage}
                            setSelectedLanguage={setSelectedLanguage}
                            t={t}
                        />
                    </Stack>
                    <Icon
                        as={CoftechIcon}
                        w={{ base: "40%", md: "100%" }}
                        h={10}
                        display={{ base: "block", md: "none" }}
                    />
                    <UserMenu
                        t={t}
                        user={user}
                        userPhoto={userPhoto}
                        onOpenModal={onOpenModal}
                    />
                </HStack>
            </Flex>
        </>
    );
};

export default Header