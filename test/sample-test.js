const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Eva", function() {
    it("Should mint a new token with correct URI", async function () {
        const Eva = await ethers.getContractFactory("Eva");
        const eva = await Eva.deploy();
        await eva.deployed();

        const ipfsURI = "ipfs://QmbXMzoDGQRvunschhuJoSEsvyySxydrLD95dFPFJDkU7Z";

        const mintTx = await eva.mint(ipfsURI);
        await mintTx.wait();

        expect(await eva.tokenURI(0)).to.equal(ipfsURI);
    });


})