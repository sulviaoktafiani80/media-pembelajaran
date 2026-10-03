import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const isProd = process.env.NODE_ENV === 'production';

app.use(express.json());

// Initialize Gemini SDK with User-Agent header as required
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Socratic AI Teacher System Instruction
const SYSTEM_INSTRUCTION = `Anda adalah "Bu Nurhidayati / Guru Fisika Mantang", guru Fisika SMA Negeri 1 Mantang yang ramah, mendidik, dan berwawasan luas.
Karakter dan Metode Bimbingan:
1. Siswa yang Anda bimbing adalah siswa SMA. Gunakan Bahasa Indonesia yang hangat, bersahabat, jelas, dan memotivasi ("Halo Nak!", "Semangat belajarnya ya!").
2. Utamakan Pemahaman Konsep (Socratic Method):
   - Jika siswa menanyakan soal fisika atau meminta jawaban langsung, JANGAN langsung memberikan jawaban akhir secara instan!
   - Berikan petunjuk terarah (clues), ajak siswa mengidentifikasi apa yang "Diketahui" dan "Ditanya", lalu tanyakan rumus dasar apa yang relevan.
   - Hanya berikan langkah penyelesaian lengkap jika siswa sudah mencoba menjawab atau meminta penjelasan langkah demi langkah secara tegas.
3. Tuliskan notasi matematika, variabel, dan satuan SI secara rapi dan konsisten (misalnya: P = ρ × g × h, F₁/A₁ = F₂/A₂, Fa = ρ_fluida × g × V_tercelup).
4. Berikan analogi nyata kontekstual, misalnya penyelam di laut sekitar pulau Lombok/NTB, bendungan air, dongkrak hidrolik di bengkel Mantang, dan kapal laut.
5. Tetap ringkas, terstruktur (gunakan poin/bullet), dan mudah dibaca di layar HP maupun laptop.`;

// API Route for Tanya Fisika Chat
app.post('/api/chat', async (req: Request, res: Response): Promise<void> => {
  const { messages, currentTopic } = req.body;

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    res.status(400).json({ error: 'Format pesan tidak valid' });
    return;
  }

  const lastUserMessage = messages[messages.length - 1]?.content || '';

  // Fallback physics tutor logic if API key is missing or service unavailable
  const generateFallbackResponse = (query: string): string => {
    const q = query.toLowerCase();
    if (q.includes('tekanan hidrostatis') || q.includes('p = rho') || q.includes('penyelam')) {
      return `Halo Nak! Pertanyaan yang sangat bagus tentang **Tekanan Hidrostatis**.\n\nMari kita telaah konsep dasarnya:\nTekanan hidrostatis adalah tekanan yang diakibatkan oleh berat fluida itu sendiri pada kedalaman tertentu.\n\n📌 **Rumus Utama:**\n**P_h = ρ × g × h**\n- ρ (rho) = massa jenis fluida (satuan SI: kg/m³)\n- g = percepatan gravitasi (m/s², biasanya 9,8 atau 10 m/s²)\n- h = kedalaman diukur dari *permukaan air*, bukan dari dasar! (meter)\n\n💡 **Petunjuk untuk soalmu:**\nCoba periksa di soalmu:\n1. Berapa massa jenis cairannya? (Air tawar = 1.000 kg/m³, air laut ≈ 1.025 kg/m³)\n2. Berapa nilai kedalaman *h* dari permukaan?\n\nKira-kira nilai apa saja yang sudah kamu temukan di soal? Coba sebutkan, nanti kita hitung bersama!`;
    }
    if (q.includes('pascal') || q.includes('dongkrak') || q.includes('piston')) {
      return `Halo! **Hukum Pascal** adalah salah satu konsep paling aplikatif dalam kehidupan sehari-hari, seperti pada dongkrak hidrolik bengkel.\n\nPrinsipnya: *"Tekanan yang diberikan pada zat cair dalam ruang tertutup akan diteruskan ke segala arah dengan sama besar."*\n\n📌 **Persamaan Pascal:**\n**P₁ = P₂**\n**(F₁ / A₁) = (F₂ / A₂)** atau **F₂ = F₁ × (A₂ / A₁)**\n\n💡 **Tips Mengerjakan:**\nKarena piston umumnya berbentuk lingkaran dengan luas $A = \\pi r^2$ atau $\\frac{1}{4} \\pi d^2$, maka rasio gayanya sebanding dengan kuadrat perbandingan diameternya:\n**F₂ / F₁ = (d₂ / d₁)²**\n\nCoba sebutkan diameter piston kecil dan besarnya, berapa gaya yang kamu miliki?`;
    }
    if (q.includes('archimedes') || q.includes('apung') || q.includes('tenggelam') || q.includes('melayang')) {
      return `Halo calon fisikawan hebat! Konsep **Hukum Archimedes** berbicara tentang Gaya Ke Atas (Gaya Apung / Buoyant Force).\n\n📌 **Hukum Archimedes berbunyi:**\n*"Gaya apung yang bekerja pada suatu benda sama dengan berat fluida yang dipindahkan oleh benda tersebut."*\n\n**Rumus Gaya Apung:**\n**Fa = ρ_fluida × g × V_celup**\n(Ingat ya, *V_celup* adalah volume benda yang tercelup saja, bukan selalu volume total!)\n\n⚖️ **Syarat Keadaan Benda:**\n- **Terapung:** ρ_benda < ρ_fluida (Fa = W_benda)\n- **Melayang:** ρ_benda = ρ_fluida (Fa = W_benda)\n- **Tenggelam:** ρ_benda > ρ_fluida (Fa < W_benda)\n\nAda soal spesifik yang ingin kamu bahas tentang volume tercelupnya? Coba tuliskan di sini!`;
    }
    return `Halo Nak! Senang sekali kamu aktif bertanya tentang fisika. 🌟\n\nUntuk pertanyaanmu ini, mari kita mulai dari identifikasi konsep terlebih dahulu:\n1. Fenomena apa yang sedang terjadi dalam persoalan ini?\n2. Variabel apa saja yang diketahui (misal: massa $m$, volume $V$, kedalaman $h$, luas $A$)?\n3. Besaran apa yang sedang dicari?\n\nCoba bagikan rincian angka atau kalimat soalnya, Bu guru akan bantu berikan petunjuk langkah demi langkah tanpa langsung memberi bocoran jawaban agar kamu benar-benar paham konsepnya!`;
  };

  if (!ai) {
    // Return high-quality physics tutor fallback
    res.json({ reply: generateFallbackResponse(lastUserMessage) });
    return;
  }

  try {
    // Format conversation history for Gemini API
    const formattedContents = messages.map((m: { role: string; content: string }) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: formattedContents,
      config: {
        systemInstruction: `${SYSTEM_INSTRUCTION}\n\nTopik materi saat ini: ${currentTopic || 'Fluida Statis SMA'}.`,
        temperature: 0.7,
        topP: 0.9,
      },
    });

    const reply = response.text || generateFallbackResponse(lastUserMessage);
    res.json({ reply });
  } catch (error) {
    console.error('Error in Gemini API call:', error);
    // Graceful fallback so student is never blocked
    res.json({ reply: generateFallbackResponse(lastUserMessage) });
  }
});

// Seed API endpoint for quick status
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    appName: 'Fisika Mantang',
    school: 'SMA Negeri 1 Mantang',
    hasApiKey: !!apiKey,
  });
});

// Mount Vite or serve static
async function startServer() {
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get('*', (_req, res) => {
        res.sendFile(path.resolve(distPath, 'index.html'));
      });
    }
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Fisika Mantang server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
