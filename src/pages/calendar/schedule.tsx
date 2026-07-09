import React from "react";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import {
  Avatar,
  Divider,
  HStack,
  Icon,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import useCoftechColors from "@component/hooks/useCoftechColors";
import { Edit05, Trash04 } from "@untitled-ui/icons-react";

const localizer = momentLocalizer(moment);

const ScheduleCalendar = ({ events, handleEdit, handleDelete }) => {
  const {
    bgColor,
    hoverColor,
    panelBgColor,
    backgroundColor,
    descriptionColor,
    borderColor,
    textColor,
  } = useCoftechColors();

  const ScheduleEventList = ({ event }) => (
    <HStack
      background={panelBgColor}
      w={"full"}
      justify={"space-between"}
      px={"32px"}
      py={"12px"}
      borderRadius={"12px"}
      boxShadow="0px 2px 4px -2px #0F172A0F, 0px 4px 8px -2px #0F172A1A"
    >
      <HStack gap={4}>
        <VStack alignItems={"flex-start"} w={"150px"}>
          <Text fontSize={"16px"} fontWeight={"600"}>
            {moment(event.end).format("Do M, YYYY")}
          </Text>
          <Text fontSize={"14px"} color={descriptionColor}>
            {moment(event.start).format("h:mm a")} -{" "}
            {moment(event.end).format("h:mm a")}
          </Text>
        </VStack>
        <Divider orientation="vertical" colorScheme={"white"} h={"48px"} />
        <VStack align={"flex-start"} w={"400px"}>
          <Text fontSize={"16px"} fontWeight={"bold"}>
            {event.title}
          </Text>
          <HStack>
            <Text
              fontSize={"14px"}
              color={descriptionColor}
              noOfLines={1}
              overflow="hidden"
              textOverflow="ellipsis"
            >
              {event.desc ? event.desc : "no description"}
            </Text>
          </HStack>
        </VStack>
        <Divider orientation="vertical" colorScheme={"white"} h={"48px"} />
        <VStack align={"flex-start"}>
          <Text fontSize={"12px"} color={descriptionColor}>
            Created by
          </Text>
          <Text fontSize={"16px"}>{event.createdUser}</Text>
        </VStack>
      </HStack>
      <HStack>
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
          onClick={() => handleEdit(event)}
        >
          <Icon as={Edit05} w={"20px"} h={"20px"}></Icon>
        </Stack>
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
          onClick={() => handleDelete(event.id)}
        >
          <Icon as={Trash04} w={"20px"} h={"20px"}></Icon>
        </Stack>
      </HStack>
    </HStack>
  );

  const ScheduleList = ({ events }) => (
    <VStack w={"full"}>
      {events.map((event, index) => (
        <ScheduleEventList key={index} event={event} />
      ))}
    </VStack>
  );

  return <ScheduleList events={events} />;
};

export default ScheduleCalendar;
