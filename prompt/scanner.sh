#!/bin/bash
# ═══════════════════════════════════════════════════════════════════════
# AGT Platform Frontend — Scanner de contexte
# Usage : bash .prompt/scanner.sh
# Génère CONTEXT.md dans .prompt/ pour alimenter Claude
# ═══════════════════════════════════════════════════════════════════════

set -e
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT="$ROOT/.prompt/CONTEXT.md"
DATE=$(date '+%Y-%m-%d %H:%M')

echo "🔍 Scan du projet AGT Frontend..."
echo "   Racine : $ROOT"
echo "   Sortie : $OUT"

cat > "$OUT" << HEADER
# CONTEXT — AGT Platform Frontend
Généré le : $DATE
Scanner : scanner.sh (Linux/Mac)

---

## STACK & DÉMARRAGE

- **Framework** : Next.js 14 App Router
- **Langage** : TypeScript strict
- **Style** : Tailwind CSS + CSS Variables (dark/light mode)
- **Mock API** : JSON-Server port 4000
- **Frontend** : port 3000

\`\`\`bash
npm install
npm run dev          # Next.js + JSON-Server simultanément
npm run dev:next     # Next.js seul (backend réel)
npm run dev:api      # JSON-Server seul
\`\`\`

## COMPTES DÉMO

| Rôle | Email | Mot de passe |
|---|---|---|
| Admin AGT | admin@agt.com | n'importe lequel |
| PME Pharmacie | pharmacie@example.com | n'importe lequel |
| PME Cabinet | cabinet@example.com | n'importe lequel |

## VARIABLE CLÉ

Changer le backend : \`.env.local\` → \`NEXT_PUBLIC_API_URL=https://api.votre-domaine.com\`

---

## ARBORESCENCE COMPLÈTE

\`\`\`
HEADER

# Arborescence src/
cd "$ROOT"
echo '# src/' >> "$OUT"
find src -type f \( -name "*.tsx" -o -name "*.ts" -o -name "*.css" \) \
  | grep -v "node_modules" | grep -v ".next" | sort \
  | sed 's/^//' >> "$OUT"

echo '' >> "$OUT"
echo '# Racine' >> "$OUT"
ls *.json *.js *.ts *.md 2>/dev/null | sed 's/^//' >> "$OUT"

cat >> "$OUT" << 'SECTION2'
```

---

## FICHIERS CRITIQUES (contenu)

### src/types/api/index.ts
SECTION2

# Types
echo '```typescript' >> "$OUT"
cat src/types/api/index.ts 2>/dev/null || echo "-- fichier absent --"  >> "$OUT"
echo '```' >> "$OUT"

cat >> "$OUT" << 'SECTION3'

### src/lib/constants.ts
SECTION3
echo '```typescript' >> "$OUT"
cat src/lib/constants.ts 2>/dev/null || echo "-- fichier absent --" >> "$OUT"
echo '```' >> "$OUT"

cat >> "$OUT" << 'SECTION4'

### src/lib/env.ts
SECTION4
echo '```typescript' >> "$OUT"
cat src/lib/env.ts 2>/dev/null || echo "-- fichier absent --" >> "$OUT"
echo '```' >> "$OUT"

cat >> "$OUT" << 'SECTION5'

### src/repositories/index.ts (50 premières lignes)
SECTION5
echo '```typescript' >> "$OUT"
head -50 src/repositories/index.ts 2>/dev/null || echo "-- fichier absent --" >> "$OUT"
echo '```' >> "$OUT"

cat >> "$OUT" << 'SECTION6'

### db/db.json (structure — 30 premières lignes)
SECTION6
echo '```json' >> "$OUT"
head -30 db/db.json 2>/dev/null || echo "-- fichier absent --" >> "$OUT"
echo '```' >> "$OUT"

cat >> "$OUT" << 'SECTION7'

---

## PALETTE COULEURS AGT

| Token | Valeur | Usage |
|---|---|---|
| `#25D366` | Vert WhatsApp | Accent principal, succès |
| `#075E54` | Vert foncé | Sidebar PME, boutons CTA |
| `#128C7E` | Vert mid | Hover boutons |
| `#6C3CE1` | Violet | Sidebar Admin, accents IA |
| `#2D1B69` | Violet foncé | Fond vocal |

CSS variables actives : `--bg`, `--bg-card`, `--border`, `--text`, `--text-muted`
Classes utilitaires : `.card`, `.input-base`, `.label-base`, `.btn-primary`, `.badge`, `.spinner`

---

## ROUTES FRONTEND

| Route | Rôle | Layout |
|---|---|---|
| `/login` | Page connexion | Aucun |
| `/pme/dashboard` | Dashboard PME | Sidebar verte |
| `/pme/bots` | Gestion bots | Sidebar verte |
| `/pme/services` | Services | Sidebar verte |
| `/pme/appointments` | Rendez-vous | Sidebar verte |
| `/pme/billing` | Facturation | Sidebar verte |
| `/pme/profile` | Profil | Sidebar verte |
| `/admin/dashboard` | Dashboard Admin | Sidebar violette |
| `/admin/tenants` | Entreprises | Sidebar violette |
| `/admin/bots` | Bots globaux | Sidebar violette |
| `/admin/subscriptions` | Abonnements | Sidebar violette |
| `/admin/providers` | Fournisseurs | Sidebar violette |

---

## ÉTAT DU TODO (à compléter manuellement)

Voir TODO.md dans ce dossier pour le détail complet.
SECTION7

echo "" >> "$OUT"
echo "---" >> "$OUT"
echo "*Fin du contexte — relancer scanner.sh pour mettre à jour*" >> "$OUT"

echo ""
echo "✅ CONTEXT.md généré : $OUT"
echo "   $(wc -l < "$OUT") lignes"
echo ""
echo "📋 Prochaine étape :"
echo "   1. Ouvrir votre projet Claude.ai"
echo "   2. Uploader .prompt/CONTEXT.md + .prompt/TODO.md"
echo "   3. Coller .prompt/START_SESSION.md en premier message"
