# .prompt — Kit de travail en équipe AGT Frontend

Ce dossier contient tous les outils pour travailler en équipe sur le frontend AGT Platform avec Claude.ai,
sans perte de contexte entre les sessions et sans interférence entre les fronts.

---

## Contenu du dossier

| Fichier | Rôle | Qui l'utilise |
|---|---|---|
| `scanner.sh` | Génère CONTEXT.md (Linux/Mac) | Chaque dev en début de session |
| `scanner.ps1` | Génère CONTEXT.md (Windows) | Chaque dev en début de session |
| `CONTEXT.md` | Snapshot du projet pour Claude | Uploadé dans le projet Claude |
| `TODO.md` | Plan de test par front (A/B/C/D) | Lead + tous les devs |
| `PROJECT_DESCRIPTION.md` | Description courte du projet | Lead (configure le projet Claude une fois) |
| `TEAM_PROMPT.md` | Instructions complètes pour Claude | Lead (configure le projet Claude une fois) |
| `START_SESSION.md` | Premier message à coller dans Claude | Chaque dev en début de session |
| `HANDOFF_FRONT_A.md` | Handoff spécifique Front A | Dev A |
| `HANDOFF_FRONT_B.md` | Handoff spécifique Front B | Dev B |
| `HANDOFF_FRONT_C.md` | Handoff spécifique Front C | Dev C |
| `HANDOFF_FRONT_D.md` | Handoff spécifique Front D | Dev D (Lead) |

---

## 🚀 Démarrage en 5 minutes

### Étape 1 — Le Lead configure le projet Claude (une seule fois)

1. Aller sur **claude.ai → Projets → Nouveau projet**
2. Champ **"Nom"** : `AGT Platform Frontend`
3. Champ **"Description"** : copier le contenu de `PROJECT_DESCRIPTION.md`
4. Champ **"Instructions du projet"** : copier le contenu de `TEAM_PROMPT.md`
5. **Partager** le projet avec tous les membres de l'équipe

### Étape 2 — Chaque dev se prépare (début de chaque session)

**Linux/Mac :**
```bash
# Depuis la racine du projet frontend
bash .prompt/scanner.sh
```

**Windows :**
```powershell
# Depuis la racine du projet frontend
.\.prompt\scanner.ps1
```

→ Le fichier `.prompt/CONTEXT.md` est généré automatiquement.

### Étape 3 — Chaque dev ouvre sa session Claude

1. Ouvrir le projet Claude partagé par le Lead
2. Uploader dans la conversation :
   - `.prompt/CONTEXT.md` (généré à l'étape 2)
   - `.prompt/TODO.md` (version commitée par le Lead)
   - `.prompt/HANDOFF_FRONT_X.md` (son front, si une session précédente existe)
3. Copier le contenu de `START_SESSION.md`, compléter les `[  ]`, et envoyer

### Étape 4 — Travailler

Claude analyse le contexte, propose la prochaine tâche, attend la validation.
Travailler une tâche à la fois, méthode 5 étapes.

### Étape 5 — Fin de session

1. Dire à Claude : **"génère le Handoff"**
2. Copier le Handoff généré dans `HANDOFF_FRONT_X.md`
3. Commiter le fichier
4. Dire au Lead de mettre à jour `TODO.md` (cocher les tâches terminées)

---

## 📋 Les 4 fronts

| Front | Périmètre | Fichiers principaux |
|---|---|---|
| **A** | Auth · Layout · Navigation · Dark mode · i18n | `login/` · `pme/layout` · `admin/layout` · `middleware.ts` |
| **B** | Dashboard PME · Bots · Services | `pme/dashboard/` · `pme/bots/` · `pme/services/` |
| **C** | Appointments · Billing · Profile | `pme/appointments/` · `pme/billing/` · `pme/profile/` |
| **D** | Admin complet | `admin/dashboard/` · `admin/tenants/` · `admin/bots/` · `admin/subscriptions/` · `admin/providers/` |

---

## ⚠️ Règles d'équipe

- **Ne jamais modifier un fichier d'un autre front** sans en parler au Lead
- **Toujours commiter le Handoff** avant de quitter une session
- **Toujours relancer le scanner** en début de session (contexte à jour)
- **Toujours cocher les tâches dans TODO.md** après validation du Lead
- En cas de conflit sur un fichier partagé (ex: `dictionaries/fr.ts`) → prévenir le Lead

---

## 🔧 Commandes utiles

```bash
# Démarrer le projet
npm run dev

# Vérifier les erreurs TypeScript (doit passer sans erreur)
npx tsc --noEmit

# Chercher les textes en dur (doit retourner rien)
grep -rn '"[A-Z][a-zéàê]\{3,\}' src/ --include="*.tsx" \
  | grep -v "dictionary\|//\|className\|type=\|name=\|id=\|key=\|href=\|src="

# Linter
npm run lint
```

---

*AG Technologies — Usage interne — Confidentiel*
