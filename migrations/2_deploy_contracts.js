var BallotBDE = artifacts.require("../contracts/BallotBDE.sol");

module.exports = async function(deployer) {
  deployer.deploy(BallotBDE);
};
