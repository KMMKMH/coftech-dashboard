import { useDispatch } from "react-redux";
import { joinRoom } from "@component/store/Socket/socketSlice";
import { cookieStorage } from "@component/store/cookieStorage";
import { getSocket } from "@component/pages/socket";

export default function useEmitterJoinRoom() {
  const socket = getSocket()
  const dispatch = useDispatch();

  const emitterJoinRoom = (room: string) => {
    cookieStorage.setItem("room", [room]);
    dispatch(joinRoom({ room: room }));

    socket.emit("join_room", room);
  };

  return { emitterJoinRoom };
}
