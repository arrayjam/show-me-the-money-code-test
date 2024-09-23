export async function fetchBalanceSheet() {
	const response = await fetch("/api/balance-sheet");
	return response.json();
}
