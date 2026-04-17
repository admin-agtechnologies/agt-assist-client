# TODO — AGT Platform Frontend
# Plan de test & améliorations — Version 1.0

> Format : `[ ] ID · Description · Fichier(s) · Critère de succès`
> Cocher `[x]` quand terminé. Mettre `[~]` si en cours.
> Chaque front est autonome et peut être attaqué en parallèle.

---

## 🔴 FRONT A — Auth · Layout · Navigation · Dark mode · i18n
> Responsable : ___________
> Fichiers principaux : `login/page.tsx` · `pme/layout.tsx` · `admin/layout.tsx` · `middleware.ts` · `globals.css`

### A1 — Auth
- [ ] A1-1 · Tester le login avec les 3 comptes démo · `login/page.tsx` · Redirection correcte selon le rôle (admin → /admin/dashboard, pme → /pme/dashboard)
- [ ] A1-2 · Tester le login avec mauvais mot de passe · `login/page.tsx` · Toast erreur visible, modale reste ouverte
- [ ] A1-3 · Tester la persistance de session (refresh de page) · `AuthContext.tsx` · Utilisateur reste connecté après F5
- [ ] A1-4 · Tester le logout · `pme/layout.tsx` + `admin/layout.tsx` · Redirige vers /login, localStorage vidé
- [ ] A1-5 · Tester la protection des routes · `middleware.ts` · Accès /pme/* sans token → redirect /login avec ?redirect=
- [ ] A1-6 · Corriger le bug de redirect post-login si ?redirect= présent · `login/page.tsx` · Après login, navigue vers la page demandée
- [ ] A1-7 · Vérifier que le cookie `agt_auth` est bien posé · `api-client.ts` · Cookie présent dans DevTools après login

### A2 — Layout & Navigation
- [ ] A2-1 · Tester la sidebar PME sur mobile (hamburger menu) · `pme/layout.tsx` · Sidebar s'ouvre/ferme correctement sur écran < 1024px
- [ ] A2-2 · Tester la sidebar Admin sur mobile · `admin/layout.tsx` · Même comportement que PME
- [ ] A2-3 · Vérifier le lien actif dans la sidebar (highlight correct selon la route) · `pme/layout.tsx` + `admin/layout.tsx` · Lien de la page courante est surligné
- [ ] A2-4 · Vérifier que le nom de l'utilisateur s'affiche dans la sidebar · `pme/layout.tsx` · Nom + email visibles dans le bloc user
- [ ] A2-5 · Tester le scroll dans le main content (long contenu) · Les deux layouts · Sidebar reste fixe, main scroll correctement

### A3 — Dark mode
- [ ] A3-1 · Tester le toggle dark/light depuis la sidebar · `ThemeProvider.tsx` · Bascule immédiate, persistance après refresh (localStorage)
- [ ] A3-2 · Vérifier toutes les pages en dark mode (pas de texte illisible, pas de blanc pur) · Toutes les pages · Aucun élément avec couleur hardcodée qui casse le dark mode
- [ ] A3-3 · Vérifier les modales en dark mode · `ui/index.tsx` · Fond de modale correct, texte lisible
- [ ] A3-4 · Vérifier les toasts en dark mode · `Toast.tsx` · Toasts visibles et bien contrastés

### A4 — i18n (bilingue FR/EN)
- [ ] A4-1 · Tester le switch de langue depuis la sidebar · `LanguageContext.tsx` · Toute l'UI bascule en anglais, persistance après refresh
- [ ] A4-2 · Vérifier qu'il n'y a aucun texte en dur restant (audit complet) · Tous les fichiers · `grep` sur tous les `.tsx` → aucune chaîne hardcodée hors dictionnaire
- [ ] A4-3 · Compléter les clés manquantes dans `en.ts` si trouvées · `dictionaries/en.ts` · Pas de clé `undefined` en EN

---

## 🟠 FRONT B — Dashboard PME · Bots · Services
> Responsable : ___________
> Fichiers principaux : `pme/dashboard/page.tsx` · `pme/bots/page.tsx` · `pme/services/page.tsx`

### B1 — Dashboard PME
- [ ] B1-1 · Vérifier le chargement des stats · `pme/dashboard/page.tsx` · Les 4 KPI cards affichent des données réelles (JSON-Server)
- [ ] B1-2 · Vérifier le graphique Area (recharts) · `pme/dashboard/page.tsx` · Graphique s'affiche sans erreur console
- [ ] B1-3 · Vérifier la liste des conversations récentes · `pme/dashboard/page.tsx` · 5 conversations affichées avec badge canal et timestamp
- [ ] B1-4 · Tester l'état vide (si aucune conversation) · `pme/dashboard/page.tsx` · EmptyState visible avec icône et message i18n
- [ ] B1-5 · Vérifier le skeleton loading · `pme/dashboard/page.tsx` · Skeleton visible pendant le fetch initial, pas de flash de contenu vide

### B2 — Bots
- [ ] B2-1 · Tester le fetch de la liste des bots · `pme/bots/page.tsx` · Bots filtrés par tenant_id de l'utilisateur connecté
- [ ] B2-2 · Tester la recherche (debounce) · `pme/bots/page.tsx` · La recherche se déclenche 400ms après la frappe, pas avant
- [ ] B2-3 · Tester la création d'un bot · `pme/bots/page.tsx` · POST vers JSON-Server, toast succès, bot apparaît dans la liste
- [ ] B2-4 · Tester l'édition d'un bot · `pme/bots/page.tsx` · Modale pré-remplie avec les données existantes, PATCH envoyé
- [ ] B2-5 · Tester la suppression d'un bot · `pme/bots/page.tsx` · Modale de confirmation, DELETE envoyé, bot retiré de la liste
- [ ] B2-6 · Vérifier le toggle is_active dans le formulaire · `pme/bots/page.tsx` · Toggle visuel correct, valeur envoyée en boolean
- [ ] B2-7 · Vérifier les badges de statut (active/paused/archived) · `pme/bots/page.tsx` · Couleurs correctes : green/amber/slate
- [ ] B2-8 · Tester la modale sur mobile (scroll interne si contenu long) · `pme/bots/page.tsx` · Modal scrollable, footer toujours visible

### B3 — Services
- [ ] B3-1 · Tester le fetch des services · `pme/services/page.tsx` · Services filtrés par tenant_id
- [ ] B3-2 · Tester l'affichage "Gratuit" si price = 0 · `pme/services/page.tsx` · "Gratuit" / "Free" affiché selon la locale
- [ ] B3-3 · Tester la création d'un service · `pme/services/page.tsx` · POST réussi, toast, card apparaît dans la grille
- [ ] B3-4 · Tester l'édition d'un service · `pme/services/page.tsx` · PATCH réussi, données mises à jour dans la card
- [ ] B3-5 · Tester la suppression d'un service · `pme/services/page.tsx` · Confirmation + DELETE + disparition de la grille
- [ ] B3-6 · Vérifier le formatage du prix (XAF) · `pme/services/page.tsx` · `formatCurrency()` utilisé, pas de valeur brute

---

## 🟡 FRONT C — Appointments · Billing · Profile
> Responsable : ___________
> Fichiers principaux : `pme/appointments/page.tsx` · `pme/billing/page.tsx` · `pme/profile/page.tsx`

### C1 — Appointments
- [ ] C1-1 · Tester le fetch des RDV · `pme/appointments/page.tsx` · RDV filtrés par tenant_id
- [ ] C1-2 · Tester les filtres par statut · `pme/appointments/page.tsx` · Cliquer sur "Confirmé" filtre correctement, bouton actif surligné
- [ ] C1-3 · Tester la création d'un RDV · `pme/appointments/page.tsx` · Select service chargé dynamiquement, datetime-local fonctionnel
- [ ] C1-4 · Tester le changement de statut d'un RDV (édition) · `pme/appointments/page.tsx` · PATCH avec nouveau statut, badge mis à jour
- [ ] C1-5 · Tester la suppression d'un RDV · `pme/appointments/page.tsx` · Confirmation + DELETE
- [ ] C1-6 · Vérifier le formatage des dates · `pme/appointments/page.tsx` · `formatDateTime()` utilisé, format lisible (ex: "20 mai 2026, 10:00")
- [ ] C1-7 · Tester l'état vide · `pme/appointments/page.tsx` · EmptyState visible si aucun RDV pour le filtre actif

### C2 — Billing
- [ ] C2-1 · Tester le chargement de l'abonnement · `pme/billing/page.tsx` · Plan actuel affiché avec badge statut
- [ ] C2-2 · Tester les barres de progression usage (messages + appels) · `pme/billing/page.tsx` · Largeur proportionnelle correcte, couleur verte/violette
- [ ] C2-3 · Tester le chargement du wallet · `pme/billing/page.tsx` · Solde en XAF formaté avec `formatCurrency()`
- [ ] C2-4 · Tester l'affichage des plans disponibles · `pme/billing/page.tsx` · 3 plans affichés, plan actuel avec ring vert et bouton désactivé
- [ ] C2-5 · Vérifier l'état suspendu (compte t3 — Salon Beauté) · `pme/billing/page.tsx` · Badge rouge "Suspendu", bouton Changer de plan toujours cliquable
- [ ] C2-6 · Vérifier le responsive (grille 1col mobile, 3col desktop) · `pme/billing/page.tsx` · Plans en colonne sur mobile, en grille sur desktop

### C3 — Profile
- [ ] C3-1 · Vérifier que le profil de l'utilisateur connecté s'affiche · `pme/profile/page.tsx` · Nom, email, rôle corrects
- [ ] C3-2 · Vérifier les initiales dans l'avatar · `pme/profile/page.tsx` · `initials()` utilisé, 2 lettres max
- [ ] C3-3 · Vérifier le label du rôle selon la locale · `pme/profile/page.tsx` · "Responsable PME" en FR, "SME Manager" en EN

---

## 🟣 FRONT D — Admin Dashboard · Tenants · Bots · Subscriptions · Providers
> Responsable : ___________
> Fichiers principaux : `admin/dashboard/page.tsx` · `admin/tenants/page.tsx` · `admin/bots/page.tsx` · `admin/subscriptions/page.tsx` · `admin/providers/page.tsx`

### D1 — Admin Dashboard
- [ ] D1-1 · Tester le chargement des KPIs admin · `admin/dashboard/page.tsx` · 4 cards avec données réelles (admin_stats)
- [ ] D1-2 · Tester le graphique MRR (BarChart recharts) · `admin/dashboard/page.tsx` · Graphique visible, tooltip formaté en XAF
- [ ] D1-3 · Tester la liste des entreprises récentes · `admin/dashboard/page.tsx` · 5 tenants avec badge actif/inactif
- [ ] D1-4 · Tester le lien "Voir tout →" vers /admin/tenants · `admin/dashboard/page.tsx` · Navigation correcte

### D2 — Tenants (Entreprises)
- [ ] D2-1 · Tester le fetch de la liste · `admin/tenants/page.tsx` · Tous les tenants visibles
- [ ] D2-2 · Tester la recherche avec debounce · `admin/tenants/page.tsx` · Filtre par nom en temps réel
- [ ] D2-3 · Tester la création d'un tenant · `admin/tenants/page.tsx` · POST, toast succès, tenant dans la liste
- [ ] D2-4 · Tester l'édition d'un tenant · `admin/tenants/page.tsx` · Modale pré-remplie, PATCH réussi
- [ ] D2-5 · Tester la suppression d'un tenant · `admin/tenants/page.tsx` · Confirmation avec message d'avertissement fort, DELETE
- [ ] D2-6 · Vérifier le toggle is_active dans le formulaire · `admin/tenants/page.tsx` · Toggle visible, valeur correcte
- [ ] D2-7 · Vérifier l'accent violet sur le bouton de création · `admin/tenants/page.tsx` · Bouton violet (pas vert) dans l'espace admin

### D3 — Admin Bots (vue globale)
- [ ] D3-1 · Vérifier que la liste affiche tous les bots (tous tenants confondus) · `admin/bots/page.tsx` · Pas de filtre tenant_id dans la vue admin
- [ ] D3-2 · Tester la recherche par nom · `admin/bots/page.tsx` · Filtre fonctionnel
- [ ] D3-3 · Tester la suppression d'un bot · `admin/bots/page.tsx` · Confirmation + DELETE
- [ ] D3-4 · Vérifier l'affichage du tenant_id (en attendant le nom du tenant) · `admin/bots/page.tsx` · ID visible, pas de crash si null

### D4 — Subscriptions
- [ ] D4-1 · Vérifier le chargement de tous les abonnements · `admin/subscriptions/page.tsx` · 3 abonnements mock visibles
- [ ] D4-2 · Vérifier les badges de statut (active/suspended/cancelled/trial) · `admin/subscriptions/page.tsx` · Couleurs correctes
- [ ] D4-3 · Vérifier les colonnes usage (messages + appels) · `admin/subscriptions/page.tsx` · Valeurs used/limit affichées
- [ ] D4-4 · Vérifier le formatage des dates de renouvellement · `admin/subscriptions/page.tsx` · `formatDate()` utilisé

### D5 — Providers
- [ ] D5-1 · Vérifier le chargement des 3 groupes (WhatsApp, IA Vocale, Opérateur) · `admin/providers/page.tsx` · 3 sections distinctes visibles
- [ ] D5-2 · Tester le toggle actif/inactif d'un provider · `admin/providers/page.tsx` · PATCH envoyé, état mis à jour immédiatement dans l'UI, toast succès
- [ ] D5-3 · Vérifier l'état du toggle ORANGE (is_active: false) · `admin/providers/page.tsx` · Toggle off par défaut pour Orange
- [ ] D5-4 · Vérifier les icônes par type de provider · `admin/providers/page.tsx` · 📱 WhatsApp, 🤖 IA Vocale, 📞 Opérateur

---

## 📊 SUIVI GLOBAL

| Front | Tâches total | Terminées | En cours | Bloquées |
|---|---|---|---|---|
| A — Auth & Layout | 19 | 0 | 0 | 0 |
| B — Dashboard & Bots & Services | 20 | 0 | 0 | 0 |
| C — Appointments & Billing & Profile | 16 | 0 | 0 | 0 |
| D — Admin complet | 18 | 0 | 0 | 0 |
| **TOTAL** | **73** | **0** | **0** | **0** |

---

*Mis à jour par le Lead après chaque session. Commiter ce fichier après chaque mise à jour.*
