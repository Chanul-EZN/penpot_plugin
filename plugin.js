/* EZN App Screens — Penpot plugin
   Draws Login, Einsatzdetails and Sensordetails as native, editable Penpot objects.
   Re-run any time from the Plugins menu to regenerate. */
 
(function () {
  // ---- Palette ---------------------------------------------------------
  var BLUE = "#127CA6";
  var TEXT = "#152C36";
  var SUB = "#6B828D";
  var LABEL = "#33505C";
  var BORDER = "#E1E8EC";
  var INPUTBG = "#F7FAFB";
  var PLACE = "#9AAAB2";
  var CARDBORDER = "#E8EDF0";
  var SECTION = "#9DB0B8";
  var WHITE = "#FFFFFF";
 
  // ---- Low-level helpers ----------------------------------------------
  function addChild(parent, shape) {
    if (!parent || !shape) return;
    try { parent.insertChild(parent.children.length, shape); return; } catch (e) {}
    try { parent.appendChild(shape); } catch (e) {}
  }
 
  function makeBoard(name, x) {
    var b = penpot.createBoard();
    b.name = name;
    b.resize(400, 860);
    b.x = x; b.y = 0;
    b.fills = [{ fillColor: WHITE, fillOpacity: 1 }];
    try { b.borderRadius = 36; } catch (e) {}
    try { b.strokes = [{ strokeColor: "#ECEFF1", strokeWidth: 1.5, strokeStyle: "solid", strokeAlignment: "center" }]; } catch (e) {}
    return b;
  }
 
  function rect(b, x, y, w, h, opts) {
    opts = opts || {};
    var r = penpot.createRectangle();
    r.resize(w, h);
    r.x = b.x + x; r.y = b.y + y;
    r.fills = opts.fill ? [{ fillColor: opts.fill, fillOpacity: opts.fo == null ? 1 : opts.fo }] : [];
    if (opts.stroke) {
      try { r.strokes = [{ strokeColor: opts.stroke, strokeWidth: opts.sw == null ? 1.5 : opts.sw, strokeStyle: "solid", strokeAlignment: "center" }]; } catch (e) {}
    }
    if (opts.radius != null) { try { r.borderRadius = opts.radius; } catch (e) {} }
    if (opts.name) r.name = opts.name;
    addChild(b, r);
    return r;
  }
 
  function text(b, x, y, str, opts) {
    opts = opts || {};
    var t = penpot.createText(str);
    if (!t) return null;
    var size = opts.size == null ? 14 : opts.size;
    try { t.fontSize = String(size); } catch (e) {}
    try { t.fontWeight = String(opts.weight == null ? 400 : opts.weight); } catch (e) {}
    try { t.fills = [{ fillColor: opts.color || TEXT, fillOpacity: 1 }]; } catch (e) {}
    if (opts.width) {
      try { t.growType = "fixed"; } catch (e) {}
      try { t.resize(opts.width, Math.round(size * 1.4)); } catch (e) {}
      try { t.align = opts.align || "left"; } catch (e) {}
    } else {
      try { t.growType = "auto-width"; } catch (e) {}
      try { t.align = opts.align || "left"; } catch (e) {}
    }
    if (opts.spacing != null) { try { t.letterSpacing = String(opts.spacing); } catch (e) {} }
    t.x = b.x + x; t.y = b.y + y;
    if (opts.name) t.name = opts.name;
    addChild(b, t);
    return t;
  }
 
  // ---- Composite helpers ----------------------------------------------
  function section(b, x, y, str) {
    text(b, x, y, str, { size: 11, weight: 700, color: SECTION, spacing: 1 });
  }
 
  // label + input box + placeholder. y = top of label. box sits at y+18.
  function field(b, x, y, w, label, placeholder, h) {
    h = h || 52;
    text(b, x, y, label, { size: 12.5, weight: 600, color: LABEL });
    rect(b, x, y + 18, w, h, { fill: INPUTBG, stroke: BORDER, radius: 11, name: label + " – field" });
    text(b, x + 16, y + 18 + Math.round((h - 16) / 2), placeholder, { size: 13.5, color: PLACE });
  }
 
  function dropdown(b, x, y, w, label, placeholder, h) {
    h = h || 52;
    field(b, x, y, w, label, placeholder, h);
    text(b, x + w - 26, y + 18 + Math.round((h - 16) / 2), "▾", { size: 13, color: SUB });
  }
 
  function button(b, x, y, w, label, h) {
    h = h || 54;
    rect(b, x, y, w, h, { fill: BLUE, radius: 12, name: label + " – button" });
    text(b, x, y + Math.round((h - 15) / 2) - 1, label, { size: 15, weight: 600, color: WHITE, align: "center", width: w });
  }
 
  function header(b, logoSize) {
    // logo placeholder (drop your real EZN image on top of this)
    text(b, 24, 22, "EZN", { size: logoSize || 18, weight: 800, color: BLUE, name: "EZN logo (replace)" });
    // logout pill
    rect(b, 270, 16, 106, 34, { fill: WHITE, stroke: BORDER, radius: 17, name: "Logout" });
    text(b, 300, 26, "Abmelden", { size: 12.5, weight: 600, color: BLUE });
    // divider
    rect(b, 16, 66, 368, 1.5, { fill: "#ECEFF1" });
  }
 
  // ---- Screens ---------------------------------------------------------
  function buildLogin(x) {
    var b = makeBoard("01 · Login", x);
    text(b, 40, 150, "EZN", { size: 34, weight: 800, color: BLUE, align: "center", width: 320, name: "EZN logo (replace)" });
    text(b, 40, 226, "Willkommen zurück", { size: 23, weight: 700, color: TEXT, align: "center", width: 320 });
    text(b, 40, 262, "Melden Sie sich bei Ihrem Konto an", { size: 14, color: SUB, align: "center", width: 320 });
    field(b, 40, 316, 320, "Benutzername", "Benutzername eingeben");
    field(b, 40, 410, 320, "Passwort", "••••••••");
    rect(b, 40, 512, 18, 18, { fill: WHITE, stroke: "#CBD5DB", radius: 5, name: "Checkbox" });
    text(b, 72, 513, "Angemeldet bleiben", { size: 13, color: SUB });
    button(b, 40, 556, 320, "Anmelden");
    text(b, 40, 636, "Ihre Zugangsdaten erhalten Sie von", { size: 12, color: "#93A6AF", align: "center", width: 320 });
    text(b, 40, 654, "Ihrem Administrator.", { size: 12, color: "#93A6AF", align: "center", width: 320 });
    return b;
  }
 
  function buildDetail(x) {
    var b = makeBoard("02 · Einsatzdetails", x);
    header(b);
    text(b, 24, 88, "Einsatzdetails", { size: 21, weight: 700, color: TEXT });
    text(b, 24, 116, "Bitte füllen Sie alle Felder aus.", { size: 13, color: SUB });
    rect(b, 16, 160, 368, 500, { fill: WHITE, stroke: CARDBORDER, radius: 20, name: "Form card" });
    section(b, 40, 178, "MONTEUR");
    field(b, 40, 196, 196, "Name", "Max Mustermann", 50);
    field(b, 252, 196, 108, "Initialen", "MM", 50);
    section(b, 40, 288, "OBJEKT");
    field(b, 40, 306, 320, "Adresse", "Straße und Hausnummer", 50);
    field(b, 40, 388, 108, "PLZ", "12345", 50);
    field(b, 164, 388, 196, "Ort", "Stadt", 50);
    section(b, 40, 480, "GERÄT & SENSOREN");
    field(b, 40, 498, 320, "Router-ID", "z. B. RT-00842", 50);
    field(b, 40, 578, 320, "Anzahl installierter Sensoren", "z. B. 12", 50);
    button(b, 16, 700, 368, "Scan starten");
    return b;
  }
 
  function buildSensor(x) {
    var b = makeBoard("03 · Sensordetails", x);
    header(b);
    text(b, 24, 88, "Sensordetails", { size: 21, weight: 700, color: TEXT });
    text(b, 24, 116, "Erfassen Sie die Sensordaten.", { size: 13, color: SUB });
    // MAC card
    rect(b, 16, 160, 368, 84, { fill: "#EAF4F8", stroke: "#CDE6F0", radius: 16, name: "MAC-Adresse card" });
    text(b, 36, 182, "MAC-ADRESSE", { size: 11, weight: 700, color: BLUE, spacing: 1 });
    text(b, 36, 202, "A4:C1:38:9F:2B:7E", { size: 18, weight: 600, color: "#0E3F52" });
    rect(b, 286, 194, 82, 24, { fill: BLUE, radius: 12, name: "Gescannt badge" });
    text(b, 300, 199, "✓ Gescannt", { size: 10.5, weight: 600, color: WHITE });
    // form
    rect(b, 16, 264, 368, 400, { fill: WHITE, stroke: CARDBORDER, radius: 20, name: "Form card" });
    field(b, 40, 290, 320, "Sensornummer", "z. B. 001");
    dropdown(b, 40, 384, 320, "Komponente", "Bitte wählen");
    dropdown(b, 40, 478, 320, "Positionierung", "Bitte wählen");
    field(b, 40, 572, 320, "Extra-Nummer (optional)", "Optional");
    button(b, 16, 700, 368, "+  Sensor hinzufügen");
    return b;
  }
 
  // ---- Run -------------------------------------------------------------
  function run() {
    var boards = [];
    try { boards.push(buildLogin(0)); } catch (e) {}
    try { boards.push(buildDetail(460)); } catch (e) {}
    try { boards.push(buildSensor(920)); } catch (e) {}
    try { penpot.selection = boards; } catch (e) {}
    try {
      var vp = penpot.viewport;
      if (vp && boards[0]) { vp.zoomIntoView ? vp.zoomIntoView(boards) : null; }
    } catch (e) {}
  }
 
  run();
  try { penpot.closePlugin && penpot.closePlugin(); } catch (e) {}
})();
