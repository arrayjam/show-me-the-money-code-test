import {
	type BalanceSheet,
	type BalanceSheetHeaderRow,
	type BalanceSheetReport,
	type BalanceSheetRow,
	type BalanceSheetSectionRow,
	type BalanceSheetSectionRowContents,
	type BalanceSheetSummaryRow,
	type BalanceSheetTopLevelRow,
	parseBalanceSheet,
} from "@show-me-the-money-code-test/common";
import { useEffect, useState } from "react";
import { twJoin } from "tailwind-merge";

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
				<BalanceSheetTable key={report.ReportID} report={report} />
			))}

			{/* {balanceSheet && <pre>{JSON.stringify(balanceSheet, null, 2)}</pre>} */}
			{parsingError && <pre>{parsingError.message}</pre>}
		</>
	);
}

const numberClassNames = "text-right font-mono tracking-wider";
const cellClassNames = "py-1 px-3";

const BalanceSheetTable = ({ report }: { report: BalanceSheetReport }) => {
	console.log({ report });
	return (
		<div className="container m-auto">
			<h1 className="text-center text-3xl font-bold my-4">
				{report.ReportName}
			</h1>
			<table className="table-auto border-collapse m-auto my-8">
				<caption className="caption-bottom whitespace-nowrap">
					{report.ReportTitles.join(" / ")}
				</caption>
				{report.Rows.map((row, rowIndex) => (
					// biome-ignore lint/suspicious/noArrayIndexKey: Rendering table
					<TopLevelRow key={rowIndex} row={row} />
				))}
			</table>
		</div>
	);
};

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
					<th key={cell.Value} className={twJoin(cellClassNames, "pb-3")}>
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
				// biome-ignore lint/suspicious/noArrayIndexKey: Rendering table
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
				<td
					// biome-ignore lint/suspicious/noArrayIndexKey: Rendering table
					key={cellIndex}
					className={twJoin(
						cellClassNames,
						cellIndex === 0 && "text-blue-200",
						cellIndex > 0 && numberClassNames,
						cellIndex > 0 && cell.Value.substring(0, 1) === "-"
							? "text-red-300"
							: "text-yellow-300",
					)}
				>
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
				<td
					// biome-ignore lint/suspicious/noArrayIndexKey: Rendering table
					key={cellIndex}
					className={twJoin(
						cellClassNames,
						"font-extrabold pb-8",
						cellIndex > 0 && numberClassNames,
						cell.Value.substring(0, 1) === "-" && "text-red-500",
					)}
				>
					{cell.Value}
				</td>
			))}
		</tr>
	);
};

export default App;
