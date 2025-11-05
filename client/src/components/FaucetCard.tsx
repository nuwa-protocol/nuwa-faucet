import { useEffect, useState } from "react";
import { faucetApi } from "../services/api";
import type { ClaimStatus, FaucetInfo } from "../types";
import { formatCountdown, getExplorerUrl } from "../utils/format";

const formatTokenAmount = (amount?: string | number | null): string => {
  if (amount === null || amount === undefined) return "0";

  let numericAmount: number | null = null;

  if (typeof amount === "number") {
    numericAmount = amount;
  } else if (typeof amount === "string") {
    numericAmount = Number(amount);
  }

  if (numericAmount === null || Number.isNaN(numericAmount)) {
    return String(amount);
  }

  const integerAmount = Math.trunc(numericAmount);
  return integerAmount.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
};

export const FaucetCard = () => {
  const [address, setAddress] = useState<string>("");
  const [faucetInfo, setFaucetInfo] = useState<FaucetInfo | null>(null);
  const [claimStatus, setClaimStatus] = useState<ClaimStatus | null>(null);
  const [isClaiming, setIsClaiming] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error" | "warning";
    text: string;
  } | null>(null);
  const [countdown, setCountdown] = useState<string>("");
  const [txHash, setTxHash] = useState<string>("");

  // Load faucet information
  useEffect(() => {
    loadFaucetInfo();
  }, []);

  // Check claim status
  useEffect(() => {
    if (address && isValidAddress(address)) {
      checkClaimStatus();
      const interval = setInterval(checkClaimStatus, 10000); // Refresh every 10 seconds
      return () => clearInterval(interval);
    }
  }, [address]);

  // Update countdown
  useEffect(() => {
    if (claimStatus?.nextClaimTime) {
      updateCountdown();
      const interval = setInterval(updateCountdown, 1000);
      return () => clearInterval(interval);
    }
  }, [claimStatus?.nextClaimTime]);

  const loadFaucetInfo = async () => {
    try {
      const info = await faucetApi.getFaucetInfo();
      setFaucetInfo(info);
    } catch (error) {
      console.error("Load faucet info error:", error);
    }
  };

  const checkClaimStatus = async () => {
    if (!address || !isValidAddress(address)) return;

    try {
      const status = await faucetApi.checkCanClaim(address);
      setClaimStatus(status);
    } catch (error) {
      console.error("Check claim status error:", error);
    }
  };

  const updateCountdown = () => {
    if (!claimStatus?.nextClaimTime) return;
    setCountdown(formatCountdown(claimStatus.nextClaimTime));
  };

  const isValidAddress = (addr: string): boolean => {
    return /^0x[a-fA-F0-9]{40}$/.test(addr);
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newAddress = e.target.value.trim();
    setAddress(newAddress);
    setMessage(null);
  };

  const handleClaim = async () => {
    if (!address || !isValidAddress(address)) {
      setMessage({
        type: "error",
        text: "Please enter a valid Ethereum address",
      });
      return;
    }

    if (!claimStatus?.canClaim) {
      return;
    }

    setIsClaiming(true);
    setMessage(null);
    setTxHash("");

    try {
      const result = await faucetApi.claimTokens(address);

      if (result.success) {
        setMessage({
          type: "success",
          text: `You received ${formatTokenAmount(result.amount ?? faucetInfo?.amountPerClaim)} ${faucetInfo?.tokenSymbol || "USDC"} on X Layer Testnet.`,
        });
        setTxHash(result.txHash || "");
        checkClaimStatus();
        loadFaucetInfo();
      } else {
        setMessage({
          type: "error",
          text: result.message,
        });
        setTxHash("");
      }
    } catch (error: any) {
      setMessage({
        type: "error",
        text:
          error.response?.data?.message ||
          "Claim failed, please try again later",
      });
      setTxHash("");
    } finally {
      setIsClaiming(false);
    }
  };

  const canClaim = address && isValidAddress(address) && claimStatus?.canClaim;
  const explorerUrl =
    txHash && faucetInfo?.chainId
      ? getExplorerUrl(txHash, faucetInfo.chainId)
      : "";

  return (
    <div className="card faucet-card">
      <div className="card-header">
        <div>
          <h2 className="card-title">Claim Testnet USDC</h2>
          <p className="card-subtitle">
            Use your EVM-compatible testnet wallet address. One claim is available
            every {faucetInfo?.claimInterval?.toLowerCase() || "cooldown"}.
          </p>
        </div>
        {faucetInfo?.tokenLogo && (
          <img
            src={faucetInfo.tokenLogo}
            alt={`${faucetInfo.tokenSymbol} logo`}
            className="token-logo"
          />
        )}
      </div>

      <div className="faucet-form">
        <label htmlFor="wallet-address" className="input-label">
          Wallet address
        </label>
        <div className="input-group">
          <input
            id="wallet-address"
            type="text"
            className="input"
            value={address}
            onChange={handleAddressChange}
            placeholder="0x..."
            autoComplete="off"
            spellCheck={false}
          />
          <button
            className="btn btn-primary"
            onClick={handleClaim}
            disabled={!canClaim || isClaiming}
          >
            {isClaiming ? (
              <>
                <span className="loading"></span>
                Sending
              </>
            ) : (
              `Claim ${formatTokenAmount(faucetInfo?.amountPerClaim)} ${faucetInfo?.tokenSymbol || "USDC"}`
            )}
          </button>
        </div>

        {address && !isValidAddress(address) && (
          <div className="claim-status error">
            ❌ Enter a valid EVM address (starts with 0x, 42 characters)
          </div>
        )}

        {claimStatus && !claimStatus.canClaim && countdown && (
          <div className="claim-status warning">
            ⏰ This address has claimed from this faucet.Please try again in {countdown}.
          </div>
        )}

        {message && (
          <div className={`claim-status ${message.type}`}>
            <p>{message.text}</p>
            {message.type === "success" && explorerUrl && (
              <a
                href={explorerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="status-link"
              >
                View transaction on X Layer Explorer
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
