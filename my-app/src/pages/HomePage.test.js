import React from "react";
import { render, screen } from "@testing-library/react";
import HomePage from "../pages/HomePage";

test("renders THEHomePage component", () => {
  render(<HomePage />);
  const linkElement = screen.getByText(/THEHomePage/i);
  expect(linkElement).toBeInTheDocument();
});
