import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const ProductModule = buildModule("ProductModule", (m) => {
  const productRegistry = m.contract("ProductRegistry");
  const transactionLog = m.contract("TransactionLog");
  return { productRegistry, transactionLog };
});

export default ProductModule;
