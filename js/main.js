// main.js - handling WhatsApp dynamic number & performance tweak
(function() {
    "use strict";
    // Ganti dengan nomor WhatsApp asli Lombok DevLab
    const DEFAULT_WA = "6281234567890"; // <-- GANTI DENGAN NOMOR AKTIF ANDA
    
    // Update semua link WhatsApp
    const links = document.querySelectorAll('a[href*="wa.me"]');
    links.forEach(link => {
        let href = link.getAttribute('href');
        if (href && href.includes('6281234567890')) {
            let newHref = href.replace(/6281234567890/g, DEFAULT_WA);
            link.setAttribute('href', newHref);
        }
    });
    
    // Floating button WA
    const floatBtn = document.querySelector('.wa-float');
    if(floatBtn && floatBtn.href && floatBtn.href.includes('6281234567890')) {
        floatBtn.href = floatBtn.href.replace(/6281234567890/g, DEFAULT_WA);
    }
    
    // Optional: lazy loading gambar (jika ada gambar di future)
    if ('IntersectionObserver' in window) {
        const images = document.querySelectorAll('img[data-src]');
        const imgObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imgObserver.unobserve(img);
                }
            });
        });
        images.forEach(img => imgObserver.observe(img));
    }
    
    // Smooth scroll untuk anchor link (opsional)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === "#" || targetId === "") return;
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
})();