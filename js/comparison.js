// Comparison Modal Logic
(function initComparisonModal() {
    const modal = document.getElementById('comparisonModal');
    const trigger = document.getElementById('viewComparisonBtn');
    const closeBtn = document.getElementById('closeCompModal');

    if (!modal || !trigger) return;

    function openModal() {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Lock scroll
    }

    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = ''; // Unlock scroll
    }

    trigger.addEventListener('click', (e) => {
        e.preventDefault();
        openModal();
    });

    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }

    // click outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    // Esc key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });

})();
