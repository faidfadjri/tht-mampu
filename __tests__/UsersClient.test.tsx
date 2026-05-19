import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import UsersList from "@/app/users/UsersClient";
import type { UserAggregated } from "@/types";

const mockUsers: UserAggregated[] = [
  {
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
    totalPosts: 10,
    completedTodos: 5,
    pendingTodos: 3,
  },
  {
    id: 2,
    name: "Ervin Howell",
    username: "Antonette",
    email: "Shanna@melissa.tv",
    phone: "010-692-6593 x09125",
    website: "anastasia.net",
    company: {
      name: "Deckow-Crist",
      catchPhrase: "Proactive didactic contingency",
      bs: "synergize scalable supply-chains",
    },
    address: {
      street: "Victor Plains",
      suite: "Suite 879",
      city: "Wisokyburgh",
      zipcode: "90566-7771",
      geo: { lat: "-43.9509", lng: "-34.4618" },
    },
    totalPosts: 7,
    completedTodos: 2,
    pendingTodos: 0,
  },
  {
    id: 3,
    name: "Clementine Bauch",
    username: "Samantha",
    email: "Nathan@yesenia.net",
    phone: "1-463-123-4447",
    website: "ramiro.info",
    company: {
      name: "Romaguera-Jacobson",
      catchPhrase: "Face to face bifurcated interface",
      bs: "e-enable strategic applications",
    },
    address: {
      street: "Douglas Extension",
      suite: "Suite 847",
      city: "McKenziehaven",
      zipcode: "59590-4157",
      geo: { lat: "-68.6102", lng: "-47.0653" },
    },
    totalPosts: 3,
    completedTodos: 0,
    pendingTodos: 6,
  },
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

import useSWR from "swr";
jest.mock("swr");
const mockedUseSWR = jest.mocked(useSWR);

jest.mock("lottie-react", () => ({
  __esModule: true,
  default: ({ style, className }: { style?: React.CSSProperties; className?: string }) => (
    <div data-testid="lottie-animation" style={style} className={className} />
  ),
}));

jest.mock("next/navigation", () => ({
  useSearchParams: () => ({ get: () => null, toString: () => "" }),
  useRouter: () => ({ replace: jest.fn(), push: jest.fn(), back: jest.fn() }),
}));

function getTable() {
  return screen.getByRole("grid");
}

describe("UsersList", () => {
  beforeEach(() => {
    const MockObserver = jest.fn(() => ({
      observe: jest.fn(),
      disconnect: jest.fn(),
      unobserve: jest.fn(),
    }));
    Object.defineProperty(window, "IntersectionObserver", {
      writable: true,
      configurable: true,
      value: MockObserver,
    });

    mockedUseSWR.mockReturnValue({
      data: mockUsers,
      error: undefined,
      isLoading: false,
    } as ReturnType<typeof useSWR>);
  });

  it("renders all users in the table", () => {
    render(<UsersList />);
    const table = getTable();

    expect(within(table).getByText("Leanne Graham")).toBeInTheDocument();
    expect(within(table).getByText("Ervin Howell")).toBeInTheDocument();
    expect(within(table).getByText("Clementine Bauch")).toBeInTheDocument();
  });

  it("filters users by name through search input", async () => {
    render(<UsersList />);
    const table = getTable();

    const searchInput = screen.getByRole("searchbox", {
      name: /search users/i,
    });
    await userEvent.type(searchInput, "Ervin");

    expect(within(table).queryByText("Leanne Graham")).not.toBeInTheDocument();
    expect(within(table).getByText("Ervin Howell")).toBeInTheDocument();
    expect(within(table).queryByText("Clementine Bauch")).not.toBeInTheDocument();
  });

  it("filters users by email through search input", async () => {
    render(<UsersList />);
    const table = getTable();

    const searchInput = screen.getByRole("searchbox", {
      name: /search users/i,
    });
    await userEvent.type(searchInput, "Sincere@april.biz");

    expect(within(table).getByText("Leanne Graham")).toBeInTheDocument();
    expect(within(table).queryByText("Ervin Howell")).not.toBeInTheDocument();
  });

  it("shows empty state when search matches no users", async () => {
    render(<UsersList />);

    const searchInput = screen.getByRole("searchbox", {
      name: /search users/i,
    });
    await userEvent.type(searchInput, "zzzzz");

    expect(screen.getAllByText("No users found").length).toBeGreaterThanOrEqual(1);
  });

  it("sorts by pending todos ascending then descending", async () => {
    render(<UsersList />);
    const table = getTable();

    const sortPendingBtn = screen.getByRole("button", {
      name: /sort by pending todos/i,
    });

    await userEvent.click(sortPendingBtn);
    let rows = within(table).getAllByRole("row");
    expect(within(rows[1]).getByText("Ervin Howell")).toBeInTheDocument();
    expect(within(rows[3]).getByText("Clementine Bauch")).toBeInTheDocument();

    await userEvent.click(sortPendingBtn);
    rows = within(table).getAllByRole("row");
    expect(within(rows[1]).getByText("Clementine Bauch")).toBeInTheDocument();
    expect(within(rows[3]).getByText("Ervin Howell")).toBeInTheDocument();
  });

  it("filters to show only users with pending todos", async () => {
    render(<UsersList />);
    const table = getTable();

    const checkbox = screen.getByRole("checkbox", {
      name: /has pending todos only/i,
    });
    await userEvent.click(checkbox);

    expect(within(table).getByText("Leanne Graham")).toBeInTheDocument();
    expect(within(table).getByText("Clementine Bauch")).toBeInTheDocument();
    expect(within(table).queryByText("Ervin Howell")).not.toBeInTheDocument();
  });

  it("shows pagination controls and navigates pages", async () => {
    const manyUsers = Array.from({ length: 12 }, (_, i) => ({
      ...mockUsers[0],
      id: i + 1,
      name: `User ${i + 1}`,
      email: `user${i + 1}@test.com`,
    }));

    mockedUseSWR.mockReturnValue({
      data: manyUsers,
      error: undefined,
      isLoading: false,
    } as ReturnType<typeof useSWR>);

    render(<UsersList />);
    const table = getTable();

    expect(within(table).getByText("User 1")).toBeInTheDocument();
    expect(within(table).queryByText("User 6")).not.toBeInTheDocument();

    const nextBtn = screen.getByRole("button", { name: /next page/i });
    await userEvent.click(nextBtn);

    expect(within(table).getByText("User 6")).toBeInTheDocument();
    expect(within(table).queryByText("User 1")).not.toBeInTheDocument();
  });

  it("renders a back to home button linking to /", () => {
    render(<UsersList />);

    const backBtn = screen.getByRole("link", { name: /back to home/i });
    expect(backBtn).toHaveAttribute("href", "/");
    expect(backBtn).toHaveClass("bg-[#0E9F8E]");
    expect(backBtn).toHaveClass("text-white");
  });

  it("displays aggregated metrics correctly", () => {
    render(<UsersList />);
    const table = getTable();

    const rows = within(table).getAllByRole("row");
    const leanneRow = within(rows[3]);
    expect(leanneRow.getByText("10")).toBeInTheDocument();
    expect(leanneRow.getByText("5")).toBeInTheDocument();
    expect(leanneRow.getByText("3")).toBeInTheDocument();
  });

  describe("UsersList skeleton", () => {
    beforeEach(() => {
      mockedUseSWR.mockReturnValue({
        data: undefined,
        error: undefined,
        isLoading: true,
      } as ReturnType<typeof useSWR>);
    });

    it("renders skeleton during loading", () => {
      render(<UsersList />);
      expect(screen.getByText("Users")).toBeInTheDocument();
    });

    it("renders back to home button in skeleton", () => {
      render(<UsersList />);

      const backBtn = screen.getByRole("link", { name: /back to home/i });
      expect(backBtn).toHaveAttribute("href", "/");
      expect(backBtn).toHaveClass("bg-[#0E9F8E]");
    });

    it("renders skeleton table with correct column headers", () => {
      render(<UsersList />);
      const table = screen.getByRole("grid");

      const headers = within(table).getAllByRole("columnheader");
      expect(headers).toHaveLength(6);
      expect(headers[0]).toHaveTextContent("Name");
      expect(headers[1]).toHaveTextContent("Email");
      expect(headers[2]).toHaveTextContent("Website");
      expect(headers[3]).toHaveTextContent("Posts");
      expect(headers[4]).toHaveTextContent("Completed");
      expect(headers[5]).toHaveTextContent("Pending");
    });

    it("renders skeleton table with 5 skeleton rows", () => {
      render(<UsersList />);
      const table = screen.getByRole("grid");
      const rows = within(table).getAllByRole("row");
      expect(rows).toHaveLength(6);
    });

    it("renders 5 mobile skeleton cards", () => {
      render(<UsersList />);
      const container = screen.getByText("Users").closest("div")!;
      const cardContainer = container.querySelector(".grid.gap-4.md\\:hidden");
      expect(cardContainer).toBeInTheDocument();
      expect(cardContainer?.children).toHaveLength(5);
    });
  });
});
