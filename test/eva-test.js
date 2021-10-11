const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Eva", function() {

    let eva;

    beforeEach(async function() {
        const Eva = await ethers.getContractFactory("Eva");
        eva = await Eva.deploy();
        await eva.deployed();
    });

    it("Should mint a new token with correct URI", async function () {
        const [owner] = await ethers.getSigners();

        const ipfsURI = "ipfs://QmbXMzoDGQRvunschhuJoSEsvyySxydrLD95dFPFJDkU7Z";

        const minterRole = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("MINTER_ROLE"));

        const grantMinterTx = await eva.grantRole(minterRole, owner.address);
        await grantMinterTx.wait();

        const mintTx = await eva.mint(ipfsURI);
        await mintTx.wait();

        expect(await eva.tokenURI(0)).to.equal(ipfsURI);
    });

    it("Should revert if not minter", async function () {
        const [owner, user] = await ethers.getSigners();

        const ipfsURI = "ipfs://QmbXMzoDGQRvunschhuJoSEsvyySxydrLD95dFPFJDkU7Z";

        const minterRole = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("MINTER_ROLE"));

        const grantMinterTx = await eva.grantRole(minterRole, owner.address);
        await grantMinterTx.wait();

        await expect(eva.connect(user).mint(ipfsURI)).to.be.revertedWith("Caller is not a minter");
    });

    it("Should return the contract URI", async function() {
        expect(await eva.contractURI()).to.equal("ipfs://...");
    })

    it("Should get token royalties info", async function() {
        const [owner] = await ethers.getSigners();

        const ipfsURI = "ipfs://QmbXMzoDGQRvunschhuJoSEsvyySxydrLD95dFPFJDkU7Z";

        const minterRole = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("MINTER_ROLE"));

        const grantMinterTx = await eva.grantRole(minterRole, owner.address);
        await grantMinterTx.wait();

        const mintTx = await eva.mint(ipfsURI);
        await mintTx.wait();

        expect(await eva.tokenURI(0)).to.equal(ipfsURI);

        const royalties = await eva.royaltyInfo(0, 300);
        expect(royalties[1]).to.equal(30);
    })

})