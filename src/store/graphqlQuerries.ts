import { gql } from "@apollo/client"


const GetLastContacts = gql`
    query GetLastContacts($botPhone: String!, $limit: Int, $networkID: String!) {
      bots(phone: $botPhone) {
        lastContacts(limit: $limit, networkID: $networkID) {
          id
          name
          phone
          photo
          metadata
        }
      }
    }
  `

const GetBlackList = gql`
    query GetBlackList($companyId: ID!, $botId: ID) {
      blacklist(companyID: $companyId, botID: $botId) {
        id
        phone
      }
    }
  `

const CreateBlacklist = gql`
    mutation CreateBlacklist($botId: ID!, $phone: String!) {
      createBlacklist(botID: $botId, phone: $phone) {
        id
        phone
      }
    }
  `

const DeleteBlacklist = gql`
    mutation DeleteBlacklist($botID: ID!, $phone: String!) {
      deleteBlacklist(botID: $botID, phone: $phone)
    }
  `

const GetMessages = gql`
    query GetMessages($botPhone: String!, $contactPhone: String!, $limit: Int, $page: Int, $networkID: String!) {
      bots(phone: $botPhone) {
        contacts(phone: $contactPhone, networkID: $networkID) {
          items{
            isBlocked,
            messages(limit: $limit, page: $page) {
              currentPage
              totalPages
              items {
                message_id,
                is_revoked,
                is_edited,
                body,
                created_at,
                sender_number,
                to_send,
                via
                type
                caption,
                quoted_message_id,
                metadata {
                  metadata_type
                  ... on ContactJsonType {
                    metadata_type
                    fullName
                    phoneInternational
                    phoneType
                    phoneWaid
                  }
                  ... on EventJsonType {
                    metadata_type
                    name
                    description
                    start
                    end
                    link
                    location
                  }
                  ... on LocationJsonType {
                    metadata_type
                    latitude
                    longitude
                    name
                    url
                    description
                  }
                  ... on MediaJsonType {
                    metadata_type
                    filename
                    filesize
                    mimetype
                  }
                }
              }
            }
          }
        }
      }
    }
  `

const GetAvatars = gql`
    query GetAvatars($botPhone: String!, $contactPhone: String!, $limit: Int, $page: Int, $networkID: String!) {
      bots(phone: $botPhone) {
        contacts(phone: $contactPhone, networkID: $networkID) {
          items{
            messages(limit: $limit, page: $page) {
              items {
                sender_picture,
                to_send_picture,
                via,
                body
              }
            }
          }
        }
      }
    }
  `

const GetAssignedUser = gql`
    query GetAssignedUser($botPhone: String!, $contactPhone: String!, $networkID: String!) {
      bots(phone: $botPhone) {
        contacts(phone: $contactPhone, networkID: $networkID) {
          items{
            assigned_user {
              first_name
              last_name
            }
          }
        }
      }
    }
  `

const GetExtensions = gql`
  query GetExtensionBot($botPhone: String!) {
    bots (phone: $botPhone) {
      extensions {
        id,
        name,
        key,
      }
    }
  }
`

export {
  GetAvatars,
  GetAssignedUser,
  GetMessages,
  GetLastContacts,
  GetExtensions,
  GetBlackList,
  CreateBlacklist,
  DeleteBlacklist
}