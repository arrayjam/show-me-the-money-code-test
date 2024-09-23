import { expect, mock, test } from "bun:test";
import { render, screen, waitFor } from "@testing-library/react";
import App from "./App";

test("Renders error message when parsing fails", async () => {
	mock.module("./hooks/useBalanceSheet", () => ({
		useBalanceSheet: () => ({
			balanceSheet: null,
			parsingError: new Error("Failed to parse Balance Sheet Schema"),
		}),
	}));

	render(<App />);

	await waitFor(() => {
		expect(
			screen.getByText("Failed to parse Balance Sheet Schema"),
		).toBeInTheDocument();
	});
});
