import { keycloak } from "@/api/keycloak";
import { Board, BoardMemberRole, User } from "@/types/api";

const BASE_URL = import.meta.env.VITE_API_URL;

export class BoardApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "BoardApiError";
    this.status = status;
  }
}

export const BoardApi = {
  getAllBoards: async (): Promise<Board[]> => {
    const response = await fetch(`${BASE_URL}/api/v1/boards`, {
      headers: {
        Authorization: `Bearer ${keycloak.token}`,
      },
      credentials: "include",
    });
    return response.json();
  },

  addBoard: async ({ name }: { name: string }): Promise<Board> => {
    const response = await fetch(`${BASE_URL}/api/v1/boards`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${keycloak.token}`,
      },
      body: JSON.stringify({ name: name }),
    });
    return response.json();
  },

  getBoardById: async ({ boardId }: { boardId: string }): Promise<BoardMemberRole> => {
    const response = await fetch(`${BASE_URL}/api/v1/boards/${boardId}`, {
      credentials: "include",
      headers: {
        Authorization: `Bearer ${keycloak.token}`,
      },
    });
    return response.json();
  },

  updateBoard: async ({ boardId, name }: { boardId: string; name: string }): Promise<Board> => {
    const response = await fetch(`${BASE_URL}/api/v1/boards/${boardId}`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${keycloak.token}`,
      },
      body: JSON.stringify({ name: name }),
    });
    return response.json();
  },

  updatePartialBoard: async ({
    boardId,
    name,
    is_public,
  }: {
    boardId: string;
    name: string;
    is_public: boolean;
  }): Promise<Board> => {
    const response = await fetch(`${BASE_URL}/api/v1/boards/${boardId}`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${keycloak.token}`,
      },
      body: JSON.stringify({ name: name, is_public: is_public }),
    });
    return response.json();
  },

  deleteBoard: async (boardId: string): Promise<void> => {
    await fetch(`${BASE_URL}/api/v1/boards/${boardId}`, {
      method: "DELETE",
      credentials: "include",
      headers: {
        Authorization: `Bearer ${keycloak.token}`,
      },
    });
  },

  inviteToBoard: async ({ boardId, email }: { boardId: string; email: string }): Promise<void> => {
    const response = await fetch(`${BASE_URL}/api/v1/boards/${boardId}/invitations`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${keycloak.token}`,
      },
      body: JSON.stringify({ email: email }),
    });

    if (!response.ok) {
      const data = await response.json();
      if (data) throw new BoardApiError(data.message, response.status);
      else throw new BoardApiError("Try again later.", response.status);
    }
  },

  getBoardMembers: async ({ boardId }: { boardId: string }): Promise<User[]> => {
    const response = await fetch(`${BASE_URL}/api/v1/boards/${boardId}/members`, {
      headers: {
        Authorization: `Bearer ${keycloak.token}`,
      },
      credentials: "include",
    });
    return response.json();
  },

  deleteBoardMember: async ({
    boardId,
    memberId,
  }: {
    boardId: string;
    memberId: string;
  }): Promise<void> => {
    await fetch(`${BASE_URL}/api/v1/boards/${boardId}/members/${memberId}`, {
      method: "DELETE",
      credentials: "include",
      headers: {
        Authorization: `Bearer ${keycloak.token}`,
      },
    });
  },
};
