const { expect } = require("chai");

const getTime = async () => {
  const blockNumBefore = await ethers.provider.getBlockNumber();
  const blockBefore = await ethers.provider.getBlock(blockNumBefore);
  return blockBefore.timestamp;
};

describe("Poll", function () {
  let addr0;
  let addr1;
  let polling;
  let pollQuestion = "1";
  let pollOptions = ["1", "2", "3", "4"];

  before(async () => {
    [addr0, addr1] = await ethers.getSigners();

    const Polling = await ethers.getContractFactory("Polling");
    polling = await Polling.deploy({});
  });

  describe("Create poll", () => {
    
    it("Cannot create poll invalid end time", async () => {
      await expect(polling.createPoll(pollOptions, pollQuestion, (await getTime()) - 60, 4)).to.be.reverted;
    });
    it("Cannot create poll it too few options", async () => {
      await expect(polling.createPoll([], pollQuestion, (await getTime()) + 60, 1)).to.be.reverted;
    });
    it("Cannot create poll if too many options", async () => {
      await expect(polling.createPoll(pollOptions, pollQuestion, (await getTime()) + 60, 9)).to.be.reverted;
    });
    it("Can create vote", async () => {
      await expect(polling.createPoll(pollOptions, pollQuestion, (await getTime()) + 60, 4)).to.emit(
        polling,
        "PollCreated"
      );
    });
    it("Can create 2nd vote", async () => {
      await expect(polling.createPoll(pollOptions, pollQuestion, (await getTime()) + 60, 4)).to.emit(
        polling,
        "PollCreated"
      );
    });
  });

  describe("Vote", () => {
    
    it("Cannot vote on vote that doesn't exist", async () => {
      await expect(polling.vote(2, 0)).to.be.reverted;
    });
    it("Cannot vote on invalid option", async () => {
      await expect(polling.vote(0, 9)).to.be.reverted;
    });
    it("Can vote", async () => {
      await expect(polling.vote(0, 0)).to.emit(polling, "Voted");
    });
    it("Cannot vote twice", async () => {
      await expect(polling.vote(0, 1)).to.be.reverted;
    });
    it("Cannot vote on expired vote", async () => {
      await ethers.provider.send("evm_mine", [(await getTime()) + 3600]);
      await expect(polling.connect(addr1).vote(0, 0)).to.be.reverted;
    });
  });
});