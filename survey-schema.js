/* ===========================================================
   Voss Portal – Mitarbeiter-Fragebogen · gemeinsames Schema
   Eine Quelle der Wahrheit für Formular (fragebogen.html)
   UND Auswertung (admin.html).
   =========================================================== */
(function(){
  var ROLES = ["Kundenberater","Shopleiter","Call Agent","Coach","GK-Spezialist","TSvOB"];

  var AREAS = [
    "Dashboard (persönliche Übersicht)",
    "Dashboard Shopleiter",
    "Dashboard CallCenter",
    "Auftragserfassung „Neuer Auftrag“",
    "Aufträge anzeigen",
    "BKM",
    "Prozesse und Regeln",
    "Aktionsübersicht PK / GK",
    "News",
    "Forum",
    "Voss Videochannel",
    "Statistiken (Shop-/Verkäuferebene)",
    "Ticket-System",
    "Mitarbeitergespräche / Reflektionen",
    "Shop Tagebuch",
    "Personal / Zeiterfassung (Stempeln)",
    "Dokumentenarchiv",
    "Telefonie / „Shop Zentrale übernehmen“",
    "Live-Stream / Chat"
  ];

  var DASH_POOL = [
    "Mein Umsatz heute / diesen Monat",
    "Meine Provision & Auszahlung",
    "Meine Quoten (#DABEI: tNPS, KeK, SpeedUp, OTV, BB-GK)",
    "Meine KPIs vs. Voss-Durchschnitt",
    "Offene Aufgaben / To-dos",
    "Offene Rückrufe",
    "Shop-Umsatz heute (mein Shop)",
    "Shop-Ranking / Vergleich mit anderen Shops",
    "Aktuelle Aktionen (PK/GK)",
    "News / wichtige Mitteilungen",
    "Live-Stream / Team-Chat",
    "Anwesenheit / wer ist heute da",
    "Ziele & Fortschritt (Monat/Quartal/Jahr)",
    "Top-Verkäufer / Bestenlisten",
    "Lagerbestand / Verfügbarkeit"
  ];

  var DASH_BALLAST = DASH_POOL.concat([
    "Push Provision-Tabelle",
    "Beteiligungsprovision-Balken",
    "Jahresbonus-Stufen"
  ]);

  var PRIO_POOL = [
    "Übersichtlicheres, persönliches Dashboard",
    "Schnellere / fehlerfreie Auftragserfassung",
    "Aktuellere Zahlen",
    "Bessere Handy-/Tablet-Bedienung",
    "Weniger Systeme (alles an einem Ort)",
    "Klarere Provisions-/Ziel-Darstellung",
    "Bessere Such-/Wissensfunktion",
    "Schnellere Ladezeiten",
    "Modernere Optik",
    "Bessere Team-/Coaching-Tools"
  ];

  var SECTIONS = [
    { title:"Einordnung", intro:"", questions:[
      { id:"q0_1", type:"text_short", label:"Wie heißt du?", required:true },
      { id:"q0_2", type:"single", label:"Welche Rolle hast du?", required:true, options:ROLES }
    ]},

    { title:"Gesamteindruck heutiges System", questions:[
      { id:"q1_1", type:"nps_0_10", required:true,
        label:"Wie wahrscheinlich würdest du das aktuelle Voss Portal einem neuen Kollegen als hilfreiches Arbeitswerkzeug weiterempfehlen?",
        hint:"0 = gar nicht · 10 = absolut" },
      { id:"q1_2", type:"scale_1_5", required:true,
        label:"Bitte bewerte das aktuelle Portal:",
        items:["Übersichtlichkeit / Aufgeräumtheit","Geschwindigkeit / Ladezeiten","Aktualität der angezeigten Zahlen","Verständlichkeit der Begriffe & Kennzahlen","Bedienung auf dem Handy / unterwegs","Optik / modernes Aussehen","Finde ich schnell, was ich suche"] },
      { id:"q1_3", type:"text_long", required:false, label:"Was funktioniert heute gut und sollte unbedingt bleiben?" },
      { id:"q1_4", type:"text_long", required:true, label:"Was nervt dich am meisten oder kostet dich täglich Zeit?", hint:"Konkrete Beispiele helfen uns am meisten." }
    ]},

    { title:"Nutzung & Bewertung der Bereiche", questions:[
      { id:"q2_1", type:"scale_1_5", required:true,
        label:"Wie wichtig ist dir jeder Bereich für deine tägliche Arbeit?",
        items:AREAS },
      { id:"q2_2", type:"multi", required:false, label:"Welche Bereiche sind heute zu kompliziert, veraltet oder unklar?", options:AREAS },
      { id:"q2_3", type:"multi", required:false, label:"Welche Bereiche nutzt du gar nicht – obwohl es sie gibt?", options:AREAS },
      { id:"q2_4", type:"text_short", required:false, label:"Fehlt dir ein Bereich / eine Funktion komplett? Wenn ja, welche?" }
    ]},

    { title:"Dein Dashboard", intro:"Ziel: für jede Rolle ein eigenes Dashboard. Sag uns, was bei DIR oben stehen soll.", questions:[
      { id:"q3_1", type:"rank", n:5, required:true,
        label:"Du öffnest morgens das Portal. Welche 5 Infos willst du sofort sehen?",
        hint:"In Reihenfolge bringen – Platz 1 = wichtigste.",
        options:DASH_POOL },
      { id:"q3_1_other", type:"text_short", required:false, label:"Sonstiges (falls oben nicht dabei):" },
      { id:"q3_2", type:"multi", required:false, label:"Welche Infos sind heute unwichtig / Ballast und könnten weg?", options:DASH_BALLAST },
      { id:"q3_3", type:"single", required:false, label:"Wie sollen Zahlen am liebsten dargestellt werden?",
        options:["Große, einfache Kacheln mit einer Kernzahl","Diagramme / Verlaufsgrafiken","Detaillierte Tabellen (wie heute)","Mischung – aber weniger gedrängt als heute"] },
      { id:"q3_4", type:"single", required:false, label:"Wie wichtig ist dir ein Vergleich (mit anderen Beratern / Shops)?",
        options:["Sehr motivierend – will ich sehen","Nur mein eigener Fortschritt zählt","Lieber Vergleich mit meinem Ziel als mit Kollegen","Egal"] },
      { id:"q3_5", type:"text_long", required:false, label:"Beschreibe in 1–3 Sätzen dein Wunsch-Dashboard." }
    ]},

    { title:"Auftragserfassung", questions:[
      { id:"q4_1", type:"scale_1_5", required:false,
        label:"Wie gut funktioniert die Auftragserfassung („Neuer Auftrag“) heute?",
        items:["Geschwindigkeit","Verständlichkeit der Eingabemasken","Wenige Fehler / Nacharbeit","Auffinden alter Aufträge"] },
      { id:"q4_2", type:"multi", required:false, label:"Wo entsteht beim Eintragen Frust oder entstehen Fehler?",
        options:["Falsche Tarifauswahl","Eingabe dauert zu lange","Eingabe ist zu komplex","Zu wenig Hilfestellungen"] },
      { id:"q4_3", type:"text_long", required:false, label:"Was würde die Auftragserfassung einfacher oder schneller machen?" }
    ]},

    { title:"Kommunikation, Wissen & Lernen", questions:[
      { id:"q5_1", type:"scale_1_5", required:false,
        label:"Wie gut wirst du heute über Wichtiges informiert (Aktionen, Preise, Prozesse)?",
        items:["News","Forum","Live-Stream / Chat","Prozesse und Regeln","Voss Videochannel"] },
      { id:"q5_2", type:"single", required:false, label:"Wo erfährst du Neuigkeiten tatsächlich zuerst?",
        options:["Portal-News","ROC News","Live-Stream / Chat im Portal","WhatsApp / private Chats","Teams","Von Kollegen mündlich","Vom Shopleiter"] },
      { id:"q5_3", type:"single", required:false, label:"Findest du Antworten zu Prozessen/Regeln schnell, wenn du sie brauchst?",
        options:["Ja, meistens","Teils/teils","Nein, ich frage lieber Kollegen","Nein, ich suche oft lange"] },
      { id:"q5_4", type:"text_short", required:false, label:"Welche Information suchst du am häufigsten und findest sie schlecht?" }
    ]},

    { title:"Deine Wünsche & Ideen", questions:[
      { id:"q6_1", type:"text_long", required:false, label:"Was wünschst du dir vom neuen System?" },
      { id:"q6_2", type:"text_long", required:false, label:"Was fehlt dir heute im Portal?" },
      { id:"q6_3", type:"text_long", required:false, label:"Was soll besser werden?" }
    ]},

    { title:"Neues System & Prioritäten", questions:[
      { id:"q7_1", type:"rank", n:3, required:true,
        label:"Wenn wir nur 3 Dinge zuerst besser machen können – welche?",
        hint:"Top 3 in Reihenfolge.", options:PRIO_POOL },
      { id:"q7_2", type:"single", required:false, label:"Wärst du bereit, das neue System vorab als Test-Nutzer auszuprobieren?",
        options:["Ja, gerne","Vielleicht","Nein"] },
      { id:"q7_3", type:"single", required:false, label:"Wie offen bist du gegenüber KI-Unterstützung (Zusammenfassungen, Vorschläge, smarte Suche)?",
        options:["Sehr offen","Neugierig, aber skeptisch","Eher zurückhaltend","Lieber ohne"] },
      { id:"q7_4", type:"text_long", required:false, label:"Eine einzige Sache, die du dem Entwicklerteam mitgeben würdest?" },
      { id:"q7_5", type:"text_short", required:false, label:"(Optional) Kontakt für Rückfragen / zum Testen (Durchwahl/E-Mail)" }
    ]}
  ];

  // Hilfsindex: alle Fragen flach
  var ALL = [];
  SECTIONS.forEach(function(s){ s.questions.forEach(function(q){ q._section=s.title; ALL.push(q); }); });

  window.SURVEY = {
    collection: "surveys",
    version: 1,
    roles: ROLES,
    scaleNa: "Nutze ich nicht / kenne ich nicht",
    sections: SECTIONS,
    all: ALL,
    byId: function(id){ for(var i=0;i<ALL.length;i++){ if(ALL[i].id===id) return ALL[i]; } return null; }
  };
})();
