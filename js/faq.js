// FAQ Logic
(function initFAQ() {
    // Tab Switching
    const tabs = document.querySelectorAll('.faq-tab');
    const contents = document.querySelectorAll('.faq-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active
            tabs.forEach(t => t.classList.remove('active'));
            contents.forEach(c => c.classList.remove('active'));

            // Add active
            tab.classList.add('active');
            const targetId = tab.getAttribute('data-target');
            document.getElementById(targetId).classList.add('active');
        });
    });

    // Accordion
    const questions = document.querySelectorAll('.faq-question');

    questions.forEach(q => {
        q.addEventListener('click', function () {
            const item = this.parentElement;
            const answer = this.nextElementSibling;

            const isActive = item.classList.contains('active');

            // Close others (Optional - Accordion Style)
            /*
            document.querySelectorAll('.faq-item').forEach(other => {
                if(other !== item) {
                    other.classList.remove('active');
                    other.querySelector('.faq-answer').style.maxHeight = null;
                }
            });
            */

            item.classList.toggle('active');

            if (!isActive) {
                answer.style.maxHeight = answer.scrollHeight + 'px';
            } else {
                answer.style.maxHeight = null;
            }

            // Aria
            const expanded = this.getAttribute('aria-expanded') === 'true' || false;
            this.setAttribute('aria-expanded', !expanded);
        });
    });

})();
