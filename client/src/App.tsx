import {
	type BalanceSheet,
	parseBalanceSheet,
} from "@show-me-the-money-code-test/common";

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
			{balanceSheet && <pre>{JSON.stringify(balanceSheet, null, 2)}</pre>}
			{parsingError && <pre>{parsingError.message}</pre>}
		</>
	);
}

export default App;
