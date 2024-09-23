import { parseBalanceSheet } from "@show-me-the-money-code-test/common";

export async function fetchBalanceSheet(url: string, fetchFn = fetch) {
	try {
		const balanceSheetResponse = await fetchFn(url);
		if (!balanceSheetResponse.ok) {
			throw new Error(`HTTP Error. Status: ${balanceSheetResponse.status}`);
		}
		const balanceSheetJSON = await balanceSheetResponse.json();

		// Parse the Balance Sheet JSON with valibot so that we have typed runtime data
		const parsedBalanceSheet = parseBalanceSheet(balanceSheetJSON);

		// // Now we can access this data in a typed way, e.g.
		// const titles = parsedBalanceSheet.Reports.map((report) => {
		// 	return report.ReportTitles.join(", ");
		// });

		// console.log({ titles });

		return parsedBalanceSheet;
	} catch (error) {
		throw new Error(`Error fetching balance sheet: ${error}`);
	}
}
