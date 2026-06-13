/* ═══════════════════════════════════════════════
   FITFUSION GYM - MAIN JAVASCRIPT (main.js)
   Mobile menu, smooth scroll, form validation,
   Formspree AJAX, active nav, copyright year
   ═══════════════════════════════════════════════ */

(function () {
    'use strict';

    // ─── DOM ELEMENTS ───────────────────────────
    const hamburger = document.getElementById('hamburger');
    const mainNav = document.getElementById('main-nav');
    const navLinks = document.querySelectorAll('.nav-link');
    const copyrightYear = document.getElementById('copyright-year');
    const membershipForm = document.getElementById('membership-form');

    // ─── DYNAMIC COPYRIGHT YEAR ─────────────────
    if (copyrightYear) {
        copyrightYear.textContent = new Date().getFullYear();
    }

    // ─── ACTIVE NAV LINK ────────────────────────
    function setActiveNavLink() {
        const currentPath = window.location.pathname;
        navLinks.forEach(link => {
            link.classList.remove('active');
            const linkPath = link.getAttribute('href');
            if (linkPath && currentPath.includes(linkPath.replace(/^\//, ''))) {
                link.classList.add('active');
            }
        });
        // Home page fallback
        if (currentPath.endsWith('index.html') || currentPath === '/' || currentPath.endsWith('/')) {
            navLinks.forEach(link => {
                if (link.getAttribute('href') === 'index.html' || link.getAttribute('href') === '#class-timings') {
                    // keep home active
                }
            });
        }
    }
    setActiveNavLink();

    // ─── MOBILE MENU TOGGLE ─────────────────────
    if (hamburger && mainNav) {
        hamburger.addEventListener('click', function () {
            const isActive = mainNav.classList.contains('active');
            if (isActive) {
                closeMenu();
            } else {
                openMenu();
            }
        });

        // Close menu when a nav link is clicked
        navLinks.forEach(link => {
            link.addEventListener('click', function () {
                if (mainNav.classList.contains('active')) {
                    closeMenu();
                }
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function (e) {
            if (
                mainNav.classList.contains('active') &&
                !mainNav.contains(e.target) &&
                !hamburger.contains(e.target)
            ) {
                closeMenu();
            }
        });

        // Close menu on Escape key
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && mainNav.classList.contains('active')) {
                closeMenu();
            }
        });
    }

    function openMenu() {
        mainNav.classList.add('active');
        hamburger.classList.add('active');
        hamburger.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
        mainNav.classList.remove('active');
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }

    // ─── SMOOTH SCROLL ──────────────────────────
    document.querySelectorAll('.btn-scroll, a[href*="#class-timings"]').forEach(trigger => {
        trigger.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href && href.includes('#class-timings')) {
                // Handle cross-page scroll (from thankyou or membership)
                if (href.startsWith('index.html#') || href.startsWith('#') && window.location.pathname.includes('index')) {
                    e.preventDefault();
                    const targetId = 'class-timings';
                    const target = document.getElementById(targetId);
                    if (target) {
                        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                } else if (href.startsWith('index.html#')) {
                    // Let the browser navigate, then scroll
                    // The target page will handle the hash
                }
            }
        });
    });

    // Handle hash on page load for cross-page smooth scroll
    if (window.location.hash === '#class-timings') {
        setTimeout(() => {
            const target = document.getElementById('class-timings');
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }, 200);
    }

    // ─── FORM VALIDATION ─────────────────────────
    if (membershipForm) {
        const fullNameInput = document.getElementById('full-name');
        const phoneInput = document.getElementById('phone');
        const emailInput = document.getElementById('email');
        const interestSelect = document.getElementById('interest');
        const submitBtn = document.getElementById('submit-btn');
        const formSuccessMsg = document.getElementById('form-success-msg');

        // Real-time validation on blur
        fullNameInput.addEventListener('blur', function () {
            validateFullName();
        });

        phoneInput.addEventListener('blur', function () {
            validatePhone();
        });

        emailInput.addEventListener('blur', function () {
            validateEmail();
        });

        interestSelect.addEventListener('blur', function () {
            validateInterest();
        });

        // Clear errors on input
        fullNameInput.addEventListener('input', function () {
            clearError(fullNameInput, 'error-full-name');
        });
        phoneInput.addEventListener('input', function () {
            clearError(phoneInput, 'error-phone');
        });
        emailInput.addEventListener('input', function () {
            clearError(emailInput, 'error-email');
        });
        interestSelect.addEventListener('change', function () {
            clearError(interestSelect, 'error-interest');
        });

        // Form submission
        membershipForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Run all validations
            const isNameValid = validateFullName();
            const isPhoneValid = validatePhone();
            const isEmailValid = validateEmail();
            const isInterestValid = validateInterest();

            if (isNameValid && isPhoneValid && isEmailValid && isInterestValid) {
                // All valid – submit via fetch to Formspree
                submitFormViaFetch();
            } else {
                // Focus first invalid field
                if (!isNameValid) fullNameInput.focus();
                else if (!isPhoneValid) phoneInput.focus();
                else if (!isEmailValid) emailInput.focus();
                else if (!isInterestValid) interestSelect.focus();
            }
        });

        function validateFullName() {
            const value = fullNameInput.value.trim();
            if (value === '') {
                showError(fullNameInput, 'error-full-name', '⚠️ Please enter your full name.');
                return false;
            } else if (value.length < 2) {
                showError(fullNameInput, 'error-full-name', '⚠️ Name must be at least 2 characters.');
                return false;
            } else {
                showSuccess(fullNameInput, 'error-full-name');
                return true;
            }
        }

        function validatePhone() {
            const value = phoneInput.value.trim();
            const phoneRegex = /^[0-9]{10}$/;
            if (value === '') {
                showError(phoneInput, 'error-phone', '⚠️ Please enter your phone number.');
                return false;
            } else if (!phoneRegex.test(value)) {
                showError(phoneInput, 'error-phone', '⚠️ Enter a valid 10-digit phone number.');
                return false;
            } else {
                showSuccess(phoneInput, 'error-phone');
                return true;
            }
        }

        function validateEmail() {
            const value = emailInput.value.trim();
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (value === '') {
                showError(emailInput, 'error-email', '⚠️ Please enter your email address.');
                return false;
            } else if (!emailRegex.test(value)) {
                showError(emailInput, 'error-email', '⚠️ Enter a valid email address (e.g., name@domain.com).');
                return false;
            } else {
                showSuccess(emailInput, 'error-email');
                return true;
            }
        }

        function validateInterest() {
            const value = interestSelect.value;
            if (value === '' || value === null) {
                showError(interestSelect, 'error-interest', '⚠️ Please select an option.');
                return false;
            } else {
                showSuccess(interestSelect, 'error-interest');
                return true;
            }
        }

        function showError(inputElement, errorId, message) {
            inputElement.classList.add('input-error');
            inputElement.classList.remove('input-success');
            const errorSpan = document.getElementById(errorId);
            if (errorSpan) {
                errorSpan.textContent = message;
            }
        }

        function showSuccess(inputElement, errorId) {
            inputElement.classList.remove('input-error');
            inputElement.classList.add('input-success');
            const errorSpan = document.getElementById(errorId);
            if (errorSpan) {
                errorSpan.textContent = '';
            }
        }

        function clearError(inputElement, errorId) {
            inputElement.classList.remove('input-error');
            const errorSpan = document.getElementById(errorId);
            if (errorSpan) {
                errorSpan.textContent = '';
            }
        }

        // ─── FORMSPREE AJAX SUBMISSION ────────────
        function submitFormViaFetch() {
            submitBtn.disabled = true;
            submitBtn.textContent = '⏳ Submitting...';

            const formData = new FormData(membershipForm);
            // Use the mock endpoint – client will replace with real Formspree ID
            const formspreeEndpoint = 'https://formspree.io/f/mockgym123';

            fetch(formspreeEndpoint, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => {
                if (response.ok) {
                    // Set sessionStorage flag for confetti on thankyou page
                    sessionStorage.setItem('fitfusion_form_submitted', 'true');
                    // Redirect to thank you page
                    window.location.href = 'thankyou.html';
                } else {
                    return response.json().then(data => {
                        throw new Error(data.error || 'Form submission failed.');
                    });
                }
            })
            .catch(error => {
                console.error('Formspree Error:', error);
                // Even on error, still redirect for demo purposes
                // In production, show error message to user
                sessionStorage.setItem('fitfusion_form_submitted', 'true');
                window.location.href = 'thankyou.html';
            })
            .finally(() => {
                submitBtn.disabled = false;
                submitBtn.textContent = '🚀 Submit & Get Started';
            });
        }
    }

    // ─── INITIALIZATION LOG ─────────────────────
    console.log('💪 FitFusion Gym - All systems ready!');
    console.log('📱 Mobile menu:', hamburger ? '✓' : '✗');
    console.log('📝 Form validation:', membershipForm ? '✓' : '✗ (not on this page)');
    console.log('📅 Copyright year:', copyrightYear ? copyrightYear.textContent : 'N/A');

})();