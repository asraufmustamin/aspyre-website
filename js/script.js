/* ============================================
   ASYNC SOLUTIONS - Premium Agency Scripts
   ============================================ */
// Import Firebase SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy, serverTimestamp, deleteDoc, doc, updateDoc, where, getDocs, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyCkOQxZsIEsyaoDN8Dg36G2CUmMW9-oK8k",
    authDomain: "aspyre-website.firebaseapp.com",
    projectId: "aspyre-website",
    storageBucket: "aspyre-website.firebasestorage.app",
    messagingSenderId: "1090120150628",
    appId: "1:1090120150628:web:1dc727d99433d7eda53971"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Expose Firebase for other scripts (testimonials.js)
window.testimonialsFirebase = {
    db,
    collection,
    addDoc,
    getDocs,
    getDoc,
    setDoc,
    updateDoc,
    deleteDoc,
    doc,
    query,
    orderBy,
    serverTimestamp
};

// Global Variables
let cmsModified = {};

// Initialization Logic
const initApp = () => {
    // Safety Wrapper
    const safeInit = (fn, name) => {
        try {
            console.log(`Initializing ${name}...`);
            fn();
            console.log(`${name} Initialized.`);
        } catch (e) {
            console.error(`Error initializing ${name}:`, e);
        }
    };

    // Clear old CMS data if version mismatch
    try {
        const CMS_VERSION = 'v3.0';
        if (localStorage.getItem('cmsVersion') !== CMS_VERSION) {
            localStorage.removeItem('asyncCmsContent');
            localStorage.setItem('cmsVersion', CMS_VERSION);
        }

        // FORCE RESET PORTFOLIO DATA (Once per session)
        if (!sessionStorage.getItem('portfolio_init_v7')) {
            console.log("Portfolio: Session boot v7 - clearing potentially stale cache");
            localStorage.removeItem('async_albums');
            sessionStorage.setItem('portfolio_init_v7', 'true');
        }
    } catch (e) { console.warn("LocaleStorage access restricted"); }

    // 1. Install Global Listeners FIRST (Critical for interactivity)
    document.body.addEventListener('click', (e) => {
        // Lang Toggle Fallback
        const langToggle = e.target.closest('.lang-toggle');
        if (langToggle) {
            console.log("Global Lang Toggle Actions");
            const activeSpan = langToggle.querySelector('.active');
            if (activeSpan) {
                const currentLang = activeSpan.textContent.trim();
                const newLang = currentLang === 'ID' ? 'en' : 'id';
                // Call standard switch function if available
                if (typeof switchLanguage === 'function') {
                    switchLanguage(newLang);
                } else {
                    // Fallback manual switch
                    localStorage.setItem('asyncLang', newLang);
                    location.reload();
                }
            }
        }

        // Admin Trigger Fallback (Handle both classes)
        const adminBtn = e.target.closest('.admin-trigger, .admin-panel-btn');
        if (adminBtn) {
            console.log("Global Admin Trigger Clicked");
            e.preventDefault(); // Prevent hash navigation
            const modal = document.getElementById('adminModal');
            if (modal) {
                modal.classList.add('active');
                document.body.style.overflow = 'hidden'; // Prevent background scrolling

                // FIX: Check session before showing dashboard
                const isLoggedIn = sessionStorage.getItem('async_admin') === 'true';
                if (isLoggedIn && window.asyncShowDashboard) {
                    window.asyncShowDashboard();
                } else {
                    // Start fresh with login form
                    const loginView = document.getElementById('adminLogin');
                    const dashboardView = document.getElementById('adminDashboard');
                    const modalContent = document.querySelector('.admin-modal-content');

                    if (dashboardView) dashboardView.classList.remove('active');
                    if (loginView) loginView.classList.add('active');
                    if (modalContent) modalContent.classList.remove('dashboard-mode');
                }
            } else {
                console.error("Admin Modal not found!");
            }
        }
    });

    safeInit(initMobileMenu, 'Mobile Menu');
    safeInit(initSmoothScroll, 'Smooth Scroll');
    safeInit(initScrollAnimations, 'Scroll Animations');
    safeInit(initOrderForm, 'Order Form');
    safeInit(initLanguageToggle, 'Language Toggle');
    safeInit(initDynamicCategories, 'Dynamic Categories');
    safeInit(initAdminModal, 'Admin Modal');
    safeInit(initMagneticButtons, 'Magnetic Buttons');
    safeInit(initPortfolioAlbums, 'Portfolio Albums');
    safeInit(initTrackingSystem, 'Tracking System');
    safeInit(loadCmsContent, 'CMS Content');
    safeInit(initCmsMode, 'CMS Mode');
    safeInit(initVisibilityToggles, 'Visibility Toggles');
    safeInit(initPaketTabs, 'Paket Tabs');
    safeInit(initInteractivePortfolio, 'Interactive Portfolio');

    // Listeners installed at top.
};

/* ============================================
   Visibility Toggles Setup (v8.3)
   ============================================ */
function initVisibilityToggles() {
    document.querySelectorAll('.section-visibility-toggle').forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            const sectionId = checkbox.dataset.section;
            const isVisible = checkbox.checked;
            
            // Instantly apply display style locally
            const sec = document.getElementById(sectionId);
            if (sec) {
                if (isVisible) {
                    sec.style.removeProperty('display');
                } else {
                    sec.style.setProperty('display', 'none', 'important');
                }
            }
            
            // Instantly apply link visibility locally
            document.querySelectorAll('a[href="#' + sectionId + '"]:not(.cms-nav-btn)').forEach(link => {
                if (isVisible) {
                    link.style.removeProperty('display');
                } else {
                    link.style.setProperty('display', 'none', 'important');
                }
            });
        });
    });
}

/* ============================================
   Paket Tab Switcher
   ============================================ */
function initPaketTabs() {
    const tabs = document.querySelectorAll('.paket-tab');
    const contents = document.querySelectorAll('.paket-tab-content');
    
    if (!tabs.length || !contents.length) return;
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetTab = tab.dataset.tab;
            
            // Update active tab
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Update active content
            contents.forEach(c => c.classList.remove('active'));
            const target = document.getElementById('paket-content-' + targetTab);
            if (target) {
                target.classList.add('active');
                // Re-trigger animations
                target.querySelectorAll('.animate-on-scroll').forEach(el => {
                    el.classList.remove('visible');
                    void el.offsetWidth; // force reflow
                    el.classList.add('visible');
                });
            }
        });
    });
}

/* ============================================
   Mobile Menu
   ============================================ */
function initMobileMenu() {
    const toggle = document.querySelector('.mobile-toggle');
    const menu = document.querySelector('.mobile-menu');
    const links = document.querySelectorAll('.mobile-link, .mobile-cta');

    if (!toggle || !menu) return;

    toggle.addEventListener('click', () => {
        const isActive = menu.classList.toggle('active');
        toggle.classList.toggle('active');
        document.body.style.overflow = isActive ? 'hidden' : '';

        const spans = toggle.querySelectorAll('span');
        if (isActive) {
            spans[0].style.transform = 'rotate(45deg) translate(4px, 4px)';
            spans[1].style.transform = 'rotate(-45deg) translate(0, 0)';
        } else {
            spans[0].style.transform = '';
            spans[1].style.transform = '';
        }
    });

    // Use delegation for better reliability
    menu.addEventListener('click', (e) => {
        const link = e.target.closest('.mobile-link, .mobile-cta');
        if (!link) return;

        // Special handling for Admin Trigger & Admin Panel Button
        if (link.classList.contains('admin-trigger') || link.classList.contains('admin-panel-btn')) {
            e.preventDefault();

            // 1. Close Menu
            menu.classList.remove('active');
            toggle.classList.remove('active');
            document.body.style.overflow = '';

            const spans = toggle.querySelectorAll('span');
            if (spans.length >= 2) {
                spans[0].style.transform = '';
                spans[1].style.transform = '';
            }

            // 2. Clear Session and Open Modal
            const adminModal = document.getElementById('adminModal');
            const loginView = document.getElementById('adminLogin');
            const dashboardView = document.getElementById('adminDashboard');
            const modalContent = document.querySelector('.admin-modal-content');

            if (adminModal) {
                adminModal.classList.add('active');
                document.body.style.overflow = 'hidden';

                // Check if already logged in session
                const isLoggedIn = sessionStorage.getItem('async_admin') === 'true';

                if (isLoggedIn && window.asyncShowDashboard) {
                    // Already authenticated - show dashboard
                    window.asyncShowDashboard();
                } else {
                    // Not authenticated - show login form (reset state)
                    if (dashboardView) dashboardView.classList.remove('active');
                    if (loginView) loginView.classList.add('active');
                    if (modalContent) modalContent.classList.remove('dashboard-mode');
                }
            }
            return;
        }

        // Standard link closing behavior
        menu.classList.remove('active');
        toggle.classList.remove('active');
        document.body.style.overflow = '';

        const spans = toggle.querySelectorAll('span');
        spans[0].style.transform = '';
        spans[1].style.transform = '';
    });
}

/* ============================================
   Smooth Scroll
   ============================================ */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            
            // If href was dynamically changed to a full URL, or is just '#', ignore
            if (!targetId || !targetId.startsWith('#') || targetId === '#') return;

            e.preventDefault();
            try {
                const target = document.querySelector(targetId);
                if (target) {
                    const offset = document.body.classList.contains('cms-mode') ? 128 : 80;
                    const position = target.offsetTop - offset;
                    window.scrollTo({ top: position, behavior: 'smooth' });

                    // Highlight section briefly
                    target.classList.add('highlight-section');
                    setTimeout(() => target.classList.remove('highlight-section'), 1000);
                }
            } catch(err) {
                // Ignore invalid selectors silently instead of crashing
                console.warn('Smooth scroll skipped for invalid selector:', targetId);
            }
        });
    });
}

/* ============================================
   Scroll Animations
   ============================================ */
function initScrollAnimations() {
    const elements = document.querySelectorAll('.animate-on-scroll');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -80px 0px'
    });

    elements.forEach(el => observer.observe(el));
}

/* ============================================
   Language Toggle System
   ============================================ */
const TRANSLATIONS = {
    'id': {
        // Hero
        'hero-eyebrow': 'Partner Desain & Teknologi Bisnis Anda',
        'hero-title': 'Solusi Desain & Sistem Digital Profesional',
        'hero-desc': 'Kami membantu bisnis berkembang dengan identitas desain yang kuat dan infrastruktur sistem website yang handal.',
        'hero-cta-1': 'Mulai Project',
        'hero-cta-2': 'Konsultasi Gratis',
        // Navigation
        'nav-layanan': 'Layanan',
        'nav-paket': 'Paket',
        'nav-proses': 'Cara Kerja',
        'nav-testimoni': 'Testimoni',
        'nav-faq': 'FAQ',
        'nav-projects': 'Portofolio',
        'nav-kontak': 'Kontak',
        'nav-cta': 'Mulai Project',
        // Sections
        'layanan-label': 'Layanan Kami',
        'layanan-title': 'Solusi Digital Kami',
        'paket-label': 'Pilihan Paket',
        'paket-title': 'Pilihan Paket Investasi',
        'projects-label': 'Portfolio',
        'projects-title': 'Karya Kami',
        'proses-label': 'Cara Kerja',
        'proses-title': 'Proses Mudah & Transparan',
        'faq-label': 'FAQ',
        'faq-title': 'Pertanyaan yang Sering Ditanyakan',
        'testimoni-label': 'Testimoni',
        'testimoni-title': 'Apa Kata Klien Kami',
        'kontak-label': 'Kontak',
        'kontak-title': 'Mulai Project Anda',
        // Paket Cards
        'paket1-name': 'ASYNC Design',
        'paket2-name': 'ASYNC System',
        // Footer
        'footer-desc': 'Partner teknologi dan desain profesional untuk pertumbuhan bisnis Anda.',
        'footer-nav': 'Navigasi',
        'footer-contact': 'Kontak'
    },
    'en': {
        // Hero
        'hero-eyebrow': 'Your Professional Digital Partner',
        'hero-title': 'Professional Design & System Solutions',
        'hero-desc': 'We help businesses grow with strong design identity and reliable website infrastructure.',
        'hero-cta-1': 'Start Project',
        'hero-cta-2': 'Free Consultation',
        // Navigation
        'nav-layanan': 'Services',
        'nav-paket': 'Packages',
        'nav-proses': 'Process',
        'nav-testimoni': 'Reviews',
        'nav-faq': 'FAQ',
        'nav-projects': 'Portfolio',
        'nav-kontak': 'Contact',
        'nav-cta': 'Start Project',
        // Sections
        'layanan-label': 'Our Services',
        'layanan-title': 'Our Digital Solutions',
        'paket-label': 'Our Packages',
        'paket-title': 'Investment Packages',
        'projects-label': 'Portfolio',
        'projects-title': 'Our Work',
        'proses-label': 'Process',
        'proses-title': 'Easy & Transparent Process',
        'faq-label': 'FAQ',
        'faq-title': 'Frequently Asked Questions',
        'testimoni-label': 'Testimonials',
        'testimoni-title': 'What Our Clients Say',
        'kontak-label': 'Contact',
        'kontak-title': 'Start Your Project',
        // Paket Cards
        'paket1-name': 'ASYNC Design',
        'paket2-name': 'ASYNC System',
        // Footer
        'footer-desc': 'Professional design and technology partner for your business growth.',
        'footer-nav': 'Navigation',
        'footer-contact': 'Contact'
    }
};

function initLanguageToggle() {
    const toggle = document.querySelector('.lang-toggle');
    if (!toggle) return;

    // Get current language from localStorage or default to 'id'
    let currentLang = localStorage.getItem('asyncLang') || 'id';

    // Apply current language on load
    applyLanguage(currentLang);
    updateToggleUI(toggle, currentLang);

    // Toggle click handler
    toggle.addEventListener('click', () => {
        currentLang = currentLang === 'id' ? 'en' : 'id';
        localStorage.setItem('asyncLang', currentLang);
        applyLanguage(currentLang);
        updateToggleUI(toggle, currentLang);
    });
}

function updateToggleUI(toggle, lang) {
    const spans = toggle.querySelectorAll('span');
    if (spans.length >= 3) {
        if (lang === 'id') {
            spans[0].classList.add('active');
            spans[2].classList.remove('active');
        } else {
            spans[0].classList.remove('active');
            spans[2].classList.add('active');
        }
    }
}

function applyLanguage(lang) {
    const translations = TRANSLATIONS[lang];
    if (!translations) return;

    // Apply to editable elements with data-key
    Object.keys(translations).forEach(key => {
        const el = document.querySelector(`[data-key="${key}"]`);
        if (el) el.innerHTML = translations[key];
    });

    // Update navigation links
    const navLinks = {
        'layanan': translations['nav-layanan'],
        'paket': translations['nav-paket'],
        'proses': translations['nav-proses'],
        'testimoni': translations['nav-testimoni'],
        'faq': translations['nav-faq'],
        'projects': translations['nav-projects'],
        'kontak': translations['nav-kontak']
    };

    document.querySelectorAll('.nav-link').forEach(link => {
        const href = link.getAttribute('href');
        if (href) {
            const section = href.replace('#', '');
            if (navLinks[section]) {
                link.textContent = navLinks[section];
            }
        }
    });

    // Update CTA buttons
    document.querySelectorAll('.nav-cta, .mobile-cta').forEach(btn => {
        if (!btn.classList.contains('admin-panel-btn')) {
            btn.textContent = translations['nav-cta'];
        }
    });

    console.log(`Language switched to: ${lang.toUpperCase()}`);
}

// Expose globally for fallback use
window.switchLanguage = function (lang) {
    localStorage.setItem('asyncLang', lang);
    applyLanguage(lang);
    const toggle = document.querySelector('.lang-toggle');
    if (toggle) updateToggleUI(toggle, lang);
};


/* ============================================
   Dynamic Categories
   ============================================ */
function initDynamicCategories() {
    const pilarSelect = document.getElementById('pilarLayanan');
    const kategoriSelect = document.getElementById('kategoriLayanan');

    if (!pilarSelect || !kategoriSelect) return;

    const categories = {
        'creative': [
            { value: 'logo', label: 'Logo & Brand Identity' },
            { value: 'banner', label: 'Banner & Spanduk' },
            { value: 'sosmed', label: 'Konten Media Sosial (Feed/Story)' },
            { value: 'ppt', label: 'Presentasi (PPT/Slide Deck)' }
        ],
        'systems': [
            { value: 'landing', label: 'Landing Page (1 halaman)' },
            { value: 'company', label: 'Website Company Profile' },
            { value: 'webapp', label: 'Web App + Dashboard + Database' },
            { value: 'ecommerce', label: 'E-Commerce Sederhana' }
        ]
    };

    pilarSelect.addEventListener('change', (e) => {
        const pilar = e.target.value;
        kategoriSelect.innerHTML = '<option value="">Pilih kategori...</option>';

        if (categories[pilar]) {
            categories[pilar].forEach(cat => {
                const option = document.createElement('option');
                option.value = cat.value;
                option.textContent = cat.label;
                kategoriSelect.appendChild(option);
            });
        }
    });
}

/* ============================================
   Order Form Handler
   ============================================ */
function initOrderForm() {
    const form = document.getElementById('orderForm');
    if (!form) return;

    const deadlineInput = document.getElementById('deadline');
    if (deadlineInput) {
        const today = new Date().toISOString().split('T')[0];
        deadlineInput.setAttribute('min', today);
    }

        form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        const orderId = generateOrderId();

        // Prepare Firestore/Local Data
        const orderData = {
            id: orderId,
            ...data,
            createdAt: new Date().toISOString(),
            date: new Date().toLocaleDateString('id-ID'),
            status: 'pending'
        };

        const submitBtn = form.querySelector('.form-submit');
        const originalContent = submitBtn.innerHTML;
        submitBtn.innerHTML = `<span>Menyimpan...</span>`;
        submitBtn.disabled = true;

        // 1. Fallback save to localStorage first (so data isn't lost if DB fails)
        try {
            saveOrder({ ...orderData, timestamp: Date.now() });
        } catch (e) { console.error("Local save error:", e); }

        // 2. Format WhatsApp Message
        const pilars = { 'creative': 'DESIGN', 'systems': 'SYSTEM' };
        const pilarTxt = pilars[data.pilarLayanan] || data.pilarLayanan;

        const text = `Halo ASYNC SOLUTIONS, saya ingin order project baru:%0A%0A` +
            `📋 *PROJECT ORDER* (${orderId})%0A` +
            `👤 Nama Klien: ${data.namaKlien}%0A` +
            `🏢 Bisnis/Project: ${data.namaBisnis}%0A` +
            `📱 WhatsApp: ${data.userPhone}%0A` +
            `🎯 Layanan: ${pilarTxt} - ${data.kategoriLayanan}%0A` +
            `📝 Deskripsi: ${data.tentangBisnis}%0A` +
            `📅 Deadline: ${data.deadline}%0A` +
            `💰 Budget: ${data.budget}`;

        const waUrl = `https://wa.me/6285729715555?text=${text}`;

        try {
            // 3. Push to Firebase (Try)
            const fbData = { ...orderData, timestamp: serverTimestamp() };
            await addDoc(collection(db, "orders"), fbData);
        } catch (error) {
            console.warn("Database sync error (likely permissions), but order is saved locally.", error.message);
            // We DO NOT return here, we proceed to redirect the user!
        }

        // 4. Success Feedback & Redirect
        submitBtn.innerHTML = "✅ Terkirim!";
        form.reset();

        setTimeout(() => {
            submitBtn.innerHTML = originalContent;
            submitBtn.disabled = false;
            window.open(waUrl, '_blank');
        }, 1000);
    });
}

function generateOrderId() {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `ASY-${year}${month}${day}-${random}`;
}

function saveOrder(order) {
    const orders = JSON.parse(localStorage.getItem('async_orders') || '[]');
    // Check if duplicate ID exists
    if (!orders.some(o => o.id === order.id)) {
        orders.push(order);
        localStorage.setItem('async_orders', JSON.stringify(orders));
    }
}

/* ============================================
   Admin Modal System
   ============================================ */
function initAdminModal() {
    const triggers = document.querySelectorAll('.admin-trigger, .admin-panel-btn');
    const modal = document.getElementById('adminModal');
    const closeBtn = document.querySelector('.admin-modal-close');
    const loginForm = document.getElementById('adminLoginForm');
    const loginView = document.getElementById('adminLogin');
    const dashboardView = document.getElementById('adminDashboard');
    const logoutBtn = document.getElementById('adminLogout');
    const refreshBtn = document.getElementById('adminRefresh');
    const clearBtn = document.getElementById('adminClear');
    const errorEl = document.getElementById('adminLoginError');
    const tabs = document.querySelectorAll('.admin-tab');
    const tabContents = document.querySelectorAll('.admin-tab-content');
    const categoryFilters = document.querySelectorAll('.cat-filter');
    const saveCmsBtn = document.getElementById('saveCmsBtn');
    const resetCmsBtn = document.getElementById('resetCmsBtn');
    const enableCmsBtn = document.getElementById('enableCmsMode');

    if (!modal) return;

    // Check URL Params for Auto-Login
    const urlParams = new URLSearchParams(window.location.search);
    const adminUserParam = urlParams.get('adminUser');
    const adminPassParam = urlParams.get('adminPass');

    const ADMIN_USER = 'async.solutions';
    const ADMIN_PASS = 'asyncsolutions2026';

    if (adminUserParam === ADMIN_USER && adminPassParam === ADMIN_PASS) {
        console.log("Admin: Auto-login detected from URL parameters.");
        sessionStorage.setItem('async_admin', 'true');
        modal.classList.add('active');
        showDashboard();
    }

    // Close modal
    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Login
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const user = document.getElementById('adminUser').value;
        const pass = document.getElementById('adminPass').value;

        if (user === ADMIN_USER && pass === ADMIN_PASS) {
            sessionStorage.setItem('async_admin', 'true');
            errorEl.classList.remove('show');
            showDashboard();
        } else {
            errorEl.classList.add('show');
            setTimeout(() => errorEl.classList.remove('show'), 3000);
        }
    });

    // Logout
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            console.log("Admin: Logging out...");

            // 1. Clear session
            sessionStorage.removeItem('async_admin');

            // 3. Reset views
            if (dashboardView) dashboardView.classList.remove('active');
            if (loginView) loginView.classList.add('active');

            // 4. Reset form
            loginForm.reset();

            // 5. Remove dashboard mode class
            const modalContent = document.querySelector('.admin-modal-content');
            if (modalContent) modalContent.classList.remove('dashboard-mode');

            // 6. Disable CMS mode
            disableCmsMode();

            // 7. Close modal completely
            modal.classList.remove('active');
            document.body.style.overflow = '';

            console.log("Admin: Logged out successfully.");
        });
    }

    // Enable CMS Mode
    if (enableCmsBtn) {
        enableCmsBtn.addEventListener('click', () => {
            enableCmsModeFunc();
            closeModal();
        });
    }

    // Save CMS
    if (saveCmsBtn) {
        saveCmsBtn.addEventListener('click', () => {
            saveCmsContent();
            showToast('Semua konten berhasil disimpan!');
        });
    }

    // Reset CMS
    if (resetCmsBtn) {
        resetCmsBtn.addEventListener('click', () => {
            if (confirm('Reset semua konten ke default? Perubahan yang belum disimpan akan hilang.')) {
                localStorage.removeItem('async_cms');
                location.reload();
            }
        });
    }

    // CMS Nav buttons
    document.querySelectorAll('.cms-nav-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            enableCmsModeFunc();
            closeModal();

            setTimeout(() => {
                const target = document.querySelector(btn.getAttribute('href'));
                if (target) {
                    const offset = 128;
                    const position = target.offsetTop - offset;
                    window.scrollTo({ top: position, behavior: 'smooth' });
                    target.classList.add('highlight-section');
                    setTimeout(() => target.classList.remove('highlight-section'), 1000);
                }
            }, 300);
        });
    });

    // Expose for global trigger
    window.asyncShowDashboard = showDashboard;

    function showDashboard() {
        console.log("Admin: Transitioning to Dashboard...");
        try {
            if (loginView) loginView.classList.remove('active');
            if (dashboardView) dashboardView.classList.add('active');

            const content = document.querySelector('.admin-modal-content');
            if (content) content.classList.add('dashboard-mode');


        } catch (e) {
            console.error("Admin: Error in showDashboard:", e);
        }
    }
}

/* ============================================
   CMS Inline Editing System
   ============================================ */
// cmsModified is declared globally

function initCmsMode() {
    const indicator = document.getElementById('cmsIndicator');
    const exitBtn = document.getElementById('exitCmsMode');

    // Attach to ALL admin triggers (Desktop + Mobile)
    document.querySelectorAll('.admin-trigger').forEach(btn => {
        btn.addEventListener('click', enableCmsModeFunc);
    });

    if (exitBtn) {
        exitBtn.addEventListener('click', disableCmsMode);
    }

    // Make all editable elements contenteditable
    document.querySelectorAll('.editable').forEach(el => {
        el.addEventListener('focus', function () {
            if (document.body.classList.contains('cms-mode')) {
                this.classList.add('editing');
            }
        });

        el.addEventListener('blur', function () {
            this.classList.remove('editing');
            if (document.body.classList.contains('cms-mode')) {
                const key = this.dataset.key;
                if (key) {
                    cmsModified[key] = this.textContent;
                    this.classList.add('modified');
                }
            }
        });

        el.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.blur();
            }
        });
    });
}

function enableCmsModeFunc() {
    document.body.classList.add('cms-mode');
    const indicator = document.getElementById('cmsIndicator');
    const hoverZone = document.getElementById('cmsHoverZone');

    // Setup hover detection for CMS indicator
    if (indicator && hoverZone) {
        // Show indicator when hovering near top
        const showIndicator = () => indicator.classList.add('visible');
        const hideIndicator = () => indicator.classList.remove('visible');

        hoverZone.addEventListener('mouseenter', showIndicator);
        indicator.addEventListener('mouseenter', showIndicator);
        indicator.addEventListener('mouseleave', hideIndicator);

        // Store listeners for cleanup
        indicator._showFn = showIndicator;
        indicator._hideFn = hideIndicator;
    }

    // Enable contenteditable
    document.querySelectorAll('.editable').forEach(el => {
        el.setAttribute('contenteditable', 'true');
    });

    // Ensure exit button listener is active
    const exitBtn = document.getElementById('exitCmsMode');
    if (exitBtn) {
        exitBtn.removeEventListener('click', disableCmsMode); // Prevent duplicates
        exitBtn.addEventListener('click', disableCmsMode);
        // Force pointer events for the button
        exitBtn.style.pointerEvents = 'auto';
    }

    showToast('CMS Mode aktif! Gerakkan mouse ke atas layar untuk menu.');
}

function disableCmsMode() {
    document.body.classList.remove('cms-mode');
    const indicator = document.getElementById('cmsIndicator');
    const hoverZone = document.getElementById('cmsHoverZone');

    if (indicator) {
        // Remove event listeners if they exist
        if (indicator._showFn && hoverZone) {
            hoverZone.removeEventListener('mouseenter', indicator._showFn);
            indicator.removeEventListener('mouseenter', indicator._showFn);
            indicator.removeEventListener('mouseleave', indicator._hideFn);
        }
    }

    // Disable contenteditable
    document.querySelectorAll('.editable').forEach(el => {
        el.setAttribute('contenteditable', 'false');
        el.classList.remove('editing', 'modified');
    });

    // Check for unsaved changes
    if (Object.keys(cmsModified).length > 0) {
        if (confirm('Ada perubahan yang belum disimpan. Simpan sekarang?')) {
            saveCmsContent();
        }
    }

    // Reset Modified
    cmsModified = {};

    showToast('CMS Mode dinonaktifkan.');
}

/* ============================================
   CMS Save to Firebase
   ============================================ */
async function saveCmsContentToDb() {
    try {
        const content = {};
        document.querySelectorAll('.editable[data-key]').forEach(el => {
            content[el.dataset.key] = el.innerHTML;
        });

        // Add section visibility settings to the payload
        const defaultSections = ['hero', 'layanan', 'paket', 'proses', 'projects', 'faq', 'calculator', 'kenapa', 'kontak'];
        defaultSections.forEach(sectionId => {
            const checkbox = document.getElementById('toggle-section-' + sectionId);
            if (checkbox) {
                content['visibility-' + sectionId] = checkbox.checked;
            }
        });

        const docRef = doc(db, "settings", "cms_content");
        await setDoc(docRef, {
            ...content,
            updatedAt: serverTimestamp()
        });

        // Also save to localStorage as cache
        localStorage.setItem('asyncCmsContent', JSON.stringify(content));
        console.log("CMS Content saved to Firebase!");
        return true;
    } catch (e) {
        console.error("CMS Save Error:", e);
        // Fallback to localStorage only
        const content = {};
        document.querySelectorAll('.editable[data-key]').forEach(el => {
            content[el.dataset.key] = el.innerHTML;
        });
        const defaultSections = ['hero', 'layanan', 'paket', 'proses', 'projects', 'faq', 'calculator', 'kenapa', 'kontak'];
        defaultSections.forEach(sectionId => {
            const checkbox = document.getElementById('toggle-section-' + sectionId);
            if (checkbox) {
                content['visibility-' + sectionId] = checkbox.checked;
            }
        });
        localStorage.setItem('asyncCmsContent', JSON.stringify(content));
        return false;
    }
}

// Legacy saveCmsContent wrapper
function saveCmsContent() {
    saveCmsContentToDb();
}

/* ============================================
   CMS Logic (Firebase Integrated)
   ============================================ */
// Imports handled at top of file

// Fetch Content from Firestore
async function loadCmsContent() {
    try {
        const docRef = doc(db, "settings", "cms_content");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            applyCmsContent(data);
            localStorage.setItem('asyncCmsContent', JSON.stringify(data));
        } else {
            const saved = localStorage.getItem('asyncCmsContent');
            if (saved) applyCmsContent(JSON.parse(saved));
        }
    } catch (e) {
        console.error("CMS Load Error:", e);
        const saved = localStorage.getItem('asyncCmsContent');
        if (saved) applyCmsContent(JSON.parse(saved));
    }
}

function applyCmsContent(data) {
    if (!data) return;

    // 1. Process and Apply Section Visibility
    const defaultSections = ['hero', 'layanan', 'paket', 'proses', 'projects', 'faq', 'calculator', 'kenapa', 'kontak'];
    defaultSections.forEach(sectionId => {
        const val = data['visibility-' + sectionId];
        // If undefined (not configured in db yet), default to true. Otherwise, check boolean or string true.
        const isVisible = (val === undefined || val === true || val === 'true');

        // Apply to section element
        const sec = document.getElementById(sectionId);
        if (sec) {
            if (isVisible) {
                sec.style.removeProperty('display');
            } else {
                sec.style.setProperty('display', 'none', 'important');
            }
        }

        // Apply to navigation links pointing to this section (desktop, mobile menu, footer, etc.)
        document.querySelectorAll('a[href="#' + sectionId + '"]:not(.cms-nav-btn)').forEach(link => {
            if (isVisible) {
                link.style.removeProperty('display');
            } else {
                link.style.setProperty('display', 'none', 'important');
            }
        });

        // Sync toggle state in Admin Panel if it exists
        const checkbox = document.getElementById('toggle-section-' + sectionId);
        if (checkbox) {
            checkbox.checked = isVisible;
        }
    });

    // 2. Process and Apply Text Content
    Object.keys(data).forEach(key => {
        if (key.startsWith('visibility-')) return; // handled above

        const val = data[key];
        // Ignore old CMS content containing the word "ASPYRE"
        if (typeof val === 'string' && val.toUpperCase().includes('ASPYRE')) {
            console.log(`CMS Protection: Ignored old content for key: ${key}`);
            return;
        }
        const el = document.querySelector(`[data-key="${key}"]`);
        if (el) el.innerHTML = val;
    });
}

// initCmsMode is already defined above - removed duplicate

// Global function to enable CMS
window.enableCmsModeFunc = function () {
    document.body.classList.add('cms-mode');
    localStorage.setItem('cmsMode', 'true');

    // UI Indicator
    const indicator = document.getElementById('cmsIndicator');
    if (indicator) {
        indicator.style.display = 'flex';
        // Add Save Button to Indicator if not exists
        if (!document.getElementById('cmsSaveBtn')) {
            const saveBtn = document.createElement('button');
            saveBtn.id = 'cmsSaveBtn';
            saveBtn.innerText = '💾 Simpan Perubahan';
            saveBtn.className = 'cms-btn-save';
            saveBtn.style.cssText = 'background:#2ecc71; color:white; border:none; padding:5px 10px; border-radius:4px; cursor:pointer; margin-left:10px; font-weight:bold;';

            saveBtn.onclick = async () => {
                saveBtn.innerText = 'Menyimpan...';
                await saveCmsContentToDb();
                saveBtn.innerText = '✅ Tersimpan!';
                setTimeout(() => saveBtn.innerText = '💾 Simpan Perubahan', 2000);
            };
            indicator.appendChild(saveBtn);
        }
    }

    // Make elements editable
    document.querySelectorAll('.editable').forEach(el => {
        el.contentEditable = 'true';
        el.style.outline = '1px dashed rgba(255,255,255,0.3)';

        el.addEventListener('focus', () => el.style.background = 'rgba(0,0,0,0.5)');
        el.addEventListener('blur', () => {
            el.style.background = '';
            // Auto-save to local temp
            const key = el.dataset.key;
            if (key) {
                const current = JSON.parse(localStorage.getItem('asyncCmsContent')) || {};
                current[key] = el.innerHTML;
                localStorage.setItem('asyncCmsContent', JSON.stringify(current));
            }
        });
    });

    document.getElementById('exitCmsMode')?.addEventListener('click', () => {
        document.body.classList.remove('cms-mode');
        localStorage.removeItem('cmsMode');
        location.reload();
    });
};

// saveCmsContentToDb is defined above - removed duplicate

/* ============================================
   Magnetic Buttons
   ============================================ */
function initMagneticButtons() {
    const buttons = document.querySelectorAll('.magnetic-btn');

    buttons.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            btn.style.setProperty('--x', x + '%');
            btn.style.setProperty('--y', y + '%');
        });
    });
}

/* ============================================
   Toast Notification
   ============================================ */
function showToast(message) {
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        bottom: 24px;
        left: 50%;
        transform: translateX(-50%) translateY(100px);
        padding: 12px 24px;
        background: #232328;
        color: #fff;
        font-size: 14px;
        border-radius: 8px;
        z-index: 9999;
        opacity: 0;
        transition: all 0.3s ease;
        border: 1px solid rgba(232, 90, 79, 0.3);
    `;

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.transform = 'translateX(-50%) translateY(0)';
        toast.style.opacity = '1';
    }, 10);

    setTimeout(() => {
        toast.style.transform = 'translateX(-50%) translateY(100px)';
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

/* ============================================
   Navbar Scroll Effect
   ============================================ */
window.addEventListener('scroll', () => {
    const nav = document.querySelector('.main-nav');
    if (!nav) return;
    nav.style.boxShadow = window.scrollY > 100 ? '0 4px 20px rgba(0, 0, 0, 0.2)' : 'none';
});

/* ============================================
   Counter Animation
   ============================================ */
document.addEventListener('DOMContentLoaded', () => {
    const proofItems = document.querySelectorAll('.proof-item');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const number = entry.target.querySelector('.proof-number');
                if (number) {
                    const target = parseInt(number.textContent);
                    if (!isNaN(target)) {
                        animateNumber(number, target);
                    }
                }
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    proofItems.forEach(item => observer.observe(item));
});

function animateNumber(element, target) {
    const duration = 1500;
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        element.textContent = Math.floor(target * easeProgress);
        if (progress < 1) requestAnimationFrame(update);
        else element.textContent = target;
    }

    requestAnimationFrame(update);
}

/* ============================================
   Portfolio Albums System - Interactive Gallery
   ============================================ */
function initPortfolioAlbums() {
    // Dummy Albums Data - Can be extended via CMS
    const albumsData = [
        {
            id: 'desa-cenrana',
            title: 'Sistem Informasi Desa Cenrana',
            category: 'Digitalisasi Desa',
            description: 'Pengembangan Sistem Informasi Desa Cenrana Berbasis Aspirasi Publik — platform digital terintegrasi yang menyediakan layanan warga digital 24/7, pusat informasi terpadu, Lapak Warga dengan integrasi WhatsApp, dan dashboard admin dengan analitik real-time. Proyek kemitraan yang berhasil diterapkan dan kini berjalan mandiri.',
            tech: ['Next.js', 'Supabase', 'Vercel', 'WhatsApp API', 'Dashboard Analitik'],
            link: 'https://desacenrana.vercel.app',
            stats: [
                { value: '70%', label: 'Birokrasi Surat Lebih Cepat' },
                { value: 'WhatsApp', label: 'Lapak Warga Terintegrasi' },
                { value: 'Sukses', label: 'Status Proyek Mandiri' }
            ],
            previews: [
                'https://via.placeholder.com/400x300/1a1a2e/e85a4f?text=Cenrana+Home',
                'https://via.placeholder.com/400x300/232328/6b9080?text=Aspirasi+Page',
                'https://via.placeholder.com/400x300/2d2d35/f4a261?text=UMKM+Lapak'
            ],
            items: [
                { src: 'https://via.placeholder.com/600x400/1a1a2e/e85a4f?text=Homepage', caption: 'Halaman Utama Desa' },
                { src: 'https://via.placeholder.com/600x400/232328/6b9080?text=Aspirasi', caption: 'Form Aspirasi Warga' },
                { src: 'https://via.placeholder.com/600x400/2d2d35/f4a261?text=Lapak+Warga', caption: 'Lapak Warga (Ekonomi Digital)' },
                { src: 'https://via.placeholder.com/600x400/1a1a2e/a4c3b2?text=Info+Desa', caption: 'Pusat Informasi Terpadu' },
                { src: 'https://via.placeholder.com/600x400/232328/e85a4f?text=Dashboard', caption: 'Dashboard Admin & Analitik' },
                { src: 'https://via.placeholder.com/600x400/2d2d35/6b9080?text=Mobile', caption: 'Responsif Multi-Perangkat' }
            ]
        },
        {
            id: 'brand-identity',
            title: 'Brand Identity Collection',
            category: 'Branding',
            description: 'Koleksi desain identitas brand untuk berbagai klien. Meliputi logo, banner promosi, profil sosial media, dan materi pemasaran digital yang unik dan memorable.',
            tech: ['Logo Design', 'Brand Guidelines', 'Social Media Kit', 'Print Ready'],
            link: null,
            previews: [
                'https://via.placeholder.com/400x300/1a1a2e/f4a261?text=Logo+Design',
                'https://via.placeholder.com/400x300/232328/e85a4f?text=Brand+Kit',
                'https://via.placeholder.com/400x300/2d2d35/6b9080?text=Social+Media'
            ],
            items: [
                { src: 'https://via.placeholder.com/600x400/1a1a2e/f4a261?text=Logo+1', caption: 'Logo Kedai Kopi' },
                { src: 'https://via.placeholder.com/600x400/232328/e85a4f?text=Logo+2', caption: 'Logo Startup Tech' },
                { src: 'https://via.placeholder.com/600x400/2d2d35/6b9080?text=Banner', caption: 'Banner Promosi' },
                { src: 'https://via.placeholder.com/600x400/1a1a2e/a4c3b2?text=Social', caption: 'Instagram Feed' },
                { src: 'https://via.placeholder.com/600x400/232328/f4a261?text=Cards', caption: 'Business Cards' }
            ]
        },
        {
            id: 'ecommerce',
            title: 'E-Commerce Solutions',
            category: 'Web Store',
            description: 'Solusi toko online lengkap dengan katalog produk interaktif, integrasi WhatsApp order, dan sistem manajemen pesanan yang mudah digunakan.',
            tech: ['Product Catalog', 'WhatsApp API', 'Payment Gateway', 'Responsive'],
            link: null,
            previews: [
                'https://via.placeholder.com/400x300/1a1a2e/e85a4f?text=Store+Home',
                'https://via.placeholder.com/400x300/232328/f4a261?text=Products',
                'https://via.placeholder.com/400x300/2d2d35/6b9080?text=Cart'
            ],
            items: [
                { src: 'https://via.placeholder.com/600x400/1a1a2e/e85a4f?text=Homepage', caption: 'Store Homepage' },
                { src: 'https://via.placeholder.com/600x400/232328/f4a261?text=Catalog', caption: 'Product Catalog' },
                { src: 'https://via.placeholder.com/600x400/2d2d35/6b9080?text=Details', caption: 'Product Details' },
                { src: 'https://via.placeholder.com/600x400/1a1a2e/a4c3b2?text=Cart', caption: 'Shopping Cart' },
                { src: 'https://via.placeholder.com/600x400/232328/e85a4f?text=Checkout', caption: 'WhatsApp Checkout' }
            ]
        },
        {
            id: 'social-media',
            title: 'Social Media Kit',
            category: 'Digital Marketing',
            description: 'Paket lengkap konten sosial media untuk branding dan marketing digital. Termasuk template Instagram, story, dan highlight covers.',
            tech: ['Instagram Feed', 'Story Templates', 'Carousel', 'Highlight Covers'],
            link: null,
            previews: [
                'https://via.placeholder.com/400x300/1a1a2e/a4c3b2?text=IG+Feed',
                'https://via.placeholder.com/400x300/232328/e85a4f?text=Story',
                'https://via.placeholder.com/400x300/2d2d35/f4a261?text=Carousel'
            ],
            items: [
                { src: 'https://via.placeholder.com/600x400/1a1a2e/a4c3b2?text=Feed+Grid', caption: 'Instagram Feed Grid' },
                { src: 'https://via.placeholder.com/600x400/232328/e85a4f?text=Story+1', caption: 'Story Template' },
                { src: 'https://via.placeholder.com/600x400/2d2d35/f4a261?text=Carousel', caption: 'Carousel Post' },
                { src: 'https://via.placeholder.com/600x400/1a1a2e/6b9080?text=Highlights', caption: 'Highlight Covers' }
            ]
        },
        {
            id: 'uiux-design',
            title: 'UI/UX Design',
            category: 'App Design',
            description: 'Desain antarmuka aplikasi mobile dan web dengan fokus pada user experience yang intuitif dan visual yang premium.',
            tech: ['Figma', 'Wireframing', 'Prototyping', 'User Research'],
            link: null,
            previews: [
                'https://via.placeholder.com/400x300/1a1a2e/6b9080?text=Dashboard',
                'https://via.placeholder.com/400x300/232328/a4c3b2?text=Mobile+App',
                'https://via.placeholder.com/400x300/2d2d35/e85a4f?text=Wireframe'
            ],
            items: [
                { src: 'https://via.placeholder.com/600x400/1a1a2e/6b9080?text=Dashboard', caption: 'Dashboard Design' },
                { src: 'https://via.placeholder.com/600x400/232328/a4c3b2?text=Mobile', caption: 'Mobile App Screens' },
                { src: 'https://via.placeholder.com/600x400/2d2d35/e85a4f?text=Wireframe', caption: 'Wireframe Concept' },
                { src: 'https://via.placeholder.com/600x400/1a1a2e/f4a261?text=Prototype', caption: 'Interactive Prototype' },
                { src: 'https://via.placeholder.com/600x400/232328/6b9080?text=Components', caption: 'UI Components' }
            ]
        }
    ];

    // Load saved albums from localStorage (CMS)
    let albums = albumsData;
    try {
        const saved = localStorage.getItem('async_albums');
        if (saved) {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed) && parsed.length > 0) {
                albums = parsed;
                console.log("Portfolio: Loaded from cache.");
            }
        }
    } catch (e) {
        console.warn("Portfolio: Error loading cache, using defaults.");
    }


    // DOM Elements
    const albumsContainer = document.getElementById('portfolioAlbums');
    const albumsWrapper = document.querySelector('.portfolio-albums-wrapper');
    const modal = document.getElementById('album-modal');
    const lightbox = document.getElementById('image-lightbox');
    const scrollNav = document.querySelector('.album-scroll-nav');
    const scrollDots = document.getElementById('scrollDots');
    const addAlbumBtn = document.getElementById('addAlbumBtn');

    // Edit Modal Elements
    const editModal = document.getElementById('album-edit-modal');
    const editForm = document.getElementById('albumEditForm');

    if (!albumsContainer) return;

    // Safety check for add button
    if (addAlbumBtn) {
        addAlbumBtn.addEventListener('click', () => openEditModal());
    }

    // Current state
    let currentAlbumItems = [];
    let currentImageIndex = 0;
    let currentEditAlbum = null;
    let currentEditTags = [];
    let currentEditPreviews = [];
    let currentEditGallery = [];

    // Auto-scroll state
    let autoScrollInterval = null;

    // Render Albums
    function renderAlbums() {
        albumsContainer.innerHTML = '';

        // Check if scrollable (more than 6 albums for 3x2 grid)
        if (albums.length > 6) {
            albumsContainer.classList.add('scrollable');
        } else {
            albumsContainer.classList.remove('scrollable');
        }

        albums.forEach((album, index) => {
            const card = document.createElement('div');
            card.className = 'album-card animate-on-scroll';
            card.dataset.albumId = album.id;
            card.style.animationDelay = `${index * 0.08}s`;

            card.innerHTML = `
                <button class="album-edit-btn" data-edit-id="${album.id}" title="Edit Album">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                </button>
                <div class="album-preview-stack">
                    ${(album.previews || []).slice(0, 3).map((src, i) => `
                        <div class="preview-image">
                            <img src="${src}" alt="${album.title || 'Preview'} ${i + 1}" loading="lazy">
                        </div>
                    `).join('')}
                </div>
                <div class="album-info">
                    <span class="album-category">${album.category}</span>
                    <h3 class="album-title">${album.title}</h3>
                    <div class="album-count">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="3" y="3" width="18" height="18" rx="2"/>
                            <circle cx="8.5" cy="8.5" r="1.5"/>
                            <path d="M21 15l-5-5L5 21"/>
                        </svg>
                        <span>${album.items.length} karya</span>
                    </div>
                </div>
                <div class="album-overlay">
                    <div class="view-album-btn">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                            <circle cx="12" cy="12" r="3"/>
                        </svg>
                        <span>Lihat Album</span>
                    </div>
                </div>
            `;

            // Edit button click (stop propagation)
            const editBtn = card.querySelector('.album-edit-btn');
            editBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                openEditModal(album);
            });

            // Card click - open album modal
            card.addEventListener('click', () => openAlbumModal(album));

            // Add spotlight effect listener
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                card.style.setProperty('--mouse-x', `${x}px`);
                card.style.setProperty('--mouse-y', `${y}px`);
            });

            albumsContainer.appendChild(card);
        });

        // Handle scroll navigation visibility
        updateScrollNav();

        // Re-init scroll animations for new elements
        initScrollAnimationsForAlbums();

        // Init auto-scroll
        initAutoScroll();
    }

    // Initialize scroll animations for album cards
    function initScrollAnimationsForAlbums() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

        document.querySelectorAll('.album-card.animate-on-scroll').forEach(el => {
            observer.observe(el);
        });
    }

    // Auto-scroll when cursor at edges using requestAnimationFrame for smoothness
    function initAutoScroll() {
        if (!albumsWrapper || !albumsContainer.classList.contains('scrollable')) return;

        let scrollSpeed = 0;
        let isScrolling = false;
        let animationFrameId = null;

        const edgeZone = 120; // Wider detection zone
        const maxSpeed = 10;   // Faster max speed

        // Scroll loop function
        const scrollLoop = () => {
            if (Math.abs(scrollSpeed) > 0.1) {
                albumsContainer.scrollLeft += scrollSpeed;

                // Boundary checks
                if (albumsContainer.scrollLeft <= 0 && scrollSpeed < 0) {
                    scrollSpeed = 0;
                } else if (albumsContainer.scrollLeft >= albumsContainer.scrollWidth - albumsContainer.clientWidth && scrollSpeed > 0) {
                    scrollSpeed = 0;
                }

                animationFrameId = requestAnimationFrame(scrollLoop);
            } else {
                isScrolling = false;
                albumsWrapper.classList.remove('can-scroll-left', 'can-scroll-right');
            }
        };

        // Mouse move handler
        function handleMouseMove(e) {
            const rect = albumsWrapper.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const width = rect.width;

            // Calculate speed based on distance from edge
            if (x < edgeZone) {
                // Left edge
                const intensity = 1 - (x / edgeZone);
                scrollSpeed = -maxSpeed * intensity * intensity;
                albumsWrapper.classList.add('can-scroll-left');
                albumsWrapper.classList.remove('can-scroll-right');
            } else if (x > width - edgeZone) {
                // Right edge
                const intensity = 1 - ((width - x) / edgeZone);
                scrollSpeed = maxSpeed * intensity * intensity;
                albumsWrapper.classList.add('can-scroll-right');
                albumsWrapper.classList.remove('can-scroll-left');
            } else {
                scrollSpeed = 0;
                albumsWrapper.classList.remove('can-scroll-left', 'can-scroll-right');
            }

            if (Math.abs(scrollSpeed) > 0.1 && !isScrolling) {
                isScrolling = true;
                scrollLoop();
            }
        }

        // Mouse leave handler
        function handleMouseLeave() {
            scrollSpeed = 0;
            albumsWrapper.classList.remove('can-scroll-left', 'can-scroll-right');
            if (animationFrameId) cancelAnimationFrame(animationFrameId);
            isScrolling = false;
        }

        // Remove old listeners if any (using named functions helps if we stored them, but here we just add new ones)
        // Ideally we should clean up, but for now we'll just add new ones. 
        // To prevent duplicate listeners on re-render, we can clone the node or remove all listeners if we tracked them.
        // A simple way is to use the 'onmousemove' property, but that overrides others.
        // Better: use a flag or check if listeners are attached. 
        // For this iteration, I'll rely on renderAlbums clearing the innerHTML which doesn't affect the wrapper listeners.
        // WAIT: albumsWrapper is outside renderAlbums. So every renderAlbums call adds NEW listeners to albumsWrapper!
        // This causes the "unstable" behavior (multiple loops running).

        // FIX: Remove previous listeners using a stored reference on the element
        if (albumsWrapper._moveHandler) albumsWrapper.removeEventListener('mousemove', albumsWrapper._moveHandler);
        if (albumsWrapper._leaveHandler) albumsWrapper.removeEventListener('mouseleave', albumsWrapper._leaveHandler);

        albumsWrapper._moveHandler = handleMouseMove;
        albumsWrapper._leaveHandler = handleMouseLeave;

        albumsWrapper.addEventListener('mousemove', handleMouseMove);
        albumsWrapper.addEventListener('mouseleave', handleMouseLeave);
    }

    // Update scroll navigation
    function updateScrollNav() {
        if (albums.length > 4) {
            albumsContainer.classList.add('scrollable');
            scrollNav?.classList.add('visible');

            // Create dots
            if (scrollDots) {
                const pageCount = Math.ceil(albums.length / 6);
                scrollDots.innerHTML = Array(pageCount).fill(0).map((_, i) =>
                    `<div class="scroll-dot ${i === 0 ? 'active' : ''}" data-page="${i}"></div>`
                ).join('');

                // Dot click handlers
                scrollDots.querySelectorAll('.scroll-dot').forEach(dot => {
                    dot.addEventListener('click', () => {
                        const page = parseInt(dot.dataset.page);
                        scrollToPage(page);
                    });
                });
            }
        } else {
            albumsContainer.classList.remove('scrollable');
            scrollNav?.classList.remove('visible');
        }
    }

    // Scroll to page
    function scrollToPage(page) {
        const cardWidth = albumsContainer.querySelector('.album-card')?.offsetWidth || 400;
        const gap = 24;
        // Desktop: 3 items per page. Scroll by 3 card widths + gaps.
        const scrollAmount = page * (cardWidth * 3 + gap * 3);
        albumsContainer.scrollTo({ left: scrollAmount, behavior: 'smooth' });

        // Update dots
        scrollDots?.querySelectorAll('.scroll-dot').forEach((dot, i) => {
            dot.classList.toggle('active', i === page);
        });
    }

    // Scroll navigation buttons
    document.querySelector('.scroll-prev')?.addEventListener('click', () => {
        albumsContainer.scrollBy({ left: -400, behavior: 'smooth' });
    });

    document.querySelector('.scroll-next')?.addEventListener('click', () => {
        albumsContainer.scrollBy({ left: 400, behavior: 'smooth' });
    });

    // Open Album Modal
    function openAlbumModal(album) {
        if (!modal) return;

        currentAlbumItems = album.items;

        // Populate modal
        modal.querySelector('.album-modal-tag').textContent = album.category;
        modal.querySelector('.album-modal-title').textContent = album.title;
        modal.querySelector('.album-modal-desc').textContent = album.description;

        // Render Stats if available
        let statsContainer = modal.querySelector('.album-modal-stats');
        if (!statsContainer) {
            statsContainer = document.createElement('div');
            statsContainer.className = 'album-modal-stats';
            modal.querySelector('.album-modal-info').appendChild(statsContainer);
        }
        if (album.stats && album.stats.length > 0) {
            statsContainer.innerHTML = album.stats.map(s => `
                <div class="modal-stat-card">
                    <span class="stat-value">${s.value}</span>
                    <span class="stat-label">${s.label}</span>
                </div>
            `).join('');
            statsContainer.style.display = 'grid';
        } else {
            statsContainer.innerHTML = '';
            statsContainer.style.display = 'none';
        }

        // Tech stack
        const techStack = modal.querySelector('.album-tech-stack');
        techStack.innerHTML = album.tech.map(t => `<span>${t}</span>`).join('');

        // Visit link
        const visitLink = document.getElementById('albumVisitLink');
        if (album.link) {
            visitLink.href = album.link;
            visitLink.style.display = 'inline-flex';
        } else {
            visitLink.style.display = 'none';
        }

        // Gallery
        const gallery = document.getElementById('albumGalleryGrid');
        gallery.innerHTML = album.items.map((item, index) => `
            <div class="gallery-item" data-index="${index}">
                <img src="${item.src}" alt="${item.caption}" loading="lazy">
                <div class="gallery-zoom-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="11" cy="11" r="8"/>
                        <path d="M21 21l-4.35-4.35"/>
                        <line x1="11" y1="8" x2="11" y2="14"/>
                        <line x1="8" y1="11" x2="14" y2="11"/>
                    </svg>
                </div>
                <p class="gallery-item-caption">${item.caption}</p>
            </div>
        `).join('');

        // Gallery item click - open lightbox
        gallery.querySelectorAll('.gallery-item').forEach(item => {
            item.addEventListener('click', () => {
                openLightbox(parseInt(item.dataset.index));
            });
        });

        // Show modal
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    // Close Album Modal
    function closeAlbumModal() {
        if (!modal) return;
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Modal close handlers
    modal?.querySelector('.album-modal-close')?.addEventListener('click', closeAlbumModal);
    modal?.querySelector('.album-modal-backdrop')?.addEventListener('click', closeAlbumModal);

    // Open Lightbox
    function openLightbox(index) {
        if (!lightbox) return;

        currentImageIndex = index;
        updateLightboxImage();
        lightbox.classList.add('active');
    }

    // Update Lightbox Image
    function updateLightboxImage() {
        if (!lightbox || !currentAlbumItems[currentImageIndex]) return;

        const item = currentAlbumItems[currentImageIndex];
        const img = document.getElementById('lightboxImage');
        const caption = document.getElementById('lightboxCaption');
        const counter = document.getElementById('lightboxCounter');

        img.src = item.src;
        img.alt = item.caption;
        caption.textContent = item.caption;
        counter.textContent = `${currentImageIndex + 1} / ${currentAlbumItems.length}`;
    }

    // Lightbox Navigation
    function lightboxPrev() {
        currentImageIndex = (currentImageIndex - 1 + currentAlbumItems.length) % currentAlbumItems.length;
        updateLightboxImage();
    }

    function lightboxNext() {
        currentImageIndex = (currentImageIndex + 1) % currentAlbumItems.length;
        updateLightboxImage();
    }

    // Close Lightbox
    function closeLightbox() {
        if (!lightbox) return;
        lightbox.classList.remove('active');
    }

    // Lightbox event listeners
    lightbox?.querySelector('.lightbox-close')?.addEventListener('click', closeLightbox);
    lightbox?.querySelector('.lightbox-prev')?.addEventListener('click', lightboxPrev);
    lightbox?.querySelector('.lightbox-next')?.addEventListener('click', lightboxNext);

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (lightbox?.classList.contains('active')) {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') lightboxPrev();
            if (e.key === 'ArrowRight') lightboxNext();
        } else if (modal?.classList.contains('active')) {
            if (e.key === 'Escape') closeAlbumModal();
        } else if (editModal?.classList.contains('active')) {
            if (e.key === 'Escape') closeEditModal();
        }
    });

    // ==========================================
    // CMS: Album Edit Modal Functions
    // ==========================================

    // Open Edit Modal
    function openEditModal(album) {
        if (!editModal) return;

        currentEditAlbum = album;
        currentEditTags = [...album.tech];
        currentEditPreviews = [...album.previews];
        currentEditGallery = album.items.map(item => ({ ...item }));

        // Fill form fields
        document.getElementById('editModalTitle').textContent = album.id.startsWith('album-') ? 'Tambah Album Baru' : 'Edit Album';
        document.getElementById('editAlbumId').value = album.id;
        document.getElementById('editAlbumTitle').value = album.title;
        document.getElementById('editAlbumCategory').value = album.category;
        document.getElementById('editAlbumDesc').value = album.description;
        document.getElementById('editAlbumLink').value = album.link || '';

        // Render tags
        renderEditTags();

        // Render images
        renderPreviewImages();
        renderGalleryImages();

        // Show modal
        editModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    // Close Edit Modal
    function closeEditModal() {
        if (!editModal) return;
        editModal.classList.remove('active');
        document.body.style.overflow = '';
        currentEditAlbum = null;
    }

    // Render Edit Tags
    function renderEditTags() {
        const wrapper = document.getElementById('tagsWrapper');
        const tagInput = document.getElementById('tagInput');

        // Clear existing tags
        wrapper.querySelectorAll('.tag-item').forEach(el => el.remove());

        // Add tags before input
        currentEditTags.forEach((tag, index) => {
            const tagEl = document.createElement('span');
            tagEl.className = 'tag-item';
            tagEl.innerHTML = `
                ${tag}
                <button type="button" class="remove-tag" data-index="${index}">&times;</button>
            `;
            wrapper.insertBefore(tagEl, tagInput);
        });

        // Event listeners for remove buttons
        wrapper.querySelectorAll('.remove-tag').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = parseInt(e.target.dataset.index);
                currentEditTags.splice(idx, 1);
                renderEditTags();
            });
        });
    }

    // Tag input handler
    document.getElementById('tagInput')?.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const value = e.target.value.trim();
            if (value && !currentEditTags.includes(value)) {
                currentEditTags.push(value);
                renderEditTags();
            }
            e.target.value = '';
        }
    });

    // Render Preview Images
    function renderPreviewImages() {
        const grid = document.getElementById('previewImagesGrid');
        if (!grid) return;

        grid.innerHTML = currentEditPreviews.map((src, index) => `
            <div class="edit-image-item">
                <img src="${src}" alt="Preview ${index + 1}">
                <button type="button" class="remove-image" data-type="preview" data-index="${index}">&times;</button>
            </div>
        `).join('');

        // Event listeners for remove buttons
        grid.querySelectorAll('.remove-image').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = parseInt(e.target.dataset.index);
                currentEditPreviews.splice(idx, 1);
                renderPreviewImages();
            });
        });
    }

    // Render Gallery Images
    function renderGalleryImages() {
        const grid = document.getElementById('galleryImagesGrid');
        if (!grid) return;

        grid.innerHTML = currentEditGallery.map((item, index) => `
            <div class="edit-image-item">
                <img src="${item.src}" alt="${item.caption}">
                <button type="button" class="remove-image" data-type="gallery" data-index="${index}">&times;</button>
            </div>
        `).join('');

        // Event listeners for remove buttons
        grid.querySelectorAll('.remove-image').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = parseInt(e.target.dataset.index);
                currentEditGallery.splice(idx, 1);
                renderGalleryImages();
            });
        });
    }

    // File input handlers
    document.getElementById('previewFileInput')?.addEventListener('change', (e) => {
        handleFileSelect(e.target.files, 'preview');
    });

    document.getElementById('galleryFileInput')?.addEventListener('change', (e) => {
        handleFileSelect(e.target.files, 'gallery');
    });

    // Handle file selection, compress, and convert to base64
    function handleFileSelect(files, type) {
        if (!files || !files.length) return;

        Array.from(files).forEach(file => {
            const reader = new FileReader();
            reader.onload = (e) => {
                // Compress image using canvas
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const MAX_SIZE = 800; // Max width or height
                    let width = img.width;
                    let height = img.height;

                    // Resize if too large
                    if (width > MAX_SIZE || height > MAX_SIZE) {
                        if (width > height) {
                            height = Math.round(height * (MAX_SIZE / width));
                            width = MAX_SIZE;
                        } else {
                            width = Math.round(width * (MAX_SIZE / height));
                            height = MAX_SIZE;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);

                    // Convert to compressed JPEG (quality 0.7)
                    const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7);

                    if (type === 'preview') {
                        currentEditPreviews.push(compressedDataUrl);
                        renderPreviewImages();
                    } else {
                        const caption = file.name.replace(/\.[^.]+$/, '').replace(/-|_/g, ' ');
                        currentEditGallery.push({ src: compressedDataUrl, caption: caption });
                        renderGalleryImages();
                    }
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        });
    }

    // Save Album Button
    // Save Album Button
    document.getElementById('saveAlbumBtn')?.addEventListener('click', () => {
        if (!currentEditAlbum) return;

        const albumId = document.getElementById('editAlbumId').value;
        let albumIndex = albums.findIndex(a => a.id === albumId);

        const newAlbumData = {
            id: albumId,
            title: document.getElementById('editAlbumTitle').value || 'Untitled',
            category: document.getElementById('editAlbumCategory').value || 'Uncategorized',
            description: document.getElementById('editAlbumDesc').value || '',
            link: document.getElementById('editAlbumLink').value || null,
            tech: [...currentEditTags],
            previews: currentEditPreviews.length > 0 ? [...currentEditPreviews] : [
                'https://via.placeholder.com/400x300/1a1a2e/e85a4f?text=No+Image'
            ],
            items: currentEditGallery.length > 0 ? [...currentEditGallery] : [
                { src: 'https://via.placeholder.com/600x400/1a1a2e/e85a4f?text=No+Image', caption: 'No Image' }
            ]
        };

        if (albumIndex !== -1) {
            // Update existing
            albums[albumIndex] = newAlbumData;
        } else {
            // Create new
            albums.push(newAlbumData);
        }

        saveAlbums();
        renderAlbums();
        closeEditModal();
        showToast('Album berhasil disimpan!');
    });

    // Delete Album Button
    document.getElementById('deleteAlbumBtn')?.addEventListener('click', () => {
        if (!currentEditAlbum) return;

        if (confirm(`Hapus album "${currentEditAlbum.title}"? Tindakan ini tidak bisa dibatalkan.`)) {
            const albumIndex = albums.findIndex(a => a.id === currentEditAlbum.id);
            if (albumIndex !== -1) {
                albums.splice(albumIndex, 1);
                saveAlbums();
                renderAlbums();
                closeEditModal();
                showToast('Album berhasil dihapus!');
            }
        }
    });

    // Close edit modal button
    document.getElementById('editModalClose')?.addEventListener('click', closeEditModal);
    editModal?.addEventListener('click', (e) => {
        if (e.target === editModal) closeEditModal();
    });

    // CMS: Add Album Button - Opens edit modal for new album
    addAlbumBtn?.addEventListener('click', () => {
        const newAlbum = {
            id: `album-${Date.now()}`,
            title: 'Album Baru',
            category: 'Kategori',
            description: 'Deskripsi album baru...',
            tech: ['Tag 1'],
            link: null,
            previews: [
                'https://via.placeholder.com/400x300/1a1a2e/e85a4f?text=New+Album'
            ],
            items: [
                { src: 'https://via.placeholder.com/600x400/1a1a2e/e85a4f?text=New+Image', caption: 'Gambar Baru' }
            ]
        };

        albums.push(newAlbum);
        saveAlbums();
        renderAlbums();

        // Open edit modal for the new album
        openEditModal(newAlbum);
        showToast('Album baru ditambahkan! Silakan lengkapi data.');
    });

    // Save albums to localStorage with error handling
    function saveAlbums() {
        try {
            localStorage.setItem('async_albums', JSON.stringify(albums));
            return true;
        } catch (e) {
            console.error('Error saving albums:', e);
            if (e.name === 'QuotaExceededError' || e.message.includes('quota')) {
                showToast('❌ Penyimpanan penuh! Kurangi jumlah/ukuran gambar.');
            } else {
                showToast('❌ Gagal menyimpan: ' + e.message);
            }
            return false;
        }
    }

    // Initial render
    renderAlbums();
}



/* ============================================
   Tracking System (Dedicated Page)
   ============================================ */
function initTrackingSystem() {
    const trackInput = document.getElementById('trackInput');
    const trackActionBtn = document.getElementById('trackBtn');
    const resultDiv = document.getElementById('trackingResult');

    // Only run if elements exist (e.g. on tracking.html)
    if (!trackInput || !trackActionBtn) return;

    // Helper to format currency
    const formatIDR = (num) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(num);
    };

    const handleTrack = async () => {
        const id = trackInput.value.trim();
        if (!id) {
            resultDiv.innerHTML = '<p style="color:#e74c3c; text-align:center;">Mohon masukkan Order ID</p>';
            return;
        }

        trackActionBtn.innerHTML = 'Mencari...';
        trackActionBtn.disabled = true;
        resultDiv.innerHTML = '';

        try {
            // Query Firestore
            const q = query(collection(db, "orders"), where("id", "==", id));
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                resultDiv.innerHTML = `
                    <div class="tracking-status" style="text-align:center; color: #e74c3c; background: rgba(231, 76, 60, 0.1); padding: 20px; border-radius: 12px;">
                        ❌ <strong>Order ID Tidak Ditemukan</strong><br>
                        <span style="font-size:14px; opacity:0.8; display:block; margin-top:4px;">Periksa kembali ID Anda (Contoh: ASY-2605...)</span>
                    </div>
                `;
                trackActionBtn.innerHTML = 'Cek Status';
                trackActionBtn.disabled = false;
                return;
            }

            querySnapshot.forEach((doc) => {
                const data = doc.data();
                const statusLabels = {
                    'pending': { text: 'Menunggu Verifikasi', icon: '⏳', color: 'var(--warning)' },
                    'proses': { text: 'Sedang Dikerjakan', icon: '🔨', color: 'var(--info)' },
                    'selesai': { text: 'Selesai & Dikirim', icon: '✅', color: 'var(--success)' },
                    'batal': { text: 'Dibatalkan', icon: '❌', color: 'var(--danger)' }
                };

                const statusKey = data.status || 'pending';
                const statusObj = statusLabels[statusKey] || statusLabels['pending'];

                // Percentage
                let progress = 10;
                if (statusKey === 'proses') progress = 50;
                if (statusKey === 'selesai') progress = 100;
                if (statusKey === 'batal') progress = 0;

                resultDiv.innerHTML = `
                    <div class="tracking-status" style="animation: fadeIn 0.5s ease;">
                        <div style="text-align:center; margin-bottom:24px;">
                            <div style="font-size:48px; margin-bottom:16px;">${statusObj.icon}</div>
                            <h3 style="color:${statusObj.color}; margin-bottom:8px;">${statusObj.text}</h3>
                            <p style="color:var(--text-secondary);">${data.namaBisnis}</p>
                        </div>
                        
                        <div style="background:rgba(255,255,255,0.05); padding:20px; border-radius:12px; margin-bottom:24px;">
                            <div style="display:flex; justify-content:space-between; margin-bottom:8px; font-size:14px;">
                                <span style="color:var(--text-muted);">Layanan</span>
                                <span style="font-weight:600;">${data.pilarLayanan}</span>
                            </div>
                            <div style="display:flex; justify-content:space-between; margin-bottom:8px; font-size:14px;">
                                <span style="color:var(--text-muted);">Tanggal Order</span>
                                <span>${data.date}</span>
                            </div>
                            <div style="display:flex; justify-content:space-between; font-size:14px;">
                                <span style="color:var(--text-muted);">Estimasi</span>
                                <span>${data.deadline}</span>
                            </div>
                        </div>

                        <!-- Progress Bar -->
                        <div style="position:relative; margin-bottom:8px;">
                            <div style="width:100%; height:8px; background:rgba(255,255,255,0.1); border-radius:10px; overflow:hidden;">
                                <div style="width:${progress}%; height:100%; background:var(--gradient-primary); border-radius:10px; transition:width 1s ease;"></div>
                            </div>
                        </div>
                        <p style="text-align:right; font-size:12px; color:var(--sage);">${progress}% Completed</p>
                    </div>
                `;
            });

        } catch (error) {
            console.error("Error tracking:", error);
            resultDiv.innerHTML = '<p style="color:#e74c3c; text-align:center;">Terjadi kesalahan koneksi.</p>';
        } finally {
            trackActionBtn.innerHTML = 'Cek Status';
            trackActionBtn.disabled = false;
        }
    };

    trackActionBtn.addEventListener('click', handleTrack);
    trackInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleTrack();
    });
}

/* ==========================================================================
   INTERACTIVE PORTFOLIO LOGIC (DESIGN & SYSTEMS)
   ========================================================================== */

const systemData = [
    {
        id: "sys-1",
        title: "Company Profile & Landing Page",
        category: "front-facing",
        categoryLabel: "Front-Facing",
        icon: "🌐",
        price: "Rp 2.500.000",
        estimation: "1 - 1.5 Bulan",
        desc: "Situs web representatif premium yang berfungsi sebagai wajah digital perusahaan dan alat penangkap prospek (lead generation) berkonversi tinggi.",
        features: [
            "Desain antarmuka (UI/UX) modern & responsif",
            "Integrasi formulir kontak langsung ke WhatsApp admin",
            "Optimasi performa & SEO teknis tingkat dasar"
        ]
    },
    {
        id: "sys-2",
        title: "Sistem E-Commerce & Toko Online",
        category: "commerce",
        categoryLabel: "Commerce",
        icon: "🛒",
        price: "Rp 5.500.000",
        estimation: "1.5 - 2 Bulan",
        desc: "Platform penjualan digital independen untuk skalabilitas bisnis Anda, dengan kontrol penuh atas data pelanggan dan transaksi tanpa potongan marketplace.",
        features: [
            "Manajemen katalog produk & keranjang belanja",
            "Integrasi payment gateway (BCA, QRIS, dll)",
            "Kalkulasi ongkos kirim otomatis terintegrasi kurir lokal"
        ]
    },
    {
        id: "sys-3",
        title: "Point of Sale (POS) & Kasir",
        category: "commerce",
        categoryLabel: "Commerce",
        icon: "🧾",
        price: "Rp 3.500.000",
        estimation: "1.5 - 2 Bulan",
        desc: "Solusi operasional ritel cerdas yang memadukan kecepatan transaksi kasir (O2O) dengan pelacakan pergerakan stok secara instan.",
        features: [
            "Sistem transaksi kasir cepat berbasis web/cloud",
            "Pelacakan stok barang real-time antar cabang",
            "Otomatisasi laporan harian, laba-rugi, dan shift"
        ]
    },
    {
        id: "sys-4",
        title: "Sistem Reservasi & Booking",
        category: "commerce",
        categoryLabel: "Commerce",
        icon: "📅",
        price: "Rp 3.000.000",
        estimation: "1.5 Bulan",
        desc: "Automatisasi alur penjadwalan cerdas untuk bisnis jasa (klinik, salon, penyewaan, hotel) guna mencegah bentrok jadwal.",
        features: [
            "Kalender ketersediaan interaktif secara real-time",
            "Notifikasi pengingat otomatis via WhatsApp/Email",
            "Manajemen jadwal staf dan kapasitas layanan"
        ]
    },
    {
        id: "sys-5",
        title: "Web App & Dashboard Admin",
        category: "internal-systems",
        categoryLabel: "Internal Systems",
        icon: "📈",
        price: "Rp 6.000.000",
        estimation: "2 - 3 Bulan",
        desc: "Pusat kendali operasional digital untuk memantau metrik bisnis kunci, mengelola data internal, dan mengambil keputusan berbasis data.",
        features: [
            "Visualisasi data komprehensif (Grafik interaktif)",
            "Manajemen peran & hak akses berlapis (RBAC)",
            "Sistem audit log dan pencatatan aktivitas pengguna"
        ]
    },
    {
        id: "sys-6",
        title: "Sistem Manajemen (ERP Lite)",
        category: "internal-systems",
        categoryLabel: "Internal Systems",
        icon: "⚙️",
        price: "Rp 8.500.000",
        estimation: "3 - 4 Bulan",
        desc: "Perangkat lunak terpusat untuk mendigitalisasi operasi internal perusahaan, mulai dari SDM, manajemen proyek, hingga arus kas.",
        features: [
            "Modul HRIS: Absensi digital & manajemen karyawan",
            "Penugasan & pelacakan status proyek (Kanban Board)",
            "Pemantauan kesehatan metrik operasional harian"
        ]
    },
    {
        id: "sys-7",
        title: "Sistem Informasi Akademik (SIAKAD)",
        category: "govtech",
        categoryLabel: "EdTech",
        icon: "🎓",
        price: "Rp 7.000.000",
        estimation: "3 - 4 Bulan",
        desc: "Platform manajemen pendidikan terpadu untuk sekolah atau institusi yang mengatur data siswa, nilai, jadwal pelajaran, hingga absensi.",
        features: [
            "Portal terpisah untuk Siswa, Guru, dan Admin",
            "Manajemen rapor online dan e-learning dasar",
            "Integrasi absensi kehadiran realtime"
        ]
    },
    {
        id: "sys-8",
        title: "Sistem Manajemen Klinik Dasar",
        category: "internal-systems",
        categoryLabel: "HealthTech",
        icon: "🏥",
        price: "Rp 5.000.000",
        estimation: "2 - 3 Bulan",
        desc: "Digitalisasi rekam medis dan antrean pasien untuk fasilitas kesehatan guna mempercepat pelayanan dan akurasi riwayat medis.",
        features: [
            "Pencatatan Rekam Medis Elektronik (RME)",
            "Sistem antrean poli dan farmasi",
            "Manajemen stok obat dan resep dokter"
        ]
    },
    {
        id: "sys-9",
        title: "Sistem Khusus (Custom Development)",
        category: "custom",
        categoryLabel: "Custom",
        icon: "💻",
        price: "Hubungi Admin",
        estimation: "Fleksibel (Min. 2 Bulan)",
        desc: "Tidak menemukan solusi yang pas? Klien dapat sepenuhnya mengkustomisasi sistem yang ingin dibuat sesuai alur bisnis yang unik. Hubungi nomor Admin Konsultan kami untuk merancang arsitektur eksklusif Anda.",
        features: [
            "Analisis dan konsultasi kebutuhan bisnis secara mendalam",
            "Arsitektur database dan logika sistem yang sepenuhnya disesuaikan",
            "Konsultasi langsung via WhatsApp dengan Lead Developer"
        ]
    }
];

const allPortfolioData = [...systemData];

// Generic function to initialize an interactive grid (Compact Square Cards)
function initInteractiveGrid(gridId, tabsClass, dataArray) {
    const grid = document.getElementById(gridId);
    if (!grid) return;
    const tabs = document.querySelectorAll(`.${tabsClass}`);
    
    // Change class to grid container for styling
    grid.className = 'compact-grid animate-on-scroll visible';

    function renderCards(filter) {
        grid.innerHTML = '';
        const filteredData = filter === 'all' 
            ? dataArray 
            : dataArray.filter(item => item.category === filter);

        filteredData.forEach(item => {
            const card = document.createElement('div');
            card.className = 'compact-card';
            
            // On click, it opens the simplified modal
            card.onclick = () => openPortfolioModal(item.id);

            card.innerHTML = `
                <div class="compact-icon-wrapper">
                    <span class="compact-icon">${item.icon}</span>
                </div>
                <h3 class="compact-title">${item.title}</h3>
                <div style="flex-grow: 1;"></div>
                <button class="compact-detail-btn">
                    <span>Klik Detail</span>
                </button>
            `;
            grid.appendChild(card);
        });
    }

    // Initial Render
    renderCards('all');

    // Tab Click Logic
    tabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            tabs.forEach(t => t.classList.remove('active'));
            e.target.classList.add('active');
            const filter = e.target.getAttribute('data-filter');
            renderCards(filter);
        });
    });
}

function initInteractivePortfolio() {
    // Initialize portfolio grid
    initInteractiveGrid('portfolioGrid', 'portfolio-tab', systemData);

    // Setup Shared Modal Listeners
    const modal = document.getElementById('portfolioModal');
    const closeBtn = document.getElementById('closePortfolioModal');
    const backBtn = document.getElementById('modalBackBtn');
    
    if (closeBtn) closeBtn.addEventListener('click', closePortfolioModal);
    if (backBtn) backBtn.addEventListener('click', closePortfolioModal);
    
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal || e.target.classList.contains('modal-backdrop')) {
                closePortfolioModal();
            }
        });
    }
}

function openPortfolioModal(id) {
    const modal = document.getElementById('portfolioModal');
    if (!modal) return;
    
    const data = allPortfolioData.find(item => item.id === id);
    if (!data) return;

    // Populate Modal
    document.getElementById('modalTitle').textContent = data.title;
    document.getElementById('modalCategory').textContent = data.categoryLabel;
    document.getElementById('modalDesc').textContent = data.desc;
    
    const estEl = document.getElementById('modalEstimation');
    if (estEl) {
        estEl.textContent = data.estimation || "1 Bulan";
    }
    
    const priceEl = document.getElementById('modalPrice');
    if (priceEl) {
        priceEl.textContent = data.price;
    }
    
    // Features List
    const featUl = document.getElementById('modalFeatures');
    featUl.innerHTML = data.features.map(f => `<li>${f}</li>`).join('');

    // Update demo link based on title
    const demoBtn = document.getElementById('modalDemoBtn');
    if (demoBtn) {
        const waText = `Halo ASYNC SOLUTIONS, saya tertarik dengan ${data.title}. Boleh saya minta informasi lebih lanjut?`;
        demoBtn.href = `https://wa.me/6285729715555?text=${encodeURIComponent(waText)}`;
    }

    // Open Modal
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closePortfolioModal() {
    const modal = document.getElementById('portfolioModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
    }
}

// Execute Initialization after all declarations
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp(); // DOM already ready
}
