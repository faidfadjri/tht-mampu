import { renderHook } from "@testing-library/react";
import { useUsers } from "@/hooks/useUsers";

jest.mock("swr");

const mockedUseSWR = jest.requireMock("swr").default as jest.Mock;
const mockFetcher = jest.fn();

jest.mock("@/lib/fetcher", () => ({
  fetchAggregatedUsers: jest.fn(() => mockFetcher()),
}));

const mockData = [
  {
    id: 1,
    name: "Leanne Graham",
    totalPosts: 10,
    completedTodos: 5,
    pendingTodos: 3,
  },
];

describe("useUsers", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns data when SWR succeeds", () => {
    mockedUseSWR.mockReturnValue({
      data: mockData,
      error: undefined,
      isLoading: false,
    });

    const { result } = renderHook(() => useUsers());

    expect(result.current.data).toEqual(mockData);
    expect(result.current.error).toBeUndefined();
    expect(result.current.isLoading).toBe(false);
  });

  it("returns error when SWR fails", () => {
    const testError = new Error("Failed to fetch");
    mockedUseSWR.mockReturnValue({
      data: undefined,
      error: testError,
      isLoading: false,
    });

    const { result } = renderHook(() => useUsers());

    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toBe(testError);
    expect(result.current.isLoading).toBe(false);
  });

  it("returns loading state initially", () => {
    mockedUseSWR.mockReturnValue({
      data: undefined,
      error: undefined,
      isLoading: true,
    });

    const { result } = renderHook(() => useUsers());

    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toBeUndefined();
    expect(result.current.isLoading).toBe(true);
  });

  it("calls SWR with correct key", () => {
    mockedUseSWR.mockReturnValue({
      data: undefined,
      error: undefined,
      isLoading: true,
    });

    renderHook(() => useUsers());

    expect(mockedUseSWR).toHaveBeenCalledWith(
      "aggregated-users",
      expect.any(Function)
    );
  });
});
