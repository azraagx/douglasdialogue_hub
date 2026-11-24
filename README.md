# #DOUGLASDialogue Hub

Interne Web-App, die durch den jährlichen #DOUGLASDialogue führt (Objective Setting, Mid-Year, Year-End).
Gebaut mit **React + TypeScript + Vite**. Das Ergebnis ist eine rein statische Website: kein Server, kein Login, keine Datenbank.

Diese Anleitung ist für Neuzugänge gedacht und führt Schritt für Schritt vom leeren Rechner bis zur ersten eigenen Änderung.

---

## Inhalt

1. [Was du brauchst](#1-was-du-brauchst)
2. [Projekt holen](#2-projekt-holen)
3. [Einrichten (einmalig)](#3-einrichten-einmalig)
4. [Website lokal starten](#4-website-lokal-starten)
5. [Windows: „Ausführung von Skripts ist deaktiviert“](#5-windows-ausführung-von-skripts-ist-deaktiviert)
6. [Täglicher Git-Ablauf](#6-täglicher-git-ablauf)
7. [Wo ändere ich was?](#7-wo-ändere-ich-was)
8. [Fertige Version bauen und veröffentlichen](#8-fertige-version-bauen-und-veröffentlichen)
9. [Alle Befehle auf einen Blick](#9-alle-befehle-auf-einen-blick)
10. [Häufige Probleme](#10-häufige-probleme)

---

## 1. Was du brauchst

| Programm | Wofür | Download |
|---|---|---|
| **Node.js** (Version LTS, mind. 18) | bringt `npm` mit, zum Installieren und Starten | https://nodejs.org |
| **Git** | Code holen, speichern, teilen | https://git-scm.com |
| **Visual Studio Code** | Editor | https://code.visualstudio.com |

**So installierst du sie:**

1. Bei Node.js die Version **LTS** herunterladen und mit den Standardeinstellungen installieren.
2. Git und VS Code ebenfalls mit den Standardeinstellungen installieren.
3. VS Code danach **komplett schließen und neu öffnen**, sonst findet das Terminal `npm` und `git` noch nicht. Im Zweifel den Rechner neu starten.

**Prüfen, ob alles da ist:** in VS Code **Terminal → Neues Terminal** öffnen und eingeben:

```bash
node -v
```

```bash
npm -v
```

```bash
git --version
```

Erscheint jeweils eine Versionsnummer, ist alles bereit.

> **Windows:** Meldet `npm -v` „Ausführung von Skripts ist deaktiviert“, ist Node trotzdem korrekt installiert. Lies dann [Abschnitt 5](#5-windows-ausführung-von-skripts-ist-deaktiviert).

---

## 2. Projekt holen

1. Im Terminal in den Ordner wechseln, in dem das Projekt liegen soll, z. B. „Dokumente“:

   ```bash
   cd Documents
   ```

2. Das Repository klonen. Den Link findest du auf GitHub über den grünen Button **Code**:

   ```bash
   git clone https://github.com/ORGANISATION/REPOSITORY.git
   ```

3. In VS Code **Datei → Ordner öffnen** wählen und den neuen Projektordner öffnen, also den Ordner, in dem die `package.json` liegt.
4. Fragt VS Code „Vertrauen Sie den Autoren?“, mit **Ja** bestätigen.

---

## 3. Einrichten (einmalig)

Im Terminal, im Projektordner:

```bash
npm install
```

Das lädt alle Abhängigkeiten in den Ordner `node_modules`. Das dauert etwa eine Minute und ist nur einmal nötig, außerdem nach einem `git pull`, wenn sich die `package.json` geändert hat.

> **Windows-Hinweis:** Klappt `npm install` nicht, nimm `npm.cmd install`. Mehr dazu in [Abschnitt 5](#5-windows-ausführung-von-skripts-ist-deaktiviert).

---

## 4. Website lokal starten

```bash
npm run dev
```

Im Terminal erscheint eine Adresse, z. B.:

```
  ➜  Local:   http://localhost:5173/
```

- **Öffnen:** Mit **Strg + Klick** (Mac: **Cmd + Klick**) auf die Adresse öffnet sich der Hub im Browser.
- **Änderungen:** Wenn du eine Datei änderst und speicherst, aktualisiert sich die Seite automatisch.
- **Beenden:** im Terminal **Strg + C** drücken.

Wichtig: Die Website braucht diesen lokalen Server. Ein Doppelklick auf eine `index.html` funktioniert nicht.

---

## 5. Windows: „Ausführung von Skripts ist deaktiviert“

Diese Fehlermeldung kommt oft in der Windows-PowerShell:

```
npm : Die Datei "C:\Program Files\nodejs\npm.ps1" kann nicht geladen werden,
da die Ausführung von Skripts auf diesem System deaktiviert ist.
```

Node ist trotzdem richtig installiert, nur PowerShell blockiert das Startskript. Es gibt drei Lösungen, nimm eine davon.

### Lösung A: `npm.cmd` statt `npm` (am einfachsten)

Schreibe überall `npm.cmd` statt `npm`:

```bash
npm.cmd install
```

```bash
npm.cmd run dev
```

```bash
npm.cmd run build
```

Das funktioniert sofort, ohne Einstellungen zu ändern.

### Lösung B: Eingabeaufforderung statt PowerShell

1. Im Terminal-Bereich von VS Code rechts oben auf den kleinen Pfeil **⌄** neben dem **+** klicken.
2. **Command Prompt** auswählen.
3. Dort funktionieren die normalen Befehle (`npm install`, `npm run dev`).

### Lösung C: Sperre für den eigenen Benutzer lockern

```bash
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
```

Die Frage mit **J** bestätigen. Danach funktioniert `npm` normal. Das betrifft nur dein Benutzerkonto. Auf Firmenrechnern kann die IT diese Einstellung gesperrt haben, dann nimm Lösung A.

> In dieser Anleitung steht immer `npm …`. Wenn du Lösung A verwendest, schreibst du einfach `npm.cmd …`.

---

## 6. Täglicher Git-Ablauf

### Die goldene Regel

**Immer zuerst pullen, bevor du anfängst zu arbeiten, und noch einmal, bevor du pushst.** So hast du den neuesten Stand der anderen und vermeidest Konflikte.

### Schritt für Schritt

**1. Auf den Hauptzweig wechseln und den neuesten Stand holen** (heißt er bei euch `master`, entsprechend ersetzen)

```bash
git checkout main
```

```bash
git pull
```

**2. Einen eigenen Branch für deine Änderung erstellen**

Nie direkt auf `main` arbeiten. Der Branch-Name sagt kurz, worum es geht:

```bash
git checkout -b feature/neue-faq-eintraege
```

Übliche Präfixe: `feature/…` (neue Funktion), `fix/…` (Fehler beheben), `content/…` (Texte ändern), `design/…` (Optik).

**3. Änderungen machen und lokal prüfen**

Dateien bearbeiten, mit `npm run dev` im Browser kontrollieren. Vor dem Commit einmal den Build testen, er findet Tippfehler im Code:

```bash
npm run build
```

**4. Ansehen, was sich geändert hat**

```bash
git status
```

**5. Änderungen vormerken und committen**

```bash
git add .
```

```bash
git commit -m "Zwei neue FAQs zum Mid-Year ergänzt"
```

Die Nachricht beschreibt kurz und konkret, **was** du geändert hast.

**6. Vor dem Push noch einmal den neuesten Stand holen**

```bash
git pull origin main
```

Gibt es dabei einen Konflikt, zeigt VS Code die betroffenen Stellen farbig an. Entscheide, welche Version bleibt, speichere, dann `git add .` und `git commit`.

**7. Branch hochladen (push)**

```bash
git push -u origin feature/neue-faq-eintraege
```

Ab dem zweiten Push auf demselben Branch reicht:

```bash
git push
```

**8. Pull Request erstellen**

Auf GitHub erscheint ein Hinweis „Compare & pull request“. Klicke darauf, beschreibe kurz deine Änderung und bitte jemanden um Review. Nach der Freigabe wird der Branch in `main` gemergt.

**9. Danach aufräumen**

```bash
git checkout main
```

```bash
git pull
```

### Git in VS Code ohne Terminal

Links in der Seitenleiste ist das Symbol **Quellcodeverwaltung** (drei verbundene Punkte). Dort kannst du Änderungen ansehen, mit **+** vormerken, eine Nachricht eingeben, **Commit** klicken und über **…** pullen und pushen. Unten links in der Statusleiste wechselst du den Branch.

---

## 7. Wo ändere ich was?

Alle Texte liegen als einfache Daten in `src/content/`. Für reine Textänderungen musst du keinen Layout-Code anfassen.

| Was | Datei |
|---|---|
| Phasen-Daten, SAP-/Copilot-Link, Support-Kontakt | `src/content/config.ts` |
| Phasen, Prozessschritte, Checklisten, „Next steps“ | `src/content/phases.ts` |
| FAQs und Artikel im Knowledge Center | `src/content/knowledge.ts` |
| Die sechs Copilot-Prompts | `src/content/prompts.ts` |
| Die drei Learning Nuggets | `src/content/nuggets.ts` |
| Kompetenzen, Bewertungsskala, Gewichtung | `src/content/competencies.ts` |
| Antworten des Dialogue Guide | `src/content/assistant.ts` |
| Navigation und Breadcrumbs | `src/content/navigation.ts` |
| Sprachen (EN aktiv, DE geplant) | `src/content/i18n.ts` |
| Bilder, Icons, Logos | `public/media/` |
| Farben, Schrift, Abstände | `src/styles/tokens.css`, `src/styles/douglas.css` |

Mehr Details, z. B. was pro Zyklus angepasst werden muss: **[MAINTENANCE.md](MAINTENANCE.md)** (auf Englisch).

### Projektstruktur

```
douglasdialogue-hub/
├── public/media/        Bilder, Icons, Logos
├── src/
│   ├── content/         alle Texte und Daten  ← hier wird am meisten geändert
│   ├── components/      wiederverwendbare Bausteine (Header, Suche, Checkliste …)
│   ├── pages/           die 8 Seiten
│   ├── styles/          Design (CSS)
│   └── lib/             Hilfsfunktionen (Suche, Assistent, Routing)
├── scripts/             Build-Hilfen, Sitemap-/Wireframe-Erzeugung
├── docs/                Sitemap & Wireframes (PDF)
├── package.json         Abhängigkeiten und Befehle
└── README.md            diese Datei
```

---

## 8. Fertige Version bauen und veröffentlichen

```bash
npm run build
```

Das erzeugt den Ordner **`dist/`**. Dessen kompletten Inhalt lädst du auf einen beliebigen Webserver, z. B. in einen Unterordner wie `/hr/dialogue-hub/`. Rewrite-Regeln sind nicht nötig: Jede der 8 Seiten hat ihre eigene `index.html`.

Die fertige Version lokal ansehen:

```bash
npm run preview
```

Dann die angezeigte Adresse öffnen, z. B. `http://localhost:4173`.

---

## 9. Alle Befehle auf einen Blick

| Befehl | Windows-Alternative | Was passiert |
|---|---|---|
| `npm install` | `npm.cmd install` | Abhängigkeiten installieren (einmalig, nach `package.json`-Änderungen) |
| `npm run dev` | `npm.cmd run dev` | Entwicklungsserver starten, Seite unter `localhost:5173` |
| `npm run build` | `npm.cmd run build` | Code prüfen und fertige Website in `dist/` erzeugen |
| `npm run preview` | `npm.cmd run preview` | fertige Website lokal ansehen |
| `npm run typecheck` | `npm.cmd run typecheck` | nur den Code prüfen |
| `git pull` | | neuesten Stand holen |
| `git checkout -b name` | | neuen Branch erstellen |
| `git status` | | Änderungen anzeigen |
| `git add .` | | alle Änderungen vormerken |
| `git commit -m "…"` | | Änderungen speichern |
| `git push` | | Änderungen hochladen |
| `Strg + C` | | laufenden Server beenden |

---

## 10. Häufige Probleme

| Problem | Lösung |
|---|---|
| `npm` wird nicht erkannt | Node.js ist nicht installiert, oder VS Code wurde danach nicht neu gestartet. |
| „Ausführung von Skripts ist deaktiviert“ | `npm.cmd` statt `npm` verwenden, siehe [Abschnitt 5](#5-windows-ausführung-von-skripts-ist-deaktiviert). |
| `package.json` nicht gefunden | Du bist im falschen Ordner. Mit `cd ordnername` in den Projektordner wechseln. |
| Seite bleibt weiß oder zeigt Fehler | Im Terminal nach roter Fehlermeldung schauen. Oft hilft `npm install` und danach erneut `npm run dev`. |
| Port 5173 ist belegt | Ein anderer Server läuft noch. Ihn mit `Strg + C` beenden, oder Vite nimmt automatisch den nächsten Port (siehe Terminal). |
| `git push` wird abgelehnt | Erst `git pull origin main`, Konflikte lösen, dann erneut pushen. |
| Merge-Konflikt | In VS Code die markierten Stellen auswählen („Accept Current / Incoming / Both“), speichern, `git add .`, `git commit`. |
| Versehentlich auf `main` gearbeitet | Noch nicht committed? `git checkout -b feature/name` nimmt die Änderungen in einen neuen Branch mit. |

---

### Gut zu wissen

- **Prototyp:** Der Hub ist ein Prototyp. Er verarbeitet keine personenbezogenen Daten. Checklisten-Häkchen bleiben nur im eigenen Browser.
- **SAP SuccessFactors:** Offizielle Schritte erfolgen ausschließlich dort, der Hub erklärt sie nur.
- **Dialogue Guide:** Er arbeitet regelbasiert mit lokalen Inhalten und ist nicht mit einer KI verbunden.
- **Keine Geheimnisse im Code:** Niemals Passwörter, API-Keys oder Mitarbeitendendaten ins Repository committen.
