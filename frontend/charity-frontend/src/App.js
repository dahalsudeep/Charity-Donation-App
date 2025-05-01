
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import contractABI from "./contract/CharityDonation.json";
import { CONTRACT_ADDRESS } from "./contract/contractAddress.js";

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
      <h1>Charity Donation DApp</h1>
      <input value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Amount in ETH" />
      <button onClick={donate}>Donate</button>
      <h2>All Donations</h2>
      <ul>
        {donations.map((d, idx) => (
          <li key={idx}>{d.donor} - {d.amount} ETH</li>
        ))}
      </ul>
    </div>
  );
}

export default App;

