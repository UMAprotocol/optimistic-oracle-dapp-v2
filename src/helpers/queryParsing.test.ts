import { describe, test, expect } from "vitest";
import { getQueryMetaData } from "./queryParsing";

describe("getQueryMetaData - YES_OR_NO_QUERY and Polymarket", () => {
  const polymarketRequester = "0xcb1822859cef82cd2eb4e6276c7916e692995130"; // Polymarket Binary Adapter Address
  const nonPolymarketRequester = "0x1234567890123456789012345678901234567890"; // Random address
  const decodedIdentifier = "YES_OR_NO_QUERY";

  const defaultYesNoOptions = [
    { label: "Yes", value: "1", secondaryLabel: "1" },
    { label: "No", value: "0", secondaryLabel: "0" },
    { label: "Custom", value: "custom" },
    { label: "Unknown", value: "0.5", secondaryLabel: "50/50" },
  ];

  test("Case 1: Polymarket structure with Polymarket requester - should decode res_data and label as Polymarket", () => {
    const decodedAncillaryData =
      'q: title: XRP Up or Down - December 17, 6AM ET, description: This market will resolve to "Up" if the close price is greater than or equal to the open price for the XRP/USDT 1 hour candle that begins on the time and date specified in the title. Otherwise, this market will resolve to "Down". The resolution source for this market is information from Binance, specifically the XRP/USDT pair (https://www.binance.com/en/trade/XRP_USDT). The close « C » and open « O » displayed at the top of the graph for the relevant "1H" candle will be used once the data for that candle is finalized. Please note that this market is about the price according to Binance XRP/USDT, not according to other sources or spot markets. market_id: 939856 res_data: p1: 0, p2: 1, p3: 0.5. Where p1 corresponds to Down, p2 to Up, p3 to unknown/50-50. Updates made by the question creator via the bulletin board at 0x65070BE91477460D8A7AeEb94ef92fe056C2f2A7 as described by https://polygonscan.com/tx/0xa14f01b115c4913624fc3f508f960f4dea252758e73c28f5f07f8e19d7bca066 should be considered.,initializer:91430cad2d3975766499717fa0d66a78d814e5c5';

    const result = getQueryMetaData(
      decodedIdentifier,
      decodedAncillaryData,
      polymarketRequester,
    );

    expect(result.project).toBe("Polymarket");

    const expectedProposeOptions = [
      { label: "Down", value: "0", secondaryLabel: "p1" },
      { label: "Up", value: "1", secondaryLabel: "p2" },
      { label: "unknown/50-50", value: "0.5", secondaryLabel: "p3" },
      { label: "Custom", value: "custom" },
    ];

    expect(result.proposeOptions).toEqual(expectedProposeOptions);
    expect(result.proposeOptions).not.toEqual(defaultYesNoOptions);

    // Assert other metadata
    expect(result.umipNumber).toBe("umip-107");
    expect(result.title).toBe("XRP Up or Down - December 17, 6AM ET");
    expect(result.description).toBe(
      'This market will resolve to "Up" if the close price is greater than or equal to the open price for the XRP/USDT 1 hour candle that begins on the time and date specified in the title. Otherwise, this market will resolve to "Down". The resolution source for this market is information from Binance, specifically the XRP/USDT pair (https://www.binance.com/en/trade/XRP_USDT). The close « C » and open « O » displayed at the top of the graph for the relevant "1H" candle will be used once the data for that candle is finalized. Please note that this market is about the price according to Binance XRP/USDT, not according to other sources or spot markets. market_id: 939856 res_data: p1: 0, p2: 1, p3: 0.5. Where p1 corresponds to Down, p2 to Up, p3 to unknown/50-50. Updates made by the question creator via the bulletin board at 0x65070BE91477460D8A7AeEb94ef92fe056C2f2A7 as described by https://polygonscan.com/tx/0xa14f01b115c4913624fc3f508f960f4dea252758e73c28f5f07f8e19d7bca066 should be considered.,initializer:91430cad2d3975766499717fa0d66a78d814e5c5',
    );
  });

  test("Case 2: Polymarket structure with non-Polymarket requester - should decode res_data but NOT label as Polymarket", () => {
    const decodedAncillaryData =
      'q: title: Who will win: Spurs vs Thunder?, description: In the upcoming NBA game, scheduled for December 13 at 9:00PM ET: If the Spurs win, the market will resolve to "Spurs". If the Thunder win, the market will resolve to "Thunder". If the game is postponed, this market will remain open until the game has been completed. If the game is canceled entirely, with no make-up game, this market will resolve 50-50. The result will be determined based on the final score including any overtime periods. market_id: 303 res_data: p1: 0, p2: 1, p3: 0.5. Where p1 corresponds to Spurs, p2 to Thunder, p3 to unknown/50-50. Updates made by the question creator via the bulletin board at 0xa68F6B97f605f22ba6A8420460dafB5B5BC35A20 should be considered.,initializer:16b2b88c8c7f3af2f924b4445d7bffd88b4129fb';

    const result = getQueryMetaData(
      decodedIdentifier,
      decodedAncillaryData,
      nonPolymarketRequester,
    );

    expect(result.project).not.toBe("Polymarket");
    expect(result.project).toBe("Unknown");

    const expectedProposeOptions = [
      { label: "Spurs", value: "0", secondaryLabel: "p1" },
      { label: "Thunder", value: "1", secondaryLabel: "p2" },
      { label: "unknown/50-50", value: "0.5", secondaryLabel: "p3" },
      { label: "Custom", value: "custom" },
    ];

    expect(result.proposeOptions).toEqual(expectedProposeOptions);
    expect(result.proposeOptions).not.toEqual(defaultYesNoOptions);

    expect(
      result.proposeOptions?.some((opt) => opt.secondaryLabel?.startsWith("p")),
    ).toBe(true);

    expect(result.umipNumber).toBe("umip-107");
    expect(result.title).toBe("Who will win: Spurs vs Thunder?");
    expect(result.description).toBe(
      'In the upcoming NBA game, scheduled for December 13 at 9:00PM ET: If the Spurs win, the market will resolve to "Spurs". If the Thunder win, the market will resolve to "Thunder". If the game is postponed, this market will remain open until the game has been completed. If the game is canceled entirely, with no make-up game, this market will resolve 50-50. The result will be determined based on the final score including any overtime periods. market_id: 303 res_data: p1: 0, p2: 1, p3: 0.5. Where p1 corresponds to Spurs, p2 to Thunder, p3 to unknown/50-50. Updates made by the question creator via the bulletin board at 0xa68F6B97f605f22ba6A8420460dafB5B5BC35A20 should be considered.,initializer:16b2b88c8c7f3af2f924b4445d7bffd88b4129fb',
    );
  });

  test("Case 3: Polymarket structure with formatting error + Polymarket requester - should fallback to yes/no and label as Polymarket", () => {
    const decodedAncillaryData =
      'q: title: Solana Up or Down - December 17, 5AM ET, description: This market will resolve to "Up" if the close price is greater than or equal to the open price for the SOL/USDT 1 hour candle that begins on the time and date specified in the title. Otherwise, this market will resolve to "Down". The resolution source for this market is information from Binance, specifically the SOL/USDT pair (https://www.binance.com/en/trade/SOL_USDT). The close « C » and open « O » displayed at the top of the graph for the relevant "1H" candle will be used once the data for that candle is finalized. Please note that this market is about the price according to Binance SOL/USDT, not according to other sources or spot markets. market_id: 939774 res_data: p1; 0, p2; 1, p3; 0.5. Where p1 corresponds to Down, p2 to Up, p3 to unknown/50-50. Updates made by the question creator via the bulletin board at 0x65070BE91477460D8A7AeEb94ef92fe056C2f2A7 as described by https://polygonscan.com/tx/0xa14f01b115c4913624fc3f508f960f4dea252758e73c28f5f07f8e19d7bca066 should be considered.,initializer:91430cad2d3975766499717fa0d66a78d814e5c5';

    const result = getQueryMetaData(
      decodedIdentifier,
      decodedAncillaryData,
      polymarketRequester,
    );

    expect(result.project).toBe("Polymarket");

    expect(result.proposeOptions).toEqual(defaultYesNoOptions);

    // Assert other metadata
    expect(result.umipNumber).toBe("umip-107");
    expect(result.title).toBe("Solana Up or Down - December 17, 5AM ET");
    expect(result.description).toBe(
      'This market will resolve to "Up" if the close price is greater than or equal to the open price for the SOL/USDT 1 hour candle that begins on the time and date specified in the title. Otherwise, this market will resolve to "Down". The resolution source for this market is information from Binance, specifically the SOL/USDT pair (https://www.binance.com/en/trade/SOL_USDT). The close « C » and open « O » displayed at the top of the graph for the relevant "1H" candle will be used once the data for that candle is finalized. Please note that this market is about the price according to Binance SOL/USDT, not according to other sources or spot markets. market_id: 939774 res_data: p1; 0, p2; 1, p3; 0.5. Where p1 corresponds to Down, p2 to Up, p3 to unknown/50-50. Updates made by the question creator via the bulletin board at 0x65070BE91477460D8A7AeEb94ef92fe056C2f2A7 as described by https://polygonscan.com/tx/0xa14f01b115c4913624fc3f508f960f4dea252758e73c28f5f07f8e19d7bca066 should be considered.,initializer:91430cad2d3975766499717fa0d66a78d814e5c5',
    );
  });

  test("Case 4: Standard identifier structure (no res_data) - should use default yes/no options", () => {
    const decodedAncillaryData =
      "q:Did the Dallas Mavericks beat the Miami Heat January 6th, 2022?, p1:0, p2:1, p3:0.5, earlyExpiration:1";

    const result = getQueryMetaData(
      decodedIdentifier,
      decodedAncillaryData,
      polymarketRequester,
    );

    // no requester address in ancil data
    expect(result.project).toBe("Unknown");

    expect(result.proposeOptions).toEqual(defaultYesNoOptions);

    // Assert other metadata
    expect(result.umipNumber).toBe("umip-107");
    expect(result.title).toBe("YES_OR_NO_QUERY");
    expect(result.description).toBe(
      "q:Did the Dallas Mavericks beat the Miami Heat January 6th, 2022?, p1:0, p2:1, p3:0.5, earlyExpiration:1",
    );
  });
});
