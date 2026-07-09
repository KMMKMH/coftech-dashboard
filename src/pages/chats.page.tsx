import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Box,
  Button,
  VStack,
  HStack,
  Avatar,
  Text,
  Input,
  Heading,
  Spinner,
  Img,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  DrawerCloseButton,
  Link,
  useBreakpointValue,
  useColorModeValue,
  useToast,
  useToken,
  InputGroup,
  InputLeftElement,
  Icon,
} from "@chakra-ui/react";

import { SearchIcon, WarningIcon } from "@chakra-ui/icons";
import { FaWhatsapp } from "react-icons/fa";
import { AppShell } from '@component/components/layout'
import { useAuthStore } from "@component/store/auth";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { withTranslation } from "react-i18next";
import { Select } from "chakra-react-select";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@component/store";
import { companiesGet } from "@component/store/companySlice";
import { GetBotsByCompany, ResetBots } from "@component/store/botsSlice";
import Image from "next/image";
import MessageContent from "@component/components/MessageContent";
import useCoftechColors from "@component/hooks/useCoftechColors";
import { useInView } from 'react-intersection-observer'
import refresh from "@component/assets/images/refresh.svg";
import { ApolloError, ApolloQueryResult, OperationVariables, useMutation, useQuery } from "@apollo/client";
import { GetMessages, GetLastContacts, GetExtensions, GetAssignedUser, GetAvatars, GetBlackList, DeleteBlacklist, CreateBlacklist } from "@component/store/graphqlQuerries"
import MemoAvatar from "@component/components/MemoAvatar";
import useCallCenterFeatures from "@component/components/CallCenterFeatures";
import { useError } from "@component/utils/errorContext";
import ReplyMessage from "@component/components/ReplyMessage";
import { useLazyGetSocialNetworkActivationsQuery } from "@component/store/RTK/botsRTK";
import useCoftechSelect from "@component/hooks/useCoftechSelect";
import { usePopUp } from "@component/utils/popUpContext";
import useErrorHandler from "@component/hooks/useErrorHandler";
import { ErrorBoundary } from "react-error-boundary";
import { ErrorFallback } from "@component/components/ErrorFallback";
import { Message } from "@component/types/messageType";
import CoftechMenu from "@component/components/CoftechMenu";
import { LockUnlocked02, SlashCircle01 } from "@untitled-ui/icons-react";
import useDebounce from "@component/hooks/useDebounce";
import { getSocket } from "./socket";

interface SelectedBot {
  network_key: string
  uuid_unique: string
  name: string
}

interface ContactMetadata {
  organization: string
  urls: string
}

interface ActiveSender {
  id: string
  name: string
  phone: string
  photo: string
  metadata: ContactMetadata
}

interface Translation {
  (key: string, options?: Record<string, any>): string;
}

const Chats = ({ t }) => {
  const socket = getSocket()
  const dispatch: AppDispatch = useDispatch();
  const { user } = useAuthStore();
  const { handleError } = useErrorHandler();
  const { showPopUp } = usePopUp();

  const { companies, error: companiesError } = useSelector((state: any) => state.company);
  const { bots, loading: loadingBots, error: botsError } = useSelector(
    (state: any) => state.bots
  );
  const [search, setSearch] = useState("");

  const [selectedCompany, setSelectedCompany] = useState(null);
  const [selectedBot, setSelectedBot] = useState<SelectedBot>(null);
  const [selectedFilter, setSelectedFilter] = useState<number>(0);
  const [selectedContact, setSelectedContact] = useState(null);
  const [activeChat, setActiveChat] = useState(null);
  const [activeSender, setActiveSender] = useState<ActiveSender>(null);
  const [inputValue, setInputValue] = useState("");
  const { ref, inView } = useInView({ initialInView: false })
  const { ref: ChatsRef, inView: ChatsRefInView } = useInView({ initialInView: false })
  const [triggerNetworks, { data: networksResponse, isLoading: loadingNetworks, isError: networksIsError, error: networksError }] = useLazyGetSocialNetworkActivationsQuery()


  const isAdmin = user?.rol_key === "SUPERADMIN" || user?.rol_key === "ADMIN"
  const selectedUserCompany = user?.company_id == selectedCompany

  const {
    bgColor,
    hoverColor,
    panelBgColor,
    backgroundColor,
    descriptionColor,
    textColor,
  } = useCoftechColors();

  const {
    style,
    styleLightBorder
  } = useCoftechSelect();

  const stageColor1 = useColorModeValue("coftech.border.light", "transparent");

  const isMobile = useBreakpointValue({ base: true, md: false });

  const [selectedImage, setSelectedImage] = useState(null);
  const [metaData, setMetaData] = useState(null);
  const {
    isOpen: isImageOpen,
    onOpen: onImageOpen,
    onClose: onImageClose,
  } = useDisclosure();

  const {
    isOpen: isDrawerOpen,
    onOpen: onDrawerOpen,
    onClose: onDrawerClose,
  } = useDisclosure();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const [botPhone, setBotPhone] = useState(null)
  const [contactsLimit, setContactsLimit] = useState(10)
  const [lastContactsData, setLastContactsData] = useState(null)
  const [filteredLastContacts, setFilteredLastContacts] = useState(null)
  const [filteredBlockedContacts, setFilteredBlockedContacts] = useState(null)
  const [blockedContactsData, setBlockedContactsData] = useState(null)
  const [blockUnblockLoading, setBlockUnblockLoading] = useState<boolean>(false)
  const [displayContacts, setDisplayContacts] = useState(null)
  const [messages, setMessages] = useState<any>([]);
  const [loaded, setLoaded] = useState<number>(1)
  const [scrollOldHeight, setScrollOldHeight] = useState<number>()
  const [loading, setLoading] = useState<boolean>(false)
  const [totalPages, setTotalPages] = useState<number>(1)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [activateLoader, setActivateLoader] = useState<boolean>(false)
  const [assignedUserLoading, setAssigneUserLoading] = useState<boolean>(false)
  const [userAvatar, setUserAvatar] = useState<string>("")
  const [botAvatar, setBotAvatar] = useState<string>("")
  const [isRefteching, setIsRefteching] = useState<boolean>(false)
  const [flagSocket, setFlagSocket] = useState<boolean>(false)
  const [isChatSocket, setChatSocket] = useState<boolean>(false)
  const [flagAvailableUserSocket, setFlagAvailableUserSocket] = useState<boolean>(false)
  const [networks, setNetworks] = useState<any>()
  const [selectedNetwork, setSelectedNetwork] = useState<string>()
  const refreshCooldownTime = 5000;
  const throttleTime = 300;
  const limit = 10
  const toast = useToast();
  const { checkCoolDown, checkThrottle, checkThrottleWithFeedback, throttleEnd } = useDebounce(t, refreshCooldownTime, throttleTime)

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;

    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const messagesSkip = !botPhone || !activeSender?.phone || !selectedNetwork
  const avatarsSkip = !botPhone || !activeSender?.phone || !selectedNetwork
  const assignedSkip = !botPhone || !activeSender?.phone || !selectedNetwork
  const extensionsSkip = !botPhone
  const blockedSkip = !selectedBot?.uuid_unique || !selectedCompany

  useEffect(() => {
    const storedNetwork = localStorage.getItem("chatNetwork")
    if (storedNetwork) {
      setSelectedNetwork(storedNetwork)
    }
  }, [])

  const { data: lastContacts, error: lastContactsErrors, refetch: refetchLastContacts } = useQuery(GetLastContacts, {
    variables: {
      botPhone: botPhone,
      limit: contactsLimit + 1,
      networkID: selectedNetwork
    },
    errorPolicy: "all",
  })

  const isBlocked = blockedContactsData?.some(item => item.id === activeSender?.id)

  interface CreateBlacklistVars {
    botId: string;
    phone: string;
  }
  const [block, { data: blockResponse }] = useMutation(CreateBlacklist)

  interface DeleteBlacklistVars {
    botID: string;
    phone: string;
  }
  const [unblock, { data: unblockResponse }] = useMutation(DeleteBlacklist)

  const { data: blockedContacts, error: blockedContactsErrors, refetch: refetchBlockedContacts } = useQuery(GetBlackList, {
    variables: {
      companyId: selectedCompany,
      botId: selectedBot?.uuid_unique,
    },
    errorPolicy: "all",
    skip: blockedSkip
  })
  const { data: messageData, error: messagesError, refetch: refetchMessages } = useQuery(GetMessages, {
    variables: {
      botPhone: botPhone,
      contactPhone: activeSender?.phone,
      limit: limit,
      page: loaded,
      networkID: selectedNetwork
    },
    errorPolicy: "all",
    skip: messagesSkip,
  })

  const { data: avatars, error: avatarsError, refetch: refetchAvatars } = useQuery(GetAvatars, {
    variables: {
      botPhone: botPhone,
      contactPhone: activeSender?.phone,
      limit: 1,
      page: 1,
      networkID: selectedNetwork
    },
    errorPolicy: "all",
    skip: avatarsSkip
  })

  const { data: assignedUser, loading: assignedUserLoadingData, error: assignedError } = useQuery(GetAssignedUser, {
    variables: {
      botPhone: botPhone,
      contactPhone: activeSender?.phone,
      networkID: selectedNetwork
    },
    errorPolicy: "all",
    skip: assignedSkip
  })

  const { data: extensions, error: extensionsError } = useQuery(GetExtensions, {
    variables: {
      botPhone: botPhone,
    },
    errorPolicy: "all",
    skip: extensionsSkip
  })

  const useErrorEffect = (error, condition = true) => {
    useEffect(() => {
      if (condition && error) {
        handleError(error);
      }
    }, [error, condition]);
  };

  useErrorEffect(extensionsError);
  useErrorEffect(networksError, networksIsError);
  useErrorEffect(botsError, botsError?.message?.length > 1);
  useErrorEffect(companiesError, companiesError?.message?.length > 1);
  useErrorEffect(messagesError);
  useErrorEffect(avatarsError);
  useErrorEffect(assignedError);

  useEffect(() => {
    if (networksResponse) {
      setNetworks(networksResponse.data)
      const response = networksResponse.data?.filter((net) => net.social_network_id == selectedNetwork)
      if (response?.length <= 0) {
        setSelectedNetwork(networksResponse.data?.[0]?.social_network_id)
        localStorage.setItem("chatNetwork", networksResponse.data?.[0]?.social_network_id)
      }
    }
  }, [networksResponse, selectedNetwork])

  useEffect(() => {
    if (avatars) {
      if (avatars?.bots[0]?.contacts?.items[0]?.messages?.items[0]?.via == "send") {
        setUserAvatar(avatars?.bots[0]?.contacts?.items[0]?.messages?.items[0]?.to_send_picture)
        setBotAvatar(avatars?.bots[0]?.contacts?.items[0]?.messages?.items[0]?.sender_picture)
      } else {
        setUserAvatar(avatars?.bots[0]?.contacts?.items[0]?.messages?.items[0]?.sender_picture)
        setBotAvatar(avatars?.bots[0]?.contacts?.items[0]?.messages?.items[0]?.to_send_picture)
      }
    } else {
      setUserAvatar("")
      setBotAvatar("")
    }
  }, [avatars])

  useEffect(() => {
    setAssigneUserLoading(assignedUserLoadingData)
  }, [assignedUserLoadingData])

  useEffect(() => {
    if (messageData?.bots[0]?.contacts?.items[0]?.messages?.totalPages >= 0) {
      setTotalPages(messageData?.bots[0]?.contacts?.items[0]?.messages?.totalPages)
    }
    if (messageData?.bots[0]?.contacts?.items[0]?.messages?.currentPage >= 1) {
      setCurrentPage(messageData?.bots[0]?.contacts?.items[0]?.messages?.currentPage)
    }
  }, [messageData])

  useEffect(() => {
    if (activeSender) {
      setLoading(true)
      refetchAvatars()
    }
    setActivateLoader(false)
  }, [activeSender, refetchAvatars])

  useEffect(() => {
    if (!loading) {
      setIsRefteching(false)
      setTimeout(() => {
        scrollRef.current?.scrollTo({
          top: 99999999, behavior: "auto"
        });
        setTimeout(() => {
          if (totalPages > 1) setActivateLoader(true)
        }, 100)
      }, 100)
    } else {
      setMessages([])
      setLoaded(1)
    }

  }, [loading, totalPages])

  useEffect(() => {
    if (messages && loaded > 1) {
      scrollRef.current?.scrollTo({
        top: scrollRef.current?.scrollHeight - scrollOldHeight,
        behavior: "auto"
      });

      setIsRefteching(false)
    }

    if (flagSocket) {
      setFlagSocket(false);
      scrollRef.current?.scrollTo({
        top: 99999999, behavior: "auto"
      });
    }
  }, [flagSocket, loaded, messages, scrollOldHeight])

  useEffect(() => {
    if (messageData) {
      setLoading(false)
      setMessages((prev) => {
        const condition = prev.some(msg => msg.body === messageData?.bots[0]?.contacts?.items[0]?.messages?.items[0]?.body && msg.created_at === messageData?.bots[0]?.contacts?.items[0]?.messages?.items[0].created_at)
        if (!condition && messageData?.bots[0]?.contacts?.items[0]?.messages?.items) {
          return [...prev, ...messageData?.bots[0]?.contacts?.items[0]?.messages?.items]
        } else {
          return [...prev]
        }
      })
    } else if (messages.length <= 0) {
      setLoaded(1)
    }
    if (messageData?.bots[0]?.contacts?.items[0]?.messages?.items.length <= 0) {
      setMessages([])
      setLoaded(1)
    }
  }, [messageData, messages?.length])

  useEffect(() => {
    setLoading(false)
  }, [botPhone])

  useEffect(() => {
    if (ChatsRefInView) {
      if (loaded < totalPages && !isRefteching && (scrollRef.current.scrollHeight != scrollOldHeight)) {
        setIsRefteching(true)
        setScrollOldHeight(scrollRef.current.scrollHeight)
        setLoaded(loaded + 1)
        refetchMessages()
      }
    }
  }, [ChatsRefInView, isRefteching, loaded, refetchMessages, scrollOldHeight, totalPages])

  const resetChatState = useCallback(() => {
    setContactsLimit(10);
    setLoaded(1);
    setMessages([]);
    setSelectedContact(null);
    setActiveChat(null);
    setActiveSender(null);
  }, []);

  const formatInternationalPhone = (phone: string | undefined) => {
    if (!phone) return '';
    phone = phone.trim().replace(/[^\d+]/g, '');

    if (!phone.startsWith('+')) {
      phone = `+${phone}`;
    }
    return phone;
  }

  const successText = useMemo(() => t("fileManager.success"), [t]);
  const blockSuccessText = useMemo(() => t("chats.blockSuccess"), [t]);
  const unblockSuccessText = useMemo(() => t("chats.unblockSuccess"), [t]);

  const doRefresh = useCallback(async (response: any) => {
    if (response == undefined) return

    try {
      if (response?.createBlacklist) {
        await refetchBlockedContacts()
      }
      await refetchLastContacts()
      if (response?.deleteBlacklist) {
        await refetchBlockedContacts()
      }

      if (isMountedRef.current) {
        resetChatState()
        toast({
          title: successText,
          description: response?.createBlacklist ? blockSuccessText : unblockSuccessText,
          status: "success",
          duration: 2000,
          isClosable: true,
        });
      }
    } catch (err) {
      if (isMountedRef.current) handleError(err)
    } finally {
      if (isMountedRef.current) setBlockUnblockLoading(false)
    }
  }, [blockSuccessText, refetchBlockedContacts, refetchLastContacts, resetChatState, successText, toast, unblockSuccessText])

  const handleUnblock = async () => {
    try {
      setBlockUnblockLoading(true)
      const vars: DeleteBlacklistVars = {
        botID: selectedBot?.uuid_unique,
        phone: formatInternationalPhone(activeSender?.phone)
      }
      await unblock({ variables: vars });
    } catch (err) {
      setBlockUnblockLoading(false)
      handleError(err)
    }
  }

  useEffect(() => {
    doRefresh(unblockResponse);
  }, [doRefresh, unblockResponse])

  const handleBlock = async () => {
    try {
      setBlockUnblockLoading(true)
      const vars: CreateBlacklistVars = {
        botId: selectedBot?.uuid_unique,
        phone: formatInternationalPhone(activeSender?.phone)
      }
      await block({ variables: vars });
    } catch (err) {
      setBlockUnblockLoading(false)
      handleError(err)
    }
  }

  useEffect(() => {
    doRefresh(blockResponse);
  }, [blockResponse, doRefresh])

  const callCenterFeatures = useCallCenterFeatures({
    extensions,
    loadingBots,
    userRole: user?.rol_key,
    inputValue,
    setInputValue,
    t,
  });

  useEffect(() => {
    if (lastContacts !== undefined || lastContactsErrors !== undefined) {
      setLastContactsData(lastContacts)
    }
  }, [lastContacts, lastContactsErrors]);

  const resetBlockedContacts = useCallback(() => {
    const blocked = (blockedContacts?.blacklist || []).map((contact) => {
      return {
        "id": contact.id,
        "name": null,
        "phone": contact.phone,
        "photo": null,
        "metadata": null
      }
    });
    setBlockedContactsData(blocked)
  }, [blockedContacts?.blacklist])


  useEffect(() => {
    if (blockedContacts || blockedContactsErrors) {
      resetBlockedContacts()
    }
  }, [blockedContacts, blockedContactsErrors, resetBlockedContacts]);

  const HandleRefreshOnClick = () => {
    if (checkCoolDown()) {
      let contactsScroller = document.getElementById("contactsScroller");
      if (contactsScroller) {
        contactsScroller.scrollTop = 0;
      }
      resetChatState()

      switch (selectedFilter) {
        case (0):
          refetchLastContacts()
          break
        case (1):
          break
        case (2):
          break
        case (3):
          refetchBlockedContacts()
          break
      }
    }
  }

  const HandleRefreshMessages = () => {
    if (checkCoolDown()) {
      setLoaded(1)
      setMessages([])
      refetchMessages()
    }
  }

  useEffect(() => {
    if (activeSender !== null) {
      setMetaData(JSON.parse(String(activeSender?.metadata)))
    }
  }, [activeSender]);

  useEffect(() => {
    if (throttleEnd && search != null) {
      setFilteredLastContacts(lastContactsData?.bots?.[0]?.lastContacts.filter((item) => {
        if (item?.name?.toLowerCase().includes(search.toLowerCase()) || item?.phone?.toLowerCase().includes(search.toLowerCase())) {
          return item
        }
      }))

      setFilteredBlockedContacts(blockedContactsData?.filter((item) => {
        if (item?.name?.toLowerCase().includes(search.toLowerCase()) || item?.phone?.toLowerCase().includes(search.toLowerCase())) {
          return item
        }
      }))
    }
  }, [throttleEnd, search, lastContactsData, blockedContactsData])

  useEffect(() => {
    if (lastContactsData) {
      setFilteredLastContacts(lastContactsData?.bots?.[0]?.lastContacts)
    }
    if (blockedContactsData) {
      setFilteredBlockedContacts(blockedContactsData)
    }
  }, [lastContactsData, blockedContactsData])

  useEffect(() => {
    switch (selectedFilter) {
      case (0):
        if (filteredLastContacts?.length > 0) {
          setDisplayContacts(filteredLastContacts)
          break
        } else {
          setDisplayContacts(null)
          break
        }
      case (1):
        setDisplayContacts(null)
        break
      case (2):
        setDisplayContacts(null)
        break
      case (3):
        if (filteredBlockedContacts?.length > 0) {
          setDisplayContacts(filteredBlockedContacts)
          break
        } else {
          setDisplayContacts(null)
          break
        }
    }
  }, [selectedFilter, filteredBlockedContacts, filteredLastContacts])

  useEffect(() => {
    const hasSeenModal = localStorage.getItem("ChatsWelcomeModal");
    if (!hasSeenModal) {
      onOpen();
      localStorage.setItem("ChatsWelcomeModal", "true");
    }
  }, [onOpen]);

  useEffect(() => {
    if (user?.rol_key !== "SUPERADMIN") {
      dispatch(GetBotsByCompany(user?.company_id));
    }
    dispatch(ResetBots());
  }, [dispatch, user?.company_id, user?.rol_key]);

  useEffect(() => {
    if (inView) {
      setContactsLimit(contactsLimit + 50)
    }
  }, [contactsLimit, inView]);

  useEffect(() => {
    if (companies?.length > 0 && !selectedCompany) {
      setSelectedCompany(companies[0].uuid_unique);
    } else if (user?.rol_key !== "SUPERADMIN") {
      setSelectedCompany(user?.company_id);
    }
  }, [companies, selectedCompany, user?.company_id, user?.rol_key]);

  useEffect(() => {
    if (selectedCompany) {
      dispatch(GetBotsByCompany(selectedCompany));
    }
  }, [dispatch, selectedCompany]);

  useEffect(() => {
    if (bots?.length > 0 && !selectedBot) {
      setSelectedBot(bots[0]);
      if (bots[0].identifier == "") {
        setBotPhone(null)
      }
      else {
        setBotPhone(bots[0].identifier)
      }
    }

    if (selectedBot) {
      triggerNetworks(selectedBot.uuid_unique)
    }
  }, [bots, selectedBot, triggerNetworks]);

  useEffect(() => {
    if (user?.company_id) {
      if (user.rol_key === "SUPERADMIN") {
        dispatch(companiesGet());
      }
    }
  }, [dispatch, user?.company_id, user?.rol_key]);

  const handleCompanyChange = (selectedOption) => {
    if (checkThrottle() && selectedOption.value != selectedCompany) {
      setSelectedCompany(selectedOption.value);
      resetChatState()
      dispatch(GetBotsByCompany(selectedOption.value)).then((response) => {
        if (response.payload.data.length > 0) {
          setSelectedBot(response.payload.data[0]);
          if (response.payload.data[0].identifier == "") {
            setBotPhone(null)
          }
          else {
            setBotPhone(response.payload.data[0].identifier)
          }
        } else {
          setSelectedBot(null);
          setBotPhone(null)
        }
      });
    }
  };

  const handleBotChange = (selectedOption) => {
    if (checkThrottle() && selectedOption.value != selectedBot) {
      resetChatState()
      setSelectedBot(selectedOption.value);
      if (selectedOption.value.identifier == "") {
        setBotPhone(null)
      }
      else {
        setBotPhone(selectedOption.value.identifier)
      }
    }
  };

  const handleFilterChats = (selectedOption) => {
    if (checkThrottle() && selectedOption.value != selectedFilter) {
      setSelectedFilter(selectedOption.value)
      resetChatState()
    }
  };

  const handleNetworkChange = (selectedOption) => {
    if (checkThrottle() && selectedOption.value != selectedNetwork) {
      setSelectedNetwork(selectedOption.value);
      localStorage.setItem("chatNetwork", selectedOption.value);
      resetChatState()
    }
  };

  const handleUserClick = (sender, contact) => {
    if (selectedCompany && selectedBot) {
      setActiveChat(sender);
      setActiveSender(contact);
      setSelectedContact(contact)
    }
  };

  const handleImageClick = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    onImageOpen();
  };

  const downloadImage = () => {
    const a = document.createElement("a");
    a.href = selectedImage;
    a.download = "image.jpg";
    a.click();
  };

  const optionsCompany = (companies || []).map((company) => {
    return {
      value: company.uuid_unique,
      label: (
        <HStack>
          <Text>{company.name}</Text>
        </HStack>
      ),
    };
  });

  const optionsBots = (bots || []).map((bot) => {
    return {
      value: bot,
      label: (
        <HStack>
          <Text>{bot.name}</Text>
        </HStack>
      ),
    };
  });

  const filters = [
    { name: t("chats.all"), value: 0 },
    { name: t("chats.unread"), value: 1 },
    { name: t("chats.archived"), value: 2 },
    { name: t("chats.blocked"), value: 3 }
  ]
  const optionsChatsFilter = (filters || []).map((filter) => {
    return {
      value: filter.value,
      label: (
        <HStack>
          <Text>{filter.name}</Text>
        </HStack>
      ),
    };
  });

  const optionsNetworks = (networks || []).map((network) => {
    return {
      value: network.social_network_id,
      label: (
        <HStack>
          <Text>{network.network_name}</Text>
        </HStack>
      ),
    };
  });

  const optionsContacts = useMemo(() => {
    return (displayContacts || []).map((item, i) => {
      if (i < contactsLimit) {
        return {
          value: item.id,
          label: (
            <HStack>
              {item?.photo && item?.photo.length > 0 ? (
                <MemoAvatar
                  base64={item.photo}
                  mimeType="image/jpeg"
                  radius={25}
                />
              ) : (
                <Avatar width={6} height={6} src="" />
              )}
              <Text>{item.name ? item.name : `( +${item.phone} )`}</Text>
            </HStack>
          ),
        }
      }
    }).filter((item) => item !== undefined);
  }, [contactsLimit, displayContacts])

  if (displayContacts?.length > contactsLimit) {
    optionsContacts.push({
      value: optionsContacts[0]?.value,
      label: (
        <HStack ref={ref}>
          <Text>{t("chats.loading")}</Text>
        </HStack>
      ),
    });
  }

  const handleContactChange = (selectedOption) => {
    const contact = displayContacts.find(
      (item) => {
        return item.id === selectedOption.value
      }
    )
    handleUserClick(selectedOption.value, contact);
  };

  const addEmoji = (emoji) => {
    setInputValue(inputValue + emoji.native);
  };

  const handleTerminateChat = () => {
    if (user?.company_id !== selectedCompany) return;
    socket.emit("chat:release", {
      phoneNumber: activeSender?.phone,
      botID: selectedBot?.uuid_unique,
    });
  };

  const handleTakeChat = () => {
    if (user?.company_id !== selectedCompany) return;
    socket.emit("chat:claim", {
      phoneNumber: activeSender?.phone,
      botID: selectedBot?.uuid_unique,
    });
  };

  const socketEvents = useMemo(() => {
    return {
      chatClaimed: "chat:claimed",
      chatReleased: "chat:released",
      chatError: "chat:error",
      messageSent: "message:sent",
      messageConfirmed: "message:confirmed",
      messageError: "message:error",
      messageNew: "message:new",
      messageEdited: "message:edited",
      messageRevoked: "message:revoked",
      availabilityStatus: "chat:availability_status"
    }
  }, [])

  const handleSocketEvent = useCallback((event, message) => {
    if (user?.company_id !== selectedCompany) return;

    switch (event) {
      case socketEvents.availabilityStatus:
        if (message.success) {
          setChatSocket(!message.isAvailable)
        } else if (message.error) {
          toast({
            title: t("chats.warning"),
            description: message.error,
            status: "info",
            duration: 2000,
            isClosable: true,
          });
        }
        break;

      case socketEvents.chatClaimed:
        setFlagAvailableUserSocket(true)
        break;

      case socketEvents.chatReleased:
        setFlagAvailableUserSocket(false)
        break;

      case socketEvents.messageSent:
        break;

      case socketEvents.messageConfirmed:
        setMessages((prevMessages) => [message.data, ...prevMessages]);
        setFlagSocket(true);
        showPopUp("success", t("chats.messageConfirmed"))
        break;

      case socketEvents.chatError:
      case socketEvents.messageError:
        showPopUp("error", t("chats.warning"))
        break;

      case socketEvents.messageNew:
        setMessages((prevMessages) => [message, ...prevMessages]);
        setFlagSocket(true);
        break;

      case socketEvents.messageEdited:
        const updates = { is_edited: true, body: message.body };
        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg.message_id === message.message_id
              ? { ...msg, ...updates }
              : msg
          )
        );
        setFlagSocket(true);
        break;

      case socketEvents.messageRevoked:
        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg.message_id === message.message_id
              ? { ...msg, is_revoked: true, body: `(${msg.body})` }
              : msg
          )
        );
        setFlagSocket(true);
        break;
    }
  }, [selectedCompany, showPopUp, socketEvents.availabilityStatus, socketEvents.chatClaimed, socketEvents.chatError, socketEvents.chatReleased, socketEvents.messageConfirmed, socketEvents.messageEdited, socketEvents.messageError, socketEvents.messageNew, socketEvents.messageRevoked, socketEvents.messageSent, t, toast, user?.company_id]);

  const socketEventList: string[] = useMemo(() => Object.values(socketEvents), [socketEvents]);
  const handlersMap = useRef<Map<string, (message: any) => void>>(new Map());

  const claimChatSocket = useCallback(() => {
    if (!socket) return;

    for (const event of socketEventList) {
      const handler = (message: any) => handleSocketEvent(event, message);
      handlersMap.current.set(event, handler);
      socket.on(event, handler);
    }
  }, [socketEventList, handleSocketEvent]);

  const leaveChatSocket = useCallback(() => {
    if (!socket) return;

    for (const [event, handler] of handlersMap.current.entries()) {
      socket.off(event, handler);
    }
    handlersMap.current.clear();
  }, []);

  useEffect(() => {
    setChatSocket(false);
    leaveChatSocket();
    claimChatSocket();

    const inAssignedUser =
      assignedUser?.bots[0]?.contacts?.items[0]?.assigned_user;

    if (inAssignedUser != null) {

      const isTakeUser =
        inAssignedUser?.first_name === user?.first_name &&
        inAssignedUser?.last_name === user?.last_name;

      if (isTakeUser) {
        setChatSocket(true);
      }
    }

    return () => {
      leaveChatSocket();
    };
  }, [assignedUser, user, leaveChatSocket, claimChatSocket]);

  useEffect(() => {
    if (activeSender?.phone && selectedBot?.uuid_unique && user?.company_id === selectedCompany) {
      socket.emit("chat:check_availability", {
        phoneNumber: activeSender.phone,
        botID: selectedBot.uuid_unique,
      });
    }
  }, [activeSender?.phone, flagAvailableUserSocket, selectedBot?.uuid_unique, selectedCompany, user?.company_id]);

  return (
    <AppShell title={t("chats.title")}>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size={"xl"}
        isCentered
        variant="coftechModal"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign="center">
            {t("modalsWelcome.chats.welcome")}
          </ModalHeader>
          <ModalBody>
            <VStack spacing={4} textAlign="center">
              <Image
                src="/images/chats.png"
                alt="Chats"
                width={300}
                height={30}
              />
              <Text fontSize="md">{t("modalsWelcome.chats.description")}</Text>
            </VStack>
          </ModalBody>
          <ModalFooter justifyContent="center">
            <Button
              bg={bgColor}
              color={"white"}
              _hover={{
                bg: hoverColor,
              }}
              w={"100%"}
              onClick={onClose}
            >
              {t("modalsWelcome.chats.start")}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal
        isOpen={isImageOpen}
        onClose={onImageClose}
        size="xl"
        isCentered
        variant="coftechModal"
      >
        <ModalOverlay />
        <ModalContent maxH={isMobile ? "650px" : "750px"} maxW={{ base: "350px", md: "600px", lg: "1100px" }} w={"fit-content"}>
          <ModalHeader>{t("chats.imagePreview")}</ModalHeader>
          <ModalBody>
            {selectedImage && (
              <Img
                src={selectedImage}
                alt="Selected media"
                m={"auto"}
                width="auto"
                maxW={{ base: "300px", md: "500px", lg: "900px" }}
                maxH={isMobile ? "400px" : "500px"}
                height="auto"
                borderRadius="md"
              />
            )}
          </ModalBody>
          <ModalFooter justifyContent="space-between">
            <HStack minWidth={"200px"} w={"full"}>
              <Button
                mr={"auto"}
                bg={bgColor}
                color={"white"}
                _hover={{
                  bg: hoverColor,
                }}
                onClick={downloadImage}
              >
                {t("chats.download")}
              </Button>
              <Button variant="outline" onClick={onImageClose} ml={"auto"}>
                {t("chats.close")}
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Drawer isOpen={isDrawerOpen} placement="right" onClose={onDrawerClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>
            {activeSender?.name || activeSender?.id}
          </DrawerHeader>

          <DrawerBody>
            <VStack spacing={4} align="start">
              {activeSender?.photo ? (
                <MemoAvatar
                  base64={activeSender?.photo}
                  mimeType="image/jpeg"
                  radius={120}
                />
              ) : (
                <Avatar size="xl" name={activeSender?.name} />
              )}
              <Text fontWeight="bold">
                {t("chats.phone")}: {"+"}{activeSender?.phone}
              </Text>
              {metaData?.formattedNumber.location && (
                <Text fontWeight="bold">
                  {t("chats.location")}: {metaData?.formattedNumber.location}
                </Text>
              )}
              {activeSender?.metadata?.organization && (
                <Text fontWeight="bold">
                  {t("chats.organization")}:{" "}
                  {activeSender?.metadata?.organization}
                </Text>
              )}
              {activeSender?.metadata?.urls && (
                <Box>
                  <Text fontWeight="bold">{t("chats.urls")}:</Text>
                  <Link
                    href={activeSender?.metadata?.urls}
                    isExternal
                    color="blue.500"
                  >
                    {activeSender?.metadata?.urls}
                  </Link>
                </Box>
              )}
              <Text fontWeight="bold">
                {t("chats.botName")}: {selectedBot?.name}
              </Text>
              <Text fontWeight="bold">
                {t("chats.network")}: {selectedBot?.network_key}
              </Text>
            </VStack>
          </DrawerBody>

          <DrawerFooter>
            <Button variant="outline" mr={3} onClick={onDrawerClose}>
              {t("chats.close")}
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      <Box p={{ base: 0, md: 4 }} minH="100vh">
        <HStack
          justifyContent={"space-between"}
          align={"start"}
          gap={{ base: "8px", md: "32px" }}
          flexWrap={{ base: "wrap" }}
        >
          <HStack
            my={{ base: 4, md: 8 }}
            align={"start"}
            gap={{ base: "8px", md: "32px" }}
            flexWrap={{ base: "wrap" }}
          >
            <VStack
              gap={"12px"}
              align={"start"}
              width={{ base: "100%", md: "auto" }}
            >
              {user?.rol_key === "SUPERADMIN" && (
                <>
                  <Text fontSize={"16px"} fontWeight={"500"}>
                    {t("chats.filterByCompany")}
                  </Text>
                  <Select
                    isSearchable={false}
                    onChange={handleCompanyChange}
                    options={optionsCompany}
                    focusBorderColor={bgColor}
                    placeholder={
                      optionsCompany.length > 0
                        ? t("chats.filterByCompany")
                        : t("chats.empty")
                    }
                    value={optionsCompany.find(
                      (option) => option.value === selectedCompany
                    )}
                    chakraStyles={style}
                  />
                </>
              )}
            </VStack>

            <VStack
              gap={"12px"}
              align={"start"}
              width={{ base: "100%", md: "auto" }}
              maxW={{ base: null, md: "300px" }}
            >
              <Text fontSize={"16px"} fontWeight={"500"}>
                {t("chats.filterByBot")}
              </Text>
              {loadingBots && user?.rol_key !== "SUPERADMIN" ? (
                <Spinner size={"md"} color={bgColor} />
              ) : (
                <Select
                  onChange={handleBotChange}
                  options={optionsBots}
                  focusBorderColor={bgColor}
                  placeholder={
                    optionsBots?.length > 0
                      ? t("chats.filterByBot")
                      : t("chats.empty")
                  }
                  isSearchable={false}
                  value={optionsBots?.find(
                    (option) => {
                      return option.value.uuid_unique === selectedBot?.uuid_unique
                    }
                  )}
                  chakraStyles={style}
                />
              )}
            </VStack>
            <VStack
              gap={"12px"}
              align={"start"}
              width={{ base: "100%", md: "auto" }}
              maxW={{ base: null, md: "300px" }}
            >
              <Text fontSize={"16px"} fontWeight={"500"}>
                {t("chats.filterByNetwork")}
              </Text>
              {loadingNetworks && user?.rol_key !== "SUPERADMIN" ? (
                <Spinner size={"md"} color={bgColor} />
              ) : (
                <Select
                  onChange={handleNetworkChange}
                  options={optionsNetworks}
                  focusBorderColor={bgColor}
                  placeholder={
                    optionsNetworks?.length > 0
                      ? t("chats.filterByNetwork")
                      : t("chats.empty")
                  }
                  isSearchable={false}
                  value={optionsNetworks?.find(
                    (option) => {
                      return option.value === selectedNetwork
                    }
                  ) || null}
                  chakraStyles={style}
                />
              )}
            </VStack>
          </HStack>
          {callCenterFeatures.renderSelectDepartment()}
        </HStack>

        <HStack
          spacing={4}
          align="start"
          width={"100%"}
          flexDirection={{ base: "column", md: "row" }}
        >
          {!isMobile && (
            <VStack
              w="25%"
              maxW="xs"
              minW="xs"
              bg={panelBgColor}
              boxShadow="md"
              borderRadius="20px"
              height="600px"
            >
              <VStack spacing={4} w="full" pt={"20px"} px={"20px"}>
                <Heading size="md" textAlign="left" w="full">
                  {t("chats.chatHistory")} ({displayContacts?.length > contactsLimit ? contactsLimit : displayContacts?.length ?? 0})
                </Heading>
                <Select
                  onChange={handleFilterChats}
                  options={optionsChatsFilter.filter(opt => opt.value === 0 || opt.value === 3)}
                  focusBorderColor={bgColor}
                  isSearchable={false}
                  value={optionsChatsFilter?.find(
                    (option) => {
                      return option.value === selectedFilter
                    }
                  )}
                  chakraStyles={styleLightBorder}
                />
                <HStack>
                  <InputGroup position={"relative"} mb={4}>
                    <Input
                      placeholder={t("chats.searchChat")}
                      pl="10"
                      background={backgroundColor}
                      border="1px solid"
                      borderColor={stageColor1}
                      focusBorderColor={bgColor}
                      _placeholder={{ color: "gray.500" }}
                      borderRadius="md"
                      value={search}
                      onChange={(e) => { setSearch(e.target.value); checkThrottleWithFeedback() }}
                    />
                    <InputLeftElement>
                      <SearchIcon
                        position="absolute"
                        top="50%"
                        left="3"
                        transform="translateY(-50%)"
                        color={bgColor}
                      />
                    </InputLeftElement>
                  </InputGroup>
                  <Button position="relative" mb={4} onClick={HandleRefreshOnClick}>
                    <Image src={refresh} width={20} height={20} alt="refresh"></Image>
                  </Button>
                </HStack>
              </VStack>
              <ErrorBoundary FallbackComponent={ErrorFallback} onReset={() => refetchLastContacts()}>
                <ContactsList
                  t={t}
                  contactsRef={ref}
                  contactsLimit={contactsLimit}
                  filteredData={displayContacts}
                  activeChat={activeChat}
                  handleUserClick={handleUserClick}
                  selectedBot={selectedBot}
                />
              </ErrorBoundary>
            </VStack>
          )}

          {isMobile && (
            <HStack w="full">
              <Box w="full" mb={4} display={"flex"} flexDir={"column"} gap={4}>
                <HStack w={"full"}>
                  <Text>{t("chats.chatHistory")} ({displayContacts?.length > contactsLimit ? contactsLimit : displayContacts?.length ?? 0})</Text>
                  <Box ml={"auto"} minW={"150px"}>
                    <Select
                      onChange={handleFilterChats}
                      options={optionsChatsFilter}
                      focusBorderColor={bgColor}
                      isSearchable={false}
                      value={optionsChatsFilter?.find(
                        (option) => {
                          return option.value === selectedFilter
                        }
                      )}
                      chakraStyles={styleLightBorder}
                    />
                  </Box>
                </HStack>
                <HStack w={"full"}>
                  <ErrorBoundary FallbackComponent={ErrorFallback} onReset={() => refetchLastContacts()}>
                    <Select
                      onChange={handleContactChange}
                      options={optionsContacts}
                      placeholder={t("chats.selectContact")}
                      focusBorderColor={bgColor}
                      isSearchable={true}
                      chakraStyles={style}
                      value={
                        selectedContact
                          ? {
                            value: selectedContact?.id,
                            label: (
                              <HStack>
                                {selectedContact?.photo &&
                                  selectedContact?.photo.length > 0 ? (
                                  <MemoAvatar
                                    base64={selectedContact?.photo}
                                    mimeType="image/jpeg"
                                    radius={25}
                                  />
                                ) : (
                                  <Avatar width={6} height={6} src="" />
                                )}
                                <Text>{selectedContact?.name ? selectedContact?.name : `( +${selectedContact?.phone} )`}</Text>
                              </HStack>
                            ),
                          }
                          : null
                      }
                    />
                  </ErrorBoundary>
                  <Button onClick={HandleRefreshOnClick}>
                    <Image src={refresh} width={20} height={20} alt="refresh"></Image>
                  </Button>
                </HStack>
              </Box>
            </HStack>
          )}

          <VStack
            w="full"
            p={"20px 30px"}
            bgColor={panelBgColor}
            boxShadow="md"
            borderRadius="20px"
            height="600px"
            gap={"30px"}
          >
            <HStack
              w="full"
              position="relative"
              minH={"40px"}
              justify={"center"}
            >
              <Heading
                textAlign="left"
                w="full"
                color={textColor}
                alignItems={"center"}
                fontSize={"18px"}
                display={"flex"}
                fontWeight={"bold"}
                zIndex={0}
              >
                <HStack w={"full"} fontSize={isMobile ? "11px" : null}>
                  {activeChat ? (
                    <>
                      {t("chats.chatWithUser")} &nbsp;
                      <Text color={bgColor} onClick={onDrawerOpen} cursor="pointer" >
                        #
                        {activeSender?.name ? activeSender?.name : `( +${activeSender?.phone} )`}
                      </Text>

                      {isAdmin && assignedUserLoading && selectedUserCompany && !isBlocked ? (
                        <Box ml={"auto"} w={"170px"}>
                          <Box m={"auto"} w={"fit-content"}>
                            <Spinner color={bgColor}></Spinner>
                          </Box>
                        </Box>
                      ) : (
                        <>
                          {!isBlocked && isAdmin && selectedUserCompany && assignedUser?.bots[0]?.contacts?.items[0]?.assigned_user != null || isChatSocket ? (
                            <Box ml={"auto"}>
                              {!isChatSocket && (assignedUser?.bots[0]?.contacts?.items[0]?.assigned_user?.first_name != user?.first_name || assignedUser?.bots[0]?.contacts?.items[0]?.assigned_user?.last_name != user?.last_name) ? (
                                <Box ml={"auto"} borderRadius={"20px"} bg={backgroundColor} py={"10px"} px={"20px"}>
                                  <Text fontSize={isMobile ? "13px" : null}>
                                    {t("chats.takenBy")}
                                    <Text as="span" color={bgColor}>
                                      {`${assignedUser?.bots[0]?.contacts?.items[0]?.assigned_user?.first_name} ${assignedUser?.bots[0]?.contacts?.items[0]?.assigned_user?.last_name}`}
                                    </Text>{t("chats.takenBy2")}
                                  </Text>
                                </Box>
                              ) : !isBlocked && (
                                <Button
                                  fontSize={isMobile ? "12px" : null}
                                  ml={"auto"}
                                  borderRadius={"20px"}
                                  border={`1px solid ${bgColor}`}
                                  bgColor={"transparent"}
                                  onClick={handleTerminateChat}
                                  w={"170px"}
                                  _hover={{
                                    bgColor: bgColor
                                  }}
                                >
                                  {t("chats.terminate")}
                                </Button>
                              )}
                            </Box>
                          ) : (
                            <>
                              <Box ml={"auto"} display={"flex"} flexDirection={"row"}>
                                {!isBlocked && activeChat && isAdmin && selectedUserCompany && (
                                  <Button
                                    fontSize={isMobile ? "12px" : null}
                                    size={isMobile ? "sm" : null}
                                    borderRadius={"20px"}
                                    mr={"10px"}
                                    border={`1px solid ${bgColor}`}
                                    bgColor={"transparent"}
                                    onClick={handleTakeChat}
                                    maxW={"170px"}
                                    _hover={{
                                      bgColor: bgColor
                                    }}
                                  >
                                    {t("chats.take")}
                                  </Button>
                                )}
                                <Box w={"max-content"} display={"flex"} flexDirection={"row"}>
                                  <CoftechMenu
                                    isMobile={isMobile}
                                    loading={blockUnblockLoading}
                                    items={
                                      isAdmin ?
                                        isBlocked ?
                                          [
                                            {
                                              label: "unblock",
                                              icon: LockUnlocked02,
                                              onClick: handleUnblock
                                            }
                                          ] : [
                                            {
                                              label: "block",
                                              icon: SlashCircle01,
                                              onClick: handleBlock
                                            }
                                          ] : []
                                    }
                                  />
                                </Box>
                              </Box>
                            </>
                          )}
                        </>
                      )}
                    </>
                  ) : (
                    <></>
                  )}
                </HStack>
              </Heading>
              {!isBlocked && callCenterFeatures.renderTransferChat()}
            </HStack>

            <VStack align="end" w="full" overflowY="auto" flex="1" gap={"16px"}>
              <ErrorBoundary FallbackComponent={ErrorFallback} onReset={() => refetchMessages()}>
                <MessagesList
                  t={t}
                  ChatsRef={ChatsRef}
                  scrollRef={scrollRef}
                  userAvatar={userAvatar}
                  botAvatar={botAvatar}
                  messages={messages}
                  messagesError={messagesError}
                  HandleRefreshMessages={HandleRefreshMessages}
                  currentPage={currentPage}
                  totalPages={totalPages}
                  activateLoader={activateLoader}
                  activeSender={activeSender}
                  loading={loading}
                  handleImageClick={handleImageClick}
                />
              </ErrorBoundary>
              <HStack>
              </HStack>
              {!isBlocked && callCenterFeatures.renderWriteMessages()}
            </VStack>
            {isAdmin && isBlocked ? (
              <>
                <Button
                  px={"50px"}
                  borderRadius={"20px"}
                  color={backgroundColor}
                  bgColor={bgColor}
                  border={`1px solid transparent`}
                  ml={"auto"}
                  _hover={{
                    bgColor: hoverColor
                  }}
                  onClick={handleUnblock}
                  isLoading={blockUnblockLoading}
                >
                  {t("chats.unblock")}
                </Button>
              </>
            ) : isChatSocket ? (
              <>
                <ReplyMessage
                  t={t}
                  socket={socket}
                  botID={selectedBot?.uuid_unique}
                  phone={activeSender?.phone}
                />
              </>
            ) : (
              <></>
            )}
          </VStack>
        </HStack>
      </Box >
    </AppShell >
  );
};

export const getStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common"])),
  },
});

export default withTranslation("common")(Chats);


interface FilteredDataItem {
  id: string
  name: string
  photo: string
  phone: string
}

interface ContactsListProps {
  t: Translation
  contactsRef: (node?: Element) => void
  filteredData: FilteredDataItem[]
  contactsLimit: number
  activeChat: string
  handleUserClick: (sender: string, contact: FilteredDataItem) => void
  selectedBot: SelectedBot
}

const ContactsList = ({ t, contactsRef, filteredData, contactsLimit, activeChat, handleUserClick, selectedBot }: ContactsListProps) => {

  const renderLoadingContacts = () => {
    if (filteredData?.length > contactsLimit) {
      return (
        <HStack ref={contactsRef}>
          <Text>{t("chats.loading")}</Text>
        </HStack>
      )
    }
  }

  const {
    bgColor,
    descriptionColor,
    textColor,
  } = useCoftechColors();

  const stageColor2 = useColorModeValue("gray.50", "coftech.background.dark");
  const stageColor3 = useColorModeValue("transparent", "coftech.background.dark");

  return (
    <VStack
      id="contactsScroller"
      css={{
        "&::-webkit-scrollbar": {
          width: "4px",
        },
        "&::-webkit-scrollbar-track": {
          width: "6px",
        },
        "&::-webkit-scrollbar-thumb": {
          background: "rgb(162, 162, 162)",
          borderRadius: "24px",
        },
        "&::-webkit-scrollbar-thumb:hover": {
          background: "rgb(122, 122, 122)"
        }
      }}
      spacing={3}
      align="start"
      py={"20px"}
      px={"20px"}
      mb={"20px"}
      mr={2}
      w="full"
      overflowY="scroll"
      flex="1"
    >
      {filteredData && filteredData.length > 0 ? (
        filteredData.map((item, i) => {
          if (i < contactsLimit) {
            return (
              <HStack
                key={i}
                w="full"
                p={"8px 12px"}
                borderRadius="20px"
                cursor="pointer"
                border="1px solid"
                boxShadow={
                  item.id === activeChat ? `0px 0px 5px 1px ${bgColor}` : "none"
                }
                borderColor={
                  item.id === activeChat ? bgColor : "transparent"
                }
                bg={
                  item.id === activeChat ? stageColor2 : stageColor3
                }
                gap={"12px"}
                onClick={() => handleUserClick(item.id, item)}
              >
                <Box position="relative" minW={"48px"}>
                  {item?.photo && item?.photo.length > 0 ? (
                    <MemoAvatar
                      base64={item.photo}
                      mimeType="image/jpeg"
                      radius={48}
                    />
                  ) : (
                    <Avatar size={"md"} src="" />
                  )}
                  <Box
                    position="absolute"
                    bottom="0"
                    right="0"
                    bg="white"
                    borderRadius="full"
                    p={0.5}
                  >
                    {selectedBot?.network_key === "WHATSAPP" && (
                      <FaWhatsapp color="green" size="12px" />
                    )}
                  </Box>
                </Box>
                <Box>
                  <Text
                    fontWeight="bold"
                    color={
                      item.id === activeChat
                        ? textColor
                        : descriptionColor
                    }
                  >
                    {item.name ? item.name : `( +${item.phone} )`}
                  </Text>
                  <Text
                    fontSize="12px"
                    fontWeight={"300"}
                    color={
                      item.id === activeChat ? textColor : descriptionColor
                    }
                  >
                    {"+" + item.phone}
                  </Text>
                </Box>
              </HStack>
            )
          }
        })
      ) : (
        <Text
          align={"center"}
          w={"full"}
          fontWeight={"700"}
          fontSize={"20px"}
          color={"gray"}
        >
          {t("chats.empty")}
        </Text>
      )}
      {renderLoadingContacts()}
    </VStack>
  )
}

interface MessagesListProps {
  t: Translation
  ChatsRef: (node?: Element) => void
  scrollRef: React.MutableRefObject<HTMLDivElement>
  userAvatar: string
  botAvatar: string
  messages: Message[]
  messagesError: ApolloError
  HandleRefreshMessages: () => void
  currentPage: number
  totalPages: number
  activateLoader: boolean
  activeSender: ActiveSender
  loading: boolean
  handleImageClick: (imageUrl: string) => void
}

const MessagesList = ({ t, ChatsRef, scrollRef, userAvatar, botAvatar, messages, messagesError, HandleRefreshMessages, currentPage, totalPages, activateLoader, activeSender, loading, handleImageClick }: MessagesListProps) => {

  const {
    bgColor,
    backgroundColor,
  } = useCoftechColors();

  const stageOwnChatColor = useColorModeValue("coftech.status.successBg", "coftech.backgroundSoft.dark");

  const formatSmartDate = (dateString) => {
    const inputDate = new Date(Number(dateString));
    const now = new Date();

    const stripTime = (date: Date) =>
      new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const today = stripTime(now);
    const input = stripTime(inputDate);

    const diffTime = today.getTime() - input.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return t("chats.today");
    } else if (diffDays === 1) {
      return t("chats.yesterday");
    } else if (diffDays < 7) {
      const weekdays = [t("chats.sunday"), t("chats.monday"), t("chats.tuesday"), t("chats.wednesday"), t("chats.thursday"), t("chats.friday"), t("chats.saturday")];
      return weekdays[inputDate.getDay()];
    } else {
      const day = String(inputDate.getDate()).padStart(2, "0");
      const month = String(inputDate.getMonth() + 1).padStart(2, "0");
      const year = String(inputDate.getFullYear());
      return `${day}/${month}/${year}`;
    }
  };


  return (
    <VStack
      css={{
        "&::-webkit-scrollbar": {
          width: "4px",
        },
        "&::-webkit-scrollbar-track": {
          width: "6px",
        },
        "&::-webkit-scrollbar-thumb": {
          background: "rgb(162, 162, 162)",
          borderRadius: "24px",
        },
        "&::-webkit-scrollbar-thumb:hover": {
          background: "rgb(122, 122, 122)"
        }
      }}
      spacing={3}
      ref={scrollRef}
      align="start"
      w="full"
      overflowY="scroll"
      flex="1"
      pr={{ base: 2, md: 8 }}
      gap={"16px"}
    >
      {((currentPage < totalPages) && activateLoader && activeSender) && (
        <HStack w={"full"} ref={ChatsRef}>
          <Box m={"auto"}>
            <Spinner color={bgColor} borderWidth={"thick"}></Spinner>
          </Box>
        </HStack>
      )}
      {loading ? (
        <VStack width={"100%"} align={"center"}>
          <Spinner size="md" color={bgColor} />
        </VStack>
      ) : messages.length > 0 ? (
        <VStack w={"full"}>
          {messages?.slice().reverse()
            .map((msg, i) => {

              return (
                <Box key={i} w={"full"}>
                  {formatSmartDate(msg?.created_at) != formatSmartDate(messages.slice().reverse()[i - 1]?.created_at) && (
                    <Box
                      px={2}
                      py={1}
                      borderRadius={"5px"}
                      bg={bgColor}
                      color={"white"}
                      w={"min-content"}
                      wordBreak={"keep-all"}
                      m={"auto"}
                      mb={"10px"}
                    >
                      <Text fontSize={"12px"}>{formatSmartDate(msg.created_at)}</Text>
                    </Box>
                  )}
                  <HStack
                    key={i}
                    align={msg?.via === "send" ? "end" : "start"}
                    w="full"
                    alignItems={"flex-start"}
                    justifyContent={msg?.via === "send" ? "end" : "start"}
                  >
                    <Box
                      p={3}
                      m={
                        msg?.via === "receive" ? "0 10px 0 0" : "0 0 0 10px"
                      }
                      minW="150px"
                      bg={
                        msg?.via === "send"
                          ? stageOwnChatColor
                          : backgroundColor
                      }
                      alignSelf={
                        msg?.via === "send" ? "flex-end" : "flex-start"
                      }
                      borderRadius={
                        msg?.via === "send"
                          ? "10px 0px 10px 10px"
                          : "0px 10px 10px 10px"
                      }
                    >
                      <MessageContent
                        msg={msg}
                        handleImageClick={handleImageClick}
                        userAvatar={userAvatar}
                        botAvatar={botAvatar}
                      />
                    </Box>
                  </HStack>
                </Box>
              )
            })}
        </VStack>
      ) : messagesError ? (
        <Box
          w={"full"}
          display={"flex"}
          flexDirection={"column"}
          gap={"15px"}
        >
          <Icon as={WarningIcon} w={"100%"} h={10} color={"red.500"} textAlign={"center"} />
          <Text
            align={"center"}
            w={"full"}
            fontWeight={"700"}
            fontSize={"20px"}
          >
            {t("chats.messagesError")}
          </Text>
          <Box mx={"auto"} w={"fit-content"}>
            <Button
              bgColor={"red.300"}
              color={backgroundColor}
              _hover={{
                bgColor: "red.500"
              }}
              onClick={HandleRefreshMessages} size="sm">
              {t("errors.retry")}
            </Button>
          </Box>
        </Box>
      ) : (
        <Text
          align={"center"}
          w={"full"}
          fontWeight={"700"}
          fontSize={"20px"}
          color={"gray"}
        >
          {t("chats.empty")}
        </Text>
      )
      }
    </VStack >
  )
}
