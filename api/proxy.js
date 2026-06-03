const FMP_KEY = process.env.FMP_KEY || "UujsAidIvr31uYlscoBBqplpUqUuSrB0";
const BASE = "https://financialmodelingprep.com/api/v3";

const CORS = {
  "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      };

      const ENDPOINTS = {
        gainers:  "/gainers",
          losers:   "/losers",
            actives:  "/actives",
              screener: "/stock-screener",
                earnings: "/earning_calendar",
                  quote:    "/quote",
                    profile:  "/profile",
                    };

                    export default async function handler(req, res) {
                      Object.entries(CORS).forEach(([k,v]) => res.setHeader(k,v));
                        if (req.method === "OPTIONS") return res.status(200).end();

                          const { type, symbol, from, to, marketCapMoreThan, marketCapLessThan,
                                    volumeMoreThan, sector, priceMoreThan, priceLowerThan, limit } = req.query;

                                      if (!type || !ENDPOINTS[type])
                                          return res.status(400).json({ error: "Invalid type. Use: " + Object.keys(ENDPOINTS).join(", ") });

                                            let path = ENDPOINTS[type];
                                              if ((type === "quote" || type === "profile") && symbol) path += "/" + symbol;

                                                const params = new URLSearchParams({ apikey: FMP_KEY });
                                                  if (from)              params.set("from", from);
                                                    if (to)                params.set("to", to);
                                                      if (marketCapMoreThan) params.set("marketCapMoreThan", marketCapMoreThan);
                                                        if (marketCapLessThan) params.set("marketCapLessThan", marketCapLessThan);
                                                          if (volumeMoreThan)    params.set("volumeMoreThan", volumeMoreThan);
                                                            if (sector)            params.set("sector", sector);
                                                              if (priceMoreThan)     params.set("priceMoreThan", priceMoreThan);
                                                                if (priceLowerThan)    params.set("priceLowerThan", priceLowerThan);
                                                                  if (limit)             params.set("limit", limit);
                                                                    if (type === "screener") {
                                                                        params.set("limit", limit || "250");
                                                                            params.set("exchange", "NASDAQ,NYSE");
                                                                              }

                                                                                try {
                                                                                    const r = await fetch(`${BASE}${path}?${params}`);
                                                                                        const data = await r.json();
                                                                                            return res.status(200).json(data);
                                                                                              } catch(e) {
                                                                                                  return res.status(500).json({ error: e.message });
                                                                                                    }
                                                                                                    }
