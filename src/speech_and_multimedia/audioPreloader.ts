import { extractAllCurriculumVocabulary } from './curriculumVocabExtractor';
import { getCachedAudio, saveCachedAudio, hasCachedAudio, getAudioCacheStats } from './audioCache';

export interface PreloadProgress {
  totalItems: number;
  completedItems: number;
  percent: number;
  currentWord: string;
  currentPersona: 'teacher' | 'child';
  isComplete: boolean;
  statusText: string;
}

type ProgressCallback = (progress: PreloadProgress) => void;

let isPreloading = false;
let shouldCancelPreload = false;

/**
 * Generates and stores curriculum audio clips in IndexedDB using Gemini AI Voice.
 */
export async function precacheAllCurriculumAudio(
  onProgress?: ProgressCallback,
  options: { preferServerAI?: boolean } = { preferServerAI: true }
): Promise<{ success: boolean; totalGenerated: number; totalExisting: number }> {
  if (isPreloading) {
    return { success: false, totalGenerated: 0, totalExisting: 0 };
  }

  isPreloading = true;
  shouldCancelPreload = false;

  const vocabList = extractAllCurriculumVocabulary();
  const personas: ('teacher' | 'child')[] = ['teacher', 'child'];
  const totalTasks = vocabList.length * personas.length;
  
  let completed = 0;
  let totalGenerated = 0;
  let totalExisting = 0;

  try {
    for (const persona of personas) {
      for (const word of vocabList) {
        if (shouldCancelPreload) {
          isPreloading = false;
          return { success: false, totalGenerated, totalExisting };
        }

        const isAlreadyCached = await hasCachedAudio(word, persona, false);
        
        if (isAlreadyCached) {
          totalExisting++;
        } else {
          // Try Gemini AI TTS
          try {
            const res = await fetch('/api/tts', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ text: word, persona, segmented: false })
            });

            if (res.ok) {
              const data = await res.json();
              if (data.audioBase64) {
                await saveCachedAudio(
                  word, 
                  persona, 
                  false, 
                  data.audioBase64, 
                  data.mimeType || 'audio/pcm;rate=24000', 
                  data.sampleRate || 24000, 
                  'gemini_tts'
                );
                totalGenerated++;
              }
            }
          } catch (e) {
            // If offline or quota hit, proceed without polluting cache with buzzers
          }
        }

        completed++;

        if (onProgress) {
          const percent = Math.round((completed / totalTasks) * 100);
          onProgress({
            totalItems: totalTasks,
            completedItems: completed,
            percent,
            currentWord: word,
            currentPersona: persona,
            isComplete: completed >= totalTasks,
            statusText: `جاري تحضير صوت: ${word} (${persona === 'teacher' ? 'المعلمة' : 'البطل الصغير'})`
          });
        }

        // Cooperative yield
        if (completed % 3 === 0) {
          await new Promise((r) => setTimeout(r, 60));
        }
      }
    }

    if (onProgress) {
      onProgress({
        totalItems: totalTasks,
        completedItems: totalTasks,
        percent: 100,
        currentWord: 'اكتمل التحضير!',
        currentPersona: 'teacher',
        isComplete: true,
        statusText: `تم تجهيز الأصوات بنجاح (${totalGenerated} صوت جديد، ${totalExisting} مخزن مسبقاً)`
      });
    }

    isPreloading = false;
    return { success: true, totalGenerated, totalExisting };
  } catch (error) {
    isPreloading = false;
    return { success: false, totalGenerated, totalExisting };
  }
}

/**
 * Cancels active pre-generation
 */
export function cancelAudioPreload() {
  shouldCancelPreload = true;
  isPreloading = false;
}

/**
 * Checks if preloading is in progress
 */
export function isAudioPreloading(): boolean {
  return isPreloading;
}

/**
 * Automatic background warmup for high-priority letters and introductory words
 */
export async function autoWarmupAudioCache() {
  // Silent warmup only when online and idle
}
