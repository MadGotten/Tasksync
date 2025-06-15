import { keycloak } from "@/api/keycloak";
import { Task } from "@/types/api";

const BASE_URL = import.meta.env.VITE_API_URL;

export type TaskRequest = Omit<Task, "id" | "column_id" | "board_id">;

export type TaskUpdateRequest = Omit<Task, "column_id" | "board_id">;

export const getTasks = async (boardId: string): Promise<Task[]> => {
  const response = await fetch(`${BASE_URL}/api/v1/boards/${boardId}/tasks`, {
    credentials: "include",
    headers: {
      Authorization: `Bearer ${keycloak.token}`,
    },
  });
  return await response.json();
};

export const TaskApi = {
  getAllTasksByBoard: async ({
    boardId,
    archived,
  }: {
    boardId: number;
    archived: boolean;
  }): Promise<Task[]> => {
    const response = await fetch(
      `${BASE_URL}/api/v1/boards/${boardId}/tasks?archived=${archived}`,
      {
        credentials: "include",
        headers: {
          Authorization: `Bearer ${keycloak.token}`,
        },
      }
    );
    return response.json();
  },

  addTask: async (boardId: number, listsId: number, task: TaskRequest): Promise<Task> => {
    const response = await fetch(`${BASE_URL}/api/v1/boards/${boardId}/lists/${listsId}/tasks`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${keycloak.token}`,
      },
      body: JSON.stringify({ ...task }),
    });
    return response.json();
  },

  getTaskById: async (boardId: number, taskId: number): Promise<Task> => {
    const response = await fetch(`${BASE_URL}/api/v1/boards/${boardId}/tasks/${taskId}`, {
      credentials: "include",
      headers: {
        Authorization: `Bearer ${keycloak.token}`,
      },
    });
    return response.json();
  },

  updateTask: async (boardId: number, taskId: number, task: TaskUpdateRequest): Promise<Task> => {
    const response = await fetch(`${BASE_URL}/api/v1/boards/${boardId}/tasks/${taskId}`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${keycloak.token}`,
      },
      body: JSON.stringify({ ...task }),
    });
    return response.json();
  },

  updatePartialTask: async (
    boardId: number,
    taskId: number,
    task: Partial<Task>
  ): Promise<Task> => {
    const response = await fetch(`${BASE_URL}/api/v1/boards/${boardId}/tasks/${taskId}`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${keycloak.token}`,
      },
      body: JSON.stringify({ ...task }),
    });
    return response.json();
  },

  deleteTask: async (boardId: number, taskId: number): Promise<void> => {
    await fetch(`${BASE_URL}/api/v1/boards/${boardId}/tasks/${taskId}`, {
      method: "DELETE",
      credentials: "include",
      headers: {
        Authorization: `Bearer ${keycloak.token}`,
      },
    });
  },

  archiveTask: async (boardId: number, taskId: number, task: Partial<Task>): Promise<Task> => {
    const response = await fetch(`${BASE_URL}/api/v1/boards/${boardId}/tasks/${taskId}/archive`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${keycloak.token}`,
      },
      body: JSON.stringify({ ...task }),
    });
    return response.json();
  },

  moveTask: async (boardId: number, taskId: number, task: Partial<Task>): Promise<Task> => {
    const response = await fetch(`${BASE_URL}/api/v1/boards/${boardId}/tasks/${taskId}/move`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${keycloak.token}`,
      },
      body: JSON.stringify({ ...task }),
    });
    return response.json();
  },

  reorderTasks: async (boardId: number, listId: string): Promise<void> => {
    await fetch(`${BASE_URL}/api/v1/boards/${boardId}/lists/${listId}/tasks/order`, {
      method: "PUT",
      credentials: "include",
      headers: {
        Authorization: `Bearer ${keycloak.token}`,
      },
    });
  },
};
