import React from "react";
import StickerMessage from "./StickerMessage";
import VideoMessage from "./VideoMessage";
import LocationMessage from "./LocationMessage";
import EventMessage from "./EventMessage";
import AudioMessage from "./AudioMessage";
import ContactMessage from "./ContactMessage";
import ImageMessage from "./ImageMessage";
import DocumentMessage from "./DocumentMessage";
import DefaultMessage from "./DefaultMessage";

interface Metadata {
  filename: string,
  mimetype: string,
  filesize: string,
  latitude: string,
  longitude: string,
  description: string,
  fullName: string,
  phoneInternational: string,
  name: string,
  start: string,
  end: string,
  link: string,
  location: string,
  __typename: string
}

interface Message {
  message_id: string,
  sender_number: string,
  sender_picture: string,
  to_send: string,
  to_send_picture: string,
  created_at: string,
  via: string,
  is_edited: boolean,
  is_revoked: boolean,
  type: string,
  body: string,
  caption: string,
  quoted_message_id: string,
  metadata: Metadata,
}

interface MessageContentProps {
  msg: Message,
  userAvatar: string,
  botAvatar: string,
  handleImageClick: (imageUrl: string) => void
}

const MessageContent = ({ msg, userAvatar, botAvatar, handleImageClick }: MessageContentProps) => {

  switch (msg.type) {
    case "sticker":
      return (
        <StickerMessage
          msg={msg}
        />
      );
    case "image":
      return (
        <ImageMessage
          msg={msg}
          handleImageClick={handleImageClick}
        />
      )
    case "video":
      return (
        <VideoMessage
          msg={msg}
        />
      );
    case "location":
      return (
        <LocationMessage
          msg={msg}
        />
      );
    case "event_message":
      return (
        <EventMessage
          msg={msg}
        />
      );
    case "audio":
      return (
        <AudioMessage
          msg={msg}
          userAvatar={userAvatar}
          botAvatar={botAvatar}
        />
      );
    case "contact":
      return (
        <ContactMessage
          msg={msg}
        />
      )
    case "document":
      return (
        <DocumentMessage
          msg={msg}
        />
      );
    default:
      return (
        <DefaultMessage
          msg={msg}
        />
      );
  }
};

const equality = (prevProps: MessageContentProps, nextProps: MessageContentProps) => prevProps.msg.message_id === nextProps.msg.message_id && prevProps.msg.body === nextProps.msg.body

export default React.memo(MessageContent, equality);
