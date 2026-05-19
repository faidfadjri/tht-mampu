export const API_BASE = "https://jsonplaceholder.typicode.com";

export const endpoints = {
  users: `${API_BASE}/users`,
  posts: `${API_BASE}/posts`,
  todos: `${API_BASE}/todos`,
  user: (id: number) => `${API_BASE}/users/${id}`,
  userPosts: (id: number) => `${API_BASE}/users/${id}/posts`,
  userTodos: (id: number) => `${API_BASE}/users/${id}/todos`,
} as const;
