import { afterEach, beforeEach, describe, expect, mock, test } from "bun:test";
import type { BalanceSheet } from "@show-me-the-money-code-test/common";
import type { Server } from "bun";
import { clearMocks, mock as mockFetch } from "bun-bagel";
import { type ServerConfig, config, createServer } from "./createServer";
import { fetchBalanceSheet } from "./fetchBalanceSheet";

describe("Server Tests", () => {
	const mockBalanceSheetURL = config.balanceSheetURL;
	const mockBalanceSheetData: BalanceSheet = {
		Status: "OK",
		Reports: [
			{
				ReportID: "1",
				ReportName: "Balance Sheet",
				ReportType: "BalanceSheet",
				ReportTitles: ["Balance Sheet"],
				ReportDate: "2024-03-31",
				UpdatedDateUTC: "2024-03-31T00:00:00",
				Fields: [],
				Rows: [
					{
						RowType: "Header",
						Cells: [{ Value: "Assets" }, { Value: "Amount" }],
					},
					{
						RowType: "Section",
						Title: "Current Assets",
						Rows: [
							{
								RowType: "Row",
								Cells: [{ Value: "Cash" }, { Value: "50000" }],
							},
						],
					},
				],
			},
		],
	};

	afterEach(() => {
		clearMocks();
	});

	describe("fetchBalanceSheet", () => {
		test("should fetch and parse balance sheet data", async () => {
			mockFetch(mockBalanceSheetURL, {
				response: { data: mockBalanceSheetData },
			});

			const result = await fetchBalanceSheet(mockBalanceSheetURL);

			expect(result).toEqual(mockBalanceSheetData);
		});

		test("should throw an error for non-OK response", async () => {
			mockFetch(mockBalanceSheetURL, { response: { status: 404 } });

			await expect(fetchBalanceSheet(mockBalanceSheetURL)).rejects.toThrow(
				"HTTP Error. Status: 404",
			);
		});

		test("should throw an error for invalid balance sheet data", async () => {
			mockFetch(mockBalanceSheetURL, {
				response: { data: { Status: "Error" } },
			});

			await expect(fetchBalanceSheet(mockBalanceSheetURL)).rejects.toThrow(
				"Failed to parse Balance Sheet Schema",
			);
		});
	});

	describe("Server API", () => {
		const config: ServerConfig = {
			balanceSheetURL: mockBalanceSheetURL,
			port: 3000,
		};

		test("should return balance sheet data for /api/balance-sheet endpoint", async () => {
			mockFetch(mockBalanceSheetURL, {
				response: { data: mockBalanceSheetData },
			});

			const server = createServer(config, {
				balanceSheetFetchFn: fetchBalanceSheet,
			});

			// @ts-ignore-line
			const response = await server.fetch(
				new Request("http://localhost:3000/api/balance-sheet"),
			);

			if (response) {
				expect(response.status).toBe(200);
				const responseData = await response.json();
				expect(responseData).toEqual(mockBalanceSheetData);
			}
		});

		test("should return 404 for unknown routes", async () => {
			const server = createServer(config, {
				balanceSheetFetchFn: fetchBalanceSheet,
			});

			// @ts-ignore-line
			const response = await server.fetch(
				new Request("http://localhost:3000/unknown-route"),
			);

			if (response) {
				expect(response.status).toBe(404);
			}
		});

		test("should not serve static files in development mode", async () => {
			const server = createServer(config, {
				balanceSheetFetchFn: fetchBalanceSheet,
			});

			// @ts-ignore-line
			const response = await server.fetch(
				new Request("http://localhost:3000/index.html"),
			);

			if (response) {
				expect(response.status).toBe(404);
				const text = await response.text();
				expect(text).toBe("Not found");
			}
		});
	});
});
