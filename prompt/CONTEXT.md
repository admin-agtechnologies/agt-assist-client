# CONTEXT - AGT Platform Frontend
Genere le : 2026-04-17 10:33
Scanner : scanner.ps1 (Windows)

---

## STACK & DEMARRAGE

- **Framework** : Next.js 14 App Router
- **Langage** : TypeScript strict
- **Style** : Tailwind CSS + CSS Variables (dark/light mode)
- **Mock API** : JSON-Server port 4000
- **Frontend** : port 3000

\\\ash
npm install
npm run dev
npm run dev:next
npm run dev:api
\\\

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

\\\
"@

 += "
# src/
"
 = Get-ChildItem -Path "src" -Recurse -Include "*.tsx","*.ts","*.css" |
    Where-Object { .FullName -notmatch "node_modules|\.next" } |
    Sort-Object FullName |
    ForEach-Object { .FullName.Replace(C:\Users\mbiam\Desktop\dev\agt_plateforme + "\", "").Replace("\", "/") }
 += ( -join "
")

 += @"

# Racine
\\\

---

## FICHIERS CRITIQUES (contenu)

### src/types/api/index.ts```typescript
-- fichier absent --
```

### src/lib/constants.ts
```typescript
-- fichier absent --
```

### src/lib/env.ts
```typescript
-- fichier absent --
```

### src/repositories/index.ts (50 premieres lignes)
```typescript
-- fichier absent --

```

### db/db.json (structure - 30 premieres lignes)
```json
-- fichier absent --

```
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