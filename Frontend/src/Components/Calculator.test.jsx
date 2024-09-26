import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import Calculator from './Calculator'; // Adjust the import based on your file structure
import { afterEach, test, expect, vi, beforeEach, beforeAll } from 'vitest';

// Enable fetch mock
beforeEach(() => {
  vi.clearAllMocks();
  global.fetch = vi.fn();
});

beforeAll(() => {
  const mockUserProfile = btoa(JSON.stringify({ id: '123' })); // Mocking user profile
  localStorage.setItem('token', 'mock-token');
  localStorage.setItem('user', mockUserProfile);
});

// Test for displaying number/operator clicks
test('displays clicked numbers and operators on the calculator display', () => {
  const { getByText, getByRole } = render(<Calculator />);

  // Simulate button clicks for numbers and an operator
  fireEvent.click(getByText("5"));
  fireEvent.click(getByText("+"));
  fireEvent.click(getByText("2"));

  // Check that the calculator display shows the correct sequence
  const displayInput = getByRole("textbox"); // Assuming you have an input element for displaying results
  expect(displayInput).toHaveValue("5+2"); // Assuming the display shows the current input expression
});

// Test for evaluating an expression and checking API call
test('evaluates expression and sends API request on "=" button click', async () => {
  // Mock the fetch API response to simulate successful API request
  fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => ({ success: true }), // Adjust response based on your implementation
  });

  const { getByText, getByRole } = render(<Calculator />);

  // Simulate button clicks for the calculation
  fireEvent.click(getByText("5"));
  fireEvent.click(getByText("+"));
  fireEvent.click(getByText("2"));
  fireEvent.click(getByText("="));

  // Check that the result is displayed correctly
  const displayInput = getByRole("textbox"); // Assuming you have an input element for displaying results
  await waitFor(() => expect(displayInput).toHaveValue("7")); // Check if the result is displayed as expected

  // Verify the API call details
  expect(fetch).toHaveBeenCalledWith("http://localhost:3000/api/logs", {
    method: "POST", // Ensure you're using POST method
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer mock-token`,
    },
    body: JSON.stringify({
      expression: "5+2",  // Ensure this matches your implementation
      is_valid: true,     // Assuming the result is valid
      output: 7,         // Expected output should be a number
      userId: "123",      // Mocked user ID
    }),
  });
});
