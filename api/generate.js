export default async function handler(req, res) {
    // Membuka jalur akses agar form aktivasi bisa berkomunikasi dengan server ini
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    const { url } = req.query;
    if (!url) return res.status(400).json({ error: "Link Maps tidak ditemukan" });

    try {
        // Server Anda akan mengunjungi link Maps menggunakan identitas browser resmi agar tidak diblokir Google
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.5'
            },
            redirect: 'follow'
        });

        const html = await response.text();
        
        // Memindai seluruh kode sumber Google Maps untuk mencari Place ID rahasia (selalu diawali ChIJ)
        const match = html.match(/(ChIJ[a-zA-Z0-9_-]{20,})/);
        
        if (match && match[1]) {
            // Merakit link ulasan otomatis
            return res.status(200).json({ reviewLink: `https://search.google.com/local/writereview?placeid=${match[1]}` });
        } else {
            return res.status(404).json({ error: "Place ID tidak ditemukan di halaman ini." });
        }
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
