# 🌾 AgroSmart

> **Empowering Rural Farmers through Technology and Trust**

AgroSmart is a farmer-first digital agri-marketplace that connects rural farmers directly to buyers using secure UPI payments and blockchain-backed transaction logs, without the complexity of crypto wallets. Our platform features a multilingual AI chatbot and geo-tagged farm mapping to ensure accessibility and transparency for rural India.

---

## 🚀 Features

* 🤝 Direct farmer-to-buyer connection via UPI 
* 🔐 Blockchain-backed Razorpay for secure payments 
* 🗣 Multilingual AI Chatbot (Hindi, Hinglish, Gujarati, English)
* 🗺 Geo-tagging of farms with Leaflet.js
* ✅ No crypto wallets — simple, trust-based system
* 📜 Transparent transaction logs on Sepolia testnet *(In Progress)*

---

## 📺 Tech Stack

| Layer      | Technology                                                         |
| ---------- | ------------------------------------------------------------------ |
| Frontend   | Next.js (TypeScript), Tailwind CSS                                 |
| Backend    | Node.js, Express.js                                                |
| Database   | MongoDB                                                            |
| AI / NLP   | Hugging Face (multilingual bot)                          
| Payments   | Razorpay UPI Integration (Sandbox) *(In Progress)*                 |
| Mapping    | Leaflet.js                                                         |
| Blockchain | Solidity Smart Contracts on Sepolia Testnet *(In Progress)* |

---

## 🏦 Project Structure

```bash
AgroSmart/
├── frontend/             # Next.js Frontend
├── backend/              # Express.js Backend API
├── blockchain/            # Solidity Smart Contracts
└── README.md             # This file
```

---
for clear view check Website Img folder
<img width="2848" alt="Frame 1" src="https://github.com/user-attachments/assets/0e2e7412-5b30-4c98-a773-443ece8610a3" />
<img width="4159" alt="Frame 3" src="https://github.com/user-attachments/assets/407c162b-b53c-4f08-8196-4a08804a466a" />
<img width="4159" alt="Frame 3" src="https://github.com/user-attachments/assets/526e841f-d912-4fa2-9105-55f804ccf750" />
<img width="4159" alt="Frame 3" src="https://github.com/user-attachments/assets/11309830-d840-471e-a0bd-520947c2d4bf" />


## ⚙️ Installation

### Prerequisites

* Node.js (v18+)
* MongoDB (Atlas / Local)
* Razorpay Account (Sandbox Key)
* Sepolia Mumbai Faucet account (for Testnet Ether)

### Setup Instructions

1. **Clone the repository**

   ```bash
   git clone https://github.com/Kajolshah29/AgroSmart.git
   cd AgroSmart
   ```

2. **Frontend Setup**

   ```bash
   cd frontend
   npm install
   npm run dev
   ```

3. **Backend Setup**

   ```bash
   cd backend
   npm install
   npm run dev
   ```


4. **Smart Contract Deployment**

   * Deploy using Hardhat to Sepolia Testnet.
   * Update `CONTRACT_ADDRESS` in the backend `.env`.

5. **Environment Variables**

   Create a `.env` file in `/backend`:

   ```env
   MONGO_URI=your_mongo_uri_here
   RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_secret
   CONTRACT_ADDRESS=your_deployed_contract_address
   SEPOLIA_RPC_URL=your_sepolia_rpc_url
   PRIVATE_KEY=your_wallet_private_key
   ```

---

## 💻 Usage

* Open `http://localhost:3000` for the frontend.
* Chatbot auto-starts on the homepage for farmer queries.
* Payment Razorpay Sandbox *(In Progress)*.
* Delivery confirmation triggers payment release via backend and logs it to blockchain *(In Progress)*.

---

## 🥮 Testing

* Use Razorpay UPI sandbox apps for fake UPI IDs.
* Sepolia Testnet for blockchain transactions.

---

Team AgroSmart
  
