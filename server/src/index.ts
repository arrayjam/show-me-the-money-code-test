import { join } from "node:path";
import { serve } from "bun";

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
	return Response.json(balanceSheetJSON);
}
