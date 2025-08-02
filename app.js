const express = require('express')
var path = require('path')
const app = express()
const port = 3000

const mysql = require('mysql')
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'gestion_budget'
})

connection.connect()

app.set('view engine', 'ejs')

const firebase = require("firebase/app")

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

// TODO: Add SDKs for Firebase products that you want to use

// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration

// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {

  apiKey: "AIzaSyCn_YO1nKj6HwCsW46V2uPlyVRFWBFyKek",

  authDomain: "gestionbudget-4ea77.firebaseapp.com",

  projectId: "gestionbudget-4ea77",

  storageBucket: "gestionbudget-4ea77.firebasestorage.app",

  messagingSenderId: "364095033148",

  appId: "1:364095033148:web:521ece2f62d8d1f0c6d839",

  measurementId: "G-SQ2EG8H5T0"

};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  sendEmailVerification, 
  sendPasswordResetEmail

} = require("firebase/auth") ;

const auth = getAuth();

const { GoogleGenerativeAI } = require("@google/generative-ai");

// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI("AIzaSyAsHoz6uhnWiewkEZf1jqdIDw_BeEoxe6Q");

async function gemini(req) {
    // The Gemini 1.5 models are versatile and work with both text-only and multimodal prompts
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});
  
    const prompt = req
  
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return text;
  }
  
app.use(express.static(__dirname + '/public'));

app.use(express.static(path.join('public', 'views')));

// page accueil
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname+'/accueil.html'))
})

// page de login
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname+'/login.html'));
})

// login
app.post('/login', async (req, res) => {
    const data = req.body;
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(422).json({
            email: "Email is required",
            password: "Password is required",
        });
    }
    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => { 
        const idToken = userCredential._tokenResponse.idToken
        if (idToken) {
            res.cookie('access_token', idToken, {
                httpOnly: true
            });
            const today = new Date();
            res.redirect('/annee/' + today.getFullYear())
        } else {
            res.status(500).json({ error: "Internal Server Error" });
        }
    })
    .catch((error) => {
        console.error(error);
        const errorMessage = error.message || "An error occurred while logging in";
        res.status(500).json({ error: errorMessage });
    });
})

// logout
app.get('/logout', (req, res) => {
    auth.signOut()
    .then(function() {
        console.log('Signed Out');
        // retour à l'accueil
        res.redirect('/');
    }, function(error) {
        console.error('Sign Out Error', error);
        res.status(500).json({ error: errorMessage });
    });
})

// page de creation utilisateur
app.get('/register', (req, res) => {
    const errorMessage = req.params.errorMessage
    res.render('register', { errorMessage });
//    res.sendFile(path.join(__dirname+'/register.html'));
})

// creation utilisateur
app.post('/register', async (req, res) => {
    const data = req.body;
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(422).json({
            email: "Email is required",
            password: "Password is required",
        });
    }
    createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        // Signed up 
        const user = userCredential.user;
        res.redirect('/login')
    })
    .catch((error) => {
        console.log(error)
        const errorCode = error.code;
        const errorMessage = error.message;
        res.render('register', { errorMessage });
    });
})

// affichage budget
app.get('/annee/:annee', (req, res) => {

    if (!auth.currentUser) {
      res.redirect('/login')
      return
    }

    const user = auth.currentUser
  
    const annee = req.params.annee

    const queryBudgetUser = "SELECT * FROM budget WHERE uid = '" + user.uid + "'"
    connection.query(queryBudgetUser, (err, budgetUser) => {
        if (budgetUser.length == 0) {
            // creation d'un budget pour l'utilisateur
            const queryCreationBudget = "INSERT INTO budget(uid,annee) VALUES('" + user.uid + "'," + annee + ")"
            connection.query(queryCreationBudget, (err, result) => {
            })
        }
        queryBudget = "SELECT b.id as id_budget, c.id as id_categorie, c.nom as categorie, b.annee as annee, SUM(bc.montant) as montant FROM budget AS b LEFT JOIN budget_categories AS bc ON b.id=bc.budget_id LEFT JOIN categorie AS c ON c.id=bc.categorie_id WHERE b.uid = '" + user.uid + "' AND b.annee = " + annee + " GROUP BY categorie"
        connection.query(queryBudget, (err, budget) => {
            const queryTotalBudget = "SELECT SUM(bc.montant) AS montant FROM budget AS b JOIN budget_categories AS bc ON bc.budget_id=b.id WHERE b.uid = '" + user.uid + "' AND b.annee = " + annee
            connection.query(queryTotalBudget, (err, totalBudget) => {
                const queryTransactions = "SELECT d.id AS id, d.date AS date, c.nom AS categorie, d.montant AS montant FROM depense AS d JOIN categorie AS c ON c.id=d.categorie_id WHERE d.uid = '" + user.uid + "' AND date >= '" + annee + "-01-01' AND date <= '" + annee + "-12-31' ORDER BY date DESC LIMIT 10 OFFSET 0"
                connection.query(queryTransactions, (err, transactions) => {
                    const queryTotalDepense = "SELECT SUM(d.montant) AS montant FROM depense AS d WHERE d.uid = '" + user.uid + "' AND d.date >= '" + annee + "-01-01' AND d.date <= '" + annee + "-12-31'"
                    connection.query(queryTotalDepense, (err, totalDepense) => {
                        const queryCategories = "SELECT * FROM categorie ORDER BY nom ASC"
                        connection.query(queryCategories, (err, categories) => {
                            const user = auth.currentUser
                            res.render('budget', { budget, totalBudget, transactions, totalDepense, categories, annee, user });
                        })
                    })
                })
            })
        })
    })
})

// affichage bilan budget
app.get('/budget/:annee/bilan', (req, res) => {

    if (!auth.currentUser) {
      res.redirect('/login')
      return
    }

    const user = auth.currentUser
  
    const annee = req.params.annee

    const queryBudget = "SELECT b.id as id_budget, c.id as id_categorie, c.nom as categorie, b.annee as annee, SUM(bc.montant) as montant FROM budget AS b LEFT JOIN budget_categories AS bc ON b.id=bc.budget_id LEFT JOIN categorie AS c ON c.id=bc.categorie_id WHERE b.uid = '" + user.uid + "' AND b.annee = " + annee + " GROUP BY categorie"
    connection.query(queryBudget, (err, budget) => {
        const queryTotalBudget = "SELECT SUM(bc.montant) AS montant FROM budget AS b JOIN budget_categories AS bc ON bc.budget_id=b.id WHERE b.uid = '" + user.uid + "' AND b.annee = " + annee
        connection.query(queryTotalBudget, (err, totalBudget) => {
            const queryTransactions = "SELECT c.id AS id_categorie, c.nom AS categorie, SUM(d.montant) AS montant FROM depense AS d JOIN categorie AS c ON c.id=d.categorie_id WHERE d.uid = '" + user.uid + "' AND date >= '" + annee + "-01-01' AND date <= '" + annee + "-12-31' GROUP BY categorie"
            connection.query(queryTransactions, (err, depense) => {
                const queryTotalDepense = "SELECT SUM(d.montant) AS montant FROM depense AS d WHERE d.uid = '" + user.uid + "' AND d.date >= '" + annee + "-01-01' AND d.date <= '" + annee + "-12-31'"
                connection.query(queryTotalDepense, (err, totalDepense) => {
                    const queryCategories = "SELECT * FROM categorie ORDER BY nom ASC"
                    connection.query(queryCategories, (err, categories) => {
                        const user = auth.currentUser
                        res.render('bilanBudget', { budget, totalBudget, depense, totalDepense, categories, annee, user });
                    })
                })
            })
        })
    })
})

// formulaire modification budget
app.get('/budget/:budget/categorie/:categorie/modifier', (req, res) => {

    if (!auth.currentUser) {
      res.redirect('/login')
      return
    }

    const user =auth.currentUser

    const idBudget = req.params.budget
    const idCategorie = req.params.categorie

    const queryBudget = "SELECT * FROM budget WHERE id = " + idBudget
    connection.query(queryBudget, (err, budget) => {
        if (budget.length == 1) {
            if (budget[0].uid == user.uid) {
                const annee = budget[0].annee
                const queryCategorie = "SELECT * FROM categorie WHERE id = " + idCategorie
                connection.query(queryCategorie, (err, categorie) => {
                    const queryBudgetCategorie = "SELECT * FROM budget_categories WHERE budget_id = " + idBudget + " AND categorie_id = " + idCategorie
                    connection.query(queryBudgetCategorie, (err, budgetCategorie) => {
                        res.render('modifierBudget', { annee, budget, categorie, budgetCategorie, user });
                    })
                })
            } else {
                console.log("L'utilisateur connecte n'est pas le proprietaire du budget")
                res.redirect('/')
            }
        } else {
            console.log("pas de budget pour id = " + idBudget)
            res.redirect('/')
        }
    })
})

// modification budget
app.post('/modifierBudget', async (req, res) => {
    
    if (!auth.currentUser) {
        res.redirect('/login')
        return
    }
  
    const data = req.body;
    const { budget, categorie, montant } = req.body;

    if (!budget || !categorie) {
        return res.status(422).json({
            budget: "Budget is required",
            categorie: "Categorie is required",
        });
    }
    const queryBudget = "SELECT * FROM budget WHERE id = " + budget
    connection.query(queryBudget, (err, budgetComplet) => {
        const queryBudgetCategorie = "SELECT * FROM budget_categories WHERE budget_id = " + budget + " AND categorie_id = " + categorie
        connection.query(queryBudgetCategorie, (err, budgetCategorie) => {

            if (budgetCategorie.length == 1) {
                if (montant) {
                    const updateBudgetCategorie = "UPDATE budget_categories SET montant = " + montant + " WHERE budget_id = " + budget + " AND categorie_id = " + categorie
                    connection.query(updateBudgetCategorie, (err, result) => {
                    })
                } else {
                    const deleteBudgetCategorie = "DELETE FROM budget_categories WHERE budget_id = " + budget + " AND categorie_id = " + categorie
                    connection.query(deleteBudgetCategorie, (err, result) => {
                    })
                }
            } else {
                if (montant) {
                    const insertBudgetCategorie = "INSERT INTO budget_categories(budget_id, categorie_id, montant) VALUES(" + budget + "," + categorie + "," + montant +")"
                    connection.query(insertBudgetCategorie, (err, result) => {
                    })
                }
            }
            res.redirect('/annee/' + budgetComplet[0].annee)
        })
    })

})

// formulaire modification depense
app.get('/depense/:depense/modifier', (req, res) => {

    if (!auth.currentUser) {
      res.redirect('/login')
      return
    }

    const user =auth.currentUser

    const idDepense = req.params.depense

    const queryDepense = "SELECT id, uid, date, categorie_id, montant, YEAR(date) as year FROM depense WHERE id = " + idDepense
    connection.query(queryDepense, (err, depense) => {
        if (depense.length == 1) {
            if (depense[0].uid == user.uid) {
                const queryCategories = "SELECT * FROM categorie ORDER BY nom ASC"
                connection.query(queryCategories, (err, categories) => {
                    const annee = depense[0].year
                    res.render('modifierDepense', { annee, depense, categories, user });
                })
            } else {
                console.log("L'utilisateur connecte n'est pas le proprietaire de la depense")
                res.redirect('/')
            }
        } else {
            console.log("pas de depense pour id = " + idDepense)
            res.redirect('/')
        }
    })
})

// modification depense
app.post('/modifierDepense', async (req, res) => {

    if (!auth.currentUser) {
        res.redirect('/login')
        return
    }
  
    const data = req.body;      
    const { depense, categorie, montant, date } = req.body;

    const idDepense = depense

    if (!depense || !categorie || !date || !montant) {
        return res.status(422).json({
            depense: "Depense is required",
            categorie: "Categorie is required",
            date: "Date is required",
            montant: "Montant is required",
        });
    }
    const jma = date.split('/')
    const dateBD = jma[2] + '-' + jma[1] + '-' + jma[0]
    const updateDepensesCategorie = "UPDATE depense SET date = '" + dateBD + "', montant = " + montant + ", categorie_id = " + categorie + " WHERE id = " + idDepense 
    connection.query(updateDepensesCategorie, (err, result) => {
        res.redirect('/annee/' + jma[2])
    })
})

// formulaire créer depense
app.get('/depense/creer/annee/:annee', (req, res) => {

    if (!auth.currentUser) {
      res.redirect('/login')
      return
    }

    const user =auth.currentUser

    const annee = req.params.annee

    const queryCategories = "SELECT * FROM categorie ORDER BY nom ASC"
    connection.query(queryCategories, (err, categories) => {
        res.render('creerDepense', { annee, categories, user });
    })
})

// création depense
app.post('/creerDepense', async (req, res) => {

    if (!auth.currentUser) {
        res.redirect('/login')
        return
    }

    const user = auth.currentUser
  
    const data = req.body;      
    const { categorie, montant, date } = req.body;

    if ( !categorie || !date || !montant) {
        return res.status(422).json({
            categorie: "Categorie is required",
            date: "Date is required",
            montant: "Montant is required",
        });
    }
    const jma = date.split('/')
    const dateBD = jma[2] + '-' + jma[1] + '-' + jma[0]
    const insertDepensesCategorie = "INSERT INTO depense(date, montant, categorie_id, uid) VALUES('" + dateBD + "'," + montant + "," + categorie + ",'" + user.uid + "')" 
    connection.query(insertDepensesCategorie, (err, result) => {
        res.redirect('/annee/' + jma[2])
    })
})

// supprimer depense
app.get('/depense/:depense/supprimer', async (req, res) => {

    if (!auth.currentUser) {
        res.redirect('/login')
        return
    }

    const user = auth.currentUser
  
    const idDepense = req.params.depense

    const queryDepense = "SELECT id, uid, date, categorie_id, montant, YEAR(date) as year FROM depense WHERE id = " + idDepense
    connection.query(queryDepense, (err, depense) => {
        const deleteDepensesCategorie = "DELETE FROM depense WHERE id = " + idDepense
        connection.query(deleteDepensesCategorie, (err, result) => {    
            res.redirect('/annee/' + depense[0].year)
        })
    })
})

// formulaire conseil IA
app.get('/conseil/:annee/question', (req, res) => {

    if (!auth.currentUser) {
      res.redirect('/login')
      return
    }

    const user = auth.currentUser
  
    const annee = req.params.annee

    res.render('questionIA', { annee, user });
})

// réponse conseil IA
app.post('/conseil/reponse', (req, res) => {

    if (!auth.currentUser) {
      res.redirect('/login')
      return
    }

    const user = auth.currentUser

    const data = req.body;      
    const { annee, question } = req.body;

    const queryBudget = "SELECT c.id AS idCategorie, c.nom AS categorie, SUM(bc.montant) as montant FROM budget AS b LEFT JOIN budget_categories AS bc ON b.id=bc.budget_id LEFT JOIN categorie AS c ON c.id=bc.categorie_id WHERE b.uid = '" + user.uid + "' AND b.annee = " + annee + " GROUP BY categorie"
    connection.query(queryBudget, (err, budget) => {
        const queryTotalDepenses = "SELECT d.date AS date, d.montant AS montant, c.nom AS categorie FROM depense AS d JOIN categorie As c ON c.id=d.categorie_id WHERE d.uid = '" + user.uid + "' AND d.date >= '" + annee + "-01-01' AND d.date <= '" + annee + "-12-31' ORDER BY date ASC"
        connection.query(queryTotalDepenses, (err, depenses) => {
            var questionIA = "Voici le budget par catégorie que j'ai prévu pour l'année " + annee + " : ";
            for (let i=0; i<budget.length; i++) {
                questionIA += budget[i].categorie + "=" + budget[i].montant + " €."
            }
            questionIA += "Voici la liste des dépenses réalisées par date et catégorie : ";
            for (let i=0; i<depenses.length; i++) {
                const date = new Date(depenses[i].date)
                questionIA += "date : " + date.toLocaleDateString('fr-FR') + "; catégorie : " + depenses[i].categorie + " ; montant = " + depenses[i].montant + " €."
            }
            questionIA += question + "?";
            gemini(questionIA).then((reponse) => {
                res.render('reponseIA', { annee, user, questionIA, reponse });
            })
        })
    })
})

// réponse conseil par catégorie
app.get('/conseil/annee/:annee/categorie/:categorie/budget/:budget/depense/:depense', (req, res) => {

    if (!auth.currentUser) {
      res.redirect('/login')
      return
    }

    const user = auth.currentUser

    const annee = req.params.annee
    const categorie = req.params.categorie
    const budget = req.params.budget
    const depense = req.params.depense

    var questionIA = "";
    if (categorie == "all") {
        questionIA += "Le budget total de l'année " + annee + " est de " + budget + " €."
        questionIA += "Les dépenses totales de l'année " + annee + " sont de " + depense + " €."
    } else {
        questionIA += "Le budget de l'année " + annee + " pour le poste " + categorie + " est de " + budget + " €."
        questionIA += "Les dépenses de l'année " + annee + " pour le poste " + categorie + " sont de " + depense + " €."
    }
    questionIA += " Quels conseils peux tu me donner pour mieux gérer mon argent ?";
    gemini(questionIA).then((reponse) => {
        res.render('reponseIACategorie', { annee, user, questionIA, reponse });
    })
})

app.get('/gemini', (req, res) => {
    question = "quels sont les conseils de sport."
    gemini(question).then((reponse) => {
        annee = 2025
        user = auth.currentUser
        res.render('gemini', { annee, user, question, reponse });
    })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
