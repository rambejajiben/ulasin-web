export default async function handler(req, res) {
    const { url } = req.query;
    
    if (!url) {
        return res.status(400).json({ error: "Link Maps tidak ditemukan" });
    }

    try {
        // Mesin akan mengunjungi link Maps pendek layaknya manusia
        const response = await fetch(url, {
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
        });
        
        const html = await response.text();

        // Menggunakan Regex untuk mencari Place ID Google (selalu berawalan ChIJ)
        const match = html.match(/(ChIJ[a-zA-Z0-9_-]{20,})/);
        
        if (match && match[1]) {
            const placeId = match[1];
            // Merakit link Review otomatis
            const reviewLink = `https://search.google.com/local/writereview?placeid=${placeId}`;
            return res.status(200).json({ placeId, reviewLink });
        } else {
            return res.status(404).json({ error: "Gagal mengekstrak Place ID dari link ini." });
        }
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
