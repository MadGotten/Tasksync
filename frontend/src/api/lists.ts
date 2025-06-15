import { keycloak } from "@/api/keycloak";
import { List } from "@/types/api";

const BASE_URL = import.meta.env.VITE_API_URL;

export type ListRequest = Omit<List, "id" | "board_id">;

export const ListApi = {
  getAllLists: async (boardId: string): Promise<List[]> => {
    const response = await fetch(`${BASE_URL}/api/v1/boards/${boardId}/lists`, {
      credentials: "include",
      headers: {
        Authorization: `Bearer ${keycloak.token}`,
      },
    });
    return response.json();
  },

  addList: async (boardId: string, list: ListRequest): Promise<List> => {
    const response = await fetch(`${BASE_URL}/api/v1/boards/${boardId}/lists`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${keycloak.token}`,
      },
      body: JSON.stringify({ ...list }),
    });
    return response.json();
  },

  getListById: async (boardId: string, listId: string): Promise<List> => {
    const response = await fetch(`${BASE_URL}/api/v1/boards/${boardId}/lists/${listId}`, {
      credentials: "include",
      headers: {
        Authorization: `Bearer ${keycloak.token}`,
      },
    });
    return response.json();
  },

  updateList: async (
    boardId: string | number,
    listId: string | number,
    list: ListRequest
  ): Promise<List> => {
    const response = await fetch(`${BASE_URL}/api/v1/boards/${boardId}/lists/${listId}`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${keycloak.token}`,
      },
      body: JSON.stringify({ ...list }),
    });
    return response.json();
  },

  updatePartialList: async (
    boardId: string | number,
    listId: string | number,
    list: Partial<ListRequest>
  ): Promise<List> => {
    const response = await fetch(`${BASE_URL}/api/v1/boards/${boardId}/lists/${listId}`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${keycloak.token}`,
      },
      body: JSON.stringify({ ...list }),
    });
    return response.json();
  },

  deleteList: async (boardId: string | number, listId: string | number): Promise<void> => {
    await fetch(`${BASE_URL}/api/v1/boards/${boardId}/lists/${listId}`, {
      method: "DELETE",
      credentials: "include",
      headers: {
        Authorization: `Bearer ${keycloak.token}`,
      },
    });
  },

  reorderList: async (boardId: string): Promise<void> => {
    await fetch(`${BASE_URL}/api/v1/boards/${boardId}/lists/order`, {
      method: "PUT",
      credentials: "include",
      headers: {
        Authorization: `Bearer ${keycloak.token}`,
      },
    });
  },
};
