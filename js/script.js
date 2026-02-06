/* ============================================
   ASPYRE.AI - Premium Agency Scripts
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
        const CMS_VERSION = 'v2.0';
        if (localStorage.getItem('cmsVersion') !== CMS_VERSION) {
            localStorage.removeItem('aspyreCmsContent');
            localStorage.setItem('cmsVersion', CMS_VERSION);
        }

        // FORCE RESET PORTFOLIO DATA (Once per session)
        if (!sessionStorage.getItem('portfolio_init_v6')) {
            console.log("Portfolio: Session boot v6 - clearing potentially stale cache");
            localStorage.removeItem('aspyre_albums');
            sessionStorage.setItem('portfolio_init_v6', 'true');
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
                    localStorage.setItem('aspyreLang', newLang);
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

                // Use the shared function
                if (window.aspyreShowDashboard) {
                    window.aspyreShowDashboard();
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

    // Listeners installed at top.
};

// Execute Initialization
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp(); // DOM already ready
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
            if (adminModal) {
                adminModal.classList.add('active');
                document.body.style.overflow = 'hidden';

                // If already logged in, show dashboard directly
                if (sessionStorage.getItem('aspyre_admin') === 'true' && window.aspyreShowDashboard) {
                    window.aspyreShowDashboard();
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
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (target) {
                const offset = document.body.classList.contains('cms-mode') ? 128 : 80;
                const position = target.offsetTop - offset;
                window.scrollTo({ top: position, behavior: 'smooth' });

                // Highlight section briefly
                target.classList.add('highlight-section');
                setTimeout(() => target.classList.remove('highlight-section'), 1000);
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
        'hero-eyebrow': 'Partner Kreatif Bisnis Anda',
        'hero-title': 'Desain <span class="highlight">Premium</span> untuk Bisnis yang <span class="highlight">Serius</span>',
        'hero-desc': 'Kami membantu bisnis tampil profesional dengan desain yang memorable, website yang powerful, dan data yang terkelola rapi.',
        'hero-cta-1': 'Mulai Project',
        'hero-cta-2': 'Konsultasi Gratis',
        'nav-layanan': 'Layanan',
        'nav-paket': 'Paket',
        'nav-proses': 'Cara Kerja',
        'nav-testimoni': 'Testimoni',
        'nav-faq': 'FAQ',
        'nav-projects': 'Projects',
        'nav-kontak': 'Kontak',
        'nav-cta': 'Mulai Project',
        'paket-label': 'Pilihan Paket',
        'paket-title': 'Investasi untuk Pertumbuhan Bisnis',
        'projects-label': 'Portfolio',
        'projects-title': 'Karya Kami',
        'proses-label': 'Cara Kerja',
        'proses-title': 'Proses Mudah & Transparan'
    },
    'en': {
        'hero-eyebrow': 'Your Creative Business Partner',
        'hero-title': '<span class="highlight">Premium</span> Design for <span class="highlight">Serious</span> Business',
        'hero-desc': 'We help businesses look professional with memorable designs, powerful websites, and well-organized data.',
        'hero-cta-1': 'Start Project',
        'hero-cta-2': 'Free Consultation',
        'nav-layanan': 'Services',
        'nav-paket': 'Packages',
        'nav-proses': 'How It Works',
        'nav-testimoni': 'Testimonials',
        'nav-faq': 'FAQ',
        'nav-projects': 'Projects',
        'nav-kontak': 'Contact',
        'nav-cta': 'Start Project',
        'paket-label': 'Our Packages',
        'paket-title': 'Investment for Business Growth',
        'projects-label': 'Portfolio',
        'projects-title': 'Our Work',
        'proses-label': 'How It Works',
        'proses-title': 'Easy & Transparent Process'
    }
};

function initLanguageToggle() {
    const toggle = document.querySelector('.lang-toggle');
    if (!toggle) return;

    // Get current language from localStorage or default to 'id'
    let currentLang = localStorage.getItem('aspyreLang') || 'id';

    // Apply current language on load
    applyLanguage(currentLang);
    updateToggleUI(toggle, currentLang);

    // Toggle click handler
    toggle.addEventListener('click', () => {
        currentLang = currentLang === 'id' ? 'en' : 'id';
        localStorage.setItem('aspyreLang', currentLang);
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
    localStorage.setItem('aspyreLang', lang);
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
        ],
        'data': [
            { value: 'entry', label: 'Jasa Entri Data' },
            { value: 'digitalisasi', label: 'Digitalisasi Dokumen' },
            { value: 'rekap', label: 'Rekap & Reporting' },
            { value: 'cleaning', label: 'Data Cleaning' }
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

        // Prepare Firestore Data
        const orderData = {
            id: orderId, // Keep readable ID
            ...data,
            createdAt: new Date().toISOString(),
            date: new Date().toLocaleDateString('id-ID'),
            timestamp: serverTimestamp(), // Firebase Server Timestamp
            status: 'pending'
        };

        const submitBtn = form.querySelector('.form-submit');
        const originalContent = submitBtn.innerHTML;
        submitBtn.innerHTML = `<span>Menyimpan...</span>`;
        submitBtn.disabled = true;

        try {
            // Push to Firebase
            await addDoc(collection(db, "orders"), orderData);

            // Success Feedback
            submitBtn.innerHTML = "✅ Terkirim!";

            // Format WhatsApp Message
            const pilars = { 'creative': 'Creative Design', 'systems': 'Web & Systems', 'data': 'Data Services' };
            const pilarTxt = pilars[data.pilarLayanan] || data.pilarLayanan;

            const text = `Halo ASPYRE, saya ingin order project baru:%0A%0A` +
                `📋 *PROJECT ORDER* (${orderId})%0A` +
                `👤 Nama/Bisnis: ${data.namaBisnis}%0A` +
                `📱 WhatsApp: ${data.userPhone}%0A` +
                `🎯 Layanan: ${pilarTxt} - ${data.kategoriLayanan}%0A` +
                `📝 Deskripsi: ${data.tentangBisnis}%0A` +
                `📅 Deadline: ${data.deadline}%0A` +
                `💰 Budget: ${data.budget}`;

            // Redirect immediately (better for mobile)
            const waUrl = `https://wa.me/6285729715555?text=${text}`;

            // Allow simplified UI update before redirect
            form.reset();
            submitBtn.innerHTML = originalContent;
            submitBtn.disabled = false;

            // Navigate
            window.location.href = waUrl;

        } catch (error) {
            console.error(error);
            submitBtn.innerHTML = "Gagal";
            setTimeout(() => { submitBtn.innerHTML = originalContent; submitBtn.disabled = false; }, 2000);
            return;
        }

        // Legacy 'saveOrder' removed.
        // WhatsApp Redirect Logic (Simplified for Success Path)
        // ... handled in try/catch block above.

    });
}


function generateOrderId() {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `ASP-${year}${month}${day}-${random}`;
}

function saveOrder(order) {
    const orders = JSON.parse(localStorage.getItem('aspyre_orders') || '[]');
    orders.push(order);
    localStorage.setItem('aspyre_orders', JSON.stringify(orders));
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

    const ADMIN_USER = 'aspyre.ai';
    const ADMIN_PASS = 'theaspyreai22';

    if (adminUserParam === ADMIN_USER && adminPassParam === ADMIN_PASS) {
        console.log("Admin: Auto-login detected from URL parameters.");
        sessionStorage.setItem('aspyre_admin', 'true');
        modal.classList.add('active');
        showDashboard();
    }

    let currentCategory = 'all';
    let unsubscribe = null;
    let latestOrders = [];

    // Triggers logic moved to Global Listener for better reliability
    /*
    triggers.forEach(trigger => {
        ...
    });
    */

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
            sessionStorage.setItem('aspyre_admin', 'true');
            errorEl.classList.remove('show');
            showDashboard();
        } else {
            errorEl.classList.add('show');
            setTimeout(() => errorEl.classList.remove('show'), 3000);
        }
    });

    // Logout
    logoutBtn.addEventListener('click', () => {
        sessionStorage.removeItem('aspyre_admin');
        if (dashboardView) dashboardView.classList.remove('active');
        if (loginView) loginView.classList.add('active');
        loginForm.reset();
        // Fix: Remove wide mode class
        document.querySelector('.admin-modal-content').classList.remove('dashboard-mode');
        disableCmsMode();
        if (unsubscribe) unsubscribe();
    });

    // Tabs
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            const tabId = tab.dataset.tab;
            tabContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === tabId + 'Tab') {
                    content.classList.add('active');
                }
            });
        });
    });

    // Category filters
    categoryFilters.forEach(filter => {
        filter.addEventListener('click', () => {
            categoryFilters.forEach(f => f.classList.remove('active'));
            filter.classList.add('active');
            currentCategory = filter.dataset.cat;
            renderOrders(latestOrders); // Fix: Call renderOrders directly
        });
    });

    // Refresh & Clear
    refreshBtn.addEventListener('click', () => {
        refreshBtn.classList.add('spin');
        // Actually refresh data by resetting listener
        if (unsubscribe) {
            unsubscribe();
            unsubscribe = null;
        }
        setupRealtimeListener();
        setTimeout(() => refreshBtn.classList.remove('spin'), 1000);
    });

    clearBtn.style.display = 'none'; // Hide clear button for safety

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
                localStorage.removeItem('aspyre_cms');
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
    window.aspyreShowDashboard = showDashboard;

    function showDashboard() {
        console.log("Admin: Transitioning to Dashboard...");
        try {
            if (loginView) loginView.classList.remove('active');
            if (dashboardView) dashboardView.classList.add('active');

            const content = document.querySelector('.admin-modal-content');
            if (content) content.classList.add('dashboard-mode');

            setupRealtimeListener();
        } catch (e) {
            console.error("Admin: Error in showDashboard:", e);
        }
    }

    function setupRealtimeListener() {
        if (unsubscribe) return; // Already listening

        try {
            const q = query(collection(db, "orders"), orderBy("timestamp", "desc"));
            unsubscribe = onSnapshot(q, (snapshot) => {
                const orders = [];
                snapshot.forEach((doc) => {
                    orders.push({ id: doc.id, docId: doc.id, ...doc.data() });
                });
                latestOrders = orders;
                updateStats(orders);
                renderOrders(orders);
            }, (error) => {
                console.error("Firebase Snapshot Error:", error);
            });
        } catch (e) {
            console.error("Firebase Query Error:", e);
        }
    }

    function updateStats(orders) {
        document.getElementById('statTotal').textContent = orders.length;

        const urgent = orders.filter(o => {
            if (!o.deadline) return false;
            // Simple check: is deadline within 3 days?
            const dead = new Date(o.deadline);
            const now = new Date();
            const diffTime = dead - now;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            return diffDays >= 0 && diffDays <= 3;
        }).length;
        document.getElementById('statUrgent').textContent = urgent;

        const todayDate = new Date().toISOString().split('T')[0];
        const todayOrders = orders.filter(o => o.createdAt && o.createdAt.startsWith(todayDate)).length;
        document.getElementById('statToday').textContent = todayOrders;
    }

    function renderOrders(orders) {
        const ordersList = document.getElementById('adminOrdersList');
        if (!ordersList) return;
        ordersList.innerHTML = '';

        let filtered = orders;
        if (currentCategory !== 'all') {
            filtered = orders.filter(o => {
                const pilar = o.pilarLayanan || '';
                const cat = o.kategoriLayanan || '';
                return pilar.includes(currentCategory) || cat.includes(currentCategory);
            });
        }

        if (filtered.length === 0) {
            ordersList.innerHTML = '<p class="no-data" style="text-align:center; padding:40px; color:rgba(255,255,255,0.4);">Belum ada orderan masuk.</p>';
            return;
        }

        // Helper: Parse Date & Calculate Urgency
        const getUrgency = (deadlineStr) => {
            if (!deadlineStr) return { isUrgent: false, days: 999 };
            const dead = new Date(deadlineStr);
            const now = new Date();
            dead.setHours(0, 0, 0, 0);
            now.setHours(0, 0, 0, 0);

            const diffTime = dead - now;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            // Urgent if <= 3 days (include negative for overdue)
            return {
                isUrgent: diffDays <= 3,
                days: diffDays
            };
        };

        // Sort Orders
        filtered.sort((a, b) => {
            const isActiveA = a.status !== 'selesai' && a.status !== 'batal';
            const isActiveB = b.status !== 'selesai' && b.status !== 'batal';

            // Active first
            if (isActiveA && !isActiveB) return -1;
            if (!isActiveA && isActiveB) return 1;

            if (isActiveA) {
                const urgA = getUrgency(a.deadline);
                const urgB = getUrgency(b.deadline);

                // Urgent first
                if (urgA.isUrgent && !urgB.isUrgent) return -1;
                if (!urgA.isUrgent && urgB.isUrgent) return 1;

                // Deadlines (earliest first)
                if (urgA.days !== urgB.days) return urgA.days - urgB.days;
            }
            // Fallback timestamp
            return (b.timestamp?.seconds || 0) - (a.timestamp?.seconds || 0);
        });

        // Create Table Structure
        const tableWrapper = document.createElement('div');
        tableWrapper.className = 'admin-table-wrapper';

        const table = document.createElement('table');
        table.className = 'admin-table';
        table.innerHTML = `
            <thead>
                <tr>
                    <th>Client / Order ID</th>
                    <th>Layanan</th>
                    <th>Deadline</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody id="ordersTableBody"></tbody>
        `;
        tableWrapper.appendChild(table);
        ordersList.appendChild(tableWrapper);

        const tbody = table.querySelector('tbody');

        filtered.forEach(order => {
            const date = order.timestamp ? new Date(order.timestamp.seconds * 1000).toLocaleDateString('id-ID') : order.date;

            const urgency = getUrgency(order.deadline);
            const isUrgent = urgency.isUrgent && (order.status !== 'selesai' && order.status !== 'batal');

            // Sanitize Phone for WhatsApp
            let phone = order.userPhone || '';
            phone = phone.replace(/\D/g, '');
            if (phone.startsWith('0')) phone = '62' + phone.slice(1);
            if (!phone) phone = '6281234567890';

            // Status Colors
            const statusStyles = {
                'pending': 'background: rgba(255,193,7,0.2); color: #ffc107; border:1px solid rgba(255,193,7,0.3)',
                'proses': 'background: rgba(52,152,219,0.2); color: #3498db; border:1px solid rgba(52,152,219,0.3)',
                'selesai': 'background: rgba(46,204,113,0.2); color: #2ecc71; border:1px solid rgba(46,204,113,0.3)',
                'batal': 'background: rgba(231,76,60,0.2); color: #e74c3c; border:1px solid rgba(231,76,60,0.3)'
            };
            const statusStyle = statusStyles[order.status || 'pending'];

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>
                    <div class="client-name">${order.namaBisnis}</div>
                    <span class="order-id-compact">${order.id}</span>
                </td>
                <td>
                    <div style="font-size:13px; margin-bottom:4px;">${order.pilarLayanan}</div>
                    <span class="service-pill">${order.kategoriLayanan}</span>
                </td>
                <td>
                    ${isUrgent ? '<span class="urgent-dot" title="Urgent / Overdue"></span>' : ''}
                    <span style="${isUrgent ? 'color:var(--danger); font-weight:600;' : ''}">${order.deadline}</span>
                    <div style="font-size:11px; opacity:0.5; margin-top:2px;">In: ${date}</div>
                </td>
                <td>
                    <select class="status-select-compact" data-id="${order.docId}" style="${statusStyle}">
                        <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>Pending</option>
                        <option value="proses" ${order.status === 'proses' ? 'selected' : ''}>Proses</option>
                        <option value="selesai" ${order.status === 'selesai' ? 'selected' : ''}>Selesai</option>
                        <option value="batal" ${order.status === 'batal' ? 'selected' : ''}>Batal</option>
                    </select>
                </td>
                <td>
                    <div class="action-buttons">
                        <button class="action-btn btn-view" onclick="window.viewOrderDetails('${order.id}')" title="Lihat Detail">
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                        </button>
                        <button class="action-btn btn-wa" data-phone="${phone}" data-name="${order.namaBisnis}" data-id="${order.id}" title="Hubungi Client">
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                        </button>
                        <button class="action-btn btn-delete" data-id="${order.docId}" data-display-id="${order.id}" title="Hapus">
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                        </button>
                    </div>
                </td>
            `;
            tbody.appendChild(tr);
        });

        // Event Listeners (Status & Delete) - Re-attach
        attachOrderListeners(ordersList);
    }

    function attachOrderListeners(container) {
        // Status Change
        container.querySelectorAll('.status-select-compact').forEach(select => {
            select.addEventListener('change', async (e) => {
                const docId = e.target.dataset.id;
                const newStatus = e.target.value;
                try {
                    await updateDoc(doc(db, "orders", docId), { status: newStatus });
                    // No need to re-render, realtime listener will catch it
                } catch (err) {
                    console.error("Error updates:", err);
                    alert("Gagal update status");
                }
            });
        });

        // WhatsApp Click Logic (Delegated)
        container.querySelectorAll('.btn-wa').forEach(btn => {
            btn.addEventListener('click', (e) => {
                // Find button even if click on SVG
                const button = e.target.closest('.btn-wa');
                const phone = button.dataset.phone;
                const name = button.dataset.name;
                const orderId = button.dataset.id;

                if (!phone || phone === 'undefined' || phone.length < 5) {
                    alert('Nomor WhatsApp tidak valid.');
                    return;
                }

                const text = `Halo ${name}, mengenai order ${orderId}, ada update status...`;
                window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`, '_blank');
            });
        });

        // Delete
        container.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const docId = e.target.dataset.id;
                const displayId = e.target.dataset.displayId;
                if (confirm(`Hapus order ${displayId} permanen?`)) {
                    try {
                        await deleteDoc(doc(db, "orders", docId));
                    } catch (err) {
                        console.error("Error delete:", err);
                        alert("Gagal hapus");
                    }
                }
            });
        });
    }

    // Expose View Function globally
    window.viewOrderDetails = (orderId) => {
        const order = latestOrders.find(o => o.id === orderId);
        if (!order) return;

        // Create or get modal
        let modal = document.getElementById('orderDetailModal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'orderDetailModal';
            modal.className = 'detail-modal';
            document.body.appendChild(modal);

            modal.addEventListener('click', (e) => {
                if (e.target === modal) modal.classList.remove('active');
            });
        }

        modal.innerHTML = `
            <div class="detail-card">
                <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:20px;">
                    <div>
                        <h3 style="margin:0; font-size:20px;">${order.namaBisnis}</h3>
                        <span style="font-family:'Courier New'; opacity:0.6; font-size:14px;">${order.id}</span>
                    </div>
                    <button onclick="document.getElementById('orderDetailModal').classList.remove('active')" style="background:none; border:none; color:white; font-size:24px; cursor:pointer;">&times;</button>
                </div>

                <div style="display:grid; grid-template-columns: 1fr 1fr; gap:16px; margin-bottom:24px;">
                    <div>
                        <label style="display:block; font-size:12px; opacity:0.6; margin-bottom:4px">Layanan</label>
                        <div style="font-weight:500;">${order.pilarLayanan}</div>
                        <div style="font-size:14px; opacity:0.8;">${order.kategoriLayanan}</div>
                    </div>
                    <div>
                        <label style="display:block; font-size:12px; opacity:0.6; margin-bottom:4px">Deadline</label>
                        <div style="font-weight:500; color:var(--coral);">${order.deadline}</div>
                    </div>
                    <div>
                        <label style="display:block; font-size:12px; opacity:0.6; margin-bottom:4px">Budget</label>
                        <div>${order.budget}</div>
                    </div>
                    <div>
                        <label style="display:block; font-size:12px; opacity:0.6; margin-bottom:4px">Kontak</label>
                        <div>${order.userPhone}</div>
                    </div>
                </div>

                <div>
                     <label style="display:block; font-size:12px; opacity:0.6; margin-bottom:8px">Deskripsi Project</label>
                     <div style="background:rgba(255,255,255,0.05); padding:16px; border-radius:8px; font-size:14px; line-height:1.6; max-height:200px; overflow-y:auto;">
                        ${order.tentangBisnis}
                     </div>
                </div>
                
                <div style="margin-top:24px; text-align:right;">
                    <button onclick="document.getElementById('orderDetailModal').classList.remove('active')" class="admin-btn">Tutup</button>
                </div>
            </div>
        `;

        // Show
        setTimeout(() => modal.classList.add('active'), 10);
    };

    function calculateRemainingTime(deadline) {
        const now = new Date();
        const deadlineDate = new Date(deadline + 'T23:59:59');
        const diff = deadlineDate - now;
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const days = Math.floor(hours / 24);

        if (hours < 0) return { hours, text: 'OVERDUE' };
        if (hours < 24) return { hours, text: `${hours}jam` };
        return { hours, text: `${days}hari` };
    }

    function getPriorityClass(hours) {
        if (hours < 0 || hours < 24) return 'p-urgent';
        if (hours < 72) return 'p-warning';
        return 'p-safe';
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

        const docRef = doc(db, "settings", "cms_content");
        await setDoc(docRef, {
            ...content,
            updatedAt: serverTimestamp()
        });

        // Also save to localStorage as cache
        localStorage.setItem('aspyreCmsContent', JSON.stringify(content));
        console.log("CMS Content saved to Firebase!");
        return true;
    } catch (e) {
        console.error("CMS Save Error:", e);
        // Fallback to localStorage only
        const content = {};
        document.querySelectorAll('.editable[data-key]').forEach(el => {
            content[el.dataset.key] = el.innerHTML;
        });
        localStorage.setItem('aspyreCmsContent', JSON.stringify(content));
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
            localStorage.setItem('aspyreCmsContent', JSON.stringify(data));
        } else {
            const saved = localStorage.getItem('aspyreCmsContent');
            if (saved) applyCmsContent(JSON.parse(saved));
        }
    } catch (e) {
        console.error("CMS Load Error:", e);
        const saved = localStorage.getItem('aspyreCmsContent');
        if (saved) applyCmsContent(JSON.parse(saved));
    }
}

function applyCmsContent(data) {
    if (!data) return;
    Object.keys(data).forEach(key => {
        const el = document.querySelector(`[data-key="${key}"]`);
        if (el) el.innerHTML = data[key];
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
                const current = JSON.parse(localStorage.getItem('aspyreCmsContent')) || {};
                current[key] = el.innerHTML;
                localStorage.setItem('aspyreCmsContent', JSON.stringify(current));
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
            title: 'Website Desa Cenrana',
            category: 'Web Platform',
            description: 'Platform digital terintegrasi untuk Desa Cenrana. Memungkinkan warga menyampaikan aspirasi, melihat agenda desa, mengakses layanan UMKM lokal, dan mendapatkan informasi desa secara real-time.',
            tech: ['Next.js', 'Supabase', 'Vercel', 'TailwindCSS'],
            link: 'https://desacenrana.vercel.app',
            previews: [
                'https://via.placeholder.com/400x300/1a1a2e/e85a4f?text=Cenrana+Home',
                'https://via.placeholder.com/400x300/232328/6b9080?text=Aspirasi+Page',
                'https://via.placeholder.com/400x300/2d2d35/f4a261?text=UMKM+Lapak'
            ],
            items: [
                { src: 'https://via.placeholder.com/600x400/1a1a2e/e85a4f?text=Homepage', caption: 'Halaman Utama' },
                { src: 'https://via.placeholder.com/600x400/232328/6b9080?text=Aspirasi', caption: 'Form Aspirasi Warga' },
                { src: 'https://via.placeholder.com/600x400/2d2d35/f4a261?text=UMKM', caption: 'Katalog UMKM Lokal' },
                { src: 'https://via.placeholder.com/600x400/1a1a2e/a4c3b2?text=Agenda', caption: 'Agenda Desa' },
                { src: 'https://via.placeholder.com/600x400/232328/e85a4f?text=Admin', caption: 'Dashboard Admin' },
                { src: 'https://via.placeholder.com/600x400/2d2d35/6b9080?text=Mobile', caption: 'Tampilan Mobile' }
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
            id: 'data-services',
            title: 'Data Management',
            category: 'Data Services',
            description: 'Layanan manajemen data profesional termasuk entri data massal, digitalisasi dokumen, pembuatan laporan, dan pembersihan data dengan akurasi tinggi.',
            tech: ['Excel', 'Google Sheets', 'Data Visualization', 'Automation'],
            link: null,
            previews: [
                'https://via.placeholder.com/400x300/1a1a2e/6b9080?text=Data+Entry',
                'https://via.placeholder.com/400x300/232328/a4c3b2?text=Reports',
                'https://via.placeholder.com/400x300/2d2d35/e85a4f?text=Charts'
            ],
            items: [
                { src: 'https://via.placeholder.com/600x400/1a1a2e/6b9080?text=Spreadsheet', caption: 'Data Entry Project' },
                { src: 'https://via.placeholder.com/600x400/232328/a4c3b2?text=Dashboard', caption: 'Dashboard Report' },
                { src: 'https://via.placeholder.com/600x400/2d2d35/e85a4f?text=Charts', caption: 'Data Visualization' },
                { src: 'https://via.placeholder.com/600x400/1a1a2e/f4a261?text=Cleaning', caption: 'Data Cleaning Result' }
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
        const saved = localStorage.getItem('aspyre_albums');
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
            localStorage.setItem('aspyre_albums', JSON.stringify(albums));
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
                        <span style="font-size:14px; opacity:0.8; display:block; margin-top:4px;">Periksa kembali ID Anda (Contoh: ASP-2402...)</span>
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
