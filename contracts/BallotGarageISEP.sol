// SPDX-License-Identifier: MIT

pragma solidity 0.8.4;

contract BallotGarageISEP {
    uint256 constant LEADING = 0;
    uint256 constant MEMBER  = 1;
    uint256 constant LEAVING  = 2;
    uint256 private constant ONE = 10 ** 18;
    address private owner;
    uint256 public startTime; /* 16 april 2021 10h CET - time before which no vote can be registered */
    uint256 public endTime; /* 16 april 2021 18h CET - time after which no vote can be registered anymore,
    based on unix epoch */
    bytes32[] public candidateNames; // = [bytes32("JFCope"), bytes32("Fillon"), bytes32("Vote blanc")];
    mapping (bytes32 => uint256[3]) public candidateScores;
    

    /* warning : if many candidates with the same name are sent, last one
    will overwrite the others */
    constructor(uint256 _startTime, uint256 _endTime, bytes32[] memory _candidateNames) {
        require(startTime < endTime, "end time of the ballot must be after the start time");
        require(startTime > block.timestamp, "end time of the ballot must be in the future");
        require(endTime > block.timestamp, "end time of the ballot must be in the future");
        require(candidateNames.length >= 2,
          "no ballot can be created with less than 2 candidates");

        owner = msg.sender;
        startTime = _startTime;
        endTime = _endTime;
        candidateNames = _candidateNames;

        for (uint i = 0; i < candidateNames.length; i++){
            require(candidateNames[i][0] != 0,
              "every candidate must have a defined name");
        }
    }

    //contract core

    //modifiers
    modifier onlyOwner(){
        require(msg.sender == owner, "function reserved to the contract owner");
        _;
    }
    
    function getCandidateScore(bytes32 _candidateName) public view returns(uint256){
        // require(block.timestamp > endTime, "please wait for end of vote to see scores");
        uint256[3] memory numberOfVotesByWeight;
        uint256 totalNumberOfVotes;
        
        for(uint256 i = 0; i < candidateNames.length; i++){
            numberOfVotesByWeight[LEADING] += candidateScores[candidateNames[i]][LEADING];
            numberOfVotesByWeight[MEMBER] += candidateScores[candidateNames[i]][MEMBER];
            numberOfVotesByWeight[LEAVING] += candidateScores[candidateNames[i]][LEAVING];
        }
        totalNumberOfVotes = numberOfVotesByWeight[LEADING] + numberOfVotesByWeight[MEMBER] + numberOfVotesByWeight[LEAVING];
        
        return(
            candidateScores[_candidateName][LEADING] * (((55 * ONE / 100) * totalNumberOfVotes) / numberOfVotesByWeight[LEADING]) +
            candidateScores[_candidateName][MEMBER] * (((35 * ONE / 100) * totalNumberOfVotes) / numberOfVotesByWeight[MEMBER]) + 
            candidateScores[_candidateName][LEAVING] * (((10 * ONE / 100) * totalNumberOfVotes) / numberOfVotesByWeight[LEAVING]));
    }

    //warning: doesn't check if candidate actually exists
    function vote(bytes32 _candidateName, uint8 weightCode) public onlyOwner{
        require(block.timestamp >= startTime, "ballot has not yet started");
        require(block.timestamp < endTime, "ballot must still be open");
        require(weightCode >= 0 && weightCode < 3, "incorrect weightCode");

        candidateScores[_candidateName][weightCode]++;
    }
}
