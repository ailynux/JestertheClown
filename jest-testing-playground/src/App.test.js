import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders the Jest Carnival brand", () => {
  render(<App />);
  expect(screen.getByText(/Jest Carnival/i)).toBeInTheDocument();
});
