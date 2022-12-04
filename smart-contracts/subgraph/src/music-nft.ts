import {
  MusicNFTCreated,
  Transfer
} from "../generated/MusicNFT/MusicNFT"
import {
  MusicNFT, User
} from "../generated/schema"

const tokenUriPrefix = "ipfs://"

function getUri(s: string): string {
  return tokenUriPrefix + s
}
export function handleMusicNFTCreated(event: MusicNFTCreated): void {
  const musicNft = new MusicNFT(event.params.tokenID.toString())
  musicNft.creator = event.params.creator.toHexString();
  musicNft.owner = event.params.creator.toHexString();
  musicNft.metaDataUri = getUri(event.params.metaDataHash);
  musicNft.assetUri = getUri(event.params.assetHash);
  musicNft.save();
}


export function handleMusicNFTTransfer(event: Transfer): void {
  const user = new User(event.params.to.toHexString());
  user.save()
  const musicNft = MusicNFT.load(event.params.tokenId.toString())
  if (musicNft) {
    musicNft.owner = event.params.to.toHexString();
    musicNft.save();
  } else {
    //TODO
  }

}