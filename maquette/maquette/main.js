/**
 * Kinvest - Main JavaScript
 * Gestion des animations et interactions
 */

document.addEventListener('DOMContentLoaded', function() {
    // Références aux éléments principaux
    const hero = document.getElementById('hero');
    const presentationSection = document.getElementById('presentation');
    const phoneCarousel = document.getElementById('phoneCarousel');
    const phoneImages = document.querySelectorAll('.phone-carousel img');
    const scrollProgressBar = document.getElementById('scrollProgressBar');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    // Éléments de transition
    const phoneTransitionWrapper = document.getElementById('phoneTransitionWrapper');
    const phoneTransitionElement = document.getElementById('phoneTransitionElement');
    const heroPhone = document.querySelector('.phone-mockup');
    
    // Variables pour suivre l'état
    let isTransitioning = false;
    let isPhoneVisible = false;
    let transitionComplete = false;
    
    // Afficher initialement le téléphone dans la section hero
    // Mais cacher les téléphones dans la section de présentation
    phoneImages.forEach(phone => {
        phone.style.opacity = '0';
    });
    
    // Créer le menu hamburger pour mobile
    createMobileMenu();
    
    // Gestion du défilement et des animations
    window.addEventListener('scroll', function() {
        // Position actuelle du défilement
        const scrollTop = window.scrollY;
        
        // Calcul du pourcentage de défilement global
        const docHeight = document.body.offsetHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        
        // Mise à jour de la barre de progression globale
        if (scrollProgressBar) {
            scrollProgressBar.style.width = scrollPercent + '%';
        }
        
        // Gestion de la transition du téléphone
        if (hero && presentationSection && !transitionComplete) {
            const heroBottom = hero.offsetTop + hero.offsetHeight;
            const presentationTop = presentationSection.offsetTop;
            
            // Calculer le seuil de déclenchement (à mi-chemin entre les deux sections)
            const triggerPoint = heroBottom + (presentationTop - heroBottom) * 0.3;
            
            // Vérifier si nous avons dépassé le seuil
            if (scrollTop >= triggerPoint && !isTransitioning) {
                // Démarrer la transition
                startPhoneTransition();
            }
        }
        
        // Mise à jour de l'opacité des formes d'arrière-plan
        if (presentationSection) {
            const sectionTop = presentationSection.offsetTop;
            const sectionHeight = presentationSection.offsetHeight;
            const viewportBottom = scrollTop + window.innerHeight;
            
            // Calculer la progression dans la section
            const sectionProgress = Math.max(0, Math.min(1, 
                (viewportBottom - sectionTop) / sectionHeight
            ));
            
            const blurElements = document.querySelectorAll('.bg-shape');
            const opacityValue = Math.min(1, sectionProgress * 1.5);
            
            blurElements.forEach(element => {
                element.style.opacity = Math.max(0.1, opacityValue).toFixed(2);
            });
        }
    });
    
    /**
     * Démarre l'animation de transition du téléphone
     */
    function startPhoneTransition() {
        if (!heroPhone || !phoneTransitionWrapper || !phoneTransitionElement || !phoneCarousel) return;
        
        isTransitioning = true;
        
        // Obtenir les positions et dimensions
        const heroPhoneRect = heroPhone.getBoundingClientRect();
        const presentationPhoneRect = phoneCarousel.getBoundingClientRect();
        
        // Configurer l'élément de transition
        phoneTransitionElement.src = heroPhone.src;
        phoneTransitionElement.style.width = heroPhoneRect.width + 'px';
        phoneTransitionElement.style.height = heroPhoneRect.height + 'px';
        phoneTransitionElement.style.top = heroPhoneRect.top + window.scrollY + 'px';
        phoneTransitionElement.style.left = heroPhoneRect.left + 'px';
        
        // Afficher le conteneur de transition
        phoneTransitionWrapper.classList.add('active');
        
        // Masquer le téléphone original
        heroPhone.style.opacity = '0';
        
        // Animer vers la position finale après un court délai
        setTimeout(() => {
            phoneTransitionElement.style.width = presentationPhoneRect.width + 'px';
            phoneTransitionElement.style.height = presentationPhoneRect.height + 'px';
            phoneTransitionElement.style.top = presentationPhoneRect.top + window.scrollY + 'px';
            phoneTransitionElement.style.left = presentationPhoneRect.left + 'px';
            
            // Ajouter une rotation 3D ou un autre effet si désiré
            phoneTransitionElement.style.transform = 'rotateY(360deg) scale(1)';
            
            // Attendre la fin de la transition
            setTimeout(() => {
                // Masquer l'élément de transition
                phoneTransitionWrapper.classList.remove('active');
                
                // Afficher le téléphone dans la section de présentation
                const activePhone = document.querySelector('.phone-carousel img.active');
                if (activePhone) {
                    activePhone.style.opacity = '1';
                    activePhone.classList.add('phone-reveal');
                }
                
                // Marquer la transition comme terminée
                isTransitioning = false;
                transitionComplete = true;
                isPhoneVisible = true;
            }, 1200); // Durée de la transition
        }, 100);
    }
    
    /**
     * Réinitialise l'état pour permettre de refaire la transition
     * (utile si on remonte en haut de la page)
     */
    function resetTransition() {
        if (heroPhone) {
            heroPhone.style.opacity = '1';
        }
        
        phoneImages.forEach(phone => {
            phone.style.opacity = '0';
            phone.classList.remove('phone-reveal');
        });
        
        isTransitioning = false;
        transitionComplete = false;
        isPhoneVisible = false;
    }
    
    // Gérer le clic sur les liens de navigation pour réinitialiser si nécessaire
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            if (this.getAttribute('href') === '#hero') {
                resetTransition();
            }
        });
    });
    
    // Gestion du carrousel
    initCarousel();
    
    // Gestion du changement de thème
    initThemeSwitcher();
    
    // Gestion des liens d'ancrage
    initSmoothScrolling();
    
    // Animation des éléments au scroll
    initScrollAnimations();
    
    /**
     * Crée le menu hamburger pour mobile
     */
    function createMobileMenu() {
        if (window.innerWidth <= 768) {
            const navbar = document.querySelector('.navbar');
            const navLinks = document.querySelector('.nav-links');
            
            // Créer bouton hamburger
            if (!document.querySelector('.hamburger-menu')) {
                const hamburger = document.createElement('div');
                hamburger.classList.add('hamburger-menu');
                hamburger.innerHTML = `
                    <div class="hamburger-line"></div>
                    <div class="hamburger-line"></div>
                    <div class="hamburger-line"></div>
                `;
                
                // Styles du bouton hamburger
                hamburger.style.cssText = `
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    width: 30px;
                    height: 20px;
                    cursor: pointer;
                    position: absolute;
                    right: 20px;
                    top: 20px;
                    z-index: 101;
                `;
                
                // Styles pour les lignes du hamburger
                const lines = hamburger.querySelectorAll('.hamburger-line');
                lines.forEach(line => {
                    line.style.cssText = `
                        width: 100%;
                        height: 3px;
                        background-color: #333;
                        border-radius: 3px;
                        transition: all 0.3s ease;
                    `;
                });
                
                navbar.appendChild(hamburger);
                
                // Style initial du menu
                navLinks.style.cssText = `
                    display: none;
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100vh;
                    background-color: white;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    z-index: 100;
                    gap: 20px;
                    padding: 50px 0;
                `;
                
                // Gérer le clic sur le hamburger
                hamburger.addEventListener('click', function() {
                    if (navLinks.style.display === 'none') {
                        navLinks.style.display = 'flex';
                        // Transformer en X
                        lines[0].style.transform = 'rotate(45deg) translate(5px, 6px)';
                        lines[1].style.opacity = '0';
                        lines[2].style.transform = 'rotate(-45deg) translate(5px, -6px)';
                    } else {
                        navLinks.style.display = 'none';
                        // Retour à hamburger
                        lines[0].style.transform = 'none';
                        lines[1].style.opacity = '1';
                        lines[2].style.transform = 'none';
                    }
                });
                
                // Fermer le menu au clic sur un lien
                const navItems = navLinks.querySelectorAll('a');
                navItems.forEach(item => {
                    item.addEventListener('click', function() {
                        if (window.innerWidth <= 768) {
                            navLinks.style.display = 'none';
                            lines[0].style.transform = 'none';
                            lines[1].style.opacity = '1';
                            lines[2].style.transform = 'none';
                        }
                    });
                });
            }
        }
    }
    
    /**
     * Initialise le carrousel
     */
    function initCarousel() {
        const indicators = document.querySelectorAll('.indicator');
        const prevArrow = document.querySelector('.arrow-prev');
        const nextArrow = document.querySelector('.arrow-next');
        const phoneImages = document.querySelectorAll('.phone-carousel img');
        
        if (indicators.length > 0 && phoneImages.length > 0) {
            let currentSlide = 0;
            
            // Mettre à jour l'indicateur actif et l'image du téléphone
            function updateCarousel() {
                // Mettre à jour les indicateurs
                indicators.forEach((indicator, index) => {
                    if (index === currentSlide) {
                        indicator.classList.add('active');
                    } else {
                        indicator.classList.remove('active');
                    }
                });
                
                // Mettre à jour les images du téléphone
                phoneImages.forEach((phone, index) => {
                    if (index === currentSlide) {
                        // Afficher le téléphone actif
                        phone.classList.add('active');
                        phone.style.opacity = '1';
                    } else {
                        // Cacher les autres téléphones
                        phone.classList.remove('active');
                        phone.style.opacity = '0';
                    }
                });
            }
            
            // Flèches du carrousel
            if (prevArrow) {
                prevArrow.addEventListener('click', function() {
                    currentSlide = (currentSlide - 1 + indicators.length) % indicators.length;
                    updateCarousel();
                });
            }
            
            if (nextArrow) {
                nextArrow.addEventListener('click', function() {
                    currentSlide = (currentSlide + 1) % indicators.length;
                    updateCarousel();
                });
            }
            
            // Clic sur les indicateurs
            indicators.forEach((indicator, index) => {
                indicator.addEventListener('click', function() {
                    currentSlide = index;
                    updateCarousel();
                });
            });
            
            // Défilement automatique (optionnel)
            const autoplayInterval = setInterval(() => {
                if (isPhoneVisible) {  // Ne pas changer si le téléphone n'est pas visible
                    currentSlide = (currentSlide + 1) % indicators.length;
                    updateCarousel();
                }
            }, 8000);
            
            // Arrêter l'autoplay lorsque l'utilisateur interagit
            [prevArrow, nextArrow, ...indicators].forEach(el => {
                if (el) {
                    el.addEventListener('click', () => {
                        clearInterval(autoplayInterval);
                    });
                }
            });
        }
    }
    
    /**
     * Initialise le sélecteur de thème
     */
    function initThemeSwitcher() {
        const themeOptions = document.querySelectorAll('.theme-option');
        
        if (themeOptions.length > 0) {
            themeOptions.forEach(option => {
                option.addEventListener('click', function(e) {
                    e.preventDefault();
                    
                    themeOptions.forEach(opt => {
                        opt.classList.remove('active');
                    });
                    
                    this.classList.add('active');
                    
                    // Changer le thème (lumière/sombre)
                    if (this.textContent === 'Sombre') {
                        const presentation = document.querySelector('.presentation');
                        presentation.style.backgroundColor = '#333';
                        presentation.style.color = '#fff';
                        document.querySelector('.presentation h1').style.color = '#fff';
                        document.querySelector('.presentation p').style.color = '#ddd';
                        
                        // Mettre à jour les indicateurs
                        document.querySelectorAll('.indicator').forEach(ind => {
                            ind.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
                        });
                        document.querySelector('.indicator.active').style.backgroundColor = '#2ecc71';
                        
                        // Mettre à jour les features
                        document.querySelectorAll('.feature').forEach(feature => {
                            feature.style.backgroundColor = 'rgba(50, 50, 50, 0.8)';
                            feature.style.color = '#fff';
                        });
                        document.querySelectorAll('.feature h3').forEach(title => {
                            title.style.color = '#fff';
                        });
                        document.querySelectorAll('.feature p').forEach(text => {
                            text.style.color = '#ddd';
                        });
                    } else {
                        const presentation = document.querySelector('.presentation');
                        presentation.style.backgroundColor = '#b3b3b3';
                        presentation.style.color = '#333';
                        document.querySelector('.presentation h1').style.color = '#222';
                        document.querySelector('.presentation p').style.color = '#333';
                        
                        // Réinitialiser les indicateurs
                        document.querySelectorAll('.indicator').forEach(ind => {
                            ind.style.backgroundColor = 'rgba(255, 255, 255, 0.7)';
                        });
                        document.querySelector('.indicator.active').style.backgroundColor = '#2ecc71';
                        
                        // Réinitialiser les features
                        document.querySelectorAll('.feature').forEach(feature => {
                            feature.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
                            feature.style.color = '#333';
                        });
                        document.querySelectorAll('.feature h3').forEach(title => {
                            title.style.color = '#333';
                        });
                        document.querySelectorAll('.feature p').forEach(text => {
                            text.style.color = '#555';
                        });
                    }
                });
            });
        }
    }
    
    /**
     * Initialiser le défilement fluide pour les liens d'ancrage
     */
    function initSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    e.preventDefault();
                    
                    // Défilement vers la section
                    window.scrollTo({
                        top: targetElement.offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
    
    /**
     * Initialiser les animations au scroll
     */
    function initScrollAnimations() {
        // Animation des features
        const features = document.querySelectorAll('.feature');
        
        if (features.length > 0) {
            // Configurer les features pour être initialement invisibles
            features.forEach((feature, index) => {
                feature.style.opacity = '0';
                feature.style.transform = 'translateY(50px)';
                feature.style.transition = `opacity 0.6s ease, transform 0.6s ease`;
                feature.style.transitionDelay = `${index * 0.2}s`;
            });
            
            // Observer pour les animer au scroll
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }
                });
            }, { threshold: 0.1 });
            
            features.forEach(feature => {
                observer.observe(feature);
            });
        }
    }
    
    // Gestion du redimensionnement de la fenêtre
    window.addEventListener('resize', function() {
        createMobileMenu();
    });
}); 