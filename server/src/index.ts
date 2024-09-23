import { join } from "node:path";
import { type Serve, type Server, serve } from "bun";
import { BalanceSheetSchema, parseBalanceSheet } from "../../common/src";

type ServerConfig = {
	balanceSheetURL: string;
	port: number;
};

const config: ServerConfig = {
	balanceSheetURL: "http://localhost:8091/api.xro/2.0/Reports/BalanceSheet",
	port: 3000,
};

serve(createServer(config));

console.log(`Listening on http://localhost:${config.port}`);

export function createServer(config: ServerConfig): Serve {
	return {
		port: config.port,
		fetch(req) {
			const pathname = new URL(req.url).pathname;

			// API Routes
			if (pathname === "/api/balance-sheet") {
				return fetchBalanceSheet(config.balanceSheetURL);
			}

			// Serving frontend files in production with built Vite
			if (process.env.NODE_ENV === "production") {
				return serveStaticFile(pathname);
			}

			// In development, the Vite dev server will handle the request
			return new Response("Not found", { status: 404 });
		},
	};
}

async function fetchBalanceSheet(url: string) {
	const balanceSheetResponse = await fetch(url);
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

async function serveStaticFile(pathname: string) {
	// We serve static files from the built Vite project
	const filePath = join(import.meta.dir, "../../frontend/dist", pathname);
	const file = Bun.file(filePath);
	return new Response(file);
}
