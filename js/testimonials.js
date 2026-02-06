// Testimonials Logic
(function initTestimonials() {
    const data = [
        {
            name: "Budi Santoso",
            role: "Owner, Warung Kopi Nusantara",
            quote: "ASPYRE bikin logo dan banner promo warung kopi saya. Hasilnya keren banget, pelanggan jadi lebih tertarik! Harganya juga masuk akal untuk UMKM kayak saya. Recommended!",
            service: "Logo & Banner Design",
            img: "https://ui-avatars.com/api/?name=Budi+Santoso&background=random&color=fff"
        },
        {
            name: "Siti Aminah",
            role: "Founder, Hijab Style",
            quote: "Website toko online saya dibikin sama ASPYRE, sekarang orderan naik 40%! Customer jadi lebih percaya karena ada website resmi. Thanks ASPYRE!",
            service: "E-Commerce Website",
            img: "https://ui-avatars.com/api/?name=Siti+Aminah&background=ff6b6b&color=fff"
        },
        {
            name: "Agus Prasetyo",
            role: "Manager, Bengkel Motor Jaya",
            quote: "Saya minta dibuatin company profile buat bengkel. Tim ASPYRE sabar banget jelasin, revisi juga cepet. Hasil akhirnya profesional, bengkel saya jadi keliatan lebih modern!",
            service: "Company Profile Website",
            img: "https://ui-avatars.com/api/?name=Agus+Prasetyo&background=4ecdc4&color=fff"
        },
        {
            name: "Rina Wijaya",
            role: "Owner, Catering Mama Rina",
            quote: "ASPYRE bantu entry data menu dan harga catering saya ke Excel. Rapi banget, jadi gampang buat tracking pesanan. Saved my time!",
            service: "Data Entry Services",
            img: "https://ui-avatars.com/api/?name=Rina+Wijaya&background=feca57&color=fff"
        },
        {
            name: "Denny Kurniawan",
            role: "Director, ABC English Course",
            quote: "Konten Instagram kursus saya jadi lebih menarik sejak pakai jasa ASPYRE. Design-nya konsisten, engagement naik signifikan. Worth it banget!",
            service: "Social Media Content",
            img: "https://ui-avatars.com/api/?name=Denny+K&background=5f27cd&color=fff"
        }
    ];

    // Helper: Create HTML
    function createTestimonialHTML() {
        // Find or create container (handled in index.html integration)
        // This script assumes logic attachment
        const track = document.querySelector('.testimonial-track');
        const indicators = document.querySelector('.t-indicators');

        if (!track || !indicators) return;

        track.innerHTML = '';
        indicators.innerHTML = '';

        data.forEach((item, index) => {
            // Card
            const card = document.createElement('div');
            card.className = `testimonial-card ${index === 0 ? 'active' : ''}`;
            card.innerHTML = `
                <div class="t-card-inner">
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
    }

    // State
    let currentIndex = 0;
    let timer = null;
    const interval = 5000;

    function goToSlide(index) {
        const track = document.querySelector('.testimonial-track');
        const cards = document.querySelectorAll('.testimonial-card');
        const dots = document.querySelectorAll('.t-dot');

        if (!track) return;

        currentIndex = index;

        // Loop logic
        if (currentIndex < 0) currentIndex = data.length - 1;
        if (currentIndex >= data.length) currentIndex = 0;

        // Slide Track
        track.style.transform = `translateX(-${currentIndex * 100}%)`;

        // Update Active States
        cards.forEach((card, i) => {
            if (i === currentIndex) card.classList.add('active');
            else card.classList.remove('active');
        });

        dots.forEach((dot, i) => {
            if (i === currentIndex) dot.classList.add('active');
            else dot.classList.remove('active');
        });

        resetTimer();
    }

    function nextSlide() {
        goToSlide(currentIndex + 1);
    }

    function prevSlide() {
        goToSlide(currentIndex - 1);
    }

    function resetTimer() {
        clearInterval(timer);
        timer = setInterval(nextSlide, interval);
    }

    // Listeners - Safe Init
    function init() {
        createTestimonialHTML();

        const nextBtn = document.querySelector('.t-btn.next');
        const prevBtn = document.querySelector('.t-btn.prev');

        if (nextBtn) nextBtn.addEventListener('click', () => {
            nextSlide();
            resetTimer();
        });

        if (prevBtn) prevBtn.addEventListener('click', () => {
            prevSlide();
            resetTimer();
        });

        // Better Touch Handling
        const track = document.querySelector('.testimonial-track');
        if (track) {
            let startX = 0;
            let endX = 0;
            let startY = 0;
            let endY = 0;

            track.addEventListener('touchstart', e => {
                startX = e.changedTouches[0].screenX;
                startY = e.changedTouches[0].screenY;
            }, { passive: true });

            track.addEventListener('touchmove', e => {
                // Prevent vertical scroll if horizontal swipe detected
                const deltaX = Math.abs(e.changedTouches[0].screenX - startX);
                const deltaY = Math.abs(e.changedTouches[0].screenY - startY);

                if (deltaX > deltaY && deltaX > 10) {
                    e.preventDefault();
                }
            }, { passive: false });

            track.addEventListener('touchend', e => {
                endX = e.changedTouches[0].screenX;
                endY = e.changedTouches[0].screenY;

                const deltaX = startX - endX;
                const deltaY = Math.abs(startY - endY);

                // Only trigger if horizontal swipe > vertical swipe
                if (Math.abs(deltaX) > 50 && Math.abs(deltaX) > deltaY) {
                    if (deltaX > 0) {
                        nextSlide();
                    } else {
                        prevSlide();
                    }
                    resetTimer();
                }
            });
        }

        // Start Auto
        resetTimer();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
