/**
 * Audio Speech Synthesis & AI Voice Generation Engine for Arabic Learning
 * Features:
 * 1. Two Persona Voice Models:
 *    - "صوت المعلمة الحنونة": Warm, maternal, clear 100% Arabic teacher pacing
 *    - "صوت البطل الصغير": Cheerful, lively child voice with high pitch
 * 2. Real-time Persistence & Broadcast:
 *    - Instant update across all tabs and components via custom event
 * 3. Pedagogical Syllabification & Tanween Simplification:
 *    - Micro-pauses (300ms) between syllables for foundational spelling
 *    - Shaddah expansion and Tanween phonetic substitution
 * 4. Cross-browser Speech Synthesis with cancel-resilience and voice resolution
 */

import { getCachedAudio, saveCachedAudio } from './audioCache';

export type VoicePersona = 'teacher' | 'child';

export interface AudioEngineSettings {
  voicePersona: VoicePersona;     // 'teacher' (المعلمة الحنونة) | 'child' (البطل الصغير)
  rate: number;                    // Speed multiplier (0.4 - 1.5)
  pitch: number;                   // Pitch multiplier (0.5 - 2.0)
  voiceName: string;               // Web Speech synthesis voice fallback
  enableEmphasis: boolean;
  syllableSpelling: boolean;       // Spelling syllable-by-syllable with 300ms pause
  tanweenSimplification: boolean;   // Convert Tanween to Noon Sakinah phonetically
  useAIEngine: boolean;            // Prefer AI studio generation & persistent cache
}

export const PERSONA_INFO: Record<VoicePersona, {
  name: string;
  badge: string;
  description: string;
  icon: string;
  defaultPitch: number;
  defaultRate: number;
  geminiVoice: string;
}> = {
  teacher: {
    name: 'صوت المعلمة الحنونة',
    badge: 'أمومي، فصيح وواضح',
    description: 'صوت معلمة لغة عربية، نبرة دافئة، أمومية ومشجعة، فصيحة وسلسة بمخارج حروف دقيقة وقراءة انسيابية مستمرة دون تقطيع.',
    icon: '👩‍🏫',
    defaultPitch: 1.0,
    defaultRate: 0.85,
    geminiVoice: 'Kore'
  },
  child: {
    name: 'صوت البطل الصغير',
    badge: 'طفولي، مرح ومتحمس',
    description: 'صوت طفل صغير نقي ومرح، ينطق الكلمات بنبرة لطيفة وسلسة وواضحة لتحفيز الأطفال على القراءة.',
    icon: '👦',
    defaultPitch: 1.45,
    defaultRate: 0.90,
    geminiVoice: 'Puck'
  }
};

const DEFAULT_SETTINGS: AudioEngineSettings = {
  voicePersona: 'teacher',
  rate: 0.85,
  pitch: 1.0,
  voiceName: '',
  enableEmphasis: true,
  syllableSpelling: false,
  tanweenSimplification: false,
  useAIEngine: false // Default to reliable instant in-browser phonetic synthesis
};

let synth: SpeechSynthesis | null = null;
let cachedVoices: SpeechSynthesisVoice[] = [];

if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  synth = window.speechSynthesis;
  const updateVoices = () => {
    try {
      cachedVoices = synth?.getVoices() || [];
    } catch (e) {}
  };
  updateVoices();
  if (synth.onvoiceschanged !== undefined) {
    synth.onvoiceschanged = updateVoices;
  }
}


/**
 * Retrieves the stored audio settings
 */
export function getAudioSettings(): AudioEngineSettings {
  try {
    const saved = localStorage.getItem('ibn_sinai_audio_settings');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Ensure smooth continuous reading by default
      return { 
        ...DEFAULT_SETTINGS, 
        ...parsed,
        rate: parsed.rate && parsed.rate >= 0.7 ? parsed.rate : DEFAULT_SETTINGS.rate,
        syllableSpelling: parsed.syllableSpelling === true // keep explicit boolean
      };
    }
  } catch (e) {}
  return DEFAULT_SETTINGS;
}

/**
 * Saves modified audio settings and broadcasts update event
 */
export function saveAudioSettings(settings: Partial<AudioEngineSettings>) {
  try {
    const current = getAudioSettings();
    const updated = { ...current, ...settings };
    localStorage.setItem('ibn_sinai_audio_settings', JSON.stringify(updated));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('ibn_sinai_audio_settings_changed', { detail: updated }));
    }
  } catch (e) {}
}

/**
 * Expands Shaddah (ّ) into a Sukoon letter followed by a vocalized letter
 * for phonetic syllabification.
 * Example: شَدَّ -> شَدْدَ
 */
export function expandShaddah(word: string): string {
  let result = "";
  for (let i = 0; i < word.length; i++) {
    const char = word[i];
    if (i < word.length - 1 && word[i+1] === '\u0651') {
      let harakah = '\u064e'; // default to fatha if none found
      let skipCount = 1;
      if (i < word.length - 2) {
        const nextNext = word[i+2];
        if (['\u064e', '\u064f', '\u0650'].includes(nextNext)) {
          harakah = nextNext;
          skipCount = 2;
        }
      }
      result += char + '\u0652' + char + harakah;
      i += skipCount;
    } else if (char === '\u0651') {
      continue;
    } else {
      result += char;
    }
  }
  return result;
}

/**
 * Splits a single Arabic word into its exact pedagogical syllables.
 */
export function splitArabicIntoSyllables(word: string): string[] {
  if (!word) return [];

  let cleanWord = word.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()؟،?]/g, "").trim();
  if (!cleanWord) return [];

  // Expand Shaddah
  cleanWord = expandShaddah(cleanWord);

  // Build units
  const DIACRITICS = ['\u064e', '\u064f', '\u0650', '\u0652', '\u064b', '\u064c', '\u064d'];
  
  interface LetterUnit {
    letter: string;
    diacritic: string;
  }

  const units: LetterUnit[] = [];
  for (let i = 0; i < cleanWord.length; i++) {
    const char = cleanWord[i];
    if (DIACRITICS.includes(char)) {
      if (units.length > 0) {
        units[units.length - 1].diacritic = char;
      }
    } else {
      units.push({ letter: char, diacritic: '' });
    }
  }

  // Group units into syllables
  const syllables: string[] = [];
  let currentSyllable = "";

  for (let i = 0; i < units.length; i++) {
    const current = units[i];
    const next = i < units.length - 1 ? units[i + 1] : null;
    const currentStr = current.letter + current.diacritic;

    if (currentSyllable === "") {
      currentSyllable = currentStr;
    } else {
      // Sukoon or Tanween joins preceding
      if (current.diacritic === '\u0652' || ['\u064b', '\u064c', '\u064d'].includes(current.diacritic)) {
        currentSyllable += currentStr;
        syllables.push(currentSyllable);
        currentSyllable = "";
        continue;
      }

      // Mad letter without diacritic joins preceding
      const isMadLetter = ['ا', 'و', 'ي', 'ى', 'أ'].includes(current.letter);
      if (isMadLetter && current.diacritic === '') {
        currentSyllable += currentStr;
        syllables.push(currentSyllable);
        currentSyllable = "";
        continue;
      }

      // Look ahead: if next unit is Sukoon or Mad, we keep current with next
      if (next && (next.diacritic === '\u0652' || (['ا', 'و', 'ي', 'ى', 'أ'].includes(next.letter) && next.diacritic === ''))) {
        if (currentSyllable !== "") {
          syllables.push(currentSyllable);
        }
        currentSyllable = currentStr;
      } else {
        syllables.push(currentSyllable);
        currentSyllable = currentStr;
      }
    }
  }

  if (currentSyllable !== "") {
    syllables.push(currentSyllable);
  }

  return syllables.map(s => s.trim()).filter(Boolean);
}

/**
 * Normalizes Arabic text for pronunciation without breaking natural Tashkeel
 */
export function normalizeArabicTextForTTS(text: string, simplifyTanween = false): string {
  if (!text) return '';

  let normalized = text.trim();

  // Only replace Tanween if explicitly requested, otherwise keep original Tashkeel for natural pronunciation
  if (simplifyTanween) {
    normalized = normalized.replace(/اً/g, 'َنْ');
    normalized = normalized.replace(/ًا/g, 'َنْ');
    normalized = normalized.replace(/ً/g, 'َنْ');
    normalized = normalized.replace(/ٌ/g, 'ُنْ');
    normalized = normalized.replace(/ٍ/g, 'ِنْ');
  }

  // Remove distracting symbols while keeping full Arabic letters and diacritics
  normalized = normalized.replace(/[\(\)\[\]\{\}\"\'\-_]/g, ' ');
  normalized = normalized.replace(/\s+/g, ' ');

  return normalized;
}

import { Howl, Howler } from 'howler';

// Store the current Howl instance so we can stop it or track progress
let currentHowl: Howl | null = null;
let progressReqId: number | null = null;

/**
 * Helper to pause execution
 */
function sleep(ms: number): Promise<void> {
  return new Promise(r => setTimeout(r, ms));
}

/**
 * Converts PCM base64 string to a proper WAV data URI that Howler can play,
 * or plays standard formats directly.
 */
function pcmToWavDataUri(base64Data: string, sampleRate: number): string {
  const binaryStr = atob(base64Data);
  const len = binaryStr.length;
  const pcmData = new Int16Array(len / 2);
  let offset = 0;
  for (let i = 0; i < len; i += 2) {
    const low = binaryStr.charCodeAt(i);
    const high = binaryStr.charCodeAt(i + 1);
    pcmData[offset++] = (high << 8) | low;
  }

  // Create WAV header
  const numChannels = 1;
  const byteRate = sampleRate * numChannels * 2;
  const blockAlign = numChannels * 2;
  const dataSize = pcmData.length * 2;
  const buffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(buffer);

  const writeString = (pos: number, str: string) => {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(pos + i, str.charCodeAt(i));
    }
  };

  writeString(0, 'RIFF');
  view.setUint32(4, 36 + dataSize, true);
  writeString(8, 'WAVE');
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true); // PCM format
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, 16, true); // 16-bit
  writeString(36, 'data');
  view.setUint32(40, dataSize, true);

  // Write PCM data
  let pos = 44;
  for (let i = 0; i < pcmData.length; i++) {
    view.setInt16(pos, pcmData[i], true);
    pos += 2;
  }

  // Convert back to Base64
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode.apply(null, Array.from(bytes.subarray(i, i + chunk)));
  }
  return 'data:audio/wav;base64,' + btoa(binary);
}

/**
 * Plays base64 PCM 16-bit 24kHz or standard Audio Blob using Howler.js
 */
async function playBase64Audio(
  base64Data: string, 
  mimeType: string = "audio/pcm;rate=24000", 
  sampleRate: number = 24000
): Promise<boolean> {
  return new Promise((resolve) => {
    try {
      stopAudio();

      let srcUri = '';
      // Check if it's raw PCM
      if (mimeType.includes("pcm") || mimeType.includes("raw")) {
        srcUri = pcmToWavDataUri(base64Data, sampleRate);
      } else {
        // Standard formats
        srcUri = `data:${mimeType};base64,${base64Data}`;
      }

      currentHowl = new Howl({
        src: [srcUri],
        format: ['wav', 'mp3', 'webm'],
        html5: false, // Ensure we use Web Audio API for better timing
        onplay: () => {
          // Track progress
          const trackProgress = () => {
            if (currentHowl && currentHowl.playing()) {
              const seek = currentHowl.seek() as number;
              const duration = currentHowl.duration();
              const progress = duration > 0 ? seek / duration : 0;
              window.dispatchEvent(new CustomEvent('ibn_sinai_audio_progress', { detail: progress }));
              progressReqId = requestAnimationFrame(trackProgress);
            }
          };
          progressReqId = requestAnimationFrame(trackProgress);
        },
        onend: () => {
          if (progressReqId) cancelAnimationFrame(progressReqId);
          window.dispatchEvent(new CustomEvent('ibn_sinai_audio_progress', { detail: 1 })); // complete
          setTimeout(() => {
            window.dispatchEvent(new CustomEvent('ibn_sinai_audio_progress', { detail: 0 })); // reset
          }, 200);
          currentHowl = null;
          resolve(true);
        },
        onloaderror: (id, err) => {
          console.warn("Howler load error:", err);
          if (progressReqId) cancelAnimationFrame(progressReqId);
          currentHowl = null;
          resolve(false);
        },
        onplayerror: (id, err) => {
          console.warn("Howler play error:", err);
          if (progressReqId) cancelAnimationFrame(progressReqId);
          currentHowl = null;
          resolve(false);
        }
      });

      currentHowl.play();
    } catch (e) {
      console.warn("Base64 Audio Playback error:", e);
      if (progressReqId) cancelAnimationFrame(progressReqId);
      resolve(false);
    }
  });
}

/**
 * Finds the best matching Arabic voice for the selected persona
 */
function findBestArabicVoice(persona: VoicePersona, userVoiceName?: string): SpeechSynthesisVoice | undefined {
  if (!synth) return undefined;
  
  if (cachedVoices.length === 0) {
    cachedVoices = synth.getVoices() || [];
  }

  const allVoices = cachedVoices;
  const arabicVoices = allVoices.filter(v => v.lang && (v.lang.toLowerCase().startsWith('ar') || v.name.toLowerCase().includes('arabic')));

  if (userVoiceName) {
    const userVoice = allVoices.find(v => v.name === userVoiceName);
    if (userVoice) return userVoice;
  }

  if (arabicVoices.length > 0) {
    if (persona === 'child') {
      // Prefer female or high clarity Arabic voices
      const childMatch = arabicVoices.find(v => 
        /laila|mariam|zariyah|hoda|salma|zeina|shatha|female/i.test(v.name)
      );
      if (childMatch) return childMatch;
    } else {
      // Teacher voice: prefer articulate natural voice
      const teacherMatch = arabicVoices.find(v => 
        /maged|majed|tariq|tarik|naayf|hamed|shakir|laila|google/i.test(v.name)
      );
      if (teacherMatch) return teacherMatch;
    }
    return arabicVoices[0];
  }

  // If no Arabic voice found, find any voice supporting Arabic or default
  return allVoices.find(v => v.lang.startsWith('ar')) || allVoices[0];
}

/**
 * Robust Web Speech Synthesis with explicit persona frequency tuning
 */
function speakSingleUtteranceFallback(
  text: string, 
  settings: AudioEngineSettings, 
  options: { rate?: number; pitch?: number; persona?: VoicePersona } = {}
): Promise<boolean> {
  return new Promise(async (resolve) => {
    if (!synth) {
      resolve(false);
      return;
    }

    try {
      // Small pause to allow previous cancel to settle across Chromium / WebKit
      await sleep(35);

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ar-SA';
      
      const currentPersona = options.persona || settings.voicePersona || 'teacher';

      // 1. Calculate effective rate
      let effectiveRate = options.rate !== undefined 
        ? options.rate 
        : (settings.rate || PERSONA_INFO[currentPersona].defaultRate);

      // 2. Calculate effective pitch
      let effectivePitch = options.pitch !== undefined 
        ? options.pitch 
        : (currentPersona === 'child' ? 1.55 : 1.0);

      // Apply settings pitch multiplier
      if (settings.pitch && options.pitch === undefined) {
        effectivePitch = (currentPersona === 'child' ? 1.55 : 1.0) * settings.pitch;
      }

      utterance.rate = Math.min(1.8, Math.max(0.4, effectiveRate));
      utterance.pitch = Math.min(2.0, Math.max(0.5, effectivePitch));

      const voice = findBestArabicVoice(currentPersona, settings.voiceName);
      if (voice) {
        utterance.voice = voice;
      }

      utterance.onend = () => resolve(true);
      utterance.onerror = () => resolve(false);

      synth.speak(utterance);
    } catch (e) {
      resolve(false);
    }
  });
}

let audioPrefetchContext: string[] = [];

/**
 * Sets the current context of words for prefetching.
 * Called by page renderers when mounting a new page.
 */
export function setAudioPrefetchContext(words: string[]) {
  audioPrefetchContext = words.map(w => normalizeArabicTextForTTS(w, false));
}

/**
 * Primary Arabic Audio Player:
 * 1. Default: Smooth, continuous, fluent natural pronunciation of full words and sentences in a single utterance.
 * 2. Syllable-by-syllable segmentation is only triggered if explicitly passed (options.segmented === true).
 */
export async function playArabicAudio(
  text: string, 
  options: { 
    rate?: number; 
    pitch?: number; 
    onEnd?: () => void; 
    onSyllable?: (syllable: string, index: number, total: number) => void;
    segmented?: boolean;
    persona?: VoicePersona;
    forceFallback?: boolean;
  } = {}
): Promise<boolean> {
  const settings = getAudioSettings();
  const persona: VoicePersona = options.persona || settings.voicePersona || 'teacher';
  // Segmented spelling is only applied if explicitly requested in options
  const useSegmented = options.segmented === true;
  const useTanween = settings.tanweenSimplification;
  const cleanText = normalizeArabicTextForTTS(text, useTanween);

  // Pre-fetching the next word in the current page context
  const currentIndex = audioPrefetchContext.indexOf(cleanText);
  if (currentIndex >= 0 && currentIndex < audioPrefetchContext.length - 1) {
    const nextWord = audioPrefetchContext[currentIndex + 1];
    // Start prefetching in background
    prefetchAudio(nextWord, { persona, segmented: useSegmented });
  }

  stopAudio();

  // 1. Check local persistent IndexedDB cache (0ms instant playback)
  if (!options.forceFallback) {
    try {
      const cached = await getCachedAudio(cleanText, persona, useSegmented);
      if (cached && cached.audioBase64) {
        const played = await playBase64Audio(cached.audioBase64, cached.mimeType, cached.sampleRate);
        if (played) {
          if (options.onEnd) options.onEnd();
          return true;
        }
      }
    } catch (e) {
      console.warn("Cache lookup error:", e);
    }

    // 2. If not in cache, try calling the server-side Gemini AI TTS API
    try {
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: cleanText,
          persona: persona,
          segmented: useSegmented
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.audioBase64) {
          await saveCachedAudio(
            cleanText, 
            persona, 
            useSegmented, 
            data.audioBase64, 
            data.mimeType || "audio/pcm;rate=24000", 
            data.sampleRate || 24000,
            'gemini_tts'
          );

          const played = await playBase64Audio(data.audioBase64, data.mimeType, data.sampleRate);
          if (played) {
            if (options.onEnd) options.onEnd();
            return true;
          }
        }
      }
    } catch (e) {
      // Seamlessly fallback to native Arabic browser speech
    }
  }

  // 3. In-Browser Natural Arabic Speech Engine (Crisp, human pronunciation with voice persona tuning)
  try {
    if (useSegmented) {
      const words = text.trim().split(/\s+/);
      
      for (let w = 0; w < words.length; w++) {
        const word = words[w];
        const syllables = splitArabicIntoSyllables(word);

        for (let s = 0; s < syllables.length; s++) {
          const syllable = syllables[s];
          if (options.onSyllable) {
            options.onSyllable(syllable, s, syllables.length);
          }
          await speakSingleUtteranceFallback(syllable, settings, {
            rate: options.rate,
            pitch: options.pitch,
            persona: persona
          });
          
          if (s < syllables.length - 1) {
            await sleep(250);
          }
        }

        if (w < words.length - 1) {
          await sleep(400);
        }
      }

      if (options.onEnd) options.onEnd();
      return true;
    } else {
      // Standard continuous reading - full word/sentence in one natural fluent utterance
      const success = await speakSingleUtteranceFallback(cleanText, settings, {
        rate: options.rate,
        pitch: options.pitch,
        persona: persona
      });
      if (options.onEnd) options.onEnd();
      return success;
    }
  } catch (e) {
    console.warn('Speech synthesis fallback error:', e);
    return false;
  }
}

/**
 * Pre-fetches audio for a given text and persona and caches it.
 * This is useful for preloading the next word on a page.
 */
export async function prefetchAudio(
  text: string,
  options: {
    persona?: VoicePersona;
    segmented?: boolean;
  } = {}
): Promise<void> {
  const settings = getAudioSettings();
  const persona: VoicePersona = options.persona || settings.voicePersona || 'teacher';
  const useSegmented = options.segmented === true;
  const cleanText = normalizeArabicTextForTTS(text, settings.tanweenSimplification);

  try {
    // Check if it's already cached
    const cached = await getCachedAudio(cleanText, persona, useSegmented);
    if (cached) return; // Already cached, no need to prefetch

    // Not cached, so fetch from API
    const response = await fetch('/api/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: cleanText,
        persona: persona,
        segmented: useSegmented
      })
    });

    if (response.ok) {
      const data = await response.json();
      if (data.audioBase64) {
        await saveCachedAudio(
          cleanText,
          persona,
          useSegmented,
          data.audioBase64,
          data.mimeType || "audio/pcm;rate=24000",
          data.sampleRate || 24000,
          'gemini_tts'
        );
      }
    }
  } catch (e) {
    // Fail silently in background
  }
}

/**
 * Stops all audio currently playing
 */
export function stopAudio() {
  if (currentHowl) {
    try {
      currentHowl.stop();
      currentHowl.unload();
    } catch (e) {}
    currentHowl = null;
  }
  if (progressReqId) {
    cancelAnimationFrame(progressReqId);
    progressReqId = null;
    window.dispatchEvent(new CustomEvent('ibn_sinai_audio_progress', { detail: 0 }));
  }
  if (synth) {
    synth.cancel();
  }
}
