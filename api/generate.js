export default async function handler(req, res) {
    // Mengizinkan website depan berkomunikasi dengan server belakang
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    const { url } = req.query;
    if (!url) return res.status(400).json({ error: "Link Maps tidak ditemukan" });

    try {
        // Server Vercel mengunjungi link Google Maps layaknya manusia
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept-Language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7'
            }
        });

        const html = await response.text();
        
        // Memindai kode rahasia ChIJ (Place ID)
        const match = html.match(/(ChIJ[a-zA-Z0-9_-]{20,})/);
        
        if (match && match[1]) {
            return res.status(200).json({ reviewLink: `https://search.google.com/local/writereview?placeid=${match[1]}` });
        } else {
            return res.status(404).json({ error: "Gagal menemukan ID. Link mungkin bukan milik tempat bisnis publik." });
        }
    } catch (error) {
        return res.status(500).json({ error: "Server Vercel gagal memproses tautan." });
    }
}
