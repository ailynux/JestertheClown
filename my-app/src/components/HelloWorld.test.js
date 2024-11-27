import React from "react";
import { render } from "@testing-library/react";
import HelloWorld from "../components/HelloWorld";

test("renders Hello, World! text", () => {
  const { getByText } = render(<HelloWorld />);
  const linkElement = getByText(/Hello, World!/i);
  expect(linkElement).toBeInTheDocument();
});
