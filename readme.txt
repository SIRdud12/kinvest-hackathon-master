# Kinvest - Gestion Intelligente des Dépenses Personnelles

## Description du Projet

Kinvest est une application web de gestion budgétaire personnelle développée en Node.js. Elle permet aux utilisateurs de planifier leur budget annuel par catégories, suivre leurs dépenses réelles, et obtenir des conseils personnalisés grâce à l'intelligence artificielle (IA) intégrée via Google Gemini.

L'application offre une interface intuitive pour visualiser l'équilibre entre budget prévu et dépenses effectuées, avec des fonctionnalités avancées comme l'analyse par catégories et des recommandations IA pour optimiser la gestion financière.

## Fonctionnalités Principales

###  Authentification Utilisateur
- Inscription et connexion sécurisées via Firebase Authentication
- Gestion des sessions utilisateur
- Déconnexion sécurisée

###  Gestion du Budget
- Création de budgets annuels personnalisés
- Répartition du budget par catégories (Alimentation, Transport, Santé, etc.)
- Modification des budgets existants
- Visualisation du budget total par année

###  Suivi des Dépenses
- Ajout de nouvelles dépenses avec date, montant et catégorie
- Modification des dépenses existantes
- Historique des transactions (10 dernières par défaut)
- Calcul automatique des totaux par période

###  Analyse et Bilan
- Comparaison budget vs dépenses réelles
- Bilan annuel par catégories
- Visualisation des écarts budgétaires

###  Intelligence Artificielle
- Conseils personnalisés basés sur les données budgétaires
- Questions IA sur l'ensemble du budget
- Analyse par catégories avec recommandations spécifiques
- Utilisation de Google Gemini pour des insights intelligents

## Technologies Utilisées

- **Backend**: Node.js avec Express.js
- **Base de Données**: MySQL
- **Authentification**: Firebase Authentication
- **Templates**: EJS (Embedded JavaScript)
- **IA**: Google Generative AI (Gemini)
- **Frontend**: HTML5, CSS3, JavaScript
- **Styling**: CSS personnalisé avec design responsive

## Structure de la Base de Données

### Tables Principales

#### `budget`
- `id`: Identifiant unique du budget
- `annee`: Année du budget
- `uid`: Identifiant utilisateur Firebase

#### `budget_categories`
- `id`: Identifiant unique
- `montant`: Montant alloué à la catégorie
- `budget_id`: Référence au budget
- `categorie_id`: Référence à la catégorie

#### `categorie`
- `id`: Identifiant unique
- `nom`: Nom de la catégorie (ex: Alimentation, Transport, etc.)

#### `depense`
- `id`: Identifiant unique
- `date`: Date de la dépense
- `montant`: Montant dépensé
- `categorie_id`: Référence à la catégorie
- `uid`: Identifiant utilisateur Firebase

## Installation et Configuration

### Prérequis

- Node.js (version 14 ou supérieure)
- MySQL Server
- Compte Firebase (pour l'authentification)
- Clé API Google Generative AI

### Étapes d'Installation

1. **Cloner ou télécharger le projet**
   ```bash
   # Aller dans le répertoire souhaité
   cd /chemin/vers/votre/dossier
   # Si clonage depuis Git (si applicable)
   git clone <url-du-repo>
   ```

2. **Installer les dépendances**
   ```bash
   # Aller à la racine du projet
   cd kinvest-hackathon-master
   npm install
   ```

3. **Configuration de la base de données**
   - Créer une base de données MySQL nommée `gestion_budget`
   - Importer le fichier `gestion_budget.sql` fourni
   - Modifier les paramètres de connexion dans `app.js` si nécessaire :
     ```javascript
     const connection = mysql.createConnection({
         host: 'localhost',
         user: 'votre_utilisateur',
         password: 'votre_mot_de_passe',
         database: 'gestion_budget'
     })
     ```

4. **Configuration Firebase**
   - Créer un projet Firebase
   - Activer Authentication avec Email/Password
   - Remplacer la configuration Firebase dans `app.js` avec vos propres clés

5. **Configuration Google Generative AI**
   - Obtenir une clé API Google AI Studio
   - Remplacer la clé API dans `app.js` :
     ```javascript
     const genAI = new GoogleGenerativeAI("VOTRE_CLE_API");
     ```

## Démarrage de l'Application

```bash
# Lancer le serveur
node app.js
```

L'application sera accessible sur `http://localhost:3000`

## Utilisation

### Première Connexion
1. Accéder à la page d'accueil
2. Cliquer sur "Se connecter" ou "S'inscrire"
3. Créer un compte ou se connecter avec des identifiants existants

### Gestion du Budget
1. Après connexion, accéder à l'année souhaitée
2. Créer un budget annuel en répartissant les montants par catégories
3. Modifier le budget selon les besoins

### Suivi des Dépenses
1. Ajouter des dépenses via l'interface
2. Sélectionner la catégorie appropriée
3. Indiquer le montant et la date

### Analyse et Conseils
1. Consulter le bilan annuel pour voir les écarts
2. Utiliser la fonctionnalité "Conseils par IA" pour des recommandations personnalisées
3. Poser des questions spécifiques sur le budget ou les catégories

## Structure du Projet

```
kinvest-hackathon-master/
├── app.js                    # Serveur principal Express
├── package.json              # Dépendances et scripts
├── gestion_budget.sql        # Schéma de base de données
├── readme.txt                # Instructions de base (ancien)
├── accueil.html              # Page d'accueil statique
├── login.html                # Page de connexion statique
├── register.html             # Page d'inscription statique
├── index.html                # Page d'index (si utilisée)
├── public/                   # Ressources statiques
│   ├── css/
│   │   ├── main.css          # Styles principaux
│   │   ├── responsive.css    # Styles responsives
│   │   ├── style.css         # Styles supplémentaires
│   │   └── vars.css          # Variables CSS
│   ├── images/               # Images du projet
│   └── js/
│       └── main.js           # Scripts JavaScript
├── views/                    # Templates EJS
│   ├── budget.ejs            # Page principale du budget
│   ├── bilanBudget.ejs       # Bilan budgétaire
│   ├── creerDepense.ejs      # Formulaire création dépense
│   ├── modifierBudget.ejs    # Modification budget
│   ├── modifierDepense.ejs   # Modification dépense
│   ├── questionIA.ejs        # Questions IA générales
│   ├── register.ejs          # Inscription (EJS)
│   ├── reponseIA.ejs         # Réponses IA générales
│   └── reponseIACategorie.ejs # Réponses IA par catégorie
├── maquette/                 # Maquettes et prototypes
│   ├── maquette/
│   │   ├── main.css
│   │   ├── main.html
│   │   ├── main.js
│   │   ├── responsive.css
│   │   ├── structure iconnes.txt
│   │   ├── transactions.css
│   │   ├── transactions.html
│   │   ├── transactions.js
│   │   └── assets/
└── doc/                      # Documentation
    └── Cas_usage.odg         # Cas d'usage (LibreOffice)
```

## API Routes

### Authentification
- `GET /` - Page d'accueil
- `GET /login` - Page de connexion
- `POST /login` - Connexion utilisateur
- `GET /register` - Page d'inscription
- `POST /register` - Création de compte
- `GET /logout` - Déconnexion

### Budget
- `GET /annee/:annee` - Affichage du budget pour une année
- `POST /budget/:annee` - Création/modification de budget
- `GET /budget/:annee/bilan` - Bilan budgétaire annuel

### Dépenses
- `POST /depense` - Ajout d'une dépense
- `PUT /depense/:id` - Modification d'une dépense
- `DELETE /depense/:id` - Suppression d'une dépense

### Intelligence Artificielle
- `GET /conseil/:annee/question` - Page de questions IA
- `POST /conseil/:annee` - Génération de conseils IA généraux
- `POST /conseil/:annee/categorie/:categorie` - Conseils IA par catégorie

## Sécurité

- Authentification Firebase pour la gestion des utilisateurs
- Sessions sécurisées avec tokens JWT
- Validation des entrées utilisateur
- Protection contre les injections SQL via requêtes paramétrées

## Développement et Contribution

### Scripts Disponibles
```bash
npm test  # Exécute les tests (à configurer)
```

### Améliorations Possibles
- Ajout de tests unitaires et d'intégration
- Implémentation d'une API REST complète
- Ajout de graphiques interactifs
- Support multi-devises
- Export des données (PDF, CSV)
- Notifications push
- Mode hors ligne avec PWA

## Support et Contact

Pour toute question ou problème, veuillez consulter la documentation ou contacter l'équipe de développement.

## Licence

Ce projet est sous licence ISC.

---

*Développé pour le Kinvest Hackathon - Gestion intelligente des dépenses personnelles*</content>
<parameter name="filePath">/Users/ulricheneli/Desktop/kinvest-hackathon-master/README.md
