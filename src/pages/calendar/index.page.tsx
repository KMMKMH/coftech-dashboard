/* eslint-disable react-hooks/exhaustive-deps */
import { Inter } from "next/font/google";
import {
  Avatar,
  Box,
  Button,
  Container,
  Divider,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  HStack,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  Stack,
  Text,
  Textarea,
  useColorModeValue,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { AppShell } from '@component/components/layout'
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { withTranslation } from "react-i18next";
import { useAuthStore } from "@component/store/auth";
import useCoftechColors from "@component/hooks/useCoftechColors";
import {
  CalendarDate,
  ChevronDown,
  ChevronLeftDouble,
  ChevronRightDouble,
  Copy04,
  Edit05,
  List,
  Share07,
  Trash04,
} from "@untitled-ui/icons-react";
import { SearchIcon } from "@chakra-ui/icons";
import {
  Calendar,
  Views,
  ToolbarProps,
  momentLocalizer,
} from "react-big-calendar";

import { Select } from "chakra-react-select";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@component/store";
import { accountsGet } from "@component/store/usersSlice";
import moment from "moment";
import ScheduleCalendar from "./schedule";
import { useError } from "@component/utils/errorContext";

const inter = Inter({ subsets: ["latin"] });

const CalendarToolbar = (toolbar: ToolbarProps) => {
  const goToBack = () => {
    toolbar.onNavigate("PREV");
  };

  const goToNext = () => {
    toolbar.onNavigate("NEXT");
  };

  const goToToday = () => {
    toolbar.onNavigate("TODAY");
  };

  const goToWeekView = () => {
    toolbar.onView("week");
  };

  const goToDayView = () => {
    toolbar.onView("day");
  };

  const startOfWeek = moment(toolbar.date).startOf("week");
  const endOfWeek = moment(toolbar.date).endOf("week");

  return (
    <div className="rbc-toolbar">
      <div className="rbc-btn-group">
        <button
          type="button"
          onClick={goToBack}
          style={{
            padding: "10px",
          }}
        >
          <ChevronLeftDouble />
        </button>
        <button
          type="button"
          style={{
            padding: "10px 20px",
          }}
          onClick={goToToday}
        >
          Today
        </button>
        <button
          type="button"
          onClick={goToNext}
          style={{
            padding: "10px",
          }}
        >
          <ChevronRightDouble />
        </button>
      </div>
      <span className="rbc-toolbar-label">
        <span
          style={{
            fontSize: "20px",
          }}
        >
          {moment(toolbar.date).format("MMMM, YYYY")}
        </span>{" "}
        ({startOfWeek.format("D")} - {endOfWeek.format("D")})
      </span>
      <div className="rbc-btn-group">
        <button
          type="button"
          onClick={goToWeekView}
          style={{
            padding: "10px 20px",
          }}
        >
          Week
        </button>
        <button
          type="button"
          onClick={goToDayView}
          style={{
            padding: "10px 20px",
          }}
        >
          Day
        </button>
      </div>
    </div>
  );
};

const CalendarPage = ({ t }) => {
  const dispatch: AppDispatch = useDispatch();
  const { user } = useAuthStore();
  const { showError } = useError();
  const {
    bgColor,
    hoverColor,
    panelBgColor,
    backgroundColor,
    descriptionColor,
    borderColor,
    textColor,
  } = useCoftechColors();
  const [loadingFilter, setLoadingFilter] = useState(false);
  const { accounts, loading, error: usersError } = useSelector((state: any) => state.users);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const now = new Date();
  const localizer = momentLocalizer(moment);
  const [viewMode, setViewMode] = useState("calendar");
  const [eventTitle, setEventTitle] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState<{
    start: Date;
    end: Date;
  } | null>(null);

  useEffect(() => {
    if (usersError.message.length > 1) {
      showError(usersError.message)
    }
  }, [usersError])

  const events = [
    {
      id: 1,
      title: "Long Event",
      start: new Date(2024, 3, 7, 10, 30, 0, 0),
      end: new Date(2024, 3, 7, 12, 30, 0, 0),
      desc: "Big conference for important peopleBig conference for important peopleBig conference for important peopleBig conference for important peopleBig conference for important peopleBig conference for important peopleBig conference for important peopleBig conference for important peopleBig conference for important peopleBig conference for important peopleBig conference for important people",
      createdUser: "Juan Peraz",
    },
    {
      id: 2,
      title: "DTS STARTS",
      start: new Date(2024, 11, 20, 10, 30, 0, 0),
      end: new Date(2024, 11, 20, 12, 30, 0, 0),
      createdUser: "Juan Peraz",
    },

    {
      id: 3,
      title: "DTS ENDS",
      start: new Date(2024, 11, 6, 0, 0, 0),
      end: new Date(2024, 11, 13, 0, 0, 0),
      createdUser: "Juan Peraz",
    },

    {
      id: 4,
      title: "Some Event",
      start: new Date(2024, 3, 9, 0, 0, 0),
      end: new Date(2024, 3, 9, 0, 0, 0),
      allDay: true,
      createdUser: "Juan Peraz",
    },

    {
      id: 92,
      title: "Some Other Event",
      start: new Date(2024, 3, 9, 8, 0, 0),
      end: new Date(2024, 3, 10, 11, 30, 0),
      createdUser: "Juan Peraz",
    },
    {
      id: 5,
      title: "Conference",
      start: new Date(2024, 3, 11),
      end: new Date(2024, 3, 13),
      desc: "Big conference for important people",
      createdUser: "Juan Peraz",
    },
    {
      id: 6,
      title: "Meeting",
      start: new Date(2024, 3, 12, 10, 30, 0, 0),
      end: new Date(2024, 3, 12, 12, 30, 0, 0),
      desc: "Pre-meeting meeting, to prepare for the meeting",
      createdUser: "Juan Peraz",
    },
    {
      id: 7,
      title: "Lunch",
      start: new Date(2024, 10, 12, 12, 0, 0, 0),
      end: new Date(2024, 10, 12, 13, 0, 0, 0),
      desc: "Power lunch",
      createdUser: "Juan Peraz",
    },
    {
      id: 8,
      title: "Meeting",
      start: new Date(2024, 10, 12, 14, 0, 0, 0),
      end: new Date(2024, 10, 12, 15, 0, 0, 0),
      createdUser: "Juan Peraz",
    },
    {
      id: 9,
      title: "Happy Hour",
      start: new Date(2024, 10, 12, 17, 0, 0, 0),
      end: new Date(2024, 10, 12, 17, 30, 0, 0),
      desc: "Most important meal of the day",
      createdUser: "Juan Peraz",
    },
    {
      id: 10,
      title: "Dinner",
      start: new Date(2024, 10, 12, 20, 0, 0, 0),
      end: new Date(2024, 10, 12, 21, 0, 0, 0),
      createdUser: "Juan Peraz",
    },
    {
      id: 11,
      title: "Planning Meeting with Paige",
      start: new Date(2024, 10, 13, 8, 0, 0),
      end: new Date(2024, 10, 13, 10, 30, 0),
      createdUser: "Juan Peraz",
    },
    {
      id: 11.1,
      title: "Inconvenient Conference Call",
      start: new Date(2024, 10, 13, 9, 30, 0),
      end: new Date(2024, 10, 13, 12, 0, 0),
      createdUser: "Juan Peraz",
    },
    {
      id: 11.2,
      title: "Project Kickoff - Lou's Shoes",
      start: new Date(2024, 10, 13, 11, 30, 0),
      end: new Date(2024, 10, 13, 14, 0, 0),
      createdUser: "Juan Peraz",
    },
    {
      id: 11.3,
      title: "Quote Follow-up - Tea by Tina",
      start: new Date(2024, 10, 13, 15, 30, 0),
      end: new Date(2024, 10, 13, 16, 0, 0),
      createdUser: "Juan Peraz",
    },
    {
      id: 12,
      title: "Late Night Event",
      start: new Date(2024, 10, 17, 19, 30, 0),
      end: new Date(2024, 10, 18, 2, 0, 0),
      createdUser: "Juan Peraz",
    },
    {
      id: 12.5,
      title: "Late Same Night Event",
      start: new Date(2024, 10, 17, 19, 30, 0),
      end: new Date(2024, 10, 17, 23, 30, 0),
      createdUser: "Juan Peraz",
    },
    {
      id: 13,
      title: "Multi-day Event",
      start: new Date(2024, 10, 20, 19, 30, 0),
      end: new Date(2024, 10, 22, 2, 0, 0),
      createdUser: "Juan Peraz",
    },
    {
      id: 14,
      title: "Today",
      start: new Date(new Date().setHours(new Date().getHours() - 3)),
      end: new Date(new Date().setHours(new Date().getHours() + 3)),
      createdUser: "Juan Peraz",
    },
    {
      id: 15,
      title: "Point in Time Event",
      start: now,
      end: now,
      createdUser: "Juan Peraz",
    },
    {
      id: 16,
      title: "Video Record",
      start: new Date(2024, 3, 14, 15, 30, 0),
      end: new Date(2024, 3, 14, 19, 0, 0),
      createdUser: "Juan Peraz",
    },
    {
      id: 17,
      title: "Dutch Song Producing",
      start: new Date(2024, 3, 14, 16, 30, 0),
      end: new Date(2024, 3, 14, 20, 0, 0),
      createdUser: "Juan Peraz",
    },
    {
      id: 18,
      title: "Itaewon Meeting",
      start: new Date(2024, 3, 14, 16, 30, 0),
      end: new Date(2024, 3, 14, 17, 30, 0),
      createdUser: "Juan Peraz",
    },
    {
      id: 19,
      title: "Online Coding Test",
      start: new Date(2024, 3, 14, 17, 30, 0),
      end: new Date(2024, 3, 14, 20, 30, 0),
      createdUser: "Juan Peraz",
    },
    {
      id: 20,
      title: "An overlapped Event",
      start: new Date(2024, 3, 14, 17, 0, 0),
      end: new Date(2024, 3, 14, 18, 30, 0),
      createdUser: "Juan Peraz",
    },
    {
      id: 21,
      title: "Phone Interview",
      start: new Date(2024, 3, 14, 17, 0, 0),
      end: new Date(2024, 3, 14, 18, 30, 0),
      createdUser: "Juan Peraz",
    },
    {
      id: 22,
      title: "Cooking Class",
      start: new Date(2024, 3, 14, 17, 30, 0),
      end: new Date(2024, 3, 14, 19, 0, 0),
      createdUser: "Juan Peraz",
    },
    {
      id: 23,
      title: "Go to the gym",
      start: new Date(2024, 3, 14, 18, 30, 0),
      end: new Date(2024, 3, 14, 20, 0, 0),
      createdUser: "Juan Peraz",
    },
    {
      id: 24,
      title: "DST ends on this day (Europe)",
      start: new Date(2022, 9, 30, 0, 0, 0),
      end: new Date(2022, 9, 30, 4, 30, 0),
      createdUser: "Juan Peraz",
    },
    {
      id: 25,
      title: "DST ends on this day (America)",
      start: new Date(2022, 10, 6, 0, 0, 0),
      end: new Date(2022, 10, 6, 4, 30, 0),
      createdUser: "Juan Peraz",
    },
    {
      id: 26,
      title: "DST starts on this day (America)",
      start: new Date(2023, 2, 12, 0, 0, 0),
      end: new Date(2023, 2, 12, 4, 30, 0),
      createdUser: "Juan Peraz",
    },
    {
      id: 27,
      title: "DST starts on this day (Europe)",
      start: new Date(2023, 2, 26, 0, 0, 0),
      end: new Date(2023, 2, 26, 4, 30, 0),
      createdUser: "Juan Peraz",
    },
  ];

  const [myEvents, setEvents] = useState(events);

  const handleSelectSlot = useCallback(
    ({ start, end }) => {
      onOpen();
      setEventTitle("");
      setSelectedSlot({ start, end });
    },
    [onOpen]
  );

  const handleEditEvent = (event) => {
    setSelectedEvent(event);
    setEventTitle(event.title);
    setEventDescription(event.desc || "");
    setSelectedSlot({ start: event.start, end: event.end });
    onOpen();
    setIsDrawerOpen(true);
  };

  const formatEventDate = (date: Date) => {
    return moment(date).format("MMMM, DD YYYY HH:mm:ss [GMT]Z");
  };

  const onCloseDrawer = () => {
    onClose();
    setIsDrawerOpen(false);
  };

  const handleOverlayClick = (event) => {
    event.stopPropagation();
  };

  const handleCreateEvent = () => {
    if (eventTitle && selectedSlot) {
      const id = myEvents.length + 1;
      const newEvent = {
        id,
        start: selectedSlot.start,
        end: selectedSlot.end,
        title: eventTitle,
        desc: eventDescription,
      };
      setEvents((prev: any) => [...prev, newEvent]);
      onClose();
      setSelectedSlot(null);
      setEventTitle("");
      setEventDescription("");
    }
  };

  const handleCreateOrUpdateEvent = () => {
    if (eventTitle && selectedSlot) {
      if (selectedEvent) {
        setEvents((prevEvents: any) =>
          prevEvents.map((event) =>
            event.id === selectedEvent.id
              ? { ...event, title: eventTitle, desc: eventDescription }
              : event
          )
        );
      } else {
        const id = myEvents.length + 1;
        const newEvent = {
          id,
          start: selectedSlot.start,
          end: selectedSlot.end,
          title: eventTitle,
          desc: eventDescription,
        };
        setEvents((prev: any) => [...prev, newEvent]);
      }
      onClose();
      setSelectedSlot(null);
      setEventTitle("");
      setEventDescription("");
      setSelectedEvent(null);
    }
  };

  const handleSelectEvent = useCallback(
    (event) => {
      setSelectedEvent(event);
      setEventTitle(event.title);
      setEventDescription(event.desc || "");
      setSelectedSlot({ start: event.start, end: event.end });
      onOpen();
      setIsDrawerOpen(true);
    },
    [onOpen]
  );

  const handleDeleteEvent = (eventId) => {
    setEvents((prevEvents) =>
      prevEvents.filter((event) => event.id !== selectedEvent?.id)
    );
    setEvents((prevEvents) =>
      prevEvents.filter((event) => event.id !== eventId)
    );
    onClose();
    setSelectedEvent(null);
    setEventDescription("");
  };

  const handleViewChange = (mode) => {
    setViewMode(mode);
  };

  const { defaultDate, scrollToTime } = useMemo(
    () => ({
      defaultDate: new Date(),
      scrollToTime: new Date(1970, 1, 1, 6),
    }),
    []
  );

  useEffect(() => {
    if (user?.company_id) {
      const fetchAccounts = async () => {
        setLoadingFilter(true);
        await dispatch(accountsGet(user.company_id));
        setLoadingFilter(false);
      };
      fetchAccounts();
    }
  }, [dispatch, user?.company_id, user?.rol_key]);

  const optionsAccounts = (accounts || []).map((account) => {
    return {
      value: account.uuid_unique,
      label: (
        <HStack>
          <Text>{account.username}</Text>
        </HStack>
      ),
    };
  });

  const optionsState = () => {
    return [
      {
        value: "todo",
        label: (
          <HStack>
            <Text>{t("calendar.state.todo")}</Text>
          </HStack>
        ),
      },
      {
        value: "accept",
        label: (
          <HStack>
            <Text>{t("calendar.state.accept")}</Text>
          </HStack>
        ),
      },
      {
        value: "close",
        label: (
          <HStack>
            <Text>{t("calendar.state.close")}</Text>
          </HStack>
        ),
      },
    ];
  };

  return (
    <>
      <AppShell title={t("calendar.title")}>
        <Container
          minHeight="100vh"
          maxW="full"
          h={"full"}
          bg={backgroundColor}
        >
          <HStack justify={"space-between"}>
            <HStack>
              <Stack
                p={2}
                background={panelBgColor}
                color={viewMode === "calendar" ? bgColor : descriptionColor}
                borderRadius={"8px"}
                cursor={"pointer"}
                _hover={{
                  background: bgColor,
                  color: "white",
                }}
                onClick={() => handleViewChange("calendar")}
                boxShadow="0px 2px 4px -2px #0F172A0F, 0px 4px 8px -2px #0F172A1A"
              >
                <Icon as={CalendarDate} w={"24px"} h={"24px"}></Icon>
              </Stack>
              <Stack
                p={2}
                background={panelBgColor}
                color={viewMode === "list" ? bgColor : descriptionColor}
                borderRadius={"8px"}
                cursor={"pointer"}
                _hover={{
                  background: bgColor,
                  color: "white",
                }}
                onClick={() => handleViewChange("list")}
                boxShadow="0px 2px 4px -2px #0F172A0F, 0px 4px 8px -2px #0F172A1A"
              >
                <Icon as={List} w={"24px"} h={"24px"}></Icon>
              </Stack>
            </HStack>
            <HStack gap={4}>
              <InputGroup
                sx={{
                  background: panelBgColor,
                  borderRadius: "20px",
                  width: { base: "100%", md: "300px" },
                }}
                boxShadow="0px 2px 4px -2px #0F172A0F, 0px 4px 8px -2px #0F172A1A"
              >
                <InputLeftElement pointerEvents="none">
                  <SearchIcon color={bgColor} />
                </InputLeftElement>
                <Input
                  focusBorderColor={bgColor}
                  border={"0.5px"}
                  placeholder={t("calendar.search")}
                />
              </InputGroup>
              <Button
                rightIcon={<ChevronDown />}
                variant="solid"
                bg={bgColor}
                _hover={{ bg: hoverColor }}
                color="white"
                borderRadius={8}
              >
                {t("calendar.new")}
              </Button>
              <Stack
                p={2}
                background={panelBgColor}
                color={bgColor}
                borderRadius={"8px"}
                cursor={"pointer"}
                _hover={{
                  background: bgColor,
                  color: "white",
                }}
                boxShadow="0px 2px 4px -2px #0F172A0F, 0px 4px 8px -2px #0F172A1A"
                onClick={onOpen}
              >
                <Icon as={ChevronLeftDouble} w={"24px"} h={"24px"}></Icon>
              </Stack>
            </HStack>
          </HStack>
          <VStack w={"full"} py={8}>
            {viewMode === "calendar" ? (
              <Calendar
                defaultDate={defaultDate}
                defaultView={Views.WEEK}
                events={myEvents}
                localizer={localizer}
                onSelectEvent={handleSelectEvent}
                onSelectSlot={handleSelectSlot}
                selectable
                scrollToTime={scrollToTime}
                components={{
                  toolbar: CalendarToolbar,
                }}
              />
            ) : (
              <ScheduleCalendar
                events={myEvents}
                handleEdit={handleEditEvent}
                handleDelete={handleDeleteEvent}
              />
            )}
          </VStack>
        </Container>
      </AppShell>
      <Drawer placement="right" onClose={onCloseDrawer} isOpen={isOpen}>
        <DrawerOverlay
          onClick={handleOverlayClick}
          style={{
            backdropFilter: "blur(10px)",
          }}
        />
        <DrawerContent bg={panelBgColor} maxW={"400px"}>
          <DrawerHeader>
            <HStack
              justify={
                isDrawerOpen && selectedEvent ? "space-between" : "flex-start"
              }
              gap={"16px"}
            >
              <Stack
                p={2}
                background={backgroundColor}
                color={bgColor}
                borderRadius={"8px"}
                cursor={"pointer"}
                _hover={{
                  background: bgColor,
                  color: "white",
                }}
                onClick={onCloseDrawer}
                boxShadow="0px 2px 4px -2px #0F172A0F, 0px 4px 8px -2px #0F172A1A"
              >
                <Icon as={ChevronRightDouble} w={"24px"} h={"24px"}></Icon>
              </Stack>
              <Text>{t("calendar.calendarInfo")}</Text>
              {isDrawerOpen && selectedEvent && (
                <Button padding={"8px"} onClick={handleDeleteEvent}>
                  <Icon
                    as={Trash04}
                    w={"20px"}
                    h={"20px"}
                    color={bgColor}
                  ></Icon>
                </Button>
              )}
            </HStack>
          </DrawerHeader>
          <DrawerBody>
            <VStack gap={"24px"}>
              <VStack
                position={"relative"}
                padding={"24px"}
                w={"full"}
                borderRadius={"8px"}
                borderColor={backgroundColor}
                borderWidth={1}
                style={{
                  contentVisibility: "auto",
                }}
              >
                <Icon as={Share07} w={"24px"} h={"24px"} color={bgColor} />
                <Text fontSize={"18px"} fontWeight={"bold"}>
                  {t("calendar.share")}
                </Text>
                <HStack justify={"space-between"} w={"full"}>
                  <Text fontSize={"14px"} textDecoration={"underline"}>
                    botcopylinkjohnsmith...
                  </Text>
                  <Stack
                    p={2}
                    background={panelBgColor}
                    color={bgColor}
                    borderRadius={"8px"}
                    cursor={"pointer"}
                    _hover={{
                      background: bgColor,
                      color: "white",
                    }}
                    onClick={onOpen}
                  >
                    <Icon as={Copy04} w={"24px"} h={"24px"}></Icon>
                  </Stack>
                </HStack>
                <Box position={"absolute"} zIndex={-1} left={0} top={0}>
                  <svg
                    width="204"
                    height="176"
                    viewBox="0 0 204 176"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g filter="url(#filter0_f_2943_18229)">
                      <circle
                        cx="-72.5"
                        cy="-52.5"
                        r="176.5"
                        fill={useColorModeValue("#0F73C9", "#5BB6FF")}
                      />
                    </g>
                    <defs>
                      <filter
                        id="filter0_f_2943_18229"
                        x="-349"
                        y="-329"
                        width="553"
                        height="553"
                        filterUnits="userSpaceOnUse"
                        colorInterpolationFilters="sRGB"
                      >
                        <feFlood floodOpacity="0" result="BackgroundImageFix" />
                        <feBlend
                          mode="normal"
                          in="SourceGraphic"
                          in2="BackgroundImageFix"
                          result="shape"
                        />
                        <feGaussianBlur
                          stdDeviation="50"
                          result="effect1_foregroundBlur_2943_18229"
                        />
                      </filter>
                    </defs>
                  </svg>
                </Box>
                <Box position={"absolute"} zIndex={-1} right={0} bottom={0}>
                  <svg
                    width="262"
                    height="176"
                    viewBox="0 0 262 176"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g filter="url(#filter0_f_3230_16609)">
                      <circle
                        cx="276.5"
                        cy="222.5"
                        r="176.5"
                        fill={useColorModeValue("#0F73C9", "#5BB6FF")}
                      />
                    </g>
                    <defs>
                      <filter
                        id="filter0_f_3230_16609"
                        x="0"
                        y="-54"
                        width="553"
                        height="553"
                        filterUnits="userSpaceOnUse"
                        colorInterpolationFilters="sRGB"
                      >
                        <feFlood floodOpacity="0" result="BackgroundImageFix" />
                        <feBlend
                          mode="normal"
                          in="SourceGraphic"
                          in2="BackgroundImageFix"
                          result="shape"
                        />
                        <feGaussianBlur
                          stdDeviation="50"
                          result="effect1_foregroundBlur_3230_16609"
                        />
                      </filter>
                    </defs>
                  </svg>
                </Box>
              </VStack>
              <VStack w={"full"} align={"start"}>
                <Text>{t("calendar.eventTitle")}</Text>
                <Input
                  placeholder={t("calendar.eventPlaceholder")}
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  background={backgroundColor}
                  border="none"
                  focusBorderColor={bgColor}
                  _placeholder={{ color: "gray.500" }}
                  borderRadius="md"
                  boxShadow="0px 2px 4px -2px #0F172A0F, 0px 4px 8px -2px #0F172A1A"
                />
              </VStack>
              <VStack w={"full"} align={"start"}>
                <Text>{t("calendar.eventDescription")}</Text>
                <Textarea
                  name="description"
                  placeholder={t("calendar.eventDescriptionPlaceholder")}
                  value={eventDescription}
                  onChange={(e) => setEventDescription(e.target.value)}
                  variant="filled"
                  height="180px"
                  boxShadow={`0px 2px 4px -2px #0F172A0F;
                        box-shadow: 0px 4px 8px -2px #0F172A1A;
                        `}
                  border={backgroundColor}
                  borderWidth={"1px"}
                  borderRadius="md"
                  backgroundColor={backgroundColor}
                  _placeholder={{ color: "gray.500" }}
                  _hover={{
                    bg: backgroundColor,
                  }}
                  _focus={{
                    bgColor: backgroundColor,
                    borderWidth: "1px",
                    borderStyle: "solid",
                    borderColor: bgColor,
                  }}
                ></Textarea>
              </VStack>
              <VStack w={"full"} align={"start"}>
                <Text>{t("calendar.clients")}</Text>
                <Select
                  isSearchable={false}
                  options={optionsAccounts}
                  placeholder={t("calendar.clientPlaceholder")}
                  chakraStyles={{
                    container: (provided) => ({
                      ...provided,
                      borderRadius: 20,
                      background: panelBgColor,
                      cursor: "pointer",
                      width: "100%",
                      boxShadow:
                        "0px 2px 4px -2px #0F172A0F, 0px 4px 8px -2px #0F172A1A",
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
                      _focus: {
                        borderColor: bgColor,
                      },
                      _focusVisible: {
                        boxShadow: `0 0 0 1px ${bgColor}`,
                      },
                    }),
                    inputContainer: (provided) => ({
                      ...provided,
                      width: "150px",
                    }),
                    menuList: (provided) => ({
                      ...provided,
                      width: "max-content",
                    }),
                  }}
                />
              </VStack>
              <VStack w={"full"} align={"start"}>
                <Text>{t("calendar.state")}</Text>
                <Select
                  isSearchable={false}
                  options={optionsState()}
                  placeholder={t("calendar.statePlaceholder")}
                  chakraStyles={{
                    container: (provided) => ({
                      ...provided,
                      borderRadius: 20,
                      background: panelBgColor,
                      cursor: "pointer",
                      width: "100%",
                      boxShadow:
                        "0px 2px 4px -2px #0F172A0F, 0px 4px 8px -2px #0F172A1A",
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
                      _focus: {
                        borderColor: bgColor,
                      },
                      _focusVisible: {
                        boxShadow: `0 0 0 1px ${bgColor}`,
                      },
                    }),
                    inputContainer: (provided) => ({
                      ...provided,
                      width: "150px",
                    }),
                    menuList: (provided) => ({
                      ...provided,
                      width: "max-content",
                    }),
                  }}
                />
              </VStack>
            </VStack>
          </DrawerBody>
          <DrawerFooter>
            <Button
              onClick={handleCreateOrUpdateEvent}
              bg={bgColor}
              _hover={{
                bg: hoverColor,
              }}
              color="white"
            >
              {t("calendar.createEvent")}
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export const getStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common"])),
  },
});

export default withTranslation("common")(CalendarPage);
