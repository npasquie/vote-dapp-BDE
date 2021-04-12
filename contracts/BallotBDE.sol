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
    bytes32 name;
    bytes32 question;
    uint startTime; /* time before which no vote can be registered */
    uint endTime; /* time after which no vote can be registered anymore,
    based on unix epoch */
    bool externalitiesEnabled; /* to create ballots without controversial
    externalities */
    bytes32[] candidateNames;
    mapping (bytes32 => s_candidate) m_candidates;

    //structs definition
    struct s_candidate {
        uint poll; //number of votes
        int externality; //for penalties or bonus, often used at ISEP
    }

    /* warning : if many candidates with the same name are sent, last one
    will overwrite the others */
    constructor(
        bytes32 _name,
        bytes32 _question,
        uint _endTime,
        bool _externalitiesEnabled,
        bytes32[] memory _candidateNames) public {
        require(! (_name[0] == 0) && ! (_question[0] == 0),
          "name and question must be defined");
        require(_endTime > now, "end time of the ballot must be in the future");
        require(_candidateNames.length >= 2,
          "no ballot can be created with less than 2 candidates");

        owner = msg.sender;
        name = _name;
        question = _question;
        endTime = _endTime;
        externalitiesEnabled = _externalitiesEnabled;
        candidateNames = new bytes32[](_candidateNames.length);
        for (uint i = 0; i < _candidateNames.length; i++){
            require(_candidateNames[i][0] != 0,
              "every candidate must have a defined name");

            candidateNames[i] = _candidateNames[i];
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

    function getName() public view returns(bytes32){
        return name;
    }

    function getQuestion() public view returns(bytes32){
        return question;
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
