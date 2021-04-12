pragma solidity >=0.4.22 <0.6.0;

/*
 naming conventions used :
 camelCase
 s_<var_name> for structs
 m_<var_name> for mappings
 _<var_name> for parameters
 may use a convention for arrays in the future
 */

contract BallotBDE {
    //contract variables

    address owner;
    uint startTime = 1618560000; /* 16 april 2021 10h CET - time before which no vote can be registered */
    uint endTime = 1618588800; /* 16 april 2021 18h CET - time after which no vote can be registered anymore,
    based on unix epoch */
    bool externalitiesEnabled = true; /* to create ballots without controversial
    externalities */
    bytes32[] candidateNames = [bytes32("Atlas"), bytes32("Overlap"), bytes32("Vote blanc")];
    mapping (bytes32 => s_candidate) m_candidates;

    //structs definition
    struct s_candidate {
        uint poll; //number of votes
        int externality; //for penalties or bonus, often used at ISEP
    }

    /* warning : if many candidates with the same name are sent, last one
    will overwrite the others */
    constructor() public {
        require(startTime < endTime, "end time of the ballot must be after the start time");
        require(startTime > now, "end time of the ballot must be in the future");
        require(endTime > now, "end time of the ballot must be in the future");
        require(candidateNames.length >= 2,
          "no ballot can be created with less than 2 candidates");

        owner = msg.sender;

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

    modifier mustBeBeforeEndTime(){
        require(now < endTime, "ballot must still be open");
        _;
    }

    modifier mustBeInBallotTime(){
        require(now >= startTime, "ballot has not yet started");
        require(now < endTime, "ballot must still be open");
        _;
    }

    //public methods

    //getters
    function getCandidateScore(bytes32 _candidateName)
      public view returns(int){
        return int(m_candidates[_candidateName].poll) +
          m_candidates[_candidateName].externality;
    }

    function getCandidateExternality(bytes32 _candidateName)
      public view returns(int){
        return m_candidates[_candidateName].externality;
    }

    function getCandidateNames() public view returns(bytes32[] memory){
        return candidateNames;
    }

    function getEndTime() public view returns(uint){
        return endTime;
    }

    function getStartTime() public view returns(uint){
        return startTime;
    }

    //for voters

    //warning: doesn't check if candidate actually exists
    function vote(bytes32 _candidateName)
      onlyOwner mustBeInBallotTime public{
        m_candidates[_candidateName].poll++;
    }

    //warning: doesn't check if candidate actually exists
    function addNewExternality(bytes32 _candidateName, int _externality)
      onlyOwner mustBeBeforeEndTime public{
        require(externalitiesEnabled,
          "externalities must be enabled at ballot creation");

        m_candidates[_candidateName].externality += _externality;
    }
}
