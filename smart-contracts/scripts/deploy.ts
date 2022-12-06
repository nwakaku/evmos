import { ethers } from "hardhat";
import yaml from "js-yaml"
import fs from "fs"
import hre from "hardhat"
async function main() {
  const MarketPlaceFactory = await ethers.getContractFactory("Marketplace")
  const marketPlace = await MarketPlaceFactory.deploy(10);
  console.log("deployment for Marketplace started, hash: ", marketPlace.deployTransaction.hash);
  await marketPlace.deployed();

  const AdvNftFactory = await ethers.getContractFactory("AdvNFT");
  const advNFT = await AdvNftFactory.deploy("AdvNFT", "ADV", marketPlace.address);
  console.log("deployment for ADV NFT started, hash: ", advNFT.deployTransaction.hash);
  await advNFT.deployed();


  const MusicNftFactory = await ethers.getContractFactory("MusicNFT")
  const musicNFT = await MusicNftFactory.deploy("MusicNFT", "MZK", advNFT.address);
  console.log("deployment for MUSIC NFT started, hash: ", musicNFT.deployTransaction.hash);
  await musicNFT.deployed();

  await advNFT.setNftContractAddr(musicNFT.address).then(e => e.wait())
  console.log("ADVNft:", advNFT.address);
  console.log("MusicNFT:", musicNFT.address);
  console.log("MarketPlace:", marketPlace.address);

  if (hre.network.name == "localhost") {
    const [owner, creator, randomMarketplace, randomSigner, advBuyer] = await ethers.getSigners()
    const metaDataHash = "ipfs://QmbXvKra8Re7sxCMAEpquWJEq5qmSqis5VPCvo9uTA7AcF"
    const assetHash = "testassetHASH"
    await advNFT.connect(creator).setApprovalForAll(randomMarketplace.getAddress(), true)
    await musicNFT.connect(creator).createMusic(metaDataHash, assetHash)
    const threeHours = 3 * 24 * 60 * 60
    const advNFTMetaData = "testmetadata"
    const advAssetHash = "assettestmetadata"
    await advNFT.connect(creator).createAdSpace(1, advNFTMetaData, advAssetHash, threeHours)
    await musicNFT.connect(creator).createMusicWithAdv(metaDataHash, advAssetHash, advNFTMetaData, advAssetHash, threeHours)
    await advNFT.connect(randomMarketplace).transferFrom(creator.getAddress(), advBuyer.getAddress(), 1)
    const advNFTMetaData2 = "testmetadata2_2"
    const advAssetHash2 = "hash_testmetadata2_2"
    await ethers.provider.send("evm_increaseTime", [threeHours + 10]) // add 3 hrs 10 sec
    await ethers.provider.send("evm_mine", [])
    await advNFT.connect(creator).createAdSpace(1, advNFTMetaData2, advAssetHash2, threeHours)
    updateGraphAddress(advNFT.address, musicNFT.address, marketPlace.address, musicNFT.deployTransaction.blockNumber, true)
  } else {
    updateGraphAddress(advNFT.address, musicNFT.address, marketPlace.address, musicNFT.deployTransaction.blockNumber, false)
  }
}
function updateGraphAddress(advNFTAddr: string, musicNFTAddr: string, marketPlaceAddr: string, startBlock: number | undefined, local: boolean) {
  const urlSubgraphLocal = local ? `subgraph/subgraph.local.yaml` : `subgraph/subgraph.yaml`
  const umlSubgraphLocal = yaml.load(fs.readFileSync(urlSubgraphLocal, 'utf8')) as any
  umlSubgraphLocal.dataSources[0].source.address = advNFTAddr
  umlSubgraphLocal.dataSources[1].source.address = musicNFTAddr
  umlSubgraphLocal.dataSources[2].source.address = marketPlaceAddr

  if (startBlock) {
    umlSubgraphLocal.dataSources[0].source.startBlock = startBlock
    umlSubgraphLocal.dataSources[1].source.startBlock = startBlock
    umlSubgraphLocal.dataSources[2].source.startBlock = startBlock
  }
  fs.writeFileSync(urlSubgraphLocal, yaml.dump(umlSubgraphLocal));
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
