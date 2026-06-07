let allProjects = [];
let currentFilteredProjects = [];
let displayedCount = 6;

async function fetchProjects() {
    const container = document.getElementById('projects-container');
    container.innerHTML = `<p class="text-mauve font-mono animate-pulse">Se incarca proiectele din GitHub...</p>`;

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
            `<div class="col-span-1 md:col-span-2 border border-red-500/50 bg-red-500/10 p-4 rounded-lg text-center">
                <p class="text-text font-mono text-sm">Nu am putut încărca proiectele momentan. Conexiunea a fost întreruptă.</p>
            </div>`;
    }
}

function renderProjects(projects) {
    const container = document.getElementById('projects-container');
    const loadMoreContainer = document.getElementById('load-more-container');
    container.innerHTML = '';

    if (projects.length === 0) {
        container.innerHTML = `<p class="text-text opacity-70 col-span-2 text-center py-10 font-mono">Nu s-au găsit proiecte conform filtrelor aplicate.</p>`;
        if (loadMoreContainer) loadMoreContainer.classList.add('hidden');
        return;
    }

    const projectsToShow = projects.slice(0, displayedCount);

    projectsToShow.forEach(repo => {
        const description = repo.description || "Fără descriere disponibilă.";
        const language = repo.language || "N/A";
        const card = document.createElement('div');
        card.className = "bg-[#242536] border border-surface p-5 rounded-lg flex flex-col hover:border-mauve transition-colors shadow-lg group";
        card.innerHTML =
            `<div class="mb-2">
                <h3 class="text-lg font-bold text-mauve font-mono break-words group-hover:text-peach transition-colors">${repo.name}</h3>
            </div>
            <p class="text-sm opacity-80 mb-4 flex-grow leading-relaxed">${description}</p>
            
            <div class="flex flex-wrap items-center gap-4 text-xs font-mono mb-5 opacity-90">
                <span class="text-peach flex items-center gap-1">${language}</span>
                <span class="flex items-center gap-1">✱ ${repo.stargazers_count}</span>
                <span class="flex items-center gap-1">⤙ ${repo.forks_count}</span>
            </div>
            
            <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" 
               class="mt-auto block bg-base hover:bg-mauve hover:text-base border border-surface hover:border-mauve text-center py-2 rounded text-sm font-mono transition-all">
               ./open_repository
            </a>`;
        container.appendChild(card);
    });

    if(projects.length > displayedCount) {
        loadMoreContainer.classList.remove('hidden');
    }
    else {
        loadMoreContainer.classList.add('hidden');
    }
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
document.addEventListener('DOMContentLoaded', fetchProjects);
document.getElementById('load-more-btn')?.addEventListener('click', () => {
    displayedCount += 6;
    renderProjects(currentFilteredProjects);
});
