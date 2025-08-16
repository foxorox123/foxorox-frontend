import React, { useEffect } from "react";

function CurrencyBox() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-market-overview.js";
    script.async = true;
    script.innerHTML = JSON.stringify({
      colorTheme: "dark",
      dateRange: "12M",
      showChart: true,
      locale: "en",
      width: "350",
      height: "400",
      tabs: [
        {
          title: "Forex",
          symbols: [
            { s: "FX:EURUSD" },
            { s: "FX:GBPUSD" },
            { s: "FX:USDJPY" },
            { s: "FX:AUDUSD" },
            { s: "FX:USDCAD" }
          ]
        }
      ]
    });
    document.getElementById("tradingview-currencybox").appendChild(script);
  }, []);

  return (
    <div
      id="tradingview-currencybox"
      style={{
        background: "#1e1e1e",
        borderRadius: 8,
        overflow: "hidden",
        marginLeft: 20
      }}
    />
  );
}

export default CurrencyBox;
