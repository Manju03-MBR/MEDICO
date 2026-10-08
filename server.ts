import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Initialize GoogleGenAI
const ai = new GoogleGenAI();

interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

// POST /api/chat: Multi-turn chat endpoint with optional Google Search Grounding and model selection
app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const {
      message,
      history = [],
      model = 'gemini-3.5-flash',
      enableSearch = false,
      patientContext,
    } = req.body;

    if (!message || typeof message !== 'string') {
      res.status(400).json({ error: 'Message is required' });
      return;
    }

    // Role-specific clinical system instruction
    const systemInstruction = `You are the PrecisionDose XAI Assistant, an expert Clinical Pharmacologist and Precision Oncology/Cardiology AI grounded in the IEEE Access 2026 research paper: "Drug and Dosage Recommendation Based on Explainable Generative AI Using Patient-Specific Modeling" (Daglarli, 2026).
Your role is to assist healthcare providers, clinical pharmacists, and medical researchers in interpreting patient digital twin simulations, pharmacogenomic variants (e.g., CYP2D6, CYP2C19, SLCO1B1), renal filtration (eGFR), cardiac repolarization (QTc interval), and drug-drug interactions.
${
  patientContext
    ? `\nCURRENT PATIENT TWIN CONTEXT:\n${JSON.stringify(patientContext, null, 2)}\n`
    : ''
}
Provide rigorous, evidence-based clinical reasoning citing PharmGKB, CPIC, and FDA guidance where applicable. Always remind clinicians to exercise clinical judgment before administering any therapy.`;

    // Map conversation history to GenAI contents format
    const contents: any[] = [];
    for (const h of history as ChatMessage[]) {
      contents.push({
        role: h.role === 'user' ? 'user' : 'model',
        parts: [{ text: h.text }],
      });
    }

    // Append latest user message
    contents.push({
      role: 'user',
      parts: [{ text: message }],
    });

    const config: any = {
      systemInstruction,
    };

    if (enableSearch) {
      config.tools = [{ googleSearch: {} }];
    }

    // Call Gemini API via @google/genai SDK
    const response = await ai.models.generateContent({
      model: model || 'gemini-3.5-flash',
      contents,
      config,
    });

    const replyText = response.text || '';

    // Extract search grounding chunks if available
    const groundingChunks =
      response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const webSearchSources = groundingChunks
      .filter((chunk: any) => chunk.web?.uri)
      .map((chunk: any) => ({
        title: chunk.web?.title || 'Web Reference',
        uri: chunk.web?.uri,
      }));

    res.json({
      text: replyText,
      sources: webSearchSources,
      modelUsed: model,
    });
  } catch (err: any) {
    console.error('Gemini API Error:', err);
    res.status(500).json({
      error: err.message || 'Internal error processing clinical AI request',
    });
  }
});

// Mount Vite middleware in development or serve static files in production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
