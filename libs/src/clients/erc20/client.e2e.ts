import * as dotenv from "dotenv";
import assert from "assert";
import * as Client from "./client";
import type { Event } from "ethers";
import { ethers } from "ethers";

dotenv.config();

const address = "0xeca82185adCE47f39c684352B0439f030f860318";
// these require integration testing, skip for ci
describe("erc20", function () {
  let client: Client.Instance;
  let events: Event[];
  test("inits", function () {
    const provider = ethers.providers.getDefaultProvider(
      process.env.CUSTOM_NODE_URL,
    );
    client = Client.connect(address, provider);
    assert.ok(client);
  });
  test("getEventState between", async function () {
    events = await client.queryFilter({}, 12477952, 12477952 + 1000);
    assert.ok(events.length);
  });
  test("getEventState", function () {
    const state = Client.getEventState(events);
    assert.ok(state.balances);
    assert.ok(state.approvalsByOwner);
    assert.ok(state.approvalsBySpender);
  });
});
