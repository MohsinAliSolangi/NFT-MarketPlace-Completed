require("@nomiclabs/hardhat-waffle");

module.exports = {
  networks: {
    hardhat: {
    },
    goerli: {
      url: "https://eth-goerli.g.alchemy.com/v2/j0MMbBOrmZmaqGwY81ztrumG-SERiDm7",
      accounts: ["c74ea6bf6eb56cf2df79932c45d05cb9666613cfffb95495432403e4db706043"]
    }
  },
  solidity: "0.8.4",
  paths: {
    artifacts: "./src/backend/artifacts",
    sources: "./src/backend/contracts",
    cache: "./src/backend/cache",
    tests: "./src/backend/test"
  },
};
