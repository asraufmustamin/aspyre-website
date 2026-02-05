/* ============================================
   ASPYRE.AI - Premium Agency Scripts
   ============================================ */
// Import Firebase SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy, serverTimestamp, deleteDoc, doc, updateDoc } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

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

document.addEventListener('DOMContentLoaded', () => {
    // Clear old CMS data if version mismatch
    const CMS_VERSION = 'v2.0';
    if (localStorage.getItem('cmsVersion') !== CMS_VERSION) {
        localStorage.removeItem('aspyreCmsContent');
        localStorage.setItem('cmsVersion', CMS_VERSION);
    }

    initMobileMenu();
    initSmoothScroll();
    initScrollAnimations();
    initOrderForm();
    initLanguageToggle();
    initDynamicCategories();
    initAdminModal();
    initMagneticButtons();
    initProjectModal();
    loadCmsContent();
    initCmsMode();
});

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

        // Special handling for Admin Trigger
        if (link.classList.contains('admin-trigger')) {
            e.preventDefault();
            menu.classList.remove('active');
            toggle.classList.remove('active');
            document.body.style.overflow = '';

            // Reset hamburger icon
            const spans = toggle.querySelectorAll('span');
            spans[0].style.transform = '';
            spans[1].style.transform = '';

            // Trigger CMS mode directly
            enableCmsModeFunc();
            return;
        }

        // Special handling for Admin Panel Button
        if (link.classList.contains('admin-panel-btn')) {
            e.preventDefault();

            // 1. Close Menu Visually
            menu.classList.remove('active');
            toggle.classList.remove('active');

            // Reset hamburger icon
            const spans = toggle.querySelectorAll('span');
            spans[0].style.transform = '';
            spans[1].style.transform = '';

            // 2. Open Admin Modal DIRECTLY
            const adminModal = document.getElementById('adminModal');
            if (adminModal) {
                adminModal.classList.add('active');
                // Ensure overflow is hidden for modal
                document.body.style.overflow = 'hidden';
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

            // Success Logic (WhatsApp redirect) follows...
            // Triggering next step manually through code flow

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

    const ADMIN_USER = 'aspyre.ai';
    const ADMIN_PASS = 'theaspyreai22';

    let currentCategory = 'all';
    let unsubscribe = null;
    let latestOrders = [];

    // Open Modal
    triggers.forEach(trigger => {
        if (trigger) {
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
                if (sessionStorage.getItem('aspyre_admin') === 'true') {
                    showDashboard();
                }
            });
        }
    });

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
        dashboardView.style.display = 'none';
        loginView.style.display = 'block';
        loginForm.reset();
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
            loadOrders(currentCategory);
        });
    });

    // Refresh & Clear
    refreshBtn.addEventListener('click', () => {
        refreshBtn.classList.add('spin');
        setTimeout(() => refreshBtn.classList.remove('spin'), 1000);
    });

    clearBtn.style.display = 'none'; // Hide clear button for safety

    // Enable CMS Mode
    enableCmsBtn.addEventListener('click', () => {
        enableCmsModeFunc();
        closeModal();
    });

    // Save CMS
    saveCmsBtn.addEventListener('click', () => {
        saveCmsContent();
        showToast('Semua konten berhasil disimpan!');
    });

    // Reset CMS
    resetCmsBtn.addEventListener('click', () => {
        if (confirm('Reset semua konten ke default? Perubahan yang belum disimpan akan hilang.')) {
            localStorage.removeItem('aspyre_cms');
            location.reload();
        }
    });

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

    function showDashboard() {
        loginView.style.display = 'none';
        dashboardView.style.display = 'block';
        setupRealtimeListener();
    }

    function setupRealtimeListener() {
        if (unsubscribe) return; // Already listening

        const q = query(collection(db, "orders"), orderBy("timestamp", "desc"));
        unsubscribe = onSnapshot(q, (snapshot) => {
            const orders = [];
            snapshot.forEach((doc) => {
                orders.push({ id: doc.id, docId: doc.id, ...doc.data() }); // docId for deletion
            });
            latestOrders = orders; // Update global store
            updateStats(orders);
            renderOrders(orders);
        }, (error) => {
            console.error("Error getting realtime update:", error);
        });
    }

    function updateStats(orders) {
        document.getElementById('statTotal').textContent = orders.length;

        const urgent = orders.filter(o => {
            if (!o.deadline) return false;
            const remaining = calculateRemainingTime(o.deadline);
            return remaining.hours >= 0 && remaining.hours < 24;
        }).length;
        document.getElementById('statUrgent').textContent = urgent;

        const todayDate = new Date().toISOString().split('T')[0];
        const todayOrders = orders.filter(o => o.createdAt && o.createdAt.startsWith(todayDate)).length;
        document.getElementById('statToday').textContent = todayOrders;
    }

    function renderOrders(orders) {
        const listEl = document.getElementById('adminOrdersList');

        let filtered = orders;
        if (currentCategory !== 'all') {
            filtered = orders.filter(o => {
                return (o.pilarLayanan === currentCategory) || (o.category === currentCategory);
            });
        }

        if (filtered.length === 0) {
            listEl.innerHTML = `<div class="admin-empty-compact"><p>📭 Tidak ada order</p></div>`;
            return;
        }

        listEl.innerHTML = filtered.map((order) => {
            const remaining = calculateRemainingTime(order.deadline || new Date().toISOString().split('T')[0]);
            const isUrgent = remaining.hours >= 0 && remaining.hours < 24;
            const priorityClass = getPriorityClass(remaining.hours);
            const waNumber = order.whatsapp ? order.whatsapp.replace(/\D/g, '').replace(/^0/, '62') : '';
            const waLink = waNumber ? `https://wa.me/${waNumber}` : '#';

            return `
                <div class="order-row ${isUrgent ? 'urgent' : ''}">
                    <div class="order-priority ${priorityClass}"></div>
                    <span class="order-id">${order.id || 'N/A'}</span>
                    <span class="order-name">${order.namaBisnis || 'Tanpa Nama'}</span>
                    <span class="order-time ${remaining.hours < 24 ? 'urgent' : ''}">${remaining.text}</span>
                    <div class="order-actions">
                        <button class="view" title="View" onclick="viewOrder('${order.id}')">👁️</button>
                        <button class="delete" title="Delete" onclick="deleteOrder('${order.docId}', '${order.id}')">🗑️</button>
                    </div>
                </div>
            `;
        }).join('');
    }

    window.viewOrder = function (id) {
        const order = latestOrders.find(o => o.id === id);
        if (order) {
            const pilars = { 'creative': 'Creative Design', 'systems': 'Web & Systems', 'data': 'Data Services' };
            const pilarTxt = pilars[order.pilarLayanan] || order.pilarLayanan || '-';
            const kategoriTxt = order.kategoriLayanan || '-';
            alert(`📋 Order: ${order.id}\n\n🏷️ Nama: ${order.namaBisnis}\n📝 Deskripsi: ${order.tentangBisnis}\n🎯 ${pilarTxt} - ${kategoriTxt}\n📅 Deadline: ${order.deadline}\n💰 Budget: ${order.budget || 'Belum ditentukan'}`);
        }
    };

    window.deleteOrder = async function (docId, displayId) {
        if (confirm(`Hapus order ${displayId}? Tindakan ini permanen di Database.`)) {
            try {
                await deleteDoc(doc(db, "orders", docId));
                showToast(`Order ${displayId} dihapus.`);
            } catch (e) {
                console.error(e);
                alert('Gagal menghapus: ' + e.message);
            }
        }
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
let cmsModified = {};

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
        indicator.classList.remove('visible');
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

    cmsModified = {};
    showToast('CMS Mode dinonaktifkan.');
}

/* ============================================
   CMS Save/Load Functions
   ============================================ */
function loadCmsContent() {
    const cmsData = JSON.parse(localStorage.getItem('aspyre_cms') || '{}');

    Object.keys(cmsData).forEach(key => {
        const el = document.querySelector(`[data-key="${key}"]`);
        if (el) {
            el.textContent = cmsData[key];
        }
    });
}

function saveCmsContent() {
    const cmsData = JSON.parse(localStorage.getItem('aspyre_cms') || '{}');

    // Get all current editable content
    document.querySelectorAll('.editable[data-key]').forEach(el => {
        cmsData[el.dataset.key] = el.textContent;
    });

    localStorage.setItem('aspyre_cms', JSON.stringify(cmsData));

    // Clear modified markers
    document.querySelectorAll('.editable.modified').forEach(el => {
        el.classList.remove('modified');
    });

    cmsModified = {};
}

/* ============================================
   Language Toggle
   ============================================ */
function initLanguageToggle() {
    const toggle = document.querySelector('.lang-toggle');
    if (!toggle) return;

    let currentLang = 'id';

    toggle.addEventListener('click', () => {
        currentLang = currentLang === 'id' ? 'en' : 'id';
        const spans = toggle.querySelectorAll('span:not(.divider)');
        spans.forEach(span => {
            span.classList.remove('active');
            if (span.textContent === currentLang.toUpperCase()) {
                span.classList.add('active');
            }
        });
        showToast(currentLang === 'en' ? 'Switched to English' : 'Beralih ke Bahasa Indonesia');
    });
}

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
    let albums = JSON.parse(localStorage.getItem('aspyre_albums')) || albumsData;

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
                    ${album.previews.slice(0, 3).map((src, i) => `
                        <div class="preview-image">
                            <img src="${src}" alt="${album.title} preview ${i + 1}" loading="lazy">
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
                const pageCount = Math.ceil(albums.length / 4);
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
        const gap = 28;
        const scrollAmount = page * (cardWidth * 2 + gap * 2);
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

// Update DOMContentLoaded to use new function
document.addEventListener('DOMContentLoaded', () => {
    // Remove old initProjectModal call and add new one
    // This is handled by the initialization at the top of the file
});

// Add initPortfolioAlbums to the init chain (call after DOMContentLoaded)
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPortfolioAlbums);
} else {
    initPortfolioAlbums();
}
