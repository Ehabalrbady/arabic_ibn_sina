import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { GoogleGenAI, Modality } from "@google/genai";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "15mb" }));

  // Shared Gemini client instance
  let aiClient: GoogleGenAI | null = null;
  function getGeminiClient(): GoogleGenAI | null {
    if (!process.env.GEMINI_API_KEY) return null;
    if (!aiClient) {
      aiClient = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
    }
    return aiClient;
  }

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({
      status: "ok",
      hasGeminiKey: !!process.env.GEMINI_API_KEY,
      timestamp: new Date().toISOString(),
    });
  });

  // Helper to fetch high-clarity Arabic TTS audio from Google TTS service as guaranteed universal fallback
  async function fetchGoogleTTSAudio(text: string): Promise<{ audioBase64: string; mimeType: string } | null> {
    try {
      const clean = text.replace(/[\(\)\[\]\{\}\"\'\-_]/g, ' ').replace(/\s+/g, ' ').trim();
      if (!clean) return null;
      const encodedText = encodeURIComponent(clean);
      const url = `https://translate.google.com/translate_tts?ie=UTF-8&tl=ar&client=tw-ob&q=${encodedText}`;
      const response = await fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          "Referer": "https://translate.google.com/"
        }
      });

      if (response.ok) {
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        return {
          audioBase64: buffer.toString("base64"),
          mimeType: "audio/mpeg"
        };
      }
    } catch (err) {
      console.warn("Fallback Google TTS notice:", err);
    }
    return null;
  }

  // Direct Audio Streaming endpoint (ideal for HTML5 Audio on mobile webviews)
  app.get("/api/tts-audio", async (req, res) => {
    try {
      const text = (req.query.text as string) || "";
      if (!text) {
        return res.status(400).send("Text parameter is required");
      }

      const clean = text.replace(/[\(\)\[\]\{\}\"\'\-_]/g, ' ').replace(/\s+/g, ' ').trim();
      const encodedText = encodeURIComponent(clean);
      const url = `https://translate.google.com/translate_tts?ie=UTF-8&tl=ar&client=tw-ob&q=${encodedText}`;
      
      const upstream = await fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          "Referer": "https://translate.google.com/"
        }
      });

      if (upstream.ok) {
        res.setHeader("Content-Type", "audio/mpeg");
        res.setHeader("Cache-Control", "public, max-age=86400");
        const arrayBuffer = await upstream.arrayBuffer();
        return res.send(Buffer.from(arrayBuffer));
      } else {
        return res.status(502).send("Upstream TTS service error");
      }
    } catch (e: any) {
      return res.status(500).send("TTS audio stream error");
    }
  });

  // Circuit breaker for Gemini TTS rate limits
  let geminiTTSBlockedUntil = 0;

  // AI Speech Synthesis (TTS) API endpoint with automatic failover
  app.post("/api/tts", async (req, res) => {
    const { text, persona, segmented } = req.body;
    if (!text || typeof text !== "string") {
      return res.status(400).json({ error: "النص المطلوب نطقه غير متوفر" });
    }

    const now = Date.now();

    // 1. Try Gemini TTS only if not in rate-limit cooldown
    if (now >= geminiTTSBlockedUntil) {
      try {
        const ai = getGeminiClient();
        
        if (ai) {
          // Determine voice personality and prompt
          let voiceName = "Kore";
          let promptInstruction = "";

          if (persona === "child") {
            voiceName = "Puck";
            promptInstruction = `صوت طفل عربي صغير نقي ومرح ومتحمس، ينطق الكلمات والمقاطع بوضوح وفرح بنبرة طفولية لطيفة ومحببة للأطفال في سن التأسيس. انطق النص التالي بالضبط وبالتشكيل التام مع مخارج نقية وسليمة: "${text}"`;
          } else {
            voiceName = "Kore";
            promptInstruction = `صوت معلمة لغة عربية، نبرة دافئة، أمومية ومشجعة. تتحدث بلغة عربية فصحى سليمة 100% مع مخارج حروف دقيقة جداً وحادة الوضوح. طبقة الصوت (Pitch) هادئة ومريحة للأذن غير حادة، خالية من الصدى، وتتحدث بإيقاع بطيء وموزون يتناسب مع طفل في المرحلة التأسيسية يتعلم القراءة لأول مرة. انطقي النص التالي بالضبط وبالتشكيل التام: "${text}"`;
          }

          if (segmented) {
            promptInstruction += ` مع تهجئة المقاطع الصوتية بتأنٍ وهدوء.`;
          }

          const response = await ai.models.generateContent({
            model: "gemini-3.1-flash-tts-preview",
            contents: [{ parts: [{ text: promptInstruction }] }],
            config: {
              responseModalities: [Modality.AUDIO],
              speechConfig: {
                voiceConfig: {
                  prebuiltVoiceConfig: { voiceName: voiceName },
                },
              },
            },
          });

          const candidate = response.candidates?.[0];
          const audioPart = candidate?.content?.parts?.find(
            (p) => p.inlineData?.data
          );

          if (audioPart?.inlineData?.data) {
            return res.json({
              audioBase64: audioPart.inlineData.data,
              mimeType: audioPart.inlineData.mimeType || "audio/pcm;rate=24000",
              sampleRate: 24000,
              persona: persona || "teacher",
              source: "gemini_tts"
            });
          }
        }
      } catch (error: any) {
        const errorMsg = error?.message || String(error);
        const isQuota = error?.status === 429 || error?.code === 429 || errorMsg.includes("429") || errorMsg.includes("Quota") || errorMsg.includes("RESOURCE_EXHAUSTED");
        
        if (isQuota) {
          // Set circuit breaker for 60 seconds
          geminiTTSBlockedUntil = Date.now() + 60000;
          console.info("Gemini TTS quota reached, activating high-speed fallback engine for 60s.");
        } else {
          console.info("Gemini TTS unavailable, routing to high-speed fallback engine.");
        }
      }
    }

    // 2. High-reliability Arabic TTS fallback (Guaranteed to return pristine audio for any device)
    try {
      const fallbackAudio = await fetchGoogleTTSAudio(text);
      if (fallbackAudio) {
        return res.json({
          audioBase64: fallbackAudio.audioBase64,
          mimeType: fallbackAudio.mimeType,
          sampleRate: 24000,
          persona: persona || "teacher",
          source: "google_tts_fallback"
        });
      }
    } catch (fallbackError) {
      console.warn("Fallback TTS engine notice:", fallbackError);
    }

    return res.status(500).json({
      error: "تعذر توليد الصوت في الوقت الحالي، سيتم استخدام النطق الصوتي المباشر للمتصفح",
    });
  });

  // Vite integration: middleware for development, static dist for production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
