// Floating Chat Functionality
(function initFloatingChat() {
    // Config
    const CONFIG = {
        autoOpenDelay: 2500, // 2.5s
        autoHideDelay: 8000, // 8s (if no interaction)
        number: '6285729715555',
        email: 'aspyre.ai@gmail.com',
        text: 'Halo ASPYRE, saya mau tanya-tanya dulu boleh?'
    };

    const container = document.createElement('div');
    container.className = 'floating-chat-container';
    container.innerHTML = `
        <div class="chat-popup" id="chatPopup">
            <div class="chat-header">
                <h3>Butuh Bantuan?</h3>
                <p>Tim kami siap membantu Anda 👋</p>
                <button class="close-chat" id="closeChatBtn">×</button>
            </div>
            <div class="chat-body">
                <a href="https://wa.me/${CONFIG.number}?text=${encodeURIComponent(CONFIG.text)}" target="_blank" class="contact-item" onclick="trackChat('whatsapp')">
                    <div class="contact-icon" style="background: rgba(102, 126, 234, 0.2); color: #667eea;">
                        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                    </div>
                    <div class="contact-info">
                        <h4>WhatsApp</h4>
                        <span>Fast Response (&lt;5 mins)</span>
                    </div>
                </a>
                
                <a href="#kontak" class="contact-item" onclick="trackChat('form'); document.querySelector('#kontak').scrollIntoView({behavior:'smooth'});">
                   <div class="contact-icon" style="background: rgba(102, 126, 234, 0.2); color: #667eea;">
                        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                    </div>
                    <div class="contact-info">
                        <h4>Isi Form Order</h4>
                        <span>Untuk project detail</span>
                    </div>
                </a>
            </div>
        </div>
        <button class="chat-btn" id="chatBtn" aria-label="Open Chat">
            <div class="chat-icon">
                <svg viewBox="0 0 24 24" width="28" height="28" fill="white"><path d="M12 2C6.477 2 2 6.477 2 12c0 1.821.487 3.53 1.338 5L2.5 21.5l4.5-1.838A9.955 9.955 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18c-1.476 0-2.886-.313-4.156-.878l-3.156 1.288.89-3.156A7.971 7.971 0 014 12c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8z"/></svg>
            </div>
            <span class="chat-badge" id="chatBadge">1</span>
        </button>
    `;

    document.body.appendChild(container);

    const popup = document.getElementById('chatPopup');
    const btn = document.getElementById('chatBtn');
    const closeBtn = document.getElementById('closeChatBtn');
    const badge = document.getElementById('chatBadge');

    // Toggle logic
    function toggleChat() {
        const isActive = popup.classList.contains('active');
        if (isActive) {
            popup.classList.remove('active');
        } else {
            popup.classList.add('active');
            badge.style.display = 'none'; // Hide badge once opened
            localStorage.setItem('aspyre_chat_seen', 'true');
        }
    }

    btn.addEventListener('click', toggleChat);
    closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        popup.classList.remove('active');
    });

    // Outside click close
    document.addEventListener('click', (e) => {
        if (!container.contains(e.target) && popup.classList.contains('active')) {
            popup.classList.remove('active');
        }
    });

    // Auto Open
    if (!localStorage.getItem('aspyre_chat_seen')) {
        setTimeout(() => {
            popup.classList.add('active');
            // Auto hide if ignored
            setTimeout(() => {
                if (popup.classList.contains('active')) {
                    popup.classList.remove('active');
                }
            }, CONFIG.autoHideDelay);
        }, CONFIG.autoOpenDelay);
    } else {
        badge.style.display = 'none';
    }

    // Analytics Helper
    window.trackChat = (type) => {
        console.log(`Chat click: ${type}`);
        // Add GA/Pixel here later
    };

})();
