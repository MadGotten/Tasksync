import { useGetPermission } from "@/features/boards/api/useGetPermission";
import { Role } from "@/types/enums";
import { isAuthorized } from "@/utils/permissions";
import { memo } from "react";

export const Authorized: React.FC<{
  children: React.ReactNode;
  boardId: string;
  role?: keyof typeof Role;
}> = memo(({ children, boardId, role = "MEMBER" }) => {
  const { data: member_role, isLoading } = useGetPermission({ boardId });

  if (isLoading) {
    return;
  }

  if (member_role && isAuthorized(member_role, Role[role])) {
    return <>{children}</>;
  }

  return;
});
