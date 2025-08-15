import React, { useEffect } from "react";

function TradingViewTicker() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js";
    script.async = true;
    script.innerHTML = JSON.stringify({
      symbols: [
        { proName: "FOREXCOM:SPXUSD", title: "S&P 500" },
        { proName: "FOREXCOM:NSXUSD", title: "Nasdaq 100" },
        { proName: "INDEX:DAX", title: "DAX 40" },
        { proName: "INDEX:WIG20", title: "WIG20" },
        { proName: "FOREXCOM:DJI", title: "Dow Jones" }
      ],
      showSymbolLogo: true,
      colorTheme: "dark",
      isTransparent: true,
      displayMode: "adaptive",
      locale: "en"
    });
    document.getElementById("tradingview-ticker").appendChild(script);
  }, []);

  return (
    <div id="tradingview-ticker" style={{ width: "100%", marginBottom: "10px" }}></div>
  );
}

export default TradingViewTicker;
