// ============================================================
//  Telekom Shop Incentive – zentrale Konfiguration
//  Wird von index.html UND admin.html verwendet.
// ============================================================

// --- 1) Firebase-Konfiguration --------------------------------
// Diese Werte bekommst du in der Firebase Console:
//   Projekt -> Projekteinstellungen -> Allgemein -> "Deine Apps" (Web-App)
// Einfach das Snippet hier einfuegen (Platzhalter ersetzen).
window.FIREBASE_CONFIG = {
  apiKey: "AIzaSyCDd-Jj3zgMlkTvMw59Vk8Aak4W-9mdk1I",
  authDomain: "telekom-shop-cup.firebaseapp.com",
  projectId: "telekom-shop-cup",
  storageBucket: "telekom-shop-cup.firebasestorage.app",
  messagingSenderId: "711188367861",
  appId: "1:711188367861:web:495e28304525961e70f8bc"
};

// --- 2) Admin-Passcode ----------------------------------------
// Schutz fuer die Eingabeseite (admin.html). Frei waehlbar.
// Hinweis: Das ist ein einfacher Zugriffsschutz fuer den internen
// Gebrauch, keine harte Sicherheit. Wer den Code kennt, kann eintragen.
window.ADMIN_PASSCODE = "telekom2026";

// --- 3) Event-Zeitraum ----------------------------------------
window.EVENT = {
  name: "Telekom Shop Cup",
  start: "2026-06-05T00:00:00",
  end:   "2026-06-13T23:59:59"
};

// --- 4) Relevante Produkte ------------------------------------
window.PRODUCTS = [
  { key: "breitband", label: "Breitband Neu", sub: "PK / GK" },
  { key: "magentatv", label: "MagentaTV Neu", sub: "Neuaktivierung" }
];

// --- 5) Shops & Gruppen ---------------------------------------
// 16 Shops, 4 Gruppen zu je 4. id muss eindeutig & stabil sein.
window.SHOPS = [
  { id: "brilon",          name: "Brilon",            group: "A" },
  { id: "greven",          name: "Greven",            group: "A" },
  { id: "ahlen",           name: "Ahlen",             group: "A" },
  { id: "werl",            name: "Werl",              group: "A" },

  { id: "duelmen",         name: "Dülmen",            group: "B" },
  { id: "cloppenburg",     name: "Cloppenburg",       group: "B" },
  { id: "bad-salzuflen",   name: "Bad Salzuflen",     group: "B" },
  { id: "rheda",           name: "Rheda-Wiedenbrück", group: "B" },

  { id: "oelde",           name: "Oelde",             group: "C" },
  { id: "korbach",         name: "Korbach",           group: "C" },
  { id: "emsdetten",       name: "Emsdetten",         group: "C" },
  { id: "bramsche",        name: "Bramsche",          group: "C" },

  { id: "hoexter",         name: "Höxter",            group: "D" },
  { id: "luedinghausen",   name: "Lüdinghausen",      group: "D" },
  { id: "beckum",          name: "Beckum",            group: "D" },
  { id: "warendorf",       name: "Warendorf",         group: "D" }
];

window.GROUPS = ["A", "B", "C", "D"];

// --- 6) Scoring-Logik (zentral, von beiden Seiten genutzt) ----
// Regel:
//  * Werte werden als Prozent der Zielerreichung eingegeben.
//  * Ein Produkt zaehlt NUR mit, wenn es selbst >= 100% erreicht.
//    Produkte unter 100% zaehlen 0 Punkte.
//  * Ein Shop ist qualifiziert, wenn MINDESTENS ein Produkt >= 100%.
//  * Gesamtpunktzahl = Summe der Prozentwerte aller Produkte, die >= 100% sind.
//  Beispiele:
//    Breitband 108% / TV 90%  -> 108 Punkte (nur Breitband zaehlt)
//    Breitband 102% / TV 104% -> 206 Punkte (beide zaehlen)
//    Breitband 90%  / TV 95%  ->   0 Punkte (nicht qualifiziert)
window.computeScore = function (breitband, magentatv) {
  const bb = Number(breitband) || 0;
  const tv = Number(magentatv) || 0;
  const bbHit = bb >= 100;
  const tvHit = tv >= 100;
  const qualified = bbHit || tvHit;
  let total = 0;
  if (bbHit) total += bb;
  if (tvHit) total += tv;
  total = Math.round(total * 10) / 10;
  return { bb, tv, qualified, total };
};

// --- 6b) Soll/Ist-Modell -------------------------------------
// Im Backend werden je Produkt ein ZIEL (Soll) und der IST-Stand
// eingegeben. Daraus wird die Prozent-Zielerreichung berechnet:
//   % = round(Ist / Ziel * 100)   (Ziel 0 -> 0%)
// "rest" = noch fehlende Zaehler bis 100% = max(0, Ziel - Ist).
window.shopPercents = function (d) {
  d = d || {};
  const bbZiel = Number(d.breitbandZiel) || 0;
  const bbIst  = Number(d.breitbandIst)  || 0;
  const tvZiel = Number(d.magentatvZiel) || 0;
  const tvIst  = Number(d.magentatvIst)  || 0;
  const bb = bbZiel > 0 ? Math.round((bbIst / bbZiel) * 100) : 0;
  const tv = tvZiel > 0 ? Math.round((tvIst / tvZiel) * 100) : 0;
  return {
    bb: bb, tv: tv,
    bbZiel: bbZiel, bbIst: bbIst, tvZiel: tvZiel, tvIst: tvIst,
    bbRest: Math.round(Math.max(0, bbZiel - bbIst) * 100) / 100,
    tvRest: Math.round(Math.max(0, tvZiel - tvIst) * 100) / 100
  };
};

// Ermittelt je Gruppe den Sieger (hoechste Gesamtpunktzahl unter
// qualifizierten Shops). Gibt ein Objekt { A: shopId|null, ... } zurueck.
// Bei Gleichstand wird der zuerst gefundene Shop als Sieger markiert.
window.computeGroupWinners = function (shopData) {
  const winners = {};
  window.GROUPS.forEach(function (g) {
    let best = null;
    window.SHOPS.filter(function (s) { return s.group === g; }).forEach(function (s) {
      const d = shopData[s.id] || {};
      const p = window.shopPercents(d);
      const sc = window.computeScore(p.bb, p.tv);
      if (sc.qualified && (best === null || sc.total > best.total)) {
        best = { id: s.id, total: sc.total };
      }
    });
    winners[g] = best ? best.id : null;
  });
  return winners;
};

// ============================================================
//  MAGENTA CUP CLASH  (zweites Incentive, eigener Reiter)
// ============================================================
// Mechanik (laut Portal-Post 4930):
//  * Zwei KPI je Team:  BB Neu  und  PP Neu PK.
//  * Drei Stufen (Pokale): Bronze / Silber / Gold.
//      - BB Neu: absolute Monats-Staffel je Shop (Bronze=S1, Silber=S2, Gold=S3).
//      - PP Neu PK: Prozent vom SOLL  (Bronze=100%, Silber=115%, Gold=130%).
//  * Team-Trophäe = die SCHWÄCHERE der beiden KPI-Stufen
//    (Beispiel: BB Gold + PP Silber  ->  Trophäe Silber).
//  * Grundvoraussetzung (Gates, Betreiberebene je Shop):
//      PP VVL >= 100 %,  MagentaTV >= 130 %,  TV AQ >= 90 %.
//    Sind die Gates nicht erfüllt, ist die Trophäe (noch) gesperrt.
window.CUPCLASH = {
  name:  "Magenta Cup Clash",
  start: "2026-06-01T00:00:00",
  end:   "2026-06-30T23:59:59",
  note:  "Runde Juni · danach geht es in die nächste Runde",
  ppSilberFaktor: 1.15,
  ppGoldFaktor:   1.30,
  gates: [
    { key: "tvAq",  label: "MagentaTV AQ", min: 90 }
  ]
};

// Teams = die 16 Shops mit Teamname + Zielen.
//  bbB/bbS/bbG = BB-Neu-Staffel Bronze/Silber/Gold (absolute Stückzahl, Juni).
//  ppSoll      = PP-Neu-PK SOLL (100%); Silber/Gold = SOLL * Faktor (oben).
// Hinweis: Teamnamen für duelmen/emsdetten/greven/luedinghausen/werl stehen
// noch aus -> vorerst Ortsname, im Backend editierbar.
window.CC_TEAMS = [
  { id: "ahlen",         team: "1. FC Funkloch",  bbB: 34, bbS: 37, bbG: 40, ppSoll: 39 },
  { id: "bad-salzuflen", team: "Team Vielfalt",   bbB: 31, bbS: 35, bbG: 37, ppSoll: 37 },
  { id: "beckum",        team: "CR7 Elite",       bbB: 43, bbS: 47, bbG: 50, ppSoll: 50 },
  { id: "bramsche",      team: "Die Zauberer",    bbB: 25, bbS: 27, bbG: 29, ppSoll: 29 },
  { id: "brilon",        team: "HSK",             bbB: 28, bbS: 31, bbG: 33, ppSoll: 39 },
  { id: "cloppenburg",   team: "Aluhutträger",    bbB: 40, bbS: 44, bbG: 48, ppSoll: 47 },
  { id: "duelmen",       team: "Dülmen",          bbB: 29, bbS: 32, bbG: 35, ppSoll: 34 },
  { id: "emsdetten",     team: "Emsdetten",       bbB: 34, bbS: 37, bbG: 40, ppSoll: 39 },
  { id: "greven",        team: "Greven",          bbB: 34, bbS: 37, bbG: 40, ppSoll: 39 },
  { id: "hoexter",       team: "Die SIMulanten",  bbB: 29, bbS: 32, bbG: 35, ppSoll: 34 },
  { id: "korbach",       team: "KB Turbine",      bbB: 28, bbS: 31, bbG: 33, ppSoll: 42 },
  { id: "luedinghausen", team: "Lüdinghausen",    bbB: 31, bbS: 35, bbG: 37, ppSoll: 37 },
  { id: "oelde",         team: "FC Schufa 04",    bbB: 27, bbS: 30, bbG: 32, ppSoll: 32 },
  { id: "rheda",         team: "Schnappershop",   bbB: 31, bbS: 35, bbG: 37, ppSoll: 37 },
  { id: "warendorf",     team: "Tele Champions",  bbB: 40, bbS: 44, bbG: 48, ppSoll: 47 },
  { id: "werl",          team: "Werl",            bbB: 20, bbS: 22, bbG: 24, ppSoll: 24 }
];

window.CC_TIER_NAMES = ["—", "Bronze", "Silber", "Gold"];

// Stufe für absolute Schwellen: 0=keine,1=Bronze,2=Silber,3=Gold.
window.ccTier = function (ist, b, s, g) {
  ist = Number(ist) || 0;
  if (g > 0 && ist >= g) return 3;
  if (s > 0 && ist >= s) return 2;
  if (b > 0 && ist >= b) return 1;
  return 0;
};

// PP-Schwellen (absolute Stückzahl) aus dem SOLL.
window.ccPpThresholds = function (soll) {
  soll = Number(soll) || 0;
  return {
    bronze: soll,
    silber: Math.ceil(soll * window.CUPCLASH.ppSilberFaktor),
    gold:   Math.ceil(soll * window.CUPCLASH.ppGoldFaktor)
  };
};

// Liefert die effektiven Ziele eines Teams (config + evtl. Overrides aus Firestore).
window.ccTargets = function (teamCfg, d) {
  d = d || {};
  const bbB = d.ccBbB != null ? Number(d.ccBbB) : teamCfg.bbB;
  const bbS = d.ccBbS != null ? Number(d.ccBbS) : teamCfg.bbS;
  const bbG = d.ccBbG != null ? Number(d.ccBbG) : teamCfg.bbG;
  const ppSoll = d.ccPpSoll != null ? Number(d.ccPpSoll) : teamCfg.ppSoll;
  const def = window.ccPpThresholds(ppSoll);
  // PP hat eigene Bronze/Silber/Gold-Schwellen (vorbelegt aus dem Soll, editierbar).
  const ppB = d.ccPpB != null ? Number(d.ccPpB) : def.bronze;
  const ppS = d.ccPpS != null ? Number(d.ccPpS) : def.silber;
  const ppG = d.ccPpG != null ? Number(d.ccPpG) : def.gold;
  return { bbB: bbB, bbS: bbS, bbG: bbG, ppSoll: ppSoll, ppB: ppB, ppS: ppS, ppG: ppG };
};

// Komplettes Team-Ergebnis für Anzeige/Wertung.
window.ccTeamResult = function (teamCfg, d) {
  d = d || {};
  const t = window.ccTargets(teamCfg, d);
  const bbIst = Number(d.ccBbIst) || 0;
  const ppIst = Number(d.ccPpIst) || 0;
  const bbTier = window.ccTier(bbIst, t.bbB, t.bbS, t.bbG);
  const ppTier = window.ccTier(ppIst, t.ppB, t.ppS, t.ppG);
  const trophy = Math.min(bbTier, ppTier);          // schwächeres KPI entscheidet

  // Gates
  const gateVals = { ppVvl: Number(d.ccPpVvl) || 0, mtv: Number(d.ccMtv) || 0, tvAq: Number(d.ccTvAq) || 0 };
  const gateStatus = window.CUPCLASH.gates.map(function (g) {
    return { key: g.key, label: g.label, min: g.min, val: gateVals[g.key], ok: gateVals[g.key] >= g.min };
  });
  const gatesOk = gateStatus.every(function (g) { return g.ok; });
  const trophyEffective = gatesOk ? trophy : 0;     // ohne Gates keine Wertung

  return {
    targets: t,
    bbIst: bbIst, ppIst: ppIst,
    bbTier: bbTier, ppTier: ppTier,
    trophy: trophy, trophyEffective: trophyEffective,
    bbPct: t.bbG > 0 ? Math.round(bbIst / t.bbG * 100) : 0,
    ppPct: t.ppB > 0 ? Math.round(ppIst / t.ppB * 100) : 0,
    gates: gateStatus, gatesOk: gatesOk,
    // "noch X bis zur nächsten Stufe" je KPI
    bbNext: window.ccNextNeed(bbIst, t.bbB, t.bbS, t.bbG),
    ppNext: window.ccNextNeed(ppIst, t.ppB, t.ppS, t.ppG)
  };
};

// Wie viele Zähler fehlen bis zur nächsten Stufe? null wenn schon Gold.
window.ccNextNeed = function (ist, b, s, g) {
  ist = Number(ist) || 0;
  if (ist < b) return { tier: "Bronze", need: b - ist };
  if (ist < s) return { tier: "Silber", need: s - ist };
  if (ist < g) return { tier: "Gold",   need: g - ist };
  return null;
};

// --- Auszahlung (€ pro Stück, je nach erreichter Pokalstufe) ----
//  Stufe 1=Bronze, 2=Silber, 3=Gold.
window.CC_PAYOUT = {
  1: { bb: 5,  pp: 2.5 },
  2: { bb: 7,  pp: 3.5 },
  3: { bb: 14, pp: 7   }
};
// €-Verdienst eines Mitarbeiters: Stückzahl BB/PP * Satz der Team-Stufe.
// tier 0 (oder Gate nicht erfüllt) -> 0 €.
window.ccEarning = function (bb, pp, tier) {
  const r = window.CC_PAYOUT[tier];
  if (!r) return 0;
  return (Number(bb) || 0) * r.bb + (Number(pp) || 0) * r.pp;
};
