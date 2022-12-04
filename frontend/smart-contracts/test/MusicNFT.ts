import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { expect } from "chai"
import { ethers } from "hardhat"
import { AdvNFT, Marketplace, MusicNFT } from "../typechain-types"

describe("musicNFT contract", () => {

    let [owner, creator, otherCreator, randomSigner, advBuyer]: SignerWithAddress[] = new Array(5)
    before(async () => {
        [owner, creator, otherCreator, randomSigner, advBuyer] = await ethers.getSigners()
    })
    let musicNFT: MusicNFT
    let advNFT: AdvNFT
    let marketPlaceNFT: Marketplace
    const musicNftMetadata = {
        name: "MusicNFT",
        symbol: "MZK",
    }

    const advNftMetadata = {
        name: "AdvNFT",
        symbol: "ADV",
    }

    const marketPlaceMetadata = {
        platformFee: 10,
    }
    before(async () => {
        let marketPlaceNFTFactory = await ethers.getContractFactory("Marketplace")
        let advNFTFactory = await ethers.getContractFactory("AdvNFT")
        let musicNFTFactory = await ethers.getContractFactory("MusicNFT")

        marketPlaceNFT = await marketPlaceNFTFactory.deploy(marketPlaceMetadata.platformFee)
        advNFT = await advNFTFactory.deploy(advNftMetadata.name,
            advNftMetadata.symbol,
            marketPlaceNFT.address)
        musicNFT = await musicNFTFactory.deploy(musicNftMetadata.name, musicNftMetadata.symbol, advNFT.address)
        advNFT.setNftContractAddr(musicNFT.address);
    })
    it("Should return the right name and symbol of the token once musicNFT is deployed", async () => {
        await expect(await musicNFT.name()).to.equal(musicNftMetadata.name)
        await expect(await musicNFT.symbol()).to.equal(musicNftMetadata.symbol)
    })

    it("Should get the right owner", async () => {
        const musicNFTAdmin = await musicNFT.admin()
        expect(musicNFTAdmin).to.be.equal(owner.address)
    })


    const metaDataHash = "ipfs://QmbXvKra8Re7sxCMAEpquWJEq5qmSqis5VPCvo9uTA7AcF"
    const assetHash = "testassetHASH"

    it("Should create music NFT", async () => {
        await expect(
            musicNFT.connect(creator).createMusic(metaDataHash, assetHash)
        )
            .to.emit(musicNFT, "MusicNFTCreated")
            .withArgs(1, await creator.getAddress(), metaDataHash, assetHash)
    })


    it("Should able to transfer", async () => {
        await expect(
            musicNFT.connect(creator).transferFrom(await creator.getAddress(), await otherCreator.getAddress(), 1)
        )
            .to.emit(musicNFT, "Transfer")
            .withArgs(await creator.getAddress(), await otherCreator.getAddress(), 1)
    })

    const threeHours = 3 * 24 * 60 * 60
    const advNFTMetaData = "testmetadata"
    const advAssetHash = "assettestmetadata"


    it("Should create ADV NFT", async () => {
        await expect(
            advNFT.connect(otherCreator).createAdSpace(1, advNFTMetaData, advAssetHash, threeHours)
        )
            .to.emit(advNFT, "AdvNFTCreated")
            .withArgs(
                advNFTMetaData, advAssetHash,
                1, threeHours, 1)
    })

    it("Should fail creating ADV NFT when existing hasn't expired", async () => {
        await expect(
            advNFT.connect(otherCreator).createAdSpace(1, advNFTMetaData, advAssetHash, threeHours)
        )
            .to.be.revertedWith("Adspace is not expired yet")
    })

    it("Should create Music NFT with ADV NFT", async () => {
        await expect(
            await musicNFT.connect(creator).createMusicWithAdv(metaDataHash, advAssetHash, advNFTMetaData, advAssetHash, threeHours)
        )
            .to.emit(advNFT, "AdvNFTCreated")
            .withArgs(advNFTMetaData, advAssetHash,
                2, threeHours, 2)
    })

    it("Should fail transferring Music NFT when ADV NFT is already active", async () => {
        await expect(
            musicNFT.connect(creator).transferFrom(creator.getAddress(), randomSigner.getAddress(), 2)
        )
            .to.be.revertedWith("associated AdvNFT should be expired before the music can be transferred")
    })

    it("Should initialize duration after market sale", async () => {
        await expect(await marketPlaceNFT.connect(otherCreator).
            createMarketItem(advNFT.address, 1, 10))
            .to.emit(advNFT, "Transfer")
            .withArgs(await otherCreator.getAddress(), marketPlaceNFT.address, 1)
        await expect(await marketPlaceNFT.connect(advBuyer).
            createMarketSale(advNFT.address, 1, {
                value: 10
            })).to.emit(advNFT, "Transfer")
            .withArgs(marketPlaceNFT.address, await advBuyer.getAddress(), 1)
    })

    it("Should expire ADV NFT after specified time", async () => {
        expect(
            await advNFT.getCurrentAdvAssetUri(1)
        ).to.eq(getUri(advNFTMetaData))
        await ethers.provider.send("evm_increaseTime", [threeHours + 10]) // add 3 hrs 10 sec
        await ethers.provider.send("evm_mine", [])
        await expect(
            advNFT.getCurrentAdvAssetUri(1)
        )
            .to.be.revertedWith("AdvNFT has expired")
    })

    it("Should allow transferring Music NFT when ADV NFT is expired", async () => {
        await expect(
            advNFT.connect(otherCreator).createAdSpace(1, advNFTMetaData, advAssetHash, threeHours)
        )
    })

    const advNFTMetaData2 = "testmetadata2_2"
    const advAssetHash2 = "hash_testmetadata2_2"
    it("Should allow to create new ADV NFT after expiration", async () => {
        await expect(
            advNFT.connect(creator).createAdSpace(1, advNFTMetaData2, advAssetHash2, threeHours)
        )
    })

    const getUri = (s: string) => "ipfs://" + s
})






// TODO:
// Test address not initlized
// Create that modifier which check nftaddr is initialized or not
// Test duration too low and high
// Test resetting addr