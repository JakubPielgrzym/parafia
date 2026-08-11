/**
 * Parafia Koziebrody – skrypty + dynamiczne renderowanie danych
 */

// Funkcja bezpiecznego escape'owania HTML
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Funkcja zamiany nowej linii na <br>
function nl2br(text) {
    return escapeHtml(text).replace(/\n/g, '<br>');
}

// Renderowanie aktualności
function renderNews() {
    const container = document.getElementById('newsGrid');
    if (!container || !window.PARAFIA_DATA) return;

    container.innerHTML = PARAFIA_DATA.news.map((item, i) => `
        <article class="news-card" style="animation-delay: ${i * 0.1}s">
            <div class="news-date">
                <span class="day">${escapeHtml(item.day)}</span>
                <span class="month">${escapeHtml(item.month)}</span>
            </div>
            <div class="news-content">
                <h3>${escapeHtml(item.title)}</h3>
                <p>${escapeHtml(item.desc)}</p>
            </div>
        </article>
    `).join('');
}

// Renderowanie ogłoszeń
function renderAnnouncements() {
    if (!window.PARAFIA_DATA) return;

    const titleEl = document.getElementById('annTitle');
    const bodyEl = document.getElementById('annBody');
    if (!titleEl || !bodyEl) return;

    titleEl.textContent = PARAFIA_DATA.announcements.title;
    bodyEl.innerHTML = PARAFIA_DATA.announcements.items.map((item, i) => {
        const num = i + 1;
        return `<p><strong>${num}.</strong> ${escapeHtml(item)}</p>`;
    }).join('');
}

// Renderowanie Mszy Świętych
function renderMass() {
    if (!window.PARAFIA_DATA) return;

    const weekdaysEl = document.getElementById('massWeekdays');
    const sundaysEl = document.getElementById('massSundays');
    const sacramentsEl = document.getElementById('massSacraments');

    if (weekdaysEl) {
        weekdaysEl.innerHTML = PARAFIA_DATA.mass.weekdays.map(m => `
            <li><span class="mass-time">${escapeHtml(m.time)}</span> 
                <span class="mass-note">${escapeHtml(m.note)}</span></li>
        `).join('');
    }

    if (sundaysEl) {
        sundaysEl.innerHTML = PARAFIA_DATA.mass.sundays.map(m => `
            <li><span class="mass-time">${escapeHtml(m.time)}</span> 
                <span class="mass-note">${escapeHtml(m.note)}</span></li>
        `).join('');
    }

    if (sacramentsEl) {
        sacramentsEl.innerHTML = PARAFIA_DATA.mass.sacraments.map(m => `
            <li><span class="mass-label">${escapeHtml(m.label)}</span> 
                <span>${escapeHtml(m.value)}</span></li>
        `).join('');
    }
}

// Renderowanie kancelarii
function renderOffice() {
    if (!window.PARAFIA_DATA) return;

    const hoursEl = document.getElementById('officeHours');
    const noteEl = document.getElementById('officeNote');
    const mattersEl = document.getElementById('officeMatters');

    if (hoursEl) {
        hoursEl.innerHTML = PARAFIA_DATA.office.hours.map(h => `
            <tr><td>${escapeHtml(h.day)}</td><td>${escapeHtml(h.time)}</td></tr>
        `).join('');
    }

    if (noteEl) {
        noteEl.textContent = PARAFIA_DATA.office.note;
    }

    if (mattersEl) {
        mattersEl.innerHTML = PARAFIA_DATA.office.matters.map(m => `
            <li>${escapeHtml(m)}</li>
        `).join('');
    }
}

// Renderowanie kontaktu
function renderContact() {
    if (!window.PARAFIA_DATA) return;

    const infoEl = document.getElementById('contactInfo');
    if (!infoEl) return;

    const c = PARAFIA_DATA.contact;
    infoEl.innerHTML = `
        <div class="contact-item">
            <span class="contact-icon">📍</span>
            <div>
                <strong>Adres</strong>
                <p>${nl2br(c.address)}</p>
            </div>
        </div>
        <div class="contact-item">
            <span class="contact-icon">📞</span>
            <div>
                <strong>Telefon</strong>
                <p>${escapeHtml(c.phone)}</p>
            </div>
        </div>
        <div class="contact-item">
            <span class="contact-icon">✉️</span>
            <div>
                <strong>E-mail</strong>
                <p>${escapeHtml(c.email)}</p>
            </div>
        </div>
        <div class="contact-item">
            <span class="contact-icon">🌐</span>
            <div>
                <strong>Diecezja</strong>
                <p>Diecezja Płocka, Dekanat Raciąski</p>
            </div>
        </div>
    `;
}

// Inicjalizacja wszystkich sekcji
function initData() {
    renderNews();
    renderAnnouncements();
    renderMass();
    renderOffice();
    renderContact();
}

// ========================================
// UI – menu, scroll, animacje
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    // Renderowanie danych
    initData();

    // Rok w stopce
    const yearSpan = document.getElementById('year');
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();

    // Mobile menu toggle
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            const spans = navToggle.querySelectorAll('span');
            if (navMenu.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });

        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                const spans = navToggle.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            });
        });
    }

    // Navbar shadow on scroll
    const navbar = document.getElementById('navbar');
    if (navbar) {
        window.addEventListener('scroll', function() {
            navbar.style.boxShadow = window.pageYOffset > 100 
                ? '0 4px 20px rgba(0,0,0,0.08)' 
                : 'none';
        });
    }

    // Reveal animations
    const revealElements = document.querySelectorAll('.news-card, .mass-card, .office-card, .contact-item');

    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

        revealElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            revealObserver.observe(el);
        });
    } else {
        revealElements.forEach(el => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        });
    }
});
