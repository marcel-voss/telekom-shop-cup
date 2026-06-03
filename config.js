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
//  * Ein Shop ist qualifiziert, wenn MINDESTENS ein Produkt >= 100%.
//  * Nur dann zaehlt die Gesamtpunktzahl = Breitband% + MagentaTV%.
//  * Ist kein Produkt >= 100%, gibt es 0 Punkte (kein Gewinn moeglich).
window.computeScore = function (breitband, magentatv) {
  const bb = Number(breitband) || 0;
  const tv = Number(magentatv) || 0;
  const qualified = bb >= 100 || tv >= 100;
  const total = qualified ? Math.round((bb + tv) * 10) / 10 : 0;
  return { bb, tv, qualified, total };
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
      const sc = window.computeScore(d.breitband, d.magentatv);
      if (sc.qualified && (best === null || sc.total > best.total)) {
        best = { id: s.id, total: sc.total };
      }
    });
    winners[g] = best ? best.id : null;
  });
  return winners;
};
