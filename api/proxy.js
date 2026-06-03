const FMP_KEY = process.env.FMP_KEY || "UujsAidIvr31uYlscoBBqplpUqUuSrB0";
const BASE = "https://financialmodelingprep.com/stable";
const CORS = {"Access-Control-Allow-Origin":"*","Access-Control-Allow-Methods":"GET, OPTIONS","Access-Control-Allow-Headers":"Content-Type"};
const EP = {gainers:"/biggest-gainers",losers:"/biggest-losers",actives:"/most-actives",screener:"/stock-screener",earnings:"/earnings-calendar",quote:"/quote",profile:"/profile"};
export default async function handler(req, res) {
  Object.entries(CORS).forEach(([k,v]) => res.setHeader(k,v));
  if (req.method === "OPTIONS") return res.status(200).end();
  const {type,symbol,from,to,marketCapMoreThan,marketCapLessThan,volumeMoreThan,sector,priceMoreThan,priceLowerThan,limit} = req.query;
  if (!type||!EP[type]) return res.status(400).json({error:"Invalid type"});
  let path = EP[type];
  if ((type==="quote"||type==="profile")&&symbol) path+="?symbol="+symbol;
  const p = new URLSearchParams({apikey:FMP_KEY});
  if(from)p.set("from",from);if(to)p.set("to",to);
  if(marketCapMoreThan)p.set("marketCapMoreThan",marketCapMoreThan);
  if(marketCapLessThan)p.set("marketCapLessThan",marketCapLessThan);
  if(volumeMoreThan)p.set("volumeMoreThan",volumeMoreThan);
  if(sector)p.set("sector",sector);
  if(priceMoreThan)p.set("priceMoreThan",priceMoreThan);
  if(priceLowerThan)p.set("priceLowerThan",priceLowerThan);
  if(type==="screener"){p.set("limit",limit||"250");p.set("exchange","NASDAQ,NYSE");}
  const sep=path.includes("?")?"&":"?";
  try{const r=await fetch(BASE+path+sep+p);const d=await r.json();return res.status(200).json(d);}
  catch(e){return res.status(500).json({error:e.message});}
}
