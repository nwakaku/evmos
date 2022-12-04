import { BigInt } from "@graphprotocol/graph-ts"
import {
  AdvNFTCreated,
  Transfer,
  AdvNFTHashUpdated
} from "../generated/AdvNFT/AdvNFT"
import { AdvNFT, MusicNFT, User } from "../generated/schema"


const tokenUriPrefix = "ipfs://"

function getUri(s: string): string {
  return tokenUriPrefix + s
}
export function handleAdvNFTCreated(event: AdvNFTCreated): void {
  let musicNft = MusicNFT.load(event.params.tokenID.toString())
  if (musicNft) {
    const advNft = new AdvNFT(event.params.tokenID.toString())
    advNft.musicNFT = event.params.musicNFTId.toString();
    advNft.owner = musicNft.owner;
    advNft.expirationTime = BigInt.fromString("0");
    advNft.expirationDuration = event.params.expirationDuration;
    advNft.metaDataHash = getUri(event.params.metaDataHash);
    advNft.assetHash = ""
    if (event.params.assetHash != "") advNft.assetHash = getUri(event.params.assetHash)
    advNft.save();
  } else {
    //TODO
  }

}

export function handleAdvNFTHashUpdated(event: AdvNFTHashUpdated): void {
  const advNft = AdvNFT.load(event.params.tokenId.toString())
  if (advNft) {
    advNft.metaDataHash = getUri(event.params.metaHash);
    advNft.assetHash = getUri(event.params.assetHash);
    advNft.save();
  } else {
    //TODO
  }
}

export function handleTransfer(event: Transfer): void {
  const user = new User(event.params.to.toHexString())
  const advNft = AdvNFT.load(event.params.tokenId.toString())
  if (advNft) {
    advNft.owner = event.params.to.toHexString();
    advNft.expirationTime = event.block.timestamp.plus(BigInt.fromString(advNft.expirationDuration.toString()));
    user.save();
    advNft.save();
  } else {
    //TODO
  }

}

