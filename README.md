# 🌾 AgriSmart

> **Empowering Rural Farmers through Technology and Trust**

AgriSmart is a farmer-first digital agri-marketplace that connects rural farmers directly to buyers using secure UPI payments and blockchain-backed transaction logs — without the complexity of crypto wallets. Our platform features a multilingual AI chatbot and geo-tagged farm mapping to ensure accessibility and transparency for rural India.

---

## 🚀 Features

* 🤝 Direct farmer-to-buyer connection via UPI
* 🔐 Blockchain-backed escrow for secure payments
* 🗣 Multilingual AI Chatbot (Hindi, Hinglish, Gujarati, English)
* 🗺 Geo-tagging of farms with Leaflet.js
* ✅ No crypto wallets — simple, trust-based system
* 📜 Transparent transaction logs on Polygon testnet

---

## 📺 Tech Stack

| Layer      | Technology                                         |
| ---------- | -------------------------------------------------- |
| Frontend   | Next.js (TypeScript), Tailwind CSS                 |
| Backend    | Node.js, Express.js                                |
| Database   | MongoDB                                            |
| AI / NLP   | Rasa NLU + BERT (multilingual support)             |
| Payments   | Razorpay UPI Integration (Sandbox)                 |
| Mapping    | Leaflet.js                                         |
| Blockchain | Solidity Smart Contracts on Polygon Mumbai Testnet |

---

## 🏦 Project Structure

```bash
AgriSmart/
├── frontend/             # Next.js Frontend
├── backend/              # Express.js Backend API
├── blockchain/            # Solidity Smart Contracts
├── rasa-bot/             # Rasa NLU AI Chatbot
└── README.md             # This file
```

---

## ⚙️ Installation

### Prerequisites

* Node.js (v18+)
* MongoDB (Atlas / Local)
* Razorpay Account (Sandbox Key)
* Polygon Mumbai Faucet account (for Testnet Ether)
* Python 3.8+ (for Rasa NLU)

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

4. **Rasa Chatbot Setup**

   ```bash
   cd rasa-bot
   pip install -r requirements.txt
   rasa train
   rasa run --enable-api --cors "*"
   ```

5. **Smart Contract Deployment**

   * Deploy using Hardhat or Truffle to Mumbai Testnet.
   * Update `CONTRACT_ADDRESS` in the backend `.env`.

6. **Environment Variables**

   Create a `.env` file in `/backend`:

   ```env
   MONGO_URI=your_mongo_uri_here
   RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_secret
   CONTRACT_ADDRESS=your_deployed_contract_address
   MUMBAI_RPC_URL=your_mumbai_rpc_url
   PRIVATE_KEY=your_wallet_private_key
   ```

---

## 💻 Usage

* Open `http://localhost:3000` for the frontend.
* Chatbot auto-starts on the homepage for farmer queries.
* Payment escrow via Razorpay Sandbox.
* Delivery confirmation triggers payment release via backend and logs it to blockchain.

---

## 🥮 Testing

* Use Razorpay UPI sandbox apps for fake UPI IDs.
* Polygon Mumbai Testnet for blockchain transactions.
* Rasa NLU can be tested using `/model/parse` endpoint.

---

## 🖼️ Screenshots

|     Home Interface     |        Payment Sandbox       |           Blockchain Logs          |          AI Chatbot          |       Map View       |
| :--------------------: | :--------------------------: | :--------------------------------: | :--------------------------: | :------------------: |
| ![Home](docs/home.png) | ![Payment](docs/payment.png) | ![Blockchain](docs/blockchain.png) | ![Chatbot](docs/chatbot.png) | ![Map](docs/map.png) |

---

## 📈 Roadmap

* [ ] Production Razorpay UPI integration
* [ ] Offline Chatbot Support (Voice)
* [ ] Expand to Dairy/Fisheries sectors
* [ ] Integration with Govt. eNAM platform
* [ ] Deploy on Vercel / AWS

---

## 🤝 Contributing

Contributions, issues and feature requests are welcome!

```bash
Fork > Clone > Commit > Push > Pull Request
```

Please check [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

---

## 📜 License

[MIT](LICENSE)

---

## 📨 Contact

* Team AgriSmart
* [LinkedIn](#) | [Email](mailto:team@agrismart.in) | [Website](#)
