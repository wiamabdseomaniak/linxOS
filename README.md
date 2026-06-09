# LINXOS — Plateforme de Logistique et Sponsoring

Application de gestion logistique et de suivi de livraisons pour entreprises. Construite avec **Next.js 16**, **Supabase**, **Tailwind CSS v4**, et **shadcn/ui**.

## Fonctionnalités

- **Authentification** — Email/mot de passe, Google OAuth, connexion par code OTP à 8 chiffres
- **Tableau de bord** — KPIs, graphiques d'activité hebdomadaire et par ville (Recharts)
- **Logistique** — Gestion des livraisons avec filtres par statut, ville et organisation
- **Livrées** — Visualisation des livraisons terminées
- **Tracking public** — Suivi de livraison par identifiant (sans authentification)
- **Notifications** — Centre de notifications utilisateur
- **Profil & Paramètres** — Gestion du profil utilisateur et préférences
- **Thème clair/sombre** — Bascule via `next-themes`

## Stack technique

| Technologie | Version |
|---|---|
| Next.js (App Router) | 16.2.6 |
| React | 19.2.4 |
| TypeScript | 5.x |
| Tailwind CSS | 4.x |
| Supabase (Auth + PostgreSQL) | ^2.105.4 |
| Prisma ORM | ^7.8.0 |
| TanStack React Query | ^5.100.10 |
| Zustand | ^5.0.13 |
| Framer Motion | ^12.38.0 |
| Recharts | ^3.8.1 |
| React Hook Form + Zod | ^7.75.0 / ^4.4.3 |
| shadcn/ui | ^4.7.0 |

## Structure du projet

```
src/
├── app/
│   ├── (auth)/              # Pages publiques (login, OTP, reset)
│   ├── (dashboard)/         # Pages protégées (dashboard, logistique, etc.)
│   ├── (tracking)/          # Page publique de tracking
│   └── api/                 # Routes API (dashboard, logistique, tracking...)
├── components/
│   ├── layout/              # Sidebar, navbar, layout principal
│   └── ui/                  # Composants shadcn/ui
├── features/
│   ├── auth/                # Authentification (hooks, API Supabase)
│   ├── dashboard/           # Métriques et activité
│   ├── logistics/           # Gestion des livraisons
│   ├── notifications/       # Notifications utilisateur
│   └── tracking/            # Suivi public
├── lib/
│   ├── constants.ts         # Menu sidebar, statuts, priorités
│   ├── supabase.ts          # Client Supabase SSR
│   └── utils.ts             # Utilitaires (cn, etc.)
└── types/
    └── supabase.ts          # Types TypeScript des tables
```

## Pages

| Route | Description |
|---|---|
| `/` | Page d'accueil |
| `/login` | Connexion (email, Google, OTP) |
| `/verify-otp` | Vérification du code OTP |
| `/reset-password` | Réinitialisation du mot de passe |
| `/dashboard` | Tableau de bord avec KPIs et graphiques |
| `/logistics` | Gestion des livraisons |
| `/delivered` | Livraisons terminées |
| `/notifications` | Centre de notifications |
| `/track` | Suivi public d'une livraison |
| `/settings` | Paramètres de l'application |
| `/profile` | Profil utilisateur |

## Schéma de la base de données

- **utilisateur** — Comptes utilisateurs avec rôles (`manager`, `driver`, `client`, `logistique`)
- **client** — Clients destinataires des livraisons
- **livraison** — Événements de livraison (statuts, dates, quantités)
- **tracking** — Points de suivi des livraisons
- **note** — Notes internes par livraison
- **notification** — Notifications utilisateur
- **email_verifications** — Codes OTP pour l'authentification

## Démarrage

```bash
# 1. Cloner le projet
git clone <repo-url>
cd linxos-platform

# 2. Installer les dépendances
npm install

# 3. Copier et configurer les variables d'environnement
cp .env.example .env.local

# 4. Initialiser la base de données
# Exécuter le contenu de supabase/schema.sql dans le SQL Editor Supabase

# 5. Lancer le serveur de développement
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000).

## Variables d'environnement

| Variable | Description |
|---|---|
| `DATABASE_URL` | URL de connexion PostgreSQL (via Prisma) |
| `NEXT_PUBLIC_SUPABASE_URL` | URL du projet Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clé publique Supabase (côté client) |
| `SUPABASE_SERVICE_ROLE_KEY` | Clé service Supabase (côté serveur) |
| `NEXTAUTH_URL` | URL de l'application pour l'authentification |
| `NEXTAUTH_SECRET` | Secret pour le chiffrement des sessions |
| `GOOGLE_CLIENT_ID` | Client ID Google OAuth |
| `GOOGLE_CLIENT_SECRET` | Client secret Google OAuth |

## Commandes

```bash
npm run dev      # Serveur de développement
npm run build    # Build de production
npm run start    # Lancement du serveur de production
npm run lint     # Vérification ESLint
```

## Licence

Projet privé — LinxOS
