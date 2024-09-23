export async function fetchBalanceSheet() {
	const response = await fetch("/api/balance-sheet");
	if (!response.ok) {
		throw new Error(`HTTP Error. Status: ${response.status}`);
	}
	return response.json();
}
