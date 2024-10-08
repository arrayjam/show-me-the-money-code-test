import {
	type BalanceSheet,
	parseBalanceSheet,
} from "@show-me-the-money-code-test/common";
import { useEffect, useState } from "react";
import { fetchBalanceSheet } from "../services/balanceSheetService";

export function useBalanceSheet(
	fetchers: {
		fetchBalanceSheet: () => Promise<BalanceSheet>;
	} = { fetchBalanceSheet: fetchBalanceSheet },
) {
	const [balanceSheet, setBalanceSheet] = useState<BalanceSheet | null>(null);
	const [parsingError, setParsingError] = useState<Error | null>(null);

	useEffect(() => {
		async function loadBalanceSheet() {
			try {
				const balanceSheetJSON = await fetchers.fetchBalanceSheet();
				const parsedBalanceSheet = parseBalanceSheet(balanceSheetJSON);
				setBalanceSheet(parsedBalanceSheet);
			} catch (error) {
				setParsingError(error as Error);
			}
		}
		loadBalanceSheet();
	}, [fetchers.fetchBalanceSheet]);

	return { balanceSheet, parsingError };
}
