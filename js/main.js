
/* ========================================
   Be Affiliate King - Main JavaScript
   ======================================== */

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', function() {
    
    // ===== Mobile Menu Toggle =====
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileMenuToggle && navMenu) {
        mobileMenuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            this.classList.toggle('active');
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.nav-wrapper')) {
                navMenu.classList.remove('active');
                mobileMenuToggle.classList.remove('active');
            }
        });
        
        // Close menu on window resize
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768) {
                navMenu.classList.remove('active');
                mobileMenuToggle.classList.remove('active');
            }
        });
    }
    
    // ===== Smooth Scroll for Anchor Links =====
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            if (targetId !== '#') {
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    e.preventDefault();
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
    
    // ===== Scroll-based Header Shadow =====
    const header = document.querySelector('.site-header');
    
    if (header) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                header.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
            } else {
                header.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
            }
        });
    }
    
    // ===== Active Navigation Highlighting =====
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
    
    // ===== Lazy Loading Images =====
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver(function(entries, observer) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback for older browsers
        lazyImages.forEach(img => {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
        });
    }
    
    // ===== Animate Elements on Scroll =====
    const animatedElements = document.querySelectorAll('.casino-card, .feature-card, .blog-card');
    
    if ('IntersectionObserver' in window) {
        const animationObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '0';
                    entry.target.style.transform = 'translateY(20px)';
                    
                    setTimeout(() => {
                        entry.target.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, 100);
                    
                    animationObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1
        });
        
        animatedElements.forEach(el => animationObserver.observe(el));
    }
    
    // ===== Copy to Clipboard (for bonus codes) =====
    const copyButtons = document.querySelectorAll('[data-copy]');
    
    copyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const textToCopy = this.getAttribute('data-copy');
            
            // Create temporary textarea
            const textarea = document.createElement('textarea');
            textarea.value = textToCopy;
            textarea.style.position = 'fixed';
            textarea.style.opacity = '0';
            document.body.appendChild(textarea);
            
            textarea.select();
            
            try {
                document.execCommand('copy');
                
                // Show success feedback
                const originalText = this.textContent;
                this.textContent = '✓ Copied!';
                this.style.background = '#10B981';
                
                setTimeout(() => {
                    this.textContent = originalText;
                    this.style.background = '';
                }, 2000);
            } catch (err) {
                console.error('Failed to copy:', err);
            }
            
            document.body.removeChild(textarea);
        });
    });
    
    // ===== External Link Warning =====
    const externalLinks = document.querySelectorAll('a[href^="http"]:not([href*="beaffiliateking.com"])');
    
    externalLinks.forEach(link => {
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer nofollow');
        
        // Add affiliate link tracking
        link.addEventListener('click', function(e) {
            const casinoName = this.closest('.casino-card')?.querySelector('.casino-name')?.textContent || 'Unknown';
            console.log(`Affiliate link clicked: ${casinoName}`);
            
            // You can add analytics tracking here
            // Example: gtag('event', 'click', { 'casino': casinoName });
        });
    });
    
    // ===== Back to Top Button =====
    const backToTopButton = document.createElement('button');
    backToTopButton.innerHTML = '↑';
    backToTopButton.className = 'back-to-top';
    backToTopButton.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: linear-gradient(135deg, #6ECBDE 0%, #146B8C 100%);
        color: white;
        border: none;
        font-size: 24px;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 999;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    `;
    document.body.appendChild(backToTopButton);
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            backToTopButton.style.opacity = '1';
            backToTopButton.style.visibility = 'visible';
        } else {
            backToTopButton.style.opacity = '0';
            backToTopButton.style.visibility = 'hidden';
        }
    });
    
    backToTopButton.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // ===== Console Welcome Message =====
    console.log('%c🎰 Welcome to Be Affiliate King! 👑', 'font-size: 20px; font-weight: bold; color: #6ECBDE;');
    console.log('%cFind the best online casino bonuses updated daily!', 'font-size: 14px; color: #146B8C;');
});

// ===== Utility Functions =====

// Format currency
function formatCurrency(amount, currency = 'USD') {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
}

// Format date
function formatDate(date) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(date).toLocaleDateString('en-US', options);
}

// Debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Check if element is in viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}
