# > Web Portfolio & GitHub Repo Fetcher

Un portofoliu web simplu și curat, cu un design inspirat din estetica terminalelor de Linux. Proiectul se conectează la API-ul GitHub pentru a prelua și afișa automat repository-urile publice, permițând căutarea și filtrarea lor rapidă. 

Pentru a păstra datele în siguranță, interfața nu comunică direct cu GitHub, ci folosește un intermediar (un proxy Node.js) care ascunde cheia de acces.

## Funcționalități

- **Sincronizare cu GitHub:** Proiectele nu sunt scrise manual în cod, ci sunt încărcate direct de pe profilul de GitHub.
- **Căutare și Filtrare:** Poți căuta un proiect după nume sau poți filtra lista în funcție de limbajul de programare folosit, totul întâmplându-se instant pe pagină.
- **Backend de siguranță:** Folosește un mini-server pe Vercel strict pentru a proteja token-ul de acces GitHub de browser.
- **Paginare:** Dacă sunt multe proiecte, acestea sunt afișate treptat (câte 6) printr-un buton de „Load More” pentru a nu aglomera ecranul.
- **Design Responsiv:** Interfața este construită cu Tailwind CSS, folosind paleta de culori închise Catppuccin, și se adaptează pe orice ecran.

## Tehnologii Folosite

- **Frontend:** HTML5, JavaScript (Vanilla), Tailwind CSS
- **Backend / Proxy:** Node.js 
- **Date:** GitHub API
- **Hosting:** Vercel

## Instalare si Rulare Locală

1. **Descarcă proiectul:**
   ```bash
   git clone [https://github.com/marios8995/web-cv.git](https://github.com/marios8995/web-cv.git)
   cd web-cv
   ```

2. **Instalează Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

3. **Configurează token-ul de acces:**
   - Redenumește `.env.template` în `.env`
   - Generează un Personal Access Token (PAT) din GitHub
   - Pune token-ul în `.env` după `GITHUB_TOKEN=`

4. **Pornește serverul local:**
   ```bash
   vercel dev
   ```

5. **Deschide browser-ul:**
   Accesează `http://localhost:3000` pentru a vedea pagina
