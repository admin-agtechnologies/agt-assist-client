# HANDOFF — Front B — [Date à compléter]

> Fichier à compléter en fin de session par Claude (commande : "génère le Handoff").
> Sauvegarder et commiter. Uploader au début de la session suivante.

---

## 1. CE QUI A ÉTÉ COMPLÉTÉ

<!-- Liste des tâches terminées avec leur ID et le fichier modifié -->
<!-- Exemple : [x] A1-1 · Login testé et validé · login/page.tsx -->

- (aucune tâche terminée dans cette session)

---

## 2. EN COURS (non terminé)

<!-- Ce qui a été commencé mais pas fini. Fichier exact + ligne si possible -->
<!-- Exemple : [~] A1-6 · Bug redirect post-login · login/page.tsx ligne 42 · cause identifiée mais pas corrigée -->

- (aucune tâche en cours)

---

## 3. PROCHAINE ÉTAPE IMMÉDIATE

<!-- La toute prochaine sous-tâche à attaquer dès la session suivante -->
<!-- Soyez précis : quel fichier, quelle fonction, quel comportement à corriger -->

À définir en fin de session.

---

## 4. BUGS CONNUS / POINTS D'ATTENTION

<!-- Erreurs console observées, comportements inattendus, décisions techniques prises -->
<!-- Exemples : "Hydration error sur pme/billing si wallet null" -->
<!--            "useEffect manque 'user' dans les deps → warning React" -->

Aucun bug connu pour l'instant.

---

## 5. COMMANDES UTILES POUR CE FRONT

```bash
# Démarrer le projet
npm run dev

# Tester les routes de ce front
# Front A : http://localhost:3000/login
# Front B : http://localhost:3000/pme/dashboard et /pme/bots et /pme/services
# Front C : http://localhost:3000/pme/appointments et /pme/billing et /pme/profile
# Front D : http://localhost:3000/admin/dashboard et /admin/tenants

# Compte démo recommandé pour Front B
# A/B/C : pharmacie@example.com (rôle PME)
# D     : admin@agt.com (rôle Admin)

# Vérifier les erreurs TypeScript
npx tsc --noEmit

# Vérifier les textes en dur (zéro hardcode)
grep -r '"[A-Z][a-zéàê]' src/ --include="*.tsx" | grep -v "dictionary\|//\|className\|type=\|name=\|id=\|key=\|href=\|src=\|alt="
```

---

*Généré par Claude — Session du [date] — Front B*
