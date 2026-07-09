/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Text,
  Box,
  Icon,
  useDisclosure,
  Flex,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { AlertCircle, CheckCircle } from "@untitled-ui/icons-react";
import { useQRCode } from "next-qrcode";
import Loading from "./Loading";
import { useDispatch, useSelector } from "react-redux";
import {
  loadBotAction,
  resetQrExpired,
  resetQrGenerated,
} from "@component/store/Socket/socketSlice";
import { useEventCancelInitializitionMutation, useEventInitializeMutation } from "@component/store/RTK/botsRTK";
import useEmitterJoinRoom from "@component/hooks/useEmitterJoin";
import useCoftechColors from "@component/hooks/useCoftechColors";
import { useError } from "@component/utils/errorContext";
import useRemoveRoomFromCookie from "@component/hooks/useRemoveRoomFromCookie";
import { BOT } from "@component/constants/bot";
import { ERROR } from "@component/constants/error";

interface BotModalProps { }
const BotModal: React.FC<BotModalProps> = () => {
  const { t } = useTranslation(BOT.COMMON);
  const { showError } = useError();
  const { Canvas } = useQRCode();
  const dispatch = useDispatch();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [cancelling, setCancelling] = useState(false);
  const room = useSelector((state: any) => state.socket.rooms);
  const isQrExpired = useSelector((state: any) => state.socket.isQrExpired);
  const { qrCode, show, resolve } = useSelector(
    (state: any) => state.socket.qr
  );
  const { type, resolve: actionResolve } = useSelector(
    (state: any) => state.socket.action
  );

  useEffect(() => {
    if (actionResolve && type === BOT.EVENT.CANCEL_INIT) {
      setCancelling(false)
      onClose()
    }
  }, [actionResolve, type])

  const { bgColor, hoverColor } =
    useCoftechColors();
  const { emitterJoinRoom } = useEmitterJoinRoom();

  const { removeCookieRoom } = useRemoveRoomFromCookie()

  const [trigger] = useEventInitializeMutation();

  const [triggerCancel] = useEventCancelInitializitionMutation();

  const overridenOnClose = async () => {
    const botID = room[0]
    dispatch(resetQrGenerated())
    dispatch(resetQrExpired())
    if (!isQrExpired && !resolve) {
      setCancelling(true)
      try {
        dispatch(loadBotAction({ type: BOT.EVENT.CANCEL_INIT, idBot: botID }))
        await triggerCancel(botID).unwrap();
      } catch (error) {
        if (error.status === ERROR.BAD_REQUEST || error.status === ERROR.UNEXPECTED_ERROR) {
          showError(error.data?.message)
        } else {
          showError(error.error)
        }
      }
    } else {
      onClose()
      removeCookieRoom()
    }
  }

  const handleActivateClick = async () => {
    try {
      dispatch(resetQrGenerated())
      dispatch(resetQrExpired())
      removeCookieRoom()

      await trigger(room[0]).unwrap();
      dispatch(resetQrExpired());
      emitterJoinRoom(room[0]);
    } catch (err) {
      if (err.status === ERROR.BAD_REQUEST || err.status === ERROR.BAD_REQUEST) {
        showError(err.data?.message)
      } else {
        showError(err.error)
      }
    }
  };

  const handleSuccess = () => {
    dispatch(resetQrGenerated());
    onClose();
  };

  useEffect(() => {
    if (show) {
      onOpen();
    }
  }, [show, onOpen]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={overridenOnClose}
      size={BOT.MODAL.SIZE}
      isCentered
      closeOnOverlayClick={false}
      variant={BOT.MODAL.VARIANT}
    >
      <ModalOverlay />
      <ModalContent>
        {resolve ? (
          <>
            <ModalHeader textAlign={BOT.TEXT.CENTER} mt={BOT.MARGIN.REGULAR}></ModalHeader>
            <ModalCloseButton />
            <ModalBody textAlign={BOT.TEXT.CENTER}>
              <Box display={BOT.MODAL.DISPLAY} justifyContent={BOT.MODAL.JUSTIFY.CONTENT}>
                <Icon
                  as={CheckCircle}
                  color={bgColor}
                  fontSize={BOT.MODAL.ICON.SIZE}
                  mb={BOT.MODAL.ICON.MARGIN_B}
                />
              </Box>
              <Text fontSize={BOT.MODAL.TITLE.SIZE} fontWeight={BOT.MODAL.TITLE.WEIGHT}>
                {t("modal.linkComplete")}
              </Text>
              <Text fontSize={BOT.MODAL.DESCRIPTION.SIZE}>
                {t("modal.botReady")}
              </Text>
            </ModalBody>
          </>
        ) : !isQrExpired && !cancelling ? (
          <>
            <ModalHeader>{t("modal.scanQR")}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Text mb={BOT.MODAL.DESCRIPTION.MARGIN_B} textAlign={BOT.TEXT.CENTER}>
                {t("modal.scanDescription")}
              </Text>
              {qrCode && show ? (
                <Box display={BOT.MODAL.DISPLAY} justifyContent={BOT.MODAL.JUSTIFY.CONTENT}>
                  <Canvas
                    text={qrCode}
                    options={{
                      errorCorrectionLevel: BOT.MODAL.CANVAS.ERROR_CORRECTION_LEVEL,
                      margin: BOT.MODAL.CANVAS.MARGIN,
                      scale: BOT.MODAL.CANVAS.SCALE,
                      width: BOT.MODAL.CANVAS.WIDTH,
                    }}
                  />
                </Box>
              ) : (
                <Loading mode={BOT.MODAL.LOADING_MODE} />
              )}
            </ModalBody>
          </>
        ) : cancelling ? (
          <>
            <ModalHeader>{t("modal.cancelling")}</ModalHeader>
            <ModalBody pb={BOT.PADDING.ZERO}>
              <Text textAlign={BOT.TEXT.CENTER}>
                {t("modal.cancellingInitialization")}
              </Text>
            </ModalBody>
          </>
        ) : (
          <>
            <ModalHeader textAlign={BOT.TEXT.CENTER} mt={BOT.MARGIN.REGULAR}></ModalHeader>
            <ModalCloseButton />
            <ModalBody textAlign={BOT.TEXT.CENTER}>
              <Flex flexDirection={BOT.MODAL.EXPIRED.FLEX_DIRECTION} gap={BOT.MODAL.EXPIRED.GAP}>
                <Box display={BOT.MODAL.DISPLAY} justifyContent={BOT.MODAL.JUSTIFY.CONTENT}>
                  <Icon
                    as={AlertCircle}
                    color={bgColor}
                    fontSize={BOT.MODAL.EXPIRED.ICON.SIZE}
                    mb={BOT.MODAL.ICON.MARGIN_B}
                  />
                </Box>
                <Text fontSize={BOT.MODAL.TITLE.SIZE} fontWeight={BOT.MODAL.TITLE.WEIGHT}>
                  {t("modal.qrExpired")}
                </Text>
              </Flex>
            </ModalBody>
          </>
        )}
        <ModalFooter marginBottom={(isQrExpired || resolve) && !cancelling ? BOT.MODAL.FOOTER.MARGIN_B : null}>
          {resolve ? (
            <Button
              bg={bgColor}
              color={BOT.MODAL.BUTTON.COLOR}
              _hover={{
                bg: hoverColor,
              }}
              onClick={handleSuccess}
              borderRadius={BOT.MODAL.BUTTON.BORDER.RADIUS}
              w={BOT.MODAL.BUTTON.WIDTH}
            >
              {t("modal.continue")}
            </Button>
          ) : !isQrExpired && !cancelling ? (
            <></>
          ) : cancelling ? (
            <></>
          ) : (
            <Button
              bg={bgColor}
              color={BOT.MODAL.BUTTON.COLOR}
              _hover={{
                bg: hoverColor,
              }}
              onClick={handleActivateClick}
              borderRadius={BOT.MODAL.BUTTON.BORDER.RADIUS}
              w={BOT.MODAL.BUTTON.WIDTH}
            >
              {t("modal.generateQrAgain")}
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
export default BotModal;
