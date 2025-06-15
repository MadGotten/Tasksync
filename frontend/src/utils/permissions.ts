import { Role } from "@/types/enums";

type UserRole = "ADMIN" | "MEMBER" | "GUEST";

export const isAuthorized = (userPermissions: UserRole, requiredPermission: Role): boolean => {
  return Role[userPermissions] >= requiredPermission;
};
