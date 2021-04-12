var BallotBDE = artifacts.require("../contracts/BallotBDE.sol");
let misc = require("../ballot-utils");

module.exports = async function(deployer) {
  deployer.deploy(BallotBDE,1718240099,1718245099,true,'0x41746c61730000000000000000000000');
};
