var BallotBDE = artifacts.require("../contracts/BallotBDE.sol");
let misc = require("../ballot-utils");

module.exports = async function(deployer) {
  deployer.deploy(BallotBDE);
};
