import { useEffect, useState } from "react";
import { faucetApi } from "../services/api";
import type { FaucetInfo } from "../types";
import { formatAddress, getExplorerAddressUrl } from "../utils/format";

export const InfoCard = () => {
  const [faucetInfo, setFaucetInfo] = useState<FaucetInfo | null>(null);

  useEffect(() => {
    loadFaucetInfo();
    const interval = setInterval(loadFaucetInfo, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const loadFaucetInfo = async () => {
    try {
      const info = await faucetApi.getFaucetInfo();
      setFaucetInfo(info);
    } catch (error) {
      console.error("Load faucet info error:", error);
    }
  };

  if (!faucetInfo) {
    return (
      <div className="card">
        <h2 className="card-title">Faucet Status</h2>
        <div className="empty-state">Loading...</div>
      </div>
    );
  }

  const balance = parseFloat(faucetInfo.tokenBalance);
  const isFunded = !Number.isNaN(balance) && balance > 0;

  return (
    <div className="card info-card">
      <div className="card-header">
        <div>
          <h2 className="card-title">Faucet Status</h2>
          <p className="card-subtitle">
            Live availability of Nuwa&apos;s X Layer Testnet dispenser.
          </p>
        </div>
        <div
          className={`status-pill ${isFunded ? "status-online" : "status-offline"}`}
        >
          <span className="status-indicator" aria-hidden="true"></span>
          {isFunded ? "Online" : "Needs refill"}
        </div>
      </div>

      <div className="info-grid">
        <div className="info-item">
          <div className="info-label">Faucet address</div>
          <div className="info-value">
            {formatAddress(faucetInfo.faucetAddress)}
          </div>
          <a
            className="info-link"
            href={getExplorerAddressUrl(
              faucetInfo.faucetAddress,
              faucetInfo.chainId,
            )}
            target="_blank"
            rel="noopener noreferrer"
          >
            View on explorer
          </a>
        </div>
        <div className="info-item">
          <div className="info-label">Faucet Balance</div>
          <div className="info-value">
            {Number.isNaN(balance)
              ? "-"
              : `${balance.toFixed(2)} ${faucetInfo.tokenSymbol}`}
          </div>
        </div>
        <div className="info-item">
          <div className="info-label">Claim interval</div>
          <div className="info-value">{faucetInfo.claimInterval}</div>
          <p className="info-helper">
            One wallet can submit a new request after the cooldown.
          </p>
        </div>
        <div className="info-item">
          <div className="info-label">Network</div>
          <div className="info-value">X Layer Testnet</div>
          <p className="info-helper">Chain ID {faucetInfo.chainId}</p>
        </div>
      </div>
    </div>
  );
};
