import { describe, expect, test } from "bun:test";
import type { BalanceSheetReport } from "@show-me-the-money-code-test/common";
import { render, screen } from "@testing-library/react";
import { BalanceSheetTable } from "./BalanceSheetTable";

describe("BalanceSheetTable", () => {
	test("renders the balance sheet table correctly", () => {
		const mockReport: BalanceSheetReport = {
			ReportID: "1",
			ReportName: "Test Balance Sheet",
			ReportType: "BalanceSheet",
			ReportTitles: ["Test Balance Sheet"],
			ReportDate: "2024-03-31",
			UpdatedDateUTC: "2024-03-31T00:00:00",
			Fields: [],
			Rows: [
				{
					RowType: "Header",
					Cells: [{ Value: "Account" }, { Value: "Balance" }],
				},
				{
					RowType: "Section",
					Title: "Assets",
					Rows: [
						{
							RowType: "Row",
							Cells: [{ Value: "Cash" }, { Value: "10000" }],
						},
						{
							RowType: "Row",
							Cells: [{ Value: "Accounts Receivable" }, { Value: "5000" }],
						},
						{
							RowType: "SummaryRow",
							Cells: [{ Value: "Total Assets" }, { Value: "15000" }],
						},
					],
				},
				{
					RowType: "Section",
					Title: "Liabilities",
					Rows: [
						{
							RowType: "Row",
							Cells: [{ Value: "Accounts Payable" }, { Value: "-2000" }],
						},
						{
							RowType: "SummaryRow",
							Cells: [{ Value: "Total Liabilities" }, { Value: "-2001" }],
						},
					],
				},
			],
		};

		render(<BalanceSheetTable report={mockReport} />);

		expect(screen.getByText("Account")).toBeInTheDocument();
		expect(screen.getByText("Balance")).toBeInTheDocument();
		expect(screen.getByText("Cash")).toBeInTheDocument();
		expect(screen.getByText("10000")).toBeInTheDocument();
		expect(screen.getByText("Accounts Receivable")).toBeInTheDocument();
		expect(screen.getByText("5000")).toBeInTheDocument();
		expect(screen.getByText("Total Assets")).toBeInTheDocument();
		expect(screen.getByText("15000")).toBeInTheDocument();

		const negativeValue = screen.getByText("-2000");
		expect(negativeValue).toBeInTheDocument();
		expect(negativeValue).toHaveClass("text-red-300");
	});
});
