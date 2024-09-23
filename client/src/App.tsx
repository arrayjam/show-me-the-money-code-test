import { BalanceSheetTable } from "./components/BalanceSheetTable";
import { useBalanceSheet } from "./hooks/useBalanceSheet";

function App() {
	const { balanceSheet, parsingError } = useBalanceSheet();

	return (
		<>
			{balanceSheet?.Reports.map((report) => (
				<BalanceSheetTable key={report.ReportID} report={report} />
			))}

			{/* {balanceSheet && <pre>{JSON.stringify(balanceSheet, null, 2)}</pre>} */}
			{parsingError && <pre>{parsingError.message}</pre>}
		</>
	);
}

export default App;
