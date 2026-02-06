// Price Calculator Logic
(function initCalculator() {
    // Current State
    const state = {
        step: 1,
        service: null, // 'creative', 'web', 'data'
        data: {} // Holds form values
    };

    // Configuration & Pricing Logic
    const PRICING = {
        creative: {
            base: 99000,
            types: {
                logo: { label: 'Logo & Brand Identity', mult: 1.5 },
                banner: { label: 'Banner & Spanduk', mult: 1.0 },
                social: { label: 'Konten Media Sosial', mult: 1.2 },
                ppt: { label: 'Presentasi (PPT)', mult: 1.3 }
            },
            complexity: {
                simple: { label: 'Simple', mult: 1 },
                medium: { label: 'Medium', mult: 1.5 },
                complex: { label: 'Complex', mult: 2 }
            },
            addons: {
                urgent: { label: 'Urgent (1-2 Hari)', type: 'percent', val: 0.3 },
                source: { label: 'Source File', type: 'fixed', val: 100000 }
            }
        },
        web: {
            types: {
                landing: { label: 'Landing Page', base: 799000 },
                company: { label: 'Company Profile', base: 1499000 },
                ecommerce: { label: 'E-Commerce Simple', base: 2999000 },
                webapp: { label: 'Web App Custom', base: 4999000 }
            },
            extras: {
                cms: { label: 'CMS / Blog', val: 250000 },
                seo: { label: 'Basic SEO', val: 300000 },
                domain: { label: 'Domain & Hosting (1 Tahun)', val: 350000 }
            },
            urgent: 0.4
        },
        data: {
            basePerBatch: 50000, // per 100 items
            types: {
                entry1: { label: 'Entry Class A (Simple)', mult: 1 },
                entry2: { label: 'Entry Class B (Complex)', mult: 1.5 },
                clean: { label: 'Data Cleaning', mult: 3 }
            },
            addons: {
                urgent: 0.5 // 50%
            }
        }
    };

    // DOM Elements
    const steps = document.querySelectorAll('.step-content');
    const indicators = document.querySelectorAll('.step-indicator');
    const progressBar = document.querySelector('.progress-bar-fill');
    const nextBtn = document.getElementById('calcNextBtn');
    const backBtn = document.getElementById('calcBackBtn');

    // Step 2 Container
    const step2Container = document.getElementById('step2Form');

    // Init
    updateUI();

    // Event Listeners
    nextBtn.addEventListener('click', goNext);
    backBtn.addEventListener('click', goBack);

    // Initial Service Selection
    document.querySelectorAll('.service-option').forEach(opt => {
        opt.addEventListener('click', () => {
            document.querySelectorAll('.service-option').forEach(o => o.classList.remove('selected'));
            opt.classList.add('selected');
            state.service = opt.getAttribute('data-value');
            nextBtn.disabled = false;
        });
    });

    function goNext() {
        if (state.step === 1) {
            if (!state.service) return;
            renderStep2();
            state.step = 2;
        } else if (state.step === 2) {
            calculateResult();
            state.step = 3;
        }
        updateUI();
    }

    function goBack() {
        if (state.step > 1) {
            state.step--;
            updateUI();
        }
    }

    function updateUI() {
        // Steps Visibility
        steps.forEach((s, i) => {
            if (i + 1 === state.step) s.classList.add('active');
            else s.classList.remove('active');
        });

        // Indicators
        indicators.forEach((ind, i) => {
            const stepNum = i + 1;
            ind.classList.remove('active', 'completed');
            if (stepNum === state.step) ind.classList.add('active');
            else if (stepNum < state.step) ind.classList.add('completed');
        });

        // Progress Bar
        const progress = ((state.step - 1) / 2) * 100;
        progressBar.style.width = `${progress}%`;

        // Buttons
        backBtn.style.visibility = state.step === 1 ? 'hidden' : 'visible';

        if (state.step === 1) nextBtn.textContent = 'Lanjut →';
        else if (state.step === 2) nextBtn.textContent = 'Hitung Estimasi';
        else if (state.step === 3) nextBtn.style.display = 'none'; // Custom buttons in Step 3

        if (state.step !== 3) nextBtn.style.display = 'block';

        if (state.step === 1 && !state.service) nextBtn.disabled = true;
    }

    function renderStep2() {
        const type = state.service;
        let html = '';

        if (type === 'creative') {
            html = `
                <div class="calc-form-group">
                    <label class="calc-label">Jenis Desain</label>
                    <select class="calc-select" id="creativeType">
                        ${Object.entries(PRICING.creative.types).map(([k, v]) => `<option value="${k}">${v.label}</option>`).join('')}
                    </select>
                </div>
                <div class="calc-form-group">
                    <label class="calc-label">Kompleksitas</label>
                    <div class="checkbox-group">
                        <label class="custom-checkbox">
                            <input type="radio" name="complexity" value="simple" checked> <span>Simple</span>
                        </label>
                        <label class="custom-checkbox">
                            <input type="radio" name="complexity" value="medium"> <span>Medium</span>
                        </label>
                        <label class="custom-checkbox">
                            <input type="radio" name="complexity" value="complex"> <span>Complex</span>
                        </label>
                    </div>
                </div>
                <div class="calc-form-group">
                    <label class="calc-label">Jumlah Item</label>
                    <input type="number" class="calc-input-num" id="creativeCount" value="1" min="1" max="50">
                </div>
                 <div class="calc-form-group">
                    <label class="calc-label">Add-ons</label>
                    <div class="checkbox-group">
                        <label class="custom-checkbox">
                            <input type="checkbox" id="creativeUrgent"> <span>Urgent (+30%)</span>
                        </label>
                        <label class="custom-checkbox">
                            <input type="checkbox" id="creativeSource"> <span>Source File (+100k)</span>
                        </label>
                    </div>
                </div>
            `;
        } else if (type === 'web') {
            html = `
                <div class="calc-form-group">
                    <label class="calc-label">Jenis Website</label>
                    <select class="calc-select" id="webType">
                        ${Object.entries(PRICING.web.types).map(([k, v]) => `<option value="${k}">${v.label} (Mulai ${formatCurrency(v.base)})</option>`).join('')}
                    </select>
                </div>
                 <div class="calc-form-group">
                    <label class="calc-label">Fitur Tambahan</label>
                    <div class="checkbox-group">
                        ${Object.entries(PRICING.web.extras).map(([k, v]) => `
                            <label class="custom-checkbox">
                                <input type="checkbox" id="web_${k}"> <span>${v.label} (+${formatCurrency(v.val)})</span>
                            </label>
                        `).join('')}
                    </div>
                </div>
                 <div class="calc-form-group">
                    <label class="calc-label">Halaman Tambahan (selain bawaan)</label>
                    <input type="number" class="calc-input-num" id="webPages" value="0" min="0">
                    <small style="color:#aaa">Rp 150.000 / halaman</small>
                </div>
            `;
        } else if (type === 'data') {
            html = `
                <div class="calc-form-group">
                    <label class="calc-label">Jenis Pekerjaan</label>
                    <select class="calc-select" id="dataType">
                         ${Object.entries(PRICING.data.types).map(([k, v]) => `<option value="${k}">${v.label}</option>`).join('')}
                    </select>
                </div>
                <div class="calc-form-group">
                    <label class="calc-label">Estimasi Jumlah Data (Baris/Row)</label>
                    <input type="number" class="calc-input-num" id="dataCount" value="500" step="100" min="100">
                    <small style="color:#aaa">Diskon 10% untuk >500 data, 20% untuk >1000 data</small>
                </div>
            `;
        }

        step2Container.innerHTML = html;
    }

    function calculateResult() {
        let total = 0;
        let breakdown = [];

        if (state.service === 'creative') {
            const typeKey = document.getElementById('creativeType').value;
            const complexityKey = document.querySelector('input[name="complexity"]:checked').value;
            const count = parseInt(document.getElementById('creativeCount').value) || 1;
            const isUrgent = document.getElementById('creativeUrgent').checked;
            const isSource = document.getElementById('creativeSource').checked;

            const typeData = PRICING.creative.types[typeKey];
            const compData = PRICING.creative.complexity[complexityKey];

            // Formula: Base * TypeMult * CompMult * Count
            let logicPrice = PRICING.creative.base * typeData.mult * compData.mult;
            const subtotal = logicPrice * count;

            breakdown.push({ label: `${typeData.label} (${count}x)`, price: subtotal });

            total = subtotal;

            if (isSource) {
                total += (PRICING.creative.addons.source.val * count);
                breakdown.push({ label: 'Source Files', price: PRICING.creative.addons.source.val * count });
            }

            if (isUrgent) {
                const urgentFee = total * PRICING.creative.addons.urgent.val;
                total += urgentFee;
                breakdown.push({ label: 'Urgent Charge (30%)', price: urgentFee });
            }

        } else if (state.service === 'web') {
            const typeKey = document.getElementById('webType').value;
            const pages = parseInt(document.getElementById('webPages').value) || 0;
            const typeData = PRICING.web.types[typeKey];

            total = typeData.base;
            breakdown.push({ label: typeData.label, price: typeData.base });

            // Extras
            Object.entries(PRICING.web.extras).forEach(([k, v]) => {
                if (document.getElementById(`web_${k}`).checked) {
                    total += v.val;
                    breakdown.push({ label: v.label, price: v.val });
                }
            });

            // Pages
            if (pages > 0) {
                const pageCost = pages * 150000;
                total += pageCost;
                breakdown.push({ label: `${pages} Extra Pages`, price: pageCost });
            }
        }
        else if (state.service === 'data') {
            const typeKey = document.getElementById('dataType').value;
            const count = parseInt(document.getElementById('dataCount').value) || 100;
            const typeData = PRICING.data.types[typeKey];

            const batches = Math.ceil(count / 100);
            const baseBatchPrice = PRICING.data.basePerBatch * typeData.mult;
            let subtotal = baseBatchPrice * batches;

            breakdown.push({ label: `${typeData.label} (~${count} data)`, price: subtotal });

            // Discount
            let discount = 0;
            if (count >= 5000) discount = 0.3;
            else if (count >= 1000) discount = 0.2;
            else if (count >= 500) discount = 0.1;

            if (discount > 0) {
                const diskonVal = subtotal * discount;
                subtotal -= diskonVal;
                breakdown.push({ label: `Volume Discount (${discount * 100}%)`, price: -diskonVal });
            }

            total = subtotal;
        }

        // Display Result
        renderResult(total, breakdown);
    }

    function renderResult(total, breakdown) {
        const container = document.getElementById('resultBreakdown');
        const totalEl = document.getElementById('calcTotal');
        const rangeEl = document.getElementById('calcRange');

        // Fill Breakdown
        container.innerHTML = breakdown.map(item => `
            <div class="breakdown-item">
                <span>${item.label}</span>
                <span>${formatCurrency(item.price)}</span>
            </div>
        `).join('');

        // Fill Total
        totalEl.textContent = formatCurrency(total);

        // Range (±10%)
        const min = total * 0.9;
        const max = total * 1.1;
        rangeEl.textContent = `Estimasi Range: ${formatCurrency(min)} - ${formatCurrency(max)}`;

        // Setup WhatsApp Link
        const waBtn = document.getElementById('calcWaBtn');
        const text = `Halo ASPYRE, saya sudah hitung estimasi harga untuk layanan ${state.service.toUpperCase()}.\n\n` +
            `Estimasi: ${formatCurrency(total)}\n` +
            `Detail: \n${breakdown.map(b => `- ${b.label}: ${formatCurrency(b.price)}`).join('\n')}\n\n` +
            `Bisa diskusi lebih lanjut?`;

        waBtn.onclick = () => {
            window.location.href = `https://wa.me/6285729715555?text=${encodeURIComponent(text)}`;
        }
    }

    function formatCurrency(num) {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num);
    }

})();
