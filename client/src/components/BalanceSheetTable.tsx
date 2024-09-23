import type {
	BalanceSheetHeaderRow,
	BalanceSheetReport,
	BalanceSheetRow,
	BalanceSheetSectionRow,
	BalanceSheetSectionRowContents,
	BalanceSheetSummaryRow,
	BalanceSheetTopLevelRow,
} from "@show-me-the-money-code-test/common";
import type { FC } from "react";
import { twJoin } from "tailwind-merge";

const numberClassNames = "text-right font-mono tracking-wider";
const cellClassNames = "py-1 px-3";

export type BalanceSheetTableProps = {
	report: BalanceSheetReport;
};

export const BalanceSheetTable: FC<BalanceSheetTableProps> = ({ report }) => {
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
						cellIndex > 0 && stringValueIsNegative(cell.Value)
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
						stringValueIsNegative(cell.Value) && "text-red-500",
					)}
				>
					{cell.Value}
				</td>
			))}
		</tr>
	);
};

function stringValueIsNegative(value: string) {
	return value.substring(0, 1) === "-";
}
