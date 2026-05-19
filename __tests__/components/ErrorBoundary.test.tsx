import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import ErrorBoundary from "@/components/ErrorBoundary";

const GoodChild = () => <p>Everything is fine</p>;

const BadChild = () => {
  throw new Error("Oops!");
};

let throwError = true;

const ToggleChild = () => {
  if (throwError) {
    throw new Error("Oops!");
  }
  return <p>Everything is fine</p>;
};

describe("ErrorBoundary", () => {
  beforeEach(() => {
    jest.spyOn(console, "error").mockImplementation(() => {});
    throwError = true;
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("renders children when there is no error", () => {
    render(
      <ErrorBoundary>
        <GoodChild />
      </ErrorBoundary>
    );

    expect(screen.getByText("Everything is fine")).toBeInTheDocument();
  });

  it("renders default fallback when a child throws", () => {
    render(
      <ErrorBoundary>
        <BadChild />
      </ErrorBoundary>
    );

    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
    expect(
      screen.getByText("An unexpected error occurred. Please try again.")
    ).toBeInTheDocument();
  });

  it("renders custom fallback when provided", () => {
    render(
      <ErrorBoundary fallback={<div>Custom error UI</div>}>
        <BadChild />
      </ErrorBoundary>
    );

    expect(screen.getByText("Custom error UI")).toBeInTheDocument();
  });

  it("recovers after clicking try again", async () => {
    throwError = true;

    render(
      <ErrorBoundary>
        <ToggleChild />
      </ErrorBoundary>
    );

    expect(screen.getByText("Something went wrong")).toBeInTheDocument();

    throwError = false;

    const tryAgainBtn = screen.getByRole("button", { name: /try again/i });
    await userEvent.click(tryAgainBtn);

    expect(screen.getByText("Everything is fine")).toBeInTheDocument();
  });
});
