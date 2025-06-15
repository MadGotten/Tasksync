import { Priority } from "@/types/enums";
import { UseQueryOptions } from "@tanstack/react-query";

export type BaseEntity = {
  id: number;
};

export type UBaseEntity = {
  id: string;
};

export type Entity<T> = T & BaseEntity;

export type UEntity<T> = T & UBaseEntity;

export type Pageable<T> = {
  content: T[];
  page: {
    number: number;
    size: number;
    totalElements: number;
    totalPages: number;
  };
};

export type User = UEntity<{
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}>;

export type Board = Entity<{
  name: string;
  is_public: boolean;
}>;

export type BoardMemberRole = Board & {
  member_role: "ADMIN" | "MEMBER" | "GUEST";
};

export type Task = Entity<{
  name: string;
  description?: string;
  priority: Priority;
  archived?: boolean;
  position: number;
  board_id: number;
  column_id: number;
}>;

export type List = Entity<{
  name: string;
  position: number;
  board_id: number;
}>;

export type Action = Entity<{
  type: string;
  user: User;
  board: {
    id: string;
    name: string;
  };
  task: {
    id: string;
    name: string;
  };
}>;

export type Options<T> = Omit<UseQueryOptions<T>, "queryKey" | "queryFn">;
