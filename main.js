// Modern Fortran Pie Website JavaScript
class FortranPieWebsite {
    constructor() {
        this.cart = [];
        this.currentTestimonial = 0;
        this.testimonialInterval = null;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupScrollEffects();
        this.setupTestimonialCarousel();
        this.setupSmoothScrolling();
        this.setupMobileMenu();
        this.setupCartSystem();
        this.setupFormHandling();
        this.setupScrollReveal();
    }

    setupEventListeners() {
        // Wait for DOM to be fully loaded
        document.addEventListener('DOMContentLoaded', () => {
            console.log('Fortran Pie website loaded successfully!');
        });

        // Navbar scroll effect
        window.addEventListener('scroll', () => {
            this.handleNavbarScroll();
        });

        // Hero scroll arrow
        const heroScroll = document.querySelector('.hero-scroll');
        if (heroScroll) {
            heroScroll.addEventListener('click', () => {
                document.querySelector('#about').scrollIntoView({
                    behavior: 'smooth'
                });
            });
        }
    }

    handleNavbarScroll() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    setupScrollEffects() {
        // Intersection Observer for scroll animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    // Add staggered animation for child elements
                    const children = entry.target.querySelectorAll('.pizza-card, .stat, .contact-item');
                    children.forEach((child, index) => {
                        setTimeout(() => {
                            child.style.animation = `fadeInUp 0.6s ease forwards ${index * 0.1}s`;
                        }, index * 100);
                    });
                }
            });
        }, observerOptions);

        // Observe all sections for scroll reveal
        const sections = document.querySelectorAll('section');
        sections.forEach(section => {
            section.classList.add('scroll-reveal');
            observer.observe(section);
        });
    }

    setupTestimonialCarousel() {
        const slides = document.querySelectorAll('.testimonial-slide');
        const dots = document.querySelectorAll('.dot');
        
        if (slides.length === 0) return;

        // Auto-advance testimonials
        this.testimonialInterval = setInterval(() => {
            this.nextTestimonial();
        }, 5000);

        // Manual navigation
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                this.goToTestimonial(index);
            });
        });

        // Pause on hover
        const carousel = document.querySelector('.testimonials-carousel');
        if (carousel) {
            carousel.addEventListener('mouseenter', () => {
                clearInterval(this.testimonialInterval);
            });

            carousel.addEventListener('mouseleave', () => {
                this.testimonialInterval = setInterval(() => {
                    this.nextTestimonial();
                }, 5000);
            });
        }
    }

    nextTestimonial() {
        const slides = document.querySelectorAll('.testimonial-slide');
        const dots = document.querySelectorAll('.dot');
        
        this.currentTestimonial = (this.currentTestimonial + 1) % slides.length;
        this.updateTestimonialDisplay();
    }

    goToTestimonial(index) {
        this.currentTestimonial = index;
        this.updateTestimonialDisplay();
    }

    updateTestimonialDisplay() {
        const slides = document.querySelectorAll('.testimonial-slide');
        const dots = document.querySelectorAll('.dot');

        slides.forEach((slide, index) => {
            slide.classList.toggle('active', index === this.currentTestimonial);
        });

        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentTestimonial);
        });
    }

    setupSmoothScrolling() {
        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    const navHeight = document.querySelector('.navbar').offsetHeight;
                    const targetPosition = target.offsetTop - navHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    setupMobileMenu() {
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');

        if (hamburger && navMenu) {
            hamburger.addEventListener('click', () => {
                hamburger.classList.toggle('active');
                navMenu.classList.toggle('active');
            });

            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                }
            });

            // Close menu when clicking on a link
            navMenu.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                });
            });
        }
    }

    setupCartSystem() {
        // Add to cart buttons
        document.querySelectorAll('.add-to-cart-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const name = button.dataset.name;
                const price = parseFloat(button.dataset.price);
                this.addToCart(name, price, button);
            });
        });

        // Quick order buttons
        document.querySelectorAll('.quick-order-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                e.stopPropagation();
                const card = button.closest('.pizza-card');
                const name = card.querySelector('h3').textContent;
                const price = parseFloat(card.querySelector('.pizza-price').textContent.replace('$', ''));
                this.addToCart(name, price, button);
                this.showQuickOrderAnimation(button);
            });
        });

        // Floating cart
        const floatingCart = document.querySelector('.floating-cart');
        if (floatingCart) {
            floatingCart.addEventListener('click', () => {
                this.showCart();
            });
        }

        // Order now buttons
        document.querySelectorAll('.nav-order-btn, .btn-primary').forEach(button => {
            if (button.textContent.toLowerCase().includes('order')) {
                button.addEventListener('click', () => {
                    this.redirectToOrder();
                });
            }
        });
    }

    addToCart(name, price, button) {
        const existingItem = this.cart.find(item => item.name === name);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.cart.push({
                name: name,
                price: price,
                quantity: 1
            });
        }

        this.updateCartDisplay();
        this.showAddToCartAnimation(button);
        this.saveCartToStorage();
    }

    updateCartDisplay() {
        const cartCount = document.querySelector('.cart-count');
        if (cartCount) {
            const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
            cartCount.textContent = totalItems;
            
            if (totalItems > 0) {
                cartCount.style.display = 'flex';
            } else {
                cartCount.style.display = 'none';
            }
        }
    }

    showAddToCartAnimation(button) {
        const originalText = button.innerHTML;
        button.innerHTML = '<i class="fas fa-check"></i> Added!';
        button.style.background = 'linear-gradient(135deg, #28a745, #20c997)';
        
        setTimeout(() => {
            button.innerHTML = originalText;
            button.style.background = '';
        }, 2000);
    }

    showQuickOrderAnimation(button) {
        button.textContent = '✓ Added!';
        button.style.background = '#28a745';
        
        setTimeout(() => {
            button.textContent = 'Quick Order';
            button.style.background = '';
        }, 2000);
    }

    showCart() {
        if (this.cart.length === 0) {
            alert('Your cart is empty. Add some delicious pizzas first!');
            return;
        }

        let cartSummary = 'Your Cart:\n\n';
        let total = 0;

        this.cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            cartSummary += `${item.name} x${item.quantity} - $${itemTotal.toFixed(2)}\n`;
            total += itemTotal;
        });

        cartSummary += `\nTotal: $${total.toFixed(2)}`;
        cartSummary += '\n\nWould you like to proceed to checkout?';

        if (confirm(cartSummary)) {
            this.redirectToOrder();
        }
    }

    redirectToOrder() {
        // In a real application, this would redirect to your ordering system
        window.open('https://www.pizzahut.com.ph/order/deal', '_blank');
    }

    saveCartToStorage() {
        localStorage.setItem('fortranPieCart', JSON.stringify(this.cart));
    }

    loadCartFromStorage() {
        const savedCart = localStorage.getItem('fortranPieCart');
        if (savedCart) {
            this.cart = JSON.parse(savedCart);
            this.updateCartDisplay();
        }
    }

    setupFormHandling() {
        const contactForm = document.getElementById('contactForm');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleContactForm(contactForm);
            });
        }

        const newsletter = document.querySelector('.newsletter');
        if (newsletter) {
            newsletter.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleNewsletterSignup(newsletter);
            });
        }
    }

    handleContactForm(form) {
        const formData = new FormData(form);
        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;

        // Show loading state
        submitButton.innerHTML = '<div class="loading"></div> Sending...';
        submitButton.disabled = true;

        // Simulate form submission (replace with actual API call)
        setTimeout(() => {
            alert('Thank you for your message! We\'ll get back to you within 24 hours.');
            form.reset();
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        }, 2000);
    }

    handleNewsletterSignup(form) {
        const input = form.querySelector('input[type="email"]');
        const button = form.querySelector('button');
        const email = input.value;

        if (!email || !this.isValidEmail(email)) {
            alert('Please enter a valid email address.');
            return;
        }

        const originalText = button.textContent;
        button.textContent = 'Subscribing...';
        button.disabled = true;

        // Simulate subscription (replace with actual API call)
        setTimeout(() => {
            alert('Thank you for subscribing! You\'ll receive our latest offers and updates.');
            input.value = '';
            button.textContent = originalText;
            button.disabled = false;
        }, 1500);
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    setupScrollReveal() {
        // Add entrance animations for various elements
        const animateElements = document.querySelectorAll('.pizza-card, .stat, .contact-item, .feature-card');
        
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, index * 100);
                    revealObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        animateElements.forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            element.style.transition = 'all 0.6s ease';
            revealObserver.observe(element);
        });
    }

    // Utility method for debugging
    logCartContents() {
        console.log('Current cart:', this.cart);
        console.log('Total items:', this.cart.reduce((sum, item) => sum + item.quantity, 0));
        console.log('Total value:', this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0));
    }
}

// Initialize the website when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.fortranPie = new FortranPieWebsite();
    
    // Load saved cart from storage
    window.fortranPie.loadCartFromStorage();
    
    // Add some fun console messages
    console.log('%c🍕 Welcome to Fortran Pie! 🍕', 'color: #D2401E; font-size: 24px; font-weight: bold;');
    console.log('%cSlicing through hunger, byte by byte!', 'color: #FF6B35; font-size: 14px;');
});

// Export for potential use in other scripts
window.FortranPieWebsite = FortranPieWebsite;