/* eslint-disable react-hooks/exhaustive-deps */
import { useToast } from "@chakra-ui/react";
import { FILEMANAGER } from "@component/constants/fileManager";
import { useLazyGetFileDataQuery } from "@component/store/RTK/FileManager";
import { useError } from "@component/utils/errorContext";
import { FileType } from "@component/types/fileType";
import { useCallback, useEffect } from "react";


export const useFileOperations = (file: FileType) => {
  const [triggerGetURL] = useLazyGetFileDataQuery();
  const { showError } = useError();

  const getFileUrl = useCallback(async () => {
    try {
      const result = await triggerGetURL({ companyID: file.company_id, fileID: file.uuid_unique }).unwrap();
      return result?.data?.url;
    } catch (error) {
      showError('Failed to get file URL');
      return null;
    }
  }, [file.company_id, file.uuid_unique, triggerGetURL]);

  return { getFileUrl };
};

export const useFileManagerErrorEvent = ({
  notification,
  onClose,
  setNotification,
  setIsLoading,
}: {
  notification: any;
  onClose: () => void;
  setNotification: (value: any) => void;
  setIsLoading: (loading: boolean) => void;
}) => {

  const { showError } = useError();

  useEffect(() => {
    if (notification && notification?.event == FILEMANAGER.EVENT.ERROR) {
      onClose()
      showError(notification?.message)
      setIsLoading(false)
      setNotification(undefined)
    }
  }, [notification])

};

export const useManageSocketEvent = ({
  socket,
  isOpen,
  file,
  setNotification,
  setIsLoading,
}: {
  socket: any;
  isOpen: boolean;
  file: FileType
  setNotification: (value: any) => void;
  setIsLoading: (loading: boolean) => void;
}) => {

  useEffect(() => {
    if (isOpen && file) {
      socket.emit(FILEMANAGER.EVENT.JOIN, { roomID: file.uuid_unique });
      socket.on(FILEMANAGER.EVENT.NOTIFICATION, (data) => {
        if (data.fileID === file.uuid_unique) {
          setNotification(data)
        }
      });
    } else if (file) {
      setIsLoading(false)
      socket.emit(FILEMANAGER.EVENT.LEAVE, { roomID: file.uuid_unique });
      socket.off(FILEMANAGER.EVENT.NOTIFICATION);
    }
  }, [isOpen])

};