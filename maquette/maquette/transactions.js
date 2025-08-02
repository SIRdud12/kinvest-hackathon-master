/**
 * Kinvest - Script pour la page des transactions
 * Gestion des transactions, filtres, modales et navigation
 */

document.addEventListener('DOMContentLoaded', function() {
    // Références aux éléments du DOM
    const currentMonthEl = document.getElementById('currentMonth');
    const currentYearEl = document.getElementById('currentYear');
    const monthDropdown = document.getElementById('monthDropdown');
    const transactionsList = document.getElementById('transactionsList');
    const addTransactionBtn = document.getElementById('addTransactionBtn');
    const transactionModal = document.getElementById('transactionModal');
    const closeModalBtn = document.getElementById('closeModal');
    const cancelBtn = document.getElementById('cancelTransaction');
    const transactionForm = document.getElementById('transactionForm');
    const typeOptions = document.querySelectorAll('.type-option');
    const filterItems = document.querySelectorAll('.filter-item');
    const prevMonthBtn = document.querySelector('.prev-month');
    const nextMonthBtn = document.querySelector('.next-month');
    const prevYearBtn = document.querySelector('.prev-year');
    const nextYearBtn = document.querySelector('.next-year');
    const monthItems = document.querySelectorAll('.month-item');
    const totalIncomeEl = document.getElementById('totalIncome');
    const totalExpensesEl = document.getElementById('totalExpenses');
    const totalBalanceEl = document.getElementById('totalBalance');
    
    // Données de base
    const months = [
        'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
        'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
    ];
    
    // Variables pour suivre la date active
    let currentDate = new Date();
    let activeMonth = currentDate.getMonth();
    let activeYear = currentDate.getFullYear();
    let currentFilter = 'all';
    
    // Base de données de transactions (simulée)
    // Dans une application réelle, cela viendrait d'une API ou localStorage
    const transactionsDB = [
        // Avril 2025
        {
            id: 1,
            name: "Salaire Mensuel",
            amount: 2800.00,
            type: "income",
            category: "salary",
            categoryName: "Revenus professionnels",
            date: "2025-04-05",
            time: "09:15",
            notes: ""
        },
        {
            id: 2,
            name: "Courses Alimentaires",
            amount: 84.75,
            type: "expense",
            category: "food",
            categoryName: "Alimentation",
            date: "2025-04-05",
            time: "14:30",
            notes: "Supermarché Carrefour"
        },
        {
            id: 3,
            name: "Facture Internet",
            amount: 45.50,
            type: "expense",
            category: "utilities",
            categoryName: "Services",
            date: "2025-04-04",
            time: "10:22",
            notes: ""
        },
        {
            id: 4,
            name: "Remboursement Jean",
            amount: 650.00,
            type: "income",
            category: "refund",
            categoryName: "Remboursements",
            date: "2025-04-02",
            time: "16:45",
            notes: "Pour la voiture"
        },
        {
            id: 5,
            name: "Essence",
            amount: 65.30,
            type: "expense",
            category: "transport",
            categoryName: "Transport",
            date: "2025-04-02",
            time: "09:15",
            notes: ""
        },
        
        // Mars 2025
        {
            id: 6,
            name: "Salaire Mensuel",
            amount: 2800.00,
            type: "income",
            category: "salary",
            categoryName: "Revenus professionnels",
            date: "2025-03-28",
            time: "09:00",
            notes: ""
        },
        {
            id: 7,
            name: "Loyer Avril",
            amount: 850.00,
            type: "expense",
            category: "housing",
            categoryName: "Logement",
            date: "2025-03-29",
            time: "11:45",
            notes: ""
        },
        
        // Mai 2025
        {
            id: 8,
            name: "Salaire Mensuel",
            amount: 2800.00,
            type: "income",
            category: "salary",
            categoryName: "Revenus professionnels",
            date: "2025-05-05",
            time: "09:30",
            notes: ""
        },
        {
            id: 9,
            name: "Restaurant",
            amount: 75.80,
            type: "expense",
            category: "food",
            categoryName: "Alimentation",
            date: "2025-05-02",
            time: "20:15",
            notes: "Dîner en ville"
        }
    ];
    
    // Initialisation de la page
    init();
    
    /**
     * Initialise la page des transactions
     */
    function init() {
        // Afficher le mois actuel et charger les transactions
        updateDateDisplay();
        loadTransactions();
        
        // Initialiser le modal
        initModal();
        
        // Initialiser les événements du sélecteur de mois
        initMonthSelector();
        
        // Initialiser les filtres
        initFilters();
        
        // Initialiser la date du formulaire
        document.getElementById('transactionDate').valueAsDate = new Date();
    }
    
    /**
     * Initialise le modal d'ajout de transaction
     */
    function initModal() {
        // Bouton pour ouvrir le modal
        if (addTransactionBtn) {
            addTransactionBtn.addEventListener('click', openModal);
        }
        
        // Boutons pour fermer le modal
        if (closeModalBtn) {
            closeModalBtn.addEventListener('click', closeModal);
        }
        
        if (cancelBtn) {
            cancelBtn.addEventListener('click', closeModal);
        }
        
        // Fermer le modal en cliquant sur l'overlay
        if (transactionModal) {
            const overlay = transactionModal.querySelector('.modal-overlay');
            if (overlay) {
                overlay.addEventListener('click', closeModal);
            }
        }
        
        // Gérer le changement de type de transaction
        typeOptions.forEach(option => {
            option.addEventListener('click', function() {
                typeOptions.forEach(opt => opt.classList.remove('active'));
                this.classList.add('active');
                
                // Mettre à jour les catégories disponibles selon le type
                updateCategoryOptions(this.dataset.type);
            });
        });
        
        // Gérer la soumission du formulaire
        if (transactionForm) {
            transactionForm.addEventListener('submit', handleFormSubmit);
        }
    }
    
    /**
     * Initialise les événements du sélecteur de mois
     */
    function initMonthSelector() {
        // Ouvrir/fermer le dropdown
        if (currentMonthEl) {
            currentMonthEl.addEventListener('click', toggleMonthDropdown);
        }
        
        // Fermer le dropdown en cliquant ailleurs
        document.addEventListener('click', function(e) {
            if (monthDropdown && currentMonthEl && !monthDropdown.contains(e.target) && e.target !== currentMonthEl) {
                monthDropdown.classList.remove('active');
            }
        });
        
        // Navigation entre les mois
        if (prevMonthBtn) {
            prevMonthBtn.addEventListener('click', goToPrevMonth);
        }
        
        if (nextMonthBtn) {
            nextMonthBtn.addEventListener('click', goToNextMonth);
        }
        
        // Navigation entre les années
        if (prevYearBtn) {
            prevYearBtn.addEventListener('click', goToPrevYear);
        }
        
        if (nextYearBtn) {
            nextYearBtn.addEventListener('click', goToNextYear);
        }
        
        // Sélection d'un mois dans le dropdown
        monthItems.forEach(item => {
            item.addEventListener('click', function() {
                activeMonth = parseInt(this.dataset.month);
                updateDateDisplay();
                loadTransactions();
                monthDropdown.classList.remove('active');
            });
        });
    }
    
    /**
     * Initialise les filtres de transactions
     */
    function initFilters() {
        filterItems.forEach(filter => {
            filter.addEventListener('click', function() {
                filterItems.forEach(f => f.classList.remove('active'));
                this.classList.add('active');
                
                currentFilter = this.dataset.filter;
                applyFilters();
            });
        });
    }
    
    /**
     * Ouvre le modal d'ajout de transaction
     */
    function openModal() {
        if (transactionModal) {
            transactionModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }
    
    /**
     * Ferme le modal d'ajout de transaction
     */
    function closeModal() {
        if (transactionModal) {
            transactionModal.classList.remove('active');
            document.body.style.overflow = '';
            
            // Réinitialiser le formulaire
            if (transactionForm) {
                transactionForm.reset();
            }
            
            // Réinitialiser le type de transaction
            typeOptions.forEach(option => {
                option.classList.remove('active');
            });
            document.querySelector('.type-option.income').classList.add('active');
            
            // Réinitialiser les catégories
            updateCategoryOptions('income');
        }
    }
    
    /**
     * Met à jour l'affichage de la date active
     */
    function updateDateDisplay() {
        if (currentMonthEl) {
            currentMonthEl.textContent = `${months[activeMonth]} ${activeYear}`;
        }
        
        if (currentYearEl) {
            currentYearEl.textContent = activeYear;
        }
        
        // Mettre à jour le mois actif dans le dropdown
        monthItems.forEach(item => {
            const month = parseInt(item.dataset.month);
            if (month === activeMonth) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }
    
    /**
     * Affiche/masque le dropdown des mois
     */
    function toggleMonthDropdown() {
        if (monthDropdown) {
            monthDropdown.classList.toggle('active');
        }
    }
    
    /**
     * Va au mois précédent
     */
    function goToPrevMonth() {
        activeMonth--;
        if (activeMonth < 0) {
            activeMonth = 11;
            activeYear--;
        }
        updateDateDisplay();
        loadTransactions();
    }
    
    /**
     * Va au mois suivant
     */
    function goToNextMonth() {
        activeMonth++;
        if (activeMonth > 11) {
            activeMonth = 0;
            activeYear++;
        }
        updateDateDisplay();
        loadTransactions();
    }
    
    /**
     * Va à l'année précédente
     */
    function goToPrevYear() {
        activeYear--;
        updateDateDisplay();
        loadTransactions();
    }
    
    /**
     * Va à l'année suivante
     */
    function goToNextYear() {
        activeYear++;
        updateDateDisplay();
        loadTransactions();
    }
    
    /**
     * Charge les transactions pour le mois actif
     */
    function loadTransactions() {
        if (!transactionsList) return;
        
        // Vider la liste actuelle
        transactionsList.innerHTML = '';
        
        // Filtrer les transactions par mois et année
        const transactions = getTransactionsByMonth(activeMonth, activeYear);
        
        // Si aucune transaction, afficher un message
        if (transactions.length === 0) {
            transactionsList.innerHTML = `
                <div class="no-transactions">
                    <p>Aucune transaction pour ${months[activeMonth]} ${activeYear}</p>
                </div>
            `;
            
            // Mettre à jour les totaux
            updateSummary(transactions);
            return;
        }
        
        // Regrouper les transactions par date
        const groupedTransactions = groupTransactionsByDate(transactions);
        
        // Afficher les transactions groupées par date
        Object.keys(groupedTransactions).forEach(dateStr => {
            const dateGroup = document.createElement('div');
            dateGroup.className = 'transaction-date-group';
            
            // Formater l'en-tête de date
            const today = new Date();
            const yesterday = new Date(today);
            yesterday.setDate(today.getDate() - 1);
            
            let dateHeader;
            const transactionDate = new Date(dateStr);
            
            if (isSameDay(today, transactionDate)) {
                dateHeader = "Aujourd'hui";
            } else if (isSameDay(yesterday, transactionDate)) {
                dateHeader = "Hier";
            } else {
                dateHeader = formatDate(transactionDate);
            }
            
            dateGroup.innerHTML = `<div class="date-header">${dateHeader}</div>`;
            
            // Ajouter chaque transaction de cette date
            groupedTransactions[dateStr].forEach(transaction => {
                const transactionEl = createTransactionElement(transaction);
                dateGroup.appendChild(transactionEl);
            });
            
            transactionsList.appendChild(dateGroup);
        });
        
        // Mettre à jour les totaux
        updateSummary(transactions);
        
        // Appliquer les filtres
        applyFilters();
    }
    
    /**
     * Crée un élément HTML pour une transaction
     * @param {Object} transaction - Données de la transaction
     * @returns {HTMLElement} - L'élément HTML créé
     */
    function createTransactionElement(transaction) {
        const transactionEl = document.createElement('div');
        transactionEl.className = `transaction-item ${transaction.type}`;
        transactionEl.dataset.id = transaction.id;
        transactionEl.dataset.category = transaction.category;
        
        const iconPath = `icons/${transaction.category}.png`;
        
        transactionEl.innerHTML = `
            <div class="transaction-icon">
                <img src="${iconPath}" alt="${transaction.categoryName}">
            </div>
            <div class="transaction-details">
                <div class="transaction-name">${transaction.name}</div>
                <div class="transaction-amount">${transaction.type === 'income' ? '+' : '-'}${formatCurrency(transaction.amount)} €</div>
                <div class="transaction-category">${transaction.categoryName}</div>
                <div class="transaction-time">${transaction.time}</div>
            </div>
        `;
        
        return transactionEl;
    }
    
    /**
     * Groupe les transactions par date
     * @param {Array} transactions - Liste des transactions
     * @returns {Object} - Transactions groupées par date
     */
    function groupTransactionsByDate(transactions) {
        const grouped = {};
        
        transactions.forEach(transaction => {
            const date = transaction.date;
            
            if (!grouped[date]) {
                grouped[date] = [];
            }
            
            grouped[date].push(transaction);
        });
        
        // Trier les dates (plus récentes en premier)
        return Object.keys(grouped)
            .sort((a, b) => new Date(b) - new Date(a))
            .reduce((result, key) => {
                result[key] = grouped[key];
                return result;
            }, {});
    }
    
    /**
     * Vérifie si deux dates sont le même jour
     * @param {Date} date1 - Première date
     * @param {Date} date2 - Deuxième date
     * @returns {boolean} - True si c'est le même jour
     */
    function isSameDay(date1, date2) {
        return date1.getDate() === date2.getDate() &&
               date1.getMonth() === date2.getMonth() &&
               date1.getFullYear() === date2.getFullYear();
    }
    
    /**
     * Formate une date pour affichage
     * @param {Date} date - Date à formater
     * @returns {string} - Date formatée
     */
    function formatDate(date) {
        const options = { day: 'numeric', month: 'long', year: 'numeric' };
        return date.toLocaleDateString('fr-FR', options);
    }
    
    /**
     * Formate un montant en devise
     * @param {number} amount - Montant à formater
     * @returns {string} - Montant formaté
     */
    function formatCurrency(amount) {
        return amount.toLocaleString('fr-FR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }
    
    /**
     * Obtient les transactions pour un mois et une année spécifiques
     * @param {number} month - Mois (0-11)
     * @param {number} year - Année
     * @returns {Array} - Transactions filtrées
     */
    function getTransactionsByMonth(month, year) {
        // Dans une application réelle, cela viendrait d'une API ou localStorage
        return transactionsDB.filter(transaction => {
            const date = new Date(transaction.date);
            return date.getMonth() === month && date.getFullYear() === year;
        });
    }
    
    /**
     * Met à jour les totaux dans le résumé
     * @param {Array} transactions - Transactions à totaliser
     */
    function updateSummary(transactions) {
        let totalIncome = 0;
        let totalExpenses = 0;
        
        transactions.forEach(transaction => {
            if (transaction.type === 'income') {
                totalIncome += transaction.amount;
            } else {
                totalExpenses += transaction.amount;
            }
        });
        
        const balance = totalIncome - totalExpenses;
        
        // Mettre à jour les éléments HTML
        if (totalIncomeEl) {
            totalIncomeEl.textContent = `${formatCurrency(totalIncome)} €`;
        }
        
        if (totalExpensesEl) {
            totalExpensesEl.textContent = `${formatCurrency(totalExpenses)} €`;
        }
        
        if (totalBalanceEl) {
            totalBalanceEl.textContent = `${formatCurrency(balance)} €`;
        }
    }
    
    /**
     * Applique les filtres actuels aux transactions
     */
    function applyFilters() {
        const transactions = document.querySelectorAll('.transaction-item');
        
        transactions.forEach(transaction => {
            if (currentFilter === 'all' || transaction.classList.contains(currentFilter)) {
                transaction.classList.remove('hidden');
            } else {
                transaction.classList.add('hidden');
            }
        });
    }
    
    /**
     * Met à jour les options de catégorie selon le type de transaction
     * @param {string} type - Type de transaction (income ou expense)
     */
    function updateCategoryOptions(type) {
        const categorySelect = document.getElementById('transactionCategory');
        if (!categorySelect) return;
        
        const incomeCategories = categorySelect.querySelector('.income-categories');
        const expenseCategories = categorySelect.querySelector('.expense-categories');
        
        if (type === 'income') {
            incomeCategories.style.display = '';
            expenseCategories.style.display = 'none';
        } else {
            incomeCategories.style.display = 'none';
            expenseCategories.style.display = '';
        }
        
        // Réinitialiser la sélection
        categorySelect.value = '';
    }
    
    /**
     * Gère la soumission du formulaire d'ajout de transaction
     * @param {Event} e - Événement de soumission
     */
    function handleFormSubmit(e) {
        e.preventDefault();
        
        // Récupérer les valeurs du formulaire
        const typeElement = document.querySelector('.type-option.active');
        const nameElement = document.getElementById('transactionName');
        const amountElement = document.getElementById('transactionAmount');
        const categoryElement = document.getElementById('transactionCategory');
        const dateElement = document.getElementById('transactionDate');
        const notesElement = document.getElementById('transactionNotes');
        
        // Valider les champs requis
        if (!nameElement.value || !amountElement.value || !categoryElement.value || !dateElement.value) {
            alert('Veuillez remplir tous les champs obligatoires');
            return;
        }
        
        // Créer l'objet de transaction
        const transaction = {
            id: Date.now(), // Identifiant unique basé sur le timestamp
            name: nameElement.value,
            amount: parseFloat(amountElement.value),
            type: typeElement.dataset.type,
            category: categoryElement.value,
            categoryName: categoryElement.options[categoryElement.selectedIndex].text,
            date: dateElement.value,
            time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
            notes: notesElement.value
        };
        
        // Dans une application réelle, sauvegarder dans localStorage ou envoyer à une API
        console.log('Nouvelle transaction', transaction);
        
        // Ajouter à notre base de données locale
        transactionsDB.push(transaction);
        
        // Recharger les transactions si c'est le mois actif
        const transactionDate = new Date(transaction.date);
        if (transactionDate.getMonth() === activeMonth && transactionDate.getFullYear() === activeYear) {
            loadTransactions();
        }
        
        // Fermer le modal
        closeModal();
    }
});