require("@nomiclabs/hardhat-waffle");
//require('hardhat-abi-exporter');
require('dotenv').config({path: __dirname+'/.env'})
require("@nomiclabs/hardhat-etherscan");
require('hardhat-contract-sizer');


module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 31337,
      gasPrice: 225000000000,
    },
    goerli: {
      url:`https://eth-goerli.g.alchemy.com/v2/${process.env.ALCHEMY_API}`,
      accounts: [`0x${process.env.privateKey}`],
    },
    testnet: {
      url: "https://data-seed-prebsc-1-s1.binance.org:8545/",
      chainId: 97,
      gasPrice: 21000000000,
      accounts: [`0x${process.env.privateKey}`],
    },
    mainnet: {
      url: `https://eth-mainnet.alchemyapi.io/v2/${process.env.ALCHEMY_API}`,
      accounts: [`0x${process.env.privateKey}`],
    },
  },
  solidity: "0.8.4",
  paths: {
    artifacts: "./src/backend/artifacts",
    sources: "./src/backend/contracts",
    cache: "./src/backend/cache",
    tests: "./src/backend/test"
  },
  // ethernal: {
  //   email: process.env.ETHERNAL_EMAIL,
  //   password: process.env.ETHERNAL_PASSWORD,
  //   },
  // contractSizer: {
  //   alphaSort: true,
  //   disambiguatePaths: false,
  //   runOnCompile: true,
  //   strict: true,
  //   only: [':NFT$',':Marketplace$'],
  // },

  // abiExporter: {
  //   path: '.././Frontend/src/contractsData/',
  //   runOnCompile: true,
  //   clear: true,
  //   only: [':NFT$',':Marketplace$'],
  //   flat: true,
  //   spacing: 2,
  //   pretty: true,
  // },
  etherscan: {
    // Your API key for Etherscan
    // Obtain one at https://etherscan.io/
    apiKey: "22MHMTIFKT66EPTSEMM8FK9IXEPKTYEXXE"
  },
  mocha: {
    timeout: 1000000
  }
};
// npx hardhat verify --constructor-args ./arguments.js --network rinkeby 0x8Eb6B4D40D35243352aBAD59BFDB27a161F3Bdc1
//npx hardhat verify --network rinkeby 0x8Eb6B4D40D35243352aBAD59BFDB27a161F3Bdc1 "0x3B2FA3fB4c7eD3bC495F276DC60782b635bB04d9" "0x3B2FA3fB4c7eD3bC495F276DC60782b635bB04d9"