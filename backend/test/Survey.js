const { expect } = require("chai");

const getTime = async () => {
  const blockNumBefore = await ethers.provider.getBlockNumber();
  const blockBefore = await ethers.provider.getBlock(blockNumBefore);
  return blockBefore.timestamp;
};

describe("Survey", function () {
  let addr0;
  let addr1;
  let surveyContract;

  before(async () => {
    [addr0, addr1] = await ethers.getSigners();

    const SurveyContract = await ethers.getContractFactory("SurveyContract");
    surveyContract = await SurveyContract.deploy({});
  });

  describe("Join", () => {
    it("Can join", async () => {
      await expect(surveyContract.join()).to.emit(surveyContract, "MemberJoined");
    });
    it("Cannot join if already member", async () => {
      await expect(surveyContract.join()).to.be.reverted;
    });
  });

  describe("Create vote", () => {
    it("Cannot create vote if not member", async () => {
      await expect(
        surveyContract.connect(addr1).createVote("", (await getTime()) + 60, 4)
      ).to.be.reverted;
    });
    it("Cannot create vote invalid end time", async () => {
      await expect(surveyContract.createVote("", (await getTime()) - 60, 4)).to.be
        .reverted;
    });
    it("Cannot create vote it too few options", async () => {
      await expect(surveyContract.createVote("", (await getTime()) + 60, 1)).to.be
        .reverted;
    });
    it("Cannot create vote if too many options", async () => {
      await expect(surveyContract.createVote("", (await getTime()) + 60, 9)).to.be
        .reverted;
    });
    it("Can create vote", async () => {
      await expect(surveyContract.createVote("1", (await getTime()) + 60, 3)).to.emit(
        surveyContract,
        "SurveyCreated"
      );
    });
    it("Can create 2nd vote", async () => {
      await expect(surveyContract.createVote("2", (await getTime()) + 60, 4)).to.emit(
        surveyContract,
        "SurveyCreated"
      );
    });
  });

  describe("Vote", () => {
    it("Cannot vote if not member", async () => {
      await expect(surveyContract.connect(addr1).vote(0, 0)).to.be.reverted;
    });
    it("Cannot vote on vote that doesn't exist", async () => {
      await expect(surveyContract.vote(2, 0)).to.be.reverted;
    });
    it("Cannot vote on invalid option", async () => {
      await expect(surveyContract.vote(0, 9)).to.be.reverted;
    });
    it("Can vote", async () => {
      await expect(surveyContract.vote(0, 0)).to.emit(surveyContract, "Voted");
    });
    it("Cannot vote twice", async () => {
      await expect(surveyContract.vote(0, 1)).to.be.reverted;
    });
    it("Cannot vote on expired vote", async () => {
      await surveyContract.connect(addr1).join();
      await ethers.provider.send("evm_mine", [(await getTime()) + 3600]);
      await expect(surveyContract.connect(addr1).vote(0, 0)).to.be.reverted;
    });
  });
});