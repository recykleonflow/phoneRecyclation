import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
require("dotenv").config();

type HttpNetworkAccountUserConfig = any;
const config: HardhatUserConfig = {
  solidity: "0.8.18",
  networks: {
    alfajores: {
      url: "https://alfajores-forno.celo-testnet.org",
      accounts: [process.env.PRIVATE_KEY] as HttpNetworkAccountUserConfig | undefined,
      chainId: 44787,
    }
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY
  }
};

export default config;
