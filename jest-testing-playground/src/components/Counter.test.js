import { render, screen, fireEvent } from "@testing-library/react";
import Counter from "./Counter";

test("renders counter with default value of 0", () => {
  render(<Counter />);
  expect(screen.getByText(/Counter: 0/i)).toBeInTheDocument();
});

test("increments counter when clicking Increase button", () => {
  render(<Counter />);
  const increaseBtn = screen.getByText(/Increase/i);
  fireEvent.click(increaseBtn);
  expect(screen.getByText(/Counter: 1/i)).toBeInTheDocument();
});

test("decrements counter when clicking Decrease button", () => {
  render(<Counter />);
  const decreaseBtn = screen.getByText(/Decrease/i);
  fireEvent.click(decreaseBtn);
  expect(screen.getByText(/Counter: -1/i)).toBeInTheDocument();
});
