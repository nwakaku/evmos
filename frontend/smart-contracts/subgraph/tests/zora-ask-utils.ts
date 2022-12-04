import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
import {
  AskCanceled,
  AskCreated,
  AskFilled,
  AskPriceUpdated,
  ExchangeExecuted,
  RoyaltyPayout
} from "../generated/ZoraAsk/ZoraAsk"

export function createAskCanceledEvent(
  tokenContract: Address,
  tokenId: BigInt,
  ask: ethereum.Tuple
): AskCanceled {
  let askCanceledEvent = changetype<AskCanceled>(newMockEvent())

  askCanceledEvent.parameters = new Array()

  askCanceledEvent.parameters.push(
    new ethereum.EventParam(
      "tokenContract",
      ethereum.Value.fromAddress(tokenContract)
    )
  )
  askCanceledEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )
  askCanceledEvent.parameters.push(
    new ethereum.EventParam("ask", ethereum.Value.fromTuple(ask))
  )

  return askCanceledEvent
}

export function createAskCreatedEvent(
  tokenContract: Address,
  tokenId: BigInt,
  ask: ethereum.Tuple
): AskCreated {
  let askCreatedEvent = changetype<AskCreated>(newMockEvent())

  askCreatedEvent.parameters = new Array()

  askCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "tokenContract",
      ethereum.Value.fromAddress(tokenContract)
    )
  )
  askCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )
  askCreatedEvent.parameters.push(
    new ethereum.EventParam("ask", ethereum.Value.fromTuple(ask))
  )

  return askCreatedEvent
}

export function createAskFilledEvent(
  tokenContract: Address,
  tokenId: BigInt,
  buyer: Address,
  finder: Address,
  ask: ethereum.Tuple
): AskFilled {
  let askFilledEvent = changetype<AskFilled>(newMockEvent())

  askFilledEvent.parameters = new Array()

  askFilledEvent.parameters.push(
    new ethereum.EventParam(
      "tokenContract",
      ethereum.Value.fromAddress(tokenContract)
    )
  )
  askFilledEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )
  askFilledEvent.parameters.push(
    new ethereum.EventParam("buyer", ethereum.Value.fromAddress(buyer))
  )
  askFilledEvent.parameters.push(
    new ethereum.EventParam("finder", ethereum.Value.fromAddress(finder))
  )
  askFilledEvent.parameters.push(
    new ethereum.EventParam("ask", ethereum.Value.fromTuple(ask))
  )

  return askFilledEvent
}

export function createAskPriceUpdatedEvent(
  tokenContract: Address,
  tokenId: BigInt,
  ask: ethereum.Tuple
): AskPriceUpdated {
  let askPriceUpdatedEvent = changetype<AskPriceUpdated>(newMockEvent())

  askPriceUpdatedEvent.parameters = new Array()

  askPriceUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "tokenContract",
      ethereum.Value.fromAddress(tokenContract)
    )
  )
  askPriceUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )
  askPriceUpdatedEvent.parameters.push(
    new ethereum.EventParam("ask", ethereum.Value.fromTuple(ask))
  )

  return askPriceUpdatedEvent
}

export function createExchangeExecutedEvent(
  userA: Address,
  userB: Address,
  a: ethereum.Tuple,
  b: ethereum.Tuple
): ExchangeExecuted {
  let exchangeExecutedEvent = changetype<ExchangeExecuted>(newMockEvent())

  exchangeExecutedEvent.parameters = new Array()

  exchangeExecutedEvent.parameters.push(
    new ethereum.EventParam("userA", ethereum.Value.fromAddress(userA))
  )
  exchangeExecutedEvent.parameters.push(
    new ethereum.EventParam("userB", ethereum.Value.fromAddress(userB))
  )
  exchangeExecutedEvent.parameters.push(
    new ethereum.EventParam("a", ethereum.Value.fromTuple(a))
  )
  exchangeExecutedEvent.parameters.push(
    new ethereum.EventParam("b", ethereum.Value.fromTuple(b))
  )

  return exchangeExecutedEvent
}

export function createRoyaltyPayoutEvent(
  tokenContract: Address,
  tokenId: BigInt,
  recipient: Address,
  amount: BigInt
): RoyaltyPayout {
  let royaltyPayoutEvent = changetype<RoyaltyPayout>(newMockEvent())

  royaltyPayoutEvent.parameters = new Array()

  royaltyPayoutEvent.parameters.push(
    new ethereum.EventParam(
      "tokenContract",
      ethereum.Value.fromAddress(tokenContract)
    )
  )
  royaltyPayoutEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )
  royaltyPayoutEvent.parameters.push(
    new ethereum.EventParam("recipient", ethereum.Value.fromAddress(recipient))
  )
  royaltyPayoutEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )

  return royaltyPayoutEvent
}
