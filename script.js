// Interactive Navigation and Smooth Scrolling
document.addEventListener('DOMContentLoaded', function() {
    // Get all navigation links and sections
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.content-section, .subsection');
    
    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                // Calculate offset for sticky header
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight - 20;
                
                // Smooth scroll to target
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Update active link
                updateActiveLink(this);
            }
        });
    });
    
    // Update active link function
    function updateActiveLink(activeLink) {
        navLinks.forEach(link => link.classList.remove('active'));
        activeLink.classList.add('active');
    }
    
    // Intersection Observer for automatic active link highlighting
    const observerOptions = {
        root: null,
        rootMargin: '-100px 0px -50% 0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                const correspondingLink = document.querySelector(`a[href="#${id}"]`);
                
                if (correspondingLink) {
                    updateActiveLink(correspondingLink);
                }
            }
        });
    }, observerOptions);
    
    // Observe all sections and subsections
    sections.forEach(section => {
        if (section.id) {
            observer.observe(section);
        }
    });
    
    // Add scroll-based animations
    const animateOnScroll = () => {
        const cards = document.querySelectorAll('.limitation-card, .subsection');
        
        cards.forEach(card => {
            const cardTop = card.getBoundingClientRect().top;
            const cardBottom = card.getBoundingClientRect().bottom;
            const windowHeight = window.innerHeight;
            
            // Add visible class when card is in viewport
            if (cardTop < windowHeight * 0.8 && cardBottom > 0) {
                card.classList.add('visible');
            }
        });
    };
    
    // Throttled scroll event listener
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        scrollTimeout = setTimeout(animateOnScroll, 10);
    });
    
    // Initial animation check
    animateOnScroll();
    
    // Add hover effects for enhanced interactivity
    const subsections = document.querySelectorAll('.subsection');
    subsections.forEach(subsection => {
        subsection.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px) scale(1.02)';
        });
        
        subsection.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(-2px) scale(1)';
        });
    });
    
    // Add click-to-expand functionality for mobile
    if (window.innerWidth <= 768) {
        const navSection = document.querySelector('.nav-section');
        const navTitle = navSection.querySelector('h3');
        const navLinks = navSection.querySelector('.nav-links');
        
        // Create toggle functionality for mobile navigation
        navTitle.style.cursor = 'pointer';
        navTitle.addEventListener('click', function() {
            navLinks.style.display = navLinks.style.display === 'none' ? 'flex' : 'none';
            this.innerHTML = navLinks.style.display === 'none' ? 
                'Navigation <i class="fas fa-chevron-down"></i>' : 
                'Navigation <i class="fas fa-chevron-up"></i>';
        });
        
        // Initially hide navigation on mobile
        if (window.innerWidth <= 480) {
            navLinks.style.display = 'none';
            navTitle.innerHTML = 'Navigation <i class="fas fa-chevron-down"></i>';
        }
    }
    
    // Add keyboard navigation support
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
            const activeLink = document.querySelector('.nav-link.active');
            const allLinks = Array.from(navLinks);
            const currentIndex = allLinks.indexOf(activeLink);
            
            let nextIndex;
            if (e.key === 'ArrowUp') {
                nextIndex = currentIndex > 0 ? currentIndex - 1 : allLinks.length - 1;
            } else {
                nextIndex = currentIndex < allLinks.length - 1 ? currentIndex + 1 : 0;
            }
            
            if (nextIndex >= 0 && nextIndex < allLinks.length) {
                allLinks[nextIndex].click();
                allLinks[nextIndex].focus();
            }
            
            e.preventDefault();
        }
    });
    
    // Add focus styles for accessibility
    navLinks.forEach(link => {
        link.addEventListener('focus', function() {
            this.style.outline = '2px solid var(--aqua-blue)';
            this.style.outlineOffset = '2px';
        });
        
        link.addEventListener('blur', function() {
            this.style.outline = 'none';
        });
    });
    
    // Performance optimization: Lazy load animations
    const lazyAnimations = document.querySelectorAll('.limitation-card');
    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
                animationObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    lazyAnimations.forEach(card => {
        card.style.animationPlayState = 'paused';
        animationObserver.observe(card);
    });
    
    // Add loading state management
    window.addEventListener('load', function() {
        document.body.classList.add('loaded');
        
        // Trigger initial animations
        setTimeout(() => {
            const firstSection = document.querySelector('.content-section');
            if (firstSection) {
                firstSection.style.opacity = '1';
                firstSection.style.transform = 'translateY(0)';
            }
        }, 100);
    });
    
    // Add resize handler for responsive adjustments
    window.addEventListener('resize', function() {
        // Recalculate positions on resize
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        scrollTimeout = setTimeout(() => {
            animateOnScroll();
        }, 100);
    });
    
    console.log('MCQ Alternatives website loaded successfully!');
});

