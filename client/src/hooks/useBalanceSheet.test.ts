import { afterEach, describe, expect, mock, test } from "bun:test";
import type { BalanceSheet } from "@show-me-the-money-code-test/common";
import { cleanup, renderHook, waitFor } from "@testing-library/react";
import { useBalanceSheet } from "./useBalanceSheet";

afterEach(() => cleanup());

// Skipped because there's an issue with happydom and @testing-library/react
describe.skip("useBalanceSheet", () => {
	test("useBalanceSheet - should fetch and parse balance sheet data", async () => {
		const mockBalanceSheet: BalanceSheet = {
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

		const mockFetchBalanceSheet = mock(() => Promise.resolve(mockBalanceSheet));

		const { result } = renderHook(() =>
			useBalanceSheet({ fetchBalanceSheet: mockFetchBalanceSheet }),
		);

		await waitFor(() => {
			expect(result.current.balanceSheet).toEqual(mockBalanceSheet);
			expect(result.current.parsingError).toBeNull();
		});

		expect(mockFetchBalanceSheet).toHaveBeenCalledTimes(1);
	});
});
