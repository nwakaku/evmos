import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const MNEMONIC = process.env.MNEMONIC || "mnemonic"
const MATICMUM_RPC_URL = process.env.MATICMUM_RPC_URL || "https://rpc-mumbai.maticvigil.com"
const EVMOS_RPC_URL = process.env.EVMOS_RPC_URL || "https://eth.bd.evmos.org:8545"
const TESTNET_EVMOS_RPC_URL = process.env.TESTNET_EVMOS_RPC_URL || "https://eth.bd.evmos.dev:8545"
const POLYGONSCAN_API_KEY = process.env.POLYGONSCAN_API_KEY || "PolygonScan API key"
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || "Etherscan API key"
const config: HardhatUserConfig = {
  solidity: "0.8.13",
  networks: {
    maticmum: {
      chainId: 80001,
      url: MATICMUM_RPC_URL,
      accounts: {
        mnemonic: MNEMONIC,
      },
    },
    evmos: {
      chainId: 9001,
      url: EVMOS_RPC_URL,
      accounts: {
        mnemonic: MNEMONIC,
      },
    },
    tevmos: {
      chainId: 9000,
      url: TESTNET_EVMOS_RPC_URL,
      accounts: {
        mnemonic: MNEMONIC,
      },
    },
  },
  etherscan: {
    apiKey: POLYGONSCAN_API_KEY || ETHERSCAN_API_KEY,
  },
};

export default config;
