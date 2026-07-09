import { User } from "@component/store/auth";

export const isTemporaryAccessEnabled =
  process.env.NEXT_PUBLIC_TEMPORARY_ACCESS === "true";

export const temporaryAccessToken = "temporary-backend-offline-token";

export const temporaryAccessUser: User = {
  uuid_unique: "temporary-user",
  username: "guest",
  email: "guest@coftech.local",
  registered_at: "",
  first_name: "Guest",
  last_name: "User",
  phone: "",
  whatsapp: "",
  status: true,
  company_id: "temporary-company",
  company_name: "Coftech",
  language: "en",
  created_at: "",
  updated_at: "",
  rol_id: "temporary-role",
  rol_key: "SUPERADMIN",
  rol_name: "Super Admin",
};
