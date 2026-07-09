interface RoleProtectedRoutes {
  [key: string]: string[];
}
export const roleProtectedRoutes: RoleProtectedRoutes = {
  "/404": [""],
  "/home": ["ALL"],
  "/nps": ["SUPERADMIN"],
  "/company": ["SUPERADMIN", "ADMIN"],
  "/file-manager": ["SUPERADMIN", "ADMIN"],
  "/users": ["SUPERADMIN", "ADMIN"],
  "/integrations": ["SUPERADMIN", "ADMIN"],
  "/integrations/edit": ["SUPERADMIN", "ADMIN"],
  "/campaigns": ["SUPERADMIN"],
  "/bots": ["SUPERADMIN", "ADMIN"],
  "/prompts": ["SUPERADMIN", "ADMIN"],
  "/chats": ["SUPERADMIN", "ADMIN"],
  "/bots/edit": ["SUPERADMIN", "ADMIN"],
  "/calendar": ["SUPERADMIN"],
  "/event-type": ["SUPERADMIN"],
  "/create": ["SUPERADMIN"],
};
