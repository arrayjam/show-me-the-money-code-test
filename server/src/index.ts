import { join } from "node:path";
import { serve } from "bun";
import { BalanceSheetSchema, parseBalanceSheet } from "../../common/src";

const config = {
	balanceSheetURL: "http://localhost:8091/api.xro/2.0/Reports/BalanceSheet",
	port: 3000,
};

serve({
	port: config.port,
	fetch(req) {
		const pathname = new URL(req.url).pathname;

		if (pathname === "/api/balance-sheet") {
			return fetchBalanceSheet();
		}

		// Serving frontend files in production with built Vite
		if (process.env.NODE_ENV === "production") {
			const filePath = join(import.meta.dir, "../../frontend/dist", pathname);
			const file = Bun.file(filePath);
			return new Response(file);
		}

		// In development, the Vite dev server will handle the request
		return new Response("Not found", { status: 404 });
	},
});

console.log(`Listening on http://localhost:${config.port}`);

async function fetchBalanceSheet() {
	const balanceSheetResponse = await fetch(config.balanceSheetURL);
	const balanceSheetJSON = await balanceSheetResponse.json();

	// Parse the Balance Sheet JSON with valibot so that we have typed runtime data
	const parsedBalanceSheet = parseBalanceSheet(balanceSheetJSON);

	// // Now we can access this data in a typed way, e.g.
	// const titles = parsedBalanceSheet.Reports.map((report) => {
	// 	return report.ReportTitles.join(", ");
	// });

	// console.log({ titles });

	return Response.json(parsedBalanceSheet);
}
