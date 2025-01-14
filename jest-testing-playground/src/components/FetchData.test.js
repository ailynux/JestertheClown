import { render, screen, waitFor } from "@testing-library/react";
import FetchData from "./FetchData"; // ✅ Ensure it's a default import

// ✅ Ensure we are properly mocking fetch
beforeEach(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve({ title: "Mocked Todo Item" }),
    })
  );
});

afterEach(() => {
  jest.clearAllMocks(); // ✅ Prevents memory leaks
});

test("renders fetched data", async () => {
  render(<FetchData />);

  // ✅ Check for loading state
  expect(screen.getByText(/Loading.../i)).toBeInTheDocument();

  // ✅ Wait for fetch to resolve and update the UI
  await waitFor(() => {
    expect(screen.getByText(/Mocked Todo Item/i)).toBeInTheDocument();
  });
});
