import { ethers } from "ethers";
import ProductRegistry from "../abis/ProductRegistry.json"; // after deploying contract ABI

// Make sure your NEXT_PUBLIC env is loaded
const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();
const contractAddress = process.env.NEXT_PUBLIC_PRODUCT_CONTRACT_ADDRESS; // <--- set this in .env.local
const contract = new ethers.Contract(contractAddress, ProductRegistry.abi, signer);

export async function addProductOnChain({
  name,
  price,
  unit,
  isOrganic,
}: {
  name: string;
  price: number;
  unit: string;
  isOrganic: boolean;
}) {
  try {
    const tx = await contract.addProduct(name, price, unit, isOrganic);
    await tx.wait();
    console.log("✅ Product added successfully on blockchain.");
  } catch (error) {
    console.error("❌ Error adding product:", error);
    throw error;
  }
}
