import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Button,
  Text,
  Box,
  Icon,
  ModalFooter,
} from "@chakra-ui/react";
import { FiAlertTriangle, FiCheckCircle } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import { AxiosUrl } from "@component/configs/AxiosConfig";
import { loadBotAction, resetQrExpired, resetQrGenerated } from "@component/store/Socket/socketSlice";
import {
  useLazyEventSuspendQuery,
  useEventRestartMutation,
  useEventStartMutation,
} from "@component/store/RTK/botsRTK";
import { useDispatch, useSelector } from "react-redux";
import useEmitterJoinRoom from "@component/hooks/useEmitterJoin";
import useRemoveRoomFromCookie from "@component/hooks/useRemoveRoomFromCookie";
import useCoftechColors from "@component/hooks/useCoftechColors";
import { useError } from "@component/utils/errorContext";

export type TypeEditModal =
  | "suspend"
  | "restart"
  | "start"
  | "unlink"
  | "success";

interface BotModalProps {
  idBot: string;
  type: TypeEditModal;
  isOpen: boolean;
  onClose: () => void;
  setLoadingStates: any;
}

const BotEditModal: React.FC<BotModalProps> = ({
  idBot,
  type,
  isOpen,
  onClose,
  setLoadingStates,
}) => {
  const { t } = useTranslation("common");
  const dispatch = useDispatch();
  const { emitterJoinRoom } = useEmitterJoinRoom();
  const { showError } = useError();
  const { removeCookieRoom } = useRemoveRoomFromCookie();
  const room = useSelector((state: any) => state.socket.rooms);
  const [cancelling, setCancelling] = useState(false);
  const { type: actionType, resolve: actionResolve } = useSelector(
    (state: any) => state.socket.action
  );

  useEffect(() => {
    if (actionResolve && actionType === "canceled_initialization") {
      setCancelling(false)
      onClose()
    }
  }, [actionResolve, actionType])

  const [loading, setLoading] = useState(false);

  const { bgColor, hoverColor } =
    useCoftechColors();

  const [triggerEventSuspend] = useLazyEventSuspendQuery();

  const [eventRestart] = useEventRestartMutation();

  const [eventStart] = useEventStartMutation();

  const handleSuspended = async () => {
    dispatch(loadBotAction({ type: "suspended", idBot }));
    try {
      emitterJoinRoom(idBot);
      await triggerEventSuspend(idBot).unwrap();
    } catch (err) {
      if (err.status === 404) {
        showError(err.data?.message)
      } else {
        showError(err.error)
      }
    }
  };

  const handleActivate = async () => {
    dispatch(loadBotAction({ type: "activated", idBot }));
    try {
      dispatch(resetQrGenerated())
      dispatch(resetQrExpired())
      removeCookieRoom()

      emitterJoinRoom(idBot);
      await eventStart(idBot).unwrap();
    } catch (err) {
      if (err.status === 404) {
        showError(err.data?.message)
      } else {
        showError(err.error)
      }
    }
  };

  const handleRestart = async () => {
    dispatch(loadBotAction({ type: "activated", idBot }));
    try {
      emitterJoinRoom(idBot);
      await eventRestart(idBot).unwrap();
    } catch (err) {
      if (err.status === 404) {
        showError(err.data?.message)
      } else {
        showError(err.error)
      }
    }
  };

  const handleUnlinkedDevice = async () => {
    dispatch(loadBotAction({ type: "unlinked", idBot }));
    try {
      emitterJoinRoom(idBot);
      const response = await AxiosUrl.get(`/bots/events/delete?botID=${idBot}`,
      );
    } catch (err) {
      showError(err?.response?.data?.message)
    }
  };

  const handleCancel = async () => {
    if (type == "start") {
      const botID = room[0]
      dispatch(resetQrGenerated())
      dispatch(resetQrExpired())
      setCancelling(true)
      try {
        dispatch(loadBotAction({ type: "canceled_initialization", idBot: botID }))
        const response = await AxiosUrl.post(
          `/bots/events/cancelInitialization?botID=${botID}`
        );
      } catch (error) {
        setCancelling(false)
        showError(error?.response?.data?.message)
      }
    } else {
      onClose();
      setLoadingStates({});
    }
  };
  const handleSuccess = () => {
    onClose();
    setLoadingStates({});
    removeCookieRoom();
  };

  const handleLoading = (event) => {
    setLoading(true);
    event();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="sm"
      isCentered
      variant="coftechModal"
    >
      <ModalOverlay />
      <ModalContent>
        {type === "suspend" ? (
          <Suspend
            event={handleSuspended}
            t={t}
            handleCancel={handleCancel}
            handleLoading={handleLoading}
            loading={loading}
            bgColor={bgColor}
            hoverColor={hoverColor}
          />
        ) : type === "restart" ? (
          <Restart
            event={handleRestart}
            t={t}
            handleCancel={handleCancel}
            handleLoading={handleLoading}
            loading={loading}
            bgColor={bgColor}
            hoverColor={hoverColor}
          />
        ) : type === "start" ? (
          <Start
            event={handleActivate}
            t={t}
            cancelling={cancelling}
            handleCancel={handleCancel}
            handleLoading={handleLoading}
            loading={loading}
            bgColor={bgColor}
            hoverColor={hoverColor}
          />
        ) : type === "unlink" ? (
          <Unlink
            event={handleUnlinkedDevice}
            t={t}
            handleCancel={handleCancel}
            handleLoading={handleLoading}
            loading={loading}
            bgColor={bgColor}
            hoverColor={hoverColor}
          />
        ) : (
          <Success
            t={t}
            handleSuccess={handleSuccess}
            bgColor={bgColor}
            hoverColor={hoverColor}
          />
        )}
        <ModalFooter />
      </ModalContent>
    </Modal>
  );
};

const Suspend = ({
  event,
  t,
  handleCancel,
  handleLoading,
  loading,
  bgColor,
  hoverColor,
}) => {
  return (
    <>
      <ModalHeader textAlign="center" mt={4}></ModalHeader>
      <ModalCloseButton />
      <ModalBody
        textAlign="center"
        display="flex"
        gap="1rem"
        flexDirection="column"
      >
        <Box display="flex" justifyContent="center">
          <Icon as={FiAlertTriangle} color={bgColor} fontSize={"4xl"} mb={2} />
        </Box>
        <Text fontSize="xl" fontWeight={600}>
          {t("editBot.suspendConfirmation")}
        </Text>
        <Button
          bg={bgColor}
          color="white"
          _hover={{
            bg: hoverColor,
          }}
          onClick={() => handleLoading(event)}
          isLoading={loading}
          loadingText={t("editBot.suspending")}
          borderRadius={"md"}
          w={"100%"}
        >
          {t("editBot.suspend")}
        </Button>
        <Button
          bg={bgColor}
          color="white"
          _hover={{
            bg: hoverColor,
          }}
          onClick={handleCancel}
          isDisabled={loading}
          borderRadius={"md"}
          w={"100%"}
        >
          {t("editBot.cancelAction")}
        </Button>
      </ModalBody>
    </>
  );
};

const Start = ({
  event,
  t,
  handleCancel,
  handleLoading,
  loading,
  cancelling,
  bgColor,
  hoverColor,
}) => {
  return (
    <>
      <ModalHeader textAlign="center" mt={4}></ModalHeader>
      <ModalBody
        textAlign="center"
        display="flex"
        gap="1rem"
        flexDirection="column"
      >
        <Box display="flex" justifyContent="center">
          <Icon as={FiAlertTriangle} color={bgColor} fontSize={"4xl"} mb={2} />
        </Box>
        <Text fontSize="xl" fontWeight={600}>
          {t("editBot.startConfirmation")}
        </Text>
        <Button
          bg={bgColor}
          color="white"
          _hover={{
            bg: hoverColor,
          }}
          onClick={() => handleLoading(event)}
          isLoading={loading}
          loadingText={t("editBot.activating")}
          borderRadius={"md"}
          w={"100%"}
        >
          {t("editBot.start")}
        </Button>
        <Button
          bg={bgColor}
          color="white"
          _hover={{
            bg: hoverColor,
          }}
          onClick={handleCancel}
          isLoading={cancelling}
          borderRadius={"md"}
          w={"100%"}
        >
          {t("editBot.cancelStart")}
        </Button>
      </ModalBody>
    </>
  );
};

const Restart = ({
  event,
  t,
  handleCancel,
  handleLoading,
  loading,
  bgColor,
  hoverColor,
}) => {
  return (
    <>
      <ModalHeader textAlign="center" mt={4}></ModalHeader>
      <ModalCloseButton />
      <ModalBody
        textAlign="center"
        display="flex"
        gap="1rem"
        flexDirection="column"
      >
        <Box display="flex" justifyContent="center">
          <Icon as={FiAlertTriangle} color={bgColor} fontSize={"4xl"} mb={2} />
        </Box>
        <Text fontSize="xl" fontWeight={600}>
          {t("editBot.restartConfirmation")}
        </Text>
        <Button
          bg={bgColor}
          color="white"
          _hover={{
            bg: hoverColor,
          }}
          onClick={() => handleLoading(event)}
          isLoading={loading}
          loadingText={t("editBot.restarting")}
          borderRadius={"md"}
          w={"100%"}
        >
          {t("editBot.restart")}
        </Button>
        <Button
          bg={bgColor}
          color="white"
          _hover={{
            bg: hoverColor,
          }}
          onClick={handleCancel}
          isDisabled={loading}
          borderRadius={"md"}
          w={"100%"}
        >
          {t("editBot.cancelRestart")}
        </Button>
      </ModalBody>
    </>
  );
};

const Unlink = ({
  event,
  t,
  handleCancel,
  handleLoading,
  loading,
  bgColor,
  hoverColor,
}) => {
  return (
    <>
      <ModalHeader textAlign="center" mt={4}></ModalHeader>
      <ModalCloseButton />
      <ModalBody
        textAlign="center"
        display="flex"
        gap="1rem"
        flexDirection="column"
      >
        <Box display="flex" justifyContent="center">
          <Icon as={FiAlertTriangle} color={bgColor} fontSize={"4xl"} mb={2} />
        </Box>
        <Text fontSize="xl" fontWeight={600}>
          {t("editBot.unlinkConfirmation")}
        </Text>
        <Button
          bg={bgColor}
          color="white"
          _hover={{
            bg: hoverColor,
          }}
          onClick={() => handleLoading(event)}
          isLoading={loading}
          loadingText={t("editBot.unlinking")}
          borderRadius={"md"}
          w={"100%"}
        >
          {t("editBot.unlink")}
        </Button>
        <Button
          bg={bgColor}
          color="white"
          _hover={{
            bg: hoverColor,
          }}
          onClick={handleCancel}
          isDisabled={loading}
          borderRadius={"md"}
          w={"100%"}
        >
          {t("editBot.cancelUnlink")}
        </Button>
      </ModalBody>
    </>
  );
};

const Success = ({ t, handleSuccess, bgColor, hoverColor }) => {
  return (
    <>
      <ModalHeader textAlign="center" mt={4}></ModalHeader>
      <ModalCloseButton />
      <ModalBody
        textAlign="center"
        display="flex"
        gap="1rem"
        flexDirection="column"
      >
        <Box display="flex" justifyContent="center">
          <Icon as={FiCheckCircle} color="green" fontSize={"4xl"} mb={2} />
        </Box>
        <Text fontSize="xl" fontWeight={600}>
          {t("editBot.success")}
        </Text>

        <Button
          bg={bgColor}
          color="white"
          _hover={{
            bg: hoverColor,
          }}
          onClick={handleSuccess}
          borderRadius={"md"}
          w={"100%"}
        >
          {t("editBot.continue")}
        </Button>
      </ModalBody>
    </>
  );
};

export default BotEditModal;
