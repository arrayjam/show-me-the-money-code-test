import {
	type BalanceSheet,
	type BalanceSheetHeaderRow,
	type BalanceSheetRow,
	type BalanceSheetRowAll,
	type BalanceSheetSectionRow,
	type BalanceSheetSectionRowContents,
	type BalanceSheetSummaryRow,
	type BalanceSheetTopLevelRow,
	parseBalanceSheet,
} from "@show-me-the-money-code-test/common";
import { useEffect, useState } from "react";

function App() {
	const [balanceSheet, setBalanceSheet] = useState<BalanceSheet | null>(null);
	const [parsingError, setParsingError] = useState<Error | null>(null);

	useEffect(() => {
		async function fetchBalanceSheet() {
			const response = await fetch("/api/balance-sheet");
			const balanceSheetJSON = await response.json();
			try {
				const parsedBalanceSheet = parseBalanceSheet(balanceSheetJSON);
				setBalanceSheet(parsedBalanceSheet);
			} catch (error) {
				setParsingError(error as Error);
			}
		}
		fetchBalanceSheet();
	}, []);

	return (
		<>
			{balanceSheet?.Reports.map((report) => (
				<table key={report.ReportID} className="table-auto border-collapse">
					<caption className="caption-top whitespace-nowrap">
						{report.ReportTitles.join(" / ")}
					</caption>
					{report.Rows.map((row, rowIndex) => (
						// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
						<TopLevelRow key={rowIndex} row={row} />
					))}
				</table>
			))}
			{balanceSheet && <pre>{JSON.stringify(balanceSheet, null, 2)}</pre>}
			{parsingError && <pre>{parsingError.message}</pre>}
		</>
	);
}

const TopLevelRow = ({ row }: { row: BalanceSheetTopLevelRow }) => {
	switch (row.RowType) {
		case "Header":
			return <HeaderRow row={row} />;
		case "Section":
			return <SectionRow row={row} />;
		default:
			throw new Error("Unexpected row type");
	}
};

const HeaderRow = ({ row }: { row: BalanceSheetHeaderRow }) => {
	return (
		<thead>
			<tr>
				{row.Cells.map((cell) => (
					<th key={cell.Value} className="border border-slate-300">
						{cell.Value}
					</th>
				))}
			</tr>
		</thead>
	);
};

const SectionRow = ({ row }: { row: BalanceSheetSectionRow }) => {
	return (
		<tbody>
			{row.Rows.map((row, rowIndex) => (
				// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
				<SectionRowContents key={rowIndex} row={row} />
			))}
		</tbody>
	);
};

const SectionRowContents = ({
	row,
}: { row: BalanceSheetSectionRowContents }) => {
	switch (row.RowType) {
		case "Row":
			return <Row row={row} />;
		case "SummaryRow":
			return <SummaryRow row={row} />;
		default:
			throw new Error("Unexpected row type");
	}
};

const Row = ({ row }: { row: BalanceSheetRow }) => {
	return (
		<tr>
			{row.Cells.map((cell, cellIndex) => (
				// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
				<td key={cellIndex} className="border text-yellow-400">
					{cell.Value}
				</td>
			))}
		</tr>
	);
};

const SummaryRow = ({ row }: { row: BalanceSheetSummaryRow }) => {
	return (
		<tr>
			{row.Cells.map((cell, cellIndex) => (
				// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
				<td key={cellIndex} className="border text-red-500">
					{cell.Value}
				</td>
			))}
		</tr>
	);
};

export default App;
