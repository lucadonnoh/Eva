const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Eva", function() {
    it("Should mint a new token with correct URI", async function () {
        const [owner] = await ethers.getSigners();

        const Eva = await ethers.getContractFactory("Eva");
        const eva = await Eva.deploy();
        await eva.deployed();

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

        const Eva = await ethers.getContractFactory("Eva");
        const eva = await Eva.deploy();
        await eva.deployed();

        const ipfsURI = "ipfs://QmbXMzoDGQRvunschhuJoSEsvyySxydrLD95dFPFJDkU7Z";

        const minterRole = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("MINTER_ROLE"));

        const grantMinterTx = await eva.grantRole(minterRole, owner.address);
        await grantMinterTx.wait();

        await expect(eva.connect(user).mint(ipfsURI)).to.be.revertedWith("Caller is not a minter");
    });

})