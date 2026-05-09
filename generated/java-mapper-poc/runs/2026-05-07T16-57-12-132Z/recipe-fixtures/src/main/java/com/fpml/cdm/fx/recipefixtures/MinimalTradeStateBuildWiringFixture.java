package com.fpml.cdm.fx.recipefixtures;

public final class MinimalTradeStateBuildWiringFixture {
  public cdm.event.common.TradeState build() {
    cdm.event.common.Trade trade = cdm.event.common.Trade.builder().build();
    return cdm.event.common.TradeState.builder().setTrade(trade).build();
  }
}
