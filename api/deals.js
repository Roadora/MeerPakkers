/* MeerPakkers — dynamic deals endpoint v1
   Base deals stay in data/deals.json. Embargoed/scheduled campaigns can be
   configured privately in Vercel via MP_SCHEDULED_CAMPAIGNS_JSON.
   Scheduled data is never returned before its startsAt date (Europe/Amsterdam).
*/
"use strict";

const baseDeals = require("../data/deals.json");

function todayInAmsterdam(){
  try{
    const parts = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Europe/Amsterdam",
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    }).formatToParts(new Date());
    const values = {};
    parts.forEach(part => { if(part.type !== "literal") values[part.type] = part.value; });
    if(values.year && values.month && values.day) return `${values.year}-${values.month}-${values.day}`;
  }catch(error){}
  return new Date().toISOString().slice(0, 10);
}

function isIsoDate(value){
  return /^\d{4}-\d{2}-\d{2}$/.test(String(value || ""));
}

function isPublicNow(entry, today){
  if(!entry || typeof entry !== "object") return false;
  const startsAt = String(entry.startsAt || "");
  const expiresAt = String(entry.expiresAt || "");
  if(isIsoDate(startsAt) && today < startsAt) return false;
  if(isIsoDate(expiresAt) && today > expiresAt) return false;
  return true;
}

function scheduledPayload(){
  const raw = String(process.env.MP_SCHEDULED_CAMPAIGNS_JSON || "").trim();
  if(!raw) return {deals: []};
  try{
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {deals: []};
  }catch(error){
    console.error("Invalid MP_SCHEDULED_CAMPAIGNS_JSON", error && error.message);
    return {deals: []};
  }
}

module.exports = function handler(req, res){
  const today = todayInAmsterdam();
  const scheduled = scheduledPayload();
  const extraDeals = (Array.isArray(scheduled.deals) ? scheduled.deals : [])
    .filter(deal => isPublicNow(deal, today));

  // A scheduled item with the same id replaces a base item, otherwise it is appended.
  const byId = new Map();
  (Array.isArray(baseDeals) ? baseDeals : []).forEach(deal => byId.set(String(deal.id || ""), deal));
  extraDeals.forEach(deal => byId.set(String(deal.id || ""), deal));

  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=120");
  res.setHeader("X-Robots-Tag", "noindex, nofollow");
  res.status(200).json(Array.from(byId.values()));
};
