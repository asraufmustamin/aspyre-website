// Portfolio Logic - Firebase Integrated with CMS CRUD
(function initPortfolio() {
    // Default fallback data
    const defaultData = [
        {
            id: 'def-1',
            title: "E-Commerce Fashion Store",
            category: "Web Development",
            desc: "Platform toko online modern dengan fitur cart, checkout, dan admin dashboard.",
            link: "#",
            tags: ["React", "Node.js", "Firebase"],
            images: ["https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=800&q=80"],
            order: 0
        },
        {
            id: 'def-2',
            title: "Coffee Shop Branding",
            category: "Creative Design",
            desc: "Identitas visual lengkap mulai dari logo, menu, hingga packaging.",
            link: "#",
            tags: ["Logo", "Packaging", "Social Media"],
            images: ["https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80"],
            order: 1
        },
        {
            id: 'def-3',
            title: "Corporate Data Analyst Dashboard",
            category: "Data Services",
            desc: "Dashboard interaktif untuk visualisasi data penjualan dan performa tim sales.",
            link: "#",
            tags: ["Tableau", "Python", "SQL"],
            images: ["https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80"],
            order: 2
        },
        {
            id: 'def-4',
            title: "Travel Agency Landing Page",
            category: "Web Development",
            desc: "Landing page high-convert untuk agen travel dengan booking system.",
            link: "#",
            tags: ["Next.js", "Tailwind", "Framer Motion"],
            images: ["https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80"],
            order: 3
        }
    ];

    let portfolioData = [];
    const container = document.getElementById('portfolioAlbums');

    // Check if Firebase is available
    function getFirebase() {
        return window.testimonialsFirebase || null;
    }

    // Load Portfolio
    async function loadPortfolio() {
        const fb = getFirebase();
        if (fb && fb.db) {
            try {
                const q = fb.query(fb.collection(fb.db, "portfolio_items"), fb.orderBy("order", "asc"));
                const snapshot = await fb.getDocs(q);
                if (!snapshot.empty) {
                    portfolioData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                } else {
                    portfolioData = [...defaultData];
                }
            } catch (e) {
                console.log("Portfolio Firebase load failed, using default:", e);
                const cached = localStorage.getItem('aspyrePortfolio');
                portfolioData = cached ? JSON.parse(cached) : [...defaultData];
            }
        } else {
            const cached = localStorage.getItem('aspyrePortfolio');
            portfolioData = cached ? JSON.parse(cached) : [...defaultData];
        }
        localStorage.setItem('aspyrePortfolio', JSON.stringify(portfolioData));
        return portfolioData;
    }

    // Save Portfolio
    async function savePortfolio(data, id = null) {
        const fb = getFirebase();
        try {
            if (fb && fb.db) {
                if (id && !id.startsWith('def-') && !id.startsWith('local-')) {
                    await fb.updateDoc(fb.doc(fb.db, "portfolio_items", id), data);
                } else {
                    const docRef = await fb.addDoc(fb.collection(fb.db, "portfolio_items"), {
                        ...data,
                        createdAt: fb.serverTimestamp()
                    });
                    data.id = docRef.id;
                }
            }
            // Update local
            const idx = portfolioData.findIndex(t => t.id === id);
            if (idx >= 0) {
                portfolioData[idx] = { ...portfolioData[idx], ...data };
            } else {
                data.id = data.id || 'local-' + Date.now();
                portfolioData.push(data);
            }
            localStorage.setItem('aspyrePortfolio', JSON.stringify(portfolioData));
            return true;
        } catch (e) {
            console.error("Save Portfolio error:", e);
            return false;
        }
    }

    // Delete Portfolio
    async function deletePortfolio(id) {
        const fb = getFirebase();
        try {
            if (fb && fb.db && !id.startsWith('def-') && !id.startsWith('local-')) {
                await fb.deleteDoc(fb.doc(fb.db, "portfolio_items", id));
            }
            portfolioData = portfolioData.filter(t => t.id !== id);
            localStorage.setItem('aspyrePortfolio', JSON.stringify(portfolioData));
            return true;
        } catch (e) {
            console.error("Delete Portfolio error:", e);
            return false;
        }
    }

    // Render Portfolio
    function renderPortfolio() {
        if (!container) return;
        container.innerHTML = '';
        const isCmsMode = document.body.classList.contains('cms-mode');

        // CMS Add Button Visibility (Handled by CSS usually, but explicit check here)
        const addBtn = document.getElementById('addAlbumBtn');
        if (addBtn) addBtn.style.display = isCmsMode ? 'flex' : 'none';

        portfolioData.forEach((item, index) => {
            const card = document.createElement('div');
            card.className = 'album-card';
            card.dataset.id = item.id;

            // Use first image as cover, or default
            const coverImg = (item.images && item.images.length > 0) ? item.images[0] : 'https://via.placeholder.com/400x300?text=No+Image';
            const tagsHtml = (item.tags || []).slice(0, 3).map(tag => `<span class="album-tag">${tag}</span>`).join('');

            let cmsControls = '';
            if (isCmsMode) {
                cmsControls = `
                    <div class="album-cms-controls">
                        <button class="album-edit-btn" data-id="${item.id}" title="Edit Project">✏️</button>
                        <button class="album-delete-btn" data-id="${item.id}" title="Hapus Project">🗑️</button>
                    </div>
                `;
            }

            card.innerHTML = `
                ${cmsControls}
                <div class="album-cover">
                    <img src="${coverImg}" alt="${item.title}" loading="lazy">
                    <div class="album-overlay">
                        <span class="view-label">Lihat Detail</span>
                    </div>
                </div>
                <div class="album-info">
                    <div class="album-meta">
                        <span class="album-cat">${item.category}</span>
                    </div>
                    <h3 class="album-title">${item.title}</h3>
                    <p class="album-desc">${item.desc}</p>
                    <div class="album-tags">
                        ${tagsHtml}
                    </div>
                </div>
            `;

            // Click event for details (ignore if clicked on CMS controls)
            card.addEventListener('click', (e) => {
                if (!e.target.closest('.album-cms-controls')) {
                    openDetailModal(item);
                }
            });

            container.appendChild(card);
        });

        // Attach CMS Listeners
        if (isCmsMode) {
            document.querySelectorAll('.album-edit-btn').forEach(btn => {
                btn.onclick = (e) => {
                    e.stopPropagation();
                    const id = btn.dataset.id;
                    const item = portfolioData.find(p => p.id === id);
                    if (item) openCmsModal(item);
                };
            });

            document.querySelectorAll('.album-delete-btn').forEach(btn => {
                btn.onclick = async (e) => {
                    e.stopPropagation();
                    if (confirm('Hapus project ini dari portfolio?')) {
                        await deletePortfolio(btn.dataset.id);
                        renderPortfolio();
                    }
                };
            });
        }
    }

    // --- Detail View Modal ---
    function openDetailModal(item) {
        const modal = document.getElementById('album-modal');
        if (!modal) return;

        // Populate Data
        modal.querySelector('.album-modal-title').textContent = item.title;
        modal.querySelector('.album-modal-tag').textContent = item.category;
        modal.querySelector('.album-modal-desc').textContent = item.desc; // Or full content if available

        // Render Gallery
        const grid = document.getElementById('albumGalleryGrid');
        grid.innerHTML = '';
        if (item.images && item.images.length > 0) {
            item.images.forEach(imgUrl => {
                const img = document.createElement('img');
                img.src = imgUrl;
                img.className = 'gallery-img';
                img.onclick = () => openLightbox(imgUrl);
                grid.appendChild(img);
            });
        }

        // Tech Stack
        const stack = document.getElementById('albumTechStack');
        stack.innerHTML = (item.tags || []).map(t => `<span class="tech-badge">${t}</span>`).join('');

        // Link
        const linkBtn = document.getElementById('albumVisitLink');
        if (item.link && item.link !== '#') {
            linkBtn.href = item.link;
            linkBtn.style.display = 'inline-flex';
        } else {
            linkBtn.style.display = 'none';
        }

        // Show
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Close Handlers
        modal.querySelector('.album-modal-close').onclick = () => {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        };
        modal.querySelector('.album-modal-backdrop').onclick = () => {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        };
    }

    function openLightbox(src) {
        const lightbox = document.getElementById('image-lightbox');
        const img = document.getElementById('lightboxImage');
        if (lightbox && img) {
            img.src = src;
            lightbox.classList.add('active');
            lightbox.querySelector('.lightbox-close').onclick = () => lightbox.classList.remove('active');
        }
    }

    // --- CMS Edit Modal ---
    function openCmsModal(item = null) {
        const modal = document.getElementById('album-edit-modal');
        const form = document.getElementById('albumEditForm');

        if (!modal || !form) return;

        const isEdit = !!item;
        document.getElementById('editModalTitle').textContent = isEdit ? 'Edit Project' : 'Tambah Project Baru';
        document.getElementById('editAlbumId').value = item ? item.id : '';
        document.getElementById('editAlbumTitle').value = item ? item.title : '';
        document.getElementById('editAlbumCategory').value = item ? item.category : '';
        document.getElementById('editAlbumDesc').value = item ? item.desc : '';
        document.getElementById('editAlbumLink').value = item ? item.link : '';

        // Tags
        // Note: Simple comma separated logic for now or keeping array
        // Here we clear tags visual and rebuild if we had a tag input system
        // For simplicity in this version, we'll just clear the tag input

        // Images Preview
        const previewGrid = document.getElementById('previewImagesGrid');
        previewGrid.innerHTML = '';
        let currentImages = item ? [...(item.images || [])] : [];

        function renderPreviews() {
            previewGrid.innerHTML = '';
            currentImages.forEach((url, idx) => {
                const div = document.createElement('div');
                div.className = 'edit-image-item';
                div.innerHTML = `
                    <img src="${url}">
                    <button type="button" class="remove-image">×</button>
                `;
                div.querySelector('.remove-image').onclick = () => {
                    currentImages.splice(idx, 1);
                    renderPreviews();
                };
                previewGrid.appendChild(div);
            });
        }
        renderPreviews();

        // Image Add Handler (Simple URL prompt for now as requested, or File API logic)
        // Since user asked for base64/URL, let's use a prompt for URL for simplicity first, 
        // OR handle the file input if we want base64.
        // Let's implement Base64 for the file input in the HTML
        const fileInput = document.getElementById('previewFileInput');
        fileInput.onchange = (e) => {
            Array.from(e.target.files).forEach(file => {
                const reader = new FileReader();
                reader.onload = (ev) => {
                    currentImages.push(ev.target.result); // Base64
                    renderPreviews();
                };
                reader.readAsDataURL(file);
            });
            fileInput.value = ''; // Reset
        };

        modal.classList.add('active');

        // Close
        const closeModal = () => modal.classList.remove('active');
        document.getElementById('editModalClose').onclick = closeModal;

        // Save
        form.onsubmit = async (e) => {
            e.preventDefault();
            const saveBtn = document.querySelector('#saveCmsBtn') || document.createElement('button'); // Fallback if not found inside form

            const data = {
                title: document.getElementById('editAlbumTitle').value,
                category: document.getElementById('editAlbumCategory').value,
                desc: document.getElementById('editAlbumDesc').value,
                link: document.getElementById('editAlbumLink').value,
                tags: ['React', 'Firebase'], // Placeholder, should parse tags properly if UI exists
                images: currentImages,
                order: item ? item.order : portfolioData.length
            };

            await savePortfolio(data, item ? item.id : null);
            closeModal();
            renderPortfolio();
        };
    }

    // Init
    async function init() {
        await loadPortfolio();
        renderPortfolio();

        // Add Button Listener
        const addBtn = document.getElementById('addAlbumBtn');
        if (addBtn) addBtn.onclick = () => openCmsModal(null);

        // Observer for CMS mode toggle
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'class') {
                    // Update visibility of Add button
                    const isCms = document.body.classList.contains('cms-mode');
                    if (addBtn) addBtn.style.display = isCms ? 'flex' : 'none';
                    renderPortfolio(); // Re-render to show/hide edit buttons
                }
            });
        });
        observer.observe(document.body, { attributes: true });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
