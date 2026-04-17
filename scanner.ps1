$ROOT = (Get-Item "$PSScriptRoot\..").FullName
$OUT = "$PSScriptRoot\prompt\CONTEXT.md"
$DATE = Get-Date -Format "yyyy-MM-dd HH:mm"

Write-Host "Scan du projet AGT Frontend..." -ForegroundColor Cyan
Write-Host "   Racine : $ROOT"
Write-Host "   Sortie : $OUT"

Set-Location $ROOT

$content = @"
# CONTEXT - AGT Platform Frontend
Genere le : $DATE
Scanner : scanner.ps1 (Windows)

---

## STACK & DEMARRAGE

- **Framework** : Next.js 14 App Router
- **Langage** : TypeScript strict
- **Style** : Tailwind CSS + CSS Variables (dark/light mode)
- **Mock API** : JSON-Server port 4000
- **Frontend** : port 3000

\`\`\`bash
npm install
npm run dev
npm run dev:next
npm run dev:api
\`\`\`

## COMPTES DEMO

| Role | Email | Mot de passe |
|---|---|---|
| Admin AGT | admin@agt.com | n'importe lequel |
| PME Pharmacie | pharmacie@example.com | n'importe lequel |
| PME Cabinet | cabinet@example.com | n'importe lequel |

## VARIABLE CLE

Changer le backend : .env.local -> NEXT_PUBLIC_API_URL=https://api.votre-domaine.com

---

## ARBORESCENCE COMPLETE

\`\`\`
"@

$content += "`n# src/`n"
$srcFiles = Get-ChildItem -Path "src" -Recurse -Include "*.tsx","*.ts","*.css" |
    Where-Object { $_.FullName -notmatch "node_modules|\.next" } |
    Sort-Object FullName |
    ForEach-Object { $_.FullName.Replace($ROOT + "\", "").Replace("\", "/") }
$content += ($srcFiles -join "`n")

$content += @"

# Racine
\`\`\`

---

## FICHIERS CRITIQUES (contenu)

### src/types/api/index.ts
"@

$content += "``````typescript`n"
if (Test-Path "src\types\api\index.ts") {
    $content += Get-Content "src\types\api\index.ts" -Raw
} else { $content += "-- fichier absent --`n" }
$content += "``````"

$content += "`n`n### src/lib/constants.ts`n``````typescript`n"
if (Test-Path "src\lib\constants.ts") {
    $content += Get-Content "src\lib\constants.ts" -Raw
} else { $content += "-- fichier absent --`n" }
$content += "``````"

$content += "`n`n### src/lib/env.ts`n``````typescript`n"
if (Test-Path "src\lib\env.ts") {
    $content += Get-Content "src\lib\env.ts" -Raw
} else { $content += "-- fichier absent --`n" }
$content += "``````"

$content += "`n`n### src/repositories/index.ts (50 premieres lignes)`n``````typescript`n"
if (Test-Path "src\repositories\index.ts") {
    $content += (Get-Content "src\repositories\index.ts" | Select-Object -First 50) -join "`n"
} else { $content += "-- fichier absent --`n" }
$content += "`n``````"

$content += "`n`n### db/db.json (structure - 30 premieres lignes)`n``````json`n"
if (Test-Path "db\db.json") {
    $content += (Get-Content "db\db.json" | Select-Object -First 30) -join "`n"
} else { $content += "-- fichier absent --`n" }
$content += "`n``````"

$content += @"

---

## PALETTE COULEURS AGT

| Token | Valeur | Usage |
|---|---|---|
| #25D366 | Vert WhatsApp | Accent principal, succes |
| #075E54 | Vert fonce | Sidebar PME, boutons CTA |
| #128C7E | Vert mid | Hover boutons |
| #6C3CE1 | Violet | Sidebar Admin, accents IA |
| #2D1B69 | Violet fonce | Fond vocal |

CSS variables : --bg, --bg-card, --border, --text, --text-muted
Classes : .card, .input-base, .label-base, .btn-primary, .badge, .spinner

---

## ROUTES FRONTEND

| Route | Role | Layout |
|---|---|---|
| /login | Page connexion | Aucun |
| /pme/dashboard | Dashboard PME | Sidebar verte |
| /pme/bots | Gestion bots | Sidebar verte |
| /pme/services | Services | Sidebar verte |
| /pme/appointments | Rendez-vous | Sidebar verte |
| /pme/billing | Facturation | Sidebar verte |
| /pme/profile | Profil | Sidebar verte |
| /admin/dashboard | Dashboard Admin | Sidebar violette |
| /admin/tenants | Entreprises | Sidebar violette |
| /admin/bots | Bots globaux | Sidebar violette |
| /admin/subscriptions | Abonnements | Sidebar violette |
| /admin/providers | Fournisseurs | Sidebar violette |

---

## ETAT DU TODO

Voir TODO.md dans ce dossier pour le detail complet.

---
*Fin du contexte - relancer scanner.ps1 pour mettre a jour*
"@

[System.IO.File]::WriteAllText($OUT, $content, [System.Text.Encoding]::UTF8)

$lineCount = (Get-Content $OUT).Count
Write-Host "CONTEXT.md genere : $OUT" -ForegroundColor Green
Write-Host "   $lineCount lignes"