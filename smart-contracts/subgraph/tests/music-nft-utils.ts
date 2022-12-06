import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
import {
  MusicNFTApproval,
  MusicNFTApprovalForAll,
  MusicNFTCreated,
  MusicNFTPaused,
  MusicNFTTransfer,
  MusicNFTUnpaused
} from "../generated/MusicNFT/MusicNFT"

export function createMusicNFTApprovalEvent(
  owner: Address,
  approved: Address,
  tokenId: BigInt
): MusicNFTApproval {
  let musicNftApprovalEvent = changetype<MusicNFTApproval>(newMockEvent())

  musicNftApprovalEvent.parameters = new Array()

  musicNftApprovalEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  musicNftApprovalEvent.parameters.push(
    new ethereum.EventParam("approved", ethereum.Value.fromAddress(approved))
  )
  musicNftApprovalEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )

  return musicNftApprovalEvent
}

export function createMusicNFTApprovalForAllEvent(
  owner: Address,
  operator: Address,
  approved: boolean
): MusicNFTApprovalForAll {
  let musicNftApprovalForAllEvent = changetype<MusicNFTApprovalForAll>(
    newMockEvent()
  )

  musicNftApprovalForAllEvent.parameters = new Array()

  musicNftApprovalForAllEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  musicNftApprovalForAllEvent.parameters.push(
    new ethereum.EventParam("operator", ethereum.Value.fromAddress(operator))
  )
  musicNftApprovalForAllEvent.parameters.push(
    new ethereum.EventParam("approved", ethereum.Value.fromBoolean(approved))
  )

  return musicNftApprovalForAllEvent
}

export function createMusicNFTCreatedEvent(
  tokenID: BigInt,
  creator: Address,
  metaDataUri: string
): MusicNFTCreated {
  let musicNftCreatedEvent = changetype<MusicNFTCreated>(newMockEvent())

  musicNftCreatedEvent.parameters = new Array()

  musicNftCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "tokenID",
      ethereum.Value.fromUnsignedBigInt(tokenID)
    )
  )
  musicNftCreatedEvent.parameters.push(
    new ethereum.EventParam("creator", ethereum.Value.fromAddress(creator))
  )
  musicNftCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "metaDataUri",
      ethereum.Value.fromString(metaDataUri)
    )
  )

  return musicNftCreatedEvent
}

export function createMusicNFTPausedEvent(account: Address): MusicNFTPaused {
  let musicNftPausedEvent = changetype<MusicNFTPaused>(newMockEvent())

  musicNftPausedEvent.parameters = new Array()

  musicNftPausedEvent.parameters.push(
    new ethereum.EventParam("account", ethereum.Value.fromAddress(account))
  )

  return musicNftPausedEvent
}

export function createMusicNFTTransferEvent(
  from: Address,
  to: Address,
  tokenId: BigInt
): MusicNFTTransfer {
  let musicNftTransferEvent = changetype<MusicNFTTransfer>(newMockEvent())

  musicNftTransferEvent.parameters = new Array()

  musicNftTransferEvent.parameters.push(
    new ethereum.EventParam("from", ethereum.Value.fromAddress(from))
  )
  musicNftTransferEvent.parameters.push(
    new ethereum.EventParam("to", ethereum.Value.fromAddress(to))
  )
  musicNftTransferEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )

  return musicNftTransferEvent
}

export function createMusicNFTUnpausedEvent(
  account: Address
): MusicNFTUnpaused {
  let musicNftUnpausedEvent = changetype<MusicNFTUnpaused>(newMockEvent())

  musicNftUnpausedEvent.parameters = new Array()

  musicNftUnpausedEvent.parameters.push(
    new ethereum.EventParam("account", ethereum.Value.fromAddress(account))
  )

  return musicNftUnpausedEvent
}
