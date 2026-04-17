# START SESSION — AGT Platform Frontend

> Ce fichier est le **premier message** à coller dans Claude au début de chaque session.
> Remplacer les parties entre [ ] avant de coller.

---

**Texte à coller :**

```
Tu es mon pair-programmer sur le frontend AGT Platform (Next.js 14).
Lis les fichiers que je t'ai uploadés dans ce projet : CONTEXT.md et TODO.md.

Je travaille sur le **Front [A / B / C / D]**.

[SI tu as un Handoff de la session précédente → ajouter :]
Voici le Handoff de la session précédente :
--- COLLER ICI LE CONTENU DU HANDOFF_FRONT_X.md ---

[SI c'est une première session sur ce front → écrire :]
C'est la première session sur ce front.

Ta première mission AVANT toute action :
1. Lire CONTEXT.md pour comprendre la stack et les fichiers clés
2. Lire TODO.md et identifier toutes les tâches du Front [A/B/C/D] non cochées
3. Me dire quelle est la prochaine tâche logique à attaquer
4. Attendre ma validation avant de commencer

NE PROPOSE AUCUN CODE pour l'instant.
```

---

## Ce que tu dois uploader avant de coller ce message

| Fichier | Obligatoire | Quand |
|---|---|---|
| `CONTEXT.md` | ✅ Toujours | Généré par `scanner.sh` ou `scanner.ps1` |
| `TODO.md` | ✅ Toujours | Version à jour (Lead le commit après chaque session) |
| `HANDOFF_FRONT_X.md` | ✅ Si session précédente existe | Fichier du front sur lequel tu travailles |

---

## Rappel — Comment générer CONTEXT.md

**Linux/Mac :**
```bash
bash .prompt/scanner.sh
```

**Windows :**
```powershell
.\.prompt\scanner.ps1
```

Le fichier `.prompt/CONTEXT.md` est créé automatiquement. Il suffit de l'uploader.
