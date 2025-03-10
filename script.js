// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS animation library with larger offset for fixed header
    AOS.init({
        duration: 800,
        easing: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        once: false,
        mirror: true,
        offset: 100
    });

    // Enhanced mobile menu toggle with overlay
    const mobileMenu = document.getElementById('mobile-menu');
    const navMenu = document.querySelector('.nav-menu');
    const menuOverlay = document.querySelector('.menu-overlay');
    const body = document.body;
    const header = document.querySelector('header');
    
    // Detect device type
    const isMobile = window.innerWidth <= 768;
    
    function toggleMenu() {
        mobileMenu.classList.toggle('active');
        navMenu.classList.toggle('active');
        menuOverlay.classList.toggle('active');
        
        if (mobileMenu.classList.contains('active')) {
            body.style.overflow = 'hidden';
            // Add animation to nav items with staggered delay
            document.querySelectorAll('.nav-menu li').forEach((item, index) => {
                item.style.transitionDelay = (0.1 + index * 0.1) + 's';
            });
        } else {
            body.style.overflow = '';
            // Reset animation delay when closing
            document.querySelectorAll('.nav-menu li').forEach(item => {
                item.style.transitionDelay = '';
            });
            
            // Add closing animation
            navMenu.style.transition = 'right 0.3s ease-in-out';
            setTimeout(() => {
                navMenu.style.transition = '';
            }, 300);
        }
    }
    
    if (mobileMenu) {
        mobileMenu.addEventListener('click', function(e) {
            e.stopPropagation();
            toggleMenu();
        });
    }

    // Close mobile menu when clicking overlay
    if (menuOverlay) {
        menuOverlay.addEventListener('click', function() {
            if (mobileMenu.classList.contains('active')) {
                toggleMenu();
            }
        });
    }

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (navMenu && mobileMenu && !mobileMenu.contains(e.target) && 
            !navMenu.contains(e.target) && 
            navMenu.classList.contains('active')) {
            toggleMenu();
        }
    });

    // Close mobile menu with escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && navMenu && navMenu.classList.contains('active')) {
            toggleMenu();
        }
    });

    // Close mobile menu when clicking on a nav link
    const navLinks = document.querySelectorAll('.nav-menu li a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (navMenu && navMenu.classList.contains('active')) {
                toggleMenu();
            }
        });
    });

    // Enhanced smooth scrolling for anchor links with header offset
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId !== '#' && document.querySelector(targetId)) {
                e.preventDefault();
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    const headerHeight = document.querySelector('header').offsetHeight;
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerHeight - 20;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Enhanced header scroll effect
    let lastScroll = 0;
    let scrollTimer;
    
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        
        // Add scrolled class when scrolled down
        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Handle hide/show header on scroll up/down
        if (currentScroll <= 0) {
            header.classList.remove('scroll-up');
            header.classList.remove('scroll-down');
            return;
        }
        
        clearTimeout(scrollTimer);
        scrollTimer = setTimeout(() => {
            if (currentScroll > lastScroll && !header.classList.contains('scroll-down') && currentScroll > 300) {
                // Scrolling down & past threshold
                header.classList.remove('scroll-up');
                header.classList.add('scroll-down');
            } else if (currentScroll < lastScroll && header.classList.contains('scroll-down')) {
                // Scrolling up
                header.classList.remove('scroll-down');
                header.classList.add('scroll-up');
            }
            
            lastScroll = currentScroll;
        }, 50);
    });

    // Enhanced navigation active state
    function setActiveNavItem() {
        const sections = document.querySelectorAll('section');
        const navItems = document.querySelectorAll('.nav-menu li a');
        
        if (sections.length === 0 || navItems.length === 0) return;
        
        let currentSection = '';
        const headerHeight = document.querySelector('header').offsetHeight;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - headerHeight - 50;
            const sectionHeight = section.clientHeight;
            
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });
        
        navItems.forEach(item => {
            item.classList.remove('active');
            const href = item.getAttribute('href');
            if (href && href.includes('#' + currentSection) && currentSection !== '') {
                item.classList.add('active');
            } else if (href === 'index.html' && window.scrollY < 100) {
                // Home is active when at the top
                item.classList.add('active');
            }
        });
    }
    
    window.addEventListener('scroll', setActiveNavItem);
    
    // Call it once on load
    setActiveNavItem();
    
    // Enhanced image loading with fade-in effect
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.5s ease';
        
        img.addEventListener('load', function() {
            setTimeout(() => {
                this.style.opacity = '1';
                this.classList.add('loaded');
            }, 100);
        });
        
        if (img.complete) {
            setTimeout(() => {
                img.style.opacity = '1';
                img.classList.add('loaded');
            }, 100);
        }
    });
    
    // Enhanced counter animation for stats
    function animateCounter(el) {
        const target = parseInt(el.textContent);
        const suffix = el.textContent.includes('+') ? '+' : '';
        const duration = 2000;
        const frameDuration = 1000/60;
        const totalFrames = Math.round(duration / frameDuration);
        let frame = 0;
        
        const counter = setInterval(() => {
            frame++;
            
            // Calculate easing with cubic-bezier-like effect
            const progress = frame / totalFrames;
            const easing = progress < 0.5 
                ? 4 * progress * progress * progress 
                : 1 - Math.pow(-2 * progress + 2, 3) / 2;
            
            const currentCount = Math.round(easing * target);
            
            if (frame === totalFrames) {
                el.textContent = target + suffix;
                clearInterval(counter);
            } else {
                el.textContent = currentCount + suffix;
            }
        }, frameDuration);
    }
    
    // Use Intersection Observer for animations
    if ('IntersectionObserver' in window) {
        // Stats counter animation
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    statsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        
        document.querySelectorAll('.stat-item h3').forEach(stat => {
            statsObserver.observe(stat);
        });
        
        // Card animation on scroll
        const cardObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                    cardObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
        
        document.querySelectorAll('.feature-card, .event-card, .testimonial').forEach(card => {
            cardObserver.observe(card);
        });
    }
    
    // Add touch effects for mobile
    if (isMobile) {
        // Add ripple effect to buttons
        const buttons = document.querySelectorAll('.cta-button, .event-link, .nav-menu li a, .social-icons a');
        
        buttons.forEach(button => {
            button.addEventListener('touchstart', function(e) {
                const rect = this.getBoundingClientRect();
                const x = e.touches[0].clientX - rect.left;
                const y = e.touches[0].clientY - rect.top;
                
                const ripple = document.createElement('span');
                ripple.classList.add('ripple-effect');
                ripple.style.left = x + 'px';
                ripple.style.top = y + 'px';
                
                this.appendChild(ripple);
                
                setTimeout(() => {
                    ripple.remove();
                }, 500);
            });
        });
        
        // Add tilt effect to cards
        const cards = document.querySelectorAll('.feature-card, .event-card');
        
        cards.forEach(card => {
            card.addEventListener('touchmove', function(e) {
                if (e.touches.length === 1) {
                    const rect = this.getBoundingClientRect();
                    const x = e.touches[0].clientX - rect.left;
                    const y = e.touches[0].clientY - rect.top;
                    
                    const centerX = rect.width / 2;
                    const centerY = rect.height / 2;
                    
                    const tiltX = (x - centerX) / centerX * 5;
                    const tiltY = (y - centerY) / centerY * 5;
                    
                    this.style.transform = `perspective(1000px) rotateX(${-tiltY}deg) rotateY(${tiltX}deg) scale3d(1.05, 1.05, 1.05)`;
                }
            });
            
            card.addEventListener('touchend', function() {
                this.style.transform = '';
            });
        });
    }
    
    // Handle window resize
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            if (window.innerWidth > 768) {
                navMenu.classList.remove('active');
                mobileMenu.classList.remove('active');
                menuOverlay.classList.remove('active');
                body.style.overflow = '';
            }
        }, 250);
    });
    
    // Add CSS class for first-time visitors to show intro animations
    if (!sessionStorage.getItem('visited')) {
        document.body.classList.add('first-visit');
        sessionStorage.setItem('visited', 'true');
    }
}); 