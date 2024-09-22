import { useEffect, useState } from "react";
import viteLogo from "/vite.svg";
import reactLogo from "./assets/react.svg";
import "./App.css";
import {
	type BalanceSheet,
	parseBalanceSheet,
} from "@show-me-the-money-code-test/common";

function App() {
	const [count, setCount] = useState(0);
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
			<div>
				<a href="https://vitejs.dev" target="_blank" rel="noreferrer">
					<img src={viteLogo} className="logo" alt="Vite logo" />
				</a>
				<a href="https://react.dev" target="_blank" rel="noreferrer">
					<img src={reactLogo} className="logo react" alt="React logo" />
				</a>
			</div>
			<h1>Vite + React</h1>
			<div className="card">
				<button type="button" onClick={() => setCount((count) => count + 1)}>
					count is {count}
				</button>
				<p>
					Edit <code>src/App.tsx</code> and save to test HMR
				</p>
			</div>
			<p className="read-the-docs">
				Click on the Vite and React logos to learn more
			</p>
		</>
	);
}

export default App;
