pragma solidity ^0.8.9;

contract SurveyContract {
    uint nextSurveyId;

    struct Survey {
        string uri;
        address owner;
        uint endTime;
        uint[] votes;
        mapping(address => bool) voted;
        uint options;
    }

    mapping(uint => Survey) surveys;
    mapping(address => bool) public members;

    event MemberJoined(address indexed member, uint joinedAt);

    event SurveyCreated(
        address indexed owner,
        uint indexed surveyId,
        uint createdAt,
        uint endTime
    );
    event Voted(
        address indexed voted,
        uint indexed surveyId,
        uint indexed option,
        uint votedAt
    );

    modifier isMember() {
        require(members[msg.sender], "you are not a member");
        _;
    }

    modifier canVote(uint surveyId, uint option) {
        require(surveyId < nextSurveyId, "survey does not exist");
        require(option < surveys[surveyId].options, "invalid option");
        require(!surveys[surveyId].voted[msg.sender], "you have already voted");
        require(
            block.timestamp <= surveys[surveyId].endTime,
            "survey has ended"
        );
        _;
    }

    function join() external {
        require(!members[msg.sender], "you are already a member");
        members[msg.sender] = true;
        emit MemberJoined(msg.sender, block.timestamp);
    }

    function createSurvey(
        string memory uri,
        uint endTime,
        uint options
    ) external isMember {
        require(
            options >= 2 && options <= 8,
            "number of options must be between 2 and 8"
        );
        require(endTime > block.timestamp, "end time cannot be in past");

        uint surveyId = nextSurveyId;
        nextSurveyId++;

        surveys[surveyId].uri = uri;
        surveys[surveyId].endTime = endTime;
        surveys[surveyId].options = options;
        surveys[surveyId].owner = msg.sender;
        surveys[surveyId].votes = new uint256[](options);

        emit SurveyCreated(msg.sender, surveyId, block.timestamp, endTime);
    }

    function vote(
        uint surveyId,
        uint option
    ) external isMember canVote(surveyId, option) {
        surveys[surveyId].votes[option]++;
        surveys[surveyId].voted[msg.sender] = true;
        emit Voted(msg.sender, surveyId, option, block.timestamp);
    }

    function getVote(
        uint surveyId
    ) public view returns (string memory, address, uint[] memory, uint) {
        return (
            surveys[surveyId].uri,
            surveys[surveyId].owner,
            surveys[surveyId].votes,
            surveys[surveyId].endTime
        );
    }

    function didVote(address member, uint surveyId) public view returns (bool) {
        return surveys[surveyId].voted[member];
    }
}
