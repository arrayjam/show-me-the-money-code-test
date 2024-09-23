import { describe, expect, test } from "bun:test";
import { type BalanceSheet, parseBalanceSheet } from "./balanceSheetSchema";

describe("parseBalanceSheet", () => {
	test("should parse a valid empty balance sheet", () => {
		const validBalanceSheet: BalanceSheet = {
			Status: "OK",
			Reports: [],
		};
		const result = parseBalanceSheet(validBalanceSheet);
		expect(result).toEqual(validBalanceSheet);
	});

	test("should parse a valid balance sheet", () => {
		const validBalanceSheet: BalanceSheet = {
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
								{
									RowType: "SummaryRow",
									Cells: [
										{ Value: "Total Current Assets" },
										{ Value: "50000" },
									],
								},
							],
						},
					],
				},
			],
		};

		const result = parseBalanceSheet(validBalanceSheet);
		expect(result).toEqual(validBalanceSheet);
	});

	test("should throw an error for invalid balance sheet", () => {
		const invalidBalanceSheet = {
			Status: "XYZ",
			Reports: [],
		};

		expect(() => parseBalanceSheet(invalidBalanceSheet)).toThrow(
			"Failed to parse Balance Sheet Schema",
		);
	});

	test("should throw an error for missing required fields", () => {
		const incompleteBalanceSheet = {
			Status: "OK",
			Reports: [
				{
					ReportID: "1",
					ReportName: "Balance Sheet",
					ReportType: "BalanceSheet",
					// Missing Fields
				},
			],
		};

		expect(() => parseBalanceSheet(incompleteBalanceSheet)).toThrow(
			"Failed to parse Balance Sheet Schema",
		);
	});
});
