/* MeerPakkers — dynamic affiliate-link endpoint v1
   Scheduled affiliate links are configured privately in Vercel through
   MP_SCHEDULED_CAMPAIGNS_JSON and are not exposed before their startsAt date.
*/
"use strict";

const baseLinks = require("../data/affiliate-links.json");

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
  if(!raw) return {affiliateLinks: []};
  try{
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {affiliateLinks: []};
  }catch(error){
    console.error("Invalid MP_SCHEDULED_CAMPAIGNS_JSON", error && error.message);
    return {affiliateLinks: []};
  }
}

module.exports = function handler(req, res){
  const today = todayInAmsterdam();
  const scheduled = scheduledPayload();
  const extraLinks = (Array.isArray(scheduled.affiliateLinks) ? scheduled.affiliateLinks : [])
    .filter(link => isPublicNow(link, today));

  const byDealId = new Map();
  (Array.isArray(baseLinks) ? baseLinks : []).forEach(link => byDealId.set(String(link.dealId || ""), link));
  extraLinks.forEach(link => byDealId.set(String(link.dealId || ""), link));

  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=120");
  res.setHeader("X-Robots-Tag", "noindex, nofollow");
  res.status(200).json(Array.from(byDealId.values()));
};
