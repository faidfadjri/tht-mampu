import { fetcher, fetchAggregatedUsers, fetchUserDetail } from "@/lib/fetcher";
import type { User, Post, Todo } from "@/types";

const mockUsers: User[] = [
  {
    id: 1,
    name: "Leanne Graham",
    username: "Bret",
    email: "Sincere@april.biz",
    phone: "1-770-736-8031 x56442",
    website: "hildegard.org",
    company: { name: "Romaguera-Crona", catchPhrase: "Multi-layered client-server neural-net", bs: "harness real-time e-markets" },
    address: { street: "Kulas Light", suite: "Apt. 556", city: "Gwenborough", zipcode: "92998-3874", geo: { lat: "-37.3159", lng: "81.1496" } },
  },
  {
    id: 2,
    name: "Ervin Howell",
    username: "Antonette",
    email: "Shanna@melissa.tv",
    phone: "010-692-6593 x09125",
    website: "anastasia.net",
    company: { name: "Deckow-Crist", catchPhrase: "Proactive didactic contingency", bs: "synergize scalable supply-chains" },
    address: { street: "Victor Plains", suite: "Suite 879", city: "Wisokyburgh", zipcode: "90566-7771", geo: { lat: "-43.9509", lng: "-34.4618" } },
  },
];

const mockPosts: Post[] = [
  { userId: 1, id: 1, title: "post one", body: "body one" },
  { userId: 1, id: 2, title: "post two", body: "body two" },
  { userId: 2, id: 3, title: "post three", body: "body three" },
];

const mockTodos: Todo[] = [
  { userId: 1, id: 1, title: "todo one", completed: true },
  { userId: 1, id: 2, title: "todo two", completed: false },
  { userId: 2, id: 3, title: "todo three", completed: true },
  { userId: 2, id: 4, title: "todo four", completed: false },
];

const mockFetch = (data: unknown) =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve(data),
  } as Response);

const mockFetchError = (status: number) =>
  Promise.resolve({
    ok: false,
    status,
    json: () => Promise.reject(new Error("Not JSON")),
  } as Response);

beforeEach(() => {
  jest.resetAllMocks();
});

describe("fetcher", () => {
  it("returns parsed JSON on success", async () => {
    global.fetch = jest.fn().mockResolvedValue(mockFetch({ id: 1, name: "test" }));

    const result = await fetcher<{ id: number; name: string }>(
      "https://example.com/api"
    );

    expect(result).toEqual({ id: 1, name: "test" });
    expect(global.fetch).toHaveBeenCalledWith("https://example.com/api");
  });

  it("throws on non-ok response", async () => {
    global.fetch = jest.fn().mockResolvedValue(mockFetchError(404));

    await expect(fetcher("https://example.com/api")).rejects.toThrow(
      "Failed to fetch: 404"
    );
  });

  it("throws on network error", async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error("Network error"));

    await expect(fetcher("https://example.com/api")).rejects.toThrow(
      "Network error"
    );
  });
});

describe("fetchAggregatedUsers", () => {
  it("aggregates users with post and todo counts", async () => {
    global.fetch = jest
      .fn()
      .mockResolvedValueOnce(mockFetch(mockUsers))
      .mockResolvedValueOnce(mockFetch(mockPosts))
      .mockResolvedValueOnce(mockFetch(mockTodos));

    const result = await fetchAggregatedUsers();

    expect(result).toHaveLength(2);

    const user1 = result.find((u) => u.id === 1)!;
    expect(user1.totalPosts).toBe(2);
    expect(user1.completedTodos).toBe(1);
    expect(user1.pendingTodos).toBe(1);

    const user2 = result.find((u) => u.id === 2)!;
    expect(user2.totalPosts).toBe(1);
    expect(user2.completedTodos).toBe(1);
    expect(user2.pendingTodos).toBe(1);
  });

  it("sets zero counts when no matching data exists", async () => {
    const usersWithoutData: User[] = [mockUsers[0]];

    global.fetch = jest
      .fn()
      .mockResolvedValueOnce(mockFetch(usersWithoutData))
      .mockResolvedValueOnce(mockFetch([]))
      .mockResolvedValueOnce(mockFetch([]));

    const result = await fetchAggregatedUsers();

    expect(result).toHaveLength(1);
    expect(result[0].totalPosts).toBe(0);
    expect(result[0].completedTodos).toBe(0);
    expect(result[0].pendingTodos).toBe(0);
  });

  it("preserves original user fields", async () => {
    global.fetch = jest
      .fn()
      .mockResolvedValueOnce(mockFetch(mockUsers))
      .mockResolvedValueOnce(mockFetch(mockPosts))
      .mockResolvedValueOnce(mockFetch(mockTodos));

    const result = await fetchAggregatedUsers();

    expect(result[0].name).toBe("Leanne Graham");
    expect(result[0].email).toBe("Sincere@april.biz");
    expect(result[0].website).toBe("hildegard.org");
    expect(result[0].company.name).toBe("Romaguera-Crona");
  });

  it("throws when users fetch fails", async () => {
    global.fetch = jest.fn().mockResolvedValue(mockFetchError(500));

    await expect(fetchAggregatedUsers()).rejects.toThrow();
  });

  it("throws when posts fetch fails", async () => {
    global.fetch = jest
      .fn()
      .mockResolvedValueOnce(mockFetch(mockUsers))
      .mockResolvedValueOnce(mockFetchError(500));

    await expect(fetchAggregatedUsers()).rejects.toThrow();
  });

  it("throws when todos fetch fails", async () => {
    global.fetch = jest
      .fn()
      .mockResolvedValueOnce(mockFetch(mockUsers))
      .mockResolvedValueOnce(mockFetch(mockPosts))
      .mockResolvedValueOnce(mockFetchError(500));

    await expect(fetchAggregatedUsers()).rejects.toThrow();
  });
});

describe("fetchUserDetail", () => {
  it("returns user with posts and todos", async () => {
    global.fetch = jest
      .fn()
      .mockResolvedValueOnce(mockFetch(mockUsers[0]))
      .mockResolvedValueOnce(mockFetch(mockPosts.filter((p) => p.userId === 1)))
      .mockResolvedValueOnce(mockFetch(mockTodos.filter((t) => t.userId === 1)));

    const result = await fetchUserDetail(1);

    expect(result.user.id).toBe(1);
    expect(result.user.name).toBe("Leanne Graham");
    expect(result.posts).toHaveLength(2);
    expect(result.todos).toHaveLength(2);
  });

  it("throws when user is not found (empty object)", async () => {
    global.fetch = jest
      .fn()
      .mockResolvedValueOnce(mockFetch({} as User))
      .mockResolvedValueOnce(mockFetch([]))
      .mockResolvedValueOnce(mockFetch([]));

    await expect(fetchUserDetail(999)).rejects.toThrow("User not found");
  });

  it("throws when user fetch fails", async () => {
    global.fetch = jest.fn().mockResolvedValue(mockFetchError(404));

    await expect(fetchUserDetail(999)).rejects.toThrow();
  });

  it("throws when posts fetch fails", async () => {
    global.fetch = jest
      .fn()
      .mockResolvedValueOnce(mockFetch(mockUsers[0]))
      .mockResolvedValueOnce(mockFetchError(500));

    await expect(fetchUserDetail(1)).rejects.toThrow();
  });

  it("throws when todos fetch fails", async () => {
    global.fetch = jest
      .fn()
      .mockResolvedValueOnce(mockFetch(mockUsers[0]))
      .mockResolvedValueOnce(mockFetch(mockPosts.filter((p) => p.userId === 1)))
      .mockResolvedValueOnce(mockFetchError(500));

    await expect(fetchUserDetail(1)).rejects.toThrow();
  });
});
