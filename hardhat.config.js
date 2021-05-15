module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.4"
      }
    ]
  },
  paths: {
    sources : "./contracts"
  },
  namedAccounts:{
    deployer: {
      default: 0
    }
  },
  networks: {
    hardhat: {
      accounts: {
        mnemonic: "clutch captain shoe salt awake harvest setup primary inmate ugly among become"
      }
    }
  }
}
