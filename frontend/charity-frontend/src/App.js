
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import contractABI from "./contract/CharityDonation.json";
import { CONTRACT_ADDRESS } from "./contract/contractAddress.js";
import "./App.css";

import { JsonRpcProvider } from 'ethers';

// Connect to the Ethereum network
const provider = new JsonRpcProvider("https://eth-sepolia.g.alchemy.com/v2/Im8tgIEiAH94_X33F1Ryo5BMtLb-wbXE");

// Get block by number
const blockNumber = "latest";
const block = await provider.getBlock(blockNumber);

console.log(block);

function App() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [amount, setAmount] = useState("");
  const [donations, setDonations] = useState([]);

  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        try {
          // Request account access
          await window.ethereum.request({ method: "eth_requestAccounts" });
  
          const provider = new ethers.BrowserProvider(window.ethereum);
          const signer = await provider.getSigner();
          const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI.abi, signer);
  
          setProvider(provider);
          setSigner(signer);
          setContract(contract);
  
          loadDonations(contract);
        } catch (error) {
          console.error("Error connecting to MetaMask:", error);
          alert("Failed to connect to MetaMask. Please try again.");
        }
      } else {
        alert("Please install MetaMask!");
      }
    };
    init();
  }, []);

  const donate = async () => {
    if (!amount || !contract) return;
    const tx = await contract.donate({ value: ethers.parseEther(amount) });
    await tx.wait();
    loadDonations(contract);
    setAmount("");
  };

  const loadDonations = async (contract) => {
    const donations = await contract.getDonations();
    setDonations(donations.map((d) => ({ donor: d.donor, amount: ethers.formatEther(d.amount) })));
  };

  return (
    <div className="App">
      <header>
        <h1>Charity Donation DApp</h1>
        <p>Support a cause by donating ETH on the blockchain!</p>
      </header>

      <main>
        <section>
          <h2>Make a Donation</h2>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Amount in ETH"
          />
          <button onClick={donate}>Donate</button>
        </section>

        <section>
          <h2>Total Donations</h2>
          <p>
            <strong>
              {donations.reduce((total, d) => total + parseFloat(d.amount), 0).toFixed(2)} ETH
            </strong>
          </p>
        </section>

        <section>
          <h2>All Donations</h2>
          {donations.length > 0 ? (
            <ul>
              {donations.map((d, idx) => (
                <li key={idx}>
                  <strong>Donor:</strong> {d.donor} - <strong>Amount:</strong> {d.amount} ETH
                </li>
              ))}
            </ul>
          ) : (
            <p>No donations yet. Be the first to donate!</p>
          )}
        </section>
      </main>

      <footer>
        <p>Powered by Ethereum Blockchain | Built with ❤️ by Charity Donation App</p>
      </footer>
    </div>
  );
}

export default App;

