import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import UserDetailClient from "@/app/users/[id]/UserDetailClient";
import type { User, Post, Todo } from "@/types";

const mockUser: User = {
  id: 1,
  name: "Leanne Graham",
  username: "Bret",
  email: "Sincere@april.biz",
  phone: "1-770-736-8031 x56442",
  website: "hildegard.org",
  company: {
    name: "Romaguera-Crona",
    catchPhrase: "Multi-layered client-server neural-net",
    bs: "harness real-time e-markets",
  },
  address: {
    street: "Kulas Light",
    suite: "Apt. 556",
    city: "Gwenborough",
    zipcode: "92998-3874",
    geo: { lat: "-37.3159", lng: "81.1496" },
  },
};

const mockPosts: Post[] = [
  { userId: 1, id: 1, title: "post title one", body: "post body one" },
  { userId: 1, id: 2, title: "post title two", body: "post body two" },
];

const mockTodos: Todo[] = [
  { userId: 1, id: 1, title: "todo one", completed: true },
  { userId: 1, id: 2, title: "todo two", completed: false },
  { userId: 1, id: 3, title: "todo three", completed: true },
];

jest.mock("next/link", () => {
  const MockLink = ({
    children,
    href,
    ...rest
  }: {
    children: React.ReactNode;
    href: string;
    [key: string]: unknown;
  }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  );
  return MockLink;
});

jest.mock("next/navigation", () => ({
  useRouter: () => ({ back: jest.fn(), push: jest.fn(), replace: jest.fn() }),
  useSearchParams: () => ({ get: () => null, toString: () => "" }),
}));

import useSWR from "swr";
jest.mock("swr");
const mockedUseSWR = jest.mocked(useSWR);

describe("UserDetailClient", () => {
  beforeEach(() => {
    mockedUseSWR.mockReturnValue({
      data: { user: mockUser, posts: mockPosts, todos: mockTodos },
      error: undefined,
      isLoading: false,
    } as ReturnType<typeof useSWR>);
  });

  it("renders user basic information", () => {
    render(<UserDetailClient id="1" />);

    expect(screen.getByText("Leanne Graham")).toBeInTheDocument();
    expect(screen.getByText("Bret")).toBeInTheDocument();
    expect(screen.getByText("Sincere@april.biz")).toBeInTheDocument();
    expect(screen.getByText("1-770-736-8031 x56442")).toBeInTheDocument();
    expect(screen.getByText("hildegard.org")).toBeInTheDocument();
  });

  it("renders company information", () => {
    render(<UserDetailClient id="1" />);

    expect(screen.getByText("Romaguera-Crona")).toBeInTheDocument();
    expect(
      screen.getByText("Multi-layered client-server neural-net")
    ).toBeInTheDocument();
  });

  it("renders address information", () => {
    render(<UserDetailClient id="1" />);

    expect(screen.getByText("Kulas Light")).toBeInTheDocument();
    expect(screen.getByText("Apt. 556")).toBeInTheDocument();
    expect(screen.getByText("Gwenborough")).toBeInTheDocument();
    expect(screen.getByText("92998-3874")).toBeInTheDocument();
  });

  it("renders posts section with content", () => {
    render(<UserDetailClient id="1" />);

    const postsSection = screen.getByRole("region", { name: /posts/i });
    expect(
      within(postsSection).getByText("post title one")
    ).toBeInTheDocument();
    expect(
      within(postsSection).getByText("post title two")
    ).toBeInTheDocument();
    expect(within(postsSection).getByText("post body one")).toBeInTheDocument();
  });

  it("renders todos section with completion status", () => {
    render(<UserDetailClient id="1" />);

    const todosSection = screen.getByRole("region", { name: /todos/i });
    expect(within(todosSection).getByText("todo one")).toBeInTheDocument();
    expect(within(todosSection).getByText("todo two")).toBeInTheDocument();
    expect(within(todosSection).getByText("todo three")).toBeInTheDocument();
  });

  it("has a back to list button with filled style", () => {
    render(<UserDetailClient id="1" />);

    const backBtn = screen.getByRole("button", { name: /back to list/i });
    expect(backBtn).toBeInTheDocument();
    expect(backBtn).toHaveClass("bg-[#0E9F8E]");
    expect(backBtn).toHaveClass("text-white");
    expect(backBtn).toHaveClass("rounded-md");
  });

  it("shows show all button when more than 5 posts exist", () => {
    const manyPosts = Array.from({ length: 7 }, (_, i) => ({
      userId: 1,
      id: i + 1,
      title: `Post ${i + 1}`,
      body: `Body ${i + 1}`,
    }));

    mockedUseSWR.mockReturnValue({
      data: { user: mockUser, posts: manyPosts, todos: mockTodos },
      error: undefined,
      isLoading: false,
    } as ReturnType<typeof useSWR>);

    render(<UserDetailClient id="1" />);

    expect(screen.getByText("Show all")).toBeInTheDocument();
  });

  it("toggles show all / show less for posts", async () => {
    const manyPosts = Array.from({ length: 7 }, (_, i) => ({
      userId: 1,
      id: i + 1,
      title: `Post ${i + 1}`,
      body: `Body ${i + 1}`,
    }));

    mockedUseSWR.mockReturnValue({
      data: { user: mockUser, posts: manyPosts, todos: mockTodos },
      error: undefined,
      isLoading: false,
    } as ReturnType<typeof useSWR>);

    render(<UserDetailClient id="1" />);

    const listItems = screen.getAllByRole("listitem");
    expect(listItems.length).toBe(8);

    await userEvent.click(screen.getByText("Show all"));
    expect(screen.getAllByRole("listitem").length).toBe(10);
  });

  it("displays correct counts in section headings", () => {
    render(<UserDetailClient id="1" />);

    expect(screen.getByText("Posts (2)")).toBeInTheDocument();
    expect(screen.getByText("Todos (3)")).toBeInTheDocument();
  });

  describe("UserDetailClient skeleton", () => {
    beforeEach(() => {
      mockedUseSWR.mockReturnValue({
        data: undefined,
        error: undefined,
        isLoading: true,
      } as ReturnType<typeof useSWR>);
    });

    it("renders skeleton during loading", () => {
      render(<UserDetailClient id="1" />);

      const pulses = document.querySelectorAll(".animate-pulse");
      expect(pulses.length).toBeGreaterThan(0);
    });

    it("renders skeleton with matching card structure", () => {
      render(<UserDetailClient id="1" />);

      const skeletons = document.querySelectorAll(".animate-pulse");
      expect(skeletons.length).toBeGreaterThan(10);
    });
  });
});
