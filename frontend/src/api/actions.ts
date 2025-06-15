import { keycloak } from "@/api/keycloak";
import { Action, Pageable } from "@/types/api";

const BASE_URL = import.meta.env.VITE_API_URL;

export const ActionApi = {
  getAllActions: async (): Promise<Action[]> => {
    const response = await fetch(`${BASE_URL}/api/v1/actions`, {
      headers: {
        Authorization: `Bearer ${keycloak.token}`,
      },
      credentials: "include",
    });
    return response.json();
  },

  getAllActionsByBoard: async ({
    boardId,
    pageParam,
    size = 10,
  }: {
    boardId: string;
    pageParam: number;
    size?: number;
  }): Promise<Pageable<Action>> => {
    const response = await fetch(
      `${BASE_URL}/api/v1/boards/${boardId}/actions?page=${pageParam}&size=${size}`,
      {
        headers: {
          Authorization: `Bearer ${keycloak.token}`,
        },
        credentials: "include",
      }
    );
    return response.json();
  },

  getAllActionsByTask: async ({
    taskId,
    pageParam,
  }: {
    taskId: string;
    pageParam: number;
  }): Promise<Pageable<Action>> => {
    const response = await fetch(
      `${BASE_URL}/api/v1/tasks/${taskId}/actions?page=${pageParam}&size=5`,
      {
        headers: {
          Authorization: `Bearer ${keycloak.token}`,
        },
        credentials: "include",
      }
    );
    return response.json();
  },
};
