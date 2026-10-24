let allProjects = [];
let currentFilteredProjects = [];
let displayedCount = 6;

function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (!hamburger || !navMenu) return;

    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
}

function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.scroll-animate').forEach(el => {
        observer.observe(el);
    });
}

function validateField(fieldName, field, errorElement) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';

    switch (fieldName) {
        case 'name':
            const nameRegex = /^[a-zA-ZăâîșțĂÂÎȘȚ\s]+$/;
            if (value.length < 2 || !nameRegex.test(value)) {
                isValid = false;
                errorMessage = 'Numele trebuie să conțină minim 2 caractere (doar litere și spații).';
            }
            break;

        case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Introdu o adresă de email validă.';
            }
            break;

        case 'phone':
            const phoneRegex = /^[0-9\s\-()]+$/;
            if (value !== '' && !phoneRegex.test(value)) {
                isValid = false;
                errorMessage = 'Telefonul poate conține doar cifre, spații, cratime și paranteze.';
            }
            break;

        case 'message':
            if (value.length < 10 || value.length > 1000) {
                isValid = false;
                errorMessage = 'Mesajul este obligatoriu și trebuie să aibă între 10 și 1000 de caractere.';
            }
            break;
    }

    if (errorElement) {
        if (!isValid) {
            errorElement.textContent = errorMessage;
            errorElement.classList.remove('hidden');
            field.classList.add('input-error');
        } else {
            errorElement.textContent = '';
            errorElement.classList.add('hidden');
            field.classList.remove('input-error');
        }
    }

    return isValid;
}

function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    const fields = ['name', 'email', 'phone', 'message'];
    const messageCounter = document.getElementById('message-counter');
    const formStatus = document.getElementById('form-status');

    fields.forEach(fieldName => {
        const field = document.getElementById(fieldName);
        const errorElement = document.getElementById(`${fieldName}-error`);
        if (!field) return;

        field.addEventListener('input', () => {
            if (fieldName === 'message' && messageCounter) {
                const len = field.value.trim().length;
                messageCounter.textContent = `${len} / 1000`;
                if (len < 10 || len > 1000) {
                    messageCounter.classList.add('counter-invalid');
                    messageCounter.classList.remove('counter-valid');
                } else {
                    messageCounter.classList.remove('counter-invalid');
                    messageCounter.classList.add('counter-valid');
                }
            }
            validateField(fieldName, field, errorElement);
        });

        field.addEventListener('blur', () => {
            validateField(fieldName, field, errorElement);
        });
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        let isFormValid = true;

        fields.forEach(fieldName => {
            const field = document.getElementById(fieldName);
            const errorElement = document.getElementById(`${fieldName}-error`);
            if (field && !validateField(fieldName, field, errorElement)) {
                isFormValid = false;
            }
        });

        if (formStatus) {
            formStatus.classList.remove('hidden', 'status-error', 'status-success');
            if (isFormValid) {
                formStatus.textContent = '✓ Mesajul a fost validat și trimis cu succes!';
                formStatus.classList.add('status-success');
                form.reset();
                if (messageCounter) {
                    messageCounter.textContent = '0 / 1000';
                    messageCounter.classList.remove('counter-valid', 'counter-invalid');
                }
            } else {
                formStatus.textContent = '✕ Te rugăm să corectezi câmpurile marcate înainte de trimitere.';
                formStatus.classList.add('status-error');
            }
        }
    });
}

async function fetchProjects() {
    const container = document.getElementById('projects-container');
    if (!container) return;

    container.innerHTML = `<p class="mono-mauve col-span-full">Se încarcă proiectele din GitHub...</p>`;

    try {
        const response = await fetch('/api/github');

        if (!response.ok) {
            throw new Error('Eroare la conectarea cu serverul proxy.');
        }

        const data = await response.json();
        allProjects = data.filter(repo => repo.fork === false);
        allProjects.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));

        currentFilteredProjects = [...allProjects];

        populateLanguageFilter(allProjects);
        renderProjects(currentFilteredProjects);
    } catch (error) {
        console.error("Eroare fetch:", error);
        container.innerHTML =
            `<div class="form-status status-error col-span-full">
                <p>Nu am putut încărca proiectele momentan. Conexiunea a fost întreruptă.</p>
            </div>`;
    }
}

function renderProjects(projects) {
    const container = document.getElementById('projects-container');
    const loadMoreContainer = document.getElementById('load-more-container');
    if (!container) return;
    container.innerHTML = '';

    if (projects.length === 0) {
        container.innerHTML = `<p class="mono-mauve col-span-full">Nu s-au găsit proiecte conform filtrelor aplicate.</p>`;
        if (loadMoreContainer) loadMoreContainer.classList.add('hidden');
        return;
    }

    const projectsToShow = projects.slice(0, displayedCount);

    projectsToShow.forEach(repo => {
        const description = repo.description || "Fără descriere disponibilă.";
        const language = repo.language || "N/A";
        const card = document.createElement('div');
        card.className = "scroll-animate card project-card";
        card.innerHTML =
            `<h3 class="project-title">${repo.name}</h3>
            <p class="project-desc">${description}</p>
            
            <div class="project-stats">
                <span class="mono-peach">${language}</span>
                <span>✱ ${repo.stargazers_count}</span>
                <span>⤙ ${repo.forks_count}</span>
            </div>
            
            <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" class="btn btn-primary">
               ./open_repository
            </a>`;
        container.appendChild(card);
    });

    if (projects.length > displayedCount) {
        loadMoreContainer.classList.remove('hidden');
    } else {
        loadMoreContainer.classList.add('hidden');
    }

    initScrollAnimations();
}

function populateLanguageFilter(projects) {
    const languageFilter = document.getElementById('language-filter');
    if (!languageFilter) return;
    const languages = new Set();

    projects.forEach(repo => {
        if (repo.language) languages.add(repo.language);
    });

    languages.forEach(lang => {
        const option = document.createElement('option');
        option.value = lang;
        option.textContent = lang;
        languageFilter.appendChild(option);
    });
}

function handleFilters() {
    const searchTerm = document.getElementById('search-input')?.value.toLowerCase() || '';
    const selectedLanguage = document.getElementById('language-filter')?.value || 'all';
    
    currentFilteredProjects = allProjects.filter(repo => {
        const matchesSearch = repo.name.toLowerCase().includes(searchTerm) ||
                            (repo.description && repo.description.toLowerCase().includes(searchTerm));
        const matchesLanguage = selectedLanguage === 'all' || repo.language === selectedLanguage;
        return matchesSearch && matchesLanguage;
    });
    displayedCount = 6;
    renderProjects(currentFilteredProjects);
}

document.getElementById('search-input')?.addEventListener('input', handleFilters);
document.getElementById('language-filter')?.addEventListener('change', handleFilters);
document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    initScrollAnimations();
    initContactForm();
    fetchProjects();
});
document.getElementById('load-more-btn')?.addEventListener('click', () => {
    displayedCount += 6;
    renderProjects(currentFilteredProjects);
});