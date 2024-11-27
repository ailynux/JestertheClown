import React from "react";
import { render } from "@testing-library/react";
import HomePage from "../pages/HomePage";

test("renders THEHomePage component", () => {
  const { getByText } = render(<HomePage />);
  const linkElement = getByText(/THEHomePage/i);
  expect(linkElement).toBeInTheDocument();
});
