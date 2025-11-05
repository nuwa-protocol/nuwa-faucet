// Format address: show first 6 and last 4 characters
export const formatAddress = (address: string): string => {
	if (!address) return "";
	return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

// Format time
export const formatTime = (dateString: string): string => {
	if (!dateString) return "-";
	const date = new Date(dateString);
	if (isNaN(date.getTime())) return "-";
	return date.toLocaleString("en-US", {
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
	});
};

// Format countdown
export const formatCountdown = (targetDate: string): string => {
	if (!targetDate) return "Available now";

	const now = new Date().getTime();
	const target = new Date(targetDate).getTime();

	if (isNaN(target)) return "Available now";

	const diff = target - now;

	if (diff <= 0) return "Available now";

	const hours = Math.floor(diff / (1000 * 60 * 60));
	const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

	if (hours > 0) {
		return `${hours}h ${minutes}m`;
	}
	return `${minutes}m`;
};

const explorerBases: { [key: number]: string } = {
	1: "https://etherscan.io",
	5: "https://goerli.etherscan.io",
	11155111: "https://sepolia.etherscan.io",
	137: "https://polygonscan.com",
	195: "https://web3.okx.com/explorer/x-layer-testnet",
	196: "https://web3.okx.com/explorer/x-layer",
	80001: "https://mumbai.polygonscan.com",
	42161: "https://arbiscan.io",
	421614: "https://sepolia.arbiscan.io",
	8453: "https://basescan.org",
	84532: "https://sepolia.basescan.org",
	1952: "https://www.oklink.com/x-layer-testnet/",
};

const getExplorerBase = (chainId: number): string =>
	explorerBases[chainId] || "https://etherscan.io";

// Get blockchain explorer link for a transaction hash
export const getExplorerUrl = (txHash: string, chainId: number): string => {
	return `${getExplorerBase(chainId)}/tx/${txHash}`;
};

// Get blockchain explorer link for an address
export const getExplorerAddressUrl = (
	address: string,
	chainId: number,
): string => {
	return `${getExplorerBase(chainId)}/address/${address}`;
};
