pragma solidity ^0.8.9;

contract Polling {
    uint nextPollId;

    struct Poll {
        address owner;
        uint endTime;
        mapping(address => bool) voted;
        uint number_of_options;
        string[] options;
        mapping(string => uint) votes;
        string question;
        uint totalVotes;
    }

    mapping(uint => Poll) polls;

    event PollCreated(
        address indexed owner,
        uint indexed pollId,
        uint createdAt,
        uint endTime
    );
    event Voted(
        address indexed voted,
        uint indexed pollId,
        uint indexed voteIndex,
        uint votedAt
    );

    modifier canVote(uint pollId, uint voteIndex) {
        require(pollId < nextPollId, "poll does not exist");
        require(
            voteIndex >= 0 && voteIndex < polls[pollId].number_of_options,
            "invalid vote index"
        );
        require(!polls[pollId].voted[msg.sender], "you have already voted");
        require(block.timestamp <= polls[pollId].endTime, "poll has ended");
        _;
    }

    function createPoll(
        string[] memory options,
        string memory question,
        uint endTime,
        uint number_of_options
    ) external {
        require(
            number_of_options >= 2 && number_of_options <= 8,
            "number of options must be between 2 and 8"
        );
        require(endTime > block.timestamp, "end time cannot be in past");

        uint pollId = nextPollId;
        nextPollId++;

        polls[pollId].owner = msg.sender;
        polls[pollId].endTime = endTime;
        polls[pollId].number_of_options = number_of_options;
        polls[pollId].question = question;

        for (uint i = 0; i < number_of_options; i++) {
            polls[pollId].options.push(options[i]);
            polls[pollId].votes[options[i]] = 0;
        }

        emit PollCreated(msg.sender, pollId, block.timestamp, endTime);
    }

    function vote(
        uint pollId,
        uint voteIndex
    ) external canVote(pollId, voteIndex) {
        polls[pollId].votes[polls[pollId].options[voteIndex]]++;
        polls[pollId].voted[msg.sender] = true;
        polls[pollId].totalVotes++;
        emit Voted(msg.sender, pollId, voteIndex, block.timestamp);
    }

    function getPoll(
        uint pollId
    )
        public
        view
        returns (
            address,
            string[] memory,
            uint[] memory,
            uint,
            uint,
            string memory
        )
    {
        uint[] memory votes = new uint[](polls[pollId].number_of_options);

        for (uint i = 0; i < polls[pollId].number_of_options; i++) {
            votes[i] = polls[pollId].votes[polls[pollId].options[i]];
        }

        return (
            polls[pollId].owner,
            polls[pollId].options,
            votes,
            polls[pollId].endTime,
            polls[pollId].totalVotes,
            polls[pollId].question
        );
    }

    function didVote(uint pollId) public view returns (bool) {
        return polls[pollId].voted[msg.sender];
    }
}
