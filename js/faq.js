// FAQ Logic - Firebase Integrated with CMS CRUD
(function initFAQ() {
    // Default fallback data (matches original static HTML)
    const defaultData = [
        // Layanan
        {
            id: 'def-1',
            category: 'faq-layanan',
            question: "Berapa estimasi waktu pengerjaan project?",
            answer: "Waktu pengerjaan disesuaikan dengan kompleksitas project Anda. Secara umum:<br>• <strong>Desain Grafis:</strong> 2-4 hari kerja.<br>• <strong>Landing Page:</strong> 3-7 hari kerja.<br>• <strong>Web System/Apps:</strong> 2-6 minggu.<br>Kami selalu memberikan timeline transparan di awal agar Anda bisa merencanakan launch bisnis dengan tenang.",
            order: 0
        },
        {
            id: 'def-2',
            category: 'faq-layanan',
            question: "Bagaimana jika saya ingin revisi?",
            answer: "Kepuasan Anda adalah prioritas kami. Semua paket sudah termasuk kuota revisi (Basic 1x, Standard 2x, Premium Unlimited). Kami akan berdiskusi mendalam sebelum revisi untuk memastikan hasil akhir benar-benar sesuai visi Anda.",
            order: 1
        },
        {
            id: 'def-3',
            category: 'faq-layanan',
            question: "Apakah saya mendapatkan file master?",
            answer: "Tentu saja. Kami percaya Anda harus memiliki kontrol penuh atas aset bisnis Anda. Semua source file (AI, PSD, Figma, Codingan) akan diserahkan lengkap di akhir project tanpa biaya tambahan.",
            order: 2
        },
        // Harga
        {
            id: 'def-4',
            category: 'faq-harga',
            question: "Bagaimana sistem pembayarannya?",
            answer: "Sistem kami aman dan bertahap. Cukup DP 50% untuk memulai pengerjaan (Kick-off). Pelunasan sisa 50% baru dibayarkan setelah Anda melihat preview hasil kerja dan setuju untuk finalisasi. Tidak ada biaya tersembunyi.",
            order: 0
        },
        {
            id: 'def-5',
            category: 'faq-harga',
            question: "Apakah saya mendapatkan Invoice resmi?",
            answer: "Ya, kami menyediakan invoice profesional yang sah untuk keperluan administrasi keuangan atau reimbursement perusahaan Anda.",
            order: 1
        },
        // Proses
        {
            id: 'def-6',
            category: 'faq-proses',
            question: "Bagaimana cara memulai kerjasama?",
            answer: "Anda bisa langsung mengisi <strong>Form Order</strong> di bawah, atau jika ingin diskusi santai terlebih dahulu, silakan gunakan fitur <strong>Estimasi Biaya</strong> atau chat kami via WhatsApp. Tim kami akan merespon dengan ramah.",
            order: 0
        },
        {
            id: 'def-7',
            category: 'faq-proses',
            question: "Apakah bisa meeting tatap muka/online?",
            answer: "Sangat bisa. Untuk project yang membutuhkan diskusi mendalam, kami siap menjadwalkan Google Meet atau Zoom Call agar komunikasi lebih efektif.",
            order: 1
        }
    ];

    let faqData = [];

    // Check if Firebase is available
    function getFirebase() {
        return window.testimonialsFirebase || null;
    }

    // Load FAQs
    async function loadFaqs() {
        const fb = getFirebase();
        if (fb && fb.db) {
            try {
                const q = fb.query(fb.collection(fb.db, "faq_items"), fb.orderBy("order", "asc"));
                const snapshot = await fb.getDocs(q);
                if (!snapshot.empty) {
                    faqData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                } else {
                    faqData = [...defaultData];
                }
            } catch (e) {
                console.log("FAQ Firebase load failed, using default:", e);
                const cached = localStorage.getItem('aspyreFaq');
                faqData = cached ? JSON.parse(cached) : [...defaultData];
            }
        } else {
            const cached = localStorage.getItem('aspyreFaq');
            faqData = cached ? JSON.parse(cached) : [...defaultData];
        }
        localStorage.setItem('aspyreFaq', JSON.stringify(faqData));
        return faqData;
    }

    // Save FAQ
    async function saveFaq(data, id = null) {
        const fb = getFirebase();
        try {
            if (fb && fb.db) {
                if (id && !id.startsWith('def-') && !id.startsWith('local-')) {
                    await fb.updateDoc(fb.doc(fb.db, "faq_items", id), data);
                } else {
                    const docRef = await fb.addDoc(fb.collection(fb.db, "faq_items"), {
                        ...data,
                        createdAt: fb.serverTimestamp()
                    });
                    data.id = docRef.id;
                }
            }
            // Update local
            const idx = faqData.findIndex(t => t.id === id);
            if (idx >= 0) {
                faqData[idx] = { ...faqData[idx], ...data };
            } else {
                data.id = data.id || 'local-' + Date.now();
                faqData.push(data);
            }
            localStorage.setItem('aspyreFaq', JSON.stringify(faqData));
            return true;
        } catch (e) {
            console.error("Save FAQ error:", e);
            return false;
        }
    }

    // Delete FAQ
    async function deleteFaq(id) {
        const fb = getFirebase();
        try {
            if (fb && fb.db && !id.startsWith('def-') && !id.startsWith('local-')) {
                await fb.deleteDoc(fb.doc(fb.db, "faq_items", id));
            }
            faqData = faqData.filter(t => t.id !== id);
            localStorage.setItem('aspyreFaq', JSON.stringify(faqData));
            return true;
        } catch (e) {
            console.error("Delete FAQ error:", e);
            return false;
        }
    }

    // Render FAQs
    function renderFaqs() {
        const containers = {
            'faq-layanan': document.getElementById('faq-layanan'),
            'faq-harga': document.getElementById('faq-harga'),
            'faq-proses': document.getElementById('faq-proses')
        };
        const isCmsMode = document.body.classList.contains('cms-mode');

        // Clear containers
        Object.values(containers).forEach(c => {
            if (c) c.innerHTML = '';
        });

        // Loop data
        faqData.forEach(item => {
            const container = containers[item.category];
            if (!container) return;

            const div = document.createElement('div');
            div.className = 'faq-item';
            div.dataset.id = item.id;

            let cmsControls = '';
            if (isCmsMode) {
                cmsControls = `
                    <div class="faq-cms-controls">
                        <button class="faq-edit-btn" data-id="${item.id}" title="Edit">✏️</button>
                        <button class="faq-delete-btn" data-id="${item.id}" title="Hapus">🗑️</button>
                    </div>
                `;
            }

            div.innerHTML = `
                <button class="faq-question">
                    ${cmsControls}
                    <span class="q-text">${item.question}</span>
                    <span class="faq-icon">▼</span>
                </button>
                <div class="faq-answer">${item.answer}</div>
            `;
            container.appendChild(div);
        });

        // Add "+" button in CMS mode for each category
        if (isCmsMode) {
            Object.keys(containers).forEach(catId => {
                const container = containers[catId];
                if (container) {
                    const addBtn = document.createElement('button');
                    addBtn.className = 'faq-add-btn';
                    addBtn.innerHTML = '➕ Tambah FAQ';
                    addBtn.onclick = () => openFaqModal(null, catId);
                    container.appendChild(addBtn);
                }
            });
        }

        // Re-attach listeners (Accordion logic)
        attachAccordionListeners();

        // Attach CMS listeners
        if (isCmsMode) {
            document.querySelectorAll('.faq-edit-btn').forEach(btn => {
                btn.onclick = (e) => {
                    e.stopPropagation(); // prevent accordion toggle
                    const id = btn.dataset.id;
                    const item = faqData.find(f => f.id === id);
                    if (item) openFaqModal(item);
                };
            });

            document.querySelectorAll('.faq-delete-btn').forEach(btn => {
                btn.onclick = async (e) => {
                    e.stopPropagation();
                    if (confirm('Hapus pertanyaan ini?')) {
                        await deleteFaq(btn.dataset.id);
                        renderFaqs();
                    }
                };
            });
        }
    }

    function attachAccordionListeners() {
        const questions = document.querySelectorAll('.faq-question');
        questions.forEach(q => {
            q.onclick = function (e) {
                // Ignore if clicked on CMS controls
                if (e.target.closest('.faq-cms-controls')) return;

                const item = this.parentElement;
                const answer = this.nextElementSibling;
                const isActive = item.classList.contains('active');

                // Close others in same container? (Optional, kept from original behavior)
                const container = item.parentElement;
                container.querySelectorAll('.faq-item').forEach(other => {
                    if (other !== item && other.classList.contains('active')) {
                        other.classList.remove('active');
                        other.querySelector('.faq-answer').style.maxHeight = null;
                    }
                });

                item.classList.toggle('active');
                if (!isActive) {
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                } else {
                    answer.style.maxHeight = null;
                }
            };
        });
    }

    // Modal
    function openFaqModal(item = null, categoryPreselect = null) {
        const isEdit = !!item;
        document.getElementById('faqModal')?.remove();

        const modal = document.createElement('div');
        modal.id = 'faqModal';
        modal.className = 'testimonial-modal active'; // Reuse styling

        const categoryVal = item ? item.category : (categoryPreselect || 'faq-layanan');

        modal.innerHTML = `
            <div class="testimonial-modal-content">
                <div class="t-modal-header">
                    <h3>${isEdit ? '✏️ Edit FAQ' : '➕ Tambah FAQ Baru'}</h3>
                    <button class="t-modal-close">&times;</button>
                </div>
                <form id="faqForm">
                    <input type="hidden" id="fId" value="${item?.id || ''}">
                    
                    <div class="t-form-group">
                        <label>Kategori</label>
                        <select id="fCategory" required>
                            <option value="faq-layanan" ${categoryVal === 'faq-layanan' ? 'selected' : ''}>Tentang Layanan</option>
                            <option value="faq-harga" ${categoryVal === 'faq-harga' ? 'selected' : ''}>Harga & Pembayaran</option>
                            <option value="faq-proses" ${categoryVal === 'faq-proses' ? 'selected' : ''}>Proses Kerja</option>
                        </select>
                    </div>

                    <div class="t-form-group">
                        <label>Pertanyaan</label>
                        <input type="text" id="fQuestion" value="${item?.question || ''}" required placeholder="Contoh: Apakah ada garansi?">
                    </div>

                    <div class="t-form-group">
                        <label>Jawaban (HTML Supported)</label>
                        <textarea id="fAnswer" rows="5" required placeholder="Tulis jawaban...">${item?.answer || ''}</textarea>
                    </div>

                    <div class="t-form-actions">
                        <button type="button" class="t-btn-cancel">Batal</button>
                        <button type="submit" class="t-btn-save">💾 Simpan</button>
                    </div>
                </form>
            </div>
        `;

        document.body.appendChild(modal);

        // Close handlers
        const close = () => modal.remove();
        modal.querySelector('.t-modal-close').onclick = close;
        modal.querySelector('.t-btn-cancel').onclick = close;
        modal.onclick = (e) => { if (e.target === modal) close(); };

        // Submit
        modal.querySelector('#faqForm').onsubmit = async (e) => {
            e.preventDefault();
            const saveBtn = modal.querySelector('.t-btn-save');
            saveBtn.textContent = 'Menyimpan...';
            saveBtn.disabled = true;

            const data = {
                category: modal.querySelector('#fCategory').value,
                question: modal.querySelector('#fQuestion').value.trim(),
                answer: modal.querySelector('#fAnswer').value.trim(),
                order: item?.order ?? 99
            };

            const success = await saveFaq(data, item?.id);
            if (success) {
                close();
                renderFaqs();
                // Show tab of new item
                document.querySelector(`.faq-tab[data-target="${data.category}"]`)?.click();
            } else {
                saveBtn.textContent = '💾 Simpan';
                saveBtn.disabled = false;
                alert('Gagal menyimpan.');
            }
        };
    }

    // Init
    async function init() {
        // Tab Listeners (Static)
        const tabs = document.querySelectorAll('.faq-tab');
        const contents = document.querySelectorAll('.faq-content');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => t.classList.remove('active'));
                contents.forEach(c => c.classList.remove('active'));
                tab.classList.add('active');
                const targetId = tab.getAttribute('data-target');
                document.getElementById(targetId).classList.add('active');
            });
        });

        await loadFaqs();
        renderFaqs();

        // CMS Observer
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'class') {
                    renderFaqs();
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
