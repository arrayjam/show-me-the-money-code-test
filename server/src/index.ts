import { join } from "node:path";
import type { BalanceSheet } from "@show-me-the-money-code-test/common";
import { type Serve, serve } from "bun";
import { fetchBalanceSheet } from "./fetchBalanceSheet";

type ServerConfig = {
	balanceSheetURL: string;
	port: number;
};

const config: ServerConfig = {
	balanceSheetURL: "http://localhost:8091/api.xro/2.0/Reports/BalanceSheet",
	port: 3000,
};

serve(createServer(config, { balanceSheetFetchFn: fetchBalanceSheet }));

console.log(`Listening on http://localhost:${config.port}`);

export function createServer(
	config: ServerConfig,
	fetchers: { balanceSheetFetchFn: (url: string) => Promise<BalanceSheet> },
): Serve {
	return {
		port: config.port,
		async fetch(req) {
			const pathname = new URL(req.url).pathname;

			// API Routes
			if (pathname === "/api/balance-sheet") {
				return Response.json(
					await fetchers.balanceSheetFetchFn(config.balanceSheetURL),
				);
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

async function serveStaticFile(pathname: string) {
	// We serve static files from the built Vite project
	const filePath = join(import.meta.dir, "../../frontend/dist", pathname);
	const file = Bun.file(filePath);
	return new Response(file);
}
