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

export interface Message {
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