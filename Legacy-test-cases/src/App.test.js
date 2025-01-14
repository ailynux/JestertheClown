import React from "react";
import { render } from "@testing-library/react";
import App from "./App";

test("renders HomePage component", () => {
  const { getByText } = render(<App />);
  const linkElement = getByText(/THEHomePage/i);
  expect(linkElement).toBeInTheDocument();
});
