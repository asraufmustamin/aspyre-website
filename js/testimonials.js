// Testimonials Logic - Firebase Integrated with CMS CRUD
(function initTestimonials() {
    // Default fallback data (used if Firebase fails or empty)
    const defaultData = [
        {
            id: 'default-1',
            name: "Budi Santoso",
            role: "Owner, Warung Kopi Nusantara",
            quote: "ASPYRE bikin logo dan banner promo warung kopi saya. Hasilnya keren banget, pelanggan jadi lebih tertarik!",
            service: "Logo & Banner Design",
            img: "https://ui-avatars.com/api/?name=Budi+Santoso&background=random&color=fff",
            order: 0
        },
        {
            id: 'default-2',
            name: "Siti Aminah",
            role: "Founder, Hijab Style",
            quote: "Website toko online saya dibikin sama ASPYRE, sekarang orderan naik 40%!",
            service: "E-Commerce Website",
            img: "https://ui-avatars.com/api/?name=Siti+Aminah&background=ff6b6b&color=fff",
            order: 1
        },
        {
            id: 'default-3',
            name: "Agus Prasetyo",
            role: "Manager, Bengkel Motor Jaya",
            quote: "Tim ASPYRE sabar banget jelasin, revisi juga cepet. Hasil akhirnya profesional!",
            service: "Company Profile Website",
            img: "https://ui-avatars.com/api/?name=Agus+Prasetyo&background=4ecdc4&color=fff",
            order: 2
        }
    ];

    let testimonialsData = [];
    let currentIndex = 0;
    let timer = null;
    const interval = 5000;

    // Check if Firebase is available (loaded from main script)
    function getFirebase() {
        return window.testimonialsFirebase || null;
    }

    // Load testimonials from Firebase or localStorage
    async function loadTestimonials() {
        const fb = getFirebase();
        if (fb && fb.db) {
            try {
                const q = fb.query(fb.collection(fb.db, "testimonials"), fb.orderBy("order", "asc"));
                const snapshot = await fb.getDocs(q);
                if (!snapshot.empty) {
                    testimonialsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                } else {
                    testimonialsData = [...defaultData];
                }
            } catch (e) {
                console.log("Firebase load failed, using cached/default:", e);
                const cached = localStorage.getItem('aspyreTestimonials');
                testimonialsData = cached ? JSON.parse(cached) : [...defaultData];
            }
        } else {
            const cached = localStorage.getItem('aspyreTestimonials');
            testimonialsData = cached ? JSON.parse(cached) : [...defaultData];
        }

        // Cache locally
        localStorage.setItem('aspyreTestimonials', JSON.stringify(testimonialsData));
        return testimonialsData;
    }

    // Save testimonial to Firebase
    async function saveTestimonial(data, id = null) {
        const fb = getFirebase();
        try {
            if (fb && fb.db) {
                if (id && !id.startsWith('default-')) {
                    await fb.updateDoc(fb.doc(fb.db, "testimonials", id), data);
                } else {
                    const docRef = await fb.addDoc(fb.collection(fb.db, "testimonials"), {
                        ...data,
                        createdAt: fb.serverTimestamp()
                    });
                    data.id = docRef.id;
                }
            }
            // Update local cache
            const idx = testimonialsData.findIndex(t => t.id === id);
            if (idx >= 0) {
                testimonialsData[idx] = { ...testimonialsData[idx], ...data };
            } else {
                data.id = data.id || 'local-' + Date.now();
                testimonialsData.push(data);
            }
            localStorage.setItem('aspyreTestimonials', JSON.stringify(testimonialsData));
            return true;
        } catch (e) {
            console.error("Save testimonial error:", e);
            return false;
        }
    }

    // Delete testimonial
    async function deleteTestimonial(id) {
        const fb = getFirebase();
        try {
            if (fb && fb.db && !id.startsWith('default-') && !id.startsWith('local-')) {
                await fb.deleteDoc(fb.doc(fb.db, "testimonials", id));
            }
            testimonialsData = testimonialsData.filter(t => t.id !== id);
            localStorage.setItem('aspyreTestimonials', JSON.stringify(testimonialsData));
            return true;
        } catch (e) {
            console.error("Delete testimonial error:", e);
            return false;
        }
    }

    // Render testimonials
    function renderTestimonials() {
        const track = document.querySelector('.testimonial-track');
        const indicators = document.querySelector('.t-indicators');
        const isCmsMode = document.body.classList.contains('cms-mode');

        if (!track || !indicators) return;

        track.innerHTML = '';
        indicators.innerHTML = '';

        testimonialsData.forEach((item, index) => {
            const card = document.createElement('div');
            card.className = `testimonial-card ${index === 0 ? 'active' : ''}`;
            card.dataset.id = item.id;

            let cmsControls = '';
            if (isCmsMode) {
                cmsControls = `
                    <div class="t-cms-controls">
                        <button class="t-edit-btn" data-id="${item.id}" title="Edit">✏️</button>
                        <button class="t-delete-btn" data-id="${item.id}" title="Hapus">🗑️</button>
                    </div>
                `;
            }

            card.innerHTML = `
                <div class="t-card-inner">
                    ${cmsControls}
                    <div class="t-quote-icon">❝</div>
                    <p class="t-text">"${item.quote}"</p>
                    <div class="t-author">
                        <div class="t-avatar">
                            <img src="${item.img}" alt="${item.name}">
                        </div>
                        <div class="t-info">
                            <span class="t-name">${item.name}</span>
                            <span class="t-role">${item.role}</span>
                            <span class="t-service">${item.service}</span>
                        </div>
                    </div>
                </div>
            `;
            track.appendChild(card);

            // Dot
            const dot = document.createElement('div');
            dot.className = `t-dot ${index === 0 ? 'active' : ''}`;
            dot.addEventListener('click', () => goToSlide(index));
            indicators.appendChild(dot);
        });

        // Add "+" button in CMS mode
        if (isCmsMode) {
            const addBtn = document.createElement('button');
            addBtn.className = 't-add-btn';
            addBtn.innerHTML = '➕ Tambah Testimoni';
            addBtn.onclick = () => openTestimonialModal();
            track.parentElement.appendChild(addBtn);
        }

        // Attach CMS event listeners
        if (isCmsMode) {
            document.querySelectorAll('.t-edit-btn').forEach(btn => {
                btn.onclick = (e) => {
                    e.stopPropagation();
                    const id = btn.dataset.id;
                    const item = testimonialsData.find(t => t.id === id);
                    if (item) openTestimonialModal(item);
                };
            });

            document.querySelectorAll('.t-delete-btn').forEach(btn => {
                btn.onclick = async (e) => {
                    e.stopPropagation();
                    if (confirm('Hapus testimoni ini?')) {
                        await deleteTestimonial(btn.dataset.id);
                        renderTestimonials();
                    }
                };
            });
        }
    }

    // Modal for add/edit testimonial
    function openTestimonialModal(item = null) {
        const isEdit = !!item;

        // Remove existing modal
        document.getElementById('testimonialModal')?.remove();

        const modal = document.createElement('div');
        modal.id = 'testimonialModal';
        modal.className = 'testimonial-modal active';
        modal.innerHTML = `
            <div class="testimonial-modal-content">
                <div class="t-modal-header">
                    <h3>${isEdit ? '✏️ Edit Testimoni' : '➕ Tambah Testimoni Baru'}</h3>
                    <button class="t-modal-close">&times;</button>
                </div>
                <form id="testimonialForm">
                    <input type="hidden" id="tEditId" value="${item?.id || ''}">
                    
                    <div class="t-form-group">
                        <label>Foto Profil</label>
                        <div class="t-photo-upload">
                            <img id="tPhotoPreview" src="${item?.img || 'https://ui-avatars.com/api/?name=New+Client&background=random&color=fff'}" alt="Preview">
                            <input type="file" id="tPhotoInput" accept="image/*" hidden>
                            <button type="button" id="tPhotoBtn" class="t-upload-btn">📷 Pilih Foto</button>
                        </div>
                    </div>

                    <div class="t-form-group">
                        <label>Nama Klien *</label>
                        <input type="text" id="tName" value="${item?.name || ''}" required placeholder="Contoh: Budi Santoso">
                    </div>

                    <div class="t-form-group">
                        <label>Jabatan / Perusahaan *</label>
                        <input type="text" id="tRole" value="${item?.role || ''}" required placeholder="Contoh: Owner, Warung Kopi">
                    </div>

                    <div class="t-form-group">
                        <label>Layanan yang Dipakai</label>
                        <input type="text" id="tService" value="${item?.service || ''}" placeholder="Contoh: Logo Design">
                    </div>

                    <div class="t-form-group">
                        <label>Testimoni / Quote *</label>
                        <textarea id="tQuote" rows="4" required placeholder="Tuliskan testimoni klien...">${item?.quote || ''}</textarea>
                    </div>

                    <div class="t-form-actions">
                        <button type="button" class="t-btn-cancel">Batal</button>
                        <button type="submit" class="t-btn-save">💾 Simpan</button>
                    </div>
                </form>
            </div>
        `;

        document.body.appendChild(modal);

        // Photo upload handler
        const photoBtn = modal.querySelector('#tPhotoBtn');
        const photoInput = modal.querySelector('#tPhotoInput');
        const photoPreview = modal.querySelector('#tPhotoPreview');

        photoBtn.onclick = () => photoInput.click();
        photoInput.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (ev) => {
                    photoPreview.src = ev.target.result;
                };
                reader.readAsDataURL(file);
            }
        };

        // Close handlers
        modal.querySelector('.t-modal-close').onclick = () => modal.remove();
        modal.querySelector('.t-btn-cancel').onclick = () => modal.remove();
        modal.onclick = (e) => { if (e.target === modal) modal.remove(); };

        // Form submit
        modal.querySelector('#testimonialForm').onsubmit = async (e) => {
            e.preventDefault();

            const data = {
                name: modal.querySelector('#tName').value.trim(),
                role: modal.querySelector('#tRole').value.trim(),
                service: modal.querySelector('#tService').value.trim() || 'General Service',
                quote: modal.querySelector('#tQuote').value.trim(),
                img: photoPreview.src,
                order: isEdit ? (item.order ?? testimonialsData.length) : testimonialsData.length
            };

            const editId = modal.querySelector('#tEditId').value;
            const saveBtn = modal.querySelector('.t-btn-save');
            saveBtn.textContent = 'Menyimpan...';
            saveBtn.disabled = true;

            const success = await saveTestimonial(data, editId || null);

            if (success) {
                modal.remove();
                renderTestimonials();
                resetTimer();
                showToast(isEdit ? 'Testimoni diperbarui!' : 'Testimoni baru ditambahkan!');
            } else {
                saveBtn.textContent = '💾 Simpan';
                saveBtn.disabled = false;
                alert('Gagal menyimpan. Coba lagi.');
            }
        };
    }

    // Toast notification helper
    function showToast(message) {
        const existing = document.querySelector('.t-toast');
        if (existing) existing.remove();

        const toast = document.createElement('div');
        toast.className = 't-toast';
        toast.textContent = message;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    }

    // Slider functions
    function goToSlide(index) {
        const track = document.querySelector('.testimonial-track');
        const cards = document.querySelectorAll('.testimonial-card');
        const dots = document.querySelectorAll('.t-dot');

        if (!track || testimonialsData.length === 0) return;

        currentIndex = index;
        if (currentIndex < 0) currentIndex = testimonialsData.length - 1;
        if (currentIndex >= testimonialsData.length) currentIndex = 0;

        track.style.transform = `translateX(-${currentIndex * 100}%)`;

        cards.forEach((card, i) => card.classList.toggle('active', i === currentIndex));
        dots.forEach((dot, i) => dot.classList.toggle('active', i === currentIndex));

        resetTimer();
    }

    function nextSlide() { goToSlide(currentIndex + 1); }
    function prevSlide() { goToSlide(currentIndex - 1); }

    function resetTimer() {
        clearInterval(timer);
        timer = setInterval(nextSlide, interval);
    }

    // Initialize
    async function init() {
        await loadTestimonials();
        renderTestimonials();

        const nextBtn = document.querySelector('.t-btn.next');
        const prevBtn = document.querySelector('.t-btn.prev');

        if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); resetTimer(); });
        if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); resetTimer(); });

        // Touch support
        const track = document.querySelector('.testimonial-track');
        if (track) {
            let startX = 0;
            track.addEventListener('touchstart', e => { startX = e.changedTouches[0].screenX; }, { passive: true });
            track.addEventListener('touchend', e => {
                const deltaX = startX - e.changedTouches[0].screenX;
                if (Math.abs(deltaX) > 50) {
                    deltaX > 0 ? nextSlide() : prevSlide();
                    resetTimer();
                }
            });
        }

        resetTimer();

        // Re-render when CMS mode changes
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'class') {
                    renderTestimonials();
                }
            });
        });
        observer.observe(document.body, { attributes: true });
    }

    // Expose functions globally for CMS
    window.testimonialsCRUD = {
        reload: async () => { await loadTestimonials(); renderTestimonials(); },
        add: openTestimonialModal,
        save: saveTestimonial,
        delete: deleteTestimonial
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
