import { renderHook } from "@testing-library/react";
import { useUserDetail } from "@/hooks/useUserDetail";

jest.mock("swr");

const mockedUseSWR = jest.requireMock("swr").default as jest.Mock;

const mockData = {
  user: { id: 1, name: "Leanne Graham" },
  posts: [{ id: 1, title: "Post One" }],
  todos: [{ id: 1, title: "Todo One", completed: true }],
};

describe("useUserDetail", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns data when SWR succeeds", () => {
    mockedUseSWR.mockReturnValue({
      data: mockData,
      error: undefined,
      isLoading: false,
    });

    const { result } = renderHook(() => useUserDetail(1));

    expect(result.current.data).toEqual(mockData);
    expect(result.current.error).toBeUndefined();
    expect(result.current.isLoading).toBe(false);
  });

  it("returns error when SWR fails", () => {
    const testError = new Error("Not found");
    mockedUseSWR.mockReturnValue({
      data: undefined,
      error: testError,
      isLoading: false,
    });

    const { result } = renderHook(() => useUserDetail(1));

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

    const { result } = renderHook(() => useUserDetail(1));

    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toBeUndefined();
    expect(result.current.isLoading).toBe(true);
  });

  it("passes null key when id is 0 to prevent fetch", () => {
    mockedUseSWR.mockReturnValue({
      data: undefined,
      error: undefined,
      isLoading: false,
    });

    renderHook(() => useUserDetail(0));

    expect(mockedUseSWR).toHaveBeenCalledWith(
      null,
      expect.any(Function),
      expect.objectContaining({ revalidateOnFocus: false })
    );
  });

  it("passes null key when id is negative", () => {
    mockedUseSWR.mockReturnValue({
      data: undefined,
      error: undefined,
      isLoading: false,
    });

    renderHook(() => useUserDetail(-5));

    expect(mockedUseSWR).toHaveBeenCalledWith(
      null,
      expect.any(Function),
      expect.objectContaining({ revalidateOnFocus: false })
    );
  });

  it("calls SWR with correct key for valid id", () => {
    mockedUseSWR.mockReturnValue({
      data: undefined,
      error: undefined,
      isLoading: true,
    });

    renderHook(() => useUserDetail(42));

    expect(mockedUseSWR).toHaveBeenCalledWith(
      "user-detail-42",
      expect.any(Function),
      expect.objectContaining({ revalidateOnFocus: false })
    );
  });
});
