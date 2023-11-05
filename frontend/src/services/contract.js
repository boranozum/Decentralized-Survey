const ethers = require('ethers');

const address = "0x5fbdb2315678afecb367f032d93f642f64180aa3";

const abi = [
    "event PollCreated(address indexed owner, uint256 indexed pollId, uint256 createdAt, uint256 endTime)",
    "event Voted(address indexed voted, uint256 indexed pollId, uint256 indexed voteIndex, uint256 votedAt)",
    "function createPoll(string[] options, string question, uint256 endTime, uint256 number_of_options)",
    "function didVote(uint256 pollId) view returns (bool)",
    "function getPoll(uint256 pollId) view returns (address, string[], uint256[], uint256, uint256, string)",
    "function vote(uint256 pollId, uint256 voteIndex)"
  ]
const provider = new ethers.providers.Web3Provider(window.ethereum);

export const connect = async () => {

    await provider.send('eth_requestAccounts', []);
    return getContract();
}

export const getContract = async () => {

    const signer = provider.getSigner();
    const contract = new ethers.Contract(address, abi, signer);

    return {signer: signer, contract: contract}
}