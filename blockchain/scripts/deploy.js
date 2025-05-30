const hre = require("hardhat");

async function main() {
  // Deploy TransactionLog Contract
  const TransactionLog = await hre.ethers.getContractFactory("TransactionLog");
  const transactionLog = await TransactionLog.deploy();
  await transactionLog.deployed();
  console.log("TransactionLog deployed to:", transactionLog.address);

  // Deploy ProductRegistry Contract
  const ProductRegistry = await hre.ethers.getContractFactory("ProductRegistry");
  const productRegistry = await ProductRegistry.deploy();
  await productRegistry.deployed();
  console.log("ProductRegistry deployed to:", productRegistry.address);
}

// Run the deployment
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
