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

  // AI Speech Synthesis (TTS) API endpoint
  app.post("/api/tts", async (req, res) => {
    try {
      const { text, persona, segmented } = req.body;
      if (!text || typeof text !== "string") {
        return res.status(400).json({ error: "النص المطلوب نطقه غير متوفر" });
      }

      const ai = getGeminiClient();
      if (!ai) {
        return res.status(503).json({
          error: "مفتاح الذكاء الاصطناعي GEMINI_API_KEY غير مهيأ في الخادم",
        });
      }

      // Determine voice personality and prompt
      let voiceName = "Kore";
      let promptInstruction = "";

      if (persona === "child") {
        // Child voice persona: Cheerful, clear, sweet child's voice
        voiceName = "Puck";
        promptInstruction = `صوت طفل عربي صغير نقي ومرح ومتحمس، ينطق الكلمات والمقاطع بوضوح وفرح بنبرة طفولية لطيفة ومحببة للأطفال في سن التأسيس. انطق النص التالي بالضبط وبالتشكيل التام مع مخارج نقية وسليمة: "${text}"`;
      } else {
        // Teacher voice persona (default): Warm, maternal, clear Arabic teacher
        voiceName = "Kore";
        promptInstruction = `صوت معلمة لغة عربية، نبرة دافئة، أمومية ومشجعة. تتحدث بلغة عربية فصحى سليمة 100% مع مخارج حروف دقيقة جداً وحادة الوضوح. طبقة الصوت (Pitch) هادئة ومريحة للأذن غير حادة، خالية من الصدى، وتتحدث بإيقاع بطيء وموزون يتناسب مع طفل في المرحلة التأسيسية يتعلم القراءة لأول مرة. انطقي النص التالي بالضبط وبالتشكيل التام: "${text}"`;
      }

      // If segmented spelling requested in prompt
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
        });
      } else {
        return res
          .status(500)
          .json({ error: "لم يتم توليد المقطع الصوتي من النموذج" });
      }
    } catch (error: any) {
      const isQuotaError =
        error?.status === 429 ||
        error?.code === 429 ||
        error?.message?.includes("429") ||
        error?.message?.includes("Quota exceeded") ||
        error?.message?.includes("RESOURCE_EXHAUSTED");

      if (isQuotaError) {
        console.warn("Gemini TTS rate limit reached, triggering seamless client synthesis fallback.");
        return res.status(429).json({
          error: "QUOTA_EXCEEDED",
          message: "تم بلوغ الحد اللحظي للذكاء الاصطناعي، يتم تفعيل النطق الصوتي الفصيح المدمج تلقائياً",
        });
      }

      console.warn("Gemini TTS service notice:", error?.message || error);
      return res.status(500).json({
        error: error?.message || "تعذر توليد الصوت بالذكاء الاصطناعي",
      });
    }
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
