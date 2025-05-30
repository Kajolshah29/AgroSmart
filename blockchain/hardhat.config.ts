import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.28",
  networks: {
    mumbai: {
      url: process.env.MUMBAI_RPC_URL,   // <--- your public Mumbai RPC
      accounts: process.env.PRIVATE_Key,
      chainId: 80001,   // Mumbai Testnet Chain ID
    },
  },
};

export default config;
