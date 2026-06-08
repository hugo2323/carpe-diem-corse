# Villa Carpe Diem — État du projet

> Document de reprise. Dernière mise à jour : 2026-06-05.
> Site en ligne : **https://carpe-diem-corse.vercel.app**
> Stack : Next.js 14 (App Router) · Tailwind · déployé sur Vercel.

---

## 1. Ce qui est en place (fonctionnel)

### Vitrine
- Hero avec 4 CTA (Réserver, Disponibilités, Photos, Visite virtuelle) + scroll fluide.
- Galerie cliquable plein écran (lightbox + clavier) sur l'accueil et la page `/galerie`.
- Section villa avec **fibre internet (télétravail)** mise en avant + bande d'atouts.
- Section voiture (Dacia Bigster) + **guide de réservation via Turo** (4 étapes).
- Bloc **Visite virtuelle 3D** (placeholder « bientôt disponible » tant qu'aucune URL).
- Icônes sobres (composant `Icon`), zéro emoji « IA » côté client.

### Calendrier & réservation (`AvailabilityCalendar`)
- Calendrier **2 mois** (desktop) alimenté par l'iCal Airbnb (lecture seule, ~1 h de cache).
- Sélection arrivée → départ, **tarif indicatif** calculé en direct.
- Bouton « Demander ces dates » → pré-remplit le **formulaire de contact** (Web3Forms).
- **Section « Offres spéciales »** : détecte automatiquement les créneaux orphelins (trous entre 2 résas) et les affiche à tarif réduit (villa + villa/véhicule), clic = pré-remplit.
- Mentions Airbnb/Abritel **retirées** côté client (texte neutre).

### Avis (`ReviewsSection`)
- **Avis réels uniquement** — règle stricte, aucune donnée inventée.
- Synthèse vérifiée : **Airbnb 4,5/5 · 4 avis** (saisie à la main dans `lib/reviews/config.ts`).
- Avis Turo séparés, masqués tant qu'il n'y a pas de vrais avis (`SHOW_TURO_REVIEWS = false`).
- Architecture prête pour du dynamique (`fetchAirbnbReviews`, cache JSON) — non branché.

### Tracking & SEO
- Google Tag (GA4 `G-M5GRTWK53E`) + Google Ads (`AW-17885406874`).
- Conversion : événement GA4 `generate_lead` à l'envoi du formulaire + `click_turo`.
- SEO : données structurées JSON-LD (`LodgingBusiness`), Open Graph + Twitter, `metadataBase`.

---

## 2. Moteur de tarif (`lib/pricing.ts`) — valeurs actuelles

### Tarif villa /nuit (confirmé proprio)
| Saison | Période | €/nuit |
|---|---|---|
| Très haute | 14/07 → 24/08 | 450 |
| Haute | juin, 1-13 juil, 25/08 → 15/09 | 320 |
| Moyenne | mai, 16-30 sept, oct | 220 |
| Basse | reste | 160 |

### Véhicule (Dacia Bigster) — **via Turo**
- Tarif /nuit : 80 / 70 / 60 / 50 (mêmes saisons).
- Mode `dynamic` : le montant véhicule **s'ajoute** au total.
- Réservation/paiement **sur Turo** (assurance incluse). Le proprio ajuste le prix Turo pour matcher le site.
- Cocher le véhicule donne **−5 % sur la base villa** (cumulé avec la remise « temps »).

### Remises « temps » — on applique LA MEILLEURE des trois (pas de cumul entre elles), PUIS −5 % véhicule par-dessus
1. **Dernière minute (dégressive, par nuit)** : selon l'écart de chaque nuit avec aujourd'hui — semaine 1 (J+1→7) −30 %, semaine 2 (J+8→14) −20 %, semaine 3 (J+15→21) −10 %, au-delà 0 %.
2. **Durée de séjour** : −15 % dès 7 nuits, −25 % dès 28 nuits.
3. **Offre spéciale (créneau orphelin)** : uniquement si le séjour comble EXACTEMENT un trou de 1 à 9 nuits. Trou 1-3 nuits → −40 % partout ; trou 4-9 nuits → −20 % en haute saison, −40 % hors saison. Libellé client : « Offre spéciale » (jamais « trou »).

### Règles de réservation
- `MIN_LEAD_DAYS = 0` → arrivée possible **dès aujourd'hui**.
- Séjour minimum **variable** (`minNightsForDate`) : **mois en cours = aucun minimum** ; très haute saison = 7 nuits ; haute = 5 ; sinon = 1. **+ exception trou** : un créneau plus court que le minimum reste réservable.
- **Forfait ménage : 200 €** (`CLEANING_FEE`), réglé sur place à Kalypso Conciergerie, hors tarif indicatif.
- Taxe de séjour : hors tarif (à gérer en direct, voir §4).

---

## 3. Déploiement & configuration

- **Déployer** : `vercel --prod --yes` (CLI déjà authentifié, compte `hugovalette2323-3648`). Un push sur `main` déploie aussi.
- **Variables d'env (Vercel, déjà en prod)** :
  - `AIRBNB_ICAL_URL` = iCal d'export Airbnb (privé, annonce 24533933). **Abritel non configuré** (géré par un tiers, pas d'accès).
- **Variables optionnelles à renseigner plus tard** :
  - `NEXT_PUBLIC_SITE_URL` = URL du domaine custom (le jour où on en a un).
  - `NEXT_PUBLIC_VIRTUAL_TOUR_URL` = URL d'embed de la visite virtuelle 3D.
  - `NEXT_PUBLIC_GADS_CONVERSION_LABEL` = label de l'action de conversion Google Ads.

---

## 4. Notes d'exploitation (important)

- **Bloquer des dates après une résa directe** : le faire **dans Airbnb** (Calendrier → sélectionner → Bloquer). Ça se répercute sur le site (~1 h). Airbnb = calendrier maître pour l'instant.
- **Taxe de séjour** : sur Airbnb, c'est collecté/reversé automatiquement. **En direct, c'est à la charge du proprio** (collecter + reverser à la mairie de Pietrosella). À confirmer avec la mairie / le comptable.
- **Paiement résa directe (villa)** : acompte 30 % à la résa + solde avant arrivée. Lien de paiement Stripe ou PayPal. Caution (dépôt de garantie). Contrat de location saisonnière simple. Ménage 200 € + taxe sur place.
- **Paiement véhicule** : directement sur Turo par le client (rien à encaisser).
- **Parité prix** : le site peut afficher un peu plus cher qu'Airbnb (tout est « indicatif »). Le proprio recale le prix exact du **mois en cours** dans sa réponse. Juillet-août : base OK. Ne pas « corriger » les prix sans demande.

---

## 5. Revenu locatif — 3 fenêtres prioritaires à remplir (au 04/06/2026)

| Fenêtre | Nuits | Remise | Villa seule | Villa + véhicule |
|---|---|---|---|---|
| 29/06 → 19/07 | 20 | séjour −15 % | 5 992 € | 7 089 € |
| 27/07 → 04/08 | 8 | offre spéciale −20 % | 2 880 € | 3 340 € |
| 14/08 → 19/08 | 5 | offre spéciale −20 % | 1 800 € | 2 087 € |
| **TOTAL** | 33 | | **≈ 10 672 €** | **≈ 12 516 €** |

*(hors ménage 200 € × 3 et taxe de séjour. Gain véhicule : +1 844 €.)*

---

## 6. À faire / en attente (prochaine fois)

- [ ] **Nom de domaine** : en acheter un, le brancher sur Vercel, régler `NEXT_PUBLIC_SITE_URL` (enlever « vercel » de l'adresse).
- [ ] **Conversion Google Ads** : créer l'action « Demande de réservation » dans Google Ads → récupérer le label → `NEXT_PUBLIC_GADS_CONVERSION_LABEL`.
- [ ] **Paiement** : choisir Stripe ou PayPal, mettre en place les liens d'acompte (+ éventuellement intégrer le paiement sur le site — Phase 2).
- [ ] **Réponse type** de confirmation de résa (dispo → prix → acompte → Turo → ménage/taxe → blocage des dates).
- [ ] **Avis Airbnb réels** : vérifier la vraie note/nombre et les mettre à jour si besoin (`AIRBNB_VERIFIED_SUMMARY`). Passer en dynamique un jour (channel manager / widget).
- [ ] **Vraie réduction « semaine » Airbnb** : vérifier le % réel (peut-être > 15 %) pour caler la durée de séjour.
- [ ] **Visite virtuelle 3D** : si dispo, renseigner `NEXT_PUBLIC_VIRTUAL_TOUR_URL`.
- [ ] **Unification Airbnb/Abritel/site** : à terme, un channel manager (Beds24/Smoobu). Bloquant Abritel : récupérer l'accès (géré par un tiers).
- [ ] **Google Business Profile** : revendiquer/optimiser la fiche Maps « SCI horizon » (photos, lien site).

---

## 7. Repères techniques (fichiers clés)

- `lib/pricing.ts` — tarifs, remises, règles de réservation, ménage.
- `lib/ical.ts` + `app/api/availability/route.ts` — dispos depuis Airbnb.
- `lib/location.ts` — `SITE_URL`, coords, liens Google Maps (fiche officielle).
- `lib/reviews/` — config + cache + fetch avis (réels uniquement).
- `lib/gtag.ts` — GA4 + Google Ads (`trackLead`, `trackEvent`, `trackAdsConversion`).
- `app/components/AvailabilityCalendar.tsx` — calendrier + devis + offres spéciales.
- `app/components/ContactSection.tsx` — formulaire (pré-rempli + conversion).
- `app/components/CarSection.tsx` — voiture + guide Turo.
