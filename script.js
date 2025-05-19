// Dynamic Copyright Year
const currentYearSpan = document.getElementById('current-year');
if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
}

// Mobile Navigation Toggle
const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
const navLinksList = document.getElementById('nav-links-list');

if (mobileNavToggle && navLinksList) {
    mobileNavToggle.addEventListener('click', () => {
        const isExpanded = mobileNavToggle.getAttribute('aria-expanded') === 'true';
        mobileNavToggle.setAttribute('aria-expanded', !isExpanded);
        navLinksList.classList.toggle('active'); // Toggles visibility and allows scrolling via CSS

        const icon = mobileNavToggle.querySelector('i');
        if (navLinksList.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });

    // Close mobile menu when a link is clicked
    navLinksList.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
           if (navLinksList.classList.contains('active')) {
               mobileNavToggle.click(); // Simulate click to close menu
           }
        });
    });

    // Close mobile menu if user clicks outside of it
    document.addEventListener('click', (event) => {
        const isClickInsideNav = navLinksList.contains(event.target);
        const isClickOnToggle = mobileNavToggle.contains(event.target);

        if (!isClickInsideNav && !isClickOnToggle && navLinksList.classList.contains('active')) {
             mobileNavToggle.click();
        }
    });
}

// Scroll Reveal Animation using Intersection Observer
const revealElements = document.querySelectorAll('.service-card, .whyus-item, .testimonial-card, .blog-card, .about-text-overlay, .about-image-bg, .contact-option, .case-study-card, .assessment-card'); // Updated targets

if (revealElements.length > 0 && 'IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    },
    {
        threshold: 0.15,
        rootMargin: '0px 0px -60px 0px'
    });

    revealElements.forEach(el => {
        el.classList.add('reveal-hidden');
        revealObserver.observe(el);
    });

    // Dynamically insert CSS rules only if they don't exist (fallback for safety)
     if (document.styleSheets.length > 0 && document.styleSheets[0] instanceof CSSStyleSheet) {
        const styleSheet = document.styleSheets[0];
        let revealHiddenRuleExists = false;
        let revealedRuleExists = false;
        try {
             for (let i = 0; i < styleSheet.cssRules.length; i++) {
                if (styleSheet.cssRules[i] instanceof CSSStyleRule) {
                    if (styleSheet.cssRules[i].selectorText === '.reveal-hidden') revealHiddenRuleExists = true;
                    if (styleSheet.cssRules[i].selectorText === '.revealed') revealedRuleExists = true;
                }
             }
        } catch (e) { /* Ignore security errors */ }

        try {
            if (!revealHiddenRuleExists) {
                 styleSheet.insertRule(`.reveal-hidden { opacity: 0; transform: translateY(40px); transition: opacity 0.9s cubic-bezier(0.5, 0, 0, 1), transform 0.9s cubic-bezier(0.5, 0, 0, 1); will-change: opacity, transform; }`, styleSheet.cssRules.length);
            }
            if (!revealedRuleExists) {
                 styleSheet.insertRule(`.revealed { opacity: 1; transform: translateY(0); }`, styleSheet.cssRules.length);
            }
        } catch (e) { console.warn("Could not insert scroll reveal CSS rules dynamically:", e); }
    } else { console.warn("No stylesheets found to insert scroll reveal rules."); }
} else {
     console.warn("IntersectionObserver not supported or no reveal elements found. Skipping animations.");
     revealElements.forEach(el => {
         el.style.opacity = '1';
         el.style.transform = 'translateY(0)';
     });
}

// Add smooth scrolling to anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId && targetId.length > 1 && targetId.startsWith('#')) {
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const navbarHeight = document.querySelector('.navbar')?.offsetHeight || 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - navbarHeight - 20;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        }
    });
});

// Active Nav Link Highlighting on Scroll
const sectionsForHighlight = document.querySelectorAll('section[id]');
const navLinksForHighlight = document.querySelectorAll('.nav-links a'); // Target all nav links

function highlightNavLink() {
    let currentSectionId = '';
    const navbarHeight = document.querySelector('.navbar')?.offsetHeight || 80;
    const scrollPosition = window.pageYOffset + navbarHeight + 50; // Adjust trigger point

    sectionsForHighlight.forEach(section => {
        if (scrollPosition >= section.offsetTop) {
            currentSectionId = section.getAttribute('id');
        }
    });

     if (window.pageYOffset < (sectionsForHighlight.length > 0 ? sectionsForHighlight[0].offsetTop - navbarHeight - 50 : 200) ) {
        currentSectionId = sectionsForHighlight.length > 0 ? sectionsForHighlight[0].getAttribute('id') : 'hero';
     }

    navLinksForHighlight.forEach(a => {
        a.classList.remove('active');
        const linkHref = a.getAttribute('href');
        // Check if the link's hash matches the current section ID
        // Also handle full page links (blog.html, privacy.html, book.html) by checking window.location.pathname
        if ((a.hash === `#${currentSectionId}`) || (currentSectionId === 'hero' && linkHref === 'index.html#hero')) {
             a.classList.add('active');
        } else if (window.location.pathname.endsWith(linkHref) && !linkHref.includes('#')) {
             a.classList.add('active');
        }
    });

    // Ensure 'الرئيسية' is active if no other section matches and we are on index.html
    if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/') {
        let isAnySectionActive = false;
        navLinksForHighlight.forEach(a => {
            if (a.classList.contains('active') && a.getAttribute('href') !== 'index.html#hero') {
                isAnySectionActive = true;
            }
        });
        if (!isAnySectionActive) {
             const homeLink = document.querySelector('.nav-links a[href="index.html#hero"]');
             if (homeLink) homeLink.classList.add('active');
        }
    }
}

let scrollTimeout;
window.addEventListener('scroll', () => {
    if (scrollTimeout) {
        clearTimeout(scrollTimeout);
    }
    scrollTimeout = setTimeout(highlightNavLink, 50);
});

document.addEventListener('DOMContentLoaded', highlightNavLink);

// Conceptual: Hijri Date Display (Requires moment-hijri.js library and moment.js)
/*
if (typeof moment !== 'undefined' && typeof moment.locale === 'function' && moment.fn.hijri) {
    moment.locale('ar-SA'); // Set locale for Arabic month names
    document.querySelectorAll('.gregorian-date').forEach(el => {
        const gregorianDateText = el.textContent.trim();
        const parentSpan = el.nextElementSibling; // Assuming <span class="hijri-date"></span> is directly after

        // Attempt to parse with a common format if specific format isn't guaranteed
        let dateMoment = moment(gregorianDateText, ["DD MMMM YYYY", "D MMMM YYYY"], "ar", true); // Strict parsing

        if (parentSpan && parentSpan.classList.contains('hijri-date') && dateMoment.isValid()) {
            try {
                parentSpan.textContent = dateMoment.format("iD iMMMM iYYYY");
            } catch (e) {
                console.error("Error formatting Hijri date for:", gregorianDateText, e);
                parentSpan.textContent = ""; // Clear if error
            }
        } else if (parentSpan && parentSpan.classList.contains('hijri-date')) {
            console.warn("Could not parse Gregorian date or find Hijri element for:", gregorianDateText);
            parentSpan.textContent = ""; // Clear if not parseable
        }
    });
} else {
    console.warn("Moment.js or moment-hijri.js is not loaded, or Arabic locale for moment is not set. Hijri dates will not be displayed.");
    document.querySelectorAll('.hijri-date').forEach(el => { el.style.display = 'none'; });
}
*/