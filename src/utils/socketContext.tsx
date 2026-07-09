"use client";
import {
  createContext,
  ReactElement,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Socket } from "socket.io-client";
import { useDispatch } from "react-redux";
import { cookieStorage } from "@component/store/cookieStorage";
import {
  connectionEstablished,
  initSocket,
  connectionLost,
  deviceReady,
  qrGenerated,
  qrExpired,
  resetQrGenerated,
  botActivated,
  botSuspended,
  botUnlinked,
  leaveRoom,
  canceledInitialization,
} from "@component/store/Socket/socketSlice";
import useRemoveRoomFromCookie from "@component/hooks/useRemoveRoomFromCookie";
import { GetAllBots } from "@component/store/botsSlice";
import { useRouter } from "next/router";
import { getSocket } from "@component/pages/socket";

const SocketContext = createContext<Socket | null>(null);

export const useSocket = () => useContext(SocketContext);
interface SocketProviderProps {
  children: ReactElement;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const socket = getSocket()
  const [socketInstance, setSocketInstance] = useState<Socket | null>(null);
  const dispatch = useDispatch();
  const { removeCookieRoom } = useRemoveRoomFromCookie();
  const router = useRouter();

  useEffect(() => {
    if (!socket) return;

    setSocketInstance(socket);

    // Pre-register ALL event listeners before any user action
    const qrGeneratedHandler = (data) => {
      if (data && typeof data.qr === "string" && !data.qr.startsWith("undefined")) {
        dispatch(qrGenerated({ qrCode: data.qr }));
      }
    };

    const deviceReadyHandler = () => {
      const room = cookieStorage.getItem("room");
      dispatch(deviceReady());
      removeCookieRoom();
      if (room) {
        dispatch(leaveRoom({ room: room }));
      }
    };

    const qrExpiredHandler = (data) => {
      dispatch(resetQrGenerated());
      dispatch(qrExpired(data?.extra?.qr_time_expired));
    };

    const whatsappUnlinkedHandler = () => {
      //@ts-ignore
      dispatch(GetAllBots());
    };

    const canceledInitializationHandler = (data) => {
      dispatch(canceledInitialization(data));
    };

    const botActivatedHandler = (data) => {
      dispatch(botActivated(data));
      removeCookieRoom();
    };

    const botSuspendedHandler = (data) => {
      dispatch(botSuspended(data));
      removeCookieRoom();
    };

    const botUnlinkedHandler = (data) => {
      dispatch(botUnlinked(data));
      removeCookieRoom();
      router.push("/bots");
    };

    const handleConnect = () => {
      dispatch(initSocket());
      dispatch(connectionEstablished());

      // Handle manual room joins from cookie
      const storedRoom = cookieStorage.getItem("room");
      if (storedRoom && socket) {
        socket.emit("join_room", storedRoom);
      }
    };

    const handleDisconnect = (reason) => {
      dispatch(connectionLost());
    };

    const handleReconnect = () => {
      dispatch(connectionEstablished());
    };

    // Register all listeners
    socket.on("qr_generated", qrGeneratedHandler);
    socket.on("bot_activated", botActivatedHandler);
    socket.on("device_ready", deviceReadyHandler);
    socket.on("qr_time_expired", qrExpiredHandler);
    socket.on("whatsapp_unlinked", whatsappUnlinkedHandler);
    socket.on("canceled_initialization", canceledInitializationHandler);
    socket.on("bot_suspended", botSuspendedHandler);
    socket.on("bot_unlinked", botUnlinkedHandler);
    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("reconnect", handleReconnect);

    // If already connected, trigger handleConnect
    if (socket.connected) {
      handleConnect();
    }

    const handleBeforeUnload = () => {
      socket?.disconnect();
      dispatch(connectionLost());
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);

      socket.off("qr_generated", qrGeneratedHandler);
      socket.off("bot_activated", botActivatedHandler);
      socket.off("device_ready", deviceReadyHandler);
      socket.off("qr_time_expired", qrExpiredHandler);
      socket.off("whatsapp_unlinked", whatsappUnlinkedHandler);
      socket.off("canceled_initialization", canceledInitializationHandler);
      socket.off("bot_suspended", botSuspendedHandler);
      socket.off("bot_unlinked", botUnlinkedHandler);
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("reconnect", handleReconnect);
    };
  }, [dispatch, removeCookieRoom, router]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
