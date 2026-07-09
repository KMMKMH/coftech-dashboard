import { useCallback } from "react";
import { cookieStorage } from "@component/store/cookieStorage";
import { leaveRoom } from "@component/store/Socket/socketSlice";
import { useDispatch } from "react-redux";
import { getSocket } from "@component/pages/socket";

export default function useRemoveRoomFromCookie() {
  const dispatch = useDispatch();

  const removeCookieRoom = useCallback(() => {
    const socket = getSocket()
    const room = cookieStorage.getItem("room");
    
    if(Array.isArray(room)) {
      dispatch(leaveRoom({ room: room[0] }));
    }
    socket.emit("leave_room", room?.[0]);
    
    cookieStorage.removeItem("room");
  }, [dispatch]);
  return { removeCookieRoom };
}
