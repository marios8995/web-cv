export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    const token = process.env.GITHUB_TOKEN;
    const endpoint = "https://api.github.com/users/marios8995/repos?per_page=100";

    try {
        const response = await fetch(endpoint, {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Accept": "application/vnd.github.v3+json"
            }
        });
        if (!response.ok) {
            return res.status(response.status).json({
                error: "Eroare la preluarea datelor de la Github."
            });
        }
        const data = await response.json();
        return res.status(200).json(data)
    } catch (error) {
        return res.status(500).json({
            error: "Eroare interna a serverului proxy."
        });
    }
}
