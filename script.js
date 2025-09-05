/*
===========================================
    THE MADOVEN BAKERY - JAVASCRIPT
===========================================

This file contains all the interactive functionality for the website.
All code is vanilla JavaScript - no frameworks or external libraries.
*/

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    
    // Initialize all functionality
    initMobileMenu();
    initSmoothScrolling();
    initBackToTop();
    initEmailCopy();
    
});

/*
===========================================
    MOBILE MENU FUNCTIONALITY
===========================================
*/
function initMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Toggle mobile menu when hamburger button is clicked
    mobileMenuBtn.addEventListener('click', function() {
        mobileMenuBtn.classList.toggle('active');
        navMenu.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        if (navMenu.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    });
    
    // Close mobile menu when a nav link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            mobileMenuBtn.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!mobileMenuBtn.contains(e.target) && !navMenu.contains(e.target)) {
            mobileMenuBtn.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

/*
===========================================
    SMOOTH SCROLLING FUNCTIONALITY
===========================================
*/
function initSmoothScrolling() {
    // Handle all navigation links
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                // Calculate offset for fixed header
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight - 20;
                
                // Smooth scroll to target
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Helper function for scrolling to specific sections (used by hero button)
function scrollToSection(sectionId) {
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        const headerHeight = document.querySelector('.header').offsetHeight;
        const targetPosition = targetSection.offsetTop - headerHeight - 20;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
}

/*
===========================================
    BACK TO TOP BUTTON FUNCTIONALITY
===========================================
*/
function initBackToTop() {
    const backToTopBtn = document.getElementById('back-to-top');
    
    // Show/hide back to top button based on scroll position
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });
    
    // Scroll to top when button is clicked
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/*
===========================================
    EMAIL COPY FUNCTIONALITY
===========================================
*/
function initEmailCopy() {
    // This function is called by the copy button in the HTML
    // We're making it globally available
    window.copyEmail = function() {
        const emailText = document.getElementById('email-text').textContent;
        const copyBtn = document.querySelector('.copy-btn');
        
        // Try to copy to clipboard
        if (navigator.clipboard && window.isSecureContext) {
            // Modern clipboard API
            navigator.clipboard.writeText(emailText).then(function() {
                showCopySuccess(copyBtn);
            }).catch(function(err) {
                console.error('Failed to copy email: ', err);
                fallbackCopyEmail(emailText, copyBtn);
            });
        } else {
            // Fallback for older browsers
            fallbackCopyEmail(emailText, copyBtn);
        }
    };
}

// Fallback copy method for older browsers
function fallbackCopyEmail(emailText, copyBtn) {
    const textArea = document.createElement('textarea');
    textArea.value = emailText;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        document.execCommand('copy');
        showCopySuccess(copyBtn);
    } catch (err) {
        console.error('Fallback copy failed: ', err);
        showCopyError(copyBtn);
    }
    
    document.body.removeChild(textArea);
}

// Show success message when email is copied
function showCopySuccess(button) {
    const originalText = button.textContent;
    button.textContent = 'Copied!';
    button.style.background = '#90EE90'; // Light green
    
    setTimeout(function() {
        button.textContent = originalText;
        button.style.background = ''; // Reset to CSS default
    }, 2000);
}

// Show error message if copy fails
function showCopyError(button) {
    const originalText = button.textContent;
    button.textContent = 'Copy Failed';
    button.style.background = '#FFB6C1'; // Light red
    
    setTimeout(function() {
        button.textContent = originalText;
        button.style.background = ''; // Reset to CSS default
    }, 2000);
}

/*
===========================================
    PERFORMANCE OPTIMIZATIONS
===========================================
*/

// Throttle scroll events for better performance
function throttle(func, wait) {
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

// Apply throttling to scroll events
window.addEventListener('scroll', throttle(function() {
    // Back to top button visibility is handled here
    const backToTopBtn = document.getElementById('back-to-top');
    if (window.pageYOffset > 300) {
        backToTopBtn.classList.add('visible');
    } else {
        backToTopBtn.classList.remove('visible');
    }
}, 100));

/*
===========================================
    ACCESSIBILITY ENHANCEMENTS
===========================================
*/

// Handle keyboard navigation
document.addEventListener('keydown', function(e) {
    // Close mobile menu with Escape key
    if (e.key === 'Escape') {
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        const navMenu = document.querySelector('.nav-menu');
        
        if (navMenu.classList.contains('active')) {
            mobileMenuBtn.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
});

// Add focus indicators for keyboard navigation
document.addEventListener('DOMContentLoaded', function() {
    const focusableElements = document.querySelectorAll(
        'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
    );
    
    focusableElements.forEach(element => {
        element.addEventListener('focus', function() {
            this.style.outline = '2px solid var(--accent)';
            this.style.outlineOffset = '2px';
        });
        
        element.addEventListener('blur', function() {
            this.style.outline = '';
            this.style.outlineOffset = '';
        });
    });
});

/*
===========================================
    LAZY LOADING ENHANCEMENT
===========================================
*/

// Add intersection observer for better lazy loading support
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });
    
    // Observe all lazy-loaded images
    document.addEventListener('DOMContentLoaded', function() {
        const lazyImages = document.querySelectorAll('img[loading="lazy"]');
        lazyImages.forEach(img => {
            imageObserver.observe(img);
        });
    });
}