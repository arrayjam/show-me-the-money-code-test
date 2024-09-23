import { serve } from "bun";
import { config, createServer } from "./createServer";
import { fetchBalanceSheet } from "./fetchBalanceSheet";

serve(createServer(config, { balanceSheetFetchFn: fetchBalanceSheet }));

console.log(`Listening on http://localhost:${config.port}`);
