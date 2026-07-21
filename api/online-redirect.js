/* MeerPakkers — Online.nl Daisycon feed resolver v1
   Selecteert bij iedere klik een actuele trackinglink uit campagne 14155.
   Zo blijft media-ID 422185 leidend zonder een productlink handmatig vast te zetten.
*/
"use strict";

const FEED_URL = "https://daisycon.io/datafeed/?media_id=422185&standard_id=22&language_code=nl&locale_id=1&type=JSON&program_id=14155&html_transform=none&rawdata=false&encoding=utf8&general=false";
const FALLBACKS = Object.freeze({
  "internet-tv": "https://www.online.nl/dikkedeal/dsl/",
  "internet-only": "https://www.online.nl/dikkedeal/internet/dsl/"
});
const CACHE_TTL_MS = 15 * 60 * 1000;
let cachedFeed = null;
let cachedAt = 0;

function scalarText(value){
  if(value == null) return "";
  if(typeof value === "string" || typeof value === "number" || typeof value === "boolean") return String(value);
  if(Array.isArray(value)) return value.filter(item => ["string","number","boolean"].includes(typeof item)).join(" ");
  return "";
}

function directText(obj){
  if(!obj || typeof obj !== "object" || Array.isArray(obj)) return "";
  return Object.keys(obj).map(key => key + " " + scalarText(obj[key])).join(" ").toLowerCase();
}

function collectObjects(value, output, seen){
  if(!value || typeof value !== "object" || seen.has(value)) return;
  seen.add(value);
  if(!Array.isArray(value)) output.push(value);
  Object.values(value).forEach(child => collectObjects(child, output, seen));
}

function collectUrls(value, output, depth){
  if(depth > 3 || value == null) return;
  if(typeof value === "string"){
    if(/^https?:\/\//i.test(value.trim())) output.push(value.trim());
    return;
  }
  if(Array.isArray(value)){
    value.forEach(child => collectUrls(child, output, depth + 1));
    return;
  }
  if(typeof value === "object"){
    Object.entries(value).forEach(([key, child]) => {
      if(typeof child === "string" && /(url|link|deeplink|tracking|click)/i.test(key) && /^https?:\/\//i.test(child.trim())){
        output.push(child.trim());
      } else if(depth < 2){
        collectUrls(child, output, depth + 1);
      }
    });
  }
}

function productScore(text, kind){
  let score = 0;
  const has = token => text.includes(token);
  if(kind === "internet-tv"){
    if(has("internet & tv") || has("internet en tv") || has("internet+tv")) score += 70;
    if(has(" tv") || has("televisie")) score += 25;
    if(has("internet")) score += 15;
    if(has("150")) score += 20;
    if(has("198")) score += 20;
    if(has("internet only") || has("alleen internet")) score -= 80;
  } else {
    if(has("internet only") || has("alleen internet")) score += 80;
    if(has("internet")) score += 20;
    if(has("110")) score += 20;
    if(has("180")) score += 20;
    if(has("internet & tv") || has("internet en tv") || has("televisie")) score -= 70;
  }
  if(has("cashback")) score += 10;
  if(has("9 maanden")) score += 10;
  return score;
}

function urlScore(url){
  const lower = String(url || "").toLowerCase();
  let score = 0;
  if(lower.includes("wi=422185")) score += 120;
  if(lower.includes("jf79.net") || lower.includes("daisycon") || lower.includes("/c/?")) score += 90;
  if(lower.includes("program_id=14155") || lower.includes("si=14155")) score += 40;
  if(lower.includes("static-dscn") || /\.(png|jpe?g|gif|webp|svg)(\?|$)/.test(lower)) score -= 180;
  return score;
}

function addSubId(url, kind){
  try{
    const parsed = new URL(url);
    const subId = kind === "internet-tv" ? "mp-online-internet-tv" : "mp-online-internet-only";
    if(parsed.searchParams.has("ws")) parsed.searchParams.set("ws", subId);
    else parsed.searchParams.append("ws", subId);
    return parsed.toString();
  }catch(error){
    return url;
  }
}

function selectTrackingUrl(feed, kind){
  const objects = [];
  collectObjects(feed, objects, new Set());
  let best = null;

  objects.forEach(obj => {
    const text = directText(obj);
    const pScore = productScore(text, kind);
    if(pScore <= 0) return;
    const urls = [];
    collectUrls(obj, urls, 0);
    const uniqueUrls = [...new Set(urls)];
    uniqueUrls.forEach(url => {
      const total = pScore + urlScore(url);
      if(!best || total > best.score) best = {url, score: total};
    });
  });

  if(!best || urlScore(best.url) < 80) return null;
  return addSubId(best.url, kind);
}

async function loadFeed(){
  const now = Date.now();
  if(cachedFeed && now - cachedAt < CACHE_TTL_MS) return cachedFeed;
  const response = await fetch(FEED_URL, {
    headers: {"accept": "application/json", "user-agent": "MeerPakkers/1.0 (+https://www.meerpakkers.nl)"}
  });
  if(!response.ok) throw new Error("Daisycon feed responded with " + response.status);
  cachedFeed = await response.json();
  cachedAt = now;
  return cachedFeed;
}

module.exports = async function handler(req, res){
  const rawKind = Array.isArray(req.query && req.query.deal) ? req.query.deal[0] : (req.query && req.query.deal);
  const kind = rawKind === "internet-only" ? "internet-only" : "internet-tv";
  res.setHeader("Cache-Control", "s-maxage=900, stale-while-revalidate=3600");
  res.setHeader("X-Robots-Tag", "noindex, nofollow");

  try{
    const feed = await loadFeed();
    const trackingUrl = selectTrackingUrl(feed, kind);
    if(trackingUrl){
      res.setHeader("X-MP-Affiliate-Source", "daisycon-feed");
      res.redirect(302, trackingUrl);
      return;
    }
    throw new Error("No matching Daisycon tracking URL found");
  }catch(error){
    // Bezoeker krijgt nooit een dode knop. De fallback is officieel maar niet affiliate-getrackt.
    res.setHeader("X-MP-Affiliate-Source", "official-fallback");
    res.redirect(302, FALLBACKS[kind]);
  }
};
