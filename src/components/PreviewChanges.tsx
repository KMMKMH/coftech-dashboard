/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    Text,
    useColorModeValue,
    Box,
    useBreakpointValue,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";

const PreviewChanges = ({ isOpen, onClose, changes, setModalChanges, activity }) => {
    const { t } = useTranslation("common");

    const isMobile = useBreakpointValue({ base: true, md: false });

    useEffect(() => {
        if (!isOpen) {
            setModalChanges(null)
        }
    }, [isOpen])

    const stageBorderColor = useColorModeValue("#E5EEF7", "#17304F");

    function stringifyChanges(obj: any): string {
        if (typeof obj !== 'object' || obj === null) return String(obj);

        return Object.entries(obj)
            .map(([key, value]) => `${key}: ${value}`)
            .join(', ');
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            size="md"
            isCentered
            variant="coftechModal"
        >
            <ModalOverlay />
            <ModalContent border={`1px solid ${stageBorderColor}`} w={"full"} maxW={isMobile ? null : "900px"}>
                <ModalCloseButton />
                <ModalHeader>{t("activity.changes")}</ModalHeader>
                <ModalBody w={"full"} maxW={isMobile ? null : "900px"} overflowY={"auto"} maxH={"500px"}>
                    <Box m={1}>
                        <Text m={0} mr={"auto"} mb={"20px"} p={0} fontSize={"15px"} fontWeight={"bold"}>{activity}</Text>
                    </Box>
                    <Box m={1}>
                        {changes?.map(([key, value], index) => {
                            if (key != "none") {
                                return (
                                    <Box key={`${key}-${index}`} mb={"10px"}>
                                        <Text m={0} mr={"auto"} mb={"5px"} p={0} fontSize={"15px"} fontWeight={"bold"}>{key}:</Text>
                                        <Text m={0} mr={"auto"} p={0} fontSize={"15px"}>{stringifyChanges(value)}</Text>
                                    </Box>
                                )
                            }
                        })}
                    </Box>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default PreviewChanges;
