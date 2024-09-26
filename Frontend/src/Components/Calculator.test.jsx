import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Calculator from "./Calculator"; // Adjust to your path
import axios from "axios";
import { vi } from "vitest"; // Vitest import

// Mock axios for API calls using Vitest
vi.mock("axios");

// Mock the wrap function if it's imported
vi.mock('./path/to/wrapFunction', () => ({
  wrap: vi.fn(), // Mock the wrap function
}));

test("input field is displayed correctly", () => {
  render(<Calculator />);
  const inputElement = screen.getByRole("textbox");
  expect(inputElement).toBeInTheDocument();
});


test("displays correct input on number/operator click for subtraction", () => {
  render(<Calculator />);

  // Check the input field
  const inputElement = screen.getByRole("textbox");

  // Simulate button clicks for '7', '-', '3'
  fireEvent.click(screen.getByText("7"));
  fireEvent.click(screen.getByText("-"));
  fireEvent.click(screen.getByText("3"));

  // Assert the input value
  expect(inputElement.value).toBe("7-3");
});


test("displays correct input on number/operator click for addition", () => {
  render(<Calculator />);

  // Check the input field
  const inputElement = screen.getByRole("textbox");

  // Simulate button clicks for '7', '+', '3'
  fireEvent.click(screen.getByText("7"));
  fireEvent.click(screen.getByText("+"));
  fireEvent.click(screen.getByText("3"));

  // Assert the input value
  expect(inputElement.value).toBe("7+3");
});

test("calculator logs are displayed correctly", () => {
  render(<Calculator />);
  const logsTable = screen.getByRole("table");
  expect(logsTable).toBeInTheDocument();
});