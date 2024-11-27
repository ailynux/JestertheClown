import * as React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import CustomizedDialogs from "./ModalAlert";

test("renders Schedule Payments button", () => {
  render(<CustomizedDialogs />);
  const buttonElement = screen.getByText(/Schedule Payments/i);
  expect(buttonElement).toBeInTheDocument();
});

test("opens dialog on button click", () => {
  render(<CustomizedDialogs />);
  const buttonElement = screen.getByText(/Schedule Payments/i);
  fireEvent.click(buttonElement);
  const dialogTitle = screen.getByText(/Are you sure?/i);
  expect(dialogTitle).toBeInTheDocument();
});

test("renders one-time payment details", () => {
  render(<CustomizedDialogs />);
  const buttonElement = screen.getByText(/Schedule Payments/i);
  fireEvent.click(buttonElement);
  const oneTimePaymentDate = screen.getAllByText(/11\/23\/2024/i)[0];
  const oneTimePaymentAmount = screen.getByText(/\$75.00/i);
  expect(oneTimePaymentDate).toBeInTheDocument();
  expect(oneTimePaymentAmount).toBeInTheDocument();
});

test("renders payment queue details", () => {
  render(<CustomizedDialogs />);
  const buttonElement = screen.getByText(/Schedule Payments/i);
  fireEvent.click(buttonElement);
  const paymentQueueDate1 = screen.getByText(/11\/24\/2024/i);
  const paymentQueueAmount1 = screen.getByText(/\$110.34/i);
  const paymentQueueDate2 = screen.getAllByText(/11\/23\/2024/i)[1];
  const paymentQueueAmount2 = screen.getByText(/\$45.50/i);
  expect(paymentQueueDate1).toBeInTheDocument();
  expect(paymentQueueAmount1).toBeInTheDocument();
  expect(paymentQueueDate2).toBeInTheDocument();
  expect(paymentQueueAmount2).toBeInTheDocument();
});
