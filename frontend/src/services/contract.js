const ethers = require('ethers');

const address = "0xe7f1725e7734ce288f8367e1bb143e90bb3f0512";

const abi = [
    "event MemberJoined(address indexed member, uint256 joinedAt)",
    "event SurveyCreated(address indexed owner, uint256 indexed surveyId, uint256 createdAt, uint256 endTime)",
    "event Voted(address indexed voted, uint256 indexed surveyId, uint256 indexed option, uint256 votedAt)",
    "function createSurvey(string uri, uint256 endTime, uint256 options)",
    "function didVote(address member, uint256 surveyId) view returns (bool)",
    "function getVote(uint256 surveyId) view returns (string, address, uint256[], uint256)",
    "function join()",
    "function members(address) view returns (bool)",
    "function vote(uint256 surveyId, uint256 option)"
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