import * as v from "valibot";

const RowTypeHeader = v.strictObject({
	RowType: v.literal("Header"),
	Cells: v.array(
		v.strictObject({
			Value: v.string(),
		}),
	),
});

const RowTypeRow = v.strictObject({
	RowType: v.literal("Row"),
	Cells: v.array(
		v.strictObject({
			Value: v.string(),
			// Attributies are optional
			Attributes: v.optional(
				v.array(
					v.strictObject({
						Value: v.string(),
						Id: v.string(),
					}),
				),
			),
		}),
	),
});

const RowTypeSummaryRow = v.strictObject({
	RowType: v.literal("SummaryRow"),
	Cells: v.array(
		v.strictObject({
			Value: v.string(),
		}),
	),
});

// Rows in Sections can contain Rows or Summary Rows
const SectionContentsRow = v.union([RowTypeRow, RowTypeSummaryRow]);

const RowTypeSection = v.strictObject({
	RowType: v.literal("Section"),
	Title: v.string(),
	Rows: v.array(SectionContentsRow),
});

const RowTypeAll = v.union([
	RowTypeHeader,
	RowTypeSection,
	RowTypeRow,
	RowTypeSummaryRow,
]);

const TopLevelRow = v.union([RowTypeHeader, RowTypeSection]);

export const BalanceSheetSchema = v.strictObject({
	Status: v.literal("OK"),
	Reports: v.array(
		v.strictObject({
			ReportID: v.string(),
			ReportName: v.string(),
			ReportType: v.literal("BalanceSheet"),
			ReportTitles: v.array(v.string()),
			ReportDate: v.string(),
			UpdatedDateUTC: v.string(),
			Fields: v.array(
				v.strictObject({
					FieldID: v.string(),
					Description: v.string(),
					Value: v.string(),
				}),
			),

			// Balance Sheets can contain Headers and Sections
			Rows: v.array(TopLevelRow),
		}),
	),
});

export type BalanceSheet = v.InferOutput<typeof BalanceSheetSchema>;
export type BalanceSheetRowAll = v.InferOutput<typeof RowTypeAll>;
export type BalanceSheetTopLevelRow = v.InferOutput<typeof TopLevelRow>;
export type BalanceSheetHeaderRow = v.InferOutput<typeof RowTypeHeader>;
export type BalanceSheetSectionRow = v.InferOutput<typeof RowTypeSection>;
export type BalanceSheetSectionRowContents = v.InferOutput<
	typeof SectionContentsRow
>;
export type BalanceSheetRow = v.InferOutput<typeof RowTypeRow>;
export type BalanceSheetSummaryRow = v.InferOutput<typeof RowTypeSummaryRow>;

export function parseBalanceSheet(inputJSON: unknown): BalanceSheet {
	const result = v.safeParse(BalanceSheetSchema, inputJSON, {
		abortPipeEarly: true,
	});
	if (result.success) {
		return result.output;
	}

	// Show the path of the parse error
	console.log(result.issues[0].path?.map((p) => p.key));
	throw new Error("Failed to parse Balance Sheet Schema");
}
