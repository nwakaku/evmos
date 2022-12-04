import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { Address, BigInt } from "@graphprotocol/graph-ts"
import { AskCanceled } from "../generated/schema"
import { AskCanceled as AskCanceledEvent } from "../generated/ZoraAsk/ZoraAsk"
import { handleAskCanceled } from "../src/zora-ask"
import { createAskCanceledEvent } from "./zora-ask-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let tokenContract = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let tokenId = BigInt.fromI32(234)
    let ask = "ethereum.Tuple Not implemented"
    let newAskCanceledEvent = createAskCanceledEvent(
      tokenContract,
      tokenId,
      ask
    )
    handleAskCanceled(newAskCanceledEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("AskCanceled created and stored", () => {
    assert.entityCount("AskCanceled", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "AskCanceled",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "tokenContract",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "AskCanceled",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "tokenId",
      "234"
    )
    assert.fieldEquals(
      "AskCanceled",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "ask",
      "ethereum.Tuple Not implemented"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
