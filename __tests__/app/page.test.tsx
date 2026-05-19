import { render, screen } from "@testing-library/react";
import Home from "@/app/page";

describe("Home page", () => {
  it("renders the heading", () => {
    render(<Home />);

    expect(
      screen.getByText((content) => content.includes("Frontend Engineer") && content.includes("Take Home Test"))
    ).toBeInTheDocument();
  });

  it("renders a link to the portfolio", () => {
    render(<Home />);

    const portfolioLink = screen.getByRole("link", { name: /faid fadjri/i });
    expect(portfolioLink).toHaveAttribute("href", "https://faidfadjri.space");
  });

  it("renders a link to users page", () => {
    render(<Home />);

    const usersLink = screen.getByRole("link", { name: /view users/i });
    expect(usersLink).toHaveAttribute("href", "/users");
  });
});
