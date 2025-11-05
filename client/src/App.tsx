import "./App.css";
import { FaucetCard } from "./components/FaucetCard";
import { HistoryCard } from "./components/HistoryCard";
import { InfoCard } from "./components/InfoCard";

function App() {
  return (
    <div className="app">
      <header className="hero">
        <div className="hero-content">
          <span className="hero-badge">X Layer Testnet</span>
          <h1>USDC Faucet</h1>
          <p>
            Top up your OKX X Layer Testnet wallet with test USDC for
            DApp development, QA, and demo showcase.
          </p>
          <div className="hero-links">
            <a
              href="https://web3.okx.com/xlayer"
              target="_blank"
              rel="noopener noreferrer"
              className="hero-link"
            >
              About X Layer
            </a>
            <a
              href="https://www.oklink.com/x-layer-testnet/token/0xcb8bf24c6ce16ad21d707c9505421a17f2bec79d"
              target="_blank"
              rel="noopener noreferrer"
              className="hero-link"
            >
              Test USDC on OKLINK
            </a>
          </div>
        </div>
      </header>

      <main className="main-container">
        <FaucetCard />

        <InfoCard />

        <HistoryCard />
      </main>

      <footer className="footer">
        <div className="footer-content">
          <p>
            © {new Date().getFullYear()}. A project from{' '}
            <a
              href="https://x.com/NuwaDev"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-title"
            >
              Nuwa AI
            </a>
            . Built with ❤️.
          </p>
          <ul className="footer-links">
            <li>
              <a
                href="https://nuwa.dev/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Website
              </a>
            </li>
            <li>
              <a
                href="https://github.com/nuwa-protocol/"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </a>
            </li>
            <li>
              <a
                href="https://x.com/NuwaDev"
                target="_blank"
                rel="noopener noreferrer"
              >
                X (Twitter)
              </a>
            </li>
            <li>
              <a
                href="https://discord.com/invite/nuwaai"
                target="_blank"
                rel="noopener noreferrer"
              >
                Discord
              </a>
            </li>
          </ul>
        </div>
      </footer>
    </div>
  );
}

export default App;
